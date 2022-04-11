import cx from 'classnames';
import React, { useState } from 'react';

import Icon from '../default/Icon';

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="hidden lg:inline-block lg:flex-none lg:h-auto lg:bg-substrateGray-light lg:dark:bg-substrateDark border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div
        className={cx('sticky top-20 mb-12', {
          'w-16 overflow-y-hidden': isOpen,
          'w-64 overflow-y-auto': !isOpen,
        })}
      >
        <div className="pt-4 relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-4 top-4 mr-0.5 bg-substrateDark dark:bg-white p-2 rounded-lg transform transition-opacity duration-300 ease-in-out hover:opacity-80 focus:outline-none z-10"
          >
            <Icon
              name="sidebar-toggle"
              className={cx('fill-current text-white dark:text-substrateDark', {
                'rotate-180': isOpen,
              })}
            />
          </button>
          <div
            className={cx('w-64 mt-10 px-4 z-0 transition-all transform ', {
              'duration-75 ease-in-out opacity-0': isOpen,
              'duration-500 ease-in-out opacity-100': !isOpen,
            })}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
