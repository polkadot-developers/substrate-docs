exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const kbTemplate = require.resolve(`./src/templates/kb-template.tsx`)

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
      docsV4: allFile(
        filter: { sourceInstanceName: { eq: "kbV4" } }
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

  const allV4 = result.data.docsV4.nodes
  allV4.forEach(({ childMdx: node }) => {
    createPage({
      path: `${node.frontmatter.slug}`,
      component: kbTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
        version: `4.0`,
      },
    })
  })
}
