import React from 'react'
import cx from 'classnames'
import useComponentVisible from '../Hooks/use-component-visible'
import Link from '../Link'

interface MobileDropDownProps {
  external: boolean
  title: string
  items: { linkTitle: string; link: string; external: boolean }[]
}

export default function MobileDropDown({ title, items }: MobileDropDownProps) {
  const { isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)
  return (
    <div>
      <div
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        className={`px-6 py-3 hover:font-bold text-black dark:text-white cursor-pointer ${
          isComponentVisible ? 'font-bold' : 'font-medium'
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="text-lg">{title}</span>
          <svg
            name="arrow-dropdown"
            className={cx('transform fill-current text-black dark:text-white', {
              '-rotate-180': isComponentVisible,
            })}
            viewBox="-5 -8 24 24"
            width="16"
            height="16"
            preserveAspectRatio="xMinYMin"
          >
            <path d="M7.071 5.314l4.95-4.95a1 1 0 1 1 1.414 1.414L7.778 7.435a1 1 0 0 1-1.414 0L.707 1.778A1 1 0 1 1 2.121.364l4.95 4.95z"></path>
          </svg>
        </div>
      </div>
      {isComponentVisible ? (
        <>
          {items.map((each, index) => {
            const itemStyles =
              'block font-medium hover:font-bold pl-12 mb-0 py-3'
            return (
              <Link key={index} to={each.link}>
                <span className={`${itemStyles}`}>{each.linkTitle}</span>
              </Link>
            )
          })}
        </>
      ) : null}
    </div>
  )
}
