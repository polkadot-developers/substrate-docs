import { graphql, useStaticQuery } from 'gatsby';

export const useSiteMetadata = () => {
  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            title_meta
            description
            image_og
            siteUrl
            websiteUrl
            docsUrl
            marketplaceUrl
            author
            pressEmail
            email
            twitter
            linkedIn
            element
            github
            telegram
            gitter
            stackoverflow
            stackExchange
            githubDevhub
          }
        }
      }
    `
  );
  return { siteMetadata };
};
