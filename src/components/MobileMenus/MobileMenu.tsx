import React, { useState } from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import LanguageSwitcher from '../LanguageSwitcher'
import MobileSubMenu from './MobileSubMenu'
import logoBlack from '../../images/substrate-logo-light.svg'
import logoWhite from '../../images/substrate-logo-dark.svg'

interface MobileMenuProps {
  theme: string
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
  theme,
  toggleMenu,
  navItems,
  currentLang,
  langConfig,
}: MobileMenuProps) => {
  const [isTechMenuOpen, setIsTechMenuOpen] = useState(false)
  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false)
  const [isVisionMenuOpen, setIsVisionMenuOpen] = useState(false)
  const [isEcoMenuOpen, setIsEcoMenuOpen] = useState(false)

  return (
    <nav className="lg:hidden absolute inset-0 bg-white dark:bg-black z-10 animate-fade-in-right">
      <div className="h-24 px-4 flex items-center justify-between">
        <div>
          <div className="w-40">
            <LocalizedLink to="/">
              {theme === 'light' ? (
                <img src={logoBlack} alt="Substrate Logo" />
              ) : (
                <img src={logoWhite} alt="Substrate Logo" />
              )}
            </LocalizedLink>
          </div>
        </div>
        <div onClick={() => toggleMenu()} className="h-auto">
          <svg
            className="fill-current text-Black dark:text-white"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18.9929 3.02143C19.5491 2.4652 19.5491 1.56337 18.9929 1.00714C18.4366 0.450913 17.5348 0.450913 16.9786 1.00714L10 7.98571L3.02143 1.00714C2.4652 0.450912 1.56337 0.450913 1.00714 1.00714C0.450913 1.56337 0.450913 2.4652 1.00714 3.02143L7.98571 10L1.00714 16.9786C0.450912 17.5348 0.450913 18.4366 1.00714 18.9929C1.56337 19.5491 2.4652 19.5491 3.02143 18.9929L10 12.0143L16.9786 18.9929C17.5348 19.5491 18.4366 19.5491 18.9929 18.9929C19.5491 18.4366 19.5491 17.5348 18.9929 16.9786L12.0143 10L18.9929 3.02143Z" />
          </svg>
        </div>
      </div>
      <div className="bg-white dark:bg-black h-screen z-20">
        <div className="py-8">
          {navItems.map((item, index: number) => {
            return (
              <div
                key={index}
                onClick={() => {
                  index === 0
                    ? setIsTechMenuOpen(!isTechMenuOpen)
                    : index === 2
                    ? setIsVisionMenuOpen(!isVisionMenuOpen)
                    : index === 1
                    ? setIsDevMenuOpen(!isDevMenuOpen)
                    : index === 3
                    ? setIsEcoMenuOpen(!isEcoMenuOpen)
                    : null
                }}
                className="py-3 hover:text-substrateBlue hover:bg-substrateBlue hover:bg-opacity-10"
              >
                <div className="px-4 flex items-center justify-between focus:outline-none">
                  <div className="text-2xl">{item.name}</div>
                  <svg
                    className="fill-current text-black dark:text-white"
                    width="7"
                    height="13"
                    viewBox="0 0 7 13"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 12L6 6.5L1 1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            )
          })}
        </div>
        <div className="pt-2 mx-4 flex justify-between border-b-2 border-gray-300">
          <input
            className="h-10 dark:bg-black text-normal focus:outline-none"
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
        <MobileSubMenu
          toggleMobileNav={toggleMenu}
          toggleSubMenu={() => setIsTechMenuOpen(!isTechMenuOpen)}
          navItem={navItems[0]}
        />
      )}
      {isDevMenuOpen && (
        <MobileSubMenu
          toggleMobileNav={toggleMenu}
          toggleSubMenu={() => setIsDevMenuOpen(!isDevMenuOpen)}
          navItem={navItems[1]}
        />
      )}
      {isVisionMenuOpen && (
        <MobileSubMenu
          toggleMobileNav={toggleMenu}
          toggleSubMenu={() => setIsVisionMenuOpen(!isVisionMenuOpen)}
          navItem={navItems[2]}
        />
      )}
      {isEcoMenuOpen && (
        <MobileSubMenu
          toggleMobileNav={toggleMenu}
          toggleSubMenu={() => setIsEcoMenuOpen(!isEcoMenuOpen)}
          navItem={navItems[3]}
        />
      )}
    </nav>
  )
}
export default MobileMenu
