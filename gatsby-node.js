exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const kbTemplate = require.resolve(`./src/templates/kb-template.tsx`)
  const htgTemplate = require.resolve(`./src/templates/htg-template.tsx`)
  const tutorialOneTemplate = require.resolve(
    `./src/templates/tut-templates/create-your-first-substrate-chain.tsx`
  )

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
      tutorialOne: allFile(
        filter: {
          sourceInstanceName: { eq: "create-your-first-substrate-chain" }
        }
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

  const tutorialOne = result.data.tutorialOne.nodes
  tutorialOne.forEach(({ childMdx: node }) => {
    createPage({
      path: `${node.frontmatter.slug}`,
      component: tutorialOneTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `3.0`,
      },
    })
  })
}
