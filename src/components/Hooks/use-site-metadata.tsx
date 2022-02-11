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
            element
            github
            telegram
            gitter
            stackOverflow
            keywords
            substrateIO
            terms
            privacy
          }
        }
      }
    `
  )
  return { siteMetadata }
}
