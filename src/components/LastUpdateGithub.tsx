import React, { useState, useEffect } from 'react'
import moment from 'moment'

interface LastUpdateGithubProps {
  absolutePath: string
}
export default function LastUpdateGithub({
  absolutePath,
}: LastUpdateGithubProps) {
  const githubLink = `https://api.github.com/repos/substrate-developer-hub/substrate-docs/commits?path=${absolutePath.substr(
    absolutePath.indexOf('/v')
  )}`
  const [date, setDate] = useState('')
  const [sha, setSHA] = useState('')
  const [link, setLink] = useState('')
  useEffect(() => {
    fetch(githubLink)
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
