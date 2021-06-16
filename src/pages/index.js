import * as React from "react"
import { graphql } from "gatsby"
import { LocalizedLink, LocalesList } from "gatsby-theme-i18n"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Index = ({ data }) => {
  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hello World</h1>
      <p>This is in the Index page.</p>
      <p>
        <LocalizedLink to="/page-2/">Link to second page</LocalizedLink>
      </p>
      <p>
        <LocalizedLink to="/page-2/" language="de">
          Link to second page (german version)
        </LocalizedLink>
      </p>
      <p>
        <LocalizedLink to="/" language="en">
          Link to index page (english version)
        </LocalizedLink>
      </p>
      <ul>
        {data.allFile.nodes.map(({ childMdx: node }) => (
          <li key={node.frontmatter.slug}>
            <LocalizedLink to={node.frontmatter.slug}>
              {node.frontmatter.title}
            </LocalizedLink>
          </li>
        ))}
      </ul>
      <h2>Overview of languages</h2>
      <LocalesList />
    </Layout>
  )
}

export default Index

export const query = graphql`
  query($locale: String!) {
    allFile(
      filter: {
        sourceInstanceName: { eq: "blog" }
        childMdx: { fields: { locale: { eq: $locale } } }
      }
    ) {
      nodes {
        childMdx {
          frontmatter {
            slug
            title
          }
        }
      }
    }
  }
`
