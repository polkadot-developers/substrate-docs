import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useIntl } from 'react-intl'
import DocsNavMobile from '../components/DocsNavMobile'
import DocsSideBar from '../components/DocsSideBar'
import DocsNav from '../components/DocsNav'
import VersionControl from '../components/VersionControl'
import { BottomButtons, Message } from '../components/DocsComponents'

const DocsTemplate = ({ data, pageContext }: any) => {
  const { slug, version } = pageContext
  const intl = useIntl()
  const globalDocsNav = [
    {
      section: `${intl.formatMessage({ id: 'docs-nav-knowledgebase' })}`,
      url: '/v3/docs/getting-started/overview',
      external: false,
    },
    {
      section: `${intl.formatMessage({ id: 'docs-nav-tutorials' })}`,
      url: '/tutorials',
      external: false,
    },
    {
      section: `${intl.formatMessage({ id: 'docs-nav-htg' })}`,
      url: '/how-to-guides',
      external: false,
    },
    {
      section: `${intl.formatMessage({ id: 'docs-nav-rustdocs' })}`,
      url: '#',
      external: true,
    },
    {
      section: `${intl.formatMessage({ id: 'docs-nav-learningtracks' })}`,
      url: '/learning-tracks',
      external: false,
    },
  ]
  const docsMenu = [
    {
      name: `${intl.formatMessage({ id: 'docs-menu-getting-started' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'docs-menu-overview' })}`,
          link: '/v3/docs/getting-started/overview',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-architecture' })}`,
          link: '/v3/docs/getting-started/architecture',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-installation' })}`,
          link: '/v3/docs/getting-started/installation',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-windows' })}`,
          link: '/v3/docs/getting-started/windows-users',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-glossary' })}`,
          link: '/v3/docs/getting-started/glossary',
        },
      ],
    },
    {
      name: `${intl.formatMessage({ id: 'docs-menu-key-concepts' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'docs-menu-runtime' })}`,
          link: '/v3/docs/concepts/runtime',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-extrinsics' })}`,
          link: '/v3/docs/concepts/extrinsics',
        },
        {
          title: `${intl.formatMessage({
            id: 'docs-menu-account-abstractions',
          })}`,
          link: '/v3/docs/concepts/account-abstractions',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-transaction-pool' })}`,
          link: '/v3/docs/concepts/tx-pool',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-session-keys' })}`,
          link: '/v3/docs/concepts/session-keys',
        },
        {
          title: `${intl.formatMessage({
            id: 'docs-menu-transaction-weight',
          })}`,
          link: '/v3/docs/concepts/weight',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-offchain-features' })}`,
          link: '/v3/docs/concepts/off-chain-features',
        },
      ],
    },
  ]

  return (
    <Layout>
      <SEO title={data.mdx ? data.mdx.frontmatter.title : null} />
      <div className="mb-24">
        <div className="flex flex-col lg:container lg:flex-row ">
          <div className="lg:hidden">
            <DocsNavMobile
              sideNav={docsMenu}
              globalNav={globalDocsNav}
              templateId={0}
            />
          </div>
          <div className="hidden lg:inline-block lg:flex-none">
            <DocsNav
              sideNav={docsMenu}
              globalNav={globalDocsNav}
              templateId={0}
            />
          </div>
          <article className="markdown-body px-4 lg:px-16 lg:flex-grow lg:border-l lg:border-r lg:border-gray-200 dark:lg:border-gray-700">
            <div>
              {data.mdx ? (
                <div className="pt-10">
                  <VersionControl version={version} slug={slug} />
                  <h1>{data.mdx.frontmatter.title}</h1>
                  <MDXRenderer>{data.mdx.body}</MDXRenderer>
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
                    <VersionControl version={version} slug={slug} />
                    <h1>{data.englishVersion.frontmatter.title}</h1>
                    <MDXRenderer>{data.englishVersion.body}</MDXRenderer>
                  </div>
                </div>
              )}
            </div>
            <div className="text-xs text-right py-12">
              Last updated on 03/16/2021
            </div>
            <BottomButtons menu={docsMenu} pageSlug={slug} />
          </article>
          {data.mdx ? (
            <div className="hidden lg:inline-block lg:flex-none">
              <DocsSideBar headings={data.mdx.headings} />
            </div>
          ) : (
            <div className="hidden lg:inline-block lg:flex-none">
              <DocsSideBar headings={data.englishVersion.headings} />
            </div>
          )}
        </div>
      </div>

      {/* <h1>Context</h1>
      <pre>{JSON.stringify(pageContext, null, 2)}</pre> */}
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
      }
      body
      headings {
        value
        depth
      }
    }
    englishVersion: mdx(
      fields: { locale: { eq: "en" } }
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
