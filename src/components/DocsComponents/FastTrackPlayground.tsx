import React from 'react'

interface FastTrackPlaygroundProps {
  description: string
  playgroundLink: string
  header: string
}

export function FastTrackPlayground({
  header,
  description,
  playgroundLink,
}: FastTrackPlaygroundProps) {
  return (
    <>
      <div className="hidden lg:inline-block ml-16 float-right max-w-xs rounded bg-substrateGray-light dark:bg-substrateDark shadow-lg">
        <div className="py-3 px-6 rounded-t-lg bg-substrateGreen">
          <div className="text-lg text-white font-bold dark:text-substrateDark">{header}</div>
        </div>
        <div className="p-6">
          <p className="mb-0 pb-6">{description}</p>
          <a href={playgroundLink} className="md-button" target="_blank" rel="noreferrer">
            <button className="bg-substrateDark dark:bg-darkBackground py-3 w-full rounded text-lg text-white font-bold transform transition-all duration-300 ease-in-out hover:bg-opacity-90">
              Set up Playground
            </button>
          </a>
        </div>
      </div>
    </>
  )
}
