import * as React from 'react'
// import { graphql } from 'gatsby'
// import { LocalizedLink } from 'gatsby-theme-i18n'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useIntl } from 'react-intl'
import { PrimaryFixedButton } from '../components/Buttons'

export default function Index() {
  const intl = useIntl()

  return (
    <Layout>
      <SEO title="Documentation Home" />
      <section className="xl:container my-20 md:mt-20 md:mb-36">
        <div className="flex flex-col md:flex-row md:items-center px-6">
          <div className="lg:m-0 mb-10 md:w-1/2 md:px-5 lg:px-10">
            <div className="text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6">
              Substrate <br /> Develop Hub
            </div>
            <h4 className="text-xl xl:text-3xl font-semibold">
              Substrate developer knowledge base
            </h4>
            <p className="max-w-lg">
              Substrate is powered by best-in-class cryptographic research and
              comes with peer-to-peer networking, consensus mechanisms, and much
              more.
            </p>
            <PrimaryFixedButton link="/v3">Get Started</PrimaryFixedButton>
          </div>
          <div className="flex justify-center md:w-1/2">
            <div className="bg-gray-200 w-96 h-96"></div>
          </div>
        </div>
      </section>
      <section>
        <div className="text-center mb-16">
          <h1>Learn Substrate</h1>
          <h4 className="text-xl xl:text-3xl font-semibold">
            Substrate developer knowledge base
          </h4>
        </div>
        <div></div>
      </section>
      <section className="h-96 bg-gray-200"></section>
    </Layout>
  )
}
