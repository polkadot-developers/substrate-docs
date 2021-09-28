import React from 'react'
import cx from 'classnames'
import { LocalizedLink } from 'gatsby-theme-i18n'
import Icon from '../../Icon'

interface DocCardProps {
  title: string
  text: string
  link: string
  cta: string
  iconName: string
  animationDelay?: number
}

export default function DocCard({
  title,
  text,
  link,
  cta,
  iconName,
  animationDelay,
}: DocCardProps) {
  return (
    <LocalizedLink data-aos="fade-up" data-aos-delay={animationDelay} to={link}>
      <div className="group">
        <div
          className={cx(
            'w-full text-center sm:w-96 lg:w-80 xl:w-96 shadow-xl p-10 mb-4 md:m-4 bg-white',
            'dark:bg-substrateDark',
            'transition-all group-hover:scale-105'
          )}
        >
          <div className="flex justify-center mb-6">
            <Icon
              name={iconName}
              className="fill-current text-substrateWhite  dark:border dark:rounded-full dark:border-substrateWhite"
            />
          </div>
          <div className="lg:h-80 xl:h-60">
            <div className="text-2xl font-extrabold mb-5">{title}</div>
            <p className="font-medium">{text}</p>
          </div>
          <div className="block group">
            <span
              className={`text-xl font-bold pb-1 border-b-2 text-substrateGreen border-substrateGreen`}
            >
              {cta}
            </span>
            <span
              className={cx(
                'w-8 inline-block pl-2 transform transition-all duration-300 ease-in-out group-hover:pl-4',
                'text-substrateGreen'
              )}
            >
              &#10132;
            </span>
          </div>
        </div>
      </div>
    </LocalizedLink>
  )
}
