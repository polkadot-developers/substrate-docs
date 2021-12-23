import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'

const DocsTemplate = ({ data, pageContext }) => {
  const { slug, relativePath } = pageContext
  const {
    markdownRemark: { html },
  } = data
  return (
    <Layout>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <p>{slug}</p>
      <p>{relativePath}</p>
    </Layout>
  )
}

export default DocsTemplate

export const query = graphql`
  query ($slug: String!) {
    markdownRemark(
      fields: { slug: { eq: $slug } }
      fileAbsolutePath: { regex: "//(docs)/" }
    ) {
      html
    }
  }
`
