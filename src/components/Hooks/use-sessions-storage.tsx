import { useState, useEffect } from 'react'

function getSessionStorageOrDefault(key: string, defaultValue: boolean) {
  const stored = sessionStorage.getItem(key)
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
    sessionStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export default useSessionStorage
