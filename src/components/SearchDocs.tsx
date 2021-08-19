import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { LocalizedLink } from 'gatsby-theme-i18n'
import { Index } from 'lunr'
import SearchSectionLabel from './SearchSectionLabel'
import useComponentVisible from './Hooks/use-component-visible'

export default function SearchDocs() {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)
  const [section, setSection] = useState({
    docs: false,
    tuts: false,
    htgs: false,
  })
  const types = ['Docs', 'Tutorials', 'How-to Guides']
  const suggestedTerms = ['Runtime', 'Storage', 'Pallet Design', 'Weights']
  const toggleModal = () => {
    setIsComponentVisible(!isComponentVisible)
  }

  const { LunrIndex } = useStaticQuery(graphql`
    {
      LunrIndex
    }
  `)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [displayedResults, setDisplayedResults] = useState([])
  const index = Index.load(LunrIndex.index)
  const { store } = LunrIndex

  const processQuery = (query: string) => {
    if (
      query.length === 0 || // query is empty string
      query.split(/\s/).length < 2 || // query is a single word
      query.match(/[\^~+\-*:]/) !== null // query contains the special character in lunrjs search
    ) {
      return query
    }

    const result = query
      .split(/\s/)
      .filter(t => t.length > 0)
      .map(t => `+${t}`)
      .join(' ')
    return result
  }

  const searchForQuery = (index: any, store: IStore, query: string) => {
    try {
      return index.search(query).map((result: IResult) => {
        return { slug: result.ref, ...store[result.ref] }
      })
    } catch (error) {
      // console.error(error)
      return []
    }
  }

  useEffect(() => {
    let results = searchForQuery(index, store, processQuery(query))
    if (results.length == 0) {
      results = searchForQuery(index, store, `${query}*`)
    }
    if (query.length > 0) {
      setSearchResults(results)
    }
  }, [query])

  useEffect(() => {
    const filteredResults = searchResults.filter(result => {
      if (!section.docs && !section.tuts && !section.htgs) {
        return result
      }
      // if (section.docs) {
      //   return result.section === 'docs'
      // } else if (section.tuts) {
      //   return result.section === 'tutorials'
      // } else if (section.htgs) {
      //   return result.section === 'how to guides'
      // }
    })
    setDisplayedResults(filteredResults)
  }, [searchResults, section])
  return (
    <>
      <div
        onClick={() => toggleModal()}
        className="flex items-center justify-between p-2 border-b-2 border-substrateGray cursor-text active:outline-none focus:outline-none"
      >
        <p className="mb-0 pr-4 text-sm text-substrateDark dark:text-white text-opacity-25 dark:text-opacity-90">
          Search Documentation
        </p>
        <svg
          className="h-4 w-4 fill-current text-substrateDark dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          id="Capa_1"
          x="0px"
          y="0px"
          viewBox="0 0 56.966 56.966"
          width="512px"
          height="512px"
        >
          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
        </svg>
      </div>
      {isComponentVisible ? (
        <>
          <div
            id="content-container"
            className="flex justify-center items-center lg:items-start lg:mt-24 fixed inset-0 z-50 px-4 animate-fade-in"
          >
            <div
              ref={ref}
              className="bg-white dark:bg-gray-900 w-full max-w-screen-sm h-auto p-6 rounded-lg border-2 border-substrateDark shadow-xl"
            >
              <div className="flex justify-between mb-6">
                <div className="flex items-center justify-between w-5/6 pb-0.5 border-b-2 border-substrateGray">
                  <svg
                    className="h-4 w-4 fill-current text-substrateDark dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    id="Capa_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 56.966 56.966"
                    width="512px"
                    height="512px"
                  >
                    <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                  </svg>
                  <input
                    className="form-input w-full pl-4 text-lg border-none dark:bg-gray-900 focus:ring-0 cursor-text"
                    type="text"
                    value={query}
                    placeholder="Search Documentation"
                    onChange={e => setQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div
                  onClick={() => toggleModal()}
                  className="flex items-center justify-center p-1 mb-2 rounded h-8 w-8 bg-substrateGray-light dark:bg-gray-700"
                >
                  <svg
                    className="fill-current text-substrateDark dark:text-white cursor-pointer"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.9929 3.02143C19.5491 2.4652 19.5491 1.56337 18.9929 1.00714C18.4366 0.450913 17.5348 0.450913 16.9786 1.00714L10 7.98571L3.02143 1.00714C2.4652 0.450912 1.56337 0.450913 1.00714 1.00714C0.450913 1.56337 0.450913 2.4652 1.00714 3.02143L7.98571 10L1.00714 16.9786C0.450912 17.5348 0.450913 18.4366 1.00714 18.9929C1.56337 19.5491 2.4652 19.5491 3.02143 18.9929L10 12.0143L16.9786 18.9929C17.5348 19.5491 18.4366 19.5491 18.9929 18.9929C19.5491 18.4366 19.5491 17.5348 18.9929 16.9786L12.0143 10L18.9929 3.02143Z" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row mb-6">
                {types.map((type, index) => (
                  <div key={index}>
                    <SearchSectionLabel
                      index={index}
                      section={section}
                      setSection={setSection}
                    >
                      {type}
                    </SearchSectionLabel>
                  </div>
                ))}
              </div>

              <div className="h-full">
                <div
                  className={`${
                    query.length === 0 ? 'invisible' : 'visible'
                  } text-sm font-bold mb-3`}
                >
                  {displayedResults.length} RESULTS
                </div>
                <div className="h-80 overflow-y-auto overscroll-contain">
                  {query.length === 0 ? (
                    <div>
                      {suggestedTerms.map((term, index) => (
                        <div
                          onClick={() => setQuery(term)}
                          key={index}
                          className="cursor-pointer group px-4 py-3 mb-2 bg-substrateGray dark:bg-gray-700 hover:bg-substrateGreen rounded"
                        >
                          <span className="text-xs capitalize group-hover:font-bold group-hover:text-white">
                            Suggestion
                          </span>
                          <p className="mb-0 capitalize group-hover:font-bold group-hover:text-white">
                            {term}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="overflow-auto pr-4">
                      {searchResults.length > 0 ? (
                        <div>
                          {displayedResults.map((result, index) => {
                            return (
                              <LocalizedLink key={index} to={result.slug}>
                                <div className="group px-4 py-3 mb-2 bg-substrateGray dark:bg-gray-700 hover:bg-substrateGreen rounded animate-fade-in-down">
                                  <span className="text-xs capitalize group-hover:font-bold group-hover:text-white">
                                    {result.section}
                                  </span>
                                  <p className="mb-0 capitalize group-hover:font-bold group-hover:text-white">
                                    {result.category} - {result.title}
                                  </p>
                                </div>
                              </LocalizedLink>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="cursor-pointer px-4 py-3 mb-2 bg-substrateGray rounded">
                          <p className="mb-0 capitalize text-substrateRed">
                            Try another search term
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            id="modal-background"
            className="opacity-25 dark:opacity-90 fixed inset-0 z-40 bg-substrateDark"
          ></div>
        </>
      ) : null}
    </>
  )
}

interface IStore {
  title: string
  section: string
  category: string
  keywords: string[] | null
  locale: string
}

interface IResult {
  ref: string
}
