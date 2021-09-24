import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import cx from 'classnames'

interface TextButtonProps {
  link: string
  children: string
  accent?: boolean
  cta?: boolean
  external?: boolean
}

export function TextButton(props: TextButtonProps) {
  const textSize = () => (props.cta ? 'text-xl' : 'text-lg')
  const accentStyle = () =>
    props.accent
      ? `text-substrateGreen border-substrateGreen`
      : `border-substrateDark`
  return (
    <>
      {props.external ? (
        <div className="block group">
          <a
            href={props.link}
            target="_blank"
            rel="noreferrer"
            className={`${textSize()} font-bold border-b-2 ${accentStyle()}`}
          >
            {props.children}
          </a>
          <span
            className={cx(
              'w-8 inline-block pl-2 transform transition-all duration-300 ease-in-out group-hover:pl-4',
              {
                'text-substrateGreen': props.accent,
              }
            )}
          >
            &#10132;
          </span>
        </div>
      ) : (
        <div className="block group">
          <LocalizedLink
            className={`${textSize()} font-bold border-b-2 ${accentStyle()}`}
            to={props.link}
          >
            {props.children}
          </LocalizedLink>
          <span
            className={cx(
              'w-8 inline-block pl-2 transform transition-all duration-300 ease-in-out group-hover:pl-4',
              {
                'text-substrateGreen': props.accent,
              }
            )}
          >
            &#10132;
          </span>
        </div>
      )}
    </>
  )
}
