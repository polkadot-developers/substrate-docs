import cx from 'classnames';
import React from 'react';

import { Icon } from './Icon';
import { Link } from './Link';

const DocCard = ({ title, text, link, cta, iconName, animationDelay }) => {
  return (
    <Link data-aos="fade-up" data-aos-delay={animationDelay} to={link}>
      <div
        className={cx(
          'w-full text-center shadow-xl bg-white p-10 md:px-6 md:py-10 xl:p-10',
          'mb-8 lg:mb-0 m:max-w-sm hover:scale-105 transition-transform lg:w-72 xl:w-96 lg:mr-8 rounded-md',
          'dark:bg-substrateDark'
        )}
      >
        <div className="flex justify-center mb-6">
          <Icon
            name={iconName}
            className="fill-current text-substrateWhite  dark:border dark:rounded-full dark:border-substrateWhite"
          />
        </div>
        <div className="lg:h-80 xl:h-60">
          <div className="text-2xl font-extrabold mb-5">{title}</div>
          <p className="leading-7">{text}</p>
        </div>
        <div className="block group">
          <span className={`text-xl font-bold pb-1 border-b-2 text-substrateGreen border-substrateGreen`}>{cta}</span>
          <span
            className={cx(
              'w-8 inline-block pl-2 transform transition-all duration-300 ease-in-out group-hover:pl-4',
              'text-substrateGreen'
            )}
          >
            &#10132;
          </span>
        </div>
      </div>
    </Link>
  );
};

export { DocCard };
