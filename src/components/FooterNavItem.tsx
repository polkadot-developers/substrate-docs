import React from 'react'
import { Link } from 'gatsby'

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
  const itemStyles =
    'text-sm font-light md:text-base mb-4 md:mr-6 hover:underline'
  if (external) {
    return (
      <a href={link}>
        <li className={`${itemStyles}`}>{title}</li>
      </a>
    )
  } else {
    return (
      <Link to={link}>
        <li className={`${itemStyles}`}>{title}</li>
      </Link>
    )
  }
}
