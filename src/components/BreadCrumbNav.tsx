import React from 'react'
import Link from './Link'

interface BreadCrumbNavProps {
  section: string
  sectionURL: string
  title: string
}
export default function BreadCrumbNav(props: BreadCrumbNavProps) {
  return (
    <>
      <div className="text-sm font-medium text-substrateBlue dark:text-substrateBlue-light capitalize mdx-anchor">
        <Link to="/">Developers Home</Link>
        <span className="px-2 text-substrateDark dark:text-white">»</span>
        <Link to={props.sectionURL}>{props.section}</Link>
        <span className="px-2 text-substrateDark dark:text-white">»</span>
        <span className="text-substrateDark dark:text-white">
          {props.title}
        </span>
      </div>
    </>
  )
}
