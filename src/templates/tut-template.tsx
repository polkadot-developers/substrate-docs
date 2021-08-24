import * as React from 'react'
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
  const { slug, version, navMenuSlug } = pageContext
  const docId = 1
  const globalDocsNav = navMenu.global()
  const docsMenu = [navMenu.tuts[`${navMenuSlug}`]]

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
                  <div>
                    <div
                      className={`py-8 ${
                        data.mdx.frontmatter.difficulty &&
                        'flex justify-between'
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
                          <button className="bg-substrateBlue bg-opacity-5 ml-4 px-4 py-2 border border-substratePurple border-opacity-30 rounded cursor-text">
                            <svg
                              className="inline-block -mt-0.5 fill-current text-black dark:text-white"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M7.02622 0C10.8539 0 14 3.14607 14 7.02622C14 10.8539 10.8539 14 7.02622 14C3.14607 14 0 10.8539 0 7.02622C0 3.14607 3.14607 0 7.02622 0ZM6.29213 3.1985C6.29213 2.51685 7.34082 2.51685 7.34082 3.1985V6.92135L9.75281 7.603C10.382 7.81273 10.1199 8.80899 9.4382 8.65168L6.71161 7.81273C6.44944 7.7603 6.29213 7.55056 6.29213 7.28839V3.1985ZM7.02622 1.04869C3.72285 1.04869 1.04869 3.72285 1.04869 7.02622C1.04869 10.2772 3.72285 12.9513 7.02622 12.9513C10.2772 12.9513 12.9513 10.2772 12.9513 7.02622C12.9513 3.72285 10.2772 1.04869 7.02622 1.04869Z" />
                            </svg>
                            <span className="ml-2">
                              {data.mdx.frontmatter.duration}
                            </span>
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
        difficulty
        duration
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
        difficulty
        duration
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
