import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface SecondaryButtonProps {
  link: string
  children: string
  external?: boolean
  cta?: boolean
}
export function SecondaryButton(props: SecondaryButtonProps) {
  const textSize = () => (props.cta ? `text-xl py-4 px-5` : `text-lg py-2 px-4`)
  console.log(textSize)
  const styles =
    'bg-substrateDark transform transition duration-300 ease-in-out text-white font-bold rounded hover:bg-opacity-80'
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
