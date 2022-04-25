import cx from 'classnames';
import { Link } from 'gatsby';
import React, { useState } from 'react';

import Icon from '../default/Icon';

const Sidebar = ({ children, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
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
            <div className="mt-12">
              {isOpen ? (
                <>
                  <Link to="/quick-start/quickstart/">
                    <Icon
                      name="quickStart"
                      className={cx('p-0 my-7 mx-auto block fill-current text-substrateDark dark:text-white', {
                        'fill-substrateBlue': currentPath.includes('/quick-start/'),
                      })}
                    />
                  </Link>
                  <Link to="/main-docs/">
                    <Icon
                      name="docsIcon"
                      className={cx('p-0 my-7 mx-auto block fill-current text-substrateDark dark:text-white', {
                        'fill-substrateBlue': currentPath.includes('/main-docs/'),
                      })}
                    />
                  </Link>
                  <Link to="/tutorials/">
                    <Icon
                      name="tutorials"
                      className={cx('p-0 my-7 mx-auto block fill-current text-substrateDark dark:text-white', {
                        'fill-substrateBlue': currentPath.includes('/tutorials/'),
                      })}
                    />
                  </Link>
                  <Link to="/reference/">
                    <Icon
                      name="reference"
                      className={cx('p-0 my-7 mx-auto block fill-current text-substrateDark dark:text-white', {
                        'fill-substrateBlue': currentPath.includes('/reference/'),
                      })}
                    />
                  </Link>
                </>
              ) : (
                ''
              )}
            </div>
            <div
              className={cx('w-64 mt-10 px-4 z-0 transition-all transform ', {
                'duration-75 ease-in-out opacity-0 hidden': isOpen,
                'duration-500 ease-in-out opacity-100': !isOpen,
              })}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
