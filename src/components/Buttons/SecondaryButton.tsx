import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface SecondaryButtonProps {
  link: string
  children: string
  external?: boolean
  cta?: boolean
}
export function SecondaryButton(props: SecondaryButtonProps) {
  // const textSize = () => (props.cta ? `text-xl py-3 px-8` : `text-lg py-1 px-7`)
  return (
    <>
      {props.external ? (
        <a href={props.link} target="_blank" rel="noreferrer">
          <div className="bg-substrateDark dark:bg-substrateGray-light px-5 py-2 inline-block rounded-md hover:opacity-80 transition-opacity">
            <div className="font-bold mb-0 text-white dark:text-black">
              {props.children}
            </div>
          </div>
        </a>
      ) : (
        <LocalizedLink to={props.link}>
          <div className="bg-substrateDark dark:bg-substrateGray-light px-5 py-2 inline-block rounded-md hover:opacity-80 transition-opacity">
            <div className="font-bold mb-0 text-white dark:text-black">
              {props.children}
            </div>
          </div>
        </LocalizedLink>
      )}
    </>
  )
}
