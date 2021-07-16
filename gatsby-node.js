exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const kbTemplate = require.resolve(`./src/templates/kb-template.tsx`)
  const htgTemplate = require.resolve(`./src/templates/htg-template.tsx`)
  const tutorialTemplate = require.resolve(`./src/templates/tut-template.tsx`)

  const result = await graphql(`
    {
      docsV3: allFile(filter: { sourceInstanceName: { eq: "kbV3" } }) {
        nodes {
          childMdx {
            frontmatter {
              slug
            }
          }
        }
      }
      htg: allFile(filter: { sourceInstanceName: { eq: "htg" } }) {
        nodes {
          childMdx {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(result.errors)
    return
  }

  const gqlTpl = `{ res: allFile(
    filter: { sourceInstanceName: { eq: ">>param1<<" }}
  ) {
    nodes {
      childMdx {
        frontmatter {
          slug
        }
      }
    }
  } }`

  const tutsInfo = [
    {
      name: 'create-your-first-substrate-chain',
      navSlug: 'firstChain',
      version: '3.0',
    },
    {
      name: 'add-a-pallet',
      navSlug: 'addPallet',
      version: '3.0',
    },
    {
      name: 'proof-of-existence',
      navSlug: 'poe',
      version: '3.0',
    },
    {
      name: 'permissioned-network',
      navSlug: 'permissionedNetwork',
      version: '3.0',
    },
    {
      name: 'forkless-upgrade',
      navSlug: 'forklessUpgrade',
      version: '3.0',
    },
    {
      name: 'private-network',
      navSlug: 'privateNetwork',
      version: '3.0',
    },
    {
      name: 'node-metrics',
      navSlug: 'nodeMetrics',
      version: '3.0',
    },
    {
      name: 'add-contracts-pallet',
      navSlug: 'addContractsPallet',
      version: '3.0',
    },
  ]

  const tutsGqlResult = await Promise.allSettled(
    tutsInfo.map(tutInfo => graphql(gqlTpl.replace('>>param1<<', tutInfo.name)))
  )

  if (tutsGqlResult.some(res => res.errors)) {
    reporter.panicOnBuild(tutsGqlResult.filter(res => res.errors))
    return
  }

  const allV3 = result.data.docsV3.nodes
  allV3.forEach(({ childMdx: node }) => {
    createPage({
      path: `${node.frontmatter.slug}`,
      component: kbTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `3.0`,
      },
    })
  })

  const htgPages = result.data.htg.nodes
  htgPages.forEach(({ childMdx: node }) => {
    createPage({
      path: `${node.frontmatter.slug}`,
      component: htgTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `3.0`,
      },
    })
  })

  tutsInfo.forEach((tutInfo, ind) => {
    const res = tutsGqlResult[`${ind}`].value.data.res.nodes
    res.forEach(({ childMdx: node }) => {
      createPage({
        path: `${node.frontmatter.slug}`,
        component: tutorialTemplate,
        context: {
          slug: `${node.frontmatter.slug}`,
          version: tutInfo.version,
          navMenuSlug: tutInfo.navSlug,
        },
      })
    })
  })
}

////////////////////////////////////////////////////////
//          Lunr Search Resolver and Indexing         //
////////////////////////////////////////////////////////

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable security/detect-non-literal-require */
const { GraphQLJSONObject } = require(`graphql-type-json`)
const striptags = require(`striptags`)
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
          const type = info.schema.getType('Mdx')
          return createIndex(docNodes, cache, type)
        },
      },
    },
  })
}

const createIndex = async (docNodes, cache, type) => {
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
    console.log(slug)
    const section = slug.split('/')[2].split('-').join(' ')
    console.log(section)
    const category = slug.split('/')[3].split('-').join(' ')
    console.log(category)
    const title = node.frontmatter.title
    const keywords = node.frontmatter.keywords

    var body
    remark()
      .use(strip)
      .process(node.rawBody, function (err, file) {
        if (err) throw err
        body = striptags(String(file))
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
