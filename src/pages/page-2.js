import * as React from "react"
import { LocalizedLink } from "gatsby-theme-i18n"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Page2 = () => {
  return (
    <Layout>
      <SEO title="Page 2" />
      <h1>Second page</h1>
      <p>This is the second page.</p>
      <p>
        <LocalizedLink to="/">Link to index page</LocalizedLink>
      </p>
    </Layout>
  )
}

export default Page2
