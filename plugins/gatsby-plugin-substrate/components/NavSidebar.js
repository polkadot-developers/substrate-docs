import cx from 'classnames';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';

import { DataContext } from '../contexts/DataContext';
import { useSiteMenus } from '../hooks/use-site-menus';
import { Link, LinkMenu } from './Link';

const NavSidebarCaseStudySubMenu = ({ teams }) => {
  const caseStudies = teams.filter(team => 'caseStudy' in team);

  return (
    <>
      <span className="px-6 p-4 block bg-substrateGray dark:bg-gray-700 font-bold mb-2">Case Studies</span>
      <ul className="p-0 m-0 list-none">
        {caseStudies &&
          caseStudies.map(({ name, caseStudy }, idx) => {
            return (
              <li className="font-medium p-0 m-0" key={idx}>
                <Link to={`/ecosystem/projects/${caseStudy}`}>
                  <p className={cx('px-6 p-3 block hover:font-bold m-0')}>{name}</p>
                </Link>
              </li>
            );
          })}
      </ul>
    </>
  );
};

const filterMenuItem = (menu, parent) => {
  const parentItem = menu.filter(function (menuItem) {
    return menuItem.url.includes(parent);
  });
  return Object.assign(...parentItem);
};

const NavSidebarSubMenu = ({ parent, category }) => {
  const { t } = useTranslation();
  const { menus } = useSiteMenus();
  const parentItem = filterMenuItem(menus.main, parent);
  const categoryItem = filterMenuItem(menus[parent], category);
  const subMenu = menus[category];

  return (
    <>
      <span className="px-6 p-4 block bg-substrateGray dark:bg-gray-700 font-bold mb-2">{t(categoryItem.id)}</span>
      <ul className="p-0 m-0 list-none">
        {subMenu &&
          subMenu.map(subMenuItem => {
            return (
              <li className="font-medium p-0 m-0" key={subMenuItem.id}>
                <LinkMenu
                  className={cx('px-6 p-3 block hover:font-bold')}
                  prefix={parentItem.url + categoryItem.url}
                  slug={subMenuItem.url}
                  internal={subMenuItem.internal}
                >
                  {t(subMenuItem.id)}
                </LinkMenu>
              </li>
            );
          })}
      </ul>
    </>
  );
};

const NavSidebar = ({ data }) => {
  return (
    <DataContext.Consumer>
      {({ pathArray }) => (
        <nav className={cx('navSidebar pt-10 pb-5')}>
          {pathArray[2] === 'case-studies' ? (
            <NavSidebarCaseStudySubMenu teams={data} />
          ) : (
            <NavSidebarSubMenu parent={pathArray[0]} category={pathArray[1]} />
          )}
        </nav>
      )}
    </DataContext.Consumer>
  );
};

export { NavSidebar };
