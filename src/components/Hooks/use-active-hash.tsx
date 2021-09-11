import { useEffect, useState } from 'react'

export const useActiveHash = (itemIds: string[], rootMargin = undefined) => {
  const [activeHash, setActiveHash] = useState(``)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveHash(entry.target.id)
          }
        })
      },
      { rootMargin: rootMargin || `0% 0% -80% 0%` }
    )
    itemIds.forEach((id: string) => {
      const el = document.getElementById(id)
      el
        ? observer.observe(document.getElementById(id))
        : console.warn(
            `Unknown ID: ${id}. We don't support h1 tag (#) in markdown article.`
          )
    })
  }, [])
  return activeHash
}
