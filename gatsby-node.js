/* eslint-disable */
const { createPageRedirects } = require('./gatsby-node/create-redirects.js');

const { createDocsPages } = require('./gatsby-node/create-pages.js');

exports.createPages = async props => {
  createPageRedirects(props);
  await Promise.all([createDocsPages(props)]);
};

const { addSlugFieldToMarkdown, addPathFieldToMarkdown } = require('./gatsby-node/on-create-node.js');

exports.onCreateNode = props => {
  const { node } = props;
  if (node.internal.type === `MarkdownRemark`) {
    addSlugFieldToMarkdown(props);
    addPathFieldToMarkdown(props);
  }
};

const { GraphQLJSONObject } = require(`graphql-type-json`)
const striptags = require(`striptags`)
const lunr = require(`lunr`)

exports.createResolvers = ({ cache, createResolvers }) => {
  createResolvers({
    Query: {
      LunrIndex: {
        type: GraphQLJSONObject,
        resolve: (source, args, context, info) => {
          const markdownNodes = context.nodeModel.getAllNodes({
            type: `MarkdownRemark`,
          })
          const type = info.schema.getType(`MarkdownRemark`)
          return createIndex(markdownNodes, type, cache)
        },
      },
    },
  })
}
const createIndex = async (markdownNodes, type, cache) => {
  const cacheKey = `IndexLunr`
  const cached = await cache.get(cacheKey)
  if (cached) {
    return cached
  }
  const documents = []
  const store = {}
  for (const node of markdownNodes) {
    const {path} = node.fields
    const title = node.frontmatter.title
    const [html, excerpt] = await Promise.all([
      type.getFields().html.resolve(node),
      type.getFields().excerpt.resolve(node, { pruneLength: 40 }),
    ])
    documents.push({
      path: node.fields.path,
      title: node.frontmatter.title,
      content: striptags(html),
    })
    store[path] = {
      title,
      excerpt,
    }
  }
  const index = lunr(function() {
    this.ref(`path`)
    this.field(`title`)
    this.field(`content`)
    for (const doc of documents) {
      this.add(doc)
    }
  })
  const json = { index: index.toJSON(), store }
  await cache.set(cacheKey, json)
  return json
}
