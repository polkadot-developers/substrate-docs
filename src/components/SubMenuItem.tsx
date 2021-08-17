import React, { useEffect } from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import useComponentVisible from './Hooks/use-component-visible'

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
    if (isComponentVisible) {
      setItemNavOpen(true)
    }
  }, [isComponentVisible])
  return (
    <>
      <div
        ref={ref}
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        className="text-black dark:text-white cursor-pointer"
      >
        <div className="pb-6 flex items-center justify-between focus:outline-none focus:bg-substrateBlueBg active:bg-substrateGreen-light">
          <span className="text-lg font-medium hover:text-substrateGreen hover:underline">
            {data.linkTitle}
          </span>
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
        </div>
      </div>
      {isComponentVisible ? (
        <>
          <div className="absolute top-0 -right-56 w-56 h-[336px] pt-6 rounded-tr-md rounded-br-md shadow-lg ring-1 ring-black dark:ring-white ring-opacity-40 bg-white">
            {data.items.map((eachItem, index) => {
              return (
                <a
                  key={index}
                  href={eachItem.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p className="font-medium pl-7 mb-0 pb-6 hover:text-substrateGreen hover:underline">
                    {eachItem.linkTitle}
                  </p>
                </a>
              )
            })}
          </div>
        </>
      ) : null}
    </>
  )
}
