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

- You have completed the [build a local blockchain](/tutorials/get-started/build-local-blockchain/) tutorial previously.

- You understand how to generated chain specifications for a private network of trusted validators as described in the [add trusted nodes](/tutorials/get-started/trusted-network/) tutorial.

- You are generally familiar with the [architecture of Polkadot](https://wiki.polkadot.network/docs/learn-architecture) and [parachains](https://wiki.polkadot.network/docs/learn-parachains).

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Identify software requirements.
- Set up your parachain build environment.
- Prepare a relay chain specification.
- Start a relay chain locally.

## Matching versions are critical

You **must** use the _exact_ versions set forth in this tutorial.
Parachains are _very tightly coupled_ with the relay chain codebase that they connect to because they share so many common dependencies.
Be sure to use the corresponding version of Polkadot with any other software when working on _any_ examples throughout the Substrate documentation.
You must stay synchronized with relay chain upgrades for your parachain to continue running successfully.
If you don't keep up with relay chain upgrades, it's likely that your network will stop producing blocks.

### Documentation examples versioning

**All tutorials in the docs** have been tested to work with:

- [Polkadot `v0.9.24`](https://github.com/paritytech/polkadot/tree/release-v0.9.24)
- [Substrate Parachain Template `polkadot-v0.9.24`](https://github.com/substrate-developer-hub/substrate-parachain-template/tree/polkadot-v0.9.24)
- [Polkadot-JS Apps `v0.116.2-34 `](https://github.com/polkadot-js/apps/commit/151c4cd75b6eb68ac275d90fd17f98b28b6e57a7).
  It is generally expected that the [hosted Polkadot-JS Apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer) should work.
  If you have issues, build and run this UI yourself at this tagged version/commit.

## Build the relay chain node

<!-- TODO NEW CONTENT docker and using prebuilt bins suggested https://github.com/substrate-developer-hub/substrate-docs/issues/1073 -->

A slightly modified version of Polkadot's built in `rococo-local` network configuration will serve as our relay chain.
So clone the Polkadot repository and build the node:

```bash
# Clone the Polkadot Repository, with correct version
git clone --depth 1 --branch release-v0.9.24 https://github.com/paritytech/polkadot.git

# Switch into the Polkadot directory
cd polkadot

# Build the relay chain Node
cargo b -r
```

Compiling the node can take 15 to 60 minuets to complete.
While waiting, perhaps reviewing how to [create your own chain spec](/tutorials/get-started/trusted-network/#create-a-custom-chain-specification) would be in order, as it's something you may with to do latter on here.

```bash
# Check if the help page prints to ensure the node is built correctly
./target/release/polkadot --help
```

If the help page is printed, you have succeeded in building a Polkadot node.

## Relay chain specification

You will need a [chain specification](/main-docs/build/chain-spec/)) for your relay chain network.

Keep in mind that a relay chain _must_ have one more validator nodes running than the total of connected parachain collators.
For testing these typically must be hard coded into your chain specs.
For example, if you want to connect two parachains with a single collator, run three or more relay chain validator nodes, and ensure they all are specified in your chain spec.

Whichever chain spec file you choose to use we will refer to the file simply as `chain-spec.json` in the instructions below.
You will need to supply the proper path to the chain spec you are using.

### Pre-configured chain spec files

This tutorial includes a sample chain specification file with two validator relay chain nodes—Alice and Bob—as authorities.
You can use this sample chain specification without modification for a local test network and a single parachain.
This is useful for registering a **single** parachain:

- [_Plain_ `rococo-local` **relay** chain spec](https://github.com/substrate-developer-hub/substrate-docs/blob/main-md/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-plain.json)
- [_Raw_ `rococo-local` **relay** chain spec](https://github.com/substrate-developer-hub/substrate-docs/blob/main-md/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-raw.json)

You can read and edit the plain chain specification file.
However, the chain specification file must be converged to the SCALE-encoded raw format before it can be used to start a node.
For information about converting a chain specification to use the raw format, see [raw chainspec generation](/tutorials/connect-other-chains/parachain/#configure-a-parachain-for-a-specific-relay-chain-and-para-id).

The sample chain specification is only valid for a single parachain with two validator nodes.
If you add other validators, add additional parachains to your relay chain, or want to use custom non-development keys, you'll need to create a custom chain specification that fit your needs.

## Start your relay chain

Before you can start block production for a parachains, you need to launch a relay chain for them to connect to.
This section describes how to start both nodes using the [two-validator raw chain spec](/assets/tutorials/cumulus/chain-spec/rococo-custom-2-raw.json).
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

When the node starts you will see several log messages, including the node's **Peer ID**.
Take note of this, as you will need it when connecting other nodes to it.

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
The `bootnodes` option is not strictly necessary if you are running the entire network on a single local machine, but it is necessary when operating over the network.

<!-- TODO NAV.YAML -->
<!-- add these back -->
<!-- ## Custom relay chain specifications

Optionally, explore the [how-to guide on configuring a custom chain spec](/reference/how-to-guides/basics/customize-a-chain-specification) for an example of how to modify the [plain chain spec](/assets/tutorials/cumulus/chain-spec/rococo-custom-2-plain.json) to add more validators without modifying any Polkadot source code.

For this tutorial, your final chain spec filename **must** start with `rococo` or the node will not know what runtime logic to include. -->

## Further resources

Manually building and configuring a relay chain is a great exercise.
However, after you have done it a few times, you might want to automate the process.
There are many ways to go about this, here are a few for reference:

<!-- TODO: add details about these in HTG pages and link here in stead on these https://github.com/substrate-developer-hub/substrate-docs/issues/1098 -->

- [`parachain-launch`](https://github.com/open-web3-stack/parachain-launch) is a script that generates a docker compose file allowing you to launch a testnet of multiple blockchain nodes.
- [`zombienet`](https://github.com/paritytech/zombienet) is a CLI tool that enables you to spawn ephemeral Polkadot/Substrate networks and perform tests against them.

## Next steps

With a running relay chain, naturally you will want to [connect a parachain](/tutorials/connect-other-chains/parachain/) to it!
