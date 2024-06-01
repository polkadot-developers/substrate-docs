import { graphql } from 'gatsby';
import { Layout, Link, SEO } from 'gatsby-plugin-substrate';
import React from 'react';

import configNav from '../../content/config/nav.yaml';
import Markdown from '../components/default/Markdown';
import Sidebar from '../components/layout/Sidebar';
import NavSidebar from '../components/site/NavSidebar';
import MobileNavigation from '../components/site/NavSidebar/MobileNavigation';
import ModalButton from '../components/site/Search/ModalButton';
import TableOfContents from '../components/site/TableOfContents';
import EditOnGithubButton from '../components/ui/EditOnGithubButton';
import PreviousNextButtons from '../components/ui/PreviousNextButtons';

export default function DocsSinglePage({ data, pageContext }) {
  const { markdownRemark } = data;
  const { htmlAst, tableOfContents, frontmatter, headings, excerpt } = markdownRemark;
  const { title, description } = frontmatter;
  const { pagePath /*collection*/ } = pageContext;
  const { gitLogLatestDate } = data.markdownRemark.parent.fields != null ? data.markdownRemark.parent.fields : '';
  //const pagePathNoSlash = pagePath.endsWith('/') ? pagePath.slice(0, -1) : pagePath;
  const relativeFilePath = data.markdownRemark.parent.relativePath;
  function titleize(slug) {
    let words = slug.toLowerCase().replace(/-/g, ' ');
    words = words[0].toUpperCase() + words.substring(1);
    words = words.replace(' substrate', ' Substrate');
    words = words.replace(' rust', ' Rust');
    return words;
  }

  function flatten(obj, parent, res = {}) {
    for (let key in obj) {
      let propName = parent ? parent + '_' + key : key;
      if (typeof obj[key] == 'object') {
        flatten(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  }

  const nextPrevItemsFlat = flatten(configNav);
  const nextPrevItems = Object.values(nextPrevItemsFlat);
  function checkIfValidURLSlug(str) {
    // Regular expression to check if string is a valid url slug
    //const regexExp = /^[a-z0-9]+(?:-[a-z0-9]+)*$/g;
    if (str.startsWith('/') && str.endsWith('/')) {
      return str;
    }
  }
  const nextPrevSlugs = nextPrevItems.filter(checkIfValidURLSlug);
  const index = nextPrevSlugs.indexOf(pagePath);

  const nextPage = nextPrevSlugs[index + 1];
  const previousPage = nextPrevSlugs[index - 1];

  return (
    <Layout showFooterNewsletter={false}>
      <SEO title={title} description={description} excerpt={excerpt} />
      <div className="flex flex-col lg:flex-row -mt-12">
        <div className="z-20 flex-col pt-8 sticky top-16 hidden lg:inline-block lg:flex-none lg:bg-substrateGray-light lg:dark:bg-substrateDark border-r border-gray-200 dark:border-gray-700 h-full">
          <div className="mx-5">
            <ModalButton />
          </div>
          <Sidebar currentPath={pagePath}>
            <div className="mx-5 mt-1">
              <NavSidebar currentPath={pagePath} />
            </div>
          </Sidebar>
        </div>
        <MobileNavigation className="hidden" currentPath={pagePath} />
        {/* <DocsSingle collection={collection} /> */}
        <div className="flex flex-col">
          <article className="mb-20 grid grid-cols-12 gap-1 grid-rows-2">
            <div className="xl:col-start-2 xl:col-end-9 col-start-2 col-end-12">
              <div className="py-8 flex sm:justify-between items-center sm:flex-row xs:flex-col-reverse xs:justify-center">
                <div className="text-sm font-medium text-substrateGreen dark:text-substrateBlue-light mdx-anchor">
                  {pageContext.breadcrumb.crumbs.map((index, i, crumbs) => (
                    <span key={index.pathname} className="breadcrumb text-substrateDark dark:text-white">
                      {i + 1 === crumbs.length ? (
                        titleize(index.crumbLabel)
                      ) : (
                        <Link
                          to={index.pathname}
                          className="text-sm font-medium text-substrateBlue dark:text-substrateBlue-light mdx-anchor"
                        >
                          {titleize(index.crumbLabel)}
                        </Link>
                      )}
                    </span>
                  ))}
                </div>
                <div className="flex sm:mb-0 xs:mb-5 whitespace-nowrap">
                  <EditOnGithubButton
                    link={
                      'https://github.com/substrate-developer-hub/substrate-docs/blob/main/content/md/' +
                      `${relativeFilePath}`
                    }
                    text={'Edit this page'}
                  />
                </div>
              </div>
              <div className="w-screen max-w-full markdown-body mdx-anchor">
                <header>
                  <h1>{title}</h1>
                </header>
                <main className="markdown-body">
                  <Markdown htmlAst={htmlAst} />
                </main>
              </div>
              <footer className="mt-10">
                <p className="text-right opacity-80">
                  <strong>Last edit:</strong> {gitLogLatestDate}
                </p>
                <PreviousNextButtons previous={previousPage} next={nextPage} />
              </footer>
            </div>
            <div className="hidden xl:block col-start-10 col-end-12 sticky top-20 max-h-[calc(100vh)] pb-32">
              <TableOfContents data={tableOfContents} headings={headings} />
            </div>
          </article>
        </div>
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
      headings(depth: h2) {
        id
        value
        depth
      }
      frontmatter {
        title
        description
      }
      parent {
        ... on File {
          id
          name
          relativePath
          fields {
            gitLogLatestDate(formatString: "LL")
          }
        }
      }
      excerpt(pruneLength: 80)
    }
  }
`;
