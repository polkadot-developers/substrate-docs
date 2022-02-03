const { createFilePath } = require('gatsby-source-filesystem');

const addSlugFieldToMarkdown = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  const filepaths = createFilePath({ node, getNode, basePath: `` })
    .split('/')
    .filter(pathElement => pathElement);
  const slug = filepaths[filepaths.length - 1];
  createNodeField({
    node,
    name: `slug`,
    value: slug,
  });
};

const addPathFieldToMarkdown = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  // get path from /content/md/en folder and remove "/docs" prefix for /md/en/docs/* md
  const path = createFilePath({ node, getNode, basePath: `en` }).replace(/^(\/docs)/, '');
  createNodeField({
    node,
    name: `path`,
    value: path,
  });
};

module.exports = {
  addSlugFieldToMarkdown,
  addPathFieldToMarkdown,
};
