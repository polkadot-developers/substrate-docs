import React from 'react'
import { Link } from 'gatsby'

interface FooterNavItemProps {
  external: boolean
  link: string
  title: string
}

export default function FooterNavItem({ external, link, title }: FooterNavItemProps) {
  if (external) {
    return <a href={link}>{title}</a>
  } else {
    return <Link to={link}>{title}</Link>
  }
}
