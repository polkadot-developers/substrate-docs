import { useIntl } from 'react-intl'
const DevNavMenu = {
  global: () => {
    const intl = useIntl()
    return [
      {
        section: `${intl.formatMessage({ id: 'docs-nav-knowledgebase' })}`,
        url: '/v3',
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
        url: '/rustdocs',
        external: true,
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
            link: '/v3/getting-started/overview',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-architecture' })}`,
            link: '/v3/getting-started/architecture',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-installation' })}`,
            link: '/v3/getting-started/installation',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-windows' })}`,
            link: '/v3/getting-started/windows-users',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-glossary' })}`,
            link: '/v3/getting-started/glossary',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-key-concepts' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-gs-runtime' })}`,
            link: '/v3/concepts/runtime',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-extrinsics' })}`,
            link: '/v3/concepts/extrinsics',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-account-abstractions',
            })}`,
            link: '/v3/concepts/account-abstractions',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-transaction-pool',
            })}`,
            link: '/v3/concepts/tx-pool',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-session-keys',
            })}`,
            link: '/v3/concepts/session-keys',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-transaction-weight',
            })}`,
            link: '/v3/concepts/weight',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-offchain-features',
            })}`,
            link: '/v3/concepts/off-chain-features',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-runtime' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-pallets' })}`,
            link: '/v3/runtime/pallets',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-frame' })}`,
            link: '/v3/runtime/frame',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-macros',
            })}`,
            link: '/v3/runtime/macros',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-metadata' })}`,
            link: '/v3/runtime/metadata',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-storage' })}`,
            link: '/v3/runtime/storage',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-origins',
            })}`,
            link: '/v3/runtime/origins',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-execution' })}`,
            link: '/v3/runtime/execution',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-events' })}`,
            link: '/v3/runtime/events',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-errors' })}`,
            link: '/v3/runtime/errors',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-weights-and-fees',
            })}`,
            link: '/v3/runtime/weights-and-fees',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-benchmarking' })}`,
            link: '/v3/runtime/benchmarking',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-debugging' })}`,
            link: '/v3/runtime/debugging',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-testing' })}`,
            link: '/v3/runtime/testing',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-randomness' })}`,
            link: '/v3/runtime/randomness',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-upgrades' })}`,
            link: '/v3/runtime/upgrades',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-smart-contracts' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-sc-overview' })}`,
            link: '/v3/smart-contracts/overview',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-contracts-pallet',
            })}`,
            link: '/v3/smart-contracts/contracts-pallet',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-evm-pallet',
            })}`,
            link: '/v3/smart-contracts/evm-pallet',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-sc-faq' })}`,
            link: '/v3/smart-contracts/faq',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-integrate' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-polkadot-js' })}`,
            link: '/v3/toolchains/polkadot-js',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-client-libraries',
            })}`,
            link: '/v3/toolchains/client-libraries',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-subkey' })}`,
            link: '/v3/toolchains/subkey',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-memory-profiling',
            })}`,
            link: '/v3/toolchains/memory-profiling',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-chain-specs' })}`,
            link: '/v3/toolchains/chain-specs',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-advanced' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-account-info' })}`,
            link: '/v3/advanced/account-info',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-scale-codec' })}`,
            link: '/v3/advanced/scale-codec',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-consensus' })}`,
            link: '/v3/advanced/consensus',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-block-import' })}`,
            link: '/v3/advanced/block-import',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-executor' })}`,
            link: '/v3/advanced/executor',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-cryptography' })}`,
            link: '/v3/advanced/cryptography',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-storage' })}`,
            link: '/v3/advanced/storage',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-ss58' })}`,
            link: '/v3/advanced/ss58',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-hash-collections',
            })}`,
            link: '/v3/advanced/hash-collections',
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
      // 4. Testing.
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
      // 5. Storage Migrations.
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
      // 6. Consensus.
      {
        name: `${intl.formatMessage({ id: 'docs-nav-htg-consensus' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'htg-consensus-pow' })}`,
            link: '/how-to-guides/v3/consensus/pow',
          },
        ],
      },
      // 7. Parachains.
      {
        name: `${intl.formatMessage({
          id: 'docs-nav-htg-parachains',
        })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'htg-parachains-upgrade' })}`,
            link: '/how-to-guides/v3/parachains/preparing-an-upgrade',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-parachains-setup' })}`,
            link: '/how-to-guides/v3/parachains/setup',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-parachains-register' })}`,
            link: '/how-to-guides/v3/parachains/register',
          },

          {
            title: `${intl.formatMessage({ id: 'htg-parachains-reserve' })}`,
            link: '/how-to-guides/v3/parachains/reserve-id',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-parachains-collators' })}`,
            link: '/how-to-guides/v3/parachains/start-collator-node',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-parachains-rococo' })}`,
            link: '/how-to-guides/v3/parachains/rococo',
          },
        ],
      },
      // 8. Tools
      {
        name: `${intl.formatMessage({
          id: 'docs-nav-htg-tools',
        })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'htg-tools-try-runtime' })}`,
            link: '/how-to-guides/v3/tools/try-runtime',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-tools-txwrapper' })}`,
            link: '/how-to-guides/v3/tools/txwrapper',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-tools-sidecar' })}`,
            link: '/how-to-guides/v3/tools/sidecar',
          },
        ],
      },
    ]
  },
}

DevNavMenu.tuts = {}

