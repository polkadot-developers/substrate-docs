import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface FastTrackPlaygroundProps {
  title: string
  description: string
  playgroundLink: string
  header: string
}

export function FastTrackPlayground({
  title,
  header,
  description,
  playgroundLink,
}: FastTrackPlaygroundProps) {
  return (
    <>
      <div className="max-w-sm rounded bg-substrateGray-light">
        <div className="px-6 py-3 rounded-t-lg bg-substrateGreen">
          <span className="text-sm text-white font-bold dark:text-black">
            {header}
          </span>
        </div>
        <div className="px-6 pb-4">
          <h3>{title}</h3>
          <p className="pb-2">{description}</p>
          <LocalizedLink className="mx-auto" to={playgroundLink}>
            <div className="flex items-center justify-center w-full h-14 rounded bg-substrateDark transform transition duration-300 ease-in-out hover:bg-opacity-90">
              <button className="text-lg text-white font-bold focus:outline-none">
                Set up Playground
              </button>
            </div>
          </LocalizedLink>
        </div>
      </div>
    </>
  )
}
