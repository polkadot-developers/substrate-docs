import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import { LocalizedLink } from 'gatsby-theme-i18n'
import { Index } from 'lunr'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

export default function search({ data }: any) {
  const [query, setQuery] = useState('')
  const [displayedResults, setDisplayedResults] = useState([])
  const index = Index.load(data.LunrIndex.index)
  const { store } = data.LunrIndex
  // console.log(index, store)
  // console.log('Current Search Query: ', query)
  // console.log('Current results displayed', displayedResults)

  useEffect(() => {
    let results = []
    try {
      results = index.search(`${query}`).map(result => {
        return {
          slug: result.ref,
          ...store[result.ref],
        }
      })
      setDisplayedResults(results)
    } catch (error) {
      console.log(error)
    }
  }, [query])

  return (
    <Layout>
      <SEO title={`Search Page`} />
      <div className="container pt-12">
        <div className="flex justify-center">
          <input
            className="border-b border-black placeholder-gray-500 focus:outline-none"
            id="search-input"
            type="search"
            value={query}
            placeholder="Search Docs"
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="flex justify-center pt-12">
          <div className="overflow-auto w-96 h-96 bg-gray-100">
            <h4 className="sticky top-0 p-4 mb-0 bg-gray-300 shadow">Docs</h4>
            {query.length > 1 ? (
              <div className="overflow-auto px-4">
                {displayedResults
                  .filter(cat => {
                    return cat.section === 'docs'
                  })
                  .map((item, index) => {
                    return (
                      <LocalizedLink
                        className="block capitalize"
                        key={index}
                        to={item.slug}
                      >
                        {item.category} - {item.title}
                      </LocalizedLink>
                    )
                  })}
              </div>
            ) : (
              <p>Try another search string</p>
            )}
          </div>
          <div className="overflow-auto w-96 h-96 bg-gray-100">
            <h4 className="sticky top-0 p-4 mb-0 bg-gray-300 shadow">
              How to Guides
            </h4>
            {query.length > 1 ? (
              <div className="overflow-auto px-4">
                {displayedResults
                  .filter(cat => {
                    return cat.section === 'how to guides'
                  })
                  .map((item, index) => {
                    return (
                      <LocalizedLink
                        className="block capitalize"
                        key={index}
                        to={item.slug}
                      >
                        {item.category} - {item.title}
                      </LocalizedLink>
                    )
                  })}
              </div>
            ) : (
              <p>Try another search string</p>
            )}
          </div>
          <div className="overflow-auto w-96 h-96 bg-gray-100">
            <h4 className="sticky top-0 p-4 mb-0 bg-gray-300 shadow">
              Tutorials
            </h4>
            {query.length > 1 ? (
              <div className="overflow-auto px-4">
                {displayedResults
                  .filter(cat => {
                    return cat.section === 'tutorials'
                  })
                  .map((item, index) => {
                    return (
                      <LocalizedLink
                        className="block capitalize"
                        key={index}
                        to={item.slug}
                      >
                        {item.category} - {item.title}
                      </LocalizedLink>
                    )
                  })}
              </div>
            ) : (
              <p>Try another search string</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    LunrIndex
  }
`
