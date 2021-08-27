import React from 'react'

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

export default function TableOfContent({ headings }: TableOfContentProps) {
  const { items } = headings
  return (
    <>
      <div className="w-60 sticky top-16 h-[calc(100vh-100px)] py-8 pl-11 text-sm overflow-y-auto">
        <div className="pb-4 text-[13px]">{items && 'ON THIS PAGE'}</div>
        {items && (
          <>
            {items.map((value, index) => {
              return (
                <div key={index}>
                  <AnchorTag value={value} />
                  {value.items && (
                    <>
                      {value.items.map((value, index) => {
                        return (
                          <div key={index} className="pl-3">
                            <AnchorTag value={value} />
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

interface AnchorTagProps {
  value: {
    url: string
    title: string
  }
}
function AnchorTag({ value }: AnchorTagProps) {
  return (
    <a href={value.url}>
      <div className="inline-flex pb-3 hover:text-shadow">{value.title}</div>
    </a>
  )
}
