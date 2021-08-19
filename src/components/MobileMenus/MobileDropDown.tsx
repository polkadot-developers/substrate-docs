import React from 'react'
import useComponentVisible from '../Hooks/use-component-visible'
import { Link } from 'gatsby'

interface MobileDropDownProps {
  external: boolean
  title: string
  items: { linkTitle: string; link: string; external: boolean }[]
}

export default function MobileDropDown({
  external,
  title,
  items,
}: MobileDropDownProps) {
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
            className={`transform ${
              isComponentVisible ? '-rotate-90' : 'rotate-90'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height="13"
            viewBox="0 0 7 13"
            fill="none"
          >
            <path
              d="M1 12L6 6.5L1 1"
              stroke="#242A35"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {isComponentVisible ? (
        <>
          {items.map((each, index) => {
            const itemStyles =
              'block font-medium hover:font-bold pl-12 mb-0 py-3'
            if (external) {
              return (
                <a key={index} href={each.link}>
                  <span className={`${itemStyles}`}>{each.linkTitle}</span>
                </a>
              )
            } else {
              return (
                <Link key={index} to={each.link}>
                  <span className={`${itemStyles}`}>{each.linkTitle}</span>
                </Link>
              )
            }
          })}
        </>
      ) : null}
    </div>
  )
}
