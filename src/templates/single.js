import { graphql } from 'gatsby';
import moment from 'moment';
import React from 'react';

import Icon from '../components/default/Icon';
import { Link } from '../components/default/Link';
import Markdown from '../components/default/Markdown';
import Sidebar from '../components/layout/Sidebar';
import Layout from '../components/site/Layout';
import NavSidebar from '../components/site/NavSidebar';
import SEO from '../components/site/SEO';
import TableOfContents from '../components/site/TableOfContents';
import EditOnGithubButton from '../components/ui/EditOnGithubButton';
import Feedback from '../components/ui/Feedback';

export default function DocsSinglePage({ data, pageContext }) {
  const { markdownRemark } = data;
  const { htmlAst, tableOfContents, frontmatter } = markdownRemark;
  const { title } = frontmatter;
  const { pagePath /*collection*/ } = pageContext;
  const { gitLogLatestDate } = data.markdownRemark.parent.fields;
  const pagePathNoSlash = pagePath.endsWith('/') ? pagePath.slice(0, -1) : pagePath;
  function titleize(slug) {
    var words = slug.split('-');
    return words
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
      })
      .join(' ');
  }

  return (
    <Layout>
      <SEO title={title} />
      <div className="flex flex-col lg:flex-row">
        <Sidebar currentPath={pagePath}>
          {console.log(pagePath.pathname)}
          <NavSidebar currentPath={pagePath} />
        </Sidebar>

        {/* <DocsSingle collection={collection} /> */}

        <article className="px-4 mb-20 lg:flex lg:mx-auto">
          <div className="lg:flex-grow">
            <div className="py-8 lg:flex lg:justify-between lg:items-center">
              <div className="text-sm font-medium text-substrateBlue dark:text-substrateBlue-light mdx-ancho">
                {pageContext.breadcrumb.crumbs.map(index => (
                  <span key={index.crumblabel} className="breadcrumb text-substrateDark dark:text-white">
                    {console.log(index)}
                    <Link
                      to={index.pathname}
                      className="text-sm font-medium text-substrateBlue dark:text-substrateBlue-light mdx-anchor"
                    >
                      {titleize(index.crumbLabel)}
                    </Link>
                  </span>
                ))}
              </div>
              <div className="flex justify-items-end items-center">
                <Icon name="flag" width="14" className="fill-current dark:text-white mr-1" />
                {'  '}
                <p className="text-sm mb-0">Version 4.0 |&nbsp;&nbsp;</p>
                <EditOnGithubButton
                  link={
                    'https://github.com/substrate-developer-hub/substrate-docs/blob/main-md-navigation/content/md/en/docs' +
                    `${pagePathNoSlash}` +
                    '.md'
                  }
                />
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
                  Last edit: {moment(gitLogLatestDate).format('MMMM DD, YYYY')}
                  <hr />
                  <Feedback />
                </div>
              </footer>
            </div>
          </div>
          <div className="hidden xl:inline-block">
            <TableOfContents pageContext={pageContext} data={tableOfContents} />
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
      parent {
        ... on File {
          id
          name
          fields {
            gitLogLatestDate
          }
        }
      }
    }
  }
`;
