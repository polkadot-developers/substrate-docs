/* eslint-disable @typescript-eslint/no-var-requires */
const { createPageRedirects } = require('./gatsby-node/create-redirects.js')

const {
  createDocPages,
  createHowToGuidePages,
  createTutorialPages,
} = require('./gatsby-node/create-pages.js')

exports.createPages = async props => {
  createPageRedirects(props)
  await Promise.all([createDocPages(props)])
  await Promise.all([createHowToGuidePages(props)])
  await Promise.all([createTutorialPages(props)])
}

const { addSlugFieldToMarkdown } = require('./gatsby-node/on-create-node.js')

exports.onCreateNode = props => {
  const { node } = props
  if (node.internal.type === `MarkdownRemark`) {
    addSlugFieldToMarkdown(props)
  }
}

const { createMdxResolvers } = require('./gatsby-node/create-resolvers.js')

exports.createResolvers = props => {
  createMdxResolvers(props)
}
