import React, { useContext } from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import { ThemeContext } from '../contexts/ThemeContext'

const addTrailingSlash = (uri: string) => {
  const addSlash = (uri: string) => {
    uri += uri.endsWith('/') ? '' : '/'
    return uri
  }

  if (uri.indexOf('#') > 0) {
    const hash = uri.substring(uri.indexOf('#'), uri.length)
    uri = addSlash(uri.replace(hash, ''))
    return uri + hash
  }
  uri = addSlash(uri)
  return uri
}

interface InfraLinkProps {
  to: string
  children: React.ReactNode
  className?: string
}

const InfraLink = ({ to, children, className }: InfraLinkProps) => {
  const { colorMode } = useContext(ThemeContext)

  const handleClick = (e: React.FormEvent<EventTarget>, to: string) => {
    e.preventDefault()
    window.location.href = addTrailingSlash(to) + `?mode=${colorMode}`
  }

  return (
    <a
      href={addTrailingSlash(to)}
      onClick={e => handleClick(e, to)}
      className={className}
    >
      {children}
    </a>
  )
}

interface LinkProps {
  to: string
  children: React.ReactNode
  className?: string
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
      <LocalizedLink to={addTrailingSlash(to)} className={className}>
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

export { testExternalLink, testInfraLink }
