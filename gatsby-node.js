exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const kbTemplate = require.resolve(`./src/templates/kb-template.tsx`)
  const htgTemplate = require.resolve(`./src/templates/htg-template.tsx`)
  const tutorialOneTemplate = require.resolve(
    `./src/templates/tut-templates/create-your-first-substrate-chain.tsx`
  )
  const tutorialTwoTemplate = require.resolve(
    `./src/templates/tut-templates/proof-of-existence.tsx`
  )
  const tutorialThreeTemplate = require.resolve(
    `./src/templates/tut-templates/permissioned-network.tsx`
  )
  const tutorialFourTemplate = require.resolve(
    `./src/templates/tut-templates/forkless-upgrade.tsx`
  )
  const tutorialFiveTemplate = require.resolve(
    `./src/templates/tut-templates/private-network.tsx`
  )
  const tutorialSixTemplate = require.resolve(
    `./src/templates/tut-templates/node-metrics.tsx`
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
      tutorialTwo: allFile(
        filter: { sourceInstanceName: { eq: "proof-of-existence" } }
      ) {
        nodes {
          childMdx {
            frontmatter {
              slug
            }
          }
        }
      }
      tutorialThree: allFile(
        filter: { sourceInstanceName: { eq: "permissioned-network" } }
      ) {
        nodes {
          childMdx {
            frontmatter {
              slug
            }
          }
        }
      }
      tutorialFour: allFile(
        filter: { sourceInstanceName: { eq: "forkless-upgrade" } }
      ) {
        nodes {
          childMdx {
            frontmatter {
              slug
            }
          }
        }
      }
      tutorialFive: allFile(
        filter: { sourceInstanceName: { eq: "private-network" } }
      ) {
        nodes {
          childMdx {
            frontmatter {
              slug
            }
          }
        }
      }
      tutorialSix: allFile(
        filter: { sourceInstanceName: { eq: "node-metrics" } }
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

  const tutorialTwo = result.data.tutorialTwo.nodes
  tutorialTwo.forEach(({ childMdx: node }) => {
    createPage({
      path: `${node.frontmatter.slug}`,
      component: tutorialTwoTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `3.0`,
      },
    })
  })

  const tutorialThree = result.data.tutorialThree.nodes
  tutorialThree.forEach(({ childMdx: node }) => {
    createPage({
      path: `${node.frontmatter.slug}`,
      component: tutorialThreeTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `3.0`,
      },
    })
  })
  const tutorialFour = result.data.tutorialFour.nodes
  tutorialFour.forEach(({ childMdx: node }) => {
    createPage({
      path: `${node.frontmatter.slug}`,
      component: tutorialFourTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `3.0`,
      },
    })
  })
  const tutorialFive = result.data.tutorialFive.nodes
  tutorialFive.forEach(({ childMdx: node }) => {
    createPage({
      path: `${node.frontmatter.slug}`,
      component: tutorialFiveTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `3.0`,
      },
    })
  })
  const tutorialSix = result.data.tutorialSix.nodes
  tutorialSix.forEach(({ childMdx: node }) => {
    createPage({
      path: `${node.frontmatter.slug}`,
      component: tutorialSixTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `3.0`,
      },
    })
  })
}
