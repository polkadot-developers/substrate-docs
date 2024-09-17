const { WEBSITE_URL } = require('./webConsts.js');

/* the main menu, ids of items must match
   the submenu's key of this js object */
const main = [
  {
    url: '',
    id: 'technology',
  },
  {
    url: '',
    id: 'developers',
  },
  {
    url: '',
    id: 'vision',
  },
  {
    url: '',
    id: 'ecosystem',
  },
];

/* sub menus, matching the main menu items' "id" */
const technology = [
  {
    url: WEBSITE_URL + '/technology',
    id: 'technology.overview',
  },
  {
    url: WEBSITE_URL + '/technology/flexible',
    id: 'technology.flexible',
  },
  {
    url: WEBSITE_URL + '/technology/open',
    id: 'technology.open',
  },
  {
    url: WEBSITE_URL + '/technology/interoperable',
    id: 'technology.interoperable',
  },
  {
    url: WEBSITE_URL + '/technology/future-proof',
    id: 'technology.future-proof',
  },
];

const developers = [
  {
    url: WEBSITE_URL + '/developers/',
    id: 'developers.home',
  },
  {
    url: '/',
    id: 'developers.docs',
  },
  {
    url: 'https://paritytech.github.io/substrate/master/sc_service/',
    id: 'developers.rustdocs',
  },
  {
    url: WEBSITE_URL + '/developers/smart-contracts/',
    id: 'developers.smart-contracts',
  },
  {
    url: WEBSITE_URL + '/developers/substrate-connect',
    id: 'developers.substrate-connect',
  },
  {
    url: WEBSITE_URL + '/developers/rococo-network',
    id: 'developers.rococo-network',
  },
];

const vision = [
  {
    url: WEBSITE_URL + '/vision/substrate-and-polkadot',
    id: 'vision.substrate-and-polkadot',
  },
];

const ecosystem = [
  {
    url: WEBSITE_URL + '/ecosystem',
    id: 'ecosystem.home',
  },
  {
    url: WEBSITE_URL + '/ecosystem/projects',
    id: 'ecosystem.projects',
  },
  {
    url: WEBSITE_URL + '/ecosystem/substrate-builders-program',
    id: 'ecosystem.substrate-builders-program',
  },
  {
    url: WEBSITE_URL + '/ecosystem/opportunities',
    id: 'ecosystem.opportunities',
    child: 'opportunities',
  },
  {
    url: WEBSITE_URL + '/ecosystem/resources',
    id: 'ecosystem.resources',
    child: 'resources',
  },
  {
    url: WEBSITE_URL + '/ecosystem/connect',
    id: 'ecosystem.connect',
    child: 'connect',
  },
  {
    url: WEBSITE_URL + '/ecosystem/square-one',
    id: 'ecosystem.square-one',
  },
];

/* child menus for sub menus, matching the parent menu items with "child: id" */

const opportunities = [
  {
    url: WEBSITE_URL + '/ecosystem/opportunities/hackathons',
    id: 'ecosystem.opportunities.hackathons',
  },
  {
    url: WEBSITE_URL + '/ecosystem/opportunities/grants',
    id: 'ecosystem.opportunities.grants',
  },
];

const resources = [
  {
    url: WEBSITE_URL + '/ecosystem/resources/seminar',
    id: 'ecosystem.resources.seminar',
  },
  {
    url: WEBSITE_URL + '/ecosystem/resources/past-seminars',
    id: 'ecosystem.resources.past-seminars',
  },
  {
    url: 'https://github.com/spolkadot-developers/awesome-substrate/blob/master/README.md',
    id: 'ecosystem.resources.awesome-substrate',
  },
];

const connect = [
  {
    url: WEBSITE_URL + '/ecosystem/connect/contact',
    id: 'ecosystem.resources.contact',
  },
  {
    url: 'https://www.parity.io/events/',
    id: 'ecosystem.resources.events',
  },
  {
    url: WEBSITE_URL + '/ecosystem/connect/newsletter',
    id: 'ecosystem.resources.newsletter',
  },
  {
    url: 'https://www.parity.io/blog/tag/parity-substrate/',
    id: 'ecosystem.resources.blog',
  },
];

const legal = [
  {
    url: 'https://www.parity.io/privacy/',
    id: 'legal.privacy',
  },
  {
    url: 'https://www.parity.io/terms/',
    id: 'legal.terms',
  },
];

module.exports = {
  main,
  technology,
  developers,
  vision,
  ecosystem,
  opportunities,
  resources,
  connect,
  legal,
};
