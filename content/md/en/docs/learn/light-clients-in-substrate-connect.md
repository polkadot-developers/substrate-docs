---
title: Light clients in Substrate Connect
description: Use Substrate Connect to integrate a light client into your applications and enable interaction with any Substrate-based chain.
keywords:
  - Substrate Connect
  - light client node
  - Smoldot light client
  - Polkadot
  - Kusama
  - Westend
  - Rococo
---

Typically, the nodes that provide peer-to-peer networking for a blockchain require significant resources, including powerful high-speed processors and high-capacity storage devices.
By contrast, light client nodes can synchronize data from the blockchain while running in resource-constrained environments and embedded in applications.

With a light client node, you can interact with a blockchain in a secure and decentralized way without investing in the high-powered hardware and network capacity that running a full node would require.

## Light clients in the JavaScript ecosystem

For Substrate-based chains, the light client node is implemented as a WebAssembly client—called `smoldot`—that can run in a browser and interact with the chain using JSON-RPC calls.
To make the `smoldot` WebAssembly light client easier to integrate with JavaScript and TypeScript applications, there's a JavaScript package that's built on top of the `smoldot` source called Substrate Connect.

Substrate Connect is available as a Node.js package that can be installed with the `npm` package manager.
The Substrate Connect package enables the light client node to be integrated with applications in the JavaScript ecosystem.
After adding Substrate Connect to an application, the application can communicate with the light client—and access blockchain data—through JSON-RPC messages.

## Connect to the blockchain directly from a browser

With Substrate Connect, your applications can be configured to run a light client node inside a browser running locally on your computer.
From the browser, application users can interact with blockchains directly—without connecting to any third-party nodes or other servers.

By eliminating the need for intermediary servers, Substrate Connect provides benefits to blockchain builders, application developers, and end users.
A few of the key benefits include:

- improved security
- simplified network infrastructure
- lowered maintenance costs
- easier onboarding for novice blockchain users
- faster path to adoption for Web3 applications

## Blockchain networks with well-known names

