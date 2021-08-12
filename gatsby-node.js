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
    name: 'ink-workshop',
    navSlug: 'inkWorkshop',
    version: '3.0',
  },
]

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
