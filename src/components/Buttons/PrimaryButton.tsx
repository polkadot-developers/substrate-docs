import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface PrimaryButtonProps {
  link: string
  children: string
  external?: boolean
  cta?: boolean
}
export function PrimaryButton(props: PrimaryButtonProps) {
  const textSize = () => (props.cta ? `text-xl` : `text-lg`)
  const padding = () => (props.cta ? `py-3 px-8` : `py-1 px-7`)
  return (
    <>
      {props.external ? (
        <a
          className={`bg-substrateGreen ${padding()} hover:bg-white border-2 border-transparent hover:border-substrateGreen rounded text-white hover:text-substrateGreen transform transition duration-300 ease-in-out`}
          href={props.link}
          target="_blank"
          rel="noreferrer"
        >
          <button className={`focus:outline-none font-bold ${textSize()}`}>{props.children}</button>
        </a>
      ) : (
        <LocalizedLink
          className={`bg-substrateGreen ${padding()} hover:bg-white border-2 border-transparent hover:border-substrateGreen rounded text-white hover:text-substrateGreen transform transition duration-300 ease-in-out`}
          to={props.link}
        >
          <button className={`focus:outline-none font-bold ${textSize()}`}>{props.children}</button>
        </LocalizedLink>
      )}
    </>
  )
}
