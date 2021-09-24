import React from 'react'
import { TextButton } from '../../Buttons'

interface DocCardProps {
  title: string
  text: string
  link: string
  cta: string
}

export default function DocCard({ title, text, link, cta }: DocCardProps) {
  return (
    <div className="h-[400px]] w-full text-center sm:w-96 shadow-xl p-10 mb-4 md:m-4 bg-white dark:bg-substrateDark">
      <div className="flex justify-center mb-6">
        {title === 'Documentation' && (
          <svg
            className="fill-current text-substrateWhite"
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="56"
            viewBox="0 0 56 56"
          >
            <circle
              className="fill-current text-substrateDark dark:text-darkBackground"
              cx="28"
              cy="28"
              r="28"
            />
            <path d="M40 32.375V16.625C40 15.1752 38.8002 14 37.3214 14H20.3571C17.3984 14 15 16.3505 15 19.25V36.75C15 39.6495 17.3984 42 20.3571 42H38.2143C39.2003 42 40 41.2163 40 40.2992C40 39.6583 39.6313 39.1223 39.1071 38.8172V34.3678C39.654 33.8406 40 33.1516 40 32.375ZM36.4286 38.5H20.3571C19.3711 38.5 18.5714 37.7163 18.5714 36.75C18.5714 35.7837 19.3711 35 20.3571 35H36.4286V38.5Z" />
          </svg>
        )}
        {title === 'How-To Guides' && (
          <svg
            className="fill-current text-substrateWhite"
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="56"
            viewBox="0 0 56 56"
          >
            <circle
              className="fill-current text-substrateDark dark:text-darkBackground"
              cx="28"
              cy="28"
              r="28"
              fill="#242A35"
            />
            <path d="M30.6667 20V13H21.5C20.1193 13 19 14.1752 19 15.625V38.375C19 39.8242 20.1193 41 21.5 41H36.5C37.8807 41 39 39.8248 39 38.375V21.75H32.3802C31.4115 21.75 30.6667 20.968 30.6667 20ZM27.026 32.3484C27.4329 32.7757 27.4329 33.4695 27.026 33.8966C26.8229 34.1148 26.5573 34.2188 26.2917 34.2188C26.026 34.2188 25.7589 34.1128 25.5552 33.8992L23.0552 31.2742C22.6483 30.8469 22.6483 30.1531 23.0552 29.726L25.5552 27.101C25.9621 26.6737 26.6214 26.6737 27.0281 27.101C27.4349 27.5282 27.435 28.222 27.0281 28.6492L25.2656 30.5L27.026 32.3484ZM34.9427 29.7234C35.3496 30.1507 35.3496 30.8445 34.9427 31.2716L32.4427 33.8966C32.2396 34.1148 31.974 34.2188 31.7083 34.2188C31.4427 34.2188 31.1755 34.1128 30.9719 33.8992C30.565 33.4719 30.565 32.7781 30.9719 32.351L32.7344 30.5L30.9708 28.6494C30.564 28.2222 30.564 27.5283 30.9708 27.1012C31.3777 26.6741 32.037 26.674 32.4437 27.1012L34.9427 29.7234ZM32.3333 13V20H39L32.3333 13Z" />
          </svg>
        )}
        {title === 'Tutorials' && (
          <svg
            className="fill-current text-substrateWhite"
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="56"
            viewBox="0 0 56 56"
          >
            <circle
              className="fill-current text-substrateDark dark:text-darkBackground"
              cx="28"
              cy="28"
              r="28"
              fill="#242A35"
            />
            <path d="M31.3333 12V18.8182H38L31.3333 12ZM29.6667 18.8182V12H20.5C19.1193 12 18 13.1447 18 14.5568V36.7159C18 38.1275 19.1193 39.2727 20.5 39.2727H35.5C36.8807 39.2727 38 38.128 38 36.7159V20.5227H31.3802C30.4115 20.5227 29.6667 19.761 29.6667 18.8182ZM33.4167 29.8977C33.4167 30.604 32.8573 31.1282 32.1667 31.1282H29.25V34.1112C29.2031 34.8675 28.6927 35.4375 28 35.4375C27.3089 35.4375 26.75 34.8654 26.75 34.207V31.1282H23.7865C23.1422 31.1282 22.5833 30.6062 22.5833 29.8977C22.5833 29.1914 23.1427 28.6673 23.7865 28.6673H26.75V25.5884C26.75 24.9279 27.3073 24.358 28 24.358C28.6927 24.358 29.2031 24.93 29.2031 25.5884V28.6193H32.1667C32.8594 28.6193 33.4167 29.1893 33.4167 29.8977Z" />
          </svg>
        )}
      </div>
      <div className="text-2xl font-extrabold mb-5">{title}</div>
      <p>{text}</p>
      <TextButton accent cta link={link}>
        {cta}
      </TextButton>
    </div>
  )
}
