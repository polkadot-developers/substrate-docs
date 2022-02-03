import cx from 'classnames';
import React from 'react';

import Icon from '../default/Icon';
import { Link } from '../default/Link';

const LineArrowButton = ({ link, className, primary, centered, large, children, icon = 'arrow-more' }) => {
  if (link) {
    return (
      <Link to={link}>
        <LineArrowButtonContent className={className} primary={primary} centered={centered} large={large} icon={icon}>
          {children}
        </LineArrowButtonContent>
      </Link>
    );
  }

  return (
    <LineArrowButtonContent className={className} primary={primary} centered={centered} large={large} icon={icon}>
      {children}
    </LineArrowButtonContent>
  );
};

const LineArrowButtonContent = ({ className, primary, centered, large, children, icon = 'arrow-more' }) => {
  return (
    <div className={className}>
      <p
        className={cx('font-bold pb-1 mr-0.5 border-b-2 inline hover:mr-2 transition-all', {
          'border-substrateGreen text-substrateGreen': primary,
          'border-black dark:border-white': !primary,
          'md:text-lg': large,
          'hover:ml-1.5': centered,
        })}
      >
        {children}
      </p>{' '}
      <span className="fill-current dark:text-white inline-block">
        <Icon
          name={icon}
          className={cx({
            'fill-current text-substrateGreen': primary,
            'w-3 h-3': icon === 'external-link',
          })}
        />
      </span>
    </div>
  );
};

export default LineArrowButton;
