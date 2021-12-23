import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import DocsNavSidebar from '../components/site/DocsNavSidebar'

const DocsTemplate = ({ data }) => {
  const {
    markdownRemark: { html },
  } = data
  return (
    <Layout>
      <div className="flex flex-col lg:flex-row">
        <div className="hidden lg:inline-block lg:flex-none lg:h-auto lg:bg-substrateGray-light lg:dark:bg-substrateDark border-r border-gray-200 dark:border-gray-700">
          <div className="w-64 pt-10">
            <DocsNavSidebar />
          </div>
        </div>

        <article className="px-4 mb-20 lg:flex lg:mx-auto">
          <div className="lg:flex-grow">
            <div className={`py-8 lg:flex lg:justify-between lg:items-center`}>
              {/* Header */}
            </div>
            <div className="max-w-full lg:max-w-2xl 2xl:max-w-3xl markdown-body mdx-anchor">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>

          <div className="hidden xl:inline-block">{/* TOC */}</div>
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
    }
  }
`
