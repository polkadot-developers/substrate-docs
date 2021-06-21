import * as React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import DocsNavMobile from '../components/DocsNavMobile'
import DocsSideBar from '../components/DocsSideBar'
import DocsNav from '../components/DocsNav'

const BlogTemplate = ({ data }) => {
  return (
    <Layout>
      <SEO title={data.mdx ? data.mdx.frontmatter.title : null} />
      <div className="lg:border-t lg:border-gray-200">
        <div className="lg:container lg:flex">
          <div className="lg:hidden">
            <DocsNavMobile templateId={'Knowledgebase'} />
          </div>
          <div className="hidden lg:inline-block lg:flex-none">
            <DocsNav templateId={'Knowledgebase'} />
          </div>
          <div className="lg:mx-12 lg:flex-grow">
            <h1 className="pt-20">{data.mdx.frontmatter.title}</h1>
            <div>
              {data.mdx ? (
                <MDXRenderer>{data.mdx.body}</MDXRenderer>
              ) : (
                <div>This page hasn&apos;t been translated yet</div>
              )}
            </div>
          </div>
          <div className="hidden lg:inline-block lg:flex-none">
            <DocsSideBar headings={data.mdx.headings} />
          </div>
        </div>
      </div>

      {/* <h1>Context</h1>
      <pre>{JSON.stringify(pageContext, null, 2)}</pre> */}
    </Layout>
  )
}

export default BlogTemplate

export const query = graphql`
  query ($locale: String!, $slug: String!) {
    mdx(
      fields: { locale: { eq: $locale } }
      frontmatter: { slug: { eq: $slug } }
    ) {
      frontmatter {
        slug
        title
      }
      body
      headings {
        value
        depth
      }
    }
  }
`
