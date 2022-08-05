import * as React from 'react';

function SvgGovernance(props) {
  return (
    <svg width={60} height={60} fill="none" viewBox="0 0 60 60" {...props}>
      <g clipPath="url(#governance_svg__clip0)">
        <path d="M44.25 39.125H40.5V24.0963C40.5 22.8718 39.4908 21.875 38.25 21.875H33V24.75H37.5V42H44.25C44.6644 42 45 41.6783 45 41.2812V39.8437C45 39.4466 44.6644 39.125 44.25 39.125ZM29.6362 19.0453L20.6363 21.2797C19.9683 21.4455 19.5 22.0412 19.5 22.7249V39.125H15.75C15.3356 39.125 15 39.4466 15 39.8437V41.2812C15 41.6783 15.3356 42 15.75 42H31.5V20.4905C31.5 19.5211 30.5831 18.8099 29.6362 19.0453ZM27.375 31.9375C26.7539 31.9375 26.25 31.2937 26.25 30.5C26.25 29.7062 26.7539 29.0625 27.375 29.0625C27.9961 29.0625 28.5 29.7062 28.5 30.5C28.5 31.2937 27.9961 31.9375 27.375 31.9375Z" />
      </g>
      <defs>
        <clipPath id="governance_svg__clip0">
          <path fill="#fff" d="M0 0H30V23H0z" transform="translate(15 19)" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgGovernance;
