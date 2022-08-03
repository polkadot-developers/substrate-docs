import { graphql, useStaticQuery } from 'gatsby';

export const useBanner = () => {
  const {
    allBannersMarkdown: { edges: banners },
  } = useStaticQuery(
    graphql`
      query {
        allBannersMarkdown(filter: { frontmatter: { active: { eq: true } } }, limit: 2) {
          edges {
            node {
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
