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
            Use our StackExchange
          </span>
          <div className="underline-animate underline-animate-thin">
            <p className="mb-0 leading-relaxed">
              The Substrate developer community is in the beta phase of its
              Stack Exchange campaign and needs your help.{' '}
              <strong className="font-bold">
                We have until April 7th to increase the engagement on the site,
                otherwise it will get shut down.
              </strong>
              <a
                href="https://substrate.stackexchange.com/"
                target="_blank"
                rel="noreferrer"
              >
                Visit the page here
              </a>{' '}
              and help us get past the beta phase by asking questions, upvoting
              or downvoting existing questions or providing answers.
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
