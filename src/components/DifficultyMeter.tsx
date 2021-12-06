import React from 'react'

interface DifficultyMeterProps {
  difficulty: number
}

export default function DifficultyMeter({ difficulty }: DifficultyMeterProps) {
  return (
    <>
      {difficulty === 1 ? (
        <>
          <span className="text-sm uppercase tracking-widest">Beginner</span>
          <div className="flex ml-4">
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark bg-opacity-10 dark:bg-substrateGray dark:bg-opacity-50 rounded-full"></span>
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark bg-opacity-10 dark:bg-substrateGray dark:bg-opacity-50 rounded-full"></span>
          </div>
        </>
      ) : difficulty === 2 ? (
        <>
          <span className="text-sm uppercase tracking-widest">
            Intermediate
          </span>
          <div className="flex ml-4">
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
            <span className="mx-1 inline-block w-3 h-3 bg-substrateDark bg-opacity-10 dark:bg-substrateGray dark:bg-opacity-50 rounded-full"></span>
          </div>
        </>
      ) : difficulty === 3 ? (
        <>
          <span className="text-sm uppercase tracking-widest">Advance</span>
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
