import * as React from 'react';

function SvgCollapse(props) {
  return (
    <svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
      <path d="M20 1.41L14.71 6.7L18 10H10V2L13.29 5.29L18.59 0L20 1.41ZM1.41 20L6.7 14.71L10 18V10H2L5.29 13.29L0 18.59L1.41 20Z" />
    </svg>
  );
}

export default SvgCollapse;
