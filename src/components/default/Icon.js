import React from 'react';

import caseStudy from '../../images/svg/case-study.svg';
import chain from '../../images/svg/chain.svg';
import checkMark from '../../images/svg/check-mark.svg';
import closeIcon from '../../images/svg/close-icon.svg';
import computer from '../../images/svg/computer.svg';
import contact from '../../images/svg/contact.svg';
import desktop from '../../images/svg/desktop.svg';
import docIcon from '../../images/svg/doc-icon.svg';
import docsIcon from '../../images/svg/docs.svg';
import docsNavIcon from '../../images/svg/docs-nav-icon.svg';
import dollar from '../../images/svg/dollar.svg';
import builders from '../../images/svg/ecosystem/builders.svg';
import connect from '../../images/svg/ecosystem/connect.svg';
import explore from '../../images/svg/ecosystem/explore.svg';
import opportunities from '../../images/svg/ecosystem/opportunities.svg';
import resources from '../../images/svg/ecosystem/resources.svg';
import event from '../../images/svg/event.svg';
import feTemplate from '../../images/svg/fe-template.svg';
import flag from '../../images/svg/flag.svg';
import forklessUpgrades from '../../images/svg/forkless-upgrades.svg';
import globeSolid from '../../images/svg/globe-solid.svg';
import graduation from '../../images/svg/graduation.svg';
import grantsDollar from '../../images/svg/grants-dollar.svg';
import graph from '../../images/svg/graph.svg';
import hackathons from '../../images/svg/hackathons.svg';
import developers from '../../images/svg/home/developers.svg';
import governance from '../../images/svg/home/governance.svg';
import interoperability from '../../images/svg/home/interoperability.svg';
import projects from '../../images/svg/home/projects.svg';
import security from '../../images/svg/home/security.svg';
import technology from '../../images/svg/home/technology.svg';
import house from '../../images/svg/house.svg';
import htgIcon from '../../images/svg/htg.svg';
import ideCode from '../../images/svg/ide-code.svg';
import knight from '../../images/svg/knight.svg';
import kusamaLogo from '../../images/svg/kusama_logo.svg';
import layers from '../../images/svg/layers.svg';
import lightClient from '../../images/svg/light-client.svg';
import logoAcala from '../../images/svg/logo-acala.svg';
import logoAstar from '../../images/svg/logo-astar.svg';
import logoMoonbeam from '../../images/svg/logo-moonbeam.svg';
import logoWhite from '../../images/svg/logo-white.svg';
import mail from '../../images/svg/mail.svg';
import nodeTemplate from '../../images/svg/node-template.svg';
import paperplane from '../../images/svg/paperplane.svg';
import pen from '../../images/svg/pen.svg';
import placeholder from '../../images/svg/placeholder.svg';
import polkadotLogo from '../../images/svg/polkadot-logo.svg';
import quickStart from '../../images/svg/quick-start.svg';
import reference from '../../images/svg/reference.svg';
import search from '../../images/svg/search.svg';
import seminar from '../../images/svg/seminar.svg';
import shieldCheckSolid from '../../images/svg/shield-check-solid.svg';
import smile from '../../images/svg/smile.svg';
import discord from '../../images/svg/social/discord.svg';
import element from '../../images/svg/social/element.svg';
import element2 from '../../images/svg/social/element2.svg';
import github from '../../images/svg/social/github.svg';
import reddit from '../../images/svg/social/reddit.svg';
import so from '../../images/svg/social/so.svg';
import so2 from '../../images/svg/social/so2.svg';
import twitter from '../../images/svg/social/twitter.svg';
import twitter2 from '../../images/svg/social/twitter2.svg';
import youtube from '../../images/svg/social/youtube.svg';
import stackExchange from '../../images/svg/stack-exchange-white.svg';
import subconnectBrowserTab from '../../images/svg/subconnectBrowserTab.svg';
import substrate from '../../images/svg/substrate.svg';
import adaptable from '../../images/svg/technology/adaptable.svg';
import architecture from '../../images/svg/technology/architecture.svg';
import community from '../../images/svg/technology/community.svg';
import compatible from '../../images/svg/technology/compatible.svg';
import composable from '../../images/svg/technology/composable.svg';
import fast from '../../images/svg/technology/fast.svg';
import flexibleBase from '../../images/svg/technology/flexible-base.svg';
import forkless from '../../images/svg/technology/forkless.svg';
import futureProofBase from '../../images/svg/technology/future-proof-base.svg';
import flexible from '../../images/svg/technology/icon-flexible.svg';
import futureProof from '../../images/svg/technology/icon-future-proof.svg';
import interoperable from '../../images/svg/technology/icon-interoperable.svg';
import open from '../../images/svg/technology/icon-open.svg';
import intentional from '../../images/svg/technology/intentional.svg';
import interoperableBase from '../../images/svg/technology/interoperable-base.svg';
import openBase from '../../images/svg/technology/open-base.svg';
import secure from '../../images/svg/technology/secure.svg';
import tooling from '../../images/svg/technology/tooling.svg';
import tools from '../../images/svg/technology/tools.svg';
import upgradable from '../../images/svg/technology/upgradable.svg';
import time from '../../images/svg/time.svg';
import tutorials from '../../images/svg/tutorials.svg';
import tutsIcon from '../../images/svg/tuts.svg';
import arrowBack from '../../images/svg/ui/arrow-back.svg';
import arrowDropdown from '../../images/svg/ui/arrow-dropdown.svg';
import arrowMore from '../../images/svg/ui/arrow-more.svg';
import arrowNext from '../../images/svg/ui/arrow-next.svg';
import calendar from '../../images/svg/ui/calendar.svg';
import close from '../../images/svg/ui/close-x.svg';
import diamondGreen from '../../images/svg/ui/diamond-green.svg';
import diamondPink from '../../images/svg/ui/diamond-pink.svg';
import diamondPurple from '../../images/svg/ui/diamond-purple.svg';
import diamondYellow from '../../images/svg/ui/diamond-yellow.svg';
import docs from '../../images/svg/ui/docs.svg';
import externalLink from '../../images/svg/ui/external-link.svg';
import hamburger from '../../images/svg/ui/hamburger-toggle.svg';
import moon from '../../images/svg/ui/moon.svg';
import play from '../../images/svg/ui/play.svg';
import sidebarToggle from '../../images/svg/ui/sidebar-toggle.svg';
import star from '../../images/svg/ui/star.svg';
import sun from '../../images/svg/ui/sun.svg';
import w3fLogo from '../../images/svg/w3f-logo.svg';
import waLogo from '../../images/svg/wa-logo.svg';

