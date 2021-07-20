import { useIntl } from 'react-intl'

const DevNavMenu = {
  global: () => {
    const intl = useIntl()
    return [
      {
        section: `${intl.formatMessage({ id: 'docs-nav-knowledgebase' })}`,
        url: '/v3/docs/getting-started/overview',
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
        url: '/learning-tracks',
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
            link: '/v3/docs/getting-started/overview',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-architecture' })}`,
            link: '/v3/docs/getting-started/architecture',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-installation' })}`,
            link: '/v3/docs/getting-started/installation',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-windows' })}`,
            link: '/v3/docs/getting-started/windows-users',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-glossary' })}`,
            link: '/v3/docs/getting-started/glossary',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-key-concepts' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-gs-runtime' })}`,
            link: '/v3/docs/concepts/runtime',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-extrinsics' })}`,
            link: '/v3/docs/concepts/extrinsics',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-account-abstractions',
            })}`,
            link: '/v3/docs/concepts/account-abstractions',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-transaction-pool',
            })}`,
            link: '/v3/docs/concepts/tx-pool',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-session-keys',
            })}`,
            link: '/v3/docs/concepts/session-keys',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-transaction-weight',
            })}`,
            link: '/v3/docs/concepts/weight',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-offchain-features',
            })}`,
            link: '/v3/docs/concepts/off-chain-features',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-runtime' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-pallets' })}`,
            link: '/v3/docs/runtime/pallets',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-frame' })}`,
            link: '/v3/docs/runtime/frame',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-macros',
            })}`,
            link: '/v3/docs/runtime/macros',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-metadata' })}`,
            link: '/v3/docs/runtime/metadata',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-storage' })}`,
            link: '/v3/docs/runtime/storage',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-origins',
            })}`,
            link: '/v3/docs/runtime/origins',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-execution' })}`,
            link: '/v3/docs/runtime/execution',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-events' })}`,
            link: '/v3/docs/runtime/events',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-errors' })}`,
            link: '/v3/docs/runtime/errors',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-weights-and-fees',
            })}`,
            link: '/v3/docs/runtime/weights-and-fees',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-benchmarking' })}`,
            link: '/v3/docs/runtime/benchmarking',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-debugging' })}`,
            link: '/v3/docs/runtime/debugging',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-testing' })}`,
            link: '/v3/docs/runtime/testing',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-randomness' })}`,
            link: '/v3/docs/runtime/randomness',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-upgrades' })}`,
            link: '/v3/docs/runtime/upgrades',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-smart-contracts' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-sc-overview' })}`,
            link: '/v3/docs/smart-contracts/overview',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-contracts-pallet',
            })}`,
            link: '/v3/docs/smart-contracts/contracts-pallet',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-evm-pallet',
            })}`,
            link: '/v3/docs/smart-contracts/evm-pallet',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-sc-faq' })}`,
            link: '/v3/docs/smart-contracts/faq',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-integrate' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-polkadot-js' })}`,
            link: '/v3/docs/toolchains/polkadot-js',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-client-libraries',
            })}`,
            link: '/v3/docs/toolchains/client-libraries',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-subkey' })}`,
            link: '/v3/docs/toolchains/subkey',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-memory-profiling',
            })}`,
            link: '/v3/docs/toolchains/memory-profiling',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-chain-specs' })}`,
            link: '/v3/docs/toolchains/chain-specs',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-menu-advanced' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'docs-menu-account-info' })}`,
            link: '/v3/docs/advanced/account-info',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-scale-codec' })}`,
            link: '/v3/docs/advanced/scale-codec',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-consensus' })}`,
            link: '/v3/docs/advanced/consensus',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-block-import' })}`,
            link: '/v3/docs/advanced/block-import',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-executor' })}`,
            link: '/v3/docs/advanced/executor',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-cryptography' })}`,
            link: '/v3/docs/advanced/cryptography',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-storage' })}`,
            link: '/v3/docs/advanced/storage',
          },
          {
            title: `${intl.formatMessage({ id: 'docs-menu-ss58' })}`,
            link: '/v3/docs/advanced/ss58',
          },
          {
            title: `${intl.formatMessage({
              id: 'docs-menu-hash-collections',
            })}`,
            link: '/v3/docs/advanced/hash-collections',
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
            link: '/v3/how-to-guides/basics/pallet-integration',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-basics-instantiable-pallets',
            })}`,
            link: '/v3/how-to-guides/basics/instantiable-pallets',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-basics-configurable-constants',
            })}`,
            link: '/v3/how-to-guides/basics/configurable-constants',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-basics-genesis' })}`,
            link: '/v3/how-to-guides/basics/genesis',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-basics-helper-functions',
            })}`,
            link: '/v3/how-to-guides/basics/helper-functions',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-basics-mint-token' })}`,
            link: '/v3/how-to-guides/basics/mint-token',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-basics-weights' })}`,
            link: '/v3/how-to-guides/basics/weights',
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
            link: '/v3/how-to-guides/pallet-design/contracts-pallet',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-pallet-design-lockable-currency',
            })}`,
            link: '/v3/how-to-guides/pallet-design/lockable-currency',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-pallet-design-randomness',
            })}`,
            link: '/v3/how-to-guides/pallet-design/randomness',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-pallet-design-crowdfund',
            })}`,
            link: '/v3/how-to-guides/pallet-design/crowdfund',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-pallet-design-storage-value',
            })}`,
            link: '/v3/how-to-guides/pallet-design/storage-value',
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
            link: '/v3/how-to-guides/weights/calculate-fees',
          },
        ],
      },
      {
        name: `${intl.formatMessage({ id: 'docs-nav-htg-testing' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'htg-testing-basics' })}`,
            link: '/v3/how-to-guides/testing/basics',
          },
          {
            title: `${intl.formatMessage({
              id: 'htg-testing-transfer-function',
            })}`,
            link: '/v3/how-to-guides/testing/transfer-function',
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
            link: '/v3/how-to-guides/storage-migrations/basics',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-sm-steps' })}`,
            link: '/v3/how-to-guides/storage-migrations/trigger-with-apps',
          },
          {
            title: `${intl.formatMessage({ id: 'htg-sm-tests' })}`,
            link: '/v3/how-to-guides/storage-migrations/tests',
          },
        ],
      },
      // 5. Storage Migrations.
      {
        name: `${intl.formatMessage({ id: 'docs-nav-htg-consensus' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'htg-consensus-pow' })}`,
            link: '/v3/how-to-guides/consensus/pow',
          },
        ],
      },
      // 6. Consenus.
      {
        name: `${intl.formatMessage({ id: 'docs-nav-htg-tools' })}`,
        items: [
          {
            title: `${intl.formatMessage({ id: 'htg-tools' })}`,
            link: '/v3/how-to-guides/tools/try-runtime',
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
      link: '/v3/tutorials/create-your-first-substrate-chain',
    },
    {
      title: `Set Up Your Computer`,
      link: '/v3/tutorials/create-your-first-substrate-chain/setup',
    },
    {
      title: `Background Information`,
      link: '/v3/tutorials/create-your-first-substrate-chain/background',
    },
    {
      title: `Interacting with Your Node`,
      link: '/v3/tutorials/create-your-first-substrate-chain/interact',
    },
  ],
}

