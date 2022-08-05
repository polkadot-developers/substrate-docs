import { useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';

import { useSiteMenus } from '../hooks/use-site-menus';
import { buildSubMenu, LinkMenu } from './Link';

const NavFooter = () => {
  const { t } = useTranslation();
  const { menus } = useSiteMenus();
  return (
    <nav className="m-0 p-0 hidden xs:block lg:w-full lg:max-w-screen md:h-auto">
      <ul className="h-[700px] sm:h-auto m-0 p-0 list-none flex flex-wrap flex-col flex-start">
        {menus.main.map(menuItem => {
          const subMenu = buildSubMenu(menus, menuItem);
          return (
            <li key={menuItem.id} className="m-0 pb-4 w-1/2 sm:w-full sm:flex sm:items-start text-base sm:text-lg">
              <span className="block mb-4 font-semibold text-substrateGreen sm:w-28 leading-relaxed">
                {t(menuItem.id)}
              </span>
              {subMenu && (
                <ul className="m-0 p-0 list-none ml-0 sm:ml-7 sm:flex sm:flex-wrap sm:w-full text-sm sm:text-base sm:mt-0.5">
                  {subMenu.map(subMenuItem => {
                    const child = subMenuItem.child;
                    const childMenu = menus[child];
                    const itemStyle = 'p-0 m-0 underline-anchor pb-4 sm:mr-6 leading-relaxed';

                    return (
                      <React.Fragment key={subMenuItem.id}>
                        {childMenu ? (
                          childMenu.map(childMenuItem => {
                            return (
                              <li key={childMenuItem.id} className={itemStyle}>
                                <LinkMenu
                                  prefix={menuItem.url + subMenuItem.url}
                                  slug={childMenuItem.url}
                                  internal={childMenuItem.internal}
                                >
                                  {t(childMenuItem.id)}
                                </LinkMenu>
                              </li>
                            );
                          })
                        ) : (
                          <li key={subMenuItem.id} className={itemStyle}>
                            <LinkMenu prefix={menuItem.url} slug={subMenuItem.url} internal={subMenuItem.internal}>
                              {t(subMenuItem.id)}
                            </LinkMenu>
                          </li>
                        )}
                      </React.Fragment>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export { NavFooter };
