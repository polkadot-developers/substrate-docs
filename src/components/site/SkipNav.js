import React from 'react';

export default function SkipNav({ main }) {
  return (
    <a
      onClick={e => {
        e.preventDefault();
        // Workaround to prevent scrolling in Chrome
        window.setTimeout(() => {
          main.current.focus({ preventScroll: true });
        }, 0);
      }}
      href=""
      className="fixed -top-20 left-4 xl:left-8 z-50 focus:top-5 py-3 px-6 bg-substrateBlackish rounded"
    >
      Skip navigation
    </a>
  );
}
