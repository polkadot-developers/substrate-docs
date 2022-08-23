---
title: Prepare a local relay chain   
description: Explains how to configure a local relay chain to set up a local test network for a parachain.
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

This tutorial illustrates how to configure a local relay chain that you can use to connect a parachain template in a local testing environment.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have completed [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) and kow how to compile and run a Substrate node.

- You know how to generate chain specifications for a private network of trusted validators as described in [Add trusted nodes](/tutorials/get-started/trusted-network/).

- You are generally familiar with Polkadot [architecture and terminology](https://wiki.polkadot.network/docs/learn-architecture).

- You are aware that parachain versions and dependencies are tightly coupled with the version of the relay chain they connect to.

  Your parachain must stay synchronized with relay chain upgrades to continue running successfully.
  If you don't stay synchronized when newer versions of the relay chain are released, it's likely that your network will stop producing blocks.

  Tutorials generally use the latest Polkadot branch to demonstrate features.
  If a tutorial doesn't work as expected, you should check whether you have the latest Polkadot branch in your local environment and update your local software, if needed.

## Tutorial objectives

By completing this tutorial, you'll accomplish the following objectives:

- Identify software requirements.
- Set up your parachain build environment.
- Prepare a local relay chain specification.
- Start a relay chain locally.

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

```bash
# Check if the help page prints to ensure the node is built correctly
./target/release/polkadot --help
```

If the help page is printed, you have succeeded in building a Polkadot node.

## Relay chain specification

You will need a [chain specification](/build/chain-spec/) for your relay chain network.
As we want to use a local testnet, a custom configuration may be needed to set development or custom keys for validators, boot node addresses, etc.

**A relay chain _must_ have one more validator nodes running than the total of connected parachain collators.**
For testing these typically must be hard coded into your chain specs.
For example, if you want to connect two parachains with a single collator, run three or more relay chain validator nodes, and ensure they all are specified in your chain spec.

Whichever chain spec file you choose to use we will refer to the file simply as `chain-spec.json` in the instructions below.
You will need to supply the proper path to the chain spec you are using.

### Pre-configured chain spec files

This tutorial includes a sample chain specification file with two validator relay chain nodes—Alice and Bob—as authorities.
You can use this sample chain specification without modification for a local test network and a single parachain.
This is useful for registering a **single** parachain:

- [_Plain_ `rococo-local` **relay** chain spec](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-plain.json)
- [_Raw_ `rococo-local` **relay** chain spec](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-raw.json)

You can read and edit the plain chain specification file.
However, the chain specification file must be converged to the SCALE-encoded raw format before it can be used to start a node.
For information about converting a chain specification to use the raw format, see the [Customize a chain specification](/reference/how-to-guides/basics/customize-a-chain-specification/) guide.

The sample chain specification is only valid for a single parachain with two validator nodes.
If you add other validators, add additional parachains to your relay chain, or want to use custom non-development keys, you'll need to create a custom chain specification that fit your needs.

## Start your relay chain

Before you can start block production for a parachains, you need to launch a relay chain for them to connect to.
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
The `bootnodes` option is not strictly necessary if you are running the entire network on a single local machine, but it is necessary when using a connection to a non-local network without any specified bootnodes in the chain spec, as is the case with the [rococo-custom-2-plain.json](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-plain.json) example we are using. 

For this tutorial, your final chain spec filename **must** start with `rococo` or the node will not know what runtime logic to include.

## Further resources

Manually building and configuring a relay chain is a great exercise.
However, after you have done it a few times, you likely want to automate the process.
There are many ways to go about this, here are a few for reference:

<!-- TODO NEW CONTENT add details about these in HTG pages and link here in stead on these https://github.com/substrate-developer-hub/substrate-docs/issues/1098 -->

- [`parachain-launch`](https://github.com/open-web3-stack/parachain-launch) is a script that generates a docker compose file allowing you to launch a testnet of multiple blockchain nodes.
- [`zombienet`](https://github.com/paritytech/zombienet) is a CLI tool that enables you to spawn ephemeral Polkadot/Substrate networks and perform tests against them.

## Next steps

With a running relay chain, naturally you will want to [connect a parachain](/tutorials/connect-other-chains/connect-a-local-parachain/) to it!
