import './src/styles/global.css'
import './src/styles/language-tabs.css'
import './src/styles/markdown.css'
import './src/styles/scss/styles.scss'

import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { preToCodeBlock } from 'mdx-utils'
import Code from './src/components/Code'

import { ThemeProvider } from './src/contexts/ThemeContext'

const components = {
  pre: preProps => {
    const props = preToCodeBlock(preProps)
    if (props) {
      return <Code {...props} />
    }
    return <pre {...preProps} />
  },
  wrapper: ({ children }) => <>{children}</>,
}

export const wrapPageElement = ({ element, props }) => (
  <MDXProvider components={components}>
    <ThemeProvider value={props}>{element}</ThemeProvider>
  </MDXProvider>
)
