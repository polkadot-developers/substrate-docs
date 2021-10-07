import React, { useState, useEffect } from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface LinkProps {
  to: string
  children: React.ReactNode
}

export default function Link({ to, children }: LinkProps) {
  const linksExcempted = [process.env.GATSBY_IO_URL]
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
            <a href={to}>{children}</a>
          ) : (
            <a href={to} target="_blank" rel="noreferrer">
              {children}
            </a>
          )}
        </>
      ) : (
        <LocalizedLink to={to}>{children}</LocalizedLink>
      )}
    </>
  )
}
