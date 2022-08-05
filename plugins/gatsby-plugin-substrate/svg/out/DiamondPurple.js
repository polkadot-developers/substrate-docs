import * as React from 'react';

function SvgDiamondPurple(props) {
  return (
    <svg width={36} height={36} fill="none" viewBox="0 0 36 36" {...props}>
      <path fill="#A17FEB" d="M35.0651 0H6.93652L15.5 36L35.0651 0Z" />
      <path fill="#DDCDFF" d="M0 15.522L6.93575 0L15.5 36L0 15.522Z" />
      <path fill="#714CC0" d="M35.0638 0L15.5 36H31.5L35.0638 0Z" />
    </svg>
  );
}

export default SvgDiamondPurple;
