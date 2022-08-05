import * as React from 'react';

function SvgDiamondYellow(props) {
  return (
    <svg width={35} height={40} fill="none" viewBox="0 0 35 40" {...props}>
      <path fill="#FECD8B" d="M4.07262e-06 0.00219895L17.5 9.99989L10.0866 22.7129L4.07262e-06 0.00219895Z" />
      <path fill="#FEEACE" d="M10.0866 22.7107L17.5 9.99769L35 20L17.5 30.0023L3.8147e-06 40L10.0866 22.7107Z" />
      <path
        fill="#FDAB3D"
        d="M10.0869 22.7107L0.000272751 40L0.000272978 20L0.000273205 -1.26261e-07L10.0869 22.7107Z"
      />
    </svg>
  );
}

export default SvgDiamondYellow;
