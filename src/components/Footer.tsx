import React, { Fragment } from 'react'
import { graphql } from 'gatsby'
import MainNav from './MainNav'
import { Link } from 'gatsby'
import FooterNavItem from './FooterNavItem'
import { useStaticQuery } from 'gatsby'

export default function Footer() {
  const { site } = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          github
          twitter
          stackOverflow
          element
          terms
          privacy
        }
      }
    }
  `)
  const navItems = MainNav.global()
  return (
    <footer className="w-full px-6 xl:px-12 2xl:px-28 bg-substrateDark text-whitef font-body">
      <div className="lg:flex lg:flex-row-reverse lg:justify-between lg:pt-12 lg:pb-3 border-b-2 border-gray-600">
        <div className="w-44 lg::h-7 relative py-12 lg:p-0 transform transition-all duration-300 ease-in-out hover:opacity-50">
          <Link to="/">
            <svg
              className={`fill-current text-white lg:w-44`}
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 419.75 58.11"
            >
              <path d="M28.33,16.42A16.57,16.57,0,0,1,34.06,26.5H22.54a6.44,6.44,0,0,0-2.27-3.86,6.93,6.93,0,0,0-4.43-1.4,4.85,4.85,0,0,0-3.17.9,3.14,3.14,0,0,0-1.08,2.56,3,3,0,0,0,2,2.8,31.55,31.55,0,0,0,6.23,1.88,62.91,62.91,0,0,1,7.56,2.19,12.52,12.52,0,0,1,5.11,3.64A10,10,0,0,1,34.63,42a10.38,10.38,0,0,1-1.87,6.12,12.4,12.4,0,0,1-5.4,4.17A21.07,21.07,0,0,1,19,53.78q-8.15,0-13-3.6A15.17,15.17,0,0,1,0,39.89H11.88a5.31,5.31,0,0,0,2.2,4A8.26,8.26,0,0,0,19,45.22a4.59,4.59,0,0,0,3.17-1,3.26,3.26,0,0,0,1.08-2.55,3.08,3.08,0,0,0-2-3,36.19,36.19,0,0,0-6.45-1.91,51.23,51.23,0,0,1-7.34-2,12.12,12.12,0,0,1-5-3.5A9.71,9.71,0,0,1,.43,24.7,10.75,10.75,0,0,1,4.54,16q4.09-3.34,11.59-3.35T28.33,16.42Z" />
              <path d="M82.37,13.1V53.28H70V46a13.32,13.32,0,0,1-5.15,5.61,14.88,14.88,0,0,1-7.95,2.09q-6.91,0-11-4.61T41.83,36.43V13.1H54.07V34.92a8.93,8.93,0,0,0,2.13,6.37,7.46,7.46,0,0,0,5.72,2.27,7.55,7.55,0,0,0,5.9-2.38C69.26,39.6,70,37.34,70,34.42V13.1Z" />
              <path d="M126.39,15.08a17.15,17.15,0,0,1,6.2,7.13,24.82,24.82,0,0,1,2.26,11,24.87,24.87,0,0,1-2.26,11,17.05,17.05,0,0,1-6.2,7.16,16.22,16.22,0,0,1-8.89,2.48,14.57,14.57,0,0,1-7.92-2.08A12.16,12.16,0,0,1,104.76,46v7.27H92.45V0h12.31V20.38a12.11,12.11,0,0,1,4.82-5.69,14.57,14.57,0,0,1,7.92-2.09A16.3,16.3,0,0,1,126.39,15.08ZM107.17,26a10,10,0,0,0-2.48,7.16,10,10,0,0,0,2.48,7.13,9,9,0,0,0,12.74.07,10.16,10.16,0,0,0,2.42-7.2,10.16,10.16,0,0,0-2.42-7.2,8.27,8.27,0,0,0-6.37-2.59A8.39,8.39,0,0,0,107.17,26Z" />
              <path d="M168.51,16.42a16.57,16.57,0,0,1,5.73,10.08H162.72a6.39,6.39,0,0,0-2.27-3.86,6.93,6.93,0,0,0-4.43-1.4,4.85,4.85,0,0,0-3.17.9,3.14,3.14,0,0,0-1.08,2.56,3,3,0,0,0,2,2.8A31.55,31.55,0,0,0,160,29.38a62.91,62.91,0,0,1,7.56,2.19,12.52,12.52,0,0,1,5.11,3.64A10,10,0,0,1,174.81,42a10.38,10.38,0,0,1-1.87,6.12,12.4,12.4,0,0,1-5.4,4.17,21,21,0,0,1-8.35,1.51q-8.13,0-13-3.6a15.17,15.17,0,0,1-6-10.29h11.88a5.34,5.34,0,0,0,2.2,4,8.26,8.26,0,0,0,4.93,1.37,4.59,4.59,0,0,0,3.17-1,3.26,3.26,0,0,0,1.08-2.55,3.08,3.08,0,0,0-2-3A36.19,36.19,0,0,0,155,36.79a51.23,51.23,0,0,1-7.34-2,12.12,12.12,0,0,1-5-3.5,9.71,9.71,0,0,1-2.09-6.58A10.75,10.75,0,0,1,144.72,16q4.09-3.34,11.59-3.35T168.51,16.42Z" />
              <path d="M205.41,42.7V53.28h-5.54c-4.7,0-8.37-1.16-11-3.49S185,43.61,185,38.23V23.47h-5.39V13.1H185V3.24h12.32V13.1h8.06V23.47h-8.06v15a4.5,4.5,0,0,0,1,3.31,4.67,4.67,0,0,0,3.28.94Z" />
              <path d="M232.88,14.83a15.14,15.14,0,0,1,7.88-2.16V25.85h-3.52c-3.27,0-5.8.69-7.6,2.09s-2.7,3.74-2.7,7.05V53.28H214.63V13.1h12.31v7.56A17.61,17.61,0,0,1,232.88,14.83Z" />
              <path d="M269.28,14.69a12.55,12.55,0,0,1,4.89,5.69V13.1h12.24V53.28H274.17V46a12.6,12.6,0,0,1-4.89,5.69,14.57,14.57,0,0,1-7.92,2.08,16.25,16.25,0,0,1-8.9-2.48,17,17,0,0,1-6.19-7.16,24.87,24.87,0,0,1-2.27-11,24.82,24.82,0,0,1,2.27-11,17.13,17.13,0,0,1,6.19-7.13,16.34,16.34,0,0,1,8.9-2.48A14.57,14.57,0,0,1,269.28,14.69ZM258.94,26a10.2,10.2,0,0,0-2.41,7.2,10.2,10.2,0,0,0,2.41,7.2,9.05,9.05,0,0,0,12.75-.07,10.06,10.06,0,0,0,2.48-7.13A10,10,0,0,0,271.69,26a8.39,8.39,0,0,0-6.37-2.63A8.31,8.31,0,0,0,258.94,26Z" />
              <path d="M318.81,42.7V53.28h-5.54q-7.06,0-11-3.49t-3.93-11.56V23.47H293V13.1h5.4V3.24h12.32V13.1h8.06V23.47h-8.06v15a4.5,4.5,0,0,0,1,3.31,4.66,4.66,0,0,0,3.27.94Z" />
              <path d="M364.24,35.42H336.38q.21,4.55,2.3,6.52a7.43,7.43,0,0,0,5.33,2,7.32,7.32,0,0,0,4.54-1.37A6.36,6.36,0,0,0,350.92,39h13a17,17,0,0,1-3.45,7.6,18.54,18.54,0,0,1-6.77,5.26,23.17,23.17,0,0,1-19.62-.58A17.69,17.69,0,0,1,327,44.14a22.22,22.22,0,0,1-2.6-11,22.5,22.5,0,0,1,2.56-11,17.56,17.56,0,0,1,7.16-7.13,23.66,23.66,0,0,1,21,0,17.33,17.33,0,0,1,7,6.87,20.56,20.56,0,0,1,2.48,10.19A17,17,0,0,1,364.24,35.42ZM350,24.3a7.8,7.8,0,0,0-5.43-2,8,8,0,0,0-5.62,2,8.41,8.41,0,0,0-2.52,5.9h15.7C352.19,27.6,351.49,25.62,350,24.3Z" />
              <path
                className="fill-current text-substrateGreen"
                d="M419.75,46.09v12H375.19v-12Z"
              />
            </svg>
          </Link>
        </div>
        <nav>
          <div className="h-[600px] lg:w-full lg:max-w-screen md:h-auto flex flex-col flex-wrap lg:flex-row">
            {navItems.map((section, index) => {
              return (
                <div
                  className={`pb-4 w-1/2 sm:w-40 md:w-full md:flex md:items-start`}
                  key={index}
                >
                  <span className="block text-base md:text-lg mb-4 font-semibold text-substrateGreen md:w-28">
                    {section.name}
                  </span>
                  <ul className="list-none ml-0 md:ml-7 md:mt-0.5 md:flex md:flex-wrap md:w-full">
                    {section.subMenu.map((item, index) => {
                      const itemStyles =
                        'underline-anchor text-sm md:text-base pb-4 md:mr-6'
                      if (item.items) {
                        return (
                          <Fragment key={index}>
                            {item.items.map((each, index) => {
                              return (
                                <div className={itemStyles} key={index}>
                                  <FooterNavItem
                                    external={each.external}
                                    link={each.link}
                                    title={each.linkTitle}
                                  />
                                </div>
                              )
                            })}
                          </Fragment>
                        )
                      }
                      return (
                        <div className={itemStyles} key={index}>
                          <FooterNavItem
                            external={item.external}
                            link={item.link}
                            title={item.linkTitle}
                          />
                        </div>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </nav>
      </div>
      <div className="h-auto pb-6 md:flex md:flex-row-reverse md:justify-between md:items-center">
        <div className="flex items-center py-4">
          <a
            className="mr-11 md:mr-0 md:ml-9 transform transition-all duration-300 ease-in-out hover:opacity-50"
            href={site.siteMetadata.twitter}
            target="_blank"
            rel="noreferrer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 4.55705C23.117 4.94905 22.168 5.21305 21.172 5.33205C22.189 4.72305 22.97 3.75805 23.337 2.60805C22.386 3.17205 21.332 3.58205 20.21 3.80305C19.313 2.84605 18.032 2.24805 16.616 2.24805C13.437 2.24805 11.101 5.21405 11.819 8.29305C7.728 8.08805 4.1 6.12805 1.671 3.14905C0.381 5.36205 1.002 8.25705 3.194 9.72305C2.388 9.69705 1.628 9.47605 0.965 9.10705C0.911 11.388 2.546 13.522 4.914 13.997C4.221 14.185 3.462 14.229 2.69 14.081C3.316 16.037 5.134 17.46 7.29 17.5C5.22 19.123 2.612 19.848 0 19.54C2.179 20.937 4.768 21.752 7.548 21.752C16.69 21.752 21.855 14.031 21.543 7.10605C22.505 6.41105 23.34 5.54405 24 4.55705Z"
                fill="#FBFBFB"
              />
            </svg>
          </a>
          <a
            className="mr-11 md:mr-0 md:ml-9 transform transition-all duration-300 ease-in-out hover:opacity-50"
            href={site.siteMetadata.stackOverflow}
            target="_blank"
            rel="noreferrer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M18.6941 16.1147H20.9251V25H0.846191V16.1147H3.07718V22.7787H18.6941V16.1147Z"
                  fill="white"
                />
                <path
                  d="M5.51104 15.4483L16.4632 17.7504L16.9297 15.5695L5.97752 13.2674L5.51104 15.4483ZM6.95105 10.2383L17.0919 14.9435L18.0452 12.9241L7.90429 8.2189L6.95105 10.2383ZM9.77021 5.2706L18.3697 12.399L19.8097 10.6826L11.2102 3.55412L9.77021 5.2706ZM15.3274 0L13.5223 1.33279L20.195 10.2787L22.0001 8.94588L15.3274 0ZM5.30823 20.5574H16.4632V18.336H5.30823V20.5574Z"
                  fill="white"
                />
              </g>
            </svg>
          </a>
          <a
            className="mr-11 md:mr-0 md:ml-9 transform transition-all duration-300 ease-in-out hover:opacity-50"
            href={site.siteMetadata.element}
            target="_blank"
            rel="noreferrer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 23.5C9 24.3286 9.67143 25 10.5 25C16.0214 25 20.5 20.5214 20.5 15C20.5 14.1714 19.8286 13.5 19 13.5C18.1714 13.5 17.5 14.1714 17.5 15C17.5 18.8643 14.3643 22 10.5 22C9.67143 22 9 22.6714 9 23.5Z"
                fill="white"
              />
              <path
                d="M16 1.5C16 0.67143 15.3286 9.53674e-07 14.5 9.53674e-07C8.97857 9.53674e-07 4.5 4.47857 4.5 10C4.5 10.8286 5.17143 11.5 6 11.5C6.82857 11.5 7.5 10.8286 7.5 10C7.5 6.13571 10.6357 3 14.5 3C15.3286 3 16 2.32857 16 1.5Z"
                fill="white"
              />
              <path
                d="M1.5 8.99999C0.671429 8.99999 0 9.67142 0 10.5C0 16.0214 4.47857 20.5 10 20.5C10.8286 20.5 11.5 19.8286 11.5 19C11.5 18.1714 10.8286 17.5 10 17.5C6.13571 17.5 3 14.3643 3 10.5C3 9.67142 2.32857 8.99999 1.5 8.99999Z"
                fill="white"
              />
              <path
                d="M23.5 16C24.3286 16 25 15.3286 25 14.5C25 8.97856 20.5214 4.49998 15 4.49998C14.1714 4.49998 13.5 5.17141 13.5 5.99999C13.5 6.82856 14.1714 7.49999 15 7.49999C18.8643 7.49999 22 10.6357 22 14.5C22 15.3286 22.6714 16 23.5 16Z"
                fill="white"
              />
            </svg>
          </a>
        </div>
        <div className="md:underline-anchor inline-flex flex-col md:flex-row py-6 text-[#DFE3EA] text-xs font-light">
          <div className="mb-4 md:mb-0 md:pr-8 inline-block">
            © {new Date().getFullYear()} Parity Technologies{` `}All Rights
            Reserved{` `}
          </div>
          <div className="mb-4 md:mb-0 md:mr-8 inline-block">
            <a
              className="block"
              href={site.siteMetadata.privacy}
              target="_blank"
              rel="noreferrer"
            >
              Privacy Policy
            </a>
          </div>

          <div className="mb-4 md:mb-0 md:mr-8 inline-block">
            <a
              className="block"
              href={site.siteMetadata.terms}
              target="_blank"
              rel="noreferrer"
            >
              Terms of Services
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
