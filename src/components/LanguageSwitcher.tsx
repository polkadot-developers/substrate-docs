import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { LocalizedLink } from 'gatsby-theme-i18n'
import arrowIcon from '../images/nav-icon-arrow-down.svg'

interface LanguageSwitcherProps {
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
export default function LanguageSwitcher({
  currentLang,
  langConfig,
}: LanguageSwitcherProps) {
  const intl = useIntl()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLink, setCurrentLink] = useState('')
  useEffect(() => {
    const currentPath = location.pathname
    currentLang === 'en'
      ? setCurrentLink(`${currentPath.substr(0)}`)
      : currentLang === 'zh-CN'
      ? setCurrentLink(`${currentPath.substr(6)}`)
      : setCurrentLink(`${currentPath.substr(3)}`)
  })
  return (
    <div className="flex items-center px-4">
      <p className="lg:hidden pt-6 pr-6 ">
        {intl.formatMessage({ id: 'nav-language' })}
      </p>
      <div
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center justify-center w-20 cursor-pointer focus:outline-none"
      >
        <div className={`uppercase pr-4`}>
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative cursor-pointer"
          >
            {currentLang}
          </div>
          <div
            className={`${
              isMenuOpen
                ? 'absolute -ml-1 w-20 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-40'
                : 'hidden'
            }`}
          >
            {langConfig.map((lang, index) => {
              return currentLang != lang.code ? (
                <LocalizedLink
                  key={index}
                  to={currentLink}
                  language={lang.code}
                >
                  <div className="my-2 mx-4 hover:text-substrateBlue">
                    {lang.code}
                  </div>
                </LocalizedLink>
              ) : null
            })}
          </div>
        </div>
        <img src={arrowIcon} alt="Navigation Arrow" />
      </div>
    </div>
  )
}
