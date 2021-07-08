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
      url: '/v3/docs/',
      external: false,
    },
    {
      section: `${intl.formatMessage({ id: 'docs-nav-tutorials' })}`,
      url: '/tutorials/',
      external: false,
    },
    {
      section: `${intl.formatMessage({ id: 'docs-nav-htg' })}`,
      url: '/how-to-guides/',
      external: false,
    },
    {
      section: `${intl.formatMessage({ id: 'docs-nav-rustdocs' })}`,
      url: '#',
      external: true,
    },
    {
      section: `${intl.formatMessage({ id: 'docs-nav-learningtracks' })}`,
      url: '/learning-tracks/',
      external: false,
    },
  ]
  const docsMenu = [
    // 1. Basics.
    {
      name: `${intl.formatMessage({ id: 'docs-nav-htg-basics' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'htg-basics-pallet-integration' })}`,
          link: '/v3/how-to-guides/basics/pallet-integration',
        },
        {
          title: `${intl.formatMessage({ id: 'htg-basics-instantiable-pallets' })}`,
          link: '/v3/how-to-guides/basics/pallet-integration',
        },
        {
          title: `${intl.formatMessage({ id: 'htg-basics-configurable-constants' })}`,
          link: '/v3/how-to-guides/basics/configurable-constants',
        },
        {
          title: `${intl.formatMessage({ id: 'htg-basics-genesis' })}`,
          link: '/v3/how-to-guides/basics/genesis',
        },
        {
          title: `${intl.formatMessage({ id: 'htg-basics-helper-functions' })}`,
          link: '/v3/how-to-guides/basics/helper-functions',
        },
        {
          title: `${intl.formatMessage({ id: 'htg-basics-mint-token' })}`,
          link: '/v3/how-to-guides/basics/mint-token',
        },
        {
          title: `${intl.formatMessage({ id: 'htg-basics-weights' })}`,
          link: '/v3/how-to-guides/basics/weights',
        },
      ],
    },
    // 2. Pallet Design.
    {
      name: `${intl.formatMessage({ id: 'docs-nav-htg-pallet-design' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'htg-pallet-design-storage-value' })}`,
          link: '/v3/how-to-guides/pallet-design/storage-value',
        },
      ],
    },
    // 3. Weights.
    {
      name: `${intl.formatMessage({ id: 'docs-nav-htg-weights' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'htg-weights-calculate-fees' })}`,
          link: '/v3/how-to-guides/weights/calculate-fees',
        },
      ],
    },
     // 4. Testing.
    {
      name: `${intl.formatMessage({ id: 'docs-nav-htg-testing' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'htg-weights-testing' })}`,
          link: '/v3/how-to-guides/weights/testing',
        },
      ],
    },
    // 5. Storage Migrations.
    {
      name: `${intl.formatMessage({ id: 'docs-nav-htg-storage-migrations' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'htg-sm' })}`,
          link: '/v3/how-to-guides/sm',
        },
      ],
    },
    // 6. Consenus.
    {
      name: `${intl.formatMessage({ id: 'docs-nav-htg-consensus' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'htg-consensus-' })}`,
          link: '/v3/how-to-guides/consensus',
        },
      ],
    },
    // 7. Tools.
    {
      name: `${intl.formatMessage({ id: 'docs-nav-htg-tools' })}`,
      items: [
        {
          title: `${intl.formatMessage({ id: 'htg-tools' })}`,
          link: '/v3/how-to-guides/weights/calculate-fees',
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
