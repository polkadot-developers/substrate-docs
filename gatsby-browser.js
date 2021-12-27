import './src/styles/global.css'
import './src/styles/language-tabs.css'
import './src/styles/markdown.css'
import './src/styles/custom-blocks.css'
import './src/styles/scss/styles.scss'

import 'lazysizes'

import React from 'react'
// import { MDXProvider } from '@mdx-js/react'
// import { preToCodeBlock } from 'mdx-utils'
// import Code from './src/components/Code'

import { ThemeProvider } from './src/contexts/ThemeContext'

// const components = {
//   pre: preProps => {
//     const props = preToCodeBlock(preProps)
//     if (props) {
//       return <Code {...props} />
//     }
//     return <pre {...preProps} />
//   },
//   wrapper: ({ children }) => <>{children}</>,
// }

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)

// export const wrapPageElement = ({ element }) => (
//   <MDXProvider components={components}>{element}</MDXProvider>
// )

export const onRouteUpdate = ({ location }) => scrollToAnchor(location)

/**
 *
 * @desc - a function to jump to the correct scroll position
 * @param {Object} location -
 * @param {Number} [mainNavHeight] - the height of any persistent nav -> document.querySelector(`nav`)
 */
function scrollToAnchor(location, mainNavHeight = 100) {
  // Check for location so build does not fail

  if (location && location.hash) {
    // Fix scrolling for ids starting with numbers
    // https://stackoverflow.com/a/20306237/1268612
    const hash = location.hash.replace(/^#(\d)/, '#\\3$1')
    const item = document.querySelector(`${hash}`)

    if (item)
      window.scrollTo({
        top: item.offsetTop - mainNavHeight,
        behavior: 'instant',
      })
  }

  const bypassPages = ['/', '/tutorials/v3/', '/rustdocs/', '/playground/']
  if (location && !location.hash && bypassPages.includes(location.pathname)) {
    window.scrollTo(0, 0)
  }

  return true
}
