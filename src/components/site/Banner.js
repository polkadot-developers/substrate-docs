import cx from 'classnames'
import React from 'react'

import { useSessionStorage } from '../../hooks/use-session-storage'
import Icon from '../Icon'

const Banner = () => {
  const [isBannerOpen, setIsBannerOpen] = useSessionStorage('banner', true)

  return (
    <>
      {isBannerOpen && (
        <div
          className={cx(
            'hidden md:block fixed z-50 right-10 bottom-8 max-w-sm p-6 transition-all text-white dark:text-black dark:bg-substrateGray bg-substrateBlackish m-0 shadow-xxl rounded-md'
          )}
        >
          <span className="block pr-2 mb-2 font-bold text-xl">
            Join the Polkadot Hackathon
          </span>
          <div className="underline-animate underline-animate-thin">
            <p className="mb-0 leading-relaxed">
              Put your skills to work at Polkadot Hackathon: North America
              Edition. The 6-week virtual program offers technical workshops,
              mentorship, a prize pool of over $600,000, and an in-person Hacker
              House in NYC!
              <a
                href="https://www.polkadotglobalseries.com/?utm_source=substrate.io&utm_medium=display&utm_campaign=na%20launch&utm_content=popup"
                target="_blank"
                rel="noreferrer"
              >
                Register now!
              </a>
            </p>
          </div>

          <div
            className="absolute right-4 top-4 cursor-pointer duration-150 ease-in-out hover:scale-110"
            onClick={() => setIsBannerOpen(false)}
          >
            <Icon name="closeIcon" className="fill-current h-4 w-4" />
          </div>
        </div>
      )}
    </>
  )
}

export default Banner
