import { Link } from 'gatsby-plugin-substrate';
import React from 'react';

function SearchResult({ slug, section, category, title, noLink, error }) {
  return (
    <>
      {noLink || error ? (
        <div>
          <div
            className={`group px-4 pt-2 pb-3 mb-2 bg-substrateGray dark:bg-gray-700  rounded animate-fade-in-down ${
              error ? '' : `group-hover:font-bold group-hover:text-white hover:bg-substrateGreen`
            }`}
          >
            <span className="text-xs capitalize group-hover:font-bold group-hover:text-white">{section}</span>
            <p
              className={`mb-0 capitalize ${
                error ? 'text-substrateRed' : `group-hover:font-bold group-hover:text-white`
              }`}
            >
              {category} {noLink || error ? '' : '-'} {title}
            </p>
          </div>
        </div>
      ) : (
        <Link to={slug}>
          <div
            className={`group px-4 pt-2 pb-3 mr-3 mb-2 bg-substrateGray dark:bg-gray-700  rounded animate-fade-in-down ${
              error ? '' : `group-hover:font-bold group-hover:text-white hover:bg-substrateGreen`
            }`}
          >
            <span className="text-xs capitalize group-hover:font-bold group-hover:text-white">{section}</span>
            <p
              className={`mb-0 capitalize ${
                error ? 'text-substrateRed' : `group-hover:font-bold group-hover:text-white`
              }`}
            >
              {category} {noLink || error ? '' : '-'} {title}
            </p>
          </div>
        </Link>
      )}
    </>
  );
}

export default SearchResult;
