import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import Icon from '../components/Icon'

interface GithuEditButtonProps {
  absolutePath: string
}
export default function GithubEditButton(props: GithuEditButtonProps) {
  const intl = useIntl()
  const githubSlug = 'https://github.com/substrate-developer-hub/substrate-docs/edit/main'

  const [url, setUrl] = useState('')
  useEffect(() => {
    setUrl(`${githubSlug}${props.absolutePath.substr(props.absolutePath.indexOf('/v'))}`)
  }, [])

  return (
    <div className="hidden lg:block lg:pl-2">
      <a
        className="text-sm font-medium text-substrateDark dark:text-white hover:underline lg:flex lg:items-center "
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        |{` `}
        <Icon name="github" className="mx-2 fill-current text-substrateDark dark:text-white" />
        {` `}
        <span className="text-substrateDark dark:text-white">
          {intl.formatMessage({ id: 'docs-nav-edit' })}
        </span>
      </a>
    </div>
  )
}
