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
            ? 'bg-substrateGreen-light underline dark:bg-substrateGreen-dark hover:text-black'
            : 'hover:text-substrateGreen hover:underline'
        }`}
      >
        <span className="font-medium">{data.linkTitle}</span>
        <span className="absolute right-6 pt-1.5">
          <svg
            name="arrow-next"
            className="fill-current text-black dark:text-white"
            version="1.2"
            baseProfile="tiny"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 7 13"
            overflow="visible"
            xmlSpace="preserve"
            width="13"
            height="13"
          >
            <polygon points="1.4,12.3 0.6,11.7 5.3,6.5 0.6,1.3 1.4,0.7 6.7,6.5 "></polygon>
          </svg>
        </span>
      </div>
      {isComponentVisible ? (
        <>
          <div className="absolute top-0 left-full h-full w-56 pt-4 pb-5 rounded-tr-md rounded-br-md shadow-lg ring-1 ring-black dark:ring-white bg-white dark:bg-darkBackground">
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
