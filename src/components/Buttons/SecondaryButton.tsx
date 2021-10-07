import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface SecondaryButtonProps {
  link: string
  children: React.ReactNode
  external?: boolean
  cta?: boolean
}
export function SecondaryButton(props: SecondaryButtonProps) {
  const paddingSize = () => (props.cta ? `py-4 px-8` : `py-2 px-5`)
  const textSize = () => (props.cta ? `text-xl` : `text-lg`)
  return (
    <>
      {props.external ? (
        <a href={props.link} target="_blank" rel="noreferrer">
          <div
            className={`bg-substrateDark dark:bg-substrateGray-light ${paddingSize()} ${textSize()} inline-block rounded-md hover:opacity-80 transition-opacity`}
          >
            <div className="font-bold mb-0 text-white dark:text-black">
              {props.children}
            </div>
          </div>
        </a>
      ) : (
        <LocalizedLink to={props.link}>
          <div
            className={`bg-substrateDark dark:bg-substrateGray-light ${paddingSize()} ${textSize()} inline-block rounded-md hover:opacity-80 transition-opacity`}
          >
            <div className="font-bold mb-0 text-white dark:text-black">
              {props.children}
            </div>
          </div>
        </LocalizedLink>
      )}
    </>
  )
}
