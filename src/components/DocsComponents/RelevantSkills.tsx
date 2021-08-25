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
          className="mx-1 xl:mx-2 my-1 xl:mt-3 px-4 py-1 rounded border border-substrateYellow bg-substrateYellow bg-opacity-10 text-xs font-medium cursor-default"
        >
          {str}
        </button>
      ))}
    </div>
  )
}
