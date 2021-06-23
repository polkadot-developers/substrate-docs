import React, { useState, useEffect } from 'react'
import { IkbSideBar } from '../sidebar/kbSideBar'
import { LocalizedLink } from 'gatsby-theme-i18n'
import arrowIcon from '../images/nav-icon-arrow-down.svg'

interface SlideDownNavProps {
  section: IkbSideBar
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
        className="flex items-center justify-between px-20 lg:px-4 py-4 bg-lightGray lg:bg-white cursor-pointer"
      >
        <div className="font-medium">{section.name}</div>
        <img
          className={`transform ease-in-out ${isOpen ? '-rotate-180' : null}`}
          src={arrowIcon}
          alt="Substrate Documentation Icon"
        />
      </div>
      <div>
        {isOpen &&
          section.items.map((item, index) => {
            return (
              <LocalizedLink key={index} to={item.link}>
                <div
                  className={`text-gray-600 text-sm px-20 lg:px-6 py-2 hover:text-substrateBlue hover:bg-substrateBlue hover:bg-opacity-10 ${
                    item.link === location.pathname
                      ? `text-substrateBlue bg-substrateBlue bg-opacity-10`
                      : ` `
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
