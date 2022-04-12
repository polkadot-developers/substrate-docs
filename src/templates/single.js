import { graphql } from 'gatsby';
import React from 'react';

import Markdown from '../components/default/Markdown';
import Sidebar from '../components/layout/Sidebar';
import Layout from '../components/site/Layout';
import NavSidebar from '../components/site/NavSidebar';
import SEO from '../components/site/SEO';
import TableOfContents from '../components/site/TableOfContents';

export default function DocsSinglePage({ data, pageContext }) {
  const { markdownRemark } = data;
  const { htmlAst, tableOfContents, frontmatter } = markdownRemark;
  const { title } = frontmatter;
  const { pagePath, collection } = pageContext;

  return (
    <Layout>
      <SEO title={title} />
      <div className="flex flex-col lg:flex-row">
        <Sidebar currentPath={pagePath}>
          <NavSidebar currentPath={pagePath} />
        </Sidebar>

        {/* <DocsSingle collection={collection} /> */}

        <article className="px-4 mb-20 lg:flex lg:mx-auto">
          <div className="lg:flex-grow">
            <div className="py-8 lg:flex lg:justify-between lg:items-center">
              <div className="text-sm text-gray-400">
                WIP: Header: Breadcrumbs, Version, Edit
                <div>Collection: {collection}</div>
              </div>
            </div>
            <div className="w-screen max-w-full lg:max-w-2xl 2xl:max-w-3xl markdown-body mdx-anchor">
              <header>
                <h1>{title}</h1>
              </header>
              <main>
                <Markdown htmlAst={htmlAst} />
              </main>
              <footer>
                <div className="py-8 text-sm text-gray-400">
                  WIP: Footer: Last edit
                  <hr />
                  Issue report
                </div>
              </footer>
            </div>
          </div>

          <div className="hidden xl:inline-block">
            <TableOfContents data={tableOfContents} />
          </div>
        </article>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query ($slug: String!) {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    markdownRemark: markdownRemark(fields: { slug: { eq: $slug } }, fileAbsolutePath: { regex: "//(md)/" }) {
      htmlAst
      tableOfContents(maxDepth: 2)
      frontmatter {
        title
      }
    }
  }
`;
