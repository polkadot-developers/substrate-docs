// CONSTANTS FOR VERSIONING AND REDIRECTS -------------------------------------

// NOTE: the constants are not enough on a version change! GraphQL needs an update below, see
// exports.createPages = async ({ actions, graphql, reporter }) => {...}
// and
//   const allv3 = result.data.docsv3.nodes

// Used in redirects & URLS: 
// This param is used when `/[tutorials, how-to-guides]` are then redirected to
// `/[tutorials, how-to-guides]/<defaultVersion>`.
const defaultVersion = `v3`

// Used in `tutsInfo` as a field
const substrateVersion = `3.0.0`
const frontierVersion = `3.0.0`
const inkVersion = `3.0.0`
const cumulusVersion = `polkadot-v0.9.10`

// ----------------------------------------------------------------------------



const redirects = [
  { fromPath: `/tutorials`, toPath: `/tutorials/${defaultVersion}` },
  { fromPath: `/how-to-guides`, toPath: `/how-to-guides/${defaultVersion}` },
  { fromPath: `/${defaultVersion}`, toPath: `/${defaultVersion}/getting-started/overview` },
  { fromPath: `/${defaultVersion}/getting-started`, toPath: `/${defaultVersion}/getting-started/overview` },
  { fromPath: `/${defaultVersion}/concepts`, toPath: `/${defaultVersion}/concepts/runtime` },
  { fromPath: `/${defaultVersion}/runtime`, toPath: `/${defaultVersion}/runtime/frame` },
  { fromPath: `/${defaultVersion}/integration`, toPath: `/${defaultVersion}/integration/polkadot-js` },
  { fromPath: `/${defaultVersion}/advanced`, toPath: `/${defaultVersion}/advanced/account-info` },
  { fromPath: `/tutorials/${defaultVersion}/kitties`, toPath: `/tutorials/${defaultVersion}/kitties/pt1` },
  { fromPath: `/tutorials/${defaultVersion}/cumulus`, toPath: `/tutorials/${defaultVersion}/cumulus/start-relay` },
  { fromPath: `/tutorials/${defaultVersion}/ink-workshop`, toPath: `/tutorials/${defaultVersion}/ink-workshop/pt1` },
  {
    fromPath: `/how-to-guides/basics`,
    toPath: `/how-to-guides/${defaultVersion}/basics/pallet-integration`,
  },
  {
    fromPath: `/how-to-guides/pallet-design`,
    toPath: `/how-to-guides/${defaultVersion}/pallet-design/contracts-pallet`,
  },
  {
    fromPath: `/how-to-guides/weights`,
    toPath: `/how-to-guides/${defaultVersion}/weights/calculate-fees`,
  },
  {
    fromPath: `/how-to-guides/testing`,
    toPath: `/how-to-guides/${defaultVersion}/testing/basics`,
  },
  {
    fromPath: `/how-to-guides/storage-migrations`,
    toPath: `/how-to-guides/${defaultVersion}/storage-migrations/basics`,
  },
  {
    fromPath: `/how-to-guides/consensus`,
    toPath: `/how-to-guides/${defaultVersion}/consensus/pow`,
  },
  {
    fromPath: `/how-to-guides/parachains`,
    toPath: `/how-to-guides/${defaultVersion}/parachains/connect`,
  },
  {
    fromPath: `/how-to-guides/tools`,
    toPath: `/how-to-guides/${defaultVersion}/tools/try-runtime`,
  },
]

const tutsInfo = [
  {
    name: `create-your-first-substrate-chain`,
    navSlug: `firstChain`,
    version: `${substrateVersion}`,
  },
  {
    name: `add-a-pallet`,
    navSlug: `addPallet`,
    version: `${substrateVersion}`,
  },
  {
    name: `proof-of-existence`,
    navSlug: `poe`,
    version: `${substrateVersion}`,
  },
  {
    name: `permissioned-network`,
    navSlug: `permissionedNetwork`,
    version: `${substrateVersion}`,
  },
  {
    name: `forkless-upgrades`,
    navSlug: `forklessUpgrades`,
    version: `${substrateVersion}`,
  },
  {
    name: `private-network`,
    navSlug: `privateNetwork`,
    version: `${substrateVersion}`,
  },
  {
    name: `node-metrics`,
    navSlug: `nodeMetrics`,
    version: `${substrateVersion}`,
  },
  {
    name: `ink-workshop`,
    navSlug: `inkWorkshop`,
    version: `${inkVersion}`,
  },
  {
    name: `cumulus`,
    navSlug: `cumulusTutorial`,
    version: `${cumulusVersion}`,
  },
  {
    name: `frontier`,
    navSlug: `frontierWorkshop`,
    version: `${frontierVersion}`,
  },
  {
    name: `kitties`,
    navSlug: `kittiesWorkshop`,
    version: `${substrateVersion}`,
  },
]

const gqlTpl = `{ res: allFile(
  filter: { sourceInstanceName: { eq: ">>param1<<" }, extension: { eq: "mdx" }}
) {
  nodes {
    childMdx {
      frontmatter {
        slug
      }
    }
  }
} }`

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage, createRedirect } = actions

  const kbTemplate = require.resolve(`./src/templates/kb-template.tsx`)
  const htgTemplate = require.resolve(`./src/templates/htg-template.tsx`)
  const tutorialTemplate = require.resolve(`./src/templates/tut-template.tsx`)

  const result = await graphql(`
    {
      docsv3: allFile(
        filter: { sourceInstanceName: { eq: "kbv3" }, extension: { eq: "mdx" } }
      ) {
        nodes {
          childMdx {
            frontmatter {
              slug
            }
          }
        }
      }
      htg: allFile(
        filter: { sourceInstanceName: { eq: "htg" }, extension: { eq: "mdx" } }
      ) {
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

  const tutsGqlResult = await Promise.allSettled(
    tutsInfo.map(tutInfo => graphql(gqlTpl.replace(`>>param1<<`, tutInfo.name)))
  )

  if (tutsGqlResult.some(res => res.errors)) {
    reporter.panicOnBuild(tutsGqlResult.filter(res => res.errors))
    return
  }

  const allv3 = result.data.docsv3.nodes
  allv3s.forEach(({ childMdx: node }) => {
    createPage({
      path: `${node.frontmatter.slug}`,
      component: kbTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `${substrateVersion}`,
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
        version: `${substrateVersion}`,
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
const remark = require(`remark`)
const strip = require(`strip-markdown`)

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
    console.log(`Updating Lunr Search Index`)
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
