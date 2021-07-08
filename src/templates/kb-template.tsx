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
          title: `${intl.formatMessage({ id: 'docs-menu-gs-runtime' })}`,
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
    {
      name: `${intl.formatMessage({ id: 'docs-menu-runtime' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'docs-menu-pallets' })}`,
          link: '/v3/docs/knowledgebase/runtime/pallets',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-frame' })}`,
          link: '/v3/docs/knowledgebase/runtime/frame',
        },
        {
          title: `${intl.formatMessage({
            id: 'docs-menu-macros',
          })}`,
          link: '/v3/docs/knowledgebase/runtime/macros',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-metadata' })}`,
          link: '/v3/docs/knowledgebase/runtime/metadata',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-storage' })}`,
          link: '/v3/docs/knowledgebase/runtime/storage',
        },
        {
          title: `${intl.formatMessage({
            id: 'docs-menu-origins',
          })}`,
          link: '/v3/docs/knowledgebase/runtime/origins',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-execution' })}`,
          link: '/v3/docs/knowledgebase/runtime/execution',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-events' })}`,
          link: '/v3/docs/knowledgebase/runtime/events',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-errors' })}`,
          link: '/v3/docs/knowledgebase/runtime/errors',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-weights-and-fees' })}`,
          link: '/v3/docs/knowledgebase/runtime/weights-and-fees',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-benchmarking' })}`,
          link: '/v3/docs/knowledgebase/runtime/benchmarking',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-debugging' })}`,
          link: '/v3/docs/knowledgebase/runtime/debugging',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-testing' })}`,
          link: '/v3/docs/knowledgebase/runtime/testing',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-randomness' })}`,
          link: '/v3/docs/knowledgebase/runtime/randomness',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-upgrades' })}`,
          link: '/v3/docs/knowledgebase/runtime/upgrades',
        },
      ],
    },
    {
      name: `${intl.formatMessage({ id: 'docs-menu-smart-contracts' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'docs-menu-sc-overview' })}`,
          link: '/v3/docs/knowledgebase/smartcontracts/overview',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-contracts-pallet' })}`,
          link: '/v3/docs/knowledgebase/smartcontracts/contracts-pallet',
        },
        {
          title: `${intl.formatMessage({
            id: 'docs-menu-evm-pallet',
          })}`,
          link: '/v3/docs/knowledgebase/smartcontracts/evm-pallet',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-sc-faq' })}`,
          link: '/v3/docs/knowledgebase/smartcontracts/sc-faq',
        },
      ],
    },
    {
      name: `${intl.formatMessage({ id: 'docs-menu-integrate' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'docs-menu-polkadot-js' })}`,
          link: '/v3/docs/knowledgebase/integrate/polkadot-js',
        },
        {
          title: `${intl.formatMessage({
            id: 'docs-menu-client-libraries',
          })}`,
          link: '/v3/docs/knowledgebase/integrate/client-libraries',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-subkey' })}`,
          link: '/v3/docs/knowledgebase/integrate/subkey',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-memory-profiling' })}`,
          link: '/v3/docs/knowledgebase/integrate/memory-profiling',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-chain-specs' })}`,
          link: '/v3/docs/knowledgebase/integrate/chain-specs',
        },
      ],
    },
    {
      name: `${intl.formatMessage({ id: 'docs-menu-advanced' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'docs-menu-account-info' })}`,
          link: '/v3/docs/knowledgebase/advanced/account-info',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-scale-codec' })}`,
          link: '/v3/docs/knowledgebase/advanced/scale-codec',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-consensus' })}`,
          link: '/v3/docs/knowledgebase/advanced/consensus',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-block-import' })}`,
          link: '/v3/docs/knowledgebase/advanced/block-import',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-executor' })}`,
          link: '/v3/docs/knowledgebase/advanced/executor',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-cryptography' })}`,
          link: '/v3/docs/knowledgebase/advanced/cryptography',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-storage' })}`,
          link: '/v3/docs/knowledgebase/advanced/storage',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-ss58' })}`,
          link: '/v3/docs/knowledgebase/advanced/ss58',
        },
        {
          title: `${intl.formatMessage({ id: 'docs-menu-hash-collections' })}`,
          link: '/v3/docs/knowledgebase/advanced/hash-collections',
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
