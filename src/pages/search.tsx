import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import { LocalizedLink } from 'gatsby-theme-i18n'
import { Index } from 'lunr'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

// The rational here is if multiple words are in the query. It is likely to be a
//   AND relationship, and we will apply the AND syntax of lunrjs.
//   So 'randomness design' will becomes '+randomness +design'.
//   Refer to: https://lunrjs.com/guides/searching.html#term-presence
const processQuery = query => {
  // We skip if it satisfy one of the following conditions:
  if (
    query.length === 0 || // query is empty string
    query.split(/\s/).length < 2 || // query is a single word
    query.match(/[\^~+\-*:]/) !== null // query contains the special character in lunrjs search
  ) {
    return query
  }

  // Adding `+` in front of each token to make multiple words search using AND
  const result = query
    .split(/\s/)
    .filter(t => t.length > 0)
    .map(t => `+${t}`)
    .join(' ')

  return result
}

const searchForQuery = (index, store, query) => {
  try {
    return index
      .search(query)
      .map(result => ({ slug: result.ref, ...store[result.ref] }))
  } catch (error) {
    // Note: In production, we don't want to show error msg, so just return empty result set.
    // console.error(error)
    return []
  }
}

export default function search({ data }: any) {
  const [query, setQuery] = useState('')
  const [displayedResults, setDisplayedResults] = useState([])
  const index = Index.load(data.LunrIndex.index)
  const { store } = data.LunrIndex

  useEffect(() => {
    // Refer to the search doc of lunrjs: https://lunrjs.com/guides/searching.html
    let results = searchForQuery(index, store, processQuery(query))
    if (results.len == 0) {
      results = searchForQuery(index, store, `${query}*`)
    }

    setDisplayedResults(results)
  }, [query])

  return (
    <Layout>
      <SEO title={`Search Page`} />
      <div className="container pt-12">
        <div className="flex flex-col justify-center">
          <h3>Final Test</h3>
          <p>
            This iteration uses two sets of results. If the input is
            &quot;query&quot;, results A is a search of &quot;query&quot;, and
            result B is a search of &quot;query*&quot;. If there are multiple
            words in the query, we return documents that have all terms inside.
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
