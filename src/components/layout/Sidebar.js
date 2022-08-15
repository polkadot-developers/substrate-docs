import cx from 'classnames';
import React from 'react';

const Sidebar = ({ children }) => {
  return (
    <div>
      <div className="hidden lg:inline-block lg:flex-none lg:bg-substrateGray-light lg:dark:bg-substrateDark border-gray-200 dark:border-gray-700 transition-height ease-in-out h-full">
        <div className={cx('sticky top-20', {})}>
          <div className={cx('h-screen overflow-x-hidden nav-sidebar', {})}>
            <div className={cx('w-64 transition-all transform pb-10')}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
