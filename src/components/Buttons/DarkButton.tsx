import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface DarkButtonProps {
  external: boolean
  text: string
  link: string
}
export function DarkButton({ external, text, link }: DarkButtonProps) {
  return (
    <>
      {external ? (
        <a
          className="inline-block my-1"
          href={link}
          target="_blank"
          rel="noreferrer"
        >
          <button className="px-8 py-2 text-lg text-white font-bold rounded-lg bg-black hover:bg-opacity-90 dark:bg-gray-800 hover:no-underline focus:outline-none">
            {text}
          </button>
        </a>
      ) : (
        <LocalizedLink className="inline-block my-1" to={link}>
          <button className="px-8 py-2 text-lg text-white font-bold rounded-lg bg-black hover:bg-opacity-90 dark:bg-gray-800 hover:no-underline focus:outline-none">
            {text}
          </button>
        </LocalizedLink>
      )}
    </>
  )
}
