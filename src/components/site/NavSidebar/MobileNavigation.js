import cx from 'classnames';
import React, { useState } from 'react';

import configNav from '../../../../content/config/nav.yaml';
import Icon from '../../default/Icon';
import ModalButton from '../Search/ModalButton';
import MobileMenu from './MobileMenu';

const MobileNavigation = ({ currentPath }) => {
  const { menu } = configNav;
  const [toggleNav, setNav] = useState(false);
  return (
    <div className="xl:hidden lg:hidden md:block sm:block xs:block">
      <button
        className="pt-4 flex content-center items-center justify-center w-full text-center mx-auto font-bold py-4 bg-substrateGray dark:bg-gray-700 cursor-pointer"
        onClick={() => setNav(!toggleNav)}
      >
        <Icon name="docsNavIcon" className="fill-current text-black dark:text-white" />
        &nbsp; Documentation
        <svg
          className={cx('ml-2 fill-current text-black dark:text-white transform', {
            '-rotate-180': toggleNav === true,
          })}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-5 -8 24 24"
          width="28"
          height="28"
          preserveAspectRatio="xMinYMin"
        >
          <path d="M7.071 5.314l4.95-4.95a1 1 0 1 1 1.414 1.414L7.778 7.435a1 1 0 0 1-1.414 0L.707 1.778A1 1 0 1 1 2.121.364l4.95 4.95z"></path>
        </svg>
      </button>
      <div
        className={cx('p-0 my-7 mx-auto block fill-current text-substrateDark dark:text-white w-8/12', {
          hidden: !toggleNav,
        })}
      >
        <ModalButton className="fixed" />
        {menu.map(item => {
          const page = configNav[item];
          return <MobileMenu page={page} currentPath={currentPath} key={item} />;
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
