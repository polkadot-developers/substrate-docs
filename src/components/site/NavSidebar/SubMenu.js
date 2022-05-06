import cx from 'classnames';
import React, { useState } from 'react';

import { Link } from '../../default/Link';
import ChildMenu from './ChildMenu';

const SubMenu = ({ pages, currentPath }) => {
  return (
    <ul className="p-0 m-0 pl-3 list-outside">
      {pages.map((page, index) => {
        const [isOpen, setIsOpen] = useState(currentPath.includes(page.url));
        return (
          <li
            key={index}
            className={cx('m-0 pb-2 m-0 list-none font-medium', {
              'text-substrateDark dark:text-white': currentPath !== page.url,
              'text-substrateBlue': currentPath === page.url,
            })}
            onClick={() => setIsOpen(!isOpen)}
          >
            {page.url ? <Link to={page.url}>{page.title}</Link> : `${page.title}`}
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
            {isOpen && page.pages && <ChildMenu pages={page.pages} currentPath={currentPath} />}
          </li>
        );
      })}
    </ul>
  );
};

export default SubMenu;
