import React from 'react'
import { TextButton } from '../../Buttons'

export default function ExploreDocs() {
  const content = [
    {
      name: 'Ways To Build',
      cta: 'Get Statrted',
      link: '#',
      items: [
        {
          name: 'FRAME',
          description:
            'Explore the basics of Substrate’s FRAME and start creating your custom pallets.',
        },
        {
          name: 'Smart Contracts',
          description:
            'Understand what smart contract capabilities exist for Substrate chains.',
        },
        {
          name: 'Parachain capabilities',
          description:
            'Jump right into the technical components required to build a parachain.',
        },
      ],
    },
    {
      name: 'Learn The Fundamentals',
      cta: 'More key concepts',
      link: '#',
      items: [
        {
          name: 'Accounts',
          description:
            'Explore the basics of Substrate’s FRAME and start creating your custom pallets.',
        },
        {
          name: 'Extrinsics',
          description:
            'Understand what smart contract capabilities exist for Substrate chains.',
        },
        {
          name: 'Transaction Weights',
          description:
            'Understand how benchmarking and weights are used to calculate transaction fees. ',
        },
        {
          name: 'Off-Chain Features',
          description:
            'Explore how you can include oracle-like capabilities in your runtime.',
        },
      ],
    },
    {
      name: 'Tools and Integration',
      cta: 'More Tools',
      link: '#',
      items: [
        {
          name: 'Polkadot JS',
          description:
            'Interact with a Substrate chain using JavaScript, a browser extension or in-browser RPC endpoint.',
        },
        {
          name: 'Substrate Connect',
          description:
            'Light client tools to connect runtimes to end-users applications  without a third-party service.',
        },
        {
          name: 'Transaction Weights',
          description:
            'Understand how benchmarking and weights are used to calculate transaction fees. ',
        },
        {
          name: 'Tx Wrapper ',
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
                  <div>
                    <b>{item.name}</b>
                  </div>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
            <div className="pl-4">
              <TextButton accent link={section.link}>
                {section.cta}
              </TextButton>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
