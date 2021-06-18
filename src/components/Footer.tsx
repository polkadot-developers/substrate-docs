import React from 'react'
import { useIntl } from 'react-intl'
// import { LocalizedLink } from 'gatsby-theme-i18n'
import substratelogo from '../images/substrate-logo-dark.svg'

const navLinks = [
  {
    name: 'Modular',
    link: '#',
  },
  {
    name: 'Scalable',
    link: '#',
  },
  {
    name: 'Flexible',
    link: '#',
  },
]
export default function Footer() {
  const intl = useIntl()

  return (
    <footer className="bg-black">
      <div className="container">
        <div className="w-40 py-10">
          <img src={substratelogo} alt="Substrate Logo" />
        </div>
        <div className="text-white flex flex-wrap justify-between">
          <div className="pb-8 w-60">
            <h5 className="text-substrateGreen font-bold mb-4 cursor-none">
              {intl.formatMessage({ id: 'nav-technology' })}
            </h5>
            <ul className="list-none">
              {navLinks.map((item, index) => (
                <li
                  key={index}
                  className="mb-4 text-xl font-light opacity-90 hover:opacity-100 cursor-pointer"
                >
                  <a href={item.link}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="pb-8 w-60">
            <h5 className="text-substrateGreen font-bold mb-4 cursor-none">
              {intl.formatMessage({ id: 'nav-developers' })}
            </h5>
            <ul className="list-none">
              {navLinks.map((item, index) => (
                <li
                  key={index}
                  className="mb-4 text-xl font-light opacity-90 hover:opacity-100 cursor-pointer"
                >
                  <a href={item.link}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="pb-8 w-60">
            <h5 className="text-substrateGreen font-bold mb-4 cursor-none">
              {intl.formatMessage({ id: 'nav-vision' })}
            </h5>
            <ul className="list-none">
              {navLinks.map((item, index) => (
                <li
                  key={index}
                  className="mb-4 text-xl font-light opacity-90 hover:opacity-100 cursor-pointer"
                >
                  <a href={item.link}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="pb-8 w-60">
            <h5 className="text-substrateGreen font-bold mb-4 cursor-none">
              {intl.formatMessage({ id: 'nav-ecosystem' })}
            </h5>
            <ul className="list-none">
              {navLinks.map((item, index) => (
                <li
                  key={index}
                  className="pb-4 text-xl font-light opacity-90 hover:opacity-100 cursor-pointer"
                >
                  <a href={item.link}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-white lg:flex lg:justify-between">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center lg:w-2/3">
            <span className="opacity-90 py-2">
              © {new Date().getFullYear()} Parity Technologies{` `}All Rights
              Reserved{` `}
            </span>
            <a
              href="https://www.parity.io/privacy"
              target="_blank"
              rel="noreferrer"
              className="opacity-90 my-2"
            >
              Privacy Policy
            </a>
            <a
              href="https://www.parity.io/terms"
              target="_blank"
              rel="noreferrer"
              className="opacity-90 my-2"
            >
              Terms of Services
            </a>
          </div>
          <div className="flex justify-center py-6 text-white lg:">
            <svg
              className="w-5 mx-4 h-auto fill-current"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Twitter icon</title>
              <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"></path>
            </svg>
            <svg
              className="w-5 mx-4 h-auto fill-current"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Twitter icon</title>
              <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"></path>
            </svg>
            <svg
              className="w-5 mx-4 h-auto fill-current"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Twitter icon</title>
              <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"></path>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  )
}
