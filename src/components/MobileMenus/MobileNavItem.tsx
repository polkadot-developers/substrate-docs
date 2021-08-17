import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface MobileNavItemProps {
  external: boolean
  link: string
  title: string
}

export default function MobileNavItem({
  external,
  link,
  title,
}: MobileNavItemProps) {
  const styles =
    'text-black dark:text-white hover:no-underline px-6 py-3 hover:bg-substrateGreen-light text-lg font-medium'
  if (external) {
    return (
      <a href={link}>
        <div className={`${styles}`}>
          <span>{title}</span>
        </div>
      </a>
    )
  } else {
    return (
      <LocalizedLink to={link}>
        <div className={`${styles}`}>
          <span>{title}</span>
        </div>
      </LocalizedLink>
    )
  }
}
