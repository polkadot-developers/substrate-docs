import * as React from 'react';

function SvgReference(props) {
  return (
    <svg width={14} height={18} fill="none" viewBox="0 0 14 18" {...props}>
      <path d="M12 0H2C0.9 0 0 0.9 0 2V18L7 15L14 18V2C14 0.9 13.1 0 12 0ZM12 15L7 12.82L2 15V2H12V15Z" />
    </svg>
  );
}

export default SvgReference;
