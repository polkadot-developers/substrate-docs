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

  useEffect(() => {
    let resultsA = []
    try {
      resultsA = index.search(`${query}`).map(result => {
        return {
          slug: result.ref,
          ...store[result.ref],
        }
      })
    } catch (error) {
      console.log(error)
    }
    let resultsB = []
    try {
      resultsB = index.search(`${query}*`).map(result => {
        return {
          slug: result.ref,
          ...store[result.ref],
        }
      })
    } catch (error) {
      console.log(error)
    }
    if (resultsA.length === 0) {
      setDisplayedResults(resultsB)
    } else {
      setDisplayedResults(resultsA)
    }
  }, [query])

  return (
    <Layout>
      <SEO title={`Search Page`} />
      <div className="container pt-12">
        <div className="flex flex-col justify-center">
          <h3>Final Test</h3>
          <p>
            This iteration uses two sets of results. Results A is out of the box
            Lunr implementation. And if it returns zero results, we fall back on
            ResultsB; which is &apos;starts with typed query, e.g. Foo***&apos;
          </p>
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
            {query.length === 0 ? (
              <div className="px-4">
                <div>Suggestions - &rsquo;Runtime&rsquo;</div>
                <div>Suggestions - &rsquo;Macros&rsquo;</div>
                <div>Suggestions - &rsquo;Pallets&rsquo;</div>
                <div>Suggestions - &rsquo;Setup&rsquo;</div>
                <div>Suggestions - &rsquo;Installation&rsquo;</div>
              </div>
            ) : (
              <div className="overflow-auto px-4">
                {displayedResults.length > 0 ? (
                  <div>
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
                  <div>Try another search term</div>
                )}
              </div>
            )}
          </div>
          <div className="overflow-auto w-96 h-96 bg-gray-100">
            <h4 className="sticky top-0 p-4 mb-0 bg-gray-300 shadow">
              How to Guides
            </h4>
            {query.length === 0 ? null : (
              <div className="overflow-auto px-4">
                {displayedResults.length > 0 ? (
                  <div>
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
                  <div>Try another search term</div>
                )}
              </div>
            )}
          </div>
          <div className="overflow-auto w-96 h-96 bg-gray-100">
            <h4 className="sticky top-0 p-4 mb-0 bg-gray-300 shadow">
              Tutorials
            </h4>
            {query.length === 0 ? null : (
              <div className="overflow-auto px-4">
                {displayedResults.length > 0 ? (
                  <div>
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
                  <div>Try another search term</div>
                )}
              </div>
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
