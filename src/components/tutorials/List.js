import React from 'react'
import TutorialCard from './Card'

const TutorialList = ({ models }) => {
  return (
    <section>
      {models ? (
        <ul className="flex flex-col items-center md:flex-row md:flex-wrap md:justify-center">
          {models.map((model, index) => (
            <li
              key={index}
              className="w-1/1 md:w-1/2 xl:w-1/3 list-none mb-8 mx-4"
            >
              <TutorialCard model={model.node} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No tutorials yet</p>
      )}
    </section>
  )
}

export default TutorialList
