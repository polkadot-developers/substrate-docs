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

- You have completed [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) tutorial previously.

- You understand how to generated chain specifications for a private network of trusted validators as described in the [Add trusted nodes](/tutorials/get-started/trusted-network/) tutorial .

- You are generally familiar with [architecture of Polkadot](https://wiki.polkadot.network/docs/learn-architecture) and [parachains](https://wiki.polkadot.network/docs/learn-parachains).

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Identify software requirements.
- Set up your parachain build environment.
- Prepare a relay chain specification.
- Start a relay chain locally.

## Exact Versions Matter

You **must** use the _exact_ versions set forth in this tutorial to ensure that you do not run into conflicts.
Parachains are _very tightly coupled_ with the relay chain codebase they are connecting to.
To have the least amount of hiccups, be sure to use the corresponding tagged version of Polkadot and the parachain template when working on this tutorial.
For example, if you are using [Polkadot `v0.9.24`](https://github.com/paritytechtree/release-v0.9.24), use the `polkadot-v0.9.24` version of the [parachain template](https://github.com/substrate-developer-hub/substrate-parachain-template/tree/polkadot-v0.9.24).

### Software versioning

This tutorial has been tested on:

- [Polkadot `v0.9.24`](https://github.com/paritytech/polkadot/tree/release-v0.9.24)
- [Substrate Parachain Template `polkadot-v0.9.24`](https://github.com/substrate-developer-hub/substrate-parachain-template/tree/polkadot-v0.9.24)
- [Polkadot-JS Apps `v0.116.2-34 `](https://github.com/polkadot-js/apps/commit/151c4cd75b6eb68ac275d90fd17f98b28b6e57a7).
  It is generally expected that the [hosted Polkadot-JS Apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer) should work.
  If you have issues, build and run this UI yourself at this tagged version/commit.

## Build the relay chain node

<!-- TODO NEW CONTENT docker and using prebuilt bins suggested https://github.com/substrate-developer-hub/substrate-docs/issues/1073 -->

A slightly modified version of Polkadot's built in `rococo-local` network configuration will serve as our relay chain. So clone the Polkadot repository and build the node:

```bash
# Clone the Polkadot Repository, with correct version
git clone --depth 1 --branch release-v0.9.24 https://github.com/paritytech/polkadot.git

# Switch into the Polkadot directory
cd polkadot

# Build the relay chain Node
cargo b -r

# Check if the help page prints to ensure the node is built correctly
./target/release/polkadot --help
```

**After you start the compilation, it will take a while (commonly 15 mins to 60 mins) to complete.**
So go ahead and continue to read through the rest of the tutorial during the wait. 😉

If the help page is printed, you have succeeded in building a Polkadot node.


## Relay chain specification

You will need a [chain specification](/main-docs/build/chain-spec/)) for your relay chain network.

Whichever chain spec file you choose to use we will refer to the file simply as `chain-spec.json` in the instructions below. You will need to supply the proper path to the chain spec you are using.

In defining these, keep in mind that a relay chain _must_ have one more validator nodes running than the total of connected parachains.
For example, if you want to connect two parachains, run three or more relay chain validator nodes.

### Pre-configured chain spec files

We have included a two-validator relay chain with Alice and Bob as authorities chan spec file in this tutorial that you can use without modification for a local test network of a single parachain.
This is useful for registering a **single** parachain:

- [_Plain_ `rococo-local` **relay** chain spec](https://github.com/substrate-developer-hub/substrate-docs/blob/main-md/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-plain.json)
- [_Raw_ `rococo-local` **relay** chain spec](https://github.com/substrate-developer-hub/substrate-docs/blob/main-md/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-raw.json)

Plain chain spec files are in a more human readable and modifiable format for your inspection.
You will need to convert it to a SCALE encoded **raw** chain spec to use when starting your nodes.
Jump to the [raw chainspec generation](/tutorials/connect-other-chains/connect-parachain/#configure-a-parachain-for-a-specific-relay-chain-and-para-id) section to see how to do that.

The above raw chain specs were created according to the steps in the [create your own chain spec](/tutorials/get-started/trusted-network/#create-a-custom-chain-specification) section.

## Start your relay chain

Before we can start block production for a parachains, we need to launch a relay chain for them to connect to.
This section describes in detail how to start both nodes using the above [two-validator raw chain spec](/assets/tutorials/cumulus/chain-spec/rococo-custom-2-raw.json) as well as the general instructions for starting additional nodes.

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

The port (`port`) and websocket port (`ws-port`) specified here are the defaults and thus those flags can be omitted.
However we choose to leave them in to enforce the habit of checking their values.
Once this node is launched, no other nodes on the same local machine can use these ports.

When the node starts you will see several log messages. **Take note of the node's Peer ID** in the logs.
We will need it when connecting other nodes to it.
It will look something like this:

```bash
🏷 Local node identity is: 12D3KooWGjsmVmZCM1jPtVNp6hRbbkGBK3LADYNniJAKJ19NUYiq
```

### Start the `bob` validator

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

Bob's command is perfectly analogous to Alice's.
It differs from Alice's one by his own base path, his own validator key (`--bob`), and his own ports.
Finally he adds a `--bootnodes` flag.
This flag is not strictly necessary if you are running the entire network on a single local machine, but it is necessary when operating over the network.

<!-- TODO NAV.YAML -->
<!-- add these back -->
<!-- ## Custom relay chain specifications

Optionally, explore the [how-to guide on configuring a custom chain spec](/reference/how-to-guides/basics/customize-a-chain-specification) for instructions to tweak the provided [plain chain spec](/assets/tutorials/cumulus/chain-spec/rococo-custom-2-plain.json) for addition of more validators without modification of Polkadot's source code.

For this tutorial, your final chain spec filename **must** start with `rococo` or the node will not know what runtime logic to include. -->

## Next steps

With a running relay and 