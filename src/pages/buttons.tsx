import * as React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
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
        <div className="w-full flex">
          <div className="w-96 m-6">
            <h5>CTA BUTTONS</h5>
            <div className="flex items-center mt-6">
              <PrimaryButton cta link="#">
                Primary
              </PrimaryButton>
              <span className="px-4"></span>
              <SecondaryButton cta link="#">
                Secondary
              </SecondaryButton>
            </div>
          </div>
          <div className="w-96 m-6">
            <h5>TXT BUTTONS</h5>
            <div className="mt-6">
              <TextButton cta link="#">
                Text Button
              </TextButton>
              <br />
              <TextButton accent cta link="#">
                Text Button
              </TextButton>
            </div>
          </div>
        </div>
        <div className="w-full flex">
          <div className="w-96 m-6">
            <h5>DEFAULT BUTTONS</h5>
            <div className="flex items-center mt-6">
              <PrimaryButton link="#">Primary</PrimaryButton>
              <span className="px-4"></span>
              <SecondaryButton link="#">Secondary</SecondaryButton>
            </div>
          </div>
          <div className="w-96 m-6">
            <div className="mt-12">
              <TextButton link="#">Text Button</TextButton>
              <br />
              <TextButton accent link="#">
                Text Button
              </TextButton>
            </div>
          </div>
        </div>
        <div className="w-1/2 m-6">
          <h5>TXT LINKS</h5>
          <p className="markdown-body">
            You can run the pre-designed{' '}
            <LocalizedLink to="#">Substrate Node</LocalizedLink> and{' '}
            <LocalizedLink to="#">configure</LocalizedLink> its genesis block.
            In this case, you just need to supply a JSON file and launch your
            own blockchain. The JSON file allows you to configure{' '}
          </p>
        </div>
        <div className="m-6">
          <h5>EXTERNAL LINKS</h5>
          <div className="markdown-body mt-6">
            <ExternalLink url="https://www.substrate.dev">
              Start a Private Network Tutorials
            </ExternalLink>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Page2
