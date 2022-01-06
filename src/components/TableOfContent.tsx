import React, { useState, useEffect } from 'react'
import cx from 'classnames'

interface TableOfContentProps {
  headings: {
    items: {
      url: string
      title: string
    }[]
  }
}

function getIds(items) {
  if (items) {
    return items.reduce((acc, item) => {
      if (item.url) {
        acc.push(item.url.slice(1))
      }
      return acc
    }, [])
  } else return null
}

function useActiveId(itemIds) {
  const [activeId, setActiveId] = useState(``)
  console.log(activeId)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `-96px 0% -80% 0%` }
    )
    itemIds.forEach(id => {
      observer.observe(document.getElementById(id))
    })
  }, [itemIds])
  return activeId
}

export default function TableOfContent({ headings }: TableOfContentProps) {
  const { items } = headings
  const idList = getIds(headings.items)
  const activeId = idList && useActiveId(idList)

  return (
    <>
      <div className="w-60 sticky top-20 max-h-[calc(100vh-125px)] my-[29px] ml-11 overflow-y-auto overscroll-contain">
        <div className="mb-3 font-semibold">{items && 'ON THIS PAGE'}</div>
        {items && (
          <ul className="list-none">
            {items.map((value, index) => {
              return (
                <li
                  key={index}
                  className={cx(
                    '-ml-2 mb-2 hover:text-substrateBlue dark:hover:text-substrateBlue-light',
                    {
                      'text-substrateBlue dark:text-substrateBlue-light':
                        activeId === value.url.slice(1),
                    }
                  )}
                >
                  <a href={value.url}>{value.title} </a>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
