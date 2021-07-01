import * as React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

export default function NotFoundPage() {
  return (
    <Layout>
      <SEO title="Blockchain Infrastructure for the Decentralised Web" />
      <section className="bg-textDark -mt-24 xl:-mt-32 border-b border-parityBorder">
        <div className="h-screen">
          <div className="container h-full text-center max-w-4xl pt-64 md:pt-0 pb-16 px-2 md:flex md:flex-col md:justify-center md:items-center md:w-2/3">
            <iframe
              src="https://giphy.com/embed/3o7aTskHEUdgCQAXde"
              width="480"
              height="204"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <h3 className="md:text-5xl text-parityWhite mt-10">404</h3>
            <h3 className="text-textLight pb-8">VERY LOST</h3>
          </div>
        </div>
      </section>
    </Layout>
  )
}
