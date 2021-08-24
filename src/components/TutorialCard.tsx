import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import DifficultyMeter from './DifficultyMeter'

interface TutorialCardProps {
  title: string
  image: any
  description: string
  time: string
  difficulty: string
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
    <div className="w-80 md:w-96 mb-8 mx-4 rounded bg-substrateGray-light dark:bg-gray-900">
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
                  className="fill-current text-black dark:text-white"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.02622 0C10.8539 0 14 3.14607 14 7.02622C14 10.8539 10.8539 14 7.02622 14C3.14607 14 0 10.8539 0 7.02622C0 3.14607 3.14607 0 7.02622 0ZM6.29213 3.1985C6.29213 2.51685 7.34082 2.51685 7.34082 3.1985V6.92135L9.75281 7.603C10.382 7.81273 10.1199 8.80899 9.4382 8.65168L6.71161 7.81273C6.44944 7.7603 6.29213 7.55056 6.29213 7.28839V3.1985ZM7.02622 1.04869C3.72285 1.04869 1.04869 3.72285 1.04869 7.02622C1.04869 10.2772 3.72285 12.9513 7.02622 12.9513C10.2772 12.9513 12.9513 10.2772 12.9513 7.02622C12.9513 3.72285 10.2772 1.04869 7.02622 1.04869Z" />
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
            <button className="w-full lg:w-52 py-3 rounded bg-substrateDark transform transition-all duration-300 ease-in-out hover:bg-opacity-80 text-white text-lg font-bold focus:outline-none">
              Try it now!
            </button>
          </LocalizedLink>
        </div>
      </div>
    </div>
  )
}
