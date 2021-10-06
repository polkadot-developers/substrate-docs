import * as React from 'react'
import { LocalizedLink } from 'gatsby-theme-i18n'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import {
  PrimaryButton,
  SecondaryButton,
  TextButton,
  PrimaryFixedButton,
} from '../components/Buttons'
import { ExternalLink } from '../components/DocsComponents'

const Buttons = () => {
  return (
    <Layout>
      <SEO title="Buttons" />
      <div className="container mt-16">
        <div className="w-full flex">
          <div className="w-2/3 m-6">
            <h4>CTA BUTTONS</h4>
            <div className="mt-6">
              <PrimaryButton cta link="#">
                Primary
              </PrimaryButton>
              <span className="px-4"></span>
              <SecondaryButton cta link="#">
                Secondary
              </SecondaryButton>
            </div>
            <div className="flex items-center mt-6">
              <PrimaryButton cta link="#">
                Primary is Cool
              </PrimaryButton>
              <span className="px-4"></span>
              <SecondaryButton cta link="#">
                Secondary is Cool
              </SecondaryButton>
            </div>
            <div className="flex items-center mt-6">
              <PrimaryButton cta link="#">
                Primary is really really really Cool
              </PrimaryButton>
              <span className="px-4"></span>
              <SecondaryButton cta link="#">
                Secondary is really really really Cool
              </SecondaryButton>
            </div>
          </div>
        </div>
        <div className="w-full mt-6">
          <div className="1/3 m-6">
            <h4>TXT CTA BUTTONS</h4>
            <div className="mt-6">
              <TextButton cta link="#">
                Text Dark
              </TextButton>
              <br />
              <TextButton accent cta link="#">
                Text Accent
              </TextButton>
            </div>
            <div className="mt-6">
              <TextButton cta link="#">
                Text Dark Medium
              </TextButton>
              <br />
              <TextButton accent cta link="#">
                Text Accent Medium
              </TextButton>
            </div>
          </div>
        </div>
        <div className="w-full flex">
          <div className="w-2/3 m-6">
            <h4>DEFAULT BUTTONS</h4>
            <div className="flex items-center mt-6">
              <PrimaryButton link="#">Primary</PrimaryButton>
              <span className="px-4"></span>
              <SecondaryButton link="#">Secondary</SecondaryButton>
            </div>
            <div className="flex items-center mt-6">
              <PrimaryButton link="#">Runtime Tutorial</PrimaryButton>
              <span className="px-4"></span>
              <SecondaryButton link="#">Runtime Tutorial</SecondaryButton>
            </div>
            <div className="flex items-center mt-6">
              <PrimaryButton link="#">Awesome Substrate Node Workshop</PrimaryButton>
              <span className="px-4"></span>
              <SecondaryButton link="#">Awesome Substrate Node Workshop</SecondaryButton>
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
          <h4>TXT LINKS</h4>
          <p className="markdown-body">
            You can run the pre-designed <LocalizedLink to="#">Substrate Node</LocalizedLink> and{' '}
            <LocalizedLink to="#">configure</LocalizedLink> its genesis block. In this case, you
            just need to supply a JSON file and launch your own blockchain. The JSON file allows you
            to configure{' '}
          </p>
        </div>
        <div className="m-6">
          <h4>EXTERNAL LINKS</h4>
          <div className="markdown-body mt-6">
            <ExternalLink url="https://www.substrate.dev">
              Start a Private Network Tutorials
            </ExternalLink>
          </div>
        </div>
        <div className="m-6">
          <h4>PRIMARY FIXED WIDTH</h4>
          <div className="mt-6">
            <p className="mb-0">10 Characters</p>
            <PrimaryFixedButton link="#">Primaryara</PrimaryFixedButton>
            <br />
            <p className="mb-0">20 Characters</p>
            <PrimaryFixedButton link="#">
              Primary Medium ABCDE
            </PrimaryFixedButton>
            <br />
            <p className="mb-0">30 Characters</p>
            <PrimaryFixedButton link="#">
              Primary Very very very Large
            </PrimaryFixedButton>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Buttons
