import React, { useState } from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import LanguageSwitcher from '../LanguageSwitcher'
import TechSubMenu from './TechSubMenu'
import DevSubMenu from './DevSubMenu'
import VisionSubMenu from './VisionSubMenu'
import EcoSubMenu from './EcoSubMenu'
import logo from '../../images/substrate-logo-light.svg'
import arrowIcon from '../../images/nav-icon-arrow.svg'
import closeIcon from '../../images/close-icon.svg'

interface MobileMenuProps {
  toggleMenu: () => void
  navItems: { name: string; subMenu: { linkTitle: string; link: string }[] }[]
  currentLang: string
  langConfig: {
    code: string
    dataFormat: string
    hrefLang: string
    langDir: string
    localName: string
    name: string
  }[]
}

const MobileMenu = ({
  toggleMenu,
  navItems,
  currentLang,
  langConfig,
}: MobileMenuProps) => {
  const [isTechMenuOpen, setIsTechMenuOpen] = useState(false)
  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false)
  const [isVisionMenuOpen, setIsVisionMenuOpen] = useState(false)
  const [isEcoMenuOpen, setIsEcoMenuOpen] = useState(false)
  console.log(isTechMenuOpen)
  console.log(currentLang)
  return (
    <nav className="lg:hidden absolute inset-0 bg-white z-10 animate-fade-in-right">
      <div className="h-24 px-4 flex items-center justify-between">
        <div>
          <div className="w-40">
            <LocalizedLink to="/">
              <img src={logo} alt="Substrate Logo" />
            </LocalizedLink>
          </div>
        </div>
        <div onClick={() => toggleMenu()} className="h-auto">
          <img src={closeIcon} alt="Substrate Menu Close Icon" />
        </div>
      </div>
      <div className="bg-white h-screen z-20">
        <div className="py-8">
          {navItems.map((item, index: number) => {
            return (
              <div
                key={index}
                onClick={() => {
                  item.name === 'Technology'
                    ? setIsTechMenuOpen(!isTechMenuOpen)
                    : item.name === 'Vision'
                    ? setIsVisionMenuOpen(!isVisionMenuOpen)
                    : item.name === 'Developers'
                    ? setIsDevMenuOpen(!isDevMenuOpen)
                    : item.name === 'Ecosystem'
                    ? setIsEcoMenuOpen(!isEcoMenuOpen)
                    : null
                }}
                className="py-3 hover:text-substrateBlue hover:bg-substrateBlue hover:bg-opacity-10"
              >
                <div className="px-4 flex items-center justify-between focus:outline-none">
                  <div className="text-2xl">{item.name}</div>
                  <img src={arrowIcon} alt="Navigation Arrow" />
                </div>
              </div>
            )
          })}
        </div>
        <div className="pt-2 mx-4 flex justify-between border-b-2 border-gray-300">
          <input
            className="h-10 text-normal focus:outline-none"
            type="search"
            name="search"
            placeholder="Search Docs"
          />
          <button type="submit" className="">
            <svg
              className="text-gray-600 h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              viewBox="0 0 56.966 56.966"
              width="512px"
              height="512px"
            >
              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </button>
        </div>
        <LanguageSwitcher currentLang={currentLang} langConfig={langConfig} />
      </div>
      {isTechMenuOpen && (
        <TechSubMenu
          toggleMobileNav={toggleMenu}
          toggleSubMenu={() => setIsTechMenuOpen(!isTechMenuOpen)}
          navItems={navItems}
        />
      )}
      {isDevMenuOpen && (
        <DevSubMenu
          toggleMobileNav={toggleMenu}
          toggleSubMenu={() => setIsDevMenuOpen(!isDevMenuOpen)}
          navItems={navItems}
        />
      )}
      {isVisionMenuOpen && (
        <VisionSubMenu
          toggleMobileNav={toggleMenu}
          toggleSubMenu={() => setIsVisionMenuOpen(!isVisionMenuOpen)}
          navItems={navItems}
        />
      )}
      {isEcoMenuOpen && (
        <EcoSubMenu
          toggleMobileNav={toggleMenu}
          toggleSubMenu={() => setIsEcoMenuOpen(!isEcoMenuOpen)}
          navItems={navItems}
        />
      )}
    </nav>
  )
}
export default MobileMenu
