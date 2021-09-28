import React from 'react'
import { TextButton } from '../../Buttons'
import { LocalizedLink } from 'gatsby-theme-i18n'

export default function ExploreDocs() {
  const content = [
    {
      name: 'Ways To Build',
      cta: 'Get started',
      link: '/v3/getting-started/overview',
      items: [
        {
          name: 'FRAME',
          link: '/v3/runtime/frame',
          description:
            'Explore the basics of Substrate’s FRAME and start creating your custom pallets.',
        },
        {
          name: 'Smart Contracts',
          link: '/v3/smart-contracts/overview',
          description:
            'Understand what smart contract capabilities exist for Substrate chains.',
        },
        {
          name: 'Parachain capabilities',
          link: '#',
          description:
            'Jump right into the technical components required to build a parachain.',
        },
      ],
    },
    {
      name: 'Learn The Fundamentals',
      cta: 'More key concepts',
      link: '/v3/concepts/runtime',
      items: [
        {
          name: 'Accounts',
          link: '/v3/advanced/account-info',
          description:
            'Explore the basics of Substrate’s FRAME and start creating your custom pallets.',
        },
        {
          name: 'Extrinsics',
          link: '/v3/concepts/extrinsics',
          description:
            'Understand what smart contract capabilities exist for Substrate chains.',
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
          description:
            'Explore how you can include oracle-like capabilities in your runtime.',
        },
      ],
    },
    {
      name: 'Tools and Integration',
      cta: 'More tools',
      link: '/v3/toolchains/polkadot-js',
      items: [
        {
          name: 'Polkadot JS',
          link: '/v3/toolchains/polkadot-js',
          description:
            'Interact with a Substrate chain using JavaScript, a browser extension or in-browser RPC endpoint.',
        },
        {
          name: 'Substrate Connect',
          link: '#',
          description:
            'Light client tools to connect runtimes to end-users applications  without a third-party service.',
        },
        {
          name: 'Transaction Weights',
          link: '/v3/concepts/weight',
          description:
            'Understand how benchmarking and weights are used to calculate transaction fees. ',
        },
        {
          name: 'Tx Wrapper ',
          link: '#',
          description:
            'Publish libraries to create chain specific offline transactions.',
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
                    <div>
                      <b>{item.name}</b>
                    </div>
                    <p>{item.description}</p>
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
