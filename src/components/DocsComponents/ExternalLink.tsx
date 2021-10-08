import React from 'react'
import Icon from '../Icon'

interface ExternalLinkProps {
  url: string
  children: React.ReactNode
}

export function ExternalLink(props: ExternalLinkProps) {
  return (
    <a
      className="inline-block"
      href={props.url}
      target="_blank"
      rel="noreferrer"
    >
      <span className="">{props.children}</span>
      <Icon
        name="externalIcon"
        className="inline-block fill-current mb-[0.75px] mx-1"
      />
    </a>
  )
}
