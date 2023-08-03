---
title: Add local parachain nodes
description: How-to connect additional parachain nodes to an established local relay testnet
keywords:
  - parachain
  - collator
  - full node
---

As you learned in [Prepare a local relay chain](/tutorials/build-a-parachain/prepare-a-local-relay-chain/), a parachain can work with a single collator.

## Additional relay chain nodes

You should have _at least_ two [**validators**](/reference/glossary/#validators) (relay chain nodes) running for every [**collator**](/reference/glossary/#collator) (parachain block authoring nodes) on your network.

You can **modify** the provided **plain** [relay chain spec file](/tutorials/build-a-parachain/prepare-a-local-relay-chain/#pre-configured-chain-spec-files) to include more validators, or go the more "correct" route used for production of modifying the **source** for genesis state in `chain_spec.rs` for your **relay chain** to add more testnet validators at genesis.
Recall how to generate chain specifications in the [add trusted nodes](/tutorials/build-a-blockchain/add-trusted-nodes/) tutorial.

### Start a collator

### Start the collator node

With chain spec in hand, you can now start the collator node.
Notice that we need to supply the same relay chain chain spec we used for launching relay chain nodes at the second half of the command:

```bash
./target/release/parachain-collator \
--alice \
--collator \
--force-authoring \
--chain rococo-local-parachain-2000-raw.json \
--base-path /tmp/parachain/alice \
--port 40333 \
--rpc-port 8844 \
-- \
--execution wasm \
--chain <relay chain raw chain spec> \
--port 30343 \
--rpc-port 9977
```

### Start a second collator

The command to run additional collators is as follows, assuming `Alice` node is running already.
This command is nearly identical to the one we used to start the first collator, but we need to avoid conflicting ports and `base-path` directories:

```bash
./target/release/parachain-collator \
--bob \
--collator \
--force-authoring \
--chain rococo-local-parachain-2000-raw.json \
--base-path /tmp/parachain/bob \
--bootnodes <a running collator node> \
--port 40334 \
--rpc-port 9946 \
-- \
--execution wasm \
--chain <relay chain chain spec> \
--port 30344 \
--rpc-port 9978
--bootnodes <other relay chain node>
```

## Related material

- [Polkadot Wiki: Collator](https://wiki.polkadot.network/docs/learn-collator).
- [Prepare a local relay chain](/tutorials/build-a-parachain/prepare-a-local-relay-chain/) tutorial.
