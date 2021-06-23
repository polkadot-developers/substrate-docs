import React, { useState } from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import arrowIcon from '../../images/nav-icon-arrow-down.svg'

interface TechSubMenuProps {
  menuData: { name: string; subMenu: { linkTitle: string; link: string }[] }
}

export default function TechSubMenu({ menuData }: TechSubMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { name, subMenu } = menuData
  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer"
      >
        <span className="font-medium">{name}</span>
        <img
          className="inline-block pl-2 pt-1"
          src={arrowIcon}
          alt="Substrate Navigation Icon"
        />
      </div>
      <div className={`${isOpen ? `absolute mt-8 ml-8` : 'hidden'}`}>
        <ul className="list-none bg-white px-6 pt-6 rounded-md shadow-lg ring-1 ring-black ring-opacity-40">
          {isOpen &&
            subMenu.map((item, index) => {
              console.log(item)
              return (
                <LocalizedLink
                  className="hover:text-substrateBlue"
                  key={index}
                  to={item.link}
                >
                  <li className="pb-6">{item.linkTitle}</li>
                </LocalizedLink>
              )
            })}
        </ul>
      </div>
    </>
  )
}
