import React, { useState } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import Icon from '../Icon'
import Prism from 'prism-react-renderer/prism'
import theme from 'prism-react-renderer/themes/dracula'
;(typeof global !== 'undefined' ? global : window).Prism = Prism
require('prismjs/components/prism-rust')
require('prismjs/components/prism-solidity')
require('prismjs/components/prism-bash')
require('prismjs/components/prism-powershell')

const Code = ({ codeString, language }) => {
  const [isCopied, setIsCopied] = useState(false)
  const copyToClipboard = str => {
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
          <div className="max-w-full">
            <div className="gatsby-highlight" data-language={language}>
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
                    <Icon name="copyText" />
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
