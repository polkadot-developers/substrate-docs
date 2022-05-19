# Polkadot-JS reference

The Polkadot-JS project is a collection of tools, interfaces, and libraries that can be used with any Substrate-based blockchain.

## Polkadot-JS API

<RelatedMaterialBlock
  title={``}
  text={`The API provides application developers the ability to query a node and interact with any Substrate-based blockchain using Javascript.`}
  linkText={`Go to Documentation`}
  link={`https://polkadot.js.org/docs/api`}
/>

<RelatedMaterialBlock
  title={``}
  text={`The Polkadot-JS API is a library of interfaces for communicating with Polkadot and Substrate nodes.`}
  linkText={`GitHub`}
  link={`https://github.com/polkadot-js/api`}
/>

### Getting started

Follow the
[Getting Started](https://polkadot.js.org/docs/api/) guide to learn how to install and start using
the Polkadot-JS API right away.

## Polkadot-JS Apps

<RelatedMaterialBlock
  title={``}
  text={`The Polkadot-JS Apps is a flexible UI for interacting with a Polkadot or Substrate based node..`}
  linkText={`Go to Documentation`}
  link={`https://polkadot.js.org/apps`}
/>

<RelatedMaterialBlock
  title={``}
  text={`This is pre-built user-facing application, allowing access to all features available on Substrate
  chains.`}
  linkText={`GitHub`}
  link={`https://github.com/polkadot-js/apps`}
/>

### Connecting to local node

To connect the Polkadot-JS Apps to your local node, you must go into `Settings` and change the **endpoint to connect to** to `Local Node (127.0.0.1:9944)`.

If you connect to the Polkadot-JS Apps over a secure HTTPS connection, you must use a browser that also supports bridging to an insecure WebSocket endpoint.
For example, Google Chrome supports this, but Mozilla Firefox does not.

## Polkadot-JS extension

The Polkadot-JS Extension is a simple proof-of-concept for managing accounts in a browser extension
and allowing the signing of extrinsics using these accounts. It also provides a simple interface for
interacting with extension-compliant dApps.

Different ways to use the extension:

- [On Chrome](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd)

- [On Firefox](https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension)

- [Fork on GitHub](https://github.com/polkadot-js/extension)

## Next steps

### Examples

- Clone the
  [Substrate Front End Template](https://github.com/substrate-developer-hub/substrate-front-end-template)
  to start building a custom ReactJS app for your blockchain using Polkadot-JS API.
- Complete [part II of the Kitties tutorial](/tutorials/v3/kitties/pt2/) to use PolkadotJS API in action

### References

- Visit the reference docs for the [Polkadot-JS API](https://polkadot.js.org/api/)

- Visit the reference docs for the [Polkadot-JS Common Utilities](https://polkadot.js.org/common/)
