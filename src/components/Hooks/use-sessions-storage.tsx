import { useState, useEffect } from 'react'

function isBrowser() {
  return typeof window !== 'undefined'
}

function getSessionStorageOrDefault(key: string, defaultValue: boolean) {
  const stored = isBrowser() && window.sessionStorage.getItem(key)
  if (!stored) {
    return defaultValue
  }
  return JSON.parse(stored)
}

function useSessionStorage(key: string, defaultValue: boolean) {
  const [value, setValue] = useState(
    getSessionStorageOrDefault(key, defaultValue)
  )

  useEffect(() => {
    isBrowser() && window.sessionStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export default useSessionStorage
