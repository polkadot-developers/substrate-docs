// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

/*
   Notes:
   - all graphql function call returns a Promise
 */

const createDocsPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "//(content)/(docs)/" } }
      ) {
        edges {
          node {
            fileAbsolutePath
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  if (!result || !result.data) return

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const { slug } = node.fields
    const { dir } = path.parse(node.fileAbsolutePath)
    const basePath = '/content/docs/'
    const relativePath = dir.split(basePath)[1]
    const fullPath = relativePath != slug ? `${relativePath}/` + slug : slug

    createPage({
      path: `/${fullPath}/`,
      component: path.resolve(`./src/templates/docs-single.js`),
      context: {
        relativePath,
        slug,
      },
    })
  })
}

module.exports = {
  createDocsPages,
}
