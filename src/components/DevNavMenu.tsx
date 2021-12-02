const DevNavMenu = {
  global: () => {
    return [
      {
        section: `Docs`,
        url: '/v3/',
        external: false,
      },
      {
        section: 'Tutorials',
        url: '/tutorials/',
        external: false,
      },
      {
        section: 'How-to-Guides',
        url: '/how-to-guides/',
        external: false,
      },
      {
        section: 'Rust Docs',
        url: '/rustdocs/',
        external: false,
      },
    ]
  },
  knowledgebase: () => {
    return [
      {
        name: 'Getting Started',
        items: [
          {
            title: 'Overview',
            link: '/v3/getting-started/overview/',
          },
          {
            title: 'Architecture',
            link: '/v3/getting-started/architecture/',
          },
          {
            title: 'Installation',
            link: '/v3/getting-started/installation/',
          },
          {
            title: 'Getting Started on Windows',
            link: '/v3/getting-started/windows-users/',
          },
          {
            title: 'Glossary',
            link: '/v3/getting-started/glossary/',
          },
        ],
      },
      {
        name: 'Key Concepts',
        items: [
          {
            title: 'Runtime',
            link: '/v3/concepts/runtime/',
          },
          {
            title: 'Extrinsics',
            link: '/v3/concepts/extrinsics/',
          },
          {
            title: 'Account Abstractions',
            link: '/v3/concepts/account-abstractions/',
          },
          {
            title: 'Transaction Pool',
            link: '/v3/concepts/tx-pool/',
          },
          {
            title: 'Session Keys',
            link: '/v3/concepts/session-keys/',
          },
          {
            title: 'Transaction Weight',
            link: '/v3/concepts/weight/',
          },
          {
            title: 'Execution',
            link: '/v3/concepts/execution/',
          },
          {
            title: 'Off-Chain Features',
            link: '/v3/concepts/off-chain-features/',
          },
        ],
      },
      {
        name: 'Runtime Development',
        items: [
          {
            title: 'FRAME',
            link: '/v3/runtime/frame/',
          },
          {
            title: 'Macros',
            link: '/v3/runtime/macros/',
          },
          {
            title: 'Metadata',
            link: '/v3/runtime/metadata/',
          },
          {
            title: 'Storage',
            link: '/v3/runtime/storage/',
          },
          {
            title: 'Origins',
            link: '/v3/runtime/origins/',
          },
          {
            title: 'Events and Errors',
            link: '/v3/runtime/events-and-errors/',
          },
          {
            title: 'Weights and Fees',
            link: '/v3/runtime/weights-and-fees/',
          },
          {
            title: 'Benchmarking',
            link: '/v3/runtime/benchmarking/',
          },
          {
            title: 'Debugging',
            link: '/v3/runtime/debugging/',
          },
          {
            title: 'Testing',
            link: '/v3/runtime/testing/',
          },
          {
            title: 'Randomness',
            link: '/v3/runtime/randomness/',
          },
          {
            title: 'Chain Specification',
            link: '/v3/runtime/chain-specs/',
          },
          {
            title: 'Upgrades',
            link: '/v3/runtime/upgrades/',
          },
          {
            title: 'Pallet Coupling',
            link: '/v3/runtime/pallet-coupling/',
          },
          {
            title: 'Custom RPCs',
            link: '/v3/runtime/custom-rpcs/',
          },
          {
            title: 'Smart Contract Toolkits',
            link: '/v3/runtime/smart-contracts/',
          },
        ],
      },
      {
        name: 'Integration',
        items: [
          {
            title: 'Polkadot-JS',
            link: '/v3/integration/polkadot-js/',
          },
          {
            title: 'Client Libraries',
            link: '/v3/integration/client-libraries/',
          },
          {
            title: 'Substrate Connect',
            link: '/v3/integration/substrate-connect/',
          },
        ],
      },
      {
        name: 'Tools',
        items: [
          {
            title: 'Explore Tools',
            link: '/v3/tools/',
          },
          {
            title: 'Subkey',
            link: '/v3/tools/subkey/',
          },
          {
            title: 'Memory Profiling',
            link: '/v3/tools/memory-profiling/',
          },
          {
            title: 'Try Runtime',
            link: '/v3/tools/try-runtime/',
          },
        ],
      },
      {
        name: 'Advanced',
        items: [
          {
            title: 'Account Info',
            link: '/v3/advanced/account-info/',
          },
          {
            title: 'SCALE Codec',
            link: '/v3/advanced/scale-codec/',
          },
          {
            title: 'Consensus',
            link: '/v3/advanced/consensus/',
          },
          {
            title: 'Block Import',
            link: '/v3/advanced/block-import/',
          },
          {
            title: 'Executor',
            link: '/v3/advanced/executor/',
          },
          {
            title: 'Cryptography',
            link: '/v3/advanced/cryptography/',
          },
          {
            title: 'Storage',
            link: '/v3/advanced/storage/',
          },
          {
            title: 'SS58 Address Format',
            link: '/v3/advanced/ss58/',
          },
          {
            title: 'Hash Collections',
            link: '/v3/advanced/hash-collections/',
          },
        ],
      },
      {
        name: 'Contribute',
        items: [
          {
            title: 'Style Guide',
            link: '/v3/contribute/style-guide/',
          },
          {
            title: 'Writing',
            link: '/v3/contribute/writing/',
          },
          {
            title: 'Bounties',
            link: '/v3/contribute/bounties/',
          },
          {
            title: 'Templates',
            link: '/v3/contribute/templates/',
          },
        ],
      },
    ]
  },
  htg: () => {
    return [
      // 1. Basics.
      {
        name: 'Basics',
        items: [
          {
            title: 'Pallet Integration',
            link: '/how-to-guides/v3/basics/pallet-integration/',
          },
          {
            title: 'Instantiable Pallets',
            link: '/how-to-guides/v3/basics/instantiable-pallets/',
          },
          {
            title: 'Configurable Constants',
            link: '/how-to-guides/v3/basics/configurable-constants/',
          },
          {
            title: 'Genesis Configuration',
            link: '/how-to-guides/v3/basics/genesis/',
          },
          {
            title: 'Helper Functions',
            link: '/how-to-guides/v3/basics/helper-functions/',
          },
          {
            title: 'Primitive Token Mint',
            link: '/how-to-guides/v3/basics/mint-token/',
          },
          {
            title: 'Calculating Transaction Weights',
            link: '/how-to-guides/v3/basics/weights/',
          },
        ],
      },
      // 2. Pallet Design.
      {
        name: 'Pallet Design',
        items: [
          {
            title: 'Integrate the Contracts Pallet',
            link: '/how-to-guides/v3/pallet-design/contracts-pallet/',
          },
          {
            title: 'Implement a Lockable Currency',
            link: '/how-to-guides/v3/pallet-design/lockable-currency/',
          },
          {
            title: 'Implementing Randomness',
            link: '/how-to-guides/v3/pallet-design/randomness/',
          },
          {
            title: 'Simple Crowdfund',
            link: '/how-to-guides/v3/pallet-design/crowdfund/',
          },
          {
            title: 'Storage Value Struct',
            link: '/how-to-guides/v3/pallet-design/storage-value/',
          },
          {
            title: 'Tightly Coupling a Pallet',
            link: '/how-to-guides/v3/pallet-design/tight-coupling/',
          },
          {
            title: 'Loosely Coupling a Pallet',
            link: '/how-to-guides/v3/pallet-design/loose-coupling/',
          },
        ],
      },
      // 3. Weights.
      {
        name: 'Weights',
        items: [
          {
            title: 'Calculating Fees',
            link: '/how-to-guides/v3/weights/calculate-fees/',
          },
          {
            title: 'Add Benchmarking to Your pallet',
            link: '/how-to-guides/v3/weights/add-benchmarking/',
          },
          {
            title: 'Use Custom Weights from Benchmarking',
            link: '/how-to-guides/v3/weights/use-benchmark-weights/',
          },
          {
            title: 'Create a Conditional Weighting Struct',
            link: '/how-to-guides/v3/weights/conditional-weighting-struct/',
          },
        ],
      },
      // 4. Testing.
      {
        name: 'Testing',
        items: [
          {
            title: 'Setting up Tests for Your Pallet',
            link: '/how-to-guides/v3/testing/basics/',
          },
          {
            title: 'Testing a Transfer Function',
            link: '/how-to-guides/v3/testing/transfer-function/',
          },
        ],
      },
      // 5. Storage Migrations.
      {
        name: 'Storage Migrations',
        items: [
          {
            title: 'Basic Storage Migration',
            link: '/how-to-guides/v3/storage-migrations/basics/',
          },
          {
            title: 'Trigger a Storage Migration',
            link: '/how-to-guides/v3/storage-migrations/trigger-with-apps/',
          },
          {
            title: 'Migration Tests',
            link: '/how-to-guides/v3/storage-migrations/tests/',
          },
        ],
      },
      // 6. Consensus.
      {
        name: 'Consensus',
        items: [
          {
            title: 'Add PoW Consensus',
            link: '/how-to-guides/v3/consensus/pow/',
          },
          {
            title: 'Create a PoS-PoW Hybrid Node',
            link: '/how-to-guides/v3/consensus/hybrid-pos-pow/',
          },
        ],
      },
      // 7. Parachains.
      {
        name: 'Parachains',
        items: [
          {
            title: 'Solochain Logic Conversion',
            link: '/how-to-guides/v3/parachains/convert',
          },
          {
            title: 'Connect to a Relay Chain',
            link: '/how-to-guides/v3/parachains/connect/',
          },
          {
            title: 'Collator Selection',
            link: '/how-to-guides/v3/parachains/start-collator-node/',
          },
          {
            title: 'Pre-Launch Requirements',
            link: '/how-to-guides/v3/parachains/pre-launch/',
          },
          {
            title: 'Runtime Upgrades',
            link: '/how-to-guides/v3/parachains/runtime-upgrades/',
          },
        ],
      },
      // 8. Tools
      {
        name: 'Tools',
        items: [
          {
            title: 'Integrate Try Runtime',
            link: '/how-to-guides/v3/tools/try-runtime/',
          },
          {
            title: 'Create a txwrapper for a chain',
            link: '/how-to-guides/v3/tools/txwrapper/',
          },
          {
            title: 'Track parachain auction winners using Sidecar',
            link: '/how-to-guides/v3/tools/sidecar/',
          },
          {
            title: 'Verify Runtime Wasm Binaries with Subwasm',
            link: '/how-to-guides/v3/tools/subwasm',
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
        link: '/tutorials/v3/create-your-first-substrate-chain/',
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
    items: [],
  },
])

DevNavMenuTuts.set('permissionedNetwork', [
  {
    name: `Start a Permissioned Network`,
    items: [
      {
        title: `Introduction`,
        link: '/tutorials/v3/permissioned-network/',
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
        link: '/tutorials/v3/forkless-upgrades/',
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
        link: '/tutorials/v3/private-network/',
      },
      {
        title: `Alice and Bob Start Blockchain`,
        link: '#alice-and-bob-start-a-blockchain',
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
        link: '/tutorials/v3/node-metrics/',
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
        link: '/tutorials/v3/add-a-pallet/',
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
        link: '/tutorials/v3/ink-workshop/pt1/',
      },
      {
        title: `Develop a Smart Contract`,
        link: '/tutorials/v3/ink-workshop/pt2/',
      },
      {
        title: `Build an ERC20 Token Contract`,
        link: '/tutorials/v3/ink-workshop/pt3/',
      },
    ],
  },
])

DevNavMenuTuts.set('cumulusTutorial', [
  {
    name: `Cumulus Tutorial`,
    items: [
      {
        title: `Start a Local Relay Chain`,
        link: '/tutorials/v3/cumulus/start-relay/',
      },
      {
        title: `Connect a Parachain`,
        link: '/tutorials/v3/cumulus/connect-parachain/',
      },
      {
        title: `Launch a Local Parachain Testnet`,
        link: '/tutorials/v3/cumulus/polkadot-launch/',
      },
      {
        title: `Connect to a Live Relay Chain`,
        link: '/tutorials/v3/cumulus/rococo',
      },
    ],
  },
])

DevNavMenuTuts.set('frontierWorkshop', [
  {
    name: `Frontier Workshop`,
    items: [
      {
        title: `Getting Started`,
        link: '/tutorials/v3/frontier/',
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
        title: 'Substrate Kitties Part I',
        link: '/tutorials/v3/kitties/pt1/',
      },
      {
        title: 'Tutorial Objectives',
        link: '/tutorials/v3/kitties/pt1/#tutorial-objectives',
      },
      {
        title: 'Basic Set-up',
        link: '/tutorials/v3/kitties/pt1/#basic-set-up',
      },
      {
        title: `Uniqueness, Custom Types, and Storage Maps`,
        link: '/tutorials/v3/kitties/pt1/#uniqueness-custom-types-and-storage-maps',
      },
      {
        title: `Dispatchables, Events, and Errors`,
        link: '/tutorials/v3/kitties/pt1/#dispatchables-events-and-errors',
      },
      {
        title: `Interacting with Your Kitties`,
        link: '/tutorials/v3/kitties/pt1/#interacting-with-your-kitties',
      },
    ],
  },
  {
    name: `Create a Front-end for the Kitties Chain`,
    items: [
      {
        title: `Substrate Kitties Part II`,
        link: '/tutorials/v3/kitties/pt2/',
      },
      {
        title: `Getting Started`,
        link: '/tutorials/v3/kitties/pt2/#getting-started',
      },
      {
        title: `Creating Custom Components`,
        link: '/tutorials/v3/kitties/pt2/#creating-custom-components',
      },
    ],
  },
])

export { DevNavMenu, DevNavMenuTuts }
