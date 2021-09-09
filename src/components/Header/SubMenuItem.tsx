import React, { useEffect } from 'react'
import useComponentVisible from '../Hooks/use-component-visible'
import NavListItem from './NavListItem'

interface SubMenuItemProps {
  data: {
    linkTitle: string
    link: string
    external: boolean
    items?: { linkTitle: string; link: string; external: boolean }[]
  }
  setItemNavOpen: (param: boolean) => void
}

export default function SubMenuItem({
  data,
  setItemNavOpen,
}: SubMenuItemProps) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)
  useEffect(() => {
    isComponentVisible ? setItemNavOpen(true) : setItemNavOpen(false)
  }, [isComponentVisible])
  return (
    <>
      <div
        ref={ref}
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        className={`pl-6 py-2 pr-24 text-black dark:text-white cursor-pointer ${
          isComponentVisible
            ? 'bg-substrateGreen-light underline dark:bg-gray-900 hover:text-black'
            : 'hover:text-substrateGreen hover:underline'
        }`}
      >
        <span className="font-medium">{data.linkTitle}</span>
        <span className="absolute right-6 pt-1.5">
          <svg
            className={` `}
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
        </span>
      </div>
      {isComponentVisible ? (
        <>
          <div className="absolute top-0 left-full h-full w-56 pt-4 pb-5 rounded-tr-md rounded-br-md shadow-lg ring-1 ring-black dark:ring-white bg-white dark:bg-black">
            {data.items.map((item, index) => {
              return (
                <div key={index}>
                  <NavListItem
                    external={item.external}
                    link={item.link}
                    title={item.linkTitle}
                  />
                </div>
              )
            })}
          </div>
        </>
      ) : null}
    </>
  )
}
