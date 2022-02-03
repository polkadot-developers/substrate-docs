const $path = require('path');

/*
   Notes:
   - all graphql function call returns a Promise
 */

const createDocsPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "//(content)/(md)/(en)/(docs)/" } }) {
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
  `);
  if (!result || !result.data) return;

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const { path, slug } = node.fields;
    const filepaths = path.split('/').filter(pathElement => pathElement);
    /* Create collection type based on folder name, for later use in template,
    eg: `/<main-docs>/quick-start/` => collection: main-docs */
    const [collection] = filepaths;

    createPage({
      path,
      component: $path.resolve(`./src/templates/single.js`),
      context: {
        collection,
        pagePath: path,
        slug,
      },
    });
  });
};

module.exports = {
  createDocsPages,
};
