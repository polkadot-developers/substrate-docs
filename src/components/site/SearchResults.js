/* src/components/searchresults.js */
import { Link } from 'gatsby';
import React from 'react';

const SearchResults = ({ results }) => (
  <div>
    {results.length ? (
      <>
        <h2>{results.length} tartan(s) matched your query</h2>
        <ul>
          {results.map(result => (
            <li key={result.slug}>
              <Link to={`/tartan/${result.slug}`}>{result.title}</Link>
            </li>
          ))}
        </ul>
      </>
    ) : (
      <p>Sorry, no matches found.</p>
    )}
  </div>
);
export default SearchResults;
