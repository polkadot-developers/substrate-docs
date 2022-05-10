import cx from 'classnames';
import React from 'react';

import { Link } from '../../default/Link';

const ChildMenu = ({ pages, currentPath }) => {
  return (
    <ul className="p-0 m-0 pl-3 py-1 list-outside">
      {pages.map((page, index) => {
        return (
          <li
            key={index}
            className={cx('mt-2 mb-2 ml-4 m-0 text-sm font-medium cursor-pointer', {
              'text-gray-500': currentPath !== page.url,
              'text-substrateBlue': currentPath === page.url,
            })}
          >
            {page.url ? (
              <Link to={page.url} className="h-full">
                {page.title}
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
