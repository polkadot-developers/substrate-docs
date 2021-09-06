import React, { useState } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import Prism from 'prism-react-renderer/prism'
import theme from 'prism-react-renderer/themes/dracula'
;(typeof global !== 'undefined' ? global : window).Prism = Prism
require('prismjs/components/prism-rust')
require('prismjs/components/prism-solidity')
require('prismjs/components/prism-bash')
require('prismjs/components/prism-powershell')

const Code = ({ codeString, language }: any) => {
  const [isCopied, setIsCopied] = useState(false)
  const copyToClipboard = (str: string) => {
    const el = document.createElement('textarea')
    el.value = str
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }

  return (
    <>
      <Highlight
        {...defaultProps}
        code={codeString}
        language={language}
        theme={theme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <div className="max-w-full lg:max-w-md xl:max-w-2xl 2xl:max-w-3xl">
            <div className="gatsby-highlight " data-language={language}>
              <pre className={`${className}`} style={style}>
                <button
                  className="absolute bottom-0 right-3"
                  onClick={() => {
                    copyToClipboard(codeString)
                    setIsCopied(true)
                    setTimeout(() => setIsCopied(false), 3000)
                  }}
                >
                  <div className="flex items-center px-4 py-1 rounded-t bg-substrateGreen">
                    <div className="pr-2 font-body text-black text-xs uppercase tracking-tight">
                      {isCopied ? 'Copied!' : 'Copy'}
                    </div>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.66928 0H4.47615C3.74216 0 3.14496 0.597198 3.14496 1.33119V3.14496H1.33119C0.597198 3.14496 0 3.74216 0 4.47568V8.66881C0 9.40327 0.597198 10 1.33119 10H5.52432C6.25831 10 6.85551 9.4028 6.85551 8.66881V6.85504H8.66881C9.4028 6.85504 10 6.25784 10 5.52432V1.33167C10.0005 0.597198 9.40327 0 8.66928 0ZM6.28945 8.66881C6.28945 9.09099 5.94603 9.43441 5.52432 9.43441H1.33119C0.909005 9.43441 0.566064 9.09052 0.566064 8.66881V4.47568C0.566064 4.05349 0.909477 3.71055 1.33119 3.71055H3.14449V5.52432C3.14449 6.25831 3.74169 6.85504 4.47568 6.85504H6.28945V8.66881ZM9.43441 5.52432C9.43441 5.94651 9.09099 6.28945 8.66928 6.28945H4.47615C4.05396 6.28945 3.71102 5.94603 3.71102 5.52432V1.33167C3.71102 0.909477 4.05444 0.566064 4.47615 0.566064H8.66928C9.09147 0.566064 9.43441 0.909949 9.43441 1.33167V5.52432Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                </button>
                {tokens.map((line, i) => (
                  <div key={i}>
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <span key={i} {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        )}
      </Highlight>
    </>
  )
}

export default Code
