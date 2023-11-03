---
title: Prepare a local relay chain   
description: Explains how to configure a local relay chain to set up a local test network for a parachain.
keywords:
  - polkadot
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

This tutorial illustrates how to configure a local relay chain.
The local relay chain is required to set up a local testing environment that a test parachain node can connect to.

## Before you begin

Before you begin, consider the following:

- Though it is not a strict prerequisite, it is recommended that you first learn how to generate chain specifications for a private network of trusted validators as described in [Add trusted nodes](/tutorials/build-a-blockchain/add-trusted-nodes/). 

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have completed [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/) and know how to compile and run a Substrate node.

- You are generally familiar with Polkadot [architecture and terminology](https://wiki.polkadot.network/docs/learn-architecture).

- You are aware that parachain versions and dependencies are tightly coupled with the version of the relay chain they connect to.

  Your parachain must stay synchronized with relay chain upgrades to continue running successfully.
  If you don't stay synchronized when newer versions of the relay chain are released, it's likely that your network will stop producing blocks.

  Tutorials generally use the latest Polkadot branch to demonstrate features.
  If a tutorial doesn't work as expected, you should check whether you have the latest Polkadot branch in your local environment and update your local software, if needed.

## Tutorial objectives

By completing this tutorial, you'll accomplish the following objectives:

- Set up your parachain build environment.
- Prepare a local relay chain specification.
- Start a relay chain locally.

## Build the relay chain node

Polkadot is a Substrate-based relay chain. 
Therefore, this tutorial uses code from the Polkadot repository to prepare the local relay chain.

1. Clone the most recent release branch of the Polkadot repository to prepare a stable working environment.
   
   Release branches tend to be the most reliable and use the naming convention `release-v<n..n.n>`.
   For example, the release branch used in this tutorial is `release-v1.0.0`.
   Newer releases are likely to be available and, in most cases, you can substitute a more recent release branch instead of using the `release-v1.0.0` branch a long as you use the same branch for every module.
   You can find information about each release on the [Releases](https://github.com/paritytech/polkadot/releases) tab in GitHub.
   
   ```bash
   git clone --branch release-v1.0.0 https://github.com/paritytech/polkadot-sdk.git
   ```

2. Change to the root of the `polkadot` directory by running the following command:
   
   ```bash
   cd polkadot
   ```

3. Build the relay chain node by running the following command:
   
   ```bash
   cargo build --release
   ```
   
   Compiling the node can take 15 to 60 minuets to complete.

1. Verify the node built correctly by running the following command:
   
   ```bash
   ./target/release/polkadot --help
   ```

   If command-line help is displayed, the node is ready to configure.

## Relay chain specification

Every Substrate-based chain requires a [chain specification](/build/chain-spec/).
The chain specification for the relay chain network provides the same types of configuration settings that the chain specification does for other networks.
Many of the settings in the chain specification file are critical for network operations.
For example, the chain specification identifies peers that participate in the network, keys for validators, boot node addresses, and other information.

### Sample chain specification

For this tutorial, the local relay chain uses a sample chain specification file with two validator relay chain nodes—Alice and Bob—as authorities.
Because a relay chain _must_ have at least one more validator node running than the total number of connected parachain collators, you can only use the chain specification from this tutorial for a local relay chain network with a **single parachain**.

If you wanted to connect two parachains with a single collator each, you would need to run three or more relay chain validator nodes.
In general, you would need to modify the chain specification and hard-code additional validators to set up a local test network for two or more parachains.

### Plain and raw chain specification files

There are two formats for the sample chain specification—a JSON file in plain text format and a JSON file in SCALE-encoded raw format. 

- [Plain sample relay chain spec](/assets/tutorials/relay-chain-specs/plain-local-chainspec.json)
- [Raw sample relay chain spec](/assets/tutorials/relay-chain-specs/raw-local-chainspec.json)

You can read and edit the plain text version of chain specification file.
However, the chain specification file must be converted to the SCALE-encoded raw format before you can use it to start a node.
For information about converting a chain specification to use the raw format, see [Customize a chain specification](/reference/how-to-guides/basics/customize-a-chain-specification/).

The sample chain specification is only valid for a single parachain with two validator nodes.
If you add other validators, add additional parachains to your relay chain, or want to use custom account keys instead of the predefined account, you'll need to create a custom chain specification file.

If you are completing this tutorial at the same time as anyone on the same local network, then you must download and modify the Plain sample relay chain spec to prevent accidentally peering with their nodes. Find the following line in the plain chain spec and add characters to make your protocolId unique:

```json
   "protocolId": "dot"
```

## Start the relay chain node

Before you can start block production for parachains, you need to start a relay chain for them to connect to.

To start the validator nodes using the [raw sample chain specification file](/assets/tutorials/relay-chain-specs/raw-local-chainspec.json):

1. Download the raw chain specification file to a working directory on the local computer.
   
   For example, save the file as `raw-local-chainspec.json` in the `/tmp` directory.
   You'll need to specify the path to the file in the commands to start the nodes.

2. Start the first validator using the `alice` account by running the following command:
   
   ```bash
   ./target/release/polkadot \
   --alice \
   --validator \
   --base-path /tmp/relay/alice \
   --chain /tmp/raw-local-chainspec.json \
   --port 30333 \
   --rpc-port 9944
   ```

   This command uses `/tmp/raw-local-chainspec.json` as the location of the sample chain specification file. 
   Be sure the `--chain` command-line specifies the path to the raw chain specification you downloaded into a local working directory.
   This command also uses the default values for the port (`port`) and WebSocket port (`ws-port`).
   The values are explicitly included here as a reminder to always check these settings.
   After the node starts, no other nodes on the same local machine can use these ports.

3. Review log messages as the node starts and take note of the Local node identity.
   
   You need to specify this identifier to enable other nodes to connect.
   
   ```bash
   🏷 Local node identity is: 12D3KooWGjsmVmZCM1jPtVNp6hRbbkGBK3LADYNniJAKJ19NUYiq
   ```

4. Open a new terminal and start the second validator using the `bob` account.
   
   The command similar to the command used to start the first node with a few important differences.
   
   ```bash
   ./target/release/polkadot \
   --bob \
   --validator \
   --base-path /tmp/relay/bob \
   --chain /tmp/raw-local-chainspec.json \
   --port 30334 \
   --rpc-port 9945
   ```
   
   Notice that this command uses a different base path ( `/tmp/relay/bob`), validator key (`--bob`), and ports (`30334` and `9945`).
   
   Because both validators are running on a single local computer it isn't necessary to specify the `--bootnodes` command-line option and the IP address and peer identifier of the first node.
   The `bootnodes` option is necessary if you want to connect nodes that run outside of the local network or nodes that are not identified in the chain specification file.

   If you don't see the relay chain producing blocks, try disabling your firewall or adding the `bootnodes` command-line option with the address of the `alice` node to start the node.
   Adding the `bootnodes` option looks like this (with the node identity from above): `--bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWGjsmVmZCM1jPtVNp6hRbbkGBK3LADYNniJAKJ19NUYiq`.

## Where to go next

In this tutorial, you learned how to build and start a local relay chain.
From here, you might want to learn how to connect a local parachain to the local relay chain or experiment with tools that help you automate setting up a test network.

- [Connect a local parachain](/tutorials/build-a-parachain/connect-a-local-parachain/)
- [Launch a parachain test network](https://github.com/open-web3-stack/parachain-launch)
- [Set up `zombienet`](https://github.com/paritytech/zombienet) is a CLI tool that enables you to spawn ephemeral Polkadot and Substrate networks and perform tests against them.

<!-- TODO NEW CONTENT docker and using prebuilt bins suggested https://github.com/substrate-developer-hub/substrate-docs/issues/1073 -->

<!-- TODO NEW CONTENT add details about these in HTG pages and link here in stead on these https://github.com/substrate-developer-hub/substrate-docs/issues/1098 -->
