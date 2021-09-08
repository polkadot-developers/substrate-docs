import * as React from 'react'
// import { graphql } from 'gatsby'
// import { LocalizedLink } from 'gatsby-theme-i18n'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useIntl } from 'react-intl'

export default function Index() {
  const intl = useIntl()

  return (
    <Layout>
      <SEO title="Documentation Home" />
      <div className="h-screen -mt-24 flex justify-center items-center">
        <span className="text-4xl md:text-6xl lg:text-8xl transform hover:scale-110 transition duration-300">
          {intl.formatMessage({ id: 'helloSubstrate' })} !!!
        </span>
      </div>
    </Layout>
  )
}
