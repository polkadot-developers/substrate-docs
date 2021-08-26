import React from 'react'
import DifficultyMeter from './DifficultyMeter'
import { useIntl } from 'react-intl'
import { LocalizedLink } from 'gatsby-theme-i18n'

interface PlaygroundCardProps {
  icon: any
  difficulty: number
  title: string
  description: string
  tutData: { name: string; link: string }[]
  playgroundLink: string
}
export default function PlaygroundCard({
  icon,
  difficulty,
  title,
  description,
  tutData,
  playgroundLink,
}: PlaygroundCardProps) {
  const intl = useIntl()
  return (
    <div className="sm:w-96 opacity-80 hover:opacity-100">
      <div className="mb-10 mx-4 border-2 border-black dark:border-gray-700 border-opacity-10 hover:border-opacity-70  rounded-lg">
        <div className="bg-green-200 py-10 pl-6 rounded-t-lg">
          <img
            className="w-10 h-10"
            src={icon}
            alt="Substrate Playground Icon"
          />
        </div>
        <div className="px-4">
          <div className="flex items-center py-6">
            <DifficultyMeter difficulty={difficulty} />
          </div>
          <h4 className="h-16">{title}</h4>
          <p className="font-light">{description}</p>
          <div className="h-28">
            <p className="font-meduim mb-1">
              {intl.formatMessage({ id: 'playground-card-tutorials-headline' })}
            </p>
            <ul className="list-inside text-substrateBlue underline">
              {tutData.map((item, index) => (
                <LocalizedLink key={index} to={item.link}>
                  <li>{item.name}</li>
                </LocalizedLink>
              ))}
            </ul>
          </div>

          <a
            className="block pt-6 pb-10"
            href={playgroundLink}
            target="_blank"
            rel="noreferrer"
          >
            <button className="w-full h-12 text-lg text-white font-bold rounded-lg bg-black hover:bg-opacity-90 dark:bg-gray-800 hover:no-underline focus:outline-none">
              {`${intl.formatMessage({
                id: 'playground-card-cta',
              })}`}
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}
