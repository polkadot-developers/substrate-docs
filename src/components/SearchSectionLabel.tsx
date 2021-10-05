import React from 'react'

interface LabelProps {
  index: number
  section: any
  setSection: any
  children: React.ReactNode
  prevState?: {
    docs: boolean
    tuts: boolean
    htgs: boolean
  }
}

export default function SearchSectionLabel({ index, section, setSection, children }: LabelProps) {
  const handleChange = () => {
    if (index === 0) {
      setSection((prevState: LabelProps) => ({
        ...prevState,
        docs: !section.docs,
      }))
    } else if (index === 1) {
      setSection((prevState: LabelProps) => ({
        ...prevState,
        tuts: !section.tuts,
      }))
    } else if (index === 2) {
      setSection((prevState: LabelProps) => ({
        ...prevState,
        htgs: !section.htgs,
      }))
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
        className={`inline-flex items-center cursor-pointer ${
          index === 1 || index === 2 ? `sm:ml-16` : null
        }`}
      >
        <input
          className="h-4 w-4 md:h-[18px] md:w-[18px] rounded bg-white text-substrateDark border-2 focus:ring-0 "
          type="checkbox"
          checked={checked() || false}
          onChange={() => handleChange()}
        />
        <span className="text-base md:text-lg font-semibold pl-2">{children}</span>
      </label>
    </>
  )
}
