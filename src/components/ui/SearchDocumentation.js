import React, { useEffect } from 'react';

import useComponentVisible from '../../hooks/use-component-visible';
import Icon from '../default/Icon';
import SearchModal from '../site/Search/SearchModal';

export default function SearchDocumentation() {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  useEffect(() => {
    isComponentVisible ? (document.body.style.overflow = `hidden`) : (document.body.style.overflow = `unset`);
  }, [isComponentVisible]);
  return (
    <>
      <button
        className="dark:bg-substrateDark dark:text-white text-substrateDark text-opacity-50 dark:text-opacity-90 bg-substrateGray inline-flex items-center relative rounded-md px-8 py-4 text-xl hover:opacity-80"
        onClick={() => setIsComponentVisible(!isComponentVisible)}
      >
        <span className="font-bold mb-0 mr-4">Search Documentation</span>
        <Icon
          name="search"
          className="h-4 w-4 lg:h-6 lg:w-6 fill-current dark:text-white text-substrateDark opacity-50"
        />
      </button>
      {isComponentVisible && <SearchModal id={ref} closeModal={setIsComponentVisible} />}
    </>
  );
}
