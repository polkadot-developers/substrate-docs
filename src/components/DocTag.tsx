import React from 'react'

interface DocTagProps {
  difficulty: number
  duration?: string
}

export default function DocTag(props: DocTagProps) {
  return (
    <>
      <div className="inline-block text-xs mb-5">
        <button className="bg-substrateBlue dark:bg-substrateDark bg-opacity-5 px-4 py-2 border border-substratePurple dark:border-substrateWhite border-opacity-30 rounded cursor-text">
          {props.difficulty === 1
            ? 'Beginner'
            : props.difficulty === 2
            ? 'Intermediate'
            : props.difficulty === 3
            ? 'Advanced'
            : null}
        </button>
        {props.duration && (
          <button className="bg-substrateBlue dark:bg-substrateDark bg-opacity-5 ml-4 px-4 py-2 border border-substratePurple dark:border-substrateWhite border-opacity-30 rounded cursor-text">
            <svg
              className="inline-block -mt-0.5 fill-current text-black dark:text-white"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.02622 0C10.8539 0 14 3.14607 14 7.02622C14 10.8539 10.8539 14 7.02622 14C3.14607 14 0 10.8539 0 7.02622C0 3.14607 3.14607 0 7.02622 0ZM6.29213 3.1985C6.29213 2.51685 7.34082 2.51685 7.34082 3.1985V6.92135L9.75281 7.603C10.382 7.81273 10.1199 8.80899 9.4382 8.65168L6.71161 7.81273C6.44944 7.7603 6.29213 7.55056 6.29213 7.28839V3.1985ZM7.02622 1.04869C3.72285 1.04869 1.04869 3.72285 1.04869 7.02622C1.04869 10.2772 3.72285 12.9513 7.02622 12.9513C10.2772 12.9513 12.9513 10.2772 12.9513 7.02622C12.9513 3.72285 10.2772 1.04869 7.02622 1.04869Z" />
            </svg>
            <span className="ml-2">{props.duration}</span>
          </button>
        )}
      </div>
    </>
  )
}
