const MainNav = {
  global: () => {
    return [
      {
        name: `Technology`,
        subMenu: [
          {
            linkTitle: `Overview`,
            link: `https://www.substrate.io/technology`,
            external: true,
          },
          {
            linkTitle: `Flexible`,
            link: `https://www.substrate.io/technology/flexible`,
            external: true,
          },
          {
            linkTitle: `Open`,
            link: `https://www.substrate.io/technology/open`,
            external: true,
          },
          {
            linkTitle: `Interoperable`,
            link: `https://www.substrate.io/technology/interoperable`,
            external: true,
          },
          {
            linkTitle: `Future-Proof`,
            link: `https://www.substrate.io/technology/future-proof`,
            external: true,
          },
        ],
      },
      {
        name: `Developers`,
        subMenu: [
          {
            linkTitle: `Overview`,
            link: `/`,
            external: false,
          },
          {
            linkTitle: `Docs`,
            link: `/v3/docs/getting-started/overview`,
            external: false,
          },
          {
            linkTitle: `How-to Guides`,
            link: `/v3/how-to-guides`,
            external: false,
          },
          {
            linkTitle: `Tutorials`,
            link: `/tutorials`,
            external: false,
          },
          {
            linkTitle: `Rust Docs`,
            link: `/rustdocs`,
            external: true,
          },
          {
            linkTitle: `Playground`,
            link: `/playground`,
            external: false,
          },
        ],
      },
      {
        name: `Vision`,
        subMenu: [
          {
            linkTitle: `Substrate & Polkadot`,
            link: `https://www.substrate.io/vision/`,
            external: true,
          },
        ],
      },
      {
        name: `Ecosystem`,
        subMenu: [
          {
            linkTitle: `Overview`,
            link: `https://www.substrate.io/ecosystem`,
            external: true,
          },
          {
            linkTitle: `Teams`,
            link: `https://www.substrate.io/ecosystem/teams`,
            external: true,
          },
          {
            linkTitle: `Builders Program`,
            link: `https://www.substrate.io/ecosystem/substrate-builders-program`,
            external: true,
          },
          {
            linkTitle: `Opportunities`,
            link: `#`,
            external: true,
            items: [
              {
                linkTitle: 'Hackathons',
                link: 'https://www.substrate.io/ecosystem/opportunities/hackathons',
                external: true,
              },
              {
                linkTitle: 'Grants',
                link: 'https://www.substrate.io/ecosystem/opportunities/grants',
                external: true,
              },
              {
                linkTitle: 'Jobs',
                link: 'https://www.substrate.io/ecosystem/opportunities/jobs',
                external: true,
              },
            ],
          },
          {
            linkTitle: `Resources`,
            link: `#`,
            external: true,
            items: [
              {
                linkTitle: 'Substrate Seminar',
                link: 'https://www.substrate.io/ecosystem/resources/substrate-seminar',
                external: true,
              },
              {
                linkTitle: 'Awesome Substrate',
                link: 'https://www.substrate.io/ecosystem/resources/awesome-substrate',
                external: true,
              },
              {
                linkTitle: 'Community Learning Offerings',
                link: 'https://www.substrate.io/ecosystem/resources/community-learning-offerings',
                external: true,
              },
            ],
          },
          {
            linkTitle: `Connect`,
            link: `#`,
            external: true,
            items: [
              {
                linkTitle: 'Contact',
                link: 'https://www.substrate.io/ecosystem/connect/contact',
                external: true,
              },
              {
                linkTitle: 'Events',
                link: 'https://www.substrate.io/ecosystem/connect/events',
                external: true,
              },
              {
                linkTitle: 'Newsletter',
                link: 'https://www.substrate.io/newsletter',
                external: true,
              },
              {
                linkTitle: 'Blog',
                link: 'https://www.substrate.io/ecosystem/connect/blog',
                external: true,
              },
            ],
          },
        ],
      },
    ]
  },
}

export default MainNav
