import * as React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import {
  PrimaryButton,
  SecondaryButton,
  TextButton,
} from '../components/Buttons'
import ExternalLink from '../components/DocsComponents/ExternalLink'

const Page2 = () => {
  return (
    <Layout>
      <SEO title="Buttons" />
      <div className="container mt-16">
        <div className="p-10">
          <PrimaryButton link="#">Primary</PrimaryButton>
        </div>
        <div className="p-10">
          <SecondaryButton link="#">Secondary</SecondaryButton>
        </div>
        <div className="p-10">
          <TextButton link="#">Text Button</TextButton>
        </div>
        <div className="markdown-body p-10">
          <ExternalLink url="https://www.substrate.dev">
            Start a Private Network Tutorials
          </ExternalLink>
        </div>
      </div>
    </Layout>
  )
}

export default Page2
