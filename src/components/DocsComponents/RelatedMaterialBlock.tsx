import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface RelatedMaterialBlockProps {
  title: string
  text: string
  link: string
  linkText: string
}

export function RelatedMaterialBlock({
  title,
  text,
  link,
  linkText,
}: RelatedMaterialBlockProps) {
  return (
    <>
      <div className="flex flex-wrap justify-start">
        <div className="bg-mdxLightBg dark:bg-gray-300 dark:text-substrateDark px-4 pt-4 pb-6 my-2 w-80 border border-substrateDark-light dark:border-white rounded">
          <span className="text-2xl font-medium">{title}</span>
          <p className="text-base font-light py-2">{text}</p>
          <div className="md-button inline-block">
            <LocalizedLink
              className={`md-button mr-2 transform transition-all duration-300 ease-in-out hover:mr-4 text-lg font-bold border-b-2 border-substrateDark`}
              to={link}
            >
              <span className="text-substrateDark">{linkText}</span>
            </LocalizedLink>
            <span className="">&#10132;</span>
          </div>
        </div>
      </div>
    </>
  )
}
