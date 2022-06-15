---
title: Connect with a parachain
description: How to connect with a parachain via Substrate Connect
---

## Before you begin

Before you begin, make sure you have [installed the Browser Extension](/tutorials/light-clients/browser-extension/), and that you have learned how to [connect to a well-known relay-chain](/tutorials/light-client/well-known-relay/).

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Learn how to load a chainspec into the light client.

- Create a basic webapp that connects to a parachain from the browser.

## Connect to Statemint

This tutorial is very similar to the previous, where we [connected to a well-known relay-chain](/tutorials/light-client/well-known-relay/).

But instead of using a chainspec that's embedded into the Substrate Connect library, we are going to explicitly provide it to our code.

We want to connect to Statemint, a common-goods parachain connected to Polkadot. You can download its chainspec from the [cumulus repository](https://github.com/paritytech/cumulus/blob/master/parachains/chain-specs/statemint.json).

Go ahead and save it into the same directory from the previous tutorial (`empty-webapp`). Then, edit the contents of `index.ts` so it looks like the following:
```typescript
import {
  ScProvider,
  WellKnownChain,
} from "@polkadot/rpc-provider/substrate-connect";
import { ApiPromise } from "@polkadot/api";
import jsonParachainSpec from "./statemint.json";

window.onload = () => {
  void (async () => {
    try {
      const relayProvider = new ScProvider(WellKnownChain.polkadot);
      const parachainSpec = JSON.stringify(jsonParachainSpec);
      const provider = new ScProvider(parachainSpec, relayProvider);

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

This code is very similar to the previous one. The main differences are
- we are loading `statemint.json` into the `parachainSpec` variable.
- `ScProvider` is created for relay chain but without connecting (since we will not be communicating with the relay chain). This is needed as a parameter when creating the Parachain's provider as an extra parameter. Rpc Provider of substrate-connect need this, in order to connect the parachain to the respective relay chain.

In the directory of the webapp, run the following again:

```bash
yarn
yarn dev
```

That should open a browser on `http://localhost:3001/`. Open the JavaScript console from your browser and observe the output. You should see smoldot (the actual wasm light client) being initialised, followed by the hashes of the incoming blocks of Statemint.

From here onwards, the usage is very similar to what would have been usually done via PolkadotJS. All you have to do is follow the [official documentation](https://polkadot.js.org/docs/) and interact with the chain.

One important detail is that we used `@polkadot/rpc-provider/substrate-connect` as our dependency, and that is fine for a fast and easy integration into a simple webapp. However, more advanced implementations (e.g.: library authors) should install and use `@substrate-connect` instead.
