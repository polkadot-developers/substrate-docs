import React from 'react'

interface LabelProps {
  index: number
  section: any
  setSection: any
  children: React.ReactNode
}

export default function SearchSectionLabel({
  index,
  section,
  setSection,
  children,
}: LabelProps) {
  const handleChange = () => {
    if (index === 0) {
      setSection({
        docs: !section.docs,
        tuts: false,
        htgs: false,
      })
    } else if (index === 1) {
      setSection({
        docs: false,
        tuts: !section.tuts,
        htgs: false,
      })
    } else if (index === 2) {
      setSection({
        docs: false,
        tuts: false,
        htgs: !section.htgs,
      })
    }
  }
  const checked = () => {
    if (index === 0) {
      return section.docs
    } else if (index === 1) {
      return section.tuts
    } else if (index === 2) {
      return section.htgs
    }
  }
  return (
    <>
      <label
        className={`inline-flex items-center ${
          index === 1 || index === 2 ? `sm:pl-16` : null
        }`}
      >
        <input
          className="h-4 w-4 rounded bg-white text-substrateDark border-2 focus:ring-0"
          type="checkbox"
          checked={checked() || false}
          onChange={() => handleChange()}
        />
        <span className="text-base font-semibold pl-2">{children}</span>
      </label>
    </>
  )
}
