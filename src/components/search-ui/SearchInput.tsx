import React from 'react'
import Icon from '../Icon'

interface SearchInputProps {
  query: string
  setQuery: (param: string) => void
  closeModal: (param: boolean) => void
}
export function SearchInput({ query, setQuery, closeModal }: SearchInputProps) {
  return (
    <div className="flex justify-between mb-6">
      <div className="flex items-center justify-between w-5/6 pb-0.5 border-b-2 border-substrateGray">
        <Icon
          name="searchIcon"
          className="h-4 w-4 md:h-6 md:w-6 fill-current text-substrateDark dark:text-white"
        />
        <input
          className="form-input w-full pl-4 text-lg md:text-2xl border-none dark:bg-gray-900 focus:ring-0 cursor-text"
          type="text"
          value={query}
          placeholder="Search Documentation"
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
      </div>
      <div
        onClick={() => closeModal(false)}
        className="flex items-center justify-center p-1 mb-2 rounded h-8 w-8 bg-substrateGray-light dark:bg-gray-700"
      >
        <Icon
          name="closeIcon"
          className="fill-current text-substrateDark dark:text-white cursor-pointer"
        />
      </div>
    </div>
  )
}
