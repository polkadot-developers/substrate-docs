---
title: Substrate Connect
slug: /v3/integration/substrate-connect
version: '3.0'
section: docs
category: tools
keywords: client, wasm, rpc, node
---

[Substrate Connect](https://paritytech.github.io/substrate-connect/) is
a JavaScript library and browser extension that builds on the [Polkadot JS
API](/v3/integration/polkadot-js#polkadot-js-api) to enable developers to build application
specific light clients for Substrate chains. By using light clients available to all
Substrate built blockchains, application developers no longer need to rely on single RPC
nodes to allow end-users to interact with their applications. This introduces
a new paradigm for decentralization: instead of specifying a centralized RPC node, developers
just need to specify the blockchain's [chain specification](/v3/runtime/chain-specs) for
their application to synchronize with the chain.

## What it enables

Substrate Connect provides application developers ways to run a Substrate light client in any
NodeJS environment, from in-browser applications and extensions, to Electron apps,
IOT devices, and mobile phones.

For in-browser end-users, Substrate Connect is a browser extension designed to facilitate
using applications with multiple blockchains, where all light clients can run in a single tab.

This implies two key features:

1. **Ready-to-use light clients for Substrate chains.** Light clients are
   part of the Substrate framework and with that, available for every Substrate based blockchain. This
   means that all you need in order to connect a Substrate chain to your application is provide the
   [chain specification](/v3/runtime/chain-specs) of the chain you want to connect to.

2. **Bundling light-clients of multiple chains.** With the browser extension, end-users are able to
   interact with applications connected to multiple blockchains or connect their own blockchains to
   applications that support it.

## Motivation

Interacting with a Substrate chain via an RPC server requires a layer of third party trust which
can be avoided. Substrate Connect uses a Wasm light client which connects to a Substrate chain
without any unecessary intermediary.

In addition, due to browser limitations on websockets from HTTPS pages, establishing a good number of peers
is difficult as nodes are reachable only if they provide a TLS (Transport Layer Security) certificate.
Substrate Connect provides a browser extension to overcome this limitation and to keep the chains synced in
the background, making applications on a Substrate chain faster.

## How it works

The extension runs a single light client, [Smoldot](https://github.com/paritytech/smoldot) that
manages connecting to different blockchains. Whenever a user opens an app in a new browser tab it
asks the extension to connect to whatever blockchains the app is interested in. The light client is
smart enough to share resources so that it only connects to a network once even if there are
multiple apps talking to it.

The [`@substrate/connect`](https://www.npmjs.com/package/@substrate/connect) library has the following
capabilities:

- It detects whether a user has the Substrate Connect browser extension installed. If it
  isn't installed, it falls back to instantiating a light client directly in the page.

- It handles receiving and listening for messages from the browser extension and provider.

- It manages an app's connection to multiple blockchains, creating an instance of Smoldot
  and connecting the app to it.

### Usage

When used in individual projects, the Substrate Connect node module will first check for the
installed extension. If available, it will try to connect to the light client running inside the
extension. Only if the extension is not installed will it start a light client in the browser tab.

### Ways to use it

Learn how to integrate Substrate Connect in your applications [here](https://paritytech.github.io/substrate-connect/).

## Next steps

### Learn more

- Learn how [Custom RPCs](/v3/runtime/custom-rpcs) work in Substrate
- Learn more about [Smoldot](https://github.com/paritytech/smoldot), the lightweight client for Substrate chains
