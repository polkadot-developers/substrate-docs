import React from 'react'

interface ObjectivesProps {
  data: { title: string; description: string }[]
}

export function Objectives({ data }: ObjectivesProps) {
  return (
    <>
      <div className="bg-lightGray dark:bg-gray-800 pb-4">
        {data.map((item, index) => (
          <div key={index}>
            <div>
              <h3 className="inline-block px-4">{index + 1}.</h3>
              <h3 className="inline-block">{item.title}</h3>
            </div>
            <p className="px-4">{item.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}
