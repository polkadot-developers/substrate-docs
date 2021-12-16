// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

/*
   Notes:
   - all graphql function call returns a Promise
 */

const createDocPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMdx(filter: { frontmatter: { section: { eq: "docs" } } }) {
        edges {
          node {
            frontmatter {
              slug
              section
            }
          }
        }
      }
    }
  `)
  if (!result || !result.data) return

  result.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: `${node.frontmatter.slug}/`,
      component: path.resolve(`./src/templates/doc.tsx`),
      context: {
        slug: node.frontmatter.slug,
        version: `3.0`,
      },
    })
  })
}

const createHowToGuidePages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMdx(filter: { frontmatter: { section: { eq: "how to guides" } } }) {
        edges {
          node {
            frontmatter {
              slug
              section
            }
          }
        }
      }
    }
  `)
  if (!result || !result.data) return

  result.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: `${node.frontmatter.slug}/`,
      component: path.resolve(`./src/templates/how-to-guide.tsx`),
      context: {
        slug: node.frontmatter.slug,
        version: `3.0`,
      },
    })
  })
}

const createTutorialPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMdx(filter: { frontmatter: { section: { eq: "tutorials" } } }) {
        edges {
          node {
            frontmatter {
              slug
              section
            }
          }
        }
      }
    }
  `)
  if (!result || !result.data) return

  result.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: `${node.frontmatter.slug}/`,
      component: path.resolve(`./src/templates/tutorial.tsx`),
      context: {
        slug: node.frontmatter.slug,
        version: `3.0`,
      },
    })
  })
}

module.exports = {
  createDocPages,
  createHowToGuidePages,
  createTutorialPages,
}
