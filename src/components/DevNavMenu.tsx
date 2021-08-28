import { useIntl } from 'react-intl'

const DevNavMenu = {
  global: () => {
    const intl = useIntl()
    return [
      {
        section: `${intl.formatMessage({ id: 'docs-nav-knowledgebase' })}`,
        url: '/docs',
        external: false,
      },
      {
        section: `${intl.formatMessage({ id: 'docs-nav-tutorials' })}`,
        url: '/tutorials',
        external: false,
      },
      {
        section: `${intl.formatMessage({ id: 'docs-nav-htg' })}`,
        url: '/how-to-guides',
        external: false,
      },
      {
        section: `${intl.formatMessage({ id: 'docs-nav-rustdocs' })}`,
        url: '#',
        external: true,
      },
      {
        section: `${intl.formatMessage({ id: 'docs-nav-learningtracks' })}`,
        url: '/tracks',
        external: false,
      },
    ]
  },

  knowledgebase: () => {
    const intl = useIntl()
    return [
      {
        name: `${intl.formatMessage({ id: 'docs-menu-getting-started' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-overview' })}`,
            link: '/docs/v3/getting-started/overview',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-architecture' })}`,
            link: '/docs/v3/getting-started/architecture',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-installation' })}`,
            link: '/docs/v3/getting-started/installation',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-windows' })}`,
            link: '/docs/v3/getting-started/windows-users',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-glossary' })}`,
            link: '/docs/v3/getting-started/glossary',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-key-concepts' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-gs-runtime' })}`,
            link: '/docs/v3/concepts/runtime',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-extrinsics' })}`,
            link: '/docs/v3/concepts/extrinsics',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-account-abstractions',
            })}`,
            link: '/docs/v3/concepts/account-abstractions',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-transaction-pool',
            })}`,
            link: '/docs/v3/concepts/tx-pool',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-session-keys',
            })}`,
            link: '/docs/v3/concepts/session-keys',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-transaction-weight',
            })}`,
            link: '/docs/v3/concepts/weight',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-offchain-features',
            })}`,
            link: '/docs/v3/concepts/off-chain-features',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-runtime' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-pallets' })}`,
            link: '/docs/v3/runtime/pallets',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-frame' })}`,
            link: '/docs/v3/runtime/frame',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-macros',
            })}`,
            link: '/docs/v3/runtime/macros',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-metadata' })}`,
            link: '/docs/v3/runtime/metadata',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-storage' })}`,
            link: '/docs/v3/runtime/storage',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-origins',
            })}`,
            link: '/docs/v3/runtime/origins',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-execution' })}`,
            link: '/docs/v3/runtime/execution',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-events' })}`,
            link: '/docs/v3/runtime/events',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-errors' })}`,
            link: '/docs/v3/runtime/errors',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-weights-and-fees',
            })}`,
            link: '/docs/v3/runtime/weights-and-fees',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-benchmarking' })}`,
            link: '/docs/v3/runtime/benchmarking',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-debugging' })}`,
            link: '/docs/v3/runtime/debugging',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-testing' })}`,
            link: '/docs/v3/runtime/testing',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-randomness' })}`,
            link: '/docs/v3/runtime/randomness',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-upgrades' })}`,
            link: '/docs/v3/runtime/upgrades',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-smart-contracts' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-sc-overview' })}`,
            link: '/docs/v3/smart-contracts/overview',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-contracts-pallet',
            })}`,
            link: '/docs/v3/smart-contracts/contracts-pallet',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-evm-pallet',
            })}`,
            link: '/docs/v3/smart-contracts/evm-pallet',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-sc-faq' })}`,
            link: '/docs/v3/smart-contracts/faq',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-integrate' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-polkadot-js' })}`,
            link: '/docs/v3/toolchains/polkadot-js',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-client-libraries',
            })}`,
            link: '/docs/v3/toolchains/client-libraries',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-subkey' })}`,
            link: '/docs/v3/toolchains/subkey',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-memory-profiling',
            })}`,
            link: '/docs/v3/toolchains/memory-profiling',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-chain-specs' })}`,
            link: '/docs/v3/toolchains/chain-specs',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-advanced' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-account-info' })}`,
            link: '/docs/v3/advanced/account-info',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-scale-codec' })}`,
            link: '/docs/v3/advanced/scale-codec',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-consensus' })}`,
            link: '/docs/v3/advanced/consensus',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-block-import' })}`,
            link: '/docs/v3/advanced/block-import',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-executor' })}`,
            link: '/docs/v3/advanced/executor',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-cryptography' })}`,
            link: '/docs/v3/advanced/cryptography',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-storage' })}`,
            link: '/docs/v3/advanced/storage',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-ss58' })}`,
            link: '/docs/v3/advanced/ss58',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-hash-collections',
            })}`,
            link: '/docs/v3/advanced/hash-collections',
          },
        ],
      },
    ]
  },

  htg: () => {
    const intl = useIntl()
    return [
      // 1. Basics.
      {
        name: `${intl.formatMessage({ id: 'docs-nav-htg-basics' })}`,
        items: [
          {
            title: `${intl.formatMessage({
              id: 'htg-basics-pallet-integration',
            })}`,
            link: '/how-to-guides/v3/basics/pallet-integration',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-basics-instantiable-pallets',
            })}`,
            link: '/how-to-guides/v3/basics/instantiable-pallets',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-basics-configurable-constants',
            })}`,
            link: '/how-to-guides/v3/basics/configurable-constants',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-basics-genesis' })}`,
            link: '/how-to-guides/v3/basics/genesis',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-basics-helper-functions',
            })}`,
            link: '/how-to-guides/v3/basics/helper-functions',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-basics-mint-token' })}`,
            link: '/how-to-guides/v3/basics/mint-token',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-basics-weights' })}`,
            link: '/how-to-guides/v3/basics/weights',
          },
        ],
      },
      // 2. Pallet Design.
      {
        name: `${intl.formatMessage({ id: 'docs-nav-htg-pallet-design' })}`,
        items: [
          {
            title: `${intl.formatMessage({
              id: 'htg-pallet-design-add-contracts',
            })}`,
            link: '/how-to-guides/v3/pallet-design/contracts-pallet',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-pallet-design-lockable-currency',
            })}`,
            link: '/how-to-guides/v3/pallet-design/lockable-currency',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-pallet-design-randomness',
            })}`,
            link: '/how-to-guides/v3/pallet-design/randomness',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-pallet-design-crowdfund',
            })}`,
            link: '/how-to-guides/v3/pallet-design/crowdfund',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-pallet-design-storage-value',
            })}`,
            link: '/how-to-guides/v3/pallet-design/storage-value',
          },
        ],
      },
      // 3. Weights.
      {
        name: `${intl.formatMessage({ id: 'docs-nav-htg-weights' })}`,
        items: [
          {
            title: `${intl.formatMessage({
              id: 'htg-weights-calculate-fees',
            })}`,
            link: '/how-to-guides/v3/weights/calculate-fees',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-nav-htg-testing' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'htg-testing-basics' })}`,
            link: '/how-to-guides/v3/testing/basics',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-testing-transfer-function',
            })}`,
            link: '/how-to-guides/v3/testing/transfer-function',
          },
        ],
      },
      // 4. Testing.
      {
        name: `${intl.formatMessage({
          id: 'docs-nav-htg-storage-migrations',
        })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'htg-sm-nicks' })}`,
            link: '/how-to-guides/v3/storage-migrations/basics',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-sm-steps' })}`,
            link: '/how-to-guides/v3/storage-migrations/trigger-with-apps',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-sm-tests' })}`,
            link: '/how-to-guides/v3/storage-migrations/tests',
          },
        ],
      },
      // 5. Storage Migrations.
      {
        name: `${intl.formatMessage({ id: 'docs-nav-htg-consensus' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'htg-consensus-pow' })}`,
            link: '/how-to-guides/v3/consensus/pow',
          },
        ],
      },
      // 6. Consenus.
      {
        name: `${intl.formatMessage({ id: 'docs-nav-htg-tools' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'htg-tools' })}`,
            link: '/how-to-guides/v3/tools/try-runtime',
          },
        ],
      },
    ]
  },
}

