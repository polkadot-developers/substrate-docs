import React from 'react'
import cx from 'classnames'
import Icon from '../components/Icon'

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
          className={cx(
            'px-6 my-6 md:mx-5 py-10 bg-white border border-substrateDark transition-all transform duration-300 ease-in-out group-hover:border-transparent group-hover:ring-4 group-hover:ring-substrateGreen rounded max-w-md shadow-lg dark:bg-substrateDark',
            {
              'ring-4 ring-substrateGreen border-transparent':
                props.preSelected,
            }
          )}
        >
          <div className="flex items-center mb-10">
            {props.icon === 'node' && (
              <Icon
                name="nodeTemplate"
                className={cx(
                  'fill-current text-substrateDark dark:text-substrateWhite',
                  { 'text-substrateGreen': props.preSelected }
                )}
              />
            )}
            {props.icon === 'front' && (
              <Icon
                name="feTemplate"
                className={cx(
                  'fill-current text-substrateDark dark:text-substrateWhite',
                  { 'text-substrateGreen': props.preSelected }
                )}
              />
            )}
            <div className="text-2xl md:text-3xl ml-5 font-extrabold">
              {props.title}
            </div>
          </div>
          <div className="font-bold text-lg mb-6 lg:h-[140px] xl:h-full">
            {props.description}
          </div>
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
                className={cx(
                  'w-full sm:w-56 py-3 rounded bg-substrateDark bg-opacity-50 group-hover:bg-opacity-100 dark:bg-substrateWhite transform transition-all duration-300 ease-in-out hover:bg-opacity-80 dark:hover:bg-opacity-80 text-white dark:text-substrateDark text-lg font-bold focus:outline-none',
                  { 'bg-opacity-100': props.preSelected }
                )}
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
