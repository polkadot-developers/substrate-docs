import './src/styles/global.css'
import './src/styles/language-tabs.css'
import './src/styles/markdown.css'
import './src/styles/scss/styles.scss'

import React from 'react'

import { ThemeProvider } from './src/contexts/ThemeContext'

export const wrapPageElement = ({ element, props }) => (
  <ThemeProvider value={props}>{element}</ThemeProvider>
)
