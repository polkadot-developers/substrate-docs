import cx from 'classnames';
import React from 'react';

const Sidebar = ({ children }) => {
  return (
    <div>
      <div className="hidden lg:inline-block lg:flex-none lg:bg-substrateGray-light lg:dark:bg-substrateDark border-r border-gray-200 dark:border-gray-700 h-full">
        <div className={cx('sticky top-20', {})}>
          <div className={cx('h-screen pb-24 overflow-y-scroll nav-sidebar', {})}>
            <div className="relative">
              <div className={cx('w-64 pl-6 pr-4 z-0 transition-all transform pb-10')}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
