import React from 'react'

interface RelevantSkillsProps {
  data: string[]
}

export function RelevantSkills({ data }: RelevantSkillsProps) {
  return (
    <div className="xl:flex xl:items-center">
      <h4 className="xl:mr-8">Relevant Skills:</h4>
      {data.map((str, index) => (
        <button
          key={index}
          className="bg-substrateYellow bg-opacity-10 px-4 py-2 ml-4 mt-2 border border-substrateYellow rounded cursor-text text-xs"
        >
          {str}
        </button>
      ))}
    </div>
  )
}
