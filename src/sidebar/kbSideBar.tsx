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
]
