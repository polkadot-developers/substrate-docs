import { useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';

import { useSiteMenus } from '../hooks/use-site-menus';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { Icon } from './Icon';
import { Link } from './Link';

const NavLegal = () => {
  const { t } = useTranslation();
  const { menus } = useSiteMenus();
  const { siteMetadata } = useSiteMetadata();

  return (
    <>
      <div className="flex items-center py-4">
        <Link
          className="mr-11 md:mr-0 md:ml-9 transform transition-all duration-300 ease-in-out hover:opacity-50"
          to={siteMetadata.element}
          aria-label="Element"
        >
          <Icon name="element" />
        </Link>
        <Link
          className="mr-11 md:mr-0 md:ml-9 transform transition-all duration-300 ease-in-out hover:opacity-50"
          to={siteMetadata.stackexchange}
          aria-label="Stack Exchange"
        >
          <Icon name="stack-exchange" />
        </Link>
        <Link
          className="mr-11 md:mr-0 md:ml-9 transform transition-all duration-300 ease-in-out hover:opacity-50"
          to={siteMetadata.github}
          aria-label="Github"
        >
          <Icon name="github" className="fill-current text-white w-6 h-6" />
        </Link>
        <Link
          className="mr-11 md:mr-0 md:ml-9 transform transition-all duration-300 ease-in-out hover:opacity-50"
          to={siteMetadata.twitter}
          aria-label="Twitter"
        >
          <Icon name="twitter" />
        </Link>
      </div>
      <div className="underline-anchor inline-flex flex-col md:flex-row py-6 text-[#DFE3EA] text-xs font-light">
        <div className="mb-4 md:mb-0 md:pr-8 inline-block">
          © {new Date().getFullYear()} Parity Technologies{` `}All Rights Reserved{` `}
        </div>
        <ul className="m-0 list-none">
          {menus.legal.map(menuItem => {
            return (
              <li key={menuItem.id} className="m-0 mb-4 md:mb-0 md:pr-8 block md:inline-block font-light">
                <Link to={menuItem.url}>{t(menuItem.id)}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export { NavLegal };
