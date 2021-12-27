// eslint-disable-next-line @typescript-eslint/no-var-requires
const $path = require('path')

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
              path
              slug
            }
          }
        }
      }
    }
  `)
  if (!result || !result.data) return

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const { path, slug } = node.fields
    /* folder data collection eg: `main-docs` */
    const [collection] = path.split('/').filter(pathElement => pathElement)

    createPage({
      path,
      component: $path.resolve(`./src/templates/docs-single.js`),
      context: {
        collection,
        pagePath: path,
        slug,
      },
    })
  })
}

module.exports = {
  createDocsPages,
}
