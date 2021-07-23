import React from 'react'

interface SkillsYouGainProps {
  data: string[]
}

export function SkillsYouGain({ data }: SkillsYouGainProps) {
  return (
    <div className="xl:flex xl:items-center">
      <h4 className="xl:mr-12">Skills you will gain:</h4>
      {data.map((str, index) => (
        <button
          key={index}
          className="mx-1 xl:mx-2 my-1 xl:mt-3 px-4 py-1 rounded border border-substrateGreen bg-substrateGreen bg-opacity-10 text-xs font-medium cursor-default"
        >
          {str}
        </button>
      ))}
    </div>
  )
}
