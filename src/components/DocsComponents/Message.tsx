import React from 'react'
import ReactMarkdown from 'react-markdown'

interface MessageProps {
  type: string
  title: string
  text: string
}

export function Message({ type, title, text }: MessageProps) {
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
            <svg
              className="fill-current text-substrateDark dark:text-substrateWhite"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37305 0 0 5.37498 0 12C0 18.6289 5.37305 24 12 24C18.627 24 24 18.6289 24 12C24 5.37498 18.627 0 12 0ZM12 5.32258C13.1224 5.32258 14.0323 6.23245 14.0323 7.35484C14.0323 8.47723 13.1224 9.3871 12 9.3871C10.8776 9.3871 9.96774 8.47723 9.96774 7.35484C9.96774 6.23245 10.8776 5.32258 12 5.32258ZM14.7097 17.6129C14.7097 17.9336 14.4497 18.1935 14.129 18.1935H9.87097C9.55031 18.1935 9.29032 17.9336 9.29032 17.6129V16.4516C9.29032 16.131 9.55031 15.871 9.87097 15.871H10.4516V12.7742H9.87097C9.55031 12.7742 9.29032 12.5142 9.29032 12.1935V11.0323C9.29032 10.7116 9.55031 10.4516 9.87097 10.4516H12.9677C13.2884 10.4516 13.5484 10.7116 13.5484 11.0323V15.871H14.129C14.4497 15.871 14.7097 16.131 14.7097 16.4516V17.6129Z" />
            </svg>
          ) : type === 'green' ? (
            <svg
              className="fill-current text-substrateDark dark:text-substrateWhite"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM13.6071 10.3929H18.4286C19.0202 10.3929 19.5 10.8727 19.5 11.4643V12.5357C19.5 13.1273 19.0202 13.6071 18.4286 13.6071H13.6071V18.4286C13.6071 19.0202 13.1273 19.5 12.5357 19.5H11.4643C10.8727 19.5 10.3929 19.0202 10.3929 18.4286V13.6071H5.57143C4.9798 13.6071 4.5 13.1273 4.5 12.5357V11.4643C4.5 10.8727 4.9798 10.3929 5.57143 10.3929H10.3929V5.57143C10.3929 4.9798 10.8727 4.5 11.4643 4.5H12.5357C13.1273 4.5 13.6071 4.9798 13.6071 5.57143V10.3929Z" />
            </svg>
          ) : type === 'gray' ? (
            <svg
              className="fill-current text-substrateDark dark:text-substrateWhite"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M17.1429 24L24 17.1566H17.1429V24ZM21.4286 0H2.57143C1.15125 0 0 1.14894 0 2.56627V21.3856C0 22.8505 1.15125 24 2.57143 24H15.4286L15.4288 17.1566C15.4288 16.2119 16.1965 15.4458 17.1431 15.4458H24V2.61439C24 1.19706 22.8482 0 21.4286 0Z" />
            </svg>
          ) : null}
        </div>
        <span className="inline-block pl-1 capitalize text-lg font-bold mt-2">
          {title}
        </span>
      </div>
      <div>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  )
}
