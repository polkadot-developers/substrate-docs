import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import { useIntl } from 'react-intl'

interface NextButtonProps {
  text: string
  link: string
}
export function NextButton({ text, link }: NextButtonProps) {
  const intl = useIntl()
  return (
    <>
      <LocalizedLink className="inline-block m-2" to={link}>
        <div className="flex items-center justify-center px-8 h-16 rounded bg-substrateGreen">
          <button className="text-lg text-white font-bold focus:outline-none">
            {intl.formatMessage({ id: 'docs-nav-next' })} - {text}
          </button>
        </div>
      </LocalizedLink>
    </>
  )
}
