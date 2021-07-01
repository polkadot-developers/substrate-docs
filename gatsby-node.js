exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const kbTemplate = require.resolve(`./src/templates/kb-template.tsx`)
  const tutorialOneTemplate = require.resolve(
    `./src/templates/tut-templates/create-your-first-substrate-chain.tsx`
  )

  const result = await graphql(`
    {
      docsV3: allFile(
        filter: { sourceInstanceName: { eq: "kbV3" } }
        sort: { order: DESC, fields: id }
      ) {
        nodes {
          childMdx {
            frontmatter {
              slug
              id
            }
          }
        }
      }
      tutorialOne: allFile(
        filter: {
          sourceInstanceName: { eq: "create-your-first-substrate-chain" }
        }
        sort: { order: DESC, fields: id }
      ) {
        nodes {
          childMdx {
            frontmatter {
              slug
              id
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
  allV3.forEach(({ childMdx: node }, index) => {
    createPage({
      path: `${node.frontmatter.slug}`,
      component: kbTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `3.0`,
        prev: index === 0 ? null : allV3[index - 1],
        next: index === allV3.length - 1 ? null : allV3[index + 1],
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
