import React, { useState } from 'react'
import { IkbSideBar } from '../sidebar/kbSideBar'
import { LocalizedLink } from 'gatsby-theme-i18n'
import arrowIcon from '../images/nav-icon-arrow-down.svg'

interface SlideDownNavProps {
  section: IkbSideBar
}

export default function SlideDownNav({ section }: SlideDownNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-20 lg:px-4 py-4 bg-lightGray lg:bg-white"
      >
        <div className="font-medium">{section.name}</div>
        <img
          className={`transform duration-300 ease-in-out ${
            isOpen ? '-rotate-180' : null
          }`}
          src={arrowIcon}
          alt="Substrate Documentation Icon"
        />
      </div>
      <div>
        {isOpen &&
          section.items.map((item, index) => {
            return (
              <div
                key={index}
                className="text-gray-600 text-sm px-20 lg:px-6 py-2 hover:text-substrateBlue hover:bg-substrateBlue hover:bg-opacity-10"
              >
                <LocalizedLink to={`/v3${item.link}`}>
                  {item.title}
                </LocalizedLink>
              </div>
            )
          })}
      </div>
    </>
  )
}
