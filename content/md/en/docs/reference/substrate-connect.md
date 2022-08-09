---
title: Substrate Connect
description: Run Wasm Light Clients of any Substrate based chain directly in your browser
keywords:
---
Substrate is a modular framework for creating use-case optimized blockchains at a low cost, by composing custom or pre-built components. Substrate is the backbone that powers Polkadot, a next-generation, heterogeneous, multi-chain network, and its ecosystem.

## Wasm Light Clients

Substrate-connect turns a browser into a node on a network allowing end-users of Web3 apps to interact with blockchains directly - without connecting to third-party remote nodes and other servers. Removing intermediary servers between network and its users improves security, simplifies infrastructure of a network and lowers its maintenance costs. Decentralized in-browser light clients are a unique feature of substrate-based networks.

[What is a light client and why you should care? by Thibault Sardan](https://www.parity.io/what-is-a-light-client/)

## Well known Networks

* [Westend](https://wiki.polkadot.network/docs/en/maintain-networks#westend-test-network)
* [Kusama](https://kusama.network/)
* [Polkadot](https://polkadot.network/)
* [Rococo](https://polkadot.network/rococo-v1-a-holiday-gift-to-the-polkadot-community/)

[WellKnownChain enumeration docs](https://paritytech.github.io/substrate-connect/api/enums/connect_src.WellKnownChain.html)

You have to provide a well-known chain name (polkadot, ksmcc3, westend2, rococo_v2_2). Note that these are the "real" names of the chains rather than the names they are more commonly known as (such as Kusama or Rococo). For example, "ksmcc3" is the name of Kusama. This is important for chains which have been hard forked. For example, "rococo_v2" and "rococo_v2_2" are two different chains.

## Getting Started - Usage through the PolkadotJS Provider

```bash
yarn add @polkadot/rpc-provider
```

```bash
yarn add @polkadot/api
```

Simple usage (suported chain)

```js
import { ScProvider, WellKnownChain } from '@polkadot/rpc-provider/substrate-connect';
import { ApiPromise } from '@polkadot/api';
// Create the provider for a known chain
const provider = new ScProvider(WellKnownChain.westend2);
// Stablish the connection (and catch possible errors)
await provider.connect()
// Create the PolkadotJS api instance
const api = await ApiPromise.create({ provider });
await api.rpc.chain.subscribeNewHeads((lastHeader) => {
console.log(lastHeader.hash);
});
await api.disconnect();
```

Simple usage (custom chain)

```js
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import { ApiPromise } from '@polkadot/api';
import jsonCustomSpec from './jsonCustomSpec.json';
// Create the provider for the custom chain
const customSpec = JSON.stringify(jsonCustomSpec);
const provider = new ScProvider(customSpec);
// Stablish the connection (and catch possible errors)
await provider.connect()
// Create the PolkadotJS api instance
const api = await ApiPromise.create({ provider });
await api.rpc.chain.subscribeNewHeads((lastHeader) => {
console.log(lastHeader.hash);
});
await api.disconnect();
```

Parachains usage

```js
import { ScProvider, WellKnownChain } from '@polkadot/rpc-provider/substrate-connect';
import { ApiPromise } from '@polkadot/api';
import jsonParachainSpec from './jsonParachainSpec.json';
// Create the provider for the relay chain
const relayProvider = new ScProvider(WellKnownChain.westend2);
// Create the provider for the parachain. Notice that
// we must pass the provider of the relay chain as the
// second argument
const parachainSpec = JSON.stringify(jsonParachainSpec);
const provider = new ScProvider(parachainSpec, relayProvider);
// Stablish the connection (and catch possible errors)
await provider.connect()
// Create the PolkadotJS api instance
const api = await ApiPromise.create({ provider });
await api.rpc.chain.subscribeNewHeads((lastHeader) => {
console.log(lastHeader.hash);
});
await api.disconnect();
```

## Advanced Usage

```bash
yarn add @substrate/connect
```

Connecting to a `WellKnownChain`

```js
import { WellKnownChain, createScClient } from '@substrate/connect';
// Create the client
const client = createScClient();
// Create the chain connection, while passing the `jsonRpcCallback` function.
const chain = await client.addWellKnownChain(
WellKnownChain.polkadot,
function jsonRpcCallback(response) {
console.log('response', response);
}
);
// send a RpcRequest
chain.sendJsonRpc(
'{"jsonrpc":"2.0","id":"1","method":"system_health","params":[]}'
);
```

Connecting to a parachain

```js
import { WellKnownChain, createScClient } from '@substrate/connect';
import jsonParachainSpec from './jsonParachainSpec.json';
// Create the client
const client = createScClient();
// Create the relay chain connection. There is no need to pass a callback
// function because we will sending and receiving messages through
// the parachain connection.
await client.addWellKnownChain(WellKnownChain.westend2);
// Create the parachain connection.
const parachainSpec = JSON.stringify(jsonParachainSpec);
const chain = await client.addChain(
parachainSpec,
function jsonRpcCallback(response) {
console.log('response', response);
}
);
// send a request
chain.sendJsonRpc(
'{"jsonrpc":"2.0","id":"1","method":"system_health","params":[]}'
);
```

## API Documentation

For learning more about substrate-connect`s API and usage follow the link below:

[Learn more](https://paritytech.github.io/substrate-connect/api/)

## Browser Extension

For in-browser use, Substrate Connect provides a Browser Extension built upon the @substrate/light node module that is running the selected light clients inside the extension so that the end-user does not need to fire up a light node in every browser tab. This will also allow the light-node to keep syncing as long as the browser window stays open.

![Substrate Connect](/media/images/docs/reference/substrate-connect-screenshot.png)

* [Learn more](https://github.com/paritytech/substrate-connect/tree/main/projects/extension)
* [Download for Chrome](https://chrome.google.com/webstore/detail/khccbhhbocaaklceanjginbdheafklai)
* [Download for Firefox](https://addons.mozilla.org/en-US/firefox/addon/substrate-connect/)
* [Download zip](https://paritytech.github.io/substrate-connect/extension/packed-extension.zip)

## Projects

* [Burnr](https://paritytech.github.io/substrate-connect/burnr/) - Insecure redeemable wallet
* [Multi-demo](https://paritytech.github.io/substrate-connect/demo/) - Simple Demo that covers multi and para chain examples