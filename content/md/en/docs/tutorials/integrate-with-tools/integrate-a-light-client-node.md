---
title: Integrate a light client node
description: Demonstrates how you can connect to Substrate-based blockchains using Substrate Connect in a browser.
keywords:
---

As you learned in [Light clients in Substrate Connect](/fundamentals/light-clients-in-substrate-connect/), light client nodes provide secure and decentralized access to blockchain data with minimal hardware and software requirements.

This tutorial demonstrates how you can connect to any Substrate-based blockchain using a light client.
To illustrate this, you'll learn how to connect your application to the [Statemint parachain](https://wiki.polkadot.network/docs/learn-statemint).
Statemint is a common good parachain that is connected to Polkadot and has a publicly-accessible chain specification file.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have downloaded and compiled the 
  [Substrate node template](https://github.com/substrate-developer-hub/substrate-node-template).

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Download and install the Substrate Connect browser extension.
- Connect to a relay chain using the Substrate Connect browser extension.
- Learn how to specify a custom chain specification file for Substrate Connect to use.
- Connect to a parachain associated with the custom chain specification from the browser extension.

## Download Substrate Connect

Because of the advantages that the Substrate Connect browser extension provides, the first step of the tutorial is to install the browser extension.

1. Navigate to https://substrate.io/developers/substrate-connect/ using the Chrome or Firefox web browser.

2. Click [Chrome](https://chrome.google.com/webstore/detail/substrate-connect-extensi/khccbhhbocaaklceanjginbdheafklai) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/substrate-connect/).

3. Click **Add to Chrome** or **Add to Firefox**, then confirm that you want to add the extension to the browser. 

## Connect to a well-known chain

Before the light client can connect to a network, you must have a web application that specifies the network the light client should connect to, the nodes for it to communicate with, and the consensus-critical state it must have at genesis.
This information is available in the [chain specification](/build/chain-spec/) file for the network. 

Substrate Connect is preconfigured to recognize several chains that are defined in the [WellKnownChain](https://paritytech.github.io/substrate-connect/api/enums/connect_src.WellKnownChain.html) enumeration list.
These well-known chains are:

- Polkadot identified as `polkadot`
- Kusama identified as `ksmcc3`
- Rococo identified as `rococo_v2_2`
- Westend identified as `westend2`

To connect to one of these chains:

1. Open a new terminal shell on your computer.

2. Create a web application to use Substrate Connect by cloning the `empty-webapp` template with the following command:
   
   ```bash
   git clone https://github.com/bernardoaraujor/empty-webapp
   ```

3. Change to the `empty-webapp` directory by running the following command:
 
   ```bash
   cd empty-webapp
   ```
   
4. Install substrate connect
   
   ```bash
   yarn add @substrate/connect
   ```

5. Install dependencies from the Polkadot-JS RPC provider by running the following command:
   
   ```bash
   yarn add @polkadot/rpc-provider
   ```

6. Install dependencies from the Polkadot-JS API by running the following command:
   
   ```bash
   yarn add @polkadot/api
   ```

   After you install these dependencies, you can use them in the sample application.

7. Open the `empty-webapp/index.ts` file in a text editor.
   
8. Copy and paste the following application code to create a Substrate Connect instance with `substrate-connect` as the provider that connects to the Polkadot relay chain using the `polkadot` chain specification file.
   
   ```typescript
   import { ScProvider } from "@polkadot/rpc-provider/substrate-connect";
   import * as Sc from "@substrate/connect";
   import { ApiPromise } from "@polkadot/api";
    
    window.onload = () => {
      void (async () => {
        try {
          const provider = new ScProvider(Sc, Sc.WellKnownChain.polkadot);
          
          await provider.connect();
          const api = await ApiPromise.create({ provider });
          await api.rpc.chain.subscribeNewHeads(
            (lastHeader: { number: unknown; hash: unknown }) => {
              console.log(
                `💡 New block #${lastHeader.number} has hash ⚡️ ${lastHeader.hash}`
              );
            }
          );
        } catch (error) {
          console.error(<Error>error);
        }
      })();
    };
   ```
   
   In this sample application code, creating a Substrate Connect instance is similar to how you create a web socket instance using the Polkadot-JS API.
   With the Polkadot-JS API only, you would create an instance like this:
   
   ```javascript
   // Import
   import { ApiPromise, WsProvider } from '@polkadot/api';
   
   // Construct
   const wsProvider = new WsProvider('wss://rpc.polkadot.io');
   const api = await ApiPromise.create({ provider: wsProvider });
   ```
   
   For Substrate Connect, you replace the WebSocket (`WsProvider`) provider with the Substrate Connect (`ScProvider`) provider, and, instead of a WebSocket URL client address, you specify the chain specification for the network to connect to (`WellKnownChain.polkadot`).

9. Install any remaining dependencies by running the following command:
   
   ```bash
   yarn
   ```

10. Start the web application by running the following command:
   
   ```bash
   yarn dev
   ```

   If there are compiler errors when you start the local server, you might be missing a dependency not accounted for by the current `yarn` configuration.
   If a dependency is missing, you can add the package by running a command similar to the following:

   ```bash
   yarn add -D buffer
   ```
   
11. Verify the browser opens the URL `http://localhost:3001/`. 
  
12. Open the browser console for your browser. 
   
   How you navigate to and open the browser console varies depending on the browser and operating system you use.
   For example, on Chrome, select **More Tools**, **Developer Tools**, then click **Console**.
   
