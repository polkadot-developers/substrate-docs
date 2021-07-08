export interface IkbSideBar {
  name: string
  items: { title: string; link: string }[]
}

export const kbSideBar: IkbSideBar = [
  {
    name: 'Getting Started',
    items: [
      {
        title: 'Overview',
        link: '/v3/docs/getting-started/overview',
      },
      {
        title: 'Architecture',
        link: '/v3/docs/getting-started/architecture',
      },
      {
        title: 'Installation',
        link: '/v3/docs/getting-started/installation',
      },
      {
        title: 'Getting Started on Windows',
        link: '/v3/docs/getting-started/windows-users',
      },
      {
        title: 'Glossary',
        link: '/v3/docs/getting-started/glossary',
      },
    ],
  },
  {
    name: 'Substrate Key Concepts',
    items: [
      {
        title: 'Runtime',
        link: '/v3/docs/concepts/runtime',
      },
      {
        title: 'Extrinsics',
        link: '/v3/docs/concepts/extrinsics',
      },
      {
        title: 'Account Abstractions',
        link: '/v3/docs/concepts/account-abstractions',
      },
      {
        title: 'Transaction Pool',
        link: '/v3/docs/concepts/tx-pool',
      },
      {
        title: 'Session Keys',
        link: '/v3/docs/concepts/session-keys',
      },
      {
        title: 'Transaction Weight',
        link: '/v3/docs/concepts/weight',
      },
      {
        title: 'Off-Chain Features',
        link: '/v3/docs/concepts/off-chain-features',
      },
    ],
  },
  {
    name: 'Runtime',
    items: [
      {
        title: 'Pallets',
        link: '/v3/docs/knowledgebase/runtime/pallets',
      },
      {
        title: 'FRAME',
        link: '/v3/docs/knowledgebase/runtime/frame',
      },
      {
        title: 'Macros',
        link: '/v3/docs/knowledgebase/runtime/macros',
      },
      {
        title: 'Metadata',
        link: '/v3/docs/knowledgebase/runtime/metadata',
      },
      {
        title: 'Storage',
        link: '/v3/docs/knowledgebase/runtime/storage',
      },
      {
        title: 'Origins',
        link: '/v3/docs/knowledgebase/runtime/origins',
      },
      {
        title: 'Execution',
        link: '/v3/docs/knowledgebase/runtime/execution',
      },
      {
        title: 'Events',
        link: '/v3/docs/knowledgebase/runtime/events',
      },
      {
        title: 'Errors',
        link: '/v3/docs/knowledgebase/runtime/errors',
      },
      {
        title: 'Weights and Fees',
        link: '/v3/docs/knowledgebase/runtime/weights-and-fees',
      },
      {
        title: 'Benchmarking',
        link: '/v3/docs/knowledgebase/runtime/benchmarking',
      },
      {
        title: 'Debugging',
        link: '/v3/docs/knowledgebase/runtime/debugging',
      },
      {
        title: 'Testing',
        link: '/v3/docs/knowledgebase/runtime/testing',
      },
      {
        title: 'Randomness',
        link: '/v3/docs/knowledgebase/runtime/randomness',
      },
      {
        title: 'Upgrades',
        link: '/v3/docs/knowledgebase/runtime/upgrades',
      },
    ],
  },
  {
    name: 'Smart Contracts',
    items: [
      {
        title: 'Overview',
        link: '/v3/docs/knowledgebase/smartcontracts/overview',
      },
      {
        title: '"Contracts Pallet',
        link: '/v3/docs/knowledgebase/smartcontracts/contracts-pallet',
      },
      {
        title: 'EVM Pallet',
        link: '/v3/docs/knowledgebase/smartcontracts/evm-pallet',
      },
    ],
  },
    {
      name: 'Integrate',
      item: [
      {
        title: 'Polkadot-JS',
        link: '/v3/docs/knowledgebase/integrate/polkadotjs',
      },
      {
        title: 'Client Libraries',
        link: '/v3/docs/knowledgebase/integrate/client-libraries',
      },
      {
        title: 'Subkey',
        link: '/v3/docs/knowledgebase/runtime/subkey',
      },
      {
        title: 'Memory Profiling',
        link: '/v3/docs/knowledgebase/runtime/memory-profiling',
      },
      {
        title: 'Chain Specification',
        link: '/v3/docs/knowledgebase/runtime/chain-specs',
      },
    ],
  },
    {
      name: 'Advanced',
      item: [
      {
        title: 'Account Info',
        link: '/v3/docs/knowledgebase/advanced/account-info',
      },
      {
        title: 'Errors',
        link: '/v3/docs/knowledgebase/advanced/errors',
      },
      {
        title: 'SCALE Codec',
        link: '/v3/docs/knowledgebase/advanced/scale-codec',
      },
      {
        title: 'Consensus',
        link: '/v3/docs/knowledgebase/advanced/consensus',
      },
      {
        title: 'Block Import',
        link: '/v3/docs/knowledgebase/advanced/block-import',
      },
      {
        title: 'Executor',
        link: '/v3/docs/knowledgebase/advanced/executor',
      },
      {
        title: 'Cryptography',
        link: '/v3/docs/knowledgebase/advanced/cryptography',
      },
      {
        title: 'Storage',
        link: '/v3/docs/knowledgebase/advanced/storage',
      },
      {
        title: 'SS58 Address Format',
        link: '/v3/docs/knowledgebase/advanced/SS58',
      },
      {
        title: 'Hash Collections',
        link: '/v3/docs/knowledgebase/advanced/hash-collections',
      },
    ],
  },
]
