import React, { useState, useEffect } from 'react'
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
  const [isActive, setIsActive] = useState(false)
  useEffect(() => {
    if (location.pathname === link) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [])
  const styles =
    'text-black dark:text-white hover:no-underline px-6 py-3 text-lg hover:font-bold'
  const activeStyles = () => (isActive ? `font-bold` : `font-medium`)
  if (external) {
    return (
      <a href={link}>
        <div className={`${styles} ${activeStyles()}`}>
          <span>{title}</span>
        </div>
      </a>
    )
  } else {
    return (
      <LocalizedLink to={link}>
        <div className={`${styles} ${activeStyles()}`}>
          <span>{title}</span>
        </div>
      </LocalizedLink>
    )
  }
}
