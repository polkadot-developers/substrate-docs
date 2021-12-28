import React from 'react'
import Link from '../default/Link'

interface DarkButtonProps {
  text: string
  link: string
}
export function DarkButton({ text, link }: DarkButtonProps) {
  return (
    <>
      <Link className="md-button inline-block my-6" to={link}>
        <div className="flex items-center justify-center w-52 h-14 rounded bg-substrateDark transform transition duration-300 ease-in-out hover:bg-opacity-90">
          <button className="text-lg text-white font-bold focus:outline-none">
            {text}
          </button>
        </div>
      </Link>
    </>
  )
}