DevNavMenu.tuts = {}

DevNavMenu.tuts.firstChain = {
  name: `Create Your First Substrate Chain`,
  items: [
    {
      title: `Introduction`,
      link: '/tutorials/v3/create-your-first-substrate-chain',
    },
    {
      title: `Set-up Your Computer`,
      link: '/tutorials/v3/create-your-first-substrate-chain/setup',
    },
    {
      title: `Background Information`,
      link: '/tutorials/v3/create-your-first-substrate-chain/background',
    },
    {
      title: `Interacting with Your Node`,
      link: '/tutorials/v3/create-your-first-substrate-chain/interact',
    },
  ],
}

DevNavMenu.tuts.poe = {
  name: `Proof of Existence`,
  items: [
    {
      title: `Introduction`,
      link: '/tutorials/v3/proof-of-existence',
    },
    {
      title: `Prepare to build a dApp`,
      link: '/tutorials/v3/proof-of-existence/prepare',
    },
    {
      title: `Building a Custom Pallet`,
      link: '/tutorials/v3/proof-of-existence/pallet',
    },
    {
      title: `Building a Custom Front End`,
      link: '/tutorials/v3/proof-of-existence/front-end',
    },
  ],
}

DevNavMenu.tuts.permissionedNetwork = {
  name: `Start a Permissioned Network`,
  items: [
    {
      title: `Introduction`,
      link: '/tutorials/v3/permissioned-network',
    },
    {
      title: `Add the node-authorization pallet`,
      link: '/tutorials/v3/permissioned-network/node-authorization-pallet',
    },
    {
      title: `Launch your permissioned network`,
      link: '/tutorials/v3/permissioned-network/launch',
    },
  ],
}

