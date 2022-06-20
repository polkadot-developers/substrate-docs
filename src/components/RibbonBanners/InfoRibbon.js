import React from 'react';

export default function InfoRibbon() {
  return (
    <div
      className="flex flex-row bg-blue-100 border-l border-r border-t border-b border-blue-500 w-100 h-16 text-blue-700 px-4 py-3 items-center content-center"
      role="alert"
    >
      <svg
        className="fill-current lg:w-5 lg:h-5 md:w-5 md:h-5 sm:h-8 sm:w-8 xs:h-8 xs:w-8 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 15"
      >
        <path
          d="M7.00065 0.833344C3.32065 0.833344 0.333984 3.82001 0.333984 7.50001C0.333984 11.18 3.32065 14.1667 7.00065 14.1667C10.6807 14.1667 13.6673 11.18 13.6673 7.50001C13.6673 3.82001 10.6807 0.833344 7.00065 0.833344ZM7.66732 10.8333L6.33398 10.8333V6.83334H7.66732V10.8333ZM7.66732 5.50001H6.33398L6.33398 4.16668H7.66732L7.66732 5.50001Z"
          fill="#5289F1"
        />
      </svg>
      <p className="mb-0 leading-4">
        We are updating the documentation. Some content might be unavailable. Learn more about{' '}
        <a
          href="https://github.com/substrate-developer-hub/substrate-docs/blob/main-md/doc-update-roadmap.md"
          className="hover:opacity-90 underline"
        >
          documentation updates
        </a>
        .
      </p>
    </div>
  );
}
