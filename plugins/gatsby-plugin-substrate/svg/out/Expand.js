import * as React from 'react';

function SvgExpand(props) {
  return (
    <svg width={18} height={18} fill="none" viewBox="0 0 18 18" {...props}>
      <path d="M18 8V0H10L13.29 3.29L3.29 13.29L0 10V18H8L4.71 14.71L14.71 4.71L18 8Z" />
    </svg>
  );
}

export default SvgExpand;
