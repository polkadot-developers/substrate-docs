import { graphql, useStaticQuery } from 'gatsby';

export const useSiteMenus = () => {
  const {
    site: {
      siteMetadata: { menus },
    },
  } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          menus {
            main {
              id
              url
            }
            technology {
              id
              url
            }
            developers {
              id
              url
            }
            vision {
              id
              url
            }
            ecosystem {
              id
              url
              child
            }
            opportunities {
              id
              url
            }
            resources {
              id
              url
            }
            connect {
              id
              url
            }
            legal {
              id
              url
            }
          }
        }
      }
    }
  `);
  return { menus };
};
