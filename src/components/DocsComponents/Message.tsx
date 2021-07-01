import React from 'react'

interface MessageProps {
  type: string
  title: string
  text: string
}

export function Message({ type, title, text }: MessageProps) {
  return (
    <div
      className={`px-4 pb-2 mb-8 border-t-8 rounded-lg dark:bg-gray-800 dark:bg-opacity-90 ${
        type === 'yellow'
          ? 'border-mdxYellow bg-mdxYellow bg-opacity-50'
          : type === 'green'
          ? 'border-mdxGreen bg-mdxGreen bg-opacity-50'
          : type === 'red'
          ? 'border-mdxRed bg-mdxRed bg-opacity-50'
          : null
      }`}
    >
      <div className="flex items-center">
        <div className="p-2 mt-2">
          {type === 'yellow' || type === 'red' ? (
            <svg
              className="fill-current text-black dark:text-white"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.38605 0 0 5.38605 0 12C0 18.614 5.38605 24 12 24C18.614 24 24 18.614 24 12C24 5.38605 18.614 0 12 0ZM12 22.3256C6.30698 22.3256 1.67442 17.693 1.67442 12C1.67442 6.30698 6.30698 1.67442 12 1.67442C17.693 1.67442 22.3256 6.30698 22.3256 12C22.3256 17.693 17.693 22.3256 12 22.3256Z" />
              <path d="M12 9.06982C11.4333 9.06982 11 9.42844 11 9.89741V16.2422C11 16.7112 11.4333 17.0698 12 17.0698C12.5667 17.0698 13 16.7112 13 16.2422V9.89741C13 9.42844 12.5667 9.06982 12 9.06982Z" />
              <path d="M12 6C11.45 6 11 6.45 11 7C11 7.55 11.45 8 12 8C12.55 8 13 7.55 13 7C13 6.45 12.55 6 12 6Z" />
            </svg>
          ) : type === 'green' ? (
            <svg
              className="fill-current text-black dark:text-white"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.38605 0 0 5.38605 0 12C0 18.614 5.38605 24 12 24C18.614 24 24 18.614 24 12C24 5.38605 18.614 0 12 0ZM12 22.3256C6.30698 22.3256 1.67442 17.693 1.67442 12C1.67442 6.30698 6.30698 1.67442 12 1.67442C17.693 1.67442 22.3256 6.30698 22.3256 12C22.3256 17.693 17.693 22.3256 12 22.3256Z" />
              <path d="M8 12C8 12.5667 8.35862 13 8.82759 13L15.1724 13C15.6414 13 16 12.5667 16 12C16 11.4333 15.6414 11 15.1724 11L8.82759 11C8.35862 11 8 11.4333 8 12Z" />
              <path d="M12 8C11.4333 8 11 8.35862 11 8.82759V15.1724C11 15.6414 11.4333 16 12 16C12.5667 16 13 15.6414 13 15.1724V8.82759C13 8.35862 12.5667 8 12 8Z" />
            </svg>
          ) : null}
        </div>
        <h4 className="pl-1 capitalize">{title}</h4>
      </div>
      <p className="font-light max-w-2xl">{text}</p>
    </div>
  )
}
