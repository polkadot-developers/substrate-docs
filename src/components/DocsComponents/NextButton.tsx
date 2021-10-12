import React from 'react'
import Link from '../Link'
import { useIntl } from 'react-intl'

interface NextButtonProps {
  text: string
  link: string
}
export function NextButton({ text, link }: NextButtonProps) {
  const intl = useIntl()
  return (
    <>
      <Link to={link}>
        <div className="md-button group inline-block my-6">
          <div className="flex items-center justify-center w-80 h-14 rounded bg-substrateGreen transform transition duration-300 ease-in-out group-hover:bg-white dark:group-hover:bg-darkBackground border-2 border-transparent group-hover:border-substrateGreen">
            <button className="truncate text-lg text-white dark:text-white px-4 group-hover:text-substrateGreen font-bold focus:outline-none group-active:text-white">
              {intl.formatMessage({ id: 'docs-nav-next' })} - {text}
            </button>
          </div>
        </div>
      </Link>
    </>
  )
}
