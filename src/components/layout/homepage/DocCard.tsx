import React from 'react'
import cx from 'classnames'
import { LocalizedLink } from 'gatsby-theme-i18n'
import { TextButton } from '../../Buttons'
import Icon from '../../Icon'

interface DocCardProps {
  title: string
  textOne: string
  textTwo: string
  link: string
  cta: string
  iconName: string
}

export default function DocCard({
  title,
  textOne,
  textTwo,
  link,
  cta,
  iconName,
}: DocCardProps) {
  return (
    <LocalizedLink to={link}>
      <div className="group">
        <div
          className={cx(
            'h-[400px]] w-full text-center sm:w-96 shadow-xl p-10 mb-4 md:m-4 bg-white',
            'dark:bg-substrateDark',
            'duration-300 ease-in-out group-hover:scale-105'
          )}
        >
          <div className="flex justify-center mb-6">
            <Icon
              name={iconName}
              className="fill-current text-substrateWhite  dark:border dark:rounded-full dark:border-substrateWhite"
            />
          </div>
          <div className="md:h-72">
            <div className="text-2xl font-extrabold mb-5">{title}</div>
            <p className="font-bold text-lg">{textOne}</p>
            <p>{textTwo}</p>
          </div>

          <TextButton accent cta link={link}>
            {cta}
          </TextButton>
        </div>
      </div>
    </LocalizedLink>
  )
}
