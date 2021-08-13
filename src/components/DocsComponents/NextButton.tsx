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
      <LocalizedLink className="md-button group inline-block my-6" to={link}>
        <div className="flex items-center justify-center w-80 h-14 rounded bg-substrateGreen transform transition duration-300 ease-in-out group-hover:bg-white border-2 border-transparent group-hover:border-substrateGreen">
          <button className="truncate text-lg text-white px-4 group-hover:text-substrateGreen dark:text-substrateDark font-bold focus:outline-none">
            {intl.formatMessage({ id: 'docs-nav-next' })} - {text}
          </button>
        </div>
      </LocalizedLink>
    </>
  )
}
