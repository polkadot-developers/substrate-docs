import React from 'react';

import SearchResult from './SearchResult';

function SearchResultsContainer({ results, query, setQuery }) {
  const suggestedTerms = [
    'Install',
    'Smart contract pallets',
    'Build a local blockchain',
    'Command line tools',
    'Pallet Design',
  ];

  return (
    <div className="h-full">
      <div className={`${query.length === 0 ? 'invisible' : 'visible'} text-sm font-bold mb-3 mt-3 animate-fade-in`}>
        {results.length} RESULTS
      </div>
      <div className="overflow-y-auto overscroll-contain h-[400px]">
        {query.length === 0 ? (
          <div>
            {suggestedTerms.map((term, index) => (
              <div className="cursor-pointer" onClick={() => setQuery(term)} key={index}>
                <SearchResult noLink section={`Suggestion`} title={term} />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {results.length > 0 ? (
              <div>
                {results.map((result, index) => {
                  return (
                    <div key={index}>
                      <SearchResult
                        slug={result.slug}
                        section={result.section}
                        category={result.category}
                        title={result.title}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <SearchResult error title={`Try another search term`} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultsContainer;
