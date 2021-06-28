import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import arrow from '../../images/previous-arrow.svg'

interface PreviousButtonProps {
  text: string
  link: string
}
export function PreviousButton({ text, link }: PreviousButtonProps) {
  return (
    <>
      <LocalizedLink className="inline-block" to={link}>
        <div className="flex items-center justify-center w-80 h-16 rounded-lg border-2 border-black hover:no-underline">
          <img src={arrow} alt="Substrate Button Previous" />
          <button className="text-lg text-black font-bold pl-4 focus:outline-none hover:no-underline">
            Back - {text}
          </button>
        </div>
      </LocalizedLink>
    </>
  )
}
