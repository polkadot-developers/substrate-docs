import React from 'react'
import { useEffect } from 'react'

function getInitialColorMode() {
  if (typeof window !== 'undefined') {
    const persistedColorPreference = window.localStorage.getItem('theme')
    const hasPersistedPreference = typeof persistedColorPreference === 'string'

    if (hasPersistedPreference) {
      return persistedColorPreference
    }
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const hasMediaQueryPreference = typeof mql.matches === 'boolean'
    if (hasMediaQueryPreference) {
      return mql.matches ? 'dark' : 'light'
    }
  }

  return 'light'
}

interface ThemeContextInterface {
  colorMode: string
  setColorMode: (value: string) => void
}

export const ThemeContext = React.createContext<ThemeContextInterface | null>(
  null
)

export const ThemeProvider = ({ children }: any) => {
  const [colorMode, rawSetColorMode] = React.useState(getInitialColorMode())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      rawSetColorMode(getInitialColorMode())
    }
  }, [])

  const setColorMode = (value: string) => {
    rawSetColorMode(value)
    // Set Tailwind color mode
    if (value == 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
    // Persist on update
    localStorage.theme = value
  }
  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
