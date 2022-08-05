import { graphql, useStaticQuery } from 'gatsby';

const useSiteMetadata = () => {
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
            docsUrl
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
            stackexchange
          }
        }
      }
    `
  );
  return { siteMetadata };
};

export { useSiteMetadata };