You can use Substrate Connect to connect to any Substrate-based blockchain.
However, you must specify the correct name of the chain that you want to connect to.
There are a few well-known chain names that are defined for the [`WellKnownChain`](https://paritytech.github.io/substrate-connect/api/enums/_substrate_connect.WellKnownChain.html) enumeration type.

You can connect to the following public blockchain networks using the name listed:

| To connect to this chain                                                                | Use this chain identifier |
| :-------------------------------------------------------------------------------------- | :------------------------ |
| [Polkadot](https://polkadot.network/)                                                   | `polkadot`                |
| [Kusama](https://kusama.network/)                                                       | `ksmcc3`                  |
| [Westend](https://wiki.polkadot.network/docs/en/maintain-networks#westend-test-network) | `westend2`                |
| [Rococo](https://polkadot.network/rococo-v1-a-holiday-gift-to-the-polkadot-community/)  | `rococo_v2_2`             |

Note that you must use the chain identifier as it appears in the chain specification for a specific network rather than the more commonly-used network name.
For example, you must specify `ksmcc3` as the chain identifier to connect to Kusama.
Using the correct name is especially important for chains that have been forked.
For example, `rococo_v2` and `rococo_v2_2` are two different chains.

## Integrate in apps that use Polkadot-JS API

If you have built applications that use the existing Polkadot-JS API, the `@polkadot/rpc-provider` package already contains the `substrate-connect` RPC provider.

To add `substrate-connect` to your application:

1. Install the `@polkadot/rpc-provider` package by running the appropriate command for the package manager you use.

   For example, if you use `yarn`, run the following command:

   ```bash
   yarn add @polkadot/rpc-provider
   ```

   If you use `npm` as your package manager, run the following command:

   ```bash
   npm i @polkadot/rpc-provider
   ```

1. Install the `@polkadot/api` package by running the appropriate command for the package manager you use.

   For example, if you use `yarn`, run the following command:

   ```bash
   yarn add @polkadot/api
   ```

   If you use `npm` as your package manager, run the following command:

   ```bash
   npm i @polkadot/api
   ```

1. Finally install `@substrate/connect` package by running the appropriate command for the package manager you use.

  For example, if you use `yarn`, run the following command:

  ```bash
  yarn add @substrate/connect
  ```

  If you use `npm` as your package manager, run the following command:

  ```bash
  npm i @substrate/connect
  ```

### Use the RPC provider to connect to a well-known network

The following example illustrates how you can use the `rpc-provider` to connect to a well-known network such as Polkadot, Kusama, Westend, or Rococo.

```js
import { ScProvider, WellKnownChain } from "@polkadot/rpc-provider/substrate-connect";
import * as Sc from "@substrate/connect";
import { ApiPromise } from "@polkadot/api";
// Create the provider for a known chain
const provider = new ScProvider(Sc, WellKnownChain.westend2);
// Stablish the connection (and catch possible errors)
await provider.connect();
// Create the PolkadotJS api instance
const api = await ApiPromise.create({ provider });
await api.rpc.chain.subscribeNewHeads(lastHeader => {
  console.log(lastHeader.hash);
});
await api.disconnect();
```

### Use the RPC provider to connect to a custom network

The following example illustrates how you can use the `rpc-provider` to connect to a custom network by specifying its chain specification.

```js
import { ScProvider } from "@polkadot/rpc-provider/substrate-connect";
import * as Sc from "@substrate/connect";
import { ApiPromise } from "@polkadot/api";
import jsonCustomSpec from "./jsonCustomSpec.json";
// Create the provider for the custom chain
const customSpec = JSON.stringify(jsonCustomSpec);
const provider = new ScProvider(Sc, customSpec);
// Stablish the connection (and catch possible errors)
await provider.connect();
// Create the PolkadotJS api instance
const api = await ApiPromise.create({ provider });
await api.rpc.chain.subscribeNewHeads(lastHeader => {
  console.log(lastHeader.hash);
});
await api.disconnect();
```

### Use the RPC provider to connect to a parachain

The following example illustrates how you can use the `rpc-provider` to connect to a parachain by specifying its chain specification.

```js
import { ScProvider, WellKnownChain } from "@polkadot/rpc-provider/substrate-connect";
import * as Sc from "@substrate/connect";
import { ApiPromise } from "@polkadot/api";
import jsonParachainSpec from "./jsonParachainSpec.json";
// Create the provider for the relay chain
const relayProvider = new ScProvider(Sc, WellKnownChain.westend2);
// Create the provider for the parachain. Notice that
// we must pass the provider of the relay chain as the
// second argument
const parachainSpec = JSON.stringify(jsonParachainSpec);
const provider = new ScProvider(Sc, parachainSpec, relayProvider);
// Stablish the connection (and catch possible errors)
await provider.connect();
// Create the PolkadotJS api instance
const api = await ApiPromise.create({ provider });
await api.rpc.chain.subscribeNewHeads(lastHeader => {
  console.log(lastHeader.hash);
});
await api.disconnect();
```

## Use Substrate Connect with other libraries

The previous section demonstrated how to integrate the Substrate Connect provider into applications that use the Polkadot-JS API.
With this provider, you create applications that enable users to interact with the chain through the browser using calls to the Polkadot-JS API methods.
However, you can install and use @substrate-connect in applications that don't depend on the Polkadot-JS API. For example, if you are building your own application library or programming interfaces, you can install the Substrate Connect dependencies by running the appropriate command for the package manager you use.

For example, if you use `yarn`, run the following command:

```bash
yarn add @substrate/connect
```

If you use `npm` as your package manager, run the following command:

```bash
npm i @substrate/connect
```

### Connect to a well-known chain

The following example illustrates how you can use Substrate Connect to connect to a well-known network such as Polkadot, Kusama, Westend, or Rococo.

```js
import { WellKnownChain, createScClient } from "@substrate/connect";
// Create the client
const client = createScClient();
// Create the chain connection, while passing the `jsonRpcCallback` function.
const chain = await client.addWellKnownChain(WellKnownChain.polkadot, function jsonRpcCallback(response) {
  console.log("response", response);
});
// send a RpcRequest
chain.sendJsonRpc('{"jsonrpc":"2.0","id":"1","method":"system_health","params":[]}');
```

### Connect to a parachain

The following example illustrates how you can use Substrate Connect to connect to a parachain.

```js
import { WellKnownChain, createScClient } from "@substrate/connect";
import jsonParachainSpec from "./jsonParachainSpec.json";
// Create the client
const client = createScClient();
// Create the relay chain connection. There is no need to pass a callback
// function because we will sending and receiving messages through
// the parachain connection.
await client.addWellKnownChain(WellKnownChain.westend2);
// Create the parachain connection.
const parachainSpec = JSON.stringify(jsonParachainSpec);
const chain = await client.addChain(parachainSpec, function jsonRpcCallback(response) {
  console.log("response", response);
});
// send a request
chain.sendJsonRpc('{"jsonrpc":"2.0","id":"1","method":"system_health","params":[]}');
```

## API Documentation

For more information about the substrate-connect API, see [Substrate Connect](https://paritytech.github.io/substrate-connect/api/).

## Browser extension

The Substrate Connect Browser Extension is using [Substrate Connect](https://github.com/paritytech/substrate-connect) and [Smoldot light client](https://github.com/smol-dot/smoldot) node modules and upon browser initiation updates and synchronizes in the well known substrate chain specs (**Polkadot, Kusama, Rococo, Westend**), keeping them to the latest state inside the extension, for faster chain sync.

When a dApp that integrates [Substrate Connect](https://github.com/paritytech/substrate-connect) (e.g. [polkadotJS/apps](https://polkadot.js.org/apps/?rpc=light%3A%2F%2Fsubstrate-connect%2Fpolkadot#/explorer)) starts in a browser's tab, then it receives the latest specs from the Extension instead of wrap-synching from the last imported inside the dApp; At the same time, the dApp will appear inside the Extension as "connected" - meaning that it is using the Extension's bootnodes and specs;

You can download the Chrome and Firefox extensions from [Substrate Connect](https://substrate.io/developers/substrate-connect/) or find more information on the [Github repo](https://github.com/paritytech/substrate-connect/tree/main/projects/extension).

## Example projects

- [Burnr](https://paritytech.github.io/substrate-connect/burnr/)

  Insecure redeemable wallet: A light-client-based, in-browser wallet for Substrate.
  It's meant to be quick and easy to use but less secure than other solutions.
  [Github](https://github.com/paritytech/substrate-connect/tree/main/projects/burnr)

- [Multi-chain demo](https://paritytech.github.io/substrate-connect/demo/)

  A simple demo that covers multichain and parachain examples.
  [Github](https://github.com/paritytech/substrate-connect/tree/main/projects/demo)

## Brave browser WebSocket issue

As of **Brave v1.36**, extensions and web pages are limited to a maximum of 10 active WebSocket connections to prevent side-channel attacks.
You can find more information about this change in [Partition WebSockets Limits to prevent side channels](https://github.com/brave/brave-browser/issues/19990).

If you're using the Brave browser and are unable to connect because you've opened the maximum number of WebSocket connections allowed, you can disable this restriction.

To disable the WebSocket limit:

1. Open a new tab in the Brave browser.

2. Copy the URL [brave://flags/#restrict-websockets-pool](brave://flags/#restrict-websockets-pool).

3. Paste the URL in the Address bar to select the **Restrict WebSockets pool** setting.

4. Click the setting list and select **Disabled**.

   ![Disable the Restrict WebSockets pool setting](/media/images/docs/brave-setting.png)

5. Relaunch the browser.
