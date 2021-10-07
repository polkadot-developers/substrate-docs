import React, { useState, useEffect } from 'react'
import cx from 'classnames'
// import { LocalizedLink } from 'gatsby-theme-i18n'
import { useIntl } from 'react-intl'
import SlideDownNav from './SlideDownNav'
import Icon from './Icon'
import Link from './Link'

interface DocsNavMobileProps {
  templateId: number
  sideNav: {
    name: string
    items: {
      title: string
      link: string
    }[]
  }[]
  globalNav: { section: string; url: string; external: boolean }[]
  pathname: string
  hashLink: string
}

export default function DocsNav({
  templateId,
  sideNav,
  globalNav,
  pathname,
  hashLink,
}: DocsNavMobileProps) {
  const intl = useIntl()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    isOpen
      ? (document.body.style.overflow = `hidden`)
      : (document.body.style.overflow = `unset`)
  }, [isOpen])

  return (
    <nav
      className={cx(
        'bg-substrateGray-light dark:bg-darkBackground w-screen overflow-auto',
        { 'h-docNav z-10': isOpen }
      )}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center items-center py-4 bg-substrateGray dark:bg-gray-700 cursor-pointer"
      >
        <Icon
          name="docsNavIcon"
          className="fill-current text-black dark:text-white"
        />
        <span className="pl-2 font-bold">
          {templateId === 0
            ? `${intl.formatMessage({ id: 'nav-docs' })}`
            : templateId === 1
            ? `${intl.formatMessage({ id: 'nav-tutorials' })}`
            : templateId === 2
            ? `${intl.formatMessage({ id: 'nav-how-to-guides' })}`
            : null}
        </span>
        <Icon
          name="arrowDown"
          className={cx(
            'ml-2 fill-current text-black dark:text-white transform',
            { 'rotate-180': isOpen }
          )}
        />
      </div>
      <div className="overflow-auto">
        {isOpen &&
          sideNav.map((section, index: number) => {
            const current = section.items.some(
              item => item.link === pathname || item.link === hashLink
            )
            return (
              <SlideDownNav
                key={index}
                section={section}
                current={current}
                pathname={pathname}
                hashLink={hashLink}
              />
            )
          })}
      </div>
      <div>
        {isOpen && (
          <>
            <hr className="mt-6" />
            <div className="flex items-center justify-between px-6 sm:px-20 py-4 dark:bg-darkBackground">
              <div className="font-light">More Ways to Learn</div>
            </div>
            {globalNav
              .filter((navItem, index) => templateId != index)
              .map((navItem, index) => {
                return (
                  <div
                    key={index}
                    className="px-6 sm:px-20 lg:px-4 py-4 lg:bg-white lg:dark:bg-black"
                  >
                    <Link to={navItem.url}>
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-substrateDark dark:text-white">
                          {navItem.section}
                        </div>
                        <Icon
                          name="arrowDown"
                          className="fill-current text-substrateDark dark:text-white transform -rotate-90"
                        />
                      </div>
                    </Link>
                  </div>
                )
              })}
          </>
        )}
      </div>
    </nav>
  )
}
