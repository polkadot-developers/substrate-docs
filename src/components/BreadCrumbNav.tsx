import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface BreadCrumbNavProps {
  section: string
  sectionURL: string
  title: string
}
export default function BreadCrumbNav(props: BreadCrumbNavProps) {
  return (
    <>
      <div className="text-sm text-substrateBlue dark:text-substrateBlue-light capitalize mdx-anchor">
        <LocalizedLink to="/">Developers Home</LocalizedLink>
        <span className="px-2">»</span>
        <LocalizedLink to={props.sectionURL}>{props.section}</LocalizedLink>
        <span className="px-2">»</span>
        <span className="text-substrateDark dark:text-white">
          {props.title}
        </span>
      </div>
    </>
  )
}
