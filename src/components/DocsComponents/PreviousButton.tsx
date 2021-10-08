import React from 'react'
import Link from '../Link'
import { useIntl } from 'react-intl'
import Icon from '../Icon'

interface PreviousButtonProps {
  text: string
  link: string
}
export function PreviousButton({ text, link }: PreviousButtonProps) {
  const intl = useIntl()
  return (
    <>
      <Link to={link}>
        <div className="md-button group inline-block">
          <div className="flex items-center justify-start w-80 h-14">
            <Icon
              name="arrowMore"
              className="rotate-180 fill-current text-black dark:text-white mr-4 ml-4 transform transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:mr-6"
            />
            <button className="truncate text-lg text-black dark:text-white font-bold focus:outline-none border-b-2 border-substrateDark dark:border-white ">
              {intl.formatMessage({ id: 'docs-nav-back' })} - {text}
            </button>
          </div>
        </div>
      </Link>
    </>
  )
}
