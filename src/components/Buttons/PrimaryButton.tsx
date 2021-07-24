import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface PrimaryButtonProps {
  link: string
  children: string
  external?: boolean
}
export function PrimaryButton(props: PrimaryButtonProps) {
  return (
    <>
      {props.external ? (
        <a
          className="primary effect"
          href={props.link}
          target="_blank"
          rel="noreferrer"
        >
          {props.children}
        </a>
      ) : (
        <LocalizedLink className="primary effect" to={props.link}>
          {props.children}
        </LocalizedLink>
      )}
    </>
  )
}
