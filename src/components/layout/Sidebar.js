import cx from 'classnames';
import { Link } from 'gatsby';
import React, { useState } from 'react';

import Icon from '../default/Icon';

const Sidebar = ({ children, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="hidden lg:inline-block lg:flex-none lg:bg-substrateGray-light lg:dark:bg-substrateDark border-r border-gray-200 dark:border-gray-700 h-full">
        <div className={cx('sticky top-20 mb-12', {})}>
          <div
            className={cx('h-screen pb-24 overflow-y-scroll', {
              'w-16 overflow-y-hidden': isOpen,
              'w-64 overflow-y-auto': !isOpen,
            })}
          >
            <div className="pt-4 relative">
              <button
                title={!isOpen ? 'minimize' : 'maximize'}
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-4 top-6 mr-0.5 transform transition-opacity duration-300 ease-in-out hover:opacity-80 focus:outline-none z-10"
              >
                <Icon
                  name={!isOpen ? 'collapse' : 'expand'}
                  className={cx('fill-current text-substrateDark dark:text-white', {
                    'rotate-180': isOpen,
                    'mr-1': isOpen,
                  })}
                />
              </button>
              <div className="mt-14">
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
    </div>
  );
};

export default Sidebar;
