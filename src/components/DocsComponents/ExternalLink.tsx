import React from 'react'

interface ExternalLinkProps {
  url: string
  children: React.ReactNode
}

export function ExternalLink(props: ExternalLinkProps) {
  return (
    <a className="inline-block" href={props.url} target="_blank" rel="noreferrer">
      <span className="">{props.children}</span>
      <svg
        className="inline-block fill-current ml-2"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10.6667 10.6667H1.33333V1.33333H5.33333C5.70152 1.33333 6 1.03486 6 0.666667C6 0.298477 5.70152 0 5.33333 0H1.33333C0.593333 0 0 0.6 0 1.33333V10.6667C0 11.4 0.593333 12 1.33333 12H10.6667C11.4 12 12 11.4 12 10.6667V6.66667C12 6.29848 11.7015 6 11.3333 6C10.9651 6 10.6667 6.29848 10.6667 6.66667V10.6667ZM8 0C7.63181 0 7.33333 0.298477 7.33333 0.666667C7.33333 1.03486 7.63181 1.33333 8 1.33333H9.72667L3.64333 7.41667C3.38376 7.67624 3.38376 8.09709 3.64333 8.35667C3.90291 8.61624 4.32376 8.61624 4.58333 8.35667L10.6667 2.27333V4C10.6667 4.36819 10.9651 4.66667 11.3333 4.66667C11.7015 4.66667 12 4.36819 12 4V0H8Z" />
      </svg>
    </a>
  )
}
