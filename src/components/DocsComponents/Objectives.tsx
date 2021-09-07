import React from 'react'
import ReactMarkdown from 'react-markdown'

interface ObjectivesProps {
  data: { title: string; description: string }[]
}

export function Objectives({ data }: ObjectivesProps) {
  return (
    <>
      <div className="bg-substrateGray-light dark:bg-substrateDark pb-4 rounded">
        {data.map((item, index) => (
          <div key={index}>
            <div>
              <h3 className="inline-block px-4">{item.title}</h3>
            </div>
            <ReactMarkdown className="px-4">{item.description}</ReactMarkdown>
          </div>
        ))}
      </div>
    </>
  )
}
