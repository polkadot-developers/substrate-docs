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

export default function DropDown({ menuData }: DropDownMenuProps) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)
  const { name, subMenu } = menuData
  const [itemNavOpen, setItemNavOpen] = useState(false)
  return (
    <div ref={ref}>
      <button
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        className="group focus:outline-none"
      >
        <span
          className={`font-medium group-hover:text-substrateGreen ${
            isComponentVisible ? 'text-substrateGreen' : null
          }`}
        >
          {name}
        </span>
        <svg
          className={`inline-block xl:ml-2 fill-current group-hover:text-substrateGreen dark:text-white ${
            isComponentVisible
              ? 'transform rotate-180 text-substrateGreen'
              : `text-black`
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-5 -8 24 24"
          width="16"
          height="16"
          preserveAspectRatio="xMinYMin"
        >
          <path d="M7.071 5.314l4.95-4.95a1 1 0 1 1 1.414 1.414L7.778 7.435a1 1 0 0 1-1.414 0L.707 1.778A1 1 0 1 1 2.121.364l4.95 4.95z"></path>
        </svg>
      </button>
      {isComponentVisible && (
        <div
          className={`absolute mt-4 ${
            isComponentVisible ? `animate-fade-in-down` : 'animate-fade-out'
          }`}
        >
          <ul
            className={`m-0 list-none relative pt-4 pb-5 bg-white dark:bg-black shadow-lg ring-1 ring-substrateDark dark:ring-white rounded-md ${
              itemNavOpen ? `rounded-tr-none rounded-br-none` : null
            }`}
          >
            {subMenu &&
              subMenu.map((item, index) => {
                if (item.items) {
                  return (
                    <li key={index} className="m-0">
                      <SubMenuItem
                        data={item}
                        setItemNavOpen={setItemNavOpen}
                      />
                    </li>
                  )
                } else {
                  return (
                    <li key={index} className="m-0">
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
      )}
    </div>
  )
}
