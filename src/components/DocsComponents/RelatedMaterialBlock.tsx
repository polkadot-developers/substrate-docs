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
        <div className="bg-mdxLightBg p-4 m-4 w-80 h-40 border border-black rounded">
          <span className="text-lg font-medium">{title}</span>
          <p className="text-base font-light py-2">{text}</p>
          <div>
            <LocalizedLink className="" to={linkText}>
              <span>{link}</span>
              <span>{` `}»</span>
            </LocalizedLink>
          </div>
        </div>
        <div className="bg-mdxLightBg p-4 m-4 w-80 h-40 border border-black rounded">
          <span className="text-lg font-medium">Pallets</span>
          <p className="text-base font-light py-2">{text}</p>
          <div>
            <LocalizedLink className="" to={linkText}>
              <span>Go to Pallets</span>
              <span>{` `}»</span>
            </LocalizedLink>
          </div>
        </div>
      </div>
    </>
  )
}
