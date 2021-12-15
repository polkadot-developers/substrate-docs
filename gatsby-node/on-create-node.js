/* eslint-disable @typescript-eslint/no-var-requires */
const { createFilePath } = require('gatsby-source-filesystem')

const addSlugFieldToMarkdown = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  const filepaths = createFilePath({ node, getNode, basePath: `pages` })
    .split('/')
    .filter(pathElement => pathElement)
  const slugPath = filepaths[filepaths.length - 1]
  const slug =
    node.frontmatter && node.frontmatter.slug ? node.frontmatter.slug : slugPath
  createNodeField({
    node,
    name: `slug`,
    value: slug,
  })
}

module.exports = {
  addSlugFieldToMarkdown,
}
