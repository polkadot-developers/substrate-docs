import React from 'react';

import Icon from '../default/Icon';

export function TextButton(props) {
  const textSize = () => (props.cta ? 'text-xl' : 'text-lg');
  const accentStyle = () =>
    props.accent
      ? `text-substrateGreen dark:text-substrateGreen border-substrateGreen`
      : `border-substrateDark dark:border-white`;
  return (
    <>
      {props.external ? (
        <div className={props.className}>
          <a href={props.link} target="_blank" rel="noreferrer">
            <p
              className={`font-bold pb-1 mr-0.5 border-b-2 inline hover:mr-2 transition-all ${textSize()} ${accentStyle()}`}
            >
              {props.children}
            </p>{' '}
            <span className={`fill-current text-substrateDark dark:text-white inline-block ${accentStyle()}`}>
              <Icon name="arrow-more" />
            </span>
          </a>
        </div>
      ) : (
        <div className={props.className}>
          <p
            className={`font-bold pb-1 mr-0.5 border-b-2 inline hover:mr-2 transition-all ${textSize()} ${accentStyle()}`}
          >
            {props.children}
          </p>{' '}
          <span className={`fill-current text-substrateDark dark:text-white inline-block ${accentStyle()}`}>
            <Icon name={`arrow-more`} />
          </span>
        </div>
      )}
    </>
  );
}
