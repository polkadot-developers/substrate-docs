import React, { useContext } from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { ThemeContext } from '../contexts/ThemeContext'

const addTrailingSlash = (uri: string) => {
  const addSlash = (uri: string) => {
    uri += uri.endsWith('/') ? '' : '/'
    return uri
  }

  const removeSlash = (uri: string) => {
    return uri.replace(/\/$/, '')
  }

  const getHash = (uri: string) => {
    if (uri.indexOf('#') > 0) {
      return uri.substring(uri.indexOf('#'), uri.length)
    }
    return ''
  }

  const getSearch = (uri: string) => {
    if (uri.indexOf('?') > 0) {
      return uri.substring(uri.indexOf('?'), uri.length)
    }
    return ''
  }

  // eg: http://localhost:8001/playground/?deploy=node-template#config
  // remove back slash if exist
  uri = removeSlash(uri)
  // store hash if exist and remove from uri
  const hash = getHash(uri)
  if (hash) uri = uri.replace(hash, '')
  // remove back slash if exist
  uri = removeSlash(uri)
  // store search query if exist and remove from uri
  const search = getSearch(uri)
  if (search) uri = uri.replace(search, '')
  // add slash if missing
  uri = addSlash(uri)

  return uri + search + hash
}

const addStartingSlash = (uri: string) => {
  return (uri = uri.startsWith('/') ? uri : '/'.concat(uri))
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
      <GatsbyLink
        to={addStartingSlash(addTrailingSlash(to))}
        className={className}
      >
        {children}
      </GatsbyLink>
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
