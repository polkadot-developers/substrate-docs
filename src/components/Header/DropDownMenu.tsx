import React, { useState } from 'react'
import NavListItem from './NavListItem'
import SubMenuItem from './SubMenuItem'
import useComponentVisible from '../Hooks/use-component-visible'

interface DropDownMenuProps {
  index: number
  menuData: {
    name: string
    subMenu: {
      linkTitle: string
      link: string
      external: boolean
      items?: { linkTitle: string; link: string; external: boolean }[]
    }[]
  }
}

export default function DropDown({ menuData, index }: DropDownMenuProps) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)
  const { name, subMenu } = menuData
  const [itemNavOpen, setItemNavOpen] = useState(false)
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
        className={` ${
          index === 0
            ? 'w-44'
            : index === 1
            ? 'w-48'
            : index === 2
            ? 'w-60'
            : index === 3
            ? 'w-56'
            : 'w-48'
        }
        ${
          isComponentVisible
            ? `absolute mt-4 -ml-2 animate-fade-in-down`
            : 'hidden animate-fade-out'
        }`}
      >
        <ul
          className={`list-none relative pt-4 pb-[1.2rem] bg-white dark:bg-black shadow-lg ring-1 ring-substrateDark dark:ring-white rounded-md ${
            itemNavOpen ? `rounded-tr-none rounded-br-none` : null
          }`}
        >
          {isComponentVisible &&
            subMenu.map((item, index) => {
              if (item.items) {
                return (
                  <li key={index}>
                    <SubMenuItem data={item} setItemNavOpen={setItemNavOpen} />
                  </li>
                )
              } else {
                return (
                  <li key={index}>
                    <NavListItem
                      external={item.external}
                      link={item.link}
                      title={item.linkTitle}
                    />
                  </li>
                )
              }
            })}
        </ul>
      </div>
    </div>
  )
}
