import cx from 'classnames';
import { Link } from 'gatsby-plugin-substrate';
import React from 'react';

const ChildMenu = ({ pages, currentPath }) => {
  return (
    <ul className="p-0 m-0 pl-3 pt-4 list-outside list-disc">
      {pages.map((page, index) => {
        return (
          <Link to={page.url} key={index}>
            <li
              className={cx('h-8 w-full m-0 ml-2 text-sm font-medium cursor-pointer leading-3', {
                'text-gray-500': currentPath !== page.url,
                'text-substrateBlue': currentPath === page.url,
              })}
            >
              {page.url ? page.title : ''}
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default ChildMenu;