const iconsMap = {
  /* home */
  search: search,
  developers: developers,
  projects: projects,
  technology: technology,
  governance: governance,
  interoperability: interoperability,
  security: security,
  docIcon: docIcon,
  htgIcon: htgIcon,
  tutsIcon: tutsIcon,
  feTemplate: feTemplate,
  nodeTemplate: nodeTemplate,
  stackExchange: stackExchange,
  ideCode: ideCode,
  grantsDollar: grantsDollar,
  /* ecosystem */
  opportunities: opportunities,
  resources: resources,
  connect: connect,
  builders: builders,
  explore: explore,
  closeIcon: closeIcon,
  /* brand */
  'logo-white': logoWhite,
  'w3f-logo': w3fLogo,
  'kusama-logo': kusamaLogo,
  'polkadot-logo': polkadotLogo,
  'acala-logo': logoAcala,
  'moonbeam-logo': logoMoonbeam,
  'astar-logo': logoAstar,
  substrate: substrate,
  /* headings */
  hackathons: hackathons,
  seminar: seminar,
  dollar: dollar,
  desktop: desktop,
  graduation: graduation,
  smile: smile,
  house: house,
  contact: contact,
  paperplane: paperplane,
  pen: pen,
  event: event,
  chain: chain,
  layers: layers,
  computer: computer,
  mail: mail,
  /* ui */
  'hamburger-toggle': hamburger,
  'close-x': close,
  'arrow-next': arrowNext,
  'arrow-dropdown': arrowDropdown,
  'arrow-more': arrowMore,
  'arrow-back': arrowBack,
  'sidebar-toggle': sidebarToggle,
  docs: docs,
  moon: moon,
  sun: sun,
  'external-link': externalLink,
  calendar: calendar,
  star: star,
  'diamond-yellow': diamondYellow,
  'diamond-pink': diamondPink,
  'diamond-purple': diamondPurple,
  'diamond-green': diamondGreen,
  play: play,
  tools: tools,
  /* mockup */
  placeholder: placeholder,
  /* social */
  twitter: twitter,
  twitter2: twitter2,
  'stack-overflow': so,
  'stack-overflow-2': so2,
  element: element,
  element2: element2,
  youtube: youtube,
  reddit: reddit,
  github: github,
  discord: discord,
  /* highlights */
  'wa-logo': waLogo,
  'forkless-upgrades': forklessUpgrades,
  'light-client': lightClient,
  'shield-check-solid': shieldCheckSolid,
  'globe-solid': globeSolid,
  'subconnect-browser-tab': subconnectBrowserTab,
  'case-study': caseStudy,
  'check-mark': checkMark,
  graph: graph,
  knight: knight,
  flag: flag,
  /* technology */
  flexible: flexible,
  'future-proof': futureProof,
  interoperable: interoperable,
  open: open,
  fast: fast,
  'flexible-base': flexibleBase,
  forkless: forkless,
  intentional: intentional,
  architecture: architecture,
  community: community,
  'open-base': openBase,
  tooling: tooling,
  compatible: compatible,
  'interoperable-base': interoperableBase,
  secure: secure,
  adaptable: adaptable,
  composable: composable,
  'future-proof-base': futureProofBase,
  upgradable: upgradable,
  /* Navigation  */
  docsIcon: docsIcon,
  reference: reference,
  quickStart: quickStart,
  tutorials: tutorials,
  time: time,
  docsNavIcon: docsNavIcon,
};

export default function Icon({ name, className, ...others }) {
  if (!name) return <span className="w-5"></span>;
  const IconComponent = iconsMap[name];
  if (!IconComponent) return <span className="w-5"></span>;
  return <IconComponent name={name} className={className} {...others}></IconComponent>;
}
