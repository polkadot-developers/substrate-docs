const CAREERS_URL = process.env.GATSBY_CAREERS_URL

const MainNav = {
  global: () => {
    const site = process.env.GATSBY_WEBSITE_URL
    return [
      {
        name: `Technology`,
        subMenu: [
          {
            linkTitle: `Overview`,
            link: `${site}/technology`,
            external: true,
          },
          {
            linkTitle: `Flexible`,
            link: `${site}/technology/flexible`,
            external: true,
          },
          {
            linkTitle: `Open`,
            link: `${site}/technology/open`,
            external: true,
          },
          {
            linkTitle: `Interoperable`,
            link: `${site}/technology/interoperable`,
            external: true,
          },
          {
            linkTitle: `Future-Proof`,
            link: `${site}/technology/future-proof`,
            external: true,
          },
        ],
      },
      {
        name: `Developers`,
        subMenu: [
          {
            linkTitle: `Home`,
            link: `/`,
            external: false,
          },
          {
            linkTitle: `Docs`,
            link: `/v3`,
            external: false,
          },
          {
            linkTitle: `How-to Guides`,
            link: `/how-to-guides`,
            external: false,
          },
          {
            linkTitle: `Tutorials`,
            link: `/tutorials`,
            external: false,
          },
          {
            linkTitle: `Rust Docs`,
            link: `/rustdocs/`,
            external: false,
          },
          {
            linkTitle: `Playground`,
            link: `/playground`,
            external: false,
          },
          {
            linkTitle: `Smart Contracts`,
            link: `${site}/smart-contracts`,
            external: true,
          },
        ],
      },
      {
        name: `Vision`,
        subMenu: [
          {
            linkTitle: `Substrate & Polkadot`,
            link: `${site}/vision/substrate-and-polkadot`,
            external: true,
          },
        ],
      },
      {
        name: `Ecosystem`,
        subMenu: [
          {
            linkTitle: `Home`,
            link: `${site}/ecosystem`,
            external: true,
          },
          {
            linkTitle: `Projects`,
            link: `${site}/ecosystem/projects`,
            external: true,
          },
          {
            linkTitle: `Builders Program`,
            link: `${site}/ecosystem/substrate-builders-program`,
            external: true,
          },
          {
            linkTitle: `Opportunities`,
            link: `#`,
            external: true,
            items: [
              {
                linkTitle: 'Hackathons',
                link: `${site}/ecosystem/opportunities/hackathons`,
                external: true,
              },
              {
                linkTitle: 'Grants',
                link: `${site}/ecosystem/opportunities/grants`,
                external: true,
              },
              {
                linkTitle: 'Careers',
                link: CAREERS_URL,
                external: false,
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
                link: `${site}/ecosystem/resources/seminar`,
                external: true,
              },
              {
                linkTitle: 'Past Seminars',
                link: `${site}/ecosystem/resources/past-seminars`,
                external: true,
              },
              {
                linkTitle: 'Awesome Substrate',
                link: `https://github.com/substrate-developer-hub/awesome-substrate/blob/master/README.md`,
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
                link: `${site}/ecosystem/connect/contact`,
                external: true,
              },
              {
                linkTitle: 'Events',
                link: `https://www.parity.io/events`,
                external: true,
              },
              {
                linkTitle: 'Newsletter',
                link: `${site}/ecosystem/connect/newsletter`,
                external: true,
              },
              {
                linkTitle: 'Blog',
                link: `https://www.parity.io/blog/tag/parity-substrate`,
                external: true,
              },
            ],
          },
          {
            linkTitle: `Square One`,
            link: `${site}/ecosystem/square-one`,
            external: true,
          },
        ],
      },
    ]
  },
}

export default MainNav
