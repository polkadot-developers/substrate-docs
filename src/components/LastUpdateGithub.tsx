import React, { useState, useEffect } from 'react'
import moment from 'moment'

interface LastUpdateGithubProps {
  absolutePath: string
}
export default function LastUpdateGithub(props: LastUpdateGithubProps) {
  const [date, setDate] = useState('')
  const [sha, setSHA] = useState('')
  const [link, setLink] = useState('')
  console.log(date, sha, link)
  useEffect(() => {
    console.log(props.absolutePath)
    fetch(
      `https://api.github.com/repos/paritytechmarcomms/gatsby-theme-parity-website/commits?path=blog/2018-year-in-review/index.mdx`
    )
      .then(response => response.json())
      .then(resultData => {
        setDate(moment(resultData[0].commit.author.date).format('MMMM d, YYYY'))
        setSHA(resultData[0].sha.slice(0, 7))
        setLink(resultData[0].html_url)
      })
  }, [])
  return (
    <div>
      Last edit:{` `}
      <a className="underline" href={link} target="_blank" rel="noreferrer">
        {sha}
      </a>
      {` `}
      on {date}
    </div>
  )
}
