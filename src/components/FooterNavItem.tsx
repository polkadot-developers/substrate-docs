import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface FooterNavItemProps {
  external: boolean
  link: string
  title: string
}

export default function FooterNavItem({
  external,
  link,
  title,
}: FooterNavItemProps) {
  const itemStyles = 'text-sm mb-4'
  if (external) {
    return (
      <a href={link}>
        <li className={`${itemStyles}`}>{title}</li>
      </a>
    )
  } else {
    return (
      <LocalizedLink to={link}>
        <li className={`${itemStyles}`}>{title}</li>
      </LocalizedLink>
    )
  }
}
