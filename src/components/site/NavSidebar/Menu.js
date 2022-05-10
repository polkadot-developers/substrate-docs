import cx from 'classnames';
import React, { useState } from 'react';

import snakecase from '../../../hooks/snakecase';
import Icon from '../../default/Icon';
import { Link } from '../../default/Link';
import SubMenu from './SubMenu';

const Menu = ({ page, currentPath }) => {
  const [isOpen, setIsOpen] = useState(currentPath.includes(page.url));
  return (
    <nav role="navigation">
      <ul className="p-0 m-0 list-outside">
        <li
          className={cx('p-0 m-0 list-none font-semibold cursor-pointer', {
            'text-substrateBlue': currentPath === page.url,
          })}
        >
          <span className="inline-block py-3 collapse-button w-full" onClick={() => setIsOpen(!isOpen)}>
            <Link className="" to={page.url}>
              <span className="w-10 inline-block text-center">
                <span title={page.title}>
                  <Icon
                    name={snakecase(page.title)}
                    className={cx('p-0 mx-2 inline fill-current text-substrateDark dark:text-white', {
                      'fill-substrateBlue': currentPath === page.url,
                    })}
                  />
                </span>
              </span>
              {page.title}
            </Link>
            {page.pages ? (
              <svg
                className={cx(
                  'mt-1 fill-current text-substrateDark dark:text-white align-middle float-right inline cursor-pointer',
                  {
                    'fill-substrateBlue': currentPath === page.url,
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
          </span>
          {isOpen && page.pages && <SubMenu pages={page.pages} currentPath={currentPath} />}
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
