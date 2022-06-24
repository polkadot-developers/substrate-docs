// import { createExporterCache } from 'babel-plugin-i18next-extract/exporters';
import cx from 'classnames';
import React from 'react';

import { Link } from '../default/Link';

const SecondaryButton = ({ children, link, hero }) => {
  return (
    <Link to={link} className="secondary-button">
      <div
        className={cx(
          'bg-substrateBlackish dark:bg-substrateDarkThemeLightGrey inline-block rounded-md hover:opacity-80 transition-opacity',
          {
            'px-8 py-4 text-xl': hero,
            'px-5 py-3': !hero,
          }
        )}
      >
        <div className="font-bold mb-0 text-white dark:text-black">{children}</div>
      </div>
    </Link>
  );
};

export default SecondaryButton;
