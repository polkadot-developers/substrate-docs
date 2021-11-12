import cx from 'classnames'
import React, { useEffect, useState } from 'react'

import useScrollListener from './Hooks/use-scroll-listener'
import Icon from './Icon'
import Link from './Link'

const Banner = () => {
  const scroll = useScrollListener()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (scroll.y > 300) {
      setIsScrolled(true)
    } else if (scroll.y < 1) {
      setIsScrolled(false)
    }
  }, [scroll.y])

  return (
    <div
      className={cx(
        'hidden md:block fixed z-50 right-8 bottom-8 max-w-xs p-6 transition-all bg-substrateGray-light dark:bg-substrateGray-darkest m-0 shadow-xxl rounded-md',
        {
          'opacity-0 -z-10': isScrolled,
        }
      )}
    >
      <Icon name="stackOverflowOrg" className="h-8 w-8 mb-4" />
      <p className="mb-0 leading-6 mdx-anchor">
        <span className="font-bold">Substrate is campaigning</span> to get its
        own StackExchange Community created. Please help us{' '}
        <Link to="https://area51.stackexchange.com/proposals/126136/substrate-blockchain-framework">
          here.
        </Link>
      </p>
    </div>
  )
}

export default Banner
