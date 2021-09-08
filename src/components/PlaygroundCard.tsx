import React from 'react'

interface PlaygroundCardProps {
  preSelected: boolean
  title: string
  description: string
  listTitle: string
  components: string[]
  link: string
  icon: string
}

export default function PlaygroundCard(props: PlaygroundCardProps) {
  return (
    <>
      <div className="group relative">
        {props.preSelected && (
          <div className="absolute -top-3 -left-1 bg-substrateGreen text-white dark:text-substrateDark font-extrabold px-5 pt-2 pb-3 rounded md:mx-5">
            Configuration for your tutorial
          </div>
        )}
        <div
          className={`px-6 my-6 md:mx-5 py-10 bg-white border border-substrateDark transition-all transform duration-300 ease-in-out group-hover:border-transparent group-hover:ring-4 group-hover:ring-substrateGreen rounded max-w-md shadow-lg dark:bg-substrateDark ${
            props.preSelected && `ring-4 ring-substrateGreen border-transparent`
          }`}
        >
          <div className="flex items-center mb-10">
            {props.icon === 'node' && (
              <svg
                className={`fill-current text-substrateDark dark:text-substrateWhite ${
                  props.preSelected && `text-substrateGreen`
                }`}
                xmlns="http://www.w3.org/2000/svg"
                width="42"
                height="22"
                viewBox="0 0 42 22"
              >
                <path d="M8.4 11C8.4 11.7425 8.45906 12.4781 8.57063 13.2L0.7875 13.2C0.354375 13.2 0 12.8287 0 12.375L0 9.625C0 9.17125 0.354375 8.8 0.7875 8.8L8.57063 8.8C8.45906 9.52187 8.4 10.2575 8.4 11ZM41.2125 8.8L33.4294 8.8C33.5475 9.52187 33.6 10.2575 33.6 11C33.6 11.7425 33.5409 12.4781 33.4294 13.2L41.2125 13.2C41.6456 13.2 42 12.8287 42 12.375L42 9.625C42 9.17125 41.6456 8.8 41.2125 8.8ZM21 8.1125C19.4775 8.1125 18.2437 9.405 18.2437 11C18.2437 12.595 19.4775 13.8875 21 13.8875C22.5225 13.8875 23.7563 12.595 23.7563 11C23.7563 9.405 22.5225 8.1125 21 8.1125ZM21 0C26.8013 0 31.5 4.9225 31.5 11C31.5 17.0775 26.8013 22 21 22C15.1987 22 10.5 17.0775 10.5 11C10.5 4.9225 15.1987 0 21 0Z" />
              </svg>
            )}
            {props.icon === 'front' && (
              <svg
                className={`fill-current text-substrateDark dark:text-substrateWhite ${
                  props.preSelected && `text-substrateGreen`
                }`}
                xmlns="http://www.w3.org/2000/svg"
                width="42"
                height="37"
                viewBox="0 0 42 37"
              >
                <path d="M38.0625 0H3.9375C1.76367 0 0 1.77567 0 3.96429V33.0357C0 35.2243 1.76367 37 3.9375 37H38.0625C40.2363 37 42 35.2243 42 33.0357V3.96429C42 1.77567 40.2363 0 38.0625 0ZM21 6.60714C21 5.14531 22.173 3.96429 23.625 3.96429C25.077 3.96429 26.25 5.14531 26.25 6.60714C26.25 8.06897 25.077 9.25 23.625 9.25C22.173 9.25 21 8.06897 21 6.60714ZM13.125 6.60714C13.125 5.14531 14.298 3.96429 15.75 3.96429C17.202 3.96429 18.375 5.14531 18.375 6.60714C18.375 8.06897 17.202 9.25 15.75 9.25C14.298 9.25 13.125 8.06897 13.125 6.60714ZM5.25 6.60714C5.25 5.14531 6.42305 3.96429 7.875 3.96429C9.32695 3.96429 10.5 5.14531 10.5 6.60714C10.5 8.06897 9.32695 9.25 7.875 9.25C6.42305 9.25 5.25 8.06897 5.25 6.60714ZM38.0625 32.5402C38.0625 32.8127 37.841 33.0357 37.5703 33.0357H4.42969C4.15898 33.0357 3.9375 32.8127 3.9375 32.5402V13.2143H38.0625V32.5402Z" />
              </svg>
            )}
            <div className="text-2xl md:text-3xl ml-5 font-extrabold">
              {props.title}
            </div>
          </div>
          <div className="font-bold text-lg mb-6">{props.description}</div>
          <div className="text-lg mb-8">
            <span className="font-bold">{props.listTitle}</span>
            <ul className="list-inside leading-tight">
              {props.components.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <a href={props.link}>
              <button
                className={`w-full sm:w-56 py-3 rounded bg-substrateDark bg-opacity-50 group-hover:bg-opacity-100 dark:bg-substrateWhite transform transition-all duration-300 ease-in-out hover:bg-opacity-80 dark:hover:bg-opacity-80 text-white dark:text-substrateDark text-lg font-bold focus:outline-none ${
                  props.preSelected && `bg-opacity-100`
                }`}
              >
                Launch Playground
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
