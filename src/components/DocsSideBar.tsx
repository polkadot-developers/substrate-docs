import React from 'react'

interface DocsSideBarProps {
  headings: { value: string; depth: number }[]
}

export default function DocsSideBar({ headings }: DocsSideBarProps) {
  return (
    <div className="w-60 sticky top-16 h-screen py-5 pl-12 text-sm overflow-y-auto">
      <p className="font-bold">ON THIS PAGE</p>
      {headings.map((item: { value: string; depth: number }, index: number) => {
        const link = item.value
          .toLowerCase()
          .replace(/([~!@#$%^&*()_+=`{}[\]|\\:;'<>,./? ])+/g, '-')

        return item.depth === 2 ? (
          <div key={index} className="py-2">
            <a
              href={`#${link}`}
              className="font-bold text-black dark:text-white hover:no-underline"
            >
              {item.value}
            </a>
          </div>
        ) : item.depth === 3 ? (
          <div key={index} className="py-1">
            <a
              href={`#${link}`}
              className="pl-4 text-black dark:text-white hover:no-underline"
            >
              {item.value}
            </a>
          </div>
        ) : null
      })}
    </div>
  )
}
