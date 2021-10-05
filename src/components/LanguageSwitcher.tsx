import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { LocalizedLink } from 'gatsby-theme-i18n'

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
export default function LanguageSwitcher({ currentLang, langConfig }: LanguageSwitcherProps) {
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
      <p className="lg:hidden pt-6 pr-6 ">{intl.formatMessage({ id: 'nav-language' })}</p>
      <div
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center justify-center w-20 cursor-pointer focus:outline-none"
      >
        <div className={`uppercase pr-4`}>
          <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative cursor-pointer">
            {currentLang}
          </div>
          <div
            className={`${
              isMenuOpen
                ? 'absolute -ml-1 w-20 bg-white dark:bg-black rounded-md shadow-lg ring-1 ring-black dark:ring-white ring-opacity-40'
                : 'hidden'
            }`}
          >
            {langConfig.map((lang, index) => {
              return currentLang != lang.code ? (
                <LocalizedLink key={index} to={currentLink} language={lang.code}>
                  <div className="my-2 mx-4 text-black dark:text-white hover:text-substrateGreen dark:hover:text-substrateGreen">
                    {lang.code}
                  </div>
                </LocalizedLink>
              ) : null
            })}
          </div>
        </div>
        <svg
          className="fill-current text-black dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-5 -8 24 24"
          width="16"
          height="16"
          preserveAspectRatio="xMinYMin"
        >
          <path d="M7.071 5.314l4.95-4.95a1 1 0 1 1 1.414 1.414L7.778 7.435a1 1 0 0 1-1.414 0L.707 1.778A1 1 0 1 1 2.121.364l4.95 4.95z"></path>
        </svg>
        {/* <svg
          className="fill-current text-black dark:text-white"
          width="11"
          height="6"
          viewBox="0 0 11 6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.839844 1L5.33984 5L9.83984 1"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg> */}
      </div>
    </div>
  )
}
