import React from 'react'
import cx from 'classnames'
import ReactMarkdown from 'react-markdown'
import Icon from '../Icon'
import { MdxLink } from '../DocsComponents'

interface MessageProps {
  type: string
  title: string
  text: string
}

export function Message({ type, title, text }: MessageProps) {
  const iconStyles = 'fill-current text-substrateDark dark:text-substrateWhite'
  return (
    <div
      className={`px-4 pb-2 mb-8 border-t-8 rounded ${
        type === 'yellow'
          ? 'border-mdxYellow dark:border-mdxYellow-dark dark:border-opacity-40 bg-mdxYellow dark:bg-mdxYellow-dark dark:bg-opacity-20 bg-opacity-50'
          : type === 'green'
          ? 'border-mdxGreen  dark:border-mdxGreen-dark dark:border-opacity-50 bg-mdxGreen dark:bg-mdxGreen-dark dark:bg-opacity-20 bg-opacity-50'
          : type === 'red'
          ? 'border-mdxRed  dark:border-mdxRed-dark dark:border-opacity-40 bg-mdxRed dark:bg-mdxRed-dark dark:bg-opacity-20 bg-opacity-50'
          : type === 'gray'
          ? 'border-gray-200 dark:border-opacity-40 bg-gray-200 dark:bg-opacity-20 bg-opacity-50'
          : null
      }`}
    >
      <div className="flex items-center">
        <div className="p-2 mt-2">
          {type === 'yellow' || type === 'red' ? (
            <Icon name="informationIcon" className={cx(iconStyles)} />
          ) : type === 'green' ? (
            <Icon name="adviceIcon" className={cx(iconStyles)} />
          ) : type === 'gray' ? (
            <Icon name="noteIcon" className={cx(iconStyles)} />
          ) : null}
        </div>
        <span className="inline-block pl-1 capitalize text-lg font-bold mt-2">
          {title}
        </span>
      </div>
      <div>
        <ReactMarkdown
          components={{
            a: MdxLink,
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  )
}
