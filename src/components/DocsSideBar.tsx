import React from 'react'

interface DocsSideBarProps {
  headings: { value: string; depth: number }[]
}

export default function DocsSideBar({ headings }: DocsSideBarProps) {
  return (
    <div className="w-60 h-full py-5 text-sm">
      <p className="font-bold">ON THIS PAGE</p>
      {headings.map((item: { value: string; depth: number }, index: number) => {
        const link = item.value
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, '')
          .replace(/[ ]/g, '-')

        console.log(link)
        return item.depth === 2 ? (
          <div className="py-2">
            <a key={index} href={`#${link}`} className="font-bold">
              {item.value}
            </a>
          </div>
        ) : item.depth === 3 ? (
          <div className="py-1">
            <a key={index} href={`#${link}`} className="pl-4">
              {item.value}
            </a>
          </div>
        ) : null
      })}
    </div>
  )
}
