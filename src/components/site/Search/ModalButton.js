import { Icon, useComponentVisible } from 'gatsby-plugin-substrate';
import React, { useEffect } from 'react';

import analytics from '../../../analytics';
import SearchModal from './SearchModal';

function ModalButton() {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  useEffect(() => {
    isComponentVisible && analytics.track('open_search_modal');
    isComponentVisible ? (document.body.style.overflow = `hidden`) : (document.body.style.overflow = `unset`);
  }, [isComponentVisible]);
  return (
    <>
      <button
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        className="flex items-center p-2 pl-4 border font-semibold w-full opacity-75 border-substrateDark dark:border-substrateGray cursor-pointer active:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
      >
        <Icon name="search" className="h-4 w-4 fill-current text-substrateDark dark:text-white" />
        {'   '}
        <p className="mb-0 pr-4 ml-2 text-substrateDark dark:text-white dark:text-opacity-90">Search documentation</p>
      </button>
      {isComponentVisible && <SearchModal id={ref} closeModal={setIsComponentVisible} />}
    </>
  );
}

export default ModalButton;
