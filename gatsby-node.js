// This param is used when `/[tutorials, how-to-guides]/` are then redirected to
// `/[tutorials, how-to-guides]/<defaultVersion>/`.
const defaultVersion = 'v3'

const redirects = [
  { fromPath: '/tutorials/', toPath: `/tutorials/${defaultVersion}/` },
  { fromPath: '/how-to-guides/', toPath: `/how-to-guides/${defaultVersion}/` },
  { fromPath: '/v3/', toPath: '/v3/getting-started/overview/' },
  { fromPath: '/v3/getting-started/', toPath: '/v3/getting-started/overview/' },
  { fromPath: '/v3/concepts/', toPath: '/v3/concepts/runtime/' },
  { fromPath: '/v3/runtime/', toPath: '/v3/runtime/frame/' },
  { fromPath: '/v3/integration/', toPath: '/v3/integration/polkadot-js/' },
  { fromPath: '/v3/advanced/', toPath: '/v3/advanced/account-info/' },
  { fromPath: '/tutorials/v3/kitties/', toPath: `/tutorials/v3/kitties/pt1/` },
  {
    fromPath: '/tutorials/v3/cumulus/',
    toPath: `/tutorials/v3/cumulus/start-relay/`,
  },
  {
    fromPath: '/how-to-guides/basics/',
    toPath: `/how-to-guides/v3/basics/pallet-integration/`,
  },
  {
    fromPath: '/how-to-guides/pallet-design/',
    toPath: `/how-to-guides/v3/pallet-design/contracts-pallet/`,
  },
  {
    fromPath: '/how-to-guides/weights/',
    toPath: `/how-to-guides/v3/weights/calculate-fees/`,
  },
  {
    fromPath: '/how-to-guides/testing/',
    toPath: `/how-to-guides/v3/testing/basics/`,
  },
  {
    fromPath: '/how-to-guides/storage-migrations/',
    toPath: `/how-to-guides/v3/storage-migrations/basics/`,
  },
  {
    fromPath: '/how-to-guides/consensus/',
    toPath: `/how-to-guides/v3/consensus/pow/`,
  },
  {
    fromPath: '/how-to-guides/parachains/',
    toPath: `/how-to-guides/v3/parachains/connect/`,
  },
  {
    fromPath: '/how-to-guides/tools/',
    toPath: `/how-to-guides/v3/tools/try-runtime/`,
  },
]

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage, createRedirect } = actions

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

  const allDocs = data.allMdx.edges.filter(each => each.node.frontmatter.section === 'docs')
  const allHtgs = data.allMdx.edges.filter(
    each => each.node.frontmatter.section === 'how to guides'
  )
  const allTuts = data.allMdx.edges.filter(each => each.node.frontmatter.section === 'tutorials')

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

  // -- Create Redirect --
  redirects.forEach(({ fromPath, toPath }) => {
    createRedirect({
      fromPath,
      toPath,
      isPermanent: true,
      redirectInBrowser: true,
      force: true,
      statusCode: 301,
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
    const locale = node.fields.locale
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
      locale,
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
