import React, { useEffect, useState } from 'react';

import useLunrIndex from '../../../hooks/use-lunr-index';
import SearchInput from './SearchInput';
import SearchResultsContainer from './SearchResultsContainer';
import SearchSectionLabel from './SearchSectionLabel';

function SearchModal({ id, closeModal }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [displayedResults, setDisplayedResults] = useState([]);
  const types = ['Fundamentals', 'Install', 'Build', 'Test', 'Tutorials', 'Reference'];
  const { store, index } = useLunrIndex();

  const [section, setSection] = useState({
    fundamentals: false,
    install: false,
    bdl: false,
    test: false,
    tuts: false,
    ref: false,
  });

  const sectionNames = {
    fundamentals: 'fundamentals',
    install: 'install',
    bdl: 'build',
    test: 'test',
    tuts: 'tutorials',
    ref: 'reference',
  };

  const processQuery = query => {
    if (
      query.length === 0 || // query is empty string
      query.split(/\s/).length < 2 || // query is a single word
      query.match(/[\^~+\-*:]/) !== null // query contains the special character in lunrjs search
    ) {
      return query;
    }
    const result = query
      .split(/\s/)
      .filter(t => t.length > 0)
      .map(t => `+${t}`)
      .join(' ');
    return result;
  };

  const searchForQuery = (index, store, query) => {
    try {
      return index.search(query).map(result => {
        return { slug: result.ref, ...store[result.ref] };
      });
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    let results = searchForQuery(index, store, processQuery(query));
    if (results.length == 0) {
      results = searchForQuery(index, store, `${query}*`);
    }
    setSearchResults(results);
  }, [query]);

  useEffect(() => {
    const selectedSections = Object.entries(section)
      .filter(([, val]) => val)
      .map(([key]) => key);

    if (selectedSections.length === 0) {
      return setDisplayedResults(searchResults);
    }

    const selectedSectionNames = Object.entries(sectionNames)
      .filter(([key]) => selectedSections.indexOf(key) >= 0)
      .map(([, val]) => val);

    function filterResult(i) {
      console.log(Object.entries(sectionNames));
      if (i.slug.includes(selectedSectionNames[0])) {
        return true;
      }
      if (i.slug.includes(selectedSectionNames[1])) {
        return true;
      }
      if (i.slug.includes(selectedSectionNames[2])) {
        return true;
      }
      if (i.slug.includes(selectedSectionNames[3])) {
        return true;
      }
      if (i.slug.includes(selectedSectionNames[4])) {
        return true;
      }
      if (i.slug.includes(selectedSectionNames[5])) {
        return true;
      } else {
        return false;
      }
    }
    const filteredResults = searchResults.filter(result => filterResult(result));
    setDisplayedResults(filteredResults);
    console.log(filteredResults);
  }, [searchResults, section]);

  return (
    <>
      <div
        id="content-container"
        className="flex justify-center items-center lg:items-start lg:mt-24 fixed inset-0 z-50 animate-fade-in max-h-screen text-left"
      >
        <div
          ref={id}
          className="bg-white dark:bg-gray-900 w-full max-w-screen-sm h-auto py-10 px-8 rounded-lg border-2 border-substrateDark shadow-xl max-h-screen overflow-scroll"
          aria-modal="true"
          aria-label="Search documentation"
        >
          <SearchInput query={query} setQuery={setQuery} closeModal={closeModal} />
          <div className="grid grid-cols-3 gap-3 auto-cols-auto items-center h-20">
            {types.map((type, index) => (
              <div key={index} className="justify-items-start">
                <SearchSectionLabel index={index} section={section} setSection={setSection}>
                  {type}
                  {section.install}
                </SearchSectionLabel>
              </div>
            ))}
          </div>
          <SearchResultsContainer results={displayedResults} query={query} setQuery={setQuery} />
        </div>
      </div>
      <div id="modal-background" className="opacity-70 dark:opacity-90 fixed inset-0 z-40 bg-substrateDark"></div>
    </>
  );
}

export default SearchModal;
