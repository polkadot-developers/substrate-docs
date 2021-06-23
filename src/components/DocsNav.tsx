import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { LocalizedLink } from 'gatsby-theme-i18n'
import SlideDownNav from '../components/SlideDownNav'
import arrowIcon from '../images/nav-icon-arrow-down.svg'
import slideIcon from '../images/docs-nav-slide.svg'

interface DocsNavProps {
  templateId: string
  sideNav: any
  globalNav: string[]
}

export default function DocsNav({
  templateId,
  sideNav,
  globalNav,
}: DocsNavProps) {
  const intl = useIntl()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav
      className={`sticky top-24 h-auto ${
        isOpen
          ? `transition-all transform w-16`
          : `transition-all transform w-60`
      }`}
    >
      <div className="pl-4 pt-10 pb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black p-3 rounded-lg opacity-90 hover:opacity-100 focus:outline-none"
        >
          <img
            className={`${
              isOpen
                ? 'transition transform duration-300 rotate-180'
                : 'transition transform duration-300 rotate-0'
            }`}
            src={slideIcon}
            alt="Substrate Docs Slide Icon"
          />
        </button>
      </div>
      <div
        className={`${
          isOpen
            ? 'transition-all transform duration-75 ease-in-out opacity-0'
            : 'transition-all transform duration-500 ease-in-out opacity-100'
        }`}
      >
        <div className="flex py-5 bg-lightGray">
          <span className="pl-4 font-bold">
            {intl.formatMessage({ id: 'nav-docs' })}
          </span>
        </div>
        <div className="pt-4">
          {sideNav.map((section: any, index: number) => (
            <SlideDownNav key={index} section={section} />
          ))}
        </div>
        <div>
          <hr className="mt-6" />
          <div className="flex items-center justify-between px-20 lg:px-4 py-4 bg-lightGray lg:bg-white">
            <div className="font-light">More Ways to Learn</div>
          </div>
          {globalNav
            .filter(navItem => templateId != navItem)
            .map((navItem, index) => {
              const link = navItem.toLowerCase().replace(' ', '-')
              return (
                <div
                  key={index}
                  className="px-20 lg:px-4 py-4 bg-lightGray lg:bg-white"
                >
                  <LocalizedLink
                    className="flex items-center justify-between"
                    to={`/${link}`}
                  >
                    <div className="font-medium">{navItem}</div>
                    <img
                      className="transform -rotate-90"
                      src={arrowIcon}
                      alt="Substrate Documentation Icon"
                    />
                  </LocalizedLink>
                </div>
              )
            })}
        </div>
      </div>
    </nav>
  )
}
