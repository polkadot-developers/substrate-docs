import cx from 'classnames';
import { Link } from 'gatsby-plugin-substrate';
import React, { useState } from 'react';

import SubMenu from './SubMenu';

const Menu = ({ page, currentPath }) => {
  const [isOpen, setIsOpen] = useState(currentPath.includes(page.url));
  return (
    <nav className="min-h-[40px] w-64">
      <ul className="p-0 m-0 list-outside">
        <li
          className={cx('p-0 m-0 list-none font-semibold min-h-max', {
            'text-substrateBlue': currentPath === page.url,
          })}
        >
          <span className="inline-block collapse-button w-full" onClick={() => setIsOpen(!isOpen)}>
            <Link
              className={cx('w-full inline-block h-full hover:opacity-100 opacity-80', {
                '!opacity-100 cursor-default': currentPath === page.url,
              })}
              to={page.url}
            >
              <span className="w-full inline-block">
                <span title={page.title} />
              </span>
              {page.title}
              {page.pages ? (
                <svg
                  className={cx(
                    'mt-1 fill-current text-substrateDark dark:text-white align-middle float-right inline-block cursor-pointer',
                    {
                      'fill-substrateBlue !opacity-100': currentPath === page.url,
                      '-rotate-180': isOpen === true,
                    }
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-5 -8 24 24"
                  width="16"
                  height="16"
                  preserveAspectRatio="xMinYMin"
                >
                  <path d="M7.071 5.314l4.95-4.95a1 1 0 1 1 1.414 1.414L7.778 7.435a1 1 0 0 1-1.414 0L.707 1.778A1 1 0 1 1 2.121.364l4.95 4.95z"></path>
                </svg>
              ) : (
                ''
              )}
            </Link>
          </span>
          {isOpen && page.pages && <SubMenu pages={page.pages} currentPath={currentPath} />}
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
