import * as React from 'react';

function SvgWaLogo(props) {
  return (
    <svg xmlnsXlink="http://www.w3.org/1999/xlink" width={48} height={48} viewBox="0 0 48 48" {...props}>
      <defs>
        <path id="wa-logo_svg__a" d="M0 0H48V48H0z" />
      </defs>
      <clipPath id="wa-logo_svg__b">
        <use overflow="visible" xlinkHref="#wa-logo_svg__a" />
      </clipPath>
      <path
        d="M29.5,0c0,0.1,0,0.2,0,0.3c0,3-2.5,5.5-5.5,5.5c-3,0-5.5-2.5-5.5-5.5 c0-0.1,0-0.2,0-0.3H0v48h48V0H29.5z M22.9,42.9l-2.3-11.6h-0.1L18,42.9h-3.2l-3.6-17h3.2l2.2,11.6h0l2.6-11.6h3l2.4,11.7h0L27,25.9 h3.1l-4.1,17H22.9z M40.4,42.9l-1.1-3.8h-5.7l-0.8,3.8h-3.2l4.1-17h5l5,17H40.4z"
        clipPath="url(#wa-logo_svg__b)"
      />
      <path d="M35.6 30.1L34.2 36.3 38.6 36.3 37 30.1z" clipPath="url(#wa-logo_svg__b)" />
    </svg>
  );
}

export default SvgWaLogo;
