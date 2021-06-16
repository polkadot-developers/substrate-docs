exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const blogTemplate = require.resolve(`./src/templates/blog-template.js`)

  const result = await graphql(`
    {
      blog: allFile(filter: { sourceInstanceName: { eq: "blog" } }) {
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

  const blogPosts = result.data.blog.nodes

  blogPosts.forEach(({ childMdx: node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: blogTemplate,
      context: {
        slug: node.frontmatter.slug,
      },
    })
  })
}
