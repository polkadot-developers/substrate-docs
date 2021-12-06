// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createPageRedirects } = require('./gatsby-node/create-redirects.js')

exports.createPages = async props => {
  createPageRedirects(props)

  const { actions, graphql, reporter } = props
  const { createPage } = actions

  const docTemplate = require.resolve(`./src/templates/doc-template.tsx`)
  const htgTemplate = require.resolve(`./src/templates/htg-template.tsx`)
  const tutorialTemplate = require.resolve(`./src/templates/tut-template.tsx`)

  const { data } = await graphql(`
    {
      allMdx {
        edges {
          node {
            frontmatter {
              slug
              section
            }
          }
        }
      }
    }
  `)

  if (data.errors) {
    reporter.panicOnBuild(data.errors)
    return
  }

  const allDocs = data.allMdx.edges.filter(
    each => each.node.frontmatter.section === 'docs'
  )
  const allHtgs = data.allMdx.edges.filter(
    each => each.node.frontmatter.section === 'how to guides'
  )
  const allTuts = data.allMdx.edges.filter(
    each => each.node.frontmatter.section === 'tutorials'
  )

  allDocs.forEach(({ node }) => {
    createPage({
      path: `${node.frontmatter.slug}/`,
      component: docTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `3.0`,
      },
    })
  })

  allHtgs.forEach(({ node }) => {
    createPage({
      path: `${node.frontmatter.slug}/`,
      component: htgTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `3.0`,
      },
    })
  })

  allTuts.forEach(({ node }) => {
    createPage({
      path: `${node.frontmatter.slug}/`,
      component: tutorialTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `3.0`,
      },
    })
  })
}

////////////////////////////////////////////////////////
//          Lunr Search Resolver and Indexing         //
////////////////////////////////////////////////////////

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable security/detect-non-literal-require */
const { GraphQLJSONObject } = require(`graphql-type-json`)
const lunr = require(`lunr`)
const remark = require('remark')
const strip = require('strip-markdown')

exports.createResolvers = ({ cache, createResolvers }) => {
  createResolvers({
    Query: {
      LunrIndex: {
        type: GraphQLJSONObject,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        resolve: (source, args, context, info) => {
          const docNodes = context.nodeModel.getAllNodes({
            type: `Mdx`,
          })
          return createIndex(docNodes, cache)
        },
      },
    },
  })
}

const createIndex = async (docNodes, cache) => {
  const cacheKey = `IndexLunr`
  const cached = await cache.get(cacheKey)
  if (cached) {
    return cached
  }
  const documents = []
  const store = {}

  for (const node of docNodes) {
    const slug = node.frontmatter.slug
    const section = node.frontmatter.section
    const category = node.frontmatter.category
    const title = node.frontmatter.title
    const keywords = node.frontmatter.keywords

    var body
    remark()
      .use(strip)
      .process(node.rawBody, function (err, file) {
        if (err) throw err
        body = file
      })
    documents.push({
      slug: slug,
      title: title,
      section: section,
      category: category,
      keywords: keywords,
      content: body,
    })
    // eslint-disable-next-line security/detect-object-injection
    store[slug] = {
      title,
      section,
      category,
      keywords,
    }
  }
  const index = lunr(function () {
    console.log('Updating Lunr Search Index')
    this.ref(`slug`)
    this.field(`title`)
    this.field(`section`)
    this.field(`category`)
    this.field(`keywords`)
    this.field(`content`)

    for (const doc of documents) {
      this.add(doc)
    }
  })
  const json = { index: index.toJSON(), store }
  await cache.set(cacheKey, json)
  return json
}
////////////////////////////////////////////////////////
