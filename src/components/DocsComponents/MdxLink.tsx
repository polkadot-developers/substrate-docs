import * as React from 'react'
import Link from '../Link'
import { ExternalLink } from '../DocsComponents'

const isHash = (str: string) => /^#/.test(str)
const isInternal = (to: string) => /^\/(?!\/)/.test(to)
const isFile = (to: string) => /\..+$/.test(to)
const isRustDocs = (to: string) => /rustdocs/.test(to)

interface MdxLinkProps {
  href: string
  children: React.ReactNode
  props: React.ReactNode
}

export function MdxLink({ href, children, ...props }: MdxLinkProps) {
  if (isRustDocs(href) || isHash(href) || !isInternal(href) || isFile(href)) {
    if (isHash(href)) {
      return (
        <a {...props} href={href}>
          {children}
        </a>
      )
    } else {
      return <ExternalLink url={href}>{children}</ExternalLink>
    }
  } else {
    return (
      <Link {...props} to={href}>
        {children}
      </Link>
    )
  }
}
