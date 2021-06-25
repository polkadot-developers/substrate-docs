import React from 'react'
import infoIcon from '../../images/information-icon.svg'
import adviceIcon from '../../images/advice-icon.svg'

interface MessageProps {
  type: string
  text: string
}

export default function Message({ type, text }: MessageProps) {
  return (
    <div
      className={`px-4 pb-2 mb-8 border-t-8 rounded-lg ${
        type === 'information'
          ? 'border-mdxYellow bg-mdxYellow bg-opacity-50'
          : type === 'advice'
          ? 'border-mdxGreen bg-mdxGreen bg-opacity-50'
          : type === 'warning'
          ? 'border-mdxRed bg-mdxRed bg-opacity-50'
          : null
      }`}
    >
      <div className="flex items-center">
        <div className="p-2 mt-2">
          <img
            src={`${
              type === 'information'
                ? infoIcon
                : type === 'advice'
                ? adviceIcon
                : type === 'warning'
                ? infoIcon
                : null
            }`}
            alt="Substrate Message Icon"
          />
        </div>
        <h4 className="pl-1 capitalize">{type}</h4>
      </div>
      <p className="font-light max-w-2xl">{text}</p>
    </div>
  )
}
