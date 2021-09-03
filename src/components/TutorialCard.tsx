import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import DifficultyMeter from './DifficultyMeter'

interface TutorialCardProps {
  title: string
  image: any
  description: string
  time: string
  difficulty: number
  prerequisites: boolean
  version: string
  link: string
}

export default function TutorialCard({
  title,
  description,
  image,
  time,
  difficulty,
  prerequisites,
  version,
  link,
}: TutorialCardProps) {
  const tutImage = getImage(image)
  return (
    <div className="w-80 md:w-96 mb-8 mx-4 rounded bg-substrateGray-light dark:bg-substrateDark">
      <LocalizedLink to={link}>
        <div className="inline-block overflow-hidden">
          <GatsbyImage
            className="block h-24 md:h-60 object-cover rounded-t transform transition-all duration-300 ease-in-out hover:scale-110"
            image={tutImage}
            alt={`Tutorial Image`}
          />
        </div>
      </LocalizedLink>
      <div className="md:h-[335px] md:flex md:flex-col md:justify-between">
        <div className="px-4">
          <div>
            <LocalizedLink to={link}>
              <h4 className="my-3 font-bold">{title}</h4>
            </LocalizedLink>
            <p className="mb-3 text-sm md:text-base">{description}</p>
          </div>
          <div className="my-4">
            <div className="flex flex-col md:flex-row-reverse md:justify-between">
              <div className="flex items-center">
                <svg
                  className="fill-current text-black dark:text-substrateWhite"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                >
                  <path d="M9 0.181023C4.02823 0.181023 0 4.20925 0 9.18102C0 14.1528 4.02823 18.181 9 18.181C13.9718 18.181 18 14.1528 18 9.18102C18 4.20925 13.9718 0.181023 9 0.181023ZM12.3565 11.5399L11.6307 12.4472C11.5831 12.5067 11.5242 12.5563 11.4574 12.5931C11.3906 12.6299 11.3172 12.6531 11.2414 12.6616C11.1656 12.67 11.0889 12.6634 11.0157 12.6422C10.9424 12.621 10.8741 12.5855 10.8145 12.5379L8.38306 10.7335C8.21317 10.5975 8.07604 10.425 7.98182 10.2288C7.88759 10.0327 7.83868 9.81781 7.83871 9.60017V3.95522C7.83871 3.80122 7.89988 3.65353 8.00878 3.54464C8.11767 3.43575 8.26536 3.37457 8.41935 3.37457H9.58064C9.73464 3.37457 9.88233 3.43575 9.99122 3.54464C10.1001 3.65353 10.1613 3.80122 10.1613 3.95522V9.18102L12.2661 10.7234C12.3257 10.771 12.3753 10.83 12.4121 10.8968C12.4489 10.9636 12.4721 11.0371 12.4805 11.1129C12.4889 11.1887 12.4823 11.2655 12.461 11.3387C12.4397 11.412 12.4042 11.4804 12.3565 11.5399Z" />
                </svg>
                <span className="pl-2 text-sm">{time}</span>
              </div>
              <div className="flex items-center py-2">
                <DifficultyMeter difficulty={difficulty} />
              </div>
            </div>
            <hr />
            <div>
              <span className="px-4 p-2 text-sm rounded border border-substrateDark">
                {prerequisites ? `Prerequisities` : `No Prerequisites`}
              </span>
              <span className="ml-4 px-4 p-2 text-sm rounded border border-substrateDark">
                {version}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <LocalizedLink to={link}>
            <button className="w-full lg:w-52 py-3 rounded bg-substrateDark dark:bg-substrateWhite transform transition-all duration-300 ease-in-out hover:bg-opacity-80 dark:hover:bg-opacity-80 text-white dark:text-substrateDark text-lg font-bold focus:outline-none">
              Try it now!
            </button>
          </LocalizedLink>
        </div>
      </div>
    </div>
  )
}
