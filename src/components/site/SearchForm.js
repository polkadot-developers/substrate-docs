/* src/components/search-form.js */
import { navigate } from '@reach/router';
import React, { useRef, useState } from 'react';

import Icon from '../default/Icon';
const SearchForm = ({ initialQuery = '' }) => {
  // Create a piece of state, and initialize it to initialQuery
  // query will hold the current value of the state,
  // and setQuery will let us change it
  const [query, setQuery] = useState(initialQuery);

  // We need to get reference to the search input element
  const inputEl = useRef(null);

  // On input change use the current value of the input field (e.target.value)
  // to update the state's query value
  const handleChange = e => {
    setQuery(e.target.value);
  };

  // When the form is submitted navigate to /search
  // with a query q paramenter equal to the value within the input search
  const handleSubmit = e => {
    e.preventDefault();
    // `inputEl.current` points to the mounted search input element
    const q = inputEl.current.value;
    navigate(`/search?q=${q}`);
  };
  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="border-none flex h-full items-center justify-between p-2 cursor-text active:outline-none focus:outline-none"
    >
      <input
        ref={inputEl}
        id="search-input"
        type="search"
        value={query}
        placeholder="Search Docs"
        onChange={handleChange}
        className="border-none mb-0 pr-4 text-sm text-substrateDark dark:text-white text-opacity-25 dark:text-opacity-9 border-none bg-substrateGray active:outline-none focus:outline-none ring-offset-transparent rounded"
      />
      <button
        type="submit"
        className="h-9 ml-2 flex items-center justify-center bg-substrateDark dark:bg-white  text-sm py-2 w-10 rounded focus:outline-none fill-current text-white dark:text-black"
      >
        <Icon name="search" width="18" className="h-9 fill-current dark:text-black text-white" />
      </button>
    </form>
  );
};
export default SearchForm;
