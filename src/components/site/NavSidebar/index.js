import React from 'react';

import configNav from '../../../../content/config/nav.yaml';
import Menu from './Menu';

const NavSidebar = ({ currentPath }) => {
  const { menu } = configNav;
  return menu.map(item => {
    const page = configNav[item];
    return <Menu page={page} currentPath={currentPath} key={item} />;
  });
};

export default NavSidebar;
