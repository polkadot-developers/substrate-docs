/* eslint-disable @typescript-eslint/no-var-requires */
const { createFilePath } = require('gatsby-source-filesystem')

const addSlugFieldToMarkdown = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  const filepaths = createFilePath({ node, getNode, basePath: `` })
    .split('/')
    .filter(pathElement => pathElement)
  const slug = filepaths[filepaths.length - 1]
  createNodeField({
    node,
    name: `slug`,
    value: slug,
  })
}

const addPathFieldToMarkdown = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  const path = createFilePath({ node, getNode, basePath: `docs` })
  createNodeField({
    node,
    name: `path`,
    value: path,
  })
}

const { fmImagesToRelative } = require('gatsby-remark-relative-source')

const convertFmImagesToRelative = ({ node }) => {
  fmImagesToRelative(node)
}

module.exports = {
  addSlugFieldToMarkdown,
  addPathFieldToMarkdown,
  convertFmImagesToRelative,
}
