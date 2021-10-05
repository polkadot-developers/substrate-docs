import React from 'react'
import { TextButton } from '../../Buttons'
import { LocalizedLink } from 'gatsby-theme-i18n'

export default function ExploreDocs() {
  const content = [
    {
      name: 'Ways To Build',
      cta: 'Get started',
      link: '/v3',
      items: [
        {
          name: 'FRAME',
          link: '/v3/runtime/frame',
          description:
            'Explore the basics of Substrate’s FRAME and start creating your custom pallets.',
        },
        {
          name: 'Smart Contracts',
          link: '/v3/runtime/smart-contracts',
          description: 'Discover the different ways to use smart contracts in Substrate chains.',
        },
      ],
    },
    {
      name: 'Learn The Fundamentals',
      cta: 'More key concepts',
      link: '/v3/concepts',
      items: [
        {
          name: 'Accounts',
          link: '/v3/concepts/account-abstractions',
          description: "Read about Substrate's Account and key pair generation system.",
        },
        {
          name: 'Extrinsics',
          link: '/v3/concepts/extrinsics',
          description: 'Learn about the different transaction types in Substrate.',
        },
        {
          name: 'Transaction Weights',
          link: '/v3/concepts/weight',
          description:
            'Understand how benchmarking and weights are used to calculate transaction fees. ',
        },
        {
          name: 'Off-Chain Features',
          link: '/v3/concepts/off-chain-features',
          description: 'Explore how you can include oracle-like capabilities in your runtime.',
        },
      ],
    },
    {
      name: 'Tools and Integration',
      cta: 'More tools',
      link: '/v3/tools',
      items: [
        {
          name: 'Polkadot JS',
          link: '/v3/integration/polkadot-js',
          description:
            'Interact with a Substrate chain using JavaScript, a browser extension or in-browser RPC endpoint.',
        },
        {
          name: 'Substrate Connect',
          link: '/v3/integration/substrate-connect',
          description:
            'Integrate a light client that connects your runtime to an end-user application without a third-party service.',
        },
        {
          name: 'Tx Wrapper ',
          link: '/how-to-guides/v3/tools/txwrapper',
          description:
            'Publish libraries that can create offline transactions specific to your chain.',
        },
      ],
    },
  ]
  return (
    <>
      {content.map((section, index) => (
        <div key={index} className="md:w-96 xl:mr-6">
          <div className="mb-14">
            <div className="text-2xl font-extrabold mb-9">{section.name}</div>
            <ul className="px-4 leading-7">
              {section.items.map((item, index) => (
                <li key={index}>
                  <LocalizedLink to={item.link}>
                    <div className="">
                      <b>{item.name}</b>
                    </div>
                    <p className="leading-7">{item.description}</p>
                  </LocalizedLink>
                </li>
              ))}
            </ul>
            <div className="pl-4">
              <TextButton accent cta link={section.link}>
                {section.cta}
              </TextButton>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