DevNavMenu.tuts.poe = {
  name: `Proof of Existence`,
  items: [
    {
      title: `Overview`,
      link: '/v3/tutorials/proof-of-existence',
    },
    {
      title: `Prepare to build a dApp`,
      link: '/v3/tutorials/proof-of-existence/prepare',
    },
    {
      title: `Building a Custom Pallet`,
      link: '/v3/tutorials/proof-of-existence/pallet',
    },
    {
      title: `Building a Custom Front End`,
      link: '/v3/tutorials/proof-of-existence/front-end',
    },
  ],
}

DevNavMenu.tuts.permissionedNetwork = {
  name: `Start a Permissioned Network`,
  items: [
    {
      title: `Overview`,
      link: '/v3/tutorials/permissioned-network',
    },
    {
      title: `Add node-authorization pallet`,
      link: '/v3/tutorials/permissioned-network/node-authorization-pallet',
    },
    {
      title: `Launch our Permissioned Network`,
      link: '/v3/tutorials/permissioned-network/launch',
    },
  ],
}

DevNavMenu.tuts.forklessUpgrade = {
  name: `Forkless Runtime Upgrades`,
  items: [
    {
      title: `Overview`,
      link: '/v3/tutorials/forkless-upgrades',
    },
    {
      title: `Sudo Upgrade`,
      link: '/v3/tutorials/forkless-upgrades/sudo-upgrade',
    },
    {
      title: `Schedule an Upgrade`,
      link: '/v3/tutorials/forkless-upgrades/schedule-an-upgrade',
    },
  ],
}

