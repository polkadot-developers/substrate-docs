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
            title: `${intl.formatMessage({ id: 'docs-menu-execution' })}`,
            link: '/v3/concepts/execution',
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
            title: `${intl.formatMessage({ id: 'docs-menu-events' })}`,
            link: '/v3/runtime/events-and-errors',
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
            title: `${intl.formatMessage({ id: 'docs-menu-chain-specs' })}`,
            link: '/v3/runtime/chain-specs',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-upgrades' })}`,
            link: '/v3/runtime/upgrades',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-coupling' })}`,
            link: '/v3/runtime/pallet-coupling',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-rpcs' })}`,
            link: '/v3/runtime/custom-rpcs',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-smart-contracts' })}`,
            link: '/v3/runtime/smart-contracts',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-integration' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-polkadot-js' })}`,
            link: '/v3/integration/polkadot-js',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-client-libraries',
            })}`,
            link: '/v3/integration/client-libraries',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-substrate-connect',
            })}`,
            link: '/v3/integration/substrate-connect',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-tools' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-tools-landing' })}`,
            link: '/v3/tools',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-subkey' })}`,
            link: '/v3/tools/subkey',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-memory-profiling',
            })}`,
            link: '/v3/tools/memory-profiling',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-try-runtime' })}`,
            link: '/v3/tools/try-runtime',
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
      {
        name: `${intl.formatMessage({ id: 'docs-menu-contribute' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-style-guide' })}`,
            link: '/v3/contribute/style-guide',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-writing-style' })}`,
            link: '/v3/contribute/writing',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-bounties' })}`,
            link: '/v3/contribute/bounties',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-templates' })}`,
            link: '/v3/contribute/templates',
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
          {
            title: `${intl.formatMessage({
              id: 'htg-tightly-coupling-pallets',
            })}`,
            link: '/how-to-guides/v3/pallet-design/tight-coupling',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-loosely-coupling-pallets',
            })}`,
            link: '/how-to-guides/v3/pallet-design/loose-coupling',
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
          {
            title: `${intl.formatMessage({ id: 'htg-consensus-hybrid' })}`,
            link: '/how-to-guides/v3/consensus/hybrid-pos-pow',
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

const DevNavMenuTuts = new Map()
DevNavMenuTuts.set('firstChain', [
  {
    name: `Create Your First Substrate Chain`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/create-your-first-substrate-chain',
      },
      {
        title: `Background`,
        link: '#what-is-a-blockchain-node',
      },
      {
        title: `Set-up Your Computer`,
        link: '#install-rust-and-the-rust-toolchain',
      },
      {
        title: `Using the Substrate Node Template`,
        link: '#prepare-a-substrate-node-using-the-node-template',
      },
      {
        title: `Interacting with Your Node`,
        link: '#start-the-front-end-template',
      },
    ],
  },
])
DevNavMenuTuts.set('poe', [
  {
    name: `Build a Proof of Existence Blockchain`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/proof-of-existence',
      },
      {
        title: `Preparation`,
        link: '#prepare-to-build-a-dapp',
      },
      {
        title: `Build a Custom Pallet`,
        link: '#building-a-custom-pallet',
      },
      {
        title: `Build a Custom Front-end`,
        link: '#building-a-custom-front-end',
      },
    ],
  },
])
DevNavMenuTuts.set('permissionedNetwork', [
  {
    name: `Start a Permissioned Network`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/permissioned-network',
      },
      {
        title: `Add the node-authorization pallet`,
        link: '#add-node-authorization-pallet',
      },
      {
        title: `Launch your permissioned network`,
        link: '#launch-our-permissioned-network',
      },
    ],
  },
])
DevNavMenuTuts.set('forklessUpgrades', [
  {
    name: `Initiate a Forkless Runtime Upgrade`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/forkless-upgrades',
      },
      {
        title: `Sudo Upgrade`,
        link: '#sudo-upgrade',
      },
      {
        title: `Schedule an Upgrade`,
        link: '#schedule-an-upgrade',
      },
    ],
  },
])
DevNavMenuTuts.set('privateNetwork', [
  {
    name: `Start a Private Network`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/private-network',
      },
      {
        title: `Alice and Bob Start Blockchain`,
        link: '#alice-and-bob-start-blockchain',
      },
      {
        title: `Generate Your Own Keys`,
        link: '#generate-your-own-keys',
      },
      {
        title: `Create a Custom Chain Spec`,
        link: '#create-a-custom-chain-spec',
      },
      {
        title: `Launch Your Private Network`,
        link: '#launch-your-private-network',
      },
    ],
  },
])
DevNavMenuTuts.set('nodeMetrics', [
  {
    name: `Visualizing Node Metrics`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/node-metrics',
      },
      {
        title: `Install Prometheus and Grafana`,
        link: '#install-prometheus-and-grafana',
      },
      {
        title: `Start a Substrate Template Node`,
        link: '#start-a-substrate-template-node',
      },
      {
        title: `Visualizing Prometheus Metrics with Grafana`,
        link: '#visualizing-prometheus-metrics-with-grafana',
      },
    ],
  },
])
DevNavMenuTuts.set('addPallet', [
  {
    name: `Add the Nicks Pallet to your Runtime`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/add-a-pallet',
      },
      {
        title: `Import the Nicks Pallet`,
        link: '#import-the-nicks-pallet',
      },
      {
        title: `Configure the Nicks Pallet`,
        link: '#configure-the-nicks-pallet',
      },
      {
        title: `Interact with the Nicks Pallet`,
        link: '#interact-with-the-nicks-pallet',
      },
      {
        title: `Publish Your Own Pallet`,
        link: '#publish-your-own-pallet',
      },
    ],
  },
])
DevNavMenuTuts.set('inkWorkshop', [
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
])
DevNavMenuTuts.set('cumulusTutorial', [
  {
    name: `Cumulus Tutorial`,
    items: [
      {
        title: `Start a Relay Chain`,
        link: '/tutorials/v3/cumulus/start-relay',
      },
      {
        title: `Connect to a Parachain`,
        link: '/tutorials/v3/cumulus/connect-parachain',
      },
      {
        title: `Launch a Parachain Testnet`,
        link: '/tutorials/v3/cumulus/polkadot-launch',
      },
      //   {
      //     title: `Register on Rococo`,
      //     link: '/tutorials/v3/cumulus/rococo',
      //   },
    ],
  },
])
DevNavMenuTuts.set('frontierWorkshop', [
  {
    name: `Frontier Workshop`,
    items: [
      {
        title: `Getting Started`,
        link: '/tutorials/v3/frontier',
      },
      {
        title: `Frontier Template`,
        link: '#frontier-template',
      },
      {
        title: `Architecture`,
        link: '#architecture',
      },
      {
        title: `ERC20 Contract Deployment`,
        link: '#erc20-contract-deployment',
      },
    ],
  },
])
DevNavMenuTuts.set('kittiesWorkshop', [
  {
    name: `Build the Substrate Kitties Chain`,
    items: [
      {
        title: 'Introduction',
        link: '/tutorials/v3/kitties/pt1',
      },
      {
        title: 'Tutorial Objectives',
        link: '/tutorials/v3/kitties/pt1#tutorial-objectives',
      },
      {
        title: 'Basic Set-up',
        link: '/tutorials/v3/kitties/pt1#basic-set-up',
      },
      {
        title: `Uniqueness, Custom Types, and Storage Maps`,
        link: '/tutorials/v3/kitties/pt1#uniqueness-custom-types-and-storage-maps',
      },
      {
        title: `Dispatchables, Events, and Errors`,
        link: '/tutorials/v3/kitties/pt1#dispatchables-events-and-errors',
      },
      {
        title: `Interacting with Your Kitties`,
        link: '/tutorials/v3/kitties/pt1#interacting-with-your-kitties',
      },
    ],
  },
  {
    name: `Create a Front-end for the Kitties Chain`,
    items: [
      {
        title: `Overview`,
        link: '/tutorials/v3/kitties/pt2',
      },
      {
        title: `Getting Started`,
        link: '/tutorials/v3/kitties/pt2#getting-started',
      },
      {
        title: `Creating Custom Components`,
        link: '/tutorials/v3/kitties/pt2#creating-custom-components',
      },
    ],
  },
])
export { DevNavMenu, DevNavMenuTuts }
