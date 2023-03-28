---
title: Customize a chain specification
description:
keywords:
---

After you have a Substrate node crafted, you want to start a network with many peers!
This guide shows one method to create chain specification files uniformly and distribute them so other nodes can discover and peer with your network _explicitly_.

This guide illustrates:

- How to generate a `chain-spec.json` and include it for other nodes to join a common network
- How to modify an existing plain chain spec without editing the node source code

## Create a chain specification

**Plain chain specification file** 

1. Start in your node's working directory, generate a plain chain spec with this command:

   ```bash
   ./target/release/node-template build-spec > chain-spec-plain.json
   ```

   We have just generated a **plain chain spec** file for the _default_ network set in your
   `chain_spec.rs` file.
   This file can be passed to other nodes.

1. Modify the plain chain specification (optional):

   This optional step we can leverage an _existing_ plain chain specification for a network that otherwise would require modification of the _source_ of the node to run on a _new network_.
   For example, this can be quite useful in the [Prepare a local relay chain](/tutorials/build-a-parachain/prepare-a-local-relay-chain/) where we want to create a custom _relay chain_ without customizing Polkadot's source.

   Here we use the _same_ chain spec, but pass a flag to disable bootnodes, as we want a _new_ network where these nodes will be different.

   ```bash
   ./target/release/node-template build-spec --chain chain-spec-plain.json --raw --disable-default-bootnode > no-bootnodes-chain-spec-plain.json
   ```

   This `no-bootnodes-chain-spec-plain.json` can be used to generate a SCALE storage encoded, distributable raw chain spec.

**Raw chain specification file**

1. Generate the raw chain specification.

   With a plain spec available, you can generate a final raw chain spec by running:

   ```bash
   ./target/release/node-template build-spec --chain chain-spec-plain.json --raw > chain-spec.json
   ```

Raw chain specifications should always be used when passed into a node to execute with it.

## Publish the raw chain specification

Because Rust builds that target WebAssembly are optimized, the binaries aren't deterministically reproducible.
If each network participant were to generate the plain and/or raw chain specification, the differences in the resulting Wasm blob would break consensus.

It is _conventional_ to include the chain specification files for your node _within the source code itself_ so that anyone can build your node in the same way, whereby it becomes easy to check for non-determinism by comparing a genesis blob with another.
Polkadot, Kusama, Rococo, and more network chain spec files are found [in the source here](https://github.com/paritytech/polkadot/tree/master/node/service/chain-specs) along with a `.gitignore` file to ensure that you don't accidentally change these `!/*.json` files as you build further on your node's software and do [runtime upgrades](/tutorials/build-a-blockchain/upgrade-a-running-network/).

## Start a new node

If you publish a node binary, or have users build their own and then they want to join your network, all then need is the _same_ raw chain spec file and to run your binary with:

```bash
# binary named `node-template`
# `chain-spec.json` obtained from canonical common source
node-template --chain chain-spec.json
```

This can also simply be configured to be the _default_ network.
For reference, you can see how [Polkadot implements](https://github.com/paritytech/polkadot/commits/master/cli/src/command.rs) a default command that uses the chain specs for various networks [in the source here](https://github.com/paritytech/polkadot/tree/master/node/service/chain-specs).

## Examples

- [Add trusted nodes](/tutorials/build-a-blockchain/add-trusted-nodes#add-keys-to-keystore)
- [Polkadot-like network chain specs](https://github.com/paritytech/polkadot/tree/master/node/service/chain-specs)
- [Polkadot commands for many networks](https://github.com/paritytech/polkadot/commits/master/cli/src/command.rs)
