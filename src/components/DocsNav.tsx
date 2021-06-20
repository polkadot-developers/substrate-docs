import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { graphql } from 'gatsby'
import arrowIcon from '../images/nav-icon-arrow-down.svg'
import { kbSideBar, IkbSideBar, globalDocsNav } from '../sidebar/kbSideBar'
import docsIcon from '../images/docs-icon.svg'
import SlideDownNav from '../components/SlideDownNav'

interface DocsNavProps {
  templateId: string
}

export default function DocsNav({ templateId }: DocsNavProps) {
  const intl = useIntl()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    isOpen
      ? (document.body.style.overflow = `hidden`)
      : (document.body.style.overflow = `unset`)
  }, [isOpen])

  return (
    <nav
      className={`bg-lightGray absolute inset-x-0 overflow-y-auto ${
        isOpen ? 'h-screen' : null
      }`}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center items-center py-4 border-t border-b border-gray-200"
      >
        <svg
          width="17"
          height="20"
          viewBox="0 0 17 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.8457 6.87994V6.875C16.8457 6.86188 16.8453 6.84875 16.8445 6.83569C16.8454 6.85038 16.8458 6.86519 16.8457 6.87994L10.1589 0.00562983C10.1317 0.00190036 10.1042 0 10.0765 0H3.92262C2.22329 0 0.845703 1.39911 0.845703 3.125V16.875C0.845703 18.6009 2.22329 20 3.92262 20H13.7688C15.4681 20 16.8457 18.6009 16.8457 16.875V6.87994ZM9.46108 4.375C9.46108 6.10089 10.8387 7.5 12.538 7.5H15.6149V16.875C15.6149 17.9106 14.7884 18.75 13.7688 18.75H3.92262C2.90302 18.75 2.07647 17.9106 2.07647 16.875V3.125C2.07647 2.08947 2.90302 1.25 3.92262 1.25H9.46108V4.375ZM10.6918 2.13388L14.7446 6.25H12.538C11.5184 6.25 10.6918 5.41053 10.6918 4.375V2.13388Z"
            fill="#26E0A2"
          />
        </svg>
        <span className="pl-2 font-bold">
          {intl.formatMessage({ id: 'nav-docs' })}
        </span>
        <img
          className={`transform duration-300 ease-in-out ml-2 ${
            isOpen ? null : '-rotate-180'
          }`}
          src={arrowIcon}
          alt="Substrate Documentation Icon"
        />
      </div>
      <div>
        {isOpen &&
          kbSideBar.map((section: IkbSideBar, index: number) => (
            <SlideDownNav key={index} section={section} />
          ))}
      </div>
      <div>
        {isOpen && (
          <>
            <hr className="mt-6" />
            <div className="flex items-center justify-between px-20 py-4 bg-lightGray">
              <div className="font-light">More Ways to Learn</div>
            </div>
            {globalDocsNav
              .filter(navItem => templateId != navItem)
              .map((navItem, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between px-20 py-4 bg-lightGray"
                  >
                    <div className="font-medium">{navItem}</div>
                    <img
                      className="transform -rotate-90"
                      src={arrowIcon}
                      alt="Substrate Documentation Icon"
                    />
                  </div>
                )
              })}
          </>
        )}
      </div>
    </nav>
  )
}
