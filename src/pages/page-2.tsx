import * as React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useIntl } from 'react-intl'

const Page2 = () => {
  const intl = useIntl()
  return (
    <Layout>
      <SEO title="Page 2" />
      <h1>{intl.formatMessage({ id: 'second-page' })}</h1>
      <p>{intl.formatMessage({ id: 'second-page-description' })}</p>
      <p>
        <LocalizedLink to="/">Link to index page</LocalizedLink>
      </p>
    </Layout>
  )
}

export default Page2
