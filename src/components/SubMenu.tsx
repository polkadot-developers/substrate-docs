import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import arrowIcon from '../images/nav-icon-arrow-down.svg'
import useComponentVisible from './Hooks/use-component-visible'

interface SubMenuProps {
  menuData: { name: string; subMenu: { linkTitle: string; link: string }[] }
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
        <img
          className="inline-block pl-2 pt-1"
          src={arrowIcon}
          alt="Substrate Navigation Icon"
        />
      </button>
      <div
        className={` ${width}
        ${
          isComponentVisible
            ? `absolute mt-2 -m-1 animate-fade-in-down`
            : 'hidden animate-fade-out'
        }`}
      >
        <ul className="list-none bg-white px-6 pt-6 rounded-md shadow-lg ring-1 ring-black ring-opacity-40">
          {isComponentVisible &&
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
    </div>
  )
}
