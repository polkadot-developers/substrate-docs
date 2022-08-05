import * as React from 'react';

function SvgMoon(props) {
  return (
    <svg width={24} height={24} preserveAspectRatio="xMinYMin" viewBox="-4 -2 24 24" {...props}>
      <path d="M12.253.335A10.086 10.086 0 0 0 8.768 8c0 4.632 3.068 8.528 7.232 9.665A9.555 9.555 0 0 1 9.742 20C4.362 20 0 15.523 0 10S4.362 0 9.742 0c.868 0 1.71.117 2.511.335z" />
    </svg>
  );
}

export default SvgMoon;
