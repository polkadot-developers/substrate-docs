import cx from 'classnames';
import React, { useState } from 'react';

import Icon from '../../default/Icon';
import { Link } from '../../default/Link';
import SubMenu from './SubMenu';

const Menu = ({ page, currentPath }) => {
  const [isOpen, setIsOpen] = useState(currentPath.includes(page.url));
  //console.log(currentPath + 'The page: ' + page.url);
  return (
    <nav role="navigation">
      <ul className="p-0 m-0">
        <li
          className={cx('p-0 m-0 list-none font-semibold', {
            'text-substrateBlue': currentPath === page.url,
          })}
        >
          <span className="inline-block py-3 collapse-button w-full" onClick={() => setIsOpen(!isOpen)}>
            {page.title === 'Quick start' && (
              <Icon
                name="quickStart"
                className={cx('p-0 mx-2 inline fill-current text-substrateDark dark:text-white', {
                  'fill-substrateBlue': currentPath === page.url,
                })}
              />
            )}
            {page.title === 'Docs' && (
              <Icon
                name="docsIcon"
                className={cx('p-0 mx-2 inline fill-current text-substrateDark dark:text-white', {
                  'fill-substrateBlue': currentPath === page.url,
                })}
              />
            )}
            {page.title === 'Tutorials' && (
              <Icon
                name="tutorials"
                className={cx('p-0 mx-2 inline fill-current text-substrateDark dark:text-white', {
                  'fill-substrateBlue': currentPath === page.url,
                })}
              />
            )}
            {page.title === 'Reference' && (
              <Icon
                name="reference"
                className={cx('p-0 mx-2 inline fill-current text-substrateDark dark:text-white', {
                  'fill-substrateBlue': currentPath === page.url,
                })}
              />
            )}
            <Link className="" to={page.url}>
              {page.title}
            </Link>
            {page.pages ? (
              <svg
                className={cx('mt-1 fill-current text-substrateDark dark:text-white align-middle float-right inline', {
                  'fill-substrateBlue': currentPath === page.url,
                  '-rotate-180': isOpen === true,
                })}
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
          </span>
          {isOpen && page.pages && <SubMenu pages={page.pages} currentPath={currentPath} />}
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
