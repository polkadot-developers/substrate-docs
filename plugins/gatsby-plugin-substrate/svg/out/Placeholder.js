import * as React from 'react';

function SvgPlaceholder(props) {
  return (
    <svg width={80} height={80} fill="none" viewBox="0 0 80 80" {...props}>
      <path fill="#DFE2E6" d="M0 0H80V80H0z" />
    </svg>
  );
}

export default SvgPlaceholder;
