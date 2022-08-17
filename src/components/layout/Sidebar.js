import cx from 'classnames';
import React from 'react';

const Sidebar = ({ children }) => {
  return (
    <div className="">
      <div className={cx('h-full', {})}>
        <div className={cx('h-screen overflow-x-hidden overflow-y-scroll nav-sidebar pb-12', {})}>
          <div className={cx('w-64 transition-all transform')}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
