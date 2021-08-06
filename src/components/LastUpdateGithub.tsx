import React, { useState, useEffect } from 'react'
import moment from 'moment'

interface LastUpdateGithubProps {
  absolutePath: string
}
export default function LastUpdateGithub(props: LastUpdateGithubProps) {
  const [date, setDate] = useState('')
  const [user, setUser] = useState('')

  useEffect(() => {
    console.log(props.absolutePath)
    fetch(
      `https://api.github.com/repos/paritytechmarcomms/gatsby-theme-parity-website/commits?path=blog/2018-year-in-review/index.mdx`
    )
      .then(response => response.json())
      .then(resultData => {
        setDate(moment(resultData[0].commit.author.date).format('MMMM d, YYYY'))
        setUser(resultData[0].author.login)
      })
  }, [])
  return (
    <div>
      Last Udpated on {date} by {user}
    </div>
  )
}
