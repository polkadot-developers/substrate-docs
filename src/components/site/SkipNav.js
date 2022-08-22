import React from 'react';

export default function SkipNav({ main }) {
  return (
    <a
      onClick={e => {
        e.preventDefault();
        main.current.focus();
      }}
      href=""
      className="fixed -top-20 left-4 z-50 focus:top-5 p-4 bg-substrateBlackish rounded"
    >
      Skip navigation
    </a>
  );
}
