import React, { useState, useEffect } from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

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
    'px-6 py-4 -mb-1 focus:outline-none focus:bg-substrateBlueBg hover:text-substrateGreen hover:underline dark:text-white font-medium'
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
            isCurrent ? 'text-substrateGreen underline' : 'text-black'
          }`}
        >
          <span>{title}</span>
        </div>
      </a>
    )
  } else {
    return (
      <LocalizedLink to={link}>
        <div
          className={`${styles} ${
            isCurrent ? 'text-substrateGreen underline' : 'text-black'
          }`}
        >
          <span>{title}</span>
        </div>
      </LocalizedLink>
    )
  }
}
