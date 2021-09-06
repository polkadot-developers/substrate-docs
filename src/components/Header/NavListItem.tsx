import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'

interface NavListItemProps {
  external: boolean
  link: string
  title: string
}

export default function NavListItem({
  external,
  link,
  title,
}: NavListItemProps) {
  const [isCurrent, setIsCurrent] = useState(false)
  const styles =
    'px-6 py-2 -mb-1 focus:outline-none focus:bg-substrateBlueBg dark:hover:text-substrateGreen hover:underline font-medium'
  useEffect(() => {
    if (link === location.pathname) {
      setIsCurrent(true)
    }
  }, [])
  if (external) {
    return (
      <a href={link}>
        <div
          className={`${styles} ${
            isCurrent
              ? 'text-substrateGreen underline'
              : 'text-substrateDark dark:text-white'
          }`}
        >
          <span>{title}</span>
        </div>
      </a>
    )
  } else {
    return (
      <Link to={link}>
        <div
          className={`${styles} ${
            isCurrent
              ? 'text-substrateGreen underline'
              : 'text-substrateDark dark:text-white'
          }`}
        >
          <span>{title}</span>
        </div>
      </Link>
    )
  }
}