DevNavMenu.tuts.privateNetwork = {
  name: `Start a Private Network`,
  items: [
    {
      title: `Overview`,
      link: '/v3/tutorials/private-network',
    },
    {
      title: `Alice and Bob Start Blockchain`,
      link: '/v3/tutorials/private-network/alice-and-bob',
    },
    {
      title: `Generate Your Own Keys`,
      link: '/v3/tutorials/private-network/key-generation',
    },
    {
      title: `Create a Custom Chain Spec`,
      link: '/v3/tutorials/private-network/custom-chainspec',
    },
    {
      title: `Creating Your Private Network`,
      link: '/v3/tutorials/private-network/launch-custom-chain',
    },
  ],
}

DevNavMenu.tuts.nodeMetrics = {
  name: `Visualizing Node Metrics`,
  items: [
    {
      title: `Overview`,
      link: '/v3/tutorials/node-metrics',
    },
  ],
}

DevNavMenu.tuts.addPallet = {
  name: `Add a Pallet in Runtime`,
  items: [
    {
      title: `Overview`,
      link: '/v3/tutorials/add-a-pallet',
    },
    {
      title: `Import the Nicks Pallet`,
      link: '/v3/tutorials/add-a-pallet/import',
    },
    {
      title: `Configure the Nicks Pallet`,
      link: '/v3/tutorials/add-a-pallet/configure',
    },
    {
      title: `Interact with the Nicks Pallet`,
      link: '/v3/tutorials/add-a-pallet/interact',
    },
    {
      title: `Publish Your Own Pallet`,
      link: '/v3/tutorials/add-a-pallet/publish',
    },
  ],
}

DevNavMenu.tuts.inkWorkshop = {
  name: `Ink! Contracts Workshop`,
  items: [
    {
      title: `Part I: Introduction`,
      link: '/v3/tutorials/ink-workshop/pt1',
    },
    {
      title: `Setup`,
      link: '/v3/tutorials/ink-workshop/pt1/setup',
    },
    {
      title: `Creating An Ink Project`,
      link: '/v3/tutorials/ink-workshop/pt1/creating-an-ink-project',
    },
    {
      title: `Building Your Contract`,
      link: '/v3/tutorials/ink-workshop/pt1/building-your-contract',
    }, 
    {
      title: `Running a Substrate Canvas Node`,
      link: '/v3/tutorials/ink-workshop/pt1/running-a-substrate-node',
    }, 
    {
      title: `Deploying Your Contract`,
      link: '/v3/tutorials/ink-workshop/pt1/deploying-your-contract',
    }, 
    {
      title: `Calling Your Contract`,
      link: '/v3/tutorials/ink-workshop/pt1/calling-your-contract',
    }, 
    {
      title: `Troubleshooting`,
      link: '/v3/tutorials/ink-workshop/pt1/troubleshooting',
    }, 
    {
      title: `Part II: Introduction`,
      link: '/v3/tutorials/ink-workshop/pt2',
    }, 
    {
      title: `Contract Template`,
      link: '/v3/tutorials/ink-workshop/pt2/contract-template',
    }, 
    {
      title: `Storing a Value`,
      link: '/v3/tutorials/ink-workshop/pt2/storing-a-value',
    }, 
    {
      title: `Getting a Value`,
      link: '/v3/tutorials/ink-workshop/pt2/getting-a-value',
    }, 
    {
      title: `Incrementing the Value`,
      link: '/v3/tutorials/ink-workshop/pt2/incrementing-the-value',
    }, 
    {
      title: `Storing a Mapping`,
      link: '/v3/tutorials/ink-workshop/pt2/storing-a-mapping',
    }, 
    {
      title: `Updating My Value`,
      link: '/v3/tutorials/ink-workshop/pt2/update-my-value',
    }, 
    {
      title: `Part III: Introduction`,
      link: '/v3/tutorials/ink-workshop/pt3',
    }, 
    {
      title: `Creating the ERC20 Template`,
      link: '/v3/tutorials/ink-workshop/pt3/creating-an-erc20',
    }, 
    {
      title: `Tansferring Tokens`,
      link: '/v3/tutorials/ink-workshop/pt3/tansferring-tokens',
    }, 
    {
      title: `Creating Events`,
      link: '/v3/tutorials/ink-workshop/pt3/creating-events',
    }, 
    {
      title: `Supporting Approvals and Transfer From`,
      link: '/v3/tutorials/ink-workshop/pt3/approvals',
    }, 
    {
      title: `Testing Our Contract`,
      link: '/v3/tutorials/ink-workshop/pt3/testing',
    }, 
  ],
}

export default DevNavMenu
