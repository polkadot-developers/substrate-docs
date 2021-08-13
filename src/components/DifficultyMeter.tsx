import React from 'react'
import { useIntl } from 'react-intl'

interface DifficultyMeterProps {
  difficulty: string
}
export default function DifficultyMeter({ difficulty }: DifficultyMeterProps) {
  const intl = useIntl()
  return (
    <>
      {difficulty === 'beginner' ? (
        <>
          <span className="uppercase tracking-widest">
            {intl.formatMessage({ id: 'tutorials-beginner' })}
          </span>
          <div className="flex ml-4">
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark bg-opacity-10 dark:bg-substrateGray dark:bg-opacity-50 rounded-full"></span>
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark bg-opacity-10 dark:bg-substrateGray dark:bg-opacity-50 rounded-full"></span>
          </div>
        </>
      ) : difficulty === 'intermediate' ? (
        <>
          <span className="uppercase tracking-widest">
            {intl.formatMessage({ id: 'tutorials-intermediate' })}
          </span>
          <div className="flex ml-4">
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark bg-opacity-10 dark:bg-substrateGray dark:bg-opacity-50 rounded-full"></span>
          </div>
        </>
      ) : difficulty === 'advance' ? (
        <>
          <span className="uppercase tracking-widest">
            {intl.formatMessage({ id: 'tutorials-advance' })}
          </span>
          <div className="flex ml-4">
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
          </div>
        </>
      ) : null}
    </>
  )
}
