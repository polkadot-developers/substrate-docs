import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface PrimaryButtonProps {
  link: string
  children: string
  external?: boolean
  cta?: boolean
}
export function PrimaryButton(props: PrimaryButtonProps) {
  return (
    <>
      {props.external ? (
        <a
          className={`${props.cta ? `primary-cta` : `primary`} effect`}
          href={props.link}
          target="_blank"
          rel="noreferrer"
        >
          {props.children}
        </a>
      ) : (
        <LocalizedLink
          className={`${props.cta ? `primary-cta` : `primary`} effect`}
          to={props.link}
        >
          {props.children}
        </LocalizedLink>
      )}
    </>
  )
}
