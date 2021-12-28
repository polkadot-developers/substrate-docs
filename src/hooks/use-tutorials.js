import { graphql, useStaticQuery } from 'gatsby'

export const useTutorials = () => {
  const {
    allMarkdownRemark: { edges: tutorials },
  } = useStaticQuery(
    graphql`
      query {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "//(docs)/(tutorials)/" } }
        ) {
          edges {
            node {
              html
              fields {
                slug
                path
              }
              frontmatter {
                title
                description
                featured_image
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `
  )
  return { tutorials }
}
