import React, { useState, useEffect } from 'react'
import Link from '../default/Link'

interface MobileNavItemProps {
  external: boolean
  link: string
  title: string
}

export default function MobileNavItem({ link, title }: MobileNavItemProps) {
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
  return (
    <Link to={link}>
      <div className={`${styles} ${activeStyles()}`}>
        <span>{title}</span>
      </div>
    </Link>
  )
}
