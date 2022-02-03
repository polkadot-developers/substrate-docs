const menus = require('./menus.js');

module.exports = {
  menus,
  title: `Substrate Docs`,
  title_meta: `Substrate enables developers to quickly and easily build future-proof blockchains optimized for any use case.`,
  description: `Substrate enables developers to quickly and easily build future-proof blockchains optimized for any use case.`,
  image_og: `${process.env.GATSBY_DOCS_URL}/img/substrate_og.png`,
  siteUrl: process.env.GATSBY_DOCS_URL,
  websiteUrl: process.env.GATSBY_WEBSITE_URL,
  docsUrl: process.env.GATSBY_DOCS_URL,
  marketplaceUrl: process.env.GATSBY_MARKETPLACE_URL,
  docsVersion: 3,
  author: 'Parity/W3F Web Team',
  pressEmail: 'press@parity.io',
  email: 'info@parity.io',
  twitter: 'https://twitter.com/substrate_io',
  linkedIn: 'https://www.linkedin.com/company/paritytech',
  element: 'https://matrix.to/#/#substrate-technical:matrix.org',
  github: 'https://github.com/paritytech/',
  telegram: 'https://t.me/parity_technologies',
  gitter: 'https://gitter.im/paritytech/parity',
  stackoverflow: 'https://stackoverflow.com/questions/tagged/substrate',
};
