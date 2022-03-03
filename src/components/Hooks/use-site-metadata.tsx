import { graphql, useStaticQuery } from 'gatsby'

export const useSiteMetadata = () => {
  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            image_og
            siteUrl
            author
            pressEmail
            email
            twitter
            linkedIn
            github
            githubDevhub
            telegram
            keywords
            substrateIO
            terms
            privacy
            stackExchange
          }
        }
      }
    `
  )
  return { siteMetadata }
}
