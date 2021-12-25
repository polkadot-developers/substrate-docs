import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import NavDocs from '../components/site/NavDocs'
import SEO from '../components/SEO'
import Sidebar from '../components/layout/Sidebar'
import TableOfContents from '../components/site/TableOfContents'

const DocsTemplate = ({ data }) => {
  const { markdownRemark } = data
  const {
    html,
    tableOfContents,
    frontmatter: { title },
  } = markdownRemark

  return (
    <Layout>
      <SEO title={title} />
      <div className="flex flex-col lg:flex-row">
        <Sidebar>
          <NavDocs />
        </Sidebar>

        <article className="px-4 mb-20 lg:flex lg:mx-auto">
          <div className="lg:flex-grow">
            <div className={`py-8 lg:flex lg:justify-between lg:items-center`}>
              <span className="text-sm text-gray-400">
                TBD: Breadcrumbs | Version | Edit
              </span>
            </div>
            <div className="max-w-full lg:max-w-2xl 2xl:max-w-3xl markdown-body mdx-anchor">
              <h1>{title}</h1>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>

          <div className="hidden xl:inline-block">
            <TableOfContents data={tableOfContents} />
          </div>
        </article>
      </div>
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
      tableOfContents(maxDepth: 2)
      frontmatter {
        title
      }
    }
  }
`