DevNavMenu.tuts.firstChain = [
  {
    name: `Create Your First Substrate Chain`,
    items: [
      {
        title: `Background`,
        link: '/tutorials/v3/create-your-first-substrate-chain#what-is-a-blockchain-node',
      },
      {
        title: `Set-up Your Computer`,
        link: '/tutorials/v3/create-your-first-substrate-chain/#install-rust-and-the-rust-toolchain',
      },
      {
        title: `Using the Substrate Node Template`,
        link: '/tutorials/v3/create-your-first-substrate-chain/#prepare-a-substrate-node-using-the-node-template',
      },
      {
        title: `Interacting with Your Node`,
        link: '#start-the-front-end-template',
      },
    ],
  },
]

DevNavMenu.tuts.poe = [
  {
    name: `Build a Proof of Existence Blockchain`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/proof-of-existence/#introduction',
      },
      {
        title: `Preparation`,
        link: '/tutorials/v3/proof-of-existence#prepare-to-build-a-dapp',
      },
      {
        title: `Build a Custom Pallet`,
        link: '/tutorials/v3/proof-of-existence#building-a-custom-pallet',
      },
      {
        title: `Build a Custom Front-end`,
        link: '/tutorials/v3/proof-of-existence#building-a-custom-front-end',
      },
    ],
  },
]

DevNavMenu.tuts.permissionedNetwork = [
  {
    name: `Start a Permissioned Network`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/permissioned-network#introduction',
      },
      {
        title: `Add the node-authorization pallet`,
        link: '/tutorials/v3/permissioned-network#add-node-authorization-pallet',
      },
      {
        title: `Launch your permissioned network`,
        link: '/tutorials/v3/permissioned-network#launch-our-permissioned-network',
      },
    ],
  },
]

DevNavMenu.tuts.forklessUpgrades = [
  {
    name: `Initiate a Forkless Runtime Upgrade`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/forkless-upgrades#introduction',
      },
      {
        title: `Sudo Upgrade`,
        link: '/tutorials/v3/forkless-upgrades#sudo-upgrade',
      },
      {
        title: `Schedule an Upgrade`,
        link: '/tutorials/v3/forkless-upgrades#schedule-an-upgrade',
      },
    ],
  },
]

DevNavMenu.tuts.privateNetwork = [
  {
    name: `Start a Private Network`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/private-network#ntroduction',
      },
      {
        title: `Alice and Bob Start Blockchain`,
        link: '/tutorials/v3/private-network#alice-and-bob-start-blockchain',
      },
      {
        title: `Generate Your Own Keys`,
        link: '/tutorials/v3/private-network#generate-your-own-keys',
      },
      {
        title: `Create a Custom Chain Spec`,
        link: '/tutorials/v3/private-network#create-a-custom-chain-spec',
      },
      {
        title: `Launch Your Private Network`,
        link: '/tutorials/v3/private-network#launch-your-private-network',
      },
    ],
  },
]

DevNavMenu.tuts.nodeMetrics = [
  {
    name: `Visualizing Node Metrics`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/node-metrics#introduction',
      },
      {
        title: `Install Prometheus and Grafana`,
        link: '/tutorials/v3/node-metrics#install-prometheus-and-grafana',
      },
      {
        title: `Start a Substrate Template Node`,
        link: '/tutorials/v3/node-metrics#start-a-substrate-template-node',
      },
      {
        title: `Visualizing Prometheus Metrics with Grafana`,
        link: '/tutorials/v3/node-metrics#visualizing-prometheus-metrics-with-grafana',
      },
    ],
  },
]

DevNavMenu.tuts.addPallet = [
  {
    name: `Add a FRAME's Nicks Pallet to Your Runtime`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/add-a-pallet#introduction',
      },
      {
        title: `Import the Nicks Pallet`,
        link: '/tutorials/v3/add-a-pallet#import-the-nicks-pallet',
      },
      {
        title: `Configure the Nicks Pallet`,
        link: '/tutorials/v3/add-a-pallet#configure-the-nicks-pallet',
      },
      {
        title: `Interact with the Nicks Pallet`,
        link: '/tutorials/v3/add-a-pallet#interact-with-the-nicks-pallet',
      },
      {
        title: `Publish Your Own Pallet`,
        link: '/tutorials/v3/add-a-pallet#publish-your-own-pallet',
      },
    ],
  },
]

DevNavMenu.tuts.inkWorkshop = [
  {
  name: `ink! Contracts Workshop`,
  items: [
    {
      title: `Getting Started`,
      link: '/tutorials/v3/ink-workshop/pt1',
    },
    {
      title: `Develop a Smart Contract`,
      link: '/tutorials/v3/ink-workshop/pt2',
    },
    {
      title: `Build an ERC20 Token Contract`,
      link: '/tutorials/v3/ink-workshop/pt3',
    },
  ],
},
]

DevNavMenu.tuts.cumulusWorkshop = [
  {
    name: `Substrate Cumulus Workshop`,
    items: [
      {
        title: `Getting Started`,
        link: '/tutorials/v3/cumulus-workshop/pt1',
      },
      {
        title: `Connecting to a Relay Chain`,
        link: '/tutorials/v3/cumulus-workshop/pt2',
      },
      {
        title: `Launch a Development Environment`,
        link: '/tutorials/v3/cumulus-workshop/pt3',
      },
    ],
  },
]

export default DevNavMenu