13. Verify the `smoldot` process is initialized, followed by the hashes of the incoming blocks from Polkadot.
   
   For example, the console should display log entries similar to the following:
   
   ```console
   [smoldot] Smoldot v0.6.25
   smoldot-light.js:41 [smoldot] Chain initialization complete for polkadot. Name: "Polkadot". Genesis hash: 0x91b1…90c3. State root hash: 0x29d0d972cd27cbc511e9589fcb7a4506d5eb6a9e8df205f00472e5ab354a4e17. Network identity: 12D3KooWRse9u6Z9ukP4C92YCCH2gXziNm8ThRch2owaaFh9H6D1. Chain specification or database starting at: 0xae3e…f81d (#11228238)
   ...
   New block #11322769 has hash 0x464c0199ede92a89920c54c21abc741ea47daca1d62d61d7b9af78062f04c7a3 index.ts:10 
   New block #11322770 has hash 0xd66c61e5417249df228798f38535a6dd17b8b268c165e0a6b0e72ba74e954f9d index.ts:10
   ```
   
   This simple web application only connects to Polkadot to retrieve block hashes.
   The primary purpose of this application is to demonstrate connecting to the chain without using a centralized entry point to the network, such as the URL for a specific RPC node.
   However, you could extend this application to do a lot more, because—after you replace `WsProvider` with `ScProvider`—you can write code for your application simply by using the existing [Polkadot-JS API](https://polkadot.js.org/docs/).

14. Stop the `smoldot` light client node by pressing Control-c.

## Connect to a custom chain specification 

Connecting to a custom chain specification or a publicly-accessible parachain is similar to connecting to one of the well-known chains.
The primary difference in the code is that you must explicitly identify the chain specification for Substrate Connect to use.

To connect to Statemint:

1. Download the custom chain specification file from the [cumulus repository](https://github.com/paritytech/cumulus/blob/master/parachains/chain-specs/statemint.json).

2. Copy the downloaded chain specification to the `empty-webapp` directory you created in [Connect to a well-known chain](#connect-to-a-well-known-chain).

3. Open the `index.ts` file in your code editor.
   
4. Replace the contents with the following code.
    
   ```typescript
   import { ApiPromise } from "@polkadot/api"
   import { ScProvider } from "@polkadot/rpc-provider/substrate-connect"
   import * as Sc from "@substrate/connect"
   import jsonParachainSpec from "./statemint.json";

   window.onload = () => {

   void (async () => {
     try {

       const relayProvider = new ScProvider(Sc, Sc.WellKnownChain.polkadot);
       const parachainSpec = JSON.stringify(jsonParachainSpec);
       const provider = new ScProvider(Sc, parachainSpec, relayProvider);

       await provider.connect();
       const api = await ApiPromise.create({ provider });
       await api.rpc.chain.subscribeNewHeads((lastHeader: { number: unknown; hash: unknown }) => {
         console.log(`💡 New block #${lastHeader.number} has hash ⚡️ ${lastHeader.hash}`);
       });
     } catch (error) {
       console.error(<Error>error);
     }
   })();
   };
   ```
   
   As you can see, this code has a few important differences.
   
   - The `statemint.json` chain specification file is imported into the `jsonParachainSpec` object.
   - The chain specification is converted to a JSON-encoded string and stored in the `parachainSpec` variable, so that it can be exchanged with the web server.
   - The `ScProvider` provider is created for the `polkadot` relay chain but is used as a parameter for creating and connecting to the parachain provider.
  
  Substrate Connect requires this information to determine the relay chain that the parachain communicates with.

6. Start the web application by running the following command:
   
   ```bash
   yarn dev
   ```

7. Verify the browser opens the URL `http://localhost:3001/`. 
  
8. Open the browser console for your browser.

9. Verify the `smoldot` process is initialized, followed by the hashes of the incoming blocks from Polkadot.
   
   For example, the console should display log entries similar to the following:
   
   ```console
   [smoldot] Parachain initialization complete for statemint. Name: "Statemint". Genesis hash: 0x68d5…de2f. State root hash: 0xc1ef26b567de07159e4ecd415fbbb0340c56a09c4d72c82516d0f3bc2b782c80. Network identity: 12D3KooWArq3iZHdK2jtRZSJzJkkWrKm17JTa9kjwjZkq9Htx5xR. Relay chain: polkadot (id: 1000 smoldot-light.js:41 
   [smoldot] Smoldot v0.6.25. Current memory usage: 140 MiB. Average download: 35.4 kiB/s. Average upload: 423 B/s.
   New block #1785421 has hash 0x88885ed331f94b4324c5f2eae8413cd36170808ef904b0ec0867646fa53770f7 index.ts:13 
   New block #1785422 has hash 0x2ad4d96e061a681e27403694f1d870bb0c4e5c77b5be232a18c7a2e0b7fb2555 index.ts:13 
   ```

<!--
## Advanced application development

The examples in this tutorial used `@polkadot/rpc-provider/substrate-connect` because this provider makes it straightforward to create applications that interact with the chain using the [Polkadot-JS API](https://polkadot.js.org/docs/).
For more advanced application development that doesn't depend on the Polkadot-JS API, you can install and use the `@substrate-connect` package.
For example, if you are building your own application library or programming interfaces, you should install the Substrate Connect dependencies by running the following command:
   
```bash
yarn add @substrate/connect
```

To use `@substrate-connect`

1. Open a terminal shell and create a new working directory. 

   For example:

   ```bash
   mkdir adv-app && cd adv-app
   ```

2. Clone the `empty-webapp` template and change to the template directory by running the following command:
   
   ```bash
   git clone https://github.com/bernardoaraujor/empty-webapp && cd empty-webapp
   ```
   
3. Install the Substrate Connect dependencies by running the following command:
   
   ```bash
   yarn add @substrate/connect
   ```

4. Copy and paste the following application code.
   
   ```typescript
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
-->
