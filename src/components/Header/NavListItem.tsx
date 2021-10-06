import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'

interface NavListItemProps {
  external: boolean
  link: string
  title: string
}

export default function NavListItem({ external, link, title }: NavListItemProps) {
  const [isCurrent, setIsCurrent] = useState(false)
  const styles =
    'whitespace-nowrap pl-6 pr-12 py-2 focus:outline-none focus:bg-substrateBlueBg hover:text-substrateGreen hover:underline dark:text-white font-medium'
  useEffect(() => {
    if (
      link === location.pathname ||
      (location.pathname === '/v3/getting-started/overview' && title === 'Docs') ||
      (location.pathname.includes('how-to-guides') && title === 'How-to Guides') ||
      (location.pathname.includes('tutorials') && title === 'Tutorials')
    ) {
      setIsCurrent(true)
    }
  }, [])
  if (external) {
    if (title === 'Events' || title === 'Blog') {
      return (
        <a href={link} target="_blank" rel="noreferrer">
          <div
            className={`${styles} ${
              isCurrent ? 'text-substrateGreen underline' : 'text-substrateDark dark:text-white'
            }`}
          >
            <span>{title}</span>
          </div>
        </a>
      )
    } else {
      return (
        <a href={link}>
          <div
            className={`${styles} ${
              isCurrent ? 'text-substrateGreen underline' : 'text-substrateDark dark:text-white'
            }`}
          >
            <span>{title}</span>
          </div>
        </a>
      )
    }
  } else {
    return (
      <Link to={link}>
        <div
          className={`${styles} ${
            isCurrent ? 'text-substrateGreen underline' : 'text-substrateDark dark:text-white'
          }`}
        >
          <span>{title}</span>
        </div>
      </Link>
    )
  }
}
