import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { StaticImage } from 'gatsby-plugin-image'
import PlaygroundCard from '../components/PlaygroundCard'

export default function playground() {
  const [selected, setSelected] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const deploy = urlParams.get('deploy')
    deploy === 'node-template'
      ? setSelected('node-template')
      : deploy === 'front-end-template'
      ? setSelected('front-end-template')
      : null
  }, [])
  return (
    <Layout>
      <SEO title="Playground" />
      <section className="xl:container my-20 md:mt-20 md:mb-36">
        <div className="flex flex-col md:flex-row md:items-center px-6">
          <div className="lg:m-0 md:w-1/2 md:px-5 lg:px-10">
            <div className="text-5xl xl:text-7xl font-title font-extrabold mb-6">
              Playground
            </div>
            <h4 className="text-xl font-semibold">
              Set up a local environment
            </h4>
            <p className="max-w-lg">
              We recommend picking a sandbox, particularly if you&apos;re just
              getting started. Building on Substrate requires different pieces
              of technology. Using a sandbox allows you to skip preliminary
              set-up and prerequisites to get to the parts that are important to
              you.
            </p>
          </div>
          <div className="flex justify-center md:w-1/2">
            <StaticImage
              backgroundColor="transparent"
              src="../images/playground-hero.png"
              alt="Substrate Playground"
              layout="constrained"
            />
          </div>
        </div>
      </section>
      <section id="config" className="xl:container mb-36">
        <div className="mx-auto max-w-xl text-center font-extrabold text-4xl xl:text-6xl">
          Select Playground Configuration
        </div>
        <div className="my-20 px-6 flex flex-col items-center lg:flex-row lg:justify-center">
          <PlaygroundCard
            icon={'node'}
            preSelected={selected === 'node-template'}
            title={`Node Template`}
            description={`A “skeleton blockchain” with essential capabilities, including P2P
            networking, consensus, finality, account, transaction and sudo
            governance modules.`}
            listTitle={'Key Runtime Modules'}
            components={[
              'pallet_balances',
              'pallet_transaction_payment',
              'pallet_sudo',
              'pallet_template',
            ]}
            link={`https://playground.substrate.dev/?deploy=node-template`}
          />
          <PlaygroundCard
            icon={'front'}
            preSelected={selected === 'front-end-template'}
            title={`Front-End Template`}
            description={`A modular UI built with ReactJS to act as a front-end to the Substrate 
            Node Template. It contains all necessary components to interact with the Node 
            Template’s mruntime.`}
            listTitle={'Key Components'}
            components={[
              'Interactor',
              'MetaData',
              'Balances',
              'BlockNumber',
            ]}
            link={` https://playground.substrate.dev/?deploy=front-end-template`}
          />
        </div>
      </section>
    </Layout>
  )
}
