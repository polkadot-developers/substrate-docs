import React, { useState, useEffect } from 'react'
import MobileMenu from './MobileMenu'
import DocsButton from './DocsButton'
import logo from '../images/substrate-logo-light.svg'
import arrowIcon from '../images/nav-icon-arrow-down.svg'
import { LocalizedLink, useLocalization } from 'gatsby-theme-i18n'
import { useIntl } from 'react-intl'

export default function Header() {
  const intl = useIntl()
  const { locale, config } = useLocalization()
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)
  const navItems = [
    {
      name: `${intl.formatMessage({ id: 'nav-technology' })}`,
      link: '#',
      subMenu: [
        `${intl.formatMessage({ id: 'nav-overview' })}`,
        `${intl.formatMessage({ id: 'nav-modular' })}`,
        `${intl.formatMessage({ id: 'nav-scalable' })}`,
        `${intl.formatMessage({ id: 'nav-interoperable' })}`,
        `${intl.formatMessage({ id: 'nav-flexible' })}`,
        `${intl.formatMessage({ id: 'nav-sovereign' })}`,
        `${intl.formatMessage({ id: 'nav-secure' })}`,
        `${intl.formatMessage({ id: 'nav-opensource' })}`,
        `${intl.formatMessage({ id: 'nav-white-papers' })}`,
      ],
    },
    {
      name: `${intl.formatMessage({ id: 'nav-developers' })}`,
      link: '#',
      subMenu: [
        `${intl.formatMessage({ id: 'nav-overview' })}`,
        `${intl.formatMessage({ id: 'nav-docs' })}`,
        `${intl.formatMessage({ id: 'nav-how-to-guides' })}`,
        `${intl.formatMessage({ id: 'nav-tutorials' })}`,
        `${intl.formatMessage({ id: 'nav-rust-docs' })}`,
        `${intl.formatMessage({ id: 'nav-marketplace' })}`,
        `${intl.formatMessage({ id: 'nav-playground' })}`,
        `${intl.formatMessage({ id: 'nav-light-clients' })}`,
      ],
    },
    {
      name: `${intl.formatMessage({ id: 'nav-vision' })}`,
      link: '#',
      subMenu: [
        `${intl.formatMessage({ id: 'nav-overview' })}`,
        `${intl.formatMessage({ id: 'nav-web3' })} & ${intl.formatMessage({
          id: 'nav-substrate',
        })}`,
        `${intl.formatMessage({ id: 'nav-substrate' })} & ${intl.formatMessage({
          id: 'nav-polkadot',
        })}`,
        `${intl.formatMessage({ id: 'nav-substrate' })} & ${intl.formatMessage({
          id: 'nav-ethereum',
        })}`,
      ],
    },
    {
      name: `${intl.formatMessage({ id: 'nav-ecosystem' })}`,
      link: '#',
      subMenu: [
        `${intl.formatMessage({ id: 'nav-overview' })}`,
        `${intl.formatMessage({ id: 'nav-builders' })}`,
        `${intl.formatMessage({ id: 'nav-opportunities' })}`,
        `${intl.formatMessage({ id: 'nav-resources' })}`,
        `${intl.formatMessage({ id: 'nav-connect' })}`,
      ],
    },
  ]

  useEffect(() => {
    isOpen
      ? (document.body.style.overflow = `hidden`)
      : (document.body.style.overflow = `unset`)
  }, [isOpen])

  return (
    <header className="container">
      <div className="h-24 flex items-center justify-between">
        <div className="w-40">
          <LocalizedLink to="/">
            <img src={logo} alt="Substrate Logo" />
          </LocalizedLink>
        </div>
        {/* ------------------ */}
        {/* Mobile Navigation */}
        {/* ------------------ */}
        <div className="lg:hidden" onClick={() => toggleMenu()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="16"
            viewBox="0 0 24 16"
            fill="none"
          >
            <path
              d="M0 14.6667C0 15.403 0.596954 16 1.33333 16H22.6667C23.403 16 24 15.403 24 14.6667C24 13.9303 23.403 13.3333 22.6667 13.3333H1.33333C0.596954 13.3333 0 13.9303 0 14.6667ZM0 8C0 8.73638 0.596954 9.33333 1.33333 9.33333H22.6667C23.403 9.33333 24 8.73638 24 8C24 7.26362 23.403 6.66667 22.6667 6.66667H1.33333C0.596954 6.66667 0 7.26362 0 8ZM1.33333 0C0.596954 0 0 0.596954 0 1.33333C0 2.06971 0.596954 2.66667 1.33333 2.66667H22.6667C23.403 2.66667 24 2.06971 24 1.33333C24 0.596954 23.403 0 22.6667 0H1.33333Z"
              fill="black"
            />
          </svg>
        </div>
        {isOpen && (
          <MobileMenu
            toggleMenu={toggleMenu}
            navItems={navItems}
            currentLang={locale}
            langConfig={config}
          />
        )}
        {/* ------------------ */}
        {/* Desktop Navigation */}
        {/* ------------------ */}
        <nav className="hidden lg:flex lg:items-center  w-full">
          <div className="w-2/3 flex justify-evenly">
            {navItems.map((item, index) => (
              <div key={index}>
                <span className="font-medium">{item.name}</span>
                <img
                  className="inline-block pl-2 pt-1"
                  src={arrowIcon}
                  alt="Substrate Navigation Icon"
                />
              </div>
            ))}
          </div>
          <div className=" w-1/2 flex items-center justify-end">
            <div className="flex items-center border-b-2 border-gray-300">
              <input
                className=" text-normal focus:outline-none"
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
            <div className="pl-8">
              <DocsButton />
            </div>
            <div className="flex items-center pl-8">
              <ul className="list-none uppercase">
                <li>{locale}</li>
              </ul>
              <img className="pl-1" src={arrowIcon} alt="Navigation Arrow" />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
