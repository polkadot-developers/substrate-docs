import { useEffect, useState } from 'react'

import { isBrowser } from '../utils/browser'

export const useSessionStorage = (key, initialValue) => {
  const [isBannerOpen, setIsBannerOpen] = useState(null)

  useEffect(() => {
    const stored = isBrowser && window.sessionStorage.getItem(key)
    if (!stored) {
      setIsBannerOpen(initialValue)
    } else {
      setIsBannerOpen(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    window.sessionStorage.setItem(key, JSON.stringify(isBannerOpen))
  }, [isBannerOpen])

  return { isBannerOpen, setIsBannerOpen }
}
