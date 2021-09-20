import * as React from 'react'
import { navigate } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useIntl } from 'react-intl'

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
          <a
            onClick={() => navigate(-1)}
            className={`bg-substrateGreen py-3 px-8 hover:bg-white dark:hover:bg-darkBackground border-2 border-transparent hover:border-substrateGreen rounded text-white hover:text-substrateGreen transform transition duration-300 ease-in-out cursor-pointer`}
          >
            <button className={`focus:outline-none font-bold text-xl`}>
              {intl.formatMessage({ id: '404-button' })}
            </button>
          </a>
        </div>
      </section>
    </Layout>
  )
}
