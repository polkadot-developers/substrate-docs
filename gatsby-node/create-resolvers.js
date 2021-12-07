/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable security/detect-non-literal-require */

const { GraphQLJSONObject } = require('graphql-type-json')
const { createIndexLunr } = require(`./../lunr/create-index.js`)

const createMdxResolvers = props => {
  const { cache, createResolvers } = props

  createResolvers({
    Query: {
      LunrIndex: {
        type: GraphQLJSONObject,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        resolve: (source, args, context, info) => {
          const docNodes = context.nodeModel.getAllNodes({
            type: `Mdx`,
          })
          return createIndexLunr(docNodes, cache)
        },
      },
    },
  })
}

module.exports = {
  createMdxResolvers,
}
