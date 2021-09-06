import React from 'react'

interface RelevantSkillsProps {
  data: string[]
}

export function RelevantSkills({ data }: RelevantSkillsProps) {
  return (
    <div>
      {data.map((str, index) => (
        <button
          key={index}
          className={`bg-substrateYellow bg-opacity-10 px-4 py-2 mt-2 sm:mt-0 mr-4 border border-substrateYellow rounded cursor-text text-xs`}
        >
          {str}
        </button>
      ))}
    </div>
  )
}
