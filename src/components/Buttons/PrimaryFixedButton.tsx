import cx from 'classnames'
import React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import Icon from '../../components/Icon'

interface PrimaryFixedButtonProps {
  children: string
  link?: string
  fullWidth?: boolean
  onClick?: any
  hero?: boolean
}

export function PrimaryFixedButton({
  children,
  link,
  fullWidth = false,
  onClick,
  hero = false,
}: PrimaryFixedButtonProps) {
  return (
    <LocalizedLink to={link}>
      <div
        onClick={onClick}
        className={cx(
          'group bg-substrateGreen inline-flex relative rounded-md overflow-hidden',
          {
            'w-full justify-center': fullWidth,
          }
        )}
      >
        <p
          className={cx('font-bold text-white mb-0 transition-all', {
            'mx-8 group-hover:ml-5 group-hover:mr-11 py-4 text-xl': hero,
            'mx-6 group-hover:ml-4 group-hover:mr-8 py-3': !hero,
          })}
        >
          {children}
        </p>
        <div
          className={cx(
            'bg-substrateGreen-dark absolute flex h-full transition-transform fill-current text-white',
            {
              'px-2 -right-7 group-hover:-translate-x-7': hero,
              'px-1 -right-5 group-hover:-translate-x-5': !hero,
            }
          )}
        >
          <Icon name="arrowMore" className="self-center" />
        </div>
      </div>
    </LocalizedLink>
  )
}
