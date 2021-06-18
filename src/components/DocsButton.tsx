import React from 'react'
import docsIcon from '../images/docs-icon.svg'
import { useIntl } from 'react-intl'

export default function DocsButton() {
  const intl = useIntl()
  return (
    <button className="flex items-center justify-center bg-black text-white text-sm py-2 w-20 rounded focus:outline-none focus:ring-1 focus:ring-substrateGreen">
      <img src={docsIcon} alt="Substrate Docs Icon" />
      <span className="pl-1">{intl.formatMessage({ id: 'nav-docs' })}</span>
    </button>
  )
}
