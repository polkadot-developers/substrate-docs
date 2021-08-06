import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface PrimaryFixedButtonProps {
  link: string
  children: string
  external?: boolean
  small?: boolean
  medium?: boolean
  large?: boolean
  xlarge?: boolean
}
export function PrimaryFixedButton(props: PrimaryFixedButtonProps) {
  return (
    <>
      {props.external ? (
        <a
          className={`primary ${
            props.small
              ? `small`
              : props.medium
              ? `medium`
              : props.large
              ? 'large'
              : props.xlarge
              ? `xlarge`
              : null
          } effect`}
          href={props.link}
          target="_blank"
          rel="noreferrer"
        >
          {props.children}
        </a>
      ) : (
        <LocalizedLink
          className={`primary ${
            props.small
              ? `small`
              : props.medium
              ? `medium`
              : props.large
              ? 'large'
              : props.xlarge
              ? `xlarge`
              : null
          } effect`}
          to={props.link}
        >
          {props.children}
        </LocalizedLink>
      )}
    </>
  )
}
