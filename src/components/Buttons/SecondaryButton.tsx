import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface SecondaryButtonProps {
  link: string
  children: string
  external?: boolean
}
export function SecondaryButton(props: SecondaryButtonProps) {
  const styles =
    'bg-substrateDark transform transition duration-300 ease-in-out text-white font-bold text-xl py-4 px-5 rounded hover:bg-opacity-80'
  return (
    <>
      {props.external ? (
        <a
          className={styles}
          href={props.link}
          target="_blank"
          rel="noreferrer"
        >
          {props.children}
        </a>
      ) : (
        <LocalizedLink className={styles} to={props.link}>
          {props.children}
        </LocalizedLink>
      )}
    </>
  )
}
