import React, { useState, useEffect } from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface LinkProps {
  to: string
  children: React.ReactNode
  className?: string
}

export default function Link({ to, children, className }: LinkProps) {
  const linksExcempted = ['substrate-io-staging.netlify.app', 'substrate.io']
  const [isExternalLink, setIsExternalLink] = useState(true)
  const [isExcemption, setIsExcemption] = useState(true)

  useEffect(() => {
    const temp = document.createElement('a')
    temp.href = to
    setIsExternalLink(temp.host !== window.location.host)
    setIsExcemption(linksExcempted.includes(temp.host))
  }, [])

  return (
    <>
      {isExternalLink ? (
        <>
          {isExcemption ? (
            <a className={className} href={to}>
              {children}
            </a>
          ) : (
            <a className={className} href={to} target="_blank" rel="noreferrer">
              {children}
            </a>
          )}
        </>
      ) : (
        <LocalizedLink className={className} to={to}>
          {children}
        </LocalizedLink>
      )}
    </>
  )
}
