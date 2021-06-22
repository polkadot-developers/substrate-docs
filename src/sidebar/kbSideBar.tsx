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
        link: '/v3/docs/',
      },
      {
        title: 'Architecture',
        link: '/v3/docs/knowledgebase/getting-started/architecture',
      },
      {
        title: 'Installation',
        link: '/v3/docs/knowledgebase/getting-started/',
      },
      {
        title: 'Getting Started on Windows',
        link: '/v3/docs/knowledgebase/getting-started/windows-users',
      },
      {
        title: 'Glossary',
        link: '/v3/docs/knowledgebase/getting-started/glossary',
      },
    ],
  },
  {
    name: 'Substrate Key Concepts',
    items: [
      {
        title: 'Runtime',
        link: '/v3/docs/knowledgebase/runtime',
      },
      {
        title: 'Extrinsics',
        link: '/v3/docs/knowledgebase/learn-substrate/extrinsics',
      },
      {
        title: 'Account Abstractions',
        link: '/v3/docs/knowledgebase/learn-substrate/account-abstractions',
      },
      {
        title: 'Transaction Pool',
        link: '/v3/docs/knowledgebase/learn-substrate/learn-substrate/tx-pool',
      },
      {
        title: 'Session Keys',
        link: '/v3/docs/knowledgebase/learn-substrate/learn-substrate/session-keys',
      },
      {
        title: 'Transaction Weight',
        link: '/v3/docs/knowledgebase/learn-substrate/learn-substrate/weight',
      },
      {
        title: 'Off-Chain Features',
        link: '/v3/docs/knowledgebase/learn-substrate/off-chain-features',
      },
    ],
  },
]
