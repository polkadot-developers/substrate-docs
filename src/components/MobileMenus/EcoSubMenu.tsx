import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import backArrow from '../../images/back-arrow.svg'
import closeIcon from '../../images/close-icon.svg'

interface EcoSubMenuProps {
  toggleMobileNav: () => void
  toggleSubMenu: () => void
  navItems: { name: string; subMenu: { linkTitle: string; link: string }[] }[]
}
export default function coSubMenu({
  toggleMobileNav,
  toggleSubMenu,
  navItems,
}: EcoSubMenuProps) {
  return (
    <div className="absolute inset-0 bg-white h-screen animate-fade-in-right">
      <div className="bg-substrateBlueBg">
        <div className="px-6 h-24 flex items-center justify-between">
          <img
            onClick={toggleSubMenu}
            src={backArrow}
            alt="Substrate Mobile Nav"
          />
          <span className="text-xl text-substrateBlue font-bold">
            {navItems[3].name}
          </span>
          <img
            onClick={toggleMobileNav}
            src={closeIcon}
            alt="Substrate Mobile Nav"
          />
        </div>
      </div>
      <div className="px-6 pt-10">
        {navItems[3].subMenu.map((item, index) => {
          return (
            <LocalizedLink key={index} to={item.link}>
              <div className="pb-6 focus:outline-none focus:bg-substrateBlueBg">
                <span className="text-lg font-medium">{item.linkTitle}</span>
              </div>
            </LocalizedLink>
          )
        })}
      </div>
    </div>
  )
}
