import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import useComponentVisible from './Hooks/use-component-visible'

interface SubMenuProps {
  menuData: {
    name: string
    subMenu: { linkTitle: string; link: string; external: boolean }[]
  }
  width?: string
}

export default function SubMenu({ menuData, width }: SubMenuProps) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)
  const { name, subMenu } = menuData
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        className="opacity-90 hover:opacity-100 focus:outline-none"
      >
        <span className="font-medium">{name}</span>
        <svg
          className="inline-block xl:ml-2 fill-current text-black dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-5 -8 24 24"
          width="16"
          height="16"
          preserveAspectRatio="xMinYMin"
        >
          <path d="M7.071 5.314l4.95-4.95a1 1 0 1 1 1.414 1.414L7.778 7.435a1 1 0 0 1-1.414 0L.707 1.778A1 1 0 1 1 2.121.364l4.95 4.95z"></path>
        </svg>
      </button>
      <div
        className={` ${width}
        ${
          isComponentVisible
            ? `absolute mt-2 -m-1 animate-fade-in-down`
            : 'hidden animate-fade-out'
        }`}
      >
        <ul className="list-none bg-white dark:bg-black px-6 pt-6 rounded-md shadow-lg ring-1 ring-black dark:ring-white ring-opacity-40">
          {isComponentVisible &&
            subMenu.map((item, index) => {
              if (item.external) {
                return (
                  <a
                    className="text-black dark:text-white hover:text-substrateGreen hover:underline"
                    key={index}
                    href={item.link}
                  >
                    <div className="pb-6 focus:outline-none focus:bg-substrateBlueBg">
                      <span className="text-lg font-medium">
                        {item.linkTitle}
                      </span>
                    </div>
                  </a>
                )
              } else {
                return (
                  <LocalizedLink
                    className="text-black dark:text-white hover:text-substrateGreen hover:underline"
                    key={index}
                    to={item.link}
                  >
                    <div className="pb-6 focus:outline-none focus:bg-substrateBlueBg">
                      <span className="text-lg font-medium">
                        {item.linkTitle}
                      </span>
                    </div>
                  </LocalizedLink>
                )
              }
            })}
        </ul>
      </div>
    </div>
  )
}
