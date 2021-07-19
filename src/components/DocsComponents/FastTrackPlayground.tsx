import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface FastTrackPlaygroundProps {
  title: string
  description: string
  playgroundLink: string
}

export function FastTrackPlayground({
  title,
  description,
  playgroundLink,
}: FastTrackPlaygroundProps) {
  return (
    <>
      <div className="max-w-sm rounded-lg border border-gray-200">
        <div className="flex items-center px-4 py-4 rounded-t-lg bg-green-200">
          <svg
            className="fill-current text-black"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 0C4.03106 0 0 4.03106 0 9C0 13.9689 4.03106 18 9 18C13.9689 18 18 13.9689 18 9C18 4.03106 13.9689 0 9 0ZM9 16.1964C5.03206 16.1964 1.80361 12.9679 1.80361 9C1.80361 5.03206 5.03206 1.80361 9 1.80361C12.9679 1.80361 16.1964 5.03206 16.1964 9C16.1964 12.9679 12.9679 16.1964 9 16.1964ZM9.67635 2.68738L5.61824 10.3527H8.4499V15.3126L12.3818 7.64729H9.67635V2.68738Z" />
          </svg>
          <span className="text-sm pl-2 font-medium dark:text-black">
            Launch a Node Template From Your Browser
          </span>
        </div>
        <div className="px-4 pb-4">
          <h3>{title}</h3>
          <p className="pb-2">{description}</p>
          <LocalizedLink className="mx-auto" to={playgroundLink}>
            <div className="flex items-center justify-center py-2 rounded-lg bg-black dark:bg-gray-800 hover:no-underline">
              <button className="text-lg text-white font-bold focus:outline-none hover:no-underline">
                Set up Playground
              </button>
            </div>
          </LocalizedLink>
        </div>
      </div>
    </>
  )
}
