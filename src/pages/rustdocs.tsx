import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import Link from '../components/Link'
import Section from '../components/layout/Section'
import RustLogo from '../components/RustLogo'

export default function RustDocs() {
  return (
    <Layout>
      <SEO title="Substrate Rust Docs" />
      <Section styles="mt-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center">
          <div className="lg:w-1/2">
            <div className="font-title text-5xl lg:text-6xl font-extrabold mb-8">
              Substrate <br /> Rust Docs
            </div>
            <p className="max-w-lg">
              Substrate uses Rust&apos;s source code documentation and crate
              system to publish and manage its growing code base. The Substrate
              Rust docs is where all of that code lives, providing developers
              with the ultimate source of truth for updates in versions or
              changes in modules.
            </p>
            <p className="max-w-lg">
              This page maintains a reference list of all of Substrate&apos;s
              monthly releases since v3.0.0, for developers to be able to
              revisit previous source code documentation versions if they need
              to.
            </p>
            <ul className="list-inside mdx-anchor text-substrateBlue dark:text-substrateBlue-light">
              <li>
                <Link to="https://paritytech.github.io/substrate/master/sc_service/index.html">
                  Master
                </Link>
              </li>
              <li>
                <Link to="https://paritytech.github.io/substrate/monthly-2021-09+1/sc_service/index.html">
                  Monthly-2021-09+1
                </Link>
                {` `}
                <Link to="https://paritytech.github.io/substrate/master/sc_service/index.html">
                  {`(latest)`}
                </Link>
              </li>
              {/* <li>
                <Link to="https://paritytech.github.io/substrate/monthly-2021-08/sc_service/index.html">
                  Monthly-2021-08
                </Link>
              </li>
              <li>
                <Link to="https://paritytech.github.io/substrate/v3.0.0">
                  v3.0.0
                </Link>
              </li> */}
            </ul>
          </div>
          <div className="hidden lg:flex lg:justify-center lg:w-1/2 lg:px-12 xl:pr-36">
            <RustLogo />
          </div>
        </div>
      </Section>
    </Layout>
  )
}
