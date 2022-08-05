import cx from 'classnames';
import React from 'react';

import { Icon } from './Icon';
import { Link } from './Link';

const PrimaryButtonLink = ({ children, link, onClick, fullWidth = false, slim = false }) => {
  return (
    <Link to={link}>
      <div
        onClick={onClick}
        className={cx('primary-button group bg-substrateGreen inline-flex relative rounded-md overflow-hidden', {
          'w-full justify-center': fullWidth,
        })}
      >
        <p
          className={cx('font-bold text-white mb-0 transition-all mx-6 group-hover:ml-4 group-hover:mr-8', {
            'py-3': !slim,
            'py-2': slim,
          })}
        >
          {children}
        </p>
        <div
          className={cx(
            'bg-substrateGreen-dark absolute flex h-full transition-transform fill-current text-white px-1 -right-5 group-hover:-translate-x-5'
          )}
        >
          <Icon name="arrow-more" className="self-center" />
        </div>
      </div>
    </Link>
  );
};

export { PrimaryButtonLink };
