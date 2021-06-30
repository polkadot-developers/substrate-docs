import React from 'react'

interface SkillsYouNeedProps {
  data: string[]
}

export function SkillsYouNeed({ data }: SkillsYouNeedProps) {
  return (
    <div className="xl:flex xl:items-center">
      <h4 className="xl:mr-20">Skills you need:</h4>
      {data.map((str, index) => (
        <button
          key={index}
          className="mx-1 xl:mx-2 my-1 xl:mt-3 px-4 py-1 rounded border border-gray-100 text-substrateBlue font-medium"
        >
          {str}
        </button>
      ))}
    </div>
  )
}
