import React, { useState, useEffect } from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import Confetti from 'react-dom-confetti'

interface PrimaryButtonProps {
  link: string
  children: string
  external?: boolean
  cta?: boolean
}
export function PrimaryButton(props: PrimaryButtonProps) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (active) {
      setActive(!active)
    }
  }, [active])
  const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: '10px',
    height: '10px',
    perspective: '500px',
    colors: ['#F2606A', '#E6007A', '#FDAB3D', '#5A30B4', '#EEF300', '#D4F9EC'],
  }
  const textSize = () => (props.cta ? `text-xl py-4 px-5` : `text-lg py-2 px-5`)
  const buttonStyle =
    'bg-substrateGreen font-bold text-white rounded focus:outline-none'
  const hoverStyle =
    'transform transition-all group-hover:px-2 group-hover:rounded-r-none'
  return (
    <>
      {props.external ? (
        <a
          className="group flex rounded hover:shadow active:shadow-none"
          href={props.link}
          target="_blank"
          rel="noreferrer"
        >
          <button className={`${buttonStyle} ${textSize()} ${hoverStyle} `}>
            {props.children}
          </button>
          <div className="flex items-center bg-green-500 w-0 rounded-tr rounded-br transform transition-all group-hover:w-6 group-hover:justify-center">
            <span className="text-white text-sm">&#10132;</span>
          </div>
        </a>
      ) : (
        <LocalizedLink
          className="group flex rounded hover:shadow active:shadow-none"
          to={props.link}
          onClick={() => setActive(!active)}
        >
          <button className={`${buttonStyle} ${textSize()} ${hoverStyle} `}>
            {props.children}
          </button>
          <div className="flex items-center bg-green-500 w-0 rounded-tr rounded-br transform transition-all group-hover:w-6 group-hover:justify-center">
            <span className="text-white text-sm">&#10132;</span>
          </div>
          <Confetti active={active} config={config} />
        </LocalizedLink>
      )}
    </>
  )
}
