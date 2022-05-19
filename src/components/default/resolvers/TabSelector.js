import * as React from 'react';

export const TabSelector = ({ isActive, children, onClick }) => (
  <button
    className={`mr-8 group inline-flex items-center px-2 py-4 border-b-2 font-medium text-sm leading-5 cursor-pointer whitespace-nowrap ${
      isActive
        ? 'border-indigo-500 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700'
        : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 focus:text-gray-600 focus:border-gray-300'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);
