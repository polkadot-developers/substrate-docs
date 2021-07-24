import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface TextButtonProps {
  link: string
  children: string
  external?: boolean
}

export function TextButton(props: TextButtonProps) {
  return (
    <>
      {props.external ? (
        <div>
          <a
            className="mr-2 transform transition-all duration-300 ease-in-out hover:mr-4 text-xl font-bold border-b-2 border-substrateDark"
            href={props.link}
            target="_blank"
            rel="noreferrer"
          >
            {props.children}
          </a>
          <span>&#10132;</span>
        </div>
      ) : (
        <div>
          <LocalizedLink
            className="mr-2 transform transition-all duration-300 ease-in-out hover:mr-4 text-xl font-bold border-b-2 border-substrateDark"
            to={props.link}
          >
            {props.children}
          </LocalizedLink>
          <span>&#10132;</span>
        </div>
      )}
    </>
  )
}
