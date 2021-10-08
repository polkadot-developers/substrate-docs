import React, { useContext } from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import { ThemeContext } from '../contexts/ThemeContext'

interface InfraLinkProps {
  to: string
  children: React.ReactNode
  className?: string
}

const InfraLink = ({ to, children, className }: InfraLinkProps) => {
  const { colorMode } = useContext(ThemeContext)

  const handleClick = (e: React.FormEvent<EventTarget>, to: string) => {
    e.preventDefault()
    window.location.href = to + `?mode=${colorMode}`
  }

  return (
    <a href={to} onClick={e => handleClick(e, to)} className={className}>
      {children}
    </a>
  )
}

interface LinkProps {
  to: string
  children: React.ReactNode
  className: string
}

export default function Link({ to, children, className }: LinkProps) {
  const external = testExternalLink(to)
  const infraLink = testInfraLink(to)

  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        className={className}
        rel="noreferrer noopener"
      >
        {children}
      </a>
    )
  } else if (infraLink) {
    return (
      <InfraLink to={to} className={className}>
        {children}
      </InfraLink>
    )
  } else {
    return (
      <LocalizedLink to={to} className={className}>
        {children}
      </LocalizedLink>
    )
  }
}

const testInfraLink = (href: string) => {
  // eslint-disable-next-line
  const regex = new RegExp(process.env.GATSBY_IO_URL, 'i')
  const match = regex.test(href)
  return match
}

const testExternalLink = (href: string) => {
  if (testInfraLink(href)) {
    return false
  }
  const regex = new RegExp('^(http|https)://', 'i')
  const match = regex.test(href)
  return match
}