DevNavMenu.tuts.forklessUpgrades = {
  name: `Forkless Runtime Upgrades`,
  items: [
    {
      title: `Introduction`,
      link: '/tutorials/v3/forkless-upgrades',
    },
    {
      title: `Sudo Upgrade`,
      link: '/tutorials/v3/forkless-upgrades/sudo-upgrade',
    },
    {
      title: `Schedule an Upgrade`,
      link: '/tutorials/v3/forkless-upgrades/schedule-an-upgrade',
    },
  ],
}

DevNavMenu.tuts.privateNetwork = {
  name: `Start a Private Network`,
  items: [
    {
      title: `Introduction`,
      link: '/tutorials/v3/private-network',
    },
    {
      title: `Start a Chain with Alice and Bob`,
      link: '/tutorials/v3/private-network/alice-and-bob',
    },
    {
      title: `Generate Your Own Keys`,
      link: '/tutorials/v3/private-network/key-generation',
    },
    {
      title: `Create a Custom Chain Spec`,
      link: '/tutorials/v3/private-network/custom-chainspec',
    },
    {
      title: `Launch Your Private Network`,
      link: '/tutorials/v3/private-network/launch-custom-chain',
    },
  ],
}

DevNavMenu.tuts.nodeMetrics = {
  name: `Visualizing Node Metrics`,
  items: [
    {
      title: `Introduction`,
      link: '/tutorials/v3/node-metrics',
    },
    {
      title: `Using Grafana and Prometheus with Substrate`,
      link: '/tutorials/v3/node-metrics/p1',
    },
  ],
}

DevNavMenu.tuts.addPallet = {
  name: `Add a FRAME's Nicks Pallet to Your Runtime`,
  items: [
    {
      title: `Introduction`,
      link: '/tutorials/v3/add-a-pallet',
    },
    {
      title: `Import the Nicks Pallet`,
      link: '/tutorials/v3/add-a-pallet/import',
    },
    {
      title: `Configure the Nicks Pallet`,
      link: '/tutorials/v3/add-a-pallet/configure',
    },
    {
      title: `Interact with the Nicks Pallet`,
      link: '/tutorials/v3/add-a-pallet/interact',
    },
    {
      title: `Publish Your Own Pallet (optional)`,
      link: '/tutorials/v3/add-a-pallet/publish',
    },
  ],
}

DevNavMenu.tuts.contractsTutorial = {
  name: `Add the Contracts Pallet`,
  items: [
    {
      title: `Introduction`,
      link: '/tutorials/v3/add-contracts',
    },
    {
      title: `Node Set-up`,
      link: '/tutorials/v3/add-contracts/pt1',
    },
    {
      title: `Implement the Contracts pallet and its APIs`,
      link: '/tutorials/v3/add-contracts/pt2',
    },
  ],
}

export default DevNavMenu
