import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface MobileSubMenuProps {
  toggleMobileNav: () => void
  toggleSubMenu: () => void
  navItem: {
    name: string
    subMenu: { linkTitle: string; link: string; external: boolean }[]
  }
}
export default function TechSubMenu({
  toggleMobileNav,
  toggleSubMenu,
  navItem,
}: MobileSubMenuProps) {
  return (
    <div className="absolute inset-0 bg-white dark:bg-black h-screen animate-fade-in-right">
      <div className="bg-substrateBlueBg dark:bg-gray-900">
        <div className="px-6 h-24 flex items-center justify-between">
          <div onClick={() => toggleSubMenu()}>
            <svg
              className="fill-current text-black dark:text-white"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.11836 19.1184C9.60528 19.6053 10.3947 19.6053 10.8816 19.1184C11.3683 18.6317 11.3686 17.8429 10.8824 17.3559L4.7875 11.25L18.75 11.25C19.4404 11.25 20 10.6904 20 10C20 9.30965 19.4404 8.75 18.75 8.75L4.7875 8.75L10.8824 2.64415C11.3686 2.1571 11.3683 1.36826 10.8816 0.881648C10.3947 0.39473 9.60527 0.394731 9.11836 0.881648L1.03312e-06 10L9.11836 19.1184Z" />
            </svg>
          </div>

          <span className="text-xl text-substrateBlue dark:text-white font-bold">
            {navItem.name}
          </span>
          <div onClick={() => toggleMobileNav()}>
            <svg
              className="fill-current text-black dark:text-white"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.9929 3.02143C19.5491 2.4652 19.5491 1.56337 18.9929 1.00714C18.4366 0.450913 17.5348 0.450913 16.9786 1.00714L10 7.98571L3.02143 1.00714C2.4652 0.450912 1.56337 0.450913 1.00714 1.00714C0.450913 1.56337 0.450913 2.4652 1.00714 3.02143L7.98571 10L1.00714 16.9786C0.450912 17.5348 0.450913 18.4366 1.00714 18.9929C1.56337 19.5491 2.4652 19.5491 3.02143 18.9929L10 12.0143L16.9786 18.9929C17.5348 19.5491 18.4366 19.5491 18.9929 18.9929C19.5491 18.4366 19.5491 17.5348 18.9929 16.9786L12.0143 10L18.9929 3.02143Z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="px-6 pt-10">
        {navItem.subMenu.map((item, index) => {
          if (item.external) {
            return (
              <a
                className="text-black dark:text-white hover:no-underline"
                key={index}
                href={item.link}
              >
                <div className="pb-6 focus:outline-none focus:bg-substrateBlueBg">
                  <span className="text-lg font-medium">{item.linkTitle}</span>
                </div>
              </a>
            )
          } else {
            return (
              <LocalizedLink
                className="text-black dark:text-white hover:no-underline"
                key={index}
                to={item.link}
              >
                <div className="pb-6 focus:outline-none focus:bg-substrateBlueBg">
                  <span className="text-lg font-medium">{item.linkTitle}</span>
                </div>
              </LocalizedLink>
            )
          }
        })}
      </div>
    </div>
  )
}
