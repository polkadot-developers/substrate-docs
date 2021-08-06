import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface SecondaryButtonProps {
  link: string
  children: string
  external?: boolean
  cta?: boolean
}
export function SecondaryButton(props: SecondaryButtonProps) {
  const textSize = () => (props.cta ? `text-xl py-3 px-8` : `text-lg py-1 px-7`)
  const styles =
    'bg-substrateDark transform transition duration-300 ease-in-out text-white font-bold rounded border-2 border-transparent hover:bg-opacity-80'
  return (
    <>
      {props.external ? (
        <a
          className={`${styles} ${textSize()}`}
          href={props.link}
          target="_blank"
          rel="noreferrer"
        >
          {props.children}
        </a>
      ) : (
        <LocalizedLink className={`${styles} ${textSize()}`} to={props.link}>
          {props.children}
        </LocalizedLink>
      )}
    </>
  )
}
