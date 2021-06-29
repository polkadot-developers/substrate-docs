import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface PreviousButtonProps {
  text: string
  link: string
}
export function PreviousButton({ text, link }: PreviousButtonProps) {
  return (
    <>
      <LocalizedLink className="inline-block" to={link}>
        <div className="flex items-center justify-center w-80 h-16 rounded-lg border-2 border-black dark:border-white hover:no-underline">
          <svg
            className="fill-current text-black dark:text-white"
            width="16"
            height="12"
            viewBox="0 0 16 12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.27583 9.16977C6.51871 9.4291 6.6531 9.77643 6.65006 10.1369C6.64703 10.4975 6.5068 10.8423 6.25958 11.0973C6.01237 11.3522 5.67794 11.4968 5.32834 11.4999C4.97874 11.5031 4.64193 11.3645 4.39046 11.114L0.390387 6.98902C0.140421 6.73117 8.78995e-07 6.3815 9.42743e-07 6.0169C1.00649e-06 5.65229 0.140421 5.30262 0.390388 5.04477L4.39046 0.91977C4.51346 0.788443 4.66059 0.683692 4.82326 0.61163C4.98594 0.539568 5.1609 0.501636 5.33794 0.50005C5.51499 0.498464 5.69056 0.533253 5.85443 0.602389C6.01829 0.671526 6.16716 0.773624 6.29235 0.902726C6.41755 1.03183 6.51655 1.18535 6.5836 1.35433C6.65064 1.52332 6.68437 1.70438 6.68284 1.88695C6.6813 2.06952 6.64451 2.24995 6.57463 2.4177C6.50475 2.58546 6.40318 2.73718 6.27583 2.86402L4.5518 4.6419L14.6666 4.6419C15.0203 4.6419 15.3594 4.78676 15.6095 5.04463C15.8595 5.30249 16 5.65223 16 6.0169C16 6.38157 15.8595 6.73131 15.6095 6.98917C15.3594 7.24703 15.0203 7.3919 14.6666 7.3919L4.5518 7.3919L6.27583 9.16977Z"
            />
          </svg>
          <button className="text-lg text-black dark:text-white font-bold pl-4 focus:outline-none hover:no-underline">
            Back - {text}
          </button>
        </div>
      </LocalizedLink>
    </>
  )
}
