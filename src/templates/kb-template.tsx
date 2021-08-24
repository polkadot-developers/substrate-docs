import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import DocsNavMobile from '../components/DocsNavMobile'
import DocsSideBar from '../components/DocsSideBar'
import DocsNav from '../components/DocsNav'
import VersionControl from '../components/VersionControl'
import LastUpdateGithub from '../components/LastUpdateGithub'
import { BottomButtons, Message } from '../components/DocsComponents'
import navMenu from '../components/DevNavMenu'

const DocsTemplate = ({ data, pageContext }: any) => {
  const { slug, version } = pageContext
  const docId = 0
  const globalDocsNav = navMenu.global()
  const docsMenu = navMenu.knowledgebase()

  return (
    <Layout>
      <SEO title={data.mdx ? data.mdx.frontmatter.title : null} />
      <div>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:hidden">
            <DocsNavMobile
              sideNav={docsMenu}
              globalNav={globalDocsNav}
              templateId={docId}
            />
          </div>
          <div className="hidden lg:inline-block lg:flex-none lg:h-auto lg:bg-substrateGray-light lg:dark:bg-gray-900 ">
            <DocsNav
              sideNav={docsMenu}
              globalNav={globalDocsNav}
              templateId={docId}
            />
          </div>
          <article className="max-w-6xl px-4 lg:px-16 lg:pb-24 lg:flex lg:mx-auto">
            <div>
              <div>
                {data.mdx ? (
                  <div className="pt-10">
                    <VersionControl
                      version={version}
                      slug={slug}
                      absolutePath={data.mdx.fileAbsolutePath}
                    />
                    <div className="markdown-body mdx-anchor">
                      <h1>{data.mdx.frontmatter.title}</h1>
                      <MDXRenderer>{data.mdx.body}</MDXRenderer>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mt-10">
                      <Message
                        type={`green`}
                        title={`TRANSLATIONS NEEDED`}
                        text={`This page has not been translated yet. If you can help translate the documentation here into another language, please go to Crowdin and pick a language to get started. ##LINK HELPFUL DOC##`}
                      />
                    </div>
                    <div className="pt-10">
                      <VersionControl
                        version={version}
                        slug={slug}
                        absolutePath={data.englishVersion.fileAbsolutePath}
                      />
                      <div className="markdown-body mdx-anchor">
                        <h1>{data.englishVersion.frontmatter.title}</h1>
                        <MDXRenderer>{data.englishVersion.body}</MDXRenderer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-right py-12">
                {data.mdx ? (
                  <LastUpdateGithub absolutePath={data.mdx.fileAbsolutePath} />
                ) : (
                  <LastUpdateGithub
                    absolutePath={data.englishVersion.fileAbsolutePath}
                  />
                )}
              </div>
              {data.mdx ? (
                data.mdx.frontmatter.hideNav ? null : (
                  <BottomButtons menu={docsMenu} pageSlug={slug} />
                )
              ) : data.englishVersion.frontmatter.hideNav ? null : (
                <BottomButtons menu={docsMenu} pageSlug={slug} />
              )}
            </div>

            {data.mdx ? (
              <div className="hidden xl:inline-block xl:flex-none">
                <DocsSideBar headings={data.mdx.headings} />
              </div>
            ) : (
              <div className="hidden xl:inline-block xl:flex-none">
                <DocsSideBar headings={data.englishVersion.headings} />
              </div>
            )}
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
      }
      body
      headings {
        value
        depth
      }
      tableOfContents(maxDepth: 3)
      fileAbsolutePath
    }
    englishVersion: mdx(
      fields: { locale: { eq: "en" } }
      frontmatter: { slug: { eq: $slug } }
    ) {
      frontmatter {
        slug
        title
        hideNav
      }
      body
      headings {
        value
        depth
      }
      tableOfContents(maxDepth: 3)
      fileAbsolutePath
    }
  }
`
