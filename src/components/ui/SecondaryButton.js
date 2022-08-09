// import { createExporterCache } from 'babel-plugin-i18next-extract/exporters';
import cx from 'classnames';
import React from 'react';

import { Link } from '../default/Link';

const SecondaryButton = ({ children, link, hero, fullWidth }) => {
  return (
    <>
      {link ? (
        <Link to={link}>
          <Button hero={hero} fullWidth={fullWidth}>
            {children}
          </Button>
        </Link>
      ) : (
        <Button hero={hero} fullWidth={fullWidth}>
          {children}
        </Button>
      )}
    </>
  );
};

const Button = ({ hero, fullWidth, children }) => {
  return (
    <div
      className={cx(
        'bg-substrateBlackish dark:bg-substrateDarkThemeLightGrey inline-block rounded-md hover:opacity-80',
        {
          'px-8 py-4 text-xl': hero,
          'px-5 py-2': !hero,
          'w-full sm:w-auto': fullWidth,
        }
      )}
    >
      <div className="font-bold mb-0 text-white dark:text-black">{children}</div>
    </div>
  );
};

export default SecondaryButton;
