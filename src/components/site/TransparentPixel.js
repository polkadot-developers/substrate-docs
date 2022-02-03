import React from 'react';

/* PhishFort anti-scam */
export default function TransparentPixel() {
  return (
    <img
      className="opacity-0 absolute h-0 -z-10"
      src="https://cloudcdn-img.com/static/sbs/spacer.gif"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
