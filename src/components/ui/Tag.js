import React from 'react';

export default function Tag(props) {
  return (
    <button className="inline-block bg-substratePink dark:bg-substrateDark bg-opacity-10 mt-4 mr-4 px-4 py-2 border border-substratePink dark:border-substrateWhite rounded cursor-text">
      {props.title}
    </button>
  );
}
