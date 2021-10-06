import React from 'react'
import { useActiveHash } from './Hooks/use-active-hash'

interface TableOfContentProps {
  headings: {
    items: {
      url: string
      title: string
      items?: {
        url: string
        title: string
      }[]
    }[]
  }
}

const getHeadingIds: any = (
  toc: {
    url: string
    title: string
    items?: {
      url: string
      title: string
    }[]
  }[],
  traverseFullDepth = true,
  depth: number,
  recursionDepth = 1
) => {
  const idList = []
  const hashToId = (str: string) => str.slice(1)
  if (toc) {
    for (const item of toc) {
      if (item.url) {
        idList.push(hashToId(item.url))
      }
      if (item.items && traverseFullDepth && recursionDepth < (depth || 6)) {
        idList.push(
          ...getHeadingIds(item.items, true, depth, recursionDepth + 1)
        )
      }
    }
  }
  return idList
}

export default function TableOfContent({ headings }: TableOfContentProps) {
  const { items } = headings
  const activeHash = useActiveHash(getHeadingIds(items, true, 3))

  return (
    <>
      <div className="w-60 sticky top-20 max-h-[calc(100vh-125px)] my-[29px] ml-11 overflow-y-auto overscroll-contain">
        <div className="mb-3 font-semibold">{items && 'ON THIS PAGE'}</div>
        {items && (
          <>
            {items.map((value, index) => {
              return (
                <div key={index}>
                  <a href={value.url}>
                    <div
                      className={`mb-2 hover:text-substrateBlue dark:hover:text-substrateBlue-light ${
                        activeHash === value.url.substr(1) &&
                        'text-substrateBlue dark:text-substrateBlue-light'
                      }`}
                    >
                      {value.title}
                    </div>
                  </a>
                  {value.items && (
                    <>
                      {value.items.map((value, index) => {
                        return (
                          <div key={index} className="pl-3">
                            <a href={value.url}>
                              <div
                                className={`inline-flex mb-2 hover:text-substrateBlue dark:hover:text-substrateBlue-light ${
                                  activeHash === value.url.substr(1) &&
                                  'text-substrateBlue dark:text-substrateBlue-light'
                                }`}
                              >
                                {value.title}
                              </div>
                            </a>
                          </div>
                        )
                      })}
                    </>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>
    </>
  )
}
