import React, { useState } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import Prism from 'prism-react-renderer/prism'
import copyIcon from '../images/copy-icon.svg'
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
    <Highlight
      {...defaultProps}
      code={codeString}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className="gatsby-highlight" data-language={language}>
          <pre
            className={`${className} overflow-auto break-normal whitespace-pre `}
            style={style}
          >
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
                <img src={copyIcon} alt="Substrate Copy Code Icon" />
              </div>
            </button>

            {tokens.map((line, i) => (
              <>
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={i} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              </>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  )
}

export default Code
