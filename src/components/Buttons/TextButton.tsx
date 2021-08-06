import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface TextButtonProps {
  link: string
  children: string
  accent?: boolean
  cta?: boolean
  external?: boolean
}

export function TextButton(props: TextButtonProps) {
  const textSize = () => (props.cta ? 'text-xl' : 'text-lg')
  const accentStyle = () =>
    props.accent
      ? `text-substrateGreen border-substrateGreen`
      : `border-substrateDark`
  return (
    <>
      {props.external ? (
        <div className="block">
          <a
            className={`mr-2 transform transition-all duration-300 ease-in-out hover:mr-4 ${textSize()} font-bold border-b-2 ${accentStyle()}`}
            href={props.link}
            target="_blank"
            rel="noreferrer"
          >
            {props.children}
          </a>
          <span className={`${props.accent ? `text-substrateGreen` : null}`}>
            &#10132;
          </span>
        </div>
      ) : (
        <div className="block">
          <LocalizedLink
            className={`mr-2 transform transition-all duration-300 ease-in-out hover:mr-4 ${textSize()} font-bold border-b-2 ${accentStyle()}`}
            to={props.link}
          >
            {props.children}
          </LocalizedLink>
          <span className={`${props.accent ? `text-substrateGreen` : null}`}>
            &#10132;
          </span>
        </div>
      )}
    </>
  )
}
