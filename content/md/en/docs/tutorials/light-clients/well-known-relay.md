---
title: Connect with a well-known relay-chain
description: How to connect to a well-known relay chain via Substrate Connect
---

## Before you begin

Before you begin, make sure you have [installed the Browser Extension](/tutorials/light-clients/browser-extension/).

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Learn why a chainspec is necessary to start a light client.

- Create a basic webapp that loads a light client into the browser.

- Learn how to use an embedded chainspec on Substrate Connect for a well-known relay-chain.

## Basics of Chainspec 

In order to connect to some network, a light client needs to be provided with a [chainspec](https://docs.substrate.io/v3/runtime/chain-specs/). It dictates which network the light client will connect to, which entities it will initially communicate with, and what consensus-critical state it must have at genesis.

Connecting with the well-known relay-chains is very straightforward, because Substrate Connect already comes with their chainspecs ready for usage out-of-the-box, so you don’t have to worry about them.

Those well-known relay-chains are:
- Polkadot
- Kusama
- Rococo
- Westend

If you eventually want to connect to a different relay-chain, then you will need to handle some chainspec file. But that will be explained later on in this tutorial, for now, let’s focus on the well-known chains!

## Connect to Polkadot

First, start by cloning a template for an empty webapp:
```bash
git clone https://github.com/bernardoaraujor/empty-webapp
cd empty-webapp
```

After that, install the necessary dependencies:
```bash
yarn add @polkadot/rpc-provider
yarn add @polkadot/api
```

You should notice that `index.ts` is empty. Go ahead and paste the following contents inside of it:
```typescript
import {
  ScProvider,
  WellKnownChain,
} from "@polkadot/rpc-provider/substrate-connect";
import { ApiPromise } from "@polkadot/api";

window.onload = () => {
  void (async () => {
    try {
      const provider = new ScProvider(WellKnownChain.polkadot);

      await provider.connect();
      const api = await ApiPromise.create({ provider });
      await api.rpc.chain.subscribeNewHeads(
        (lastHeader: { number: unknown; hash: unknown }) => {
          console.log(
            `New block #${lastHeader.number} has hash ${lastHeader.hash}`
          );
        }
      );
    } catch (error) {
      console.error(<Error>error);
    }
  })();
};

```

If you’re familiar with PolkadotJS, you might have noticed this code is very similar to the traditional approach taken there. The only difference is that instead of using a `WsProvider`, we are now using a `ScProvider`.

Also, notice that instead of a WebSocket URL, which would have been the address of a client, we used `WellKnownChain.polkadot`, which represents the chainspec for the Polkadot network.

You can provide any of these network ids:
- `polkadot`
- `ksmcc3`
- `westend2`
- `rococo_v2_2`

Note that these are the "real" names of the chains rather than the names they are more commonly known as (such as Kusama or Rococo). For example, "ksmcc3" is the name of Kusama. This is important for chains which have been hard forked. For example, “rococo_v2" and "rococo_v2_2" are two different chains. Hopefully, polkadot will never go through a hard fork, but all the other three are subject to change in the future. You can keep track of the current chainspec files provided by Substrate Connect [here](https://bit.ly/3NQl48N).

Now it’s time to see the code in action. In the directory of the webapp, run the following:

```bash
yarn
yarn dev
```

That should open a browser on `http://localhost:3001/`. Open the JavaScript console from your browser and observe the output. You should see smoldot (the actual wasm light client) being initialised, followed by the hashes of the incoming blocks of Polkadot.

Tip: different browsers running on different Operating Systems will have different shortcuts to display the JavaScript  console. [Here](https://webmasters.stackexchange.com/a/77337) is a convenient cheat sheet.

To recap what we achieved so far: we fetched block hashes without using any URL for a RPC node, which is arguably a centralised entry point to the network. And we could have done much more, not only block hashes! The point here is that after `WsProvider` is replaced with `ScProvider`, the code can be written as if it was any other app based on PolkadotJS. From here onwards, you can just follow [PolkadotJS docs](https://polkadot.js.org/docs/) and do much more.
