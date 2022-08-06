---
title: Prepare a local parachain testnet
description:
keywords:
  - cumulus
  - relay chain
  - parachain
  - parathread
  - paraID
  - rococo
  - xcm
  - xcmp
  - collator
  - testnet
  - local
---

In this tutorial, you will configure a local relay chain and connect a parachain template for use in a local testing environment.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/main-docs/install/).

- You have completed the [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) tutorial previously.

- You know how to generate chain specifications for a private network of trusted validators as described in [Add trusted nodes](/tutorials/get-started/trusted-network/).

- You are generally familiar with the [architecture of Polkadot](https://wiki.polkadot.network/docs/learn-architecture) and [parachains](https://wiki.polkadot.network/docs/learn-parachains).

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Identify software requirements.
- Set up your parachain build environment.
- Prepare a relay chain specification.
- Start a relay chain locally.

## Matching versions are critical

Using the _exact_ versions set forth in this tutorial is critical.
Parachains are _very tightly coupled_ with the relay chain codebase that they connect to because they share so many common dependencies.
Be sure to use the corresponding version of Polkadot with any other software when working on _any_ examples throughout the Substrate documentation.
Staying synchronized with relay chain versions for any parachain to continue operation is typically required.
If lagging with relay chain upgrades, it's likely that a parachain will stop producing blocks.

### Documentation examples versioning

**All tutorials in the docs** have been tested to work with:

- [Polkadot `v0.9.26`](https://github.com/paritytech/polkadot/tree/release-v0.9.26)
- [Substrate Parachain Template `polkadot-v0.9.26`](https://github.com/substrate-developer-hub/substrate-parachain-template/tree/polkadot-v0.9.26)
- [Polkadot-JS Apps `v0.116.2-34 `](https://github.com/polkadot-js/apps/commit/151c4cd75b6eb68ac275d90fd17f98b28b6e57a7).
  It is generally expected that the [hosted Polkadot-JS Apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer) should work.
  If experiencing have issues, build and run this UI locally at this tagged version/commit.

## Build the relay chain node

<!-- TODO NEW CONTENT docker and using prebuilt bins suggested https://github.com/substrate-developer-hub/substrate-docs/issues/1073 -->

A slightly modified version of Polkadot's built in `rococo-local` network configuration will serve as the relay chain for this tutorial.

```bash
# Clone the Polkadot Repository, with correct version
git clone --depth 1 --branch release-v0.9.26 https://github.com/paritytech/polkadot.git

# Switch into the Polkadot directory
cd polkadot

# Build the relay chain Node
cargo b -r
```

Compiling the node can take 15 to 60 minuets to complete.
Check if the help page prints to ensure the node is built correctly.


```bash
./target/release/polkadot --help
```

## Relay chain specification

A [chain specification](/main-docs/build/chain-spec/) for any relay chain network is required to start and add peers to a network.
With a local testnet, a custom configuration may be needed to set development or custom keys for validators, boot node addresses, etc.

**A relay chain _must_ have one more validator nodes running than the total of connected parachain collators.**
For testing these typically must be hard coded into the chain specs.
For example, two parachains with a single collator would require three or more relay chain validator nodes, and ensure they all are specified in the chain spec.

Make note of the proper path to the chain specs desired for use.

### Pre-configured chain spec files

This tutorial includes a sample chain spec file with two validator relay chain nodes—Alice and Bob—as authorities.
This sample chain spec without modification for a local test network and a single parachain.
This is useful for registering a **single** parachain:

- [_Plain_ `rococo-local` **relay** chain spec](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-plain.json)
- [_Raw_ `rococo-local` **relay** chain spec](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-raw.json)

The plain chain spec file is human readable, and modifiable.
However, the chain spec file must be converted to the SCALE-encoded raw format before it can be used to start a node.
For information about converting a chain spec to use the raw format, see the [Customize a chain specification](/reference/how-to-guides/basics/customize-a-chain-specification/) guide.

The sample chain specification is only valid for a single parachain with two validator nodes.
If adding other validators, add additional parachains to the relay chain, or wanting to use custom non-development keys, a custom chain specification is required.

## Start a relay chain

Before starting block production for a parachains, a relay chain is required for them to connect to.
This section describes how to start both nodes using the [two-validator raw chain spec](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-raw.json).
The steps are similar for starting additional nodes.

### Start the `alice` validator

```bash
# Start Relay `Alice` node
./target/release/polkadot \
--alice \
--validator \
--base-path /tmp/relay/alice \
--chain <path to spec json> \
--port 30333 \
--ws-port 9944
```

The port (`port`) and websocket port (`ws-port`) specified in this command use default values and can be omitted.
However, the values are included here as a reminder to always check these values.
After the node starts, no other nodes on the same local machine can use these ports.

```bash
🏷 Local node identity is: 12D3KooWGjsmVmZCM1jPtVNp6hRbbkGBK3LADYNniJAKJ19NUYiq
```

When the node starts several log messages, including the node's **Peer ID** are emitted.
Take note of this, as it will needed when connecting other nodes to it.

### Start the `bob` validator

The command to start the second node is similar to the command to start the first node with a few important differences.

```bash
./target/release/polkadot \
--bob \
--validator \
--base-path /tmp/relay-bob \
--chain <path to spec json> \
--bootnodes /ip4/<Alice IP>/tcp/30333/p2p/<Alice Peer ID> \
--port 30334 \
--ws-port 9945
```

Notice that this command uses a a different base path ( `/tmp/relay-bob`), validator key (`--bob`), and ports (`30334` and `9945`).

The command to start the second node also includes the `--bootnodes` command-line option to specify the IP address and peer identifier of the first node.
The `bootnodes` option is not strictly necessary if running the entire network on a single local machine, but it is necessary when using a connection to a non-local network without any specified bootnodes in the chain spec, as is the case with the [rococo-custom-2-plain.json](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-plain.json) example. 

For further tutorials using this relay chain for a parachain, the final chain spec filename **must** start with `rococo` or the parachain node will not know what runtime logic to include.

## Further resources

Manually building and configuring a relay chain is a great exercise.
However, after doing it a few times, you likely want to automate the process.
There are many ways to go about this, here are a few for reference:

<!-- TODO NEW CONTENT add details about these in HTG pages and link here in stead on these https://github.com/substrate-developer-hub/substrate-docs/issues/1098 -->

- [`parachain-launch`](https://github.com/open-web3-stack/parachain-launch) is a script that generates a docker compose file to launch a testnet of multiple blockchain nodes.
- [`zombienet`](https://github.com/paritytech/zombienet) CLI tool spawns ephemeral Polkadot/Substrate networks and performs tests against them.

## Next steps

With a running relay chain, [connect a parachain](/tutorials/connect-other-chains/local-parachain/) to it!
