import React, { useEffect } from 'react'
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
    isComponentVisible ? setItemNavOpen(true) : setItemNavOpen(false)
  }, [isComponentVisible])
  return (
    <>
      <li
        ref={ref}
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        className={`px-6 py-4 -mb-1 text-black dark:text-white cursor-pointer rounded-md ${
          isComponentVisible
            ? 'bg-substrateGreen-light hover:text-black'
            : 'hover:text-substrateGreen hover:underline'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{data.linkTitle}</span>
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
      </li>
      {isComponentVisible ? (
        <>
          <ul className="list-none absolute top-0 -right-56 w-56 h-[336px] rounded-tr-md rounded-br-md shadow-lg ring-1 ring-black dark:ring-white bg-white dark:bg-black">
            {data.items.map((eachItem, index) => {
              return (
                <a
                  key={index}
                  href={eachItem.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <li className="px-6 py-4 m-0 focus:outline-none focus:bg-substrateBlueBg hover:text-substrateGreen hover:underline">
                    <span className="font-medium">{eachItem.linkTitle}</span>
                  </li>
                </a>
              )
            })}
          </ul>
        </>
      ) : null}
    </>
  )
}
