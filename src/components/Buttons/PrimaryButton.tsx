import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface PrimaryButtonProps {
  link: string
  children: string
  external?: boolean
  cta?: boolean
}
export function PrimaryButton(props: PrimaryButtonProps) {
  const textSize = () => (props.cta ? `text-xl py-4 px-8` : `text-lg py-2 px-8`)
  const buttonStyle =
    'bg-substrateGreen font-bold text-white rounded focus:outline-none'
  const hoverStyle =
    'transform transition-all duration-300 ease-in-out hover:bg-white dark:hover:bg-black hover:text-substrateGreen hover:ring-2 hover:ring-substrateGreen'
  return (
    <>
      {props.external ? (
        <a
          className="flex rounded hover:shadow active:shadow-none"
          href={props.link}
          target="_blank"
          rel="noreferrer"
        >
          <button className={`${buttonStyle} ${textSize()} ${hoverStyle} `}>
            {props.children}
          </button>
          <div className="flex items-center bg-green-500 w-0 rounded-tr rounded-br transform transition-all group-hover:w-6 group-hover:justify-center">
            <span className="text-white text-sm">&#10132;</span>
          </div>
        </a>
      ) : (
        <LocalizedLink className="" to={props.link}>
          <button className={`${buttonStyle} ${textSize()} ${hoverStyle} `}>
            {props.children}
          </button>
        </LocalizedLink>
      )}
    </>
  )
}
