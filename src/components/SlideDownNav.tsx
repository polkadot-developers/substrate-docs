import React, { useState, useEffect } from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface SlideDownNavProps {
  section: { name: string; items: { title: string; link: string }[] }
}

export default function SlideDownNav({ section }: SlideDownNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    section.items.map(item => {
      if (item.link === location.pathname) {
        setIsOpen(!isOpen)
      }
    })
  }, [])
  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-20 lg:px-6 py-3 bg-substrateGray-light dark:bg-gray-900 cursor-pointer"
      >
        <div className={`${isOpen ? `font-bold` : `font-medium`}`}>
          {section.name}
        </div>
        <svg
          className={`fill-current text-black dark:text-white ${
            isOpen ? '-rotate-180' : null
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-5 -8 24 24"
          width="16"
          height="16"
          preserveAspectRatio="xMinYMin"
        >
          <path d="M7.071 5.314l4.95-4.95a1 1 0 1 1 1.414 1.414L7.778 7.435a1 1 0 0 1-1.414 0L.707 1.778A1 1 0 1 1 2.121.364l4.95 4.95z"></path>
        </svg>
      </div>
      <div>
        {isOpen &&
          section.items.map((item, index) => {
            return (
              <LocalizedLink
                className="hover:no-underline "
                key={index}
                to={item.link}
              >
                <div
                  className={`text-gray-600 dark:text-gray-200 text-sm px-20 lg:pl-10 lg:pr-6 py-2 hover:text-shadow ${
                    item.link === location.pathname ? `text-shadow` : ` `
                  }`}
                >
                  {item.title}
                </div>
              </LocalizedLink>
            )
          })}
      </div>
    </>
  )
}
