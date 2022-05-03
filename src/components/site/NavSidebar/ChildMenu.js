import cx from 'classnames';
import React from 'react';

import { Link } from '../../default/Link';

const ChildMenu = ({ pages, currentPath }) => {
  return (
    <ul className="p-0 m-0 pl-3 py-1">
      {pages.map((page, index) => {
        return (
          <li
            key={index}
            className={cx('mt-2 mb-2 m-0 list-none text-sm font-medium', {
              'text-gray-500': currentPath !== page.url,
              'text-substrateBlue': currentPath === page.url,
            })}
          >
            {page.url ? (
              <Link to={page.url} className="h-full">
                &#8226; {page.title}
              </Link>
            ) : (
              `${page.title}`
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ChildMenu;
