import { graphql, useStaticQuery } from 'gatsby';

export const useBanner = () => {
  const {
    allMarkdownRemark: { edges: banners },
  } = useStaticQuery(
    graphql`
      query {
        allMarkdownRemark(
          filter: {
            fileAbsolutePath: { regex: "//(banner)./(?!(__readme__))/" }
            frontmatter: { active: { eq: true } }
          }
          sort: { fields: fields___slug, order: ASC }
          limit: 2
        ) {
          edges {
            node {
              html
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  );

  return { banners };
};
