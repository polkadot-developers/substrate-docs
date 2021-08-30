import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import DocsNavMobile from '../components/DocsNavMobile'
import TableOfContent from '../components/TableOfContent'
import DocsNav from '../components/DocsNav'
import VersionControl from '../components/VersionControl'
import LastUpdateGithub from '../components/LastUpdateGithub'
import { BottomButtons } from '../components/DocsComponents'
import navMenu from '../components/DevNavMenu'

const DocsTemplate = ({ data, pageContext }: any) => {
  const { slug, version } = pageContext
  const globalDocsNav = navMenu.global()
  const docsMenu = navMenu.htg()
  return (
    <Layout>
      <SEO title={data.mdx ? data.mdx.frontmatter.title : null} />
      <div>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:hidden">
            <DocsNavMobile
              sideNav={docsMenu}
              globalNav={globalDocsNav}
              templateId={2}
            />
          </div>
          <div className="hidden lg:inline-block lg:flex-none lg:h-auto lg:bg-substrateGray-light lg:dark:bg-gray-900 ">
            <DocsNav
              sideNav={docsMenu}
              globalNav={globalDocsNav}
              templateId={2}
            />
          </div>
          <article className="max-w-6xl px-4 lg:px-16 lg:pb-24 lg:flex lg:mx-auto">
            <div>
              <div
                className={`py-8 ${
                  data.mdx.frontmatter.difficulty && 'flex justify-between'
                }`}
              >
                {data.mdx.frontmatter.difficulty && (
                  <div className="inline-block text-xs">
                    <button className="bg-substrateBlue bg-opacity-5 px-4 py-2 border border-substratePurple border-opacity-30 rounded cursor-text">
                      {data.mdx.frontmatter.difficulty === 1
                        ? 'Beginner'
                        : data.mdx.frontmatter.difficulty === 2
                        ? 'Intermediate'
                        : data.mdx.frontmatter.difficulty === 3
                        ? 'Advanced'
                        : null}
                    </button>
                  </div>
                )}
                <VersionControl
                  version={version}
                  slug={slug}
                  absolutePath={data.mdx.fileAbsolutePath}
                />
              </div>

              <div className="markdown-body mdx-anchor">
                <h1>{data.mdx.frontmatter.title}</h1>
                <MDXRenderer>{data.mdx.body}</MDXRenderer>
              </div>
              <div className="text-xs text-right py-12">
                <LastUpdateGithub absolutePath={data.mdx.fileAbsolutePath} />
              </div>
              {data.mdx.frontmatter.hideNav ? null : (
                <BottomButtons menu={docsMenu} pageSlug={slug} />
              )}
            </div>
            <div className="hidden xl:inline-block xl:flex-none">
              <TableOfContent headings={data.mdx.tableOfContents} />
            </div>
          </article>
        </div>
      </div>
    </Layout>
  )
}

export default DocsTemplate

export const query = graphql`
  query ($locale: String!, $slug: String!) {
    mdx(
      fields: { locale: { eq: $locale } }
      frontmatter: { slug: { eq: $slug } }
    ) {
      frontmatter {
        slug
        title
        hideNav
        difficulty
      }
      body
      tableOfContents(maxDepth: 3)
      fileAbsolutePath
    }
  }
`
