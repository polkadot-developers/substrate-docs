---
title: Polkadot-JS
description:
keywords:
  - polkadot
  - apps
  - UI
  - frontend
  - cli
  - api
  - javascript
  - library
---

The [Polkadot-JS project](https://github.com/polkadot-js) is a collection of tools, interfaces, and libraries that can be used with any Substrate-based blockchain.

## Polkadot-JS API

The [API](https://polkadot.js.org/docs/api) provides application developers the ability to query a node and interact with any Substrate-based blockchain using Javascript.

Follow the [Getting Started](https://polkadot.js.org/docs/api/) guide to learn how to install and start using the Polkadot-JS API right away.

## Polkadot-JS Apps

The [Polkadot-JS Apps UI](https://github.com/polkadot-js/apps) is a flexible UI for interacting with a Polkadot or Substrate based node.

This is pre-built user-facing application, allowing access to all features available on Substrate, a hosted version is available at https://polkadot.js.org/apps.

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

## Where to go next

- [Substrate front-end template](https://github.com/substrate-developer-hub/substrate-front-end-template)
- [Polkadot-JS API](https://polkadot.js.org/api/)
- [Polkadot-JS common utilities](https://polkadot.js.org/common/)