import React from 'react'
import { useIntl } from 'react-intl'
import SlideDownNav from '../components/SlideDownNav'
import { kbSideBar, IkbSideBar, globalDocsNav } from '../sidebar/kbSideBar'
import arrowIcon from '../images/nav-icon-arrow-down.svg'

interface DocsNavProps {
  templateId: string
}

export default function DocsNav({ templateId }: DocsNavProps) {
  const intl = useIntl()

  return (
    <nav className="w-60 h-full border-r border-gray-200">
      <div className="flex py-5 bg-lightGray">
        <span className="pl-4 font-bold">
          {intl.formatMessage({ id: 'nav-docs' })}
        </span>
      </div>
      <div>
        {kbSideBar.map((section: IkbSideBar, index: number) => (
          <SlideDownNav key={index} section={section} />
        ))}
      </div>
      <div>
        <hr className="mt-6" />
        <div className="flex items-center justify-between px-20 lg:px-4 py-4 bg-lightGray lg:bg-white">
          <div className="font-light">More Ways to Learn</div>
        </div>
        {globalDocsNav
          .filter(navItem => templateId != navItem)
          .map((navItem, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between px-20 lg:px-4 py-4 bg-lightGray lg:bg-white"
              >
                <div className="font-medium">{navItem}</div>
                <img
                  className="transform -rotate-90"
                  src={arrowIcon}
                  alt="Substrate Documentation Icon"
                />
              </div>
            )
          })}
      </div>
    </nav>
  )
}
