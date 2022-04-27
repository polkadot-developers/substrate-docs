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
