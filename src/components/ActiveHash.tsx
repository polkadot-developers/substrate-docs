import React, { useEffect, useRef } from 'react'

interface ActiveHashProps {
  current: boolean
  activeHash: string
  value: {
    url: string
    title: string
  }
  index: number
}
export default function ActiveHash({
  current,
  activeHash,
  value,
  index,
}: ActiveHashProps) {
  const activeLink = useRef(null)
  // useEffect(() => {
  //   if (current && activeHash === value.url.substr(1)) {
  //     if (index != 0) {
  //       console.log(index)
  //       activeLink.current.scrollIntoView({
  //         block: 'nearest',
  //         inline: 'start',
  //       })
  //     }
  //   }
  // }, [current])
  return <div ref={activeLink}>{value.title}</div>
}
