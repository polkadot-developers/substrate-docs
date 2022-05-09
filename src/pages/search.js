/* src/pages/search.js */
import { graphql, Link } from 'gatsby';
import { Index } from 'lunr';
import React from 'react';

import Layout from '../components/site/Layout';
//import SearchForm from '../components/site/SearchForm';
import SEO from '../components/site/SEO';

// We can access the results of the page GraphQL query via the data props
const SearchPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;

  // We can read what follows the ?q= here
  // URLSearchParams provides a native way to get URL params
  // location.search.slice(1) gets rid of the "?"
  const params = new URLSearchParams(location.search.slice(1));
  const q = params.get('q') || '';

  // LunrIndex is available via page query
  const { store } = data.LunrIndex;
  // Lunr in action here
  const index = Index.load(data.LunrIndex.index);
  let results = [];
  try {
    // Search is a lunr method
    results = index.search(q).map(({ ref }) => {
      // Map search results to an array of {slug, title, excerpt} objects
      return {
        path: ref,
        ...store[ref],
      };
    });
  } catch (error) {
    console.log(error);
  }
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Search results" />
      <div className="pt-5 w-8/12 block text-left mx-auto">
        {q ? <h1>Search results for &quot;{q}&quot;</h1> : <h1>What are you looking for?</h1>}
        {results.length ? (
          results.map(result => {
            return (
              <article key={result.path}>
                {console.log(result)}
                <h2>
                  <Link to={result.path}>{result.title || result.path}</Link>
                </h2>
                <p>{result.excerpt}</p>
              </article>
            );
          })
        ) : (
          <p>Nothing found.</p>
        )}
      </div>
    </Layout>
  );
};
export default SearchPage;
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    LunrIndex
  }
`;
