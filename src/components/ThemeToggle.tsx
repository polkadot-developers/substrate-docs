import React, { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { colorMode, setColorMode } = useContext(ThemeContext)

  function toggleTheme() {
    if (colorMode === 'dark') setColorMode('light')
    if (colorMode === 'light') setColorMode('dark')
  }

  if (!colorMode) {
    return null
  }

  return (
    <div
      className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
      onClick={toggleTheme}
    >
      {colorMode === 'dark' ? (
        <svg
          className="transform -rotate-12 fill-current text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-4 -2 24 24"
          width="24"
          height="24"
          preserveAspectRatio="xMinYMin"
        >
          <title>Moon</title>
          <path d="M12.253.335A10.086 10.086 0 0 0 8.768 8c0 4.632 3.068 8.528 7.232 9.665A9.555 9.555 0 0 1 9.742 20C4.362 20 0 15.523 0 10S4.362 0 9.742 0c.868 0 1.71.117 2.511.335z"></path>
        </svg>
      ) : (
        <svg
          className="opacity-80 fill-current text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-2 -2 24 24"
          width="24"
          height="24"
          preserveAspectRatio="xMinYMin"
        >
          <title>Sun</title>
          <path d="M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-15a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V1a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM1 9h2a1 1 0 1 1 0 2H1a1 1 0 0 1 0-2zm16 0h2a1 1 0 0 1 0 2h-2a1 1 0 0 1 0-2zm.071-6.071a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zM5.757 14.243a1 1 0 0 1 0 1.414L4.343 17.07a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zM4.343 2.929l1.414 1.414a1 1 0 0 1-1.414 1.414L2.93 4.343A1 1 0 0 1 4.343 2.93zm11.314 11.314l1.414 1.414a1 1 0 0 1-1.414 1.414l-1.414-1.414a1 1 0 1 1 1.414-1.414z"></path>
        </svg>
      )}
    </div>
  )
}
