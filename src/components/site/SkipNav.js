import React from 'react';

export default function SkipNav({ main }) {
  return (
    <a
      onClick={e => {
        e.preventDefault();
        main.current.focus({ preventScroll: true });
      }}
      href=""
      className="fixed -top-20 left-4 xl:left-8 z-50 focus:top-5 py-3 px-6 bg-substrateBlackish rounded"
    >
      Skip navigation
    </a>
  );
}
