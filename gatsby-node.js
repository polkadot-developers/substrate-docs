exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const kbTemplate = require.resolve(`./src/templates/kb-template.tsx`)

  const result = await graphql(`
    {
      blog: allFile(filter: { sourceInstanceName: { eq: "kb" } }) {
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

  const allKBDocs = result.data.blog.nodes

  allKBDocs.forEach(({ childMdx: node }) => {
    createPage({
      path: `${node.frontmatter.slug}`,
      component: kbTemplate,
      context: {
        slug: `${node.frontmatter.slug}`,
      },
    })
  })
}
