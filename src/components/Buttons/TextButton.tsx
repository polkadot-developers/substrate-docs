import React from 'react'
import Link from '../Link'
import Icon from '../Icon'

interface TextButtonProps {
  link: string
  children: string
  className?: string
  accent?: boolean
  cta?: boolean
  external?: boolean
}

export function TextButton(props: TextButtonProps) {
  const textSize = () => (props.cta ? 'text-xl' : 'text-lg')
  const accentStyle = () =>
    props.accent
      ? `text-substrateGreen dark:text-substrateGreen border-substrateGreen`
      : `border-substrateDark dark:border-white`
  return (
    <>
      {props.external ? (
        <div className={props.className}>
          <a href={props.link} target="_blank" rel="noreferrer">
            <p
              className={`font-bold pb-1 mr-0.5 border-b-2 inline hover:mr-2 transition-all ${textSize()} ${accentStyle()}`}
            >
              {props.children}
            </p>{' '}
            <span
              className={`fill-current text-substrateDark dark:text-white inline-block ${accentStyle()}`}
            >
              <Icon name="arrowMore" />
            </span>
          </a>
        </div>
      ) : (
        <div className={props.className}>
          <Link to={props.link}>
            <p
              className={`font-bold pb-1 mr-0.5 border-b-2 inline hover:mr-2 transition-all ${textSize()} ${accentStyle()}`}
            >
              {props.children}
            </p>{' '}
            <span
              className={`fill-current text-substrateDark dark:text-white inline-block ${accentStyle()}`}
            >
              <Icon name={`arrowMore`} />
            </span>
          </Link>
        </div>
      )}
    </>
  )
}
