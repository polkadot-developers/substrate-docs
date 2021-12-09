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

const { createMdxResolvers } = require('./gatsby-node/create-resolvers.js')

exports.createResolvers = props => {
  createMdxResolvers(props)
}
