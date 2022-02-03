import { useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';

import { useSiteMenus } from '../../hooks/use-site-menus';
import { Link } from '../default/Link';

const NavExtra = () => {
  const { t } = useTranslation();
  const { menus } = useSiteMenus();
  return (
    <nav>
      <ul>
        {menus.extra.map(menuItem => {
          return (
            <li key={menuItem.id}>
              <span>
                <Link to={menuItem.url}>
                  {t(menuItem.id, {
                    fallbackLng: 'en',
                  })}
                </Link>
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavExtra;
