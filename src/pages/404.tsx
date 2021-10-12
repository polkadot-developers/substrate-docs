import * as React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useIntl } from 'react-intl'
import { PrimaryFixedButton } from '../components/Buttons'

export default function NotFoundPage() {
  const intl = useIntl()
  return (
    <Layout>
      <SEO title={'404: Not Found'} />
      <section>
        <div className="w-full mx-auto mt-20 text-center self-center">
          <div className="mb-10 four-oh-four-title text-9xl xl:text-four-oh-four">
            {intl.formatMessage({ id: '404' })}
          </div>
          <h2 className="text-center text-4xl mb-10 font-bold">
            {intl.formatMessage({ id: '404-text' })}
          </h2>
          <div className="flex flex-wrap pb-24 justify-center">
            <div className="mx-4 mb-4 md:mb-0">
              <PrimaryFixedButton link="/">Home</PrimaryFixedButton>
            </div>
            <div>
              <PrimaryFixedButton link="https://github.com/substrate-developer-hub/substrate-docs/issues/new?title=Broken%20Link&template=broken-link.yaml&labels=Broken%20Link">
                Report a broken link
              </PrimaryFixedButton>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
