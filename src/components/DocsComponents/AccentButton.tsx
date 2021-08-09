import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface AccentButtonProps {
  text: string
  link: string
}
export function AccentButton({ text, link }: AccentButtonProps) {
  return (
    <>
      <LocalizedLink className="md-button group inline-block my-6" to={link}>
        <div className="flex items-center justify-center w-60 h-14 rounded bg-substrateGreen transform transition duration-300 ease-in-out group-hover:bg-white border-2 border-transparent group-hover:border-substrateGreen">
          <button className="text-lg text-white group-hover:text-substrateGreen dark:text-substrateDark font-bold focus:outline-none">
            {text}
          </button>
        </div>
      </LocalizedLink>
    </>
  )
}
