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

This tutorial illustrates how to configure a local relay chain.
The local relay chain is required to set up a local testing environment that a test parachain node can connect to.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have completed [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) and know how to compile and run a Substrate node.

- You know how to generate chain specifications for a private network of trusted validators as described in [Add trusted nodes](/tutorials/get-started/trusted-network/).

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
   For example, the release branch used in this tutorial is `release-v0.9.28`.
   Newer releases are likely to be available and, in most cases, you can substitute a more recent release branch instead of using the `release-v0.9.28` branch a long as you use the same branch for every module.
   You can find information about each release on the [Releases](https://github.com/paritytech/polkadot/releases) tab in GitHub.
   
   ```bash
   git clone --depth 1 --branch release-v0.9.28 https://github.com/paritytech/polkadot.git
   ```

2. Change to the root of the polkadot directory by running the following command:
   
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

   If command-line help is displayed, you node is ready to configure.

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

- [Plain sample relay chain spec](/assets/tutorials/relay-chain-specs/rococo-custom-2-plain.json)
- [Raw sample relay chain spec](/assets/tutorials/relay-chain-specs/rococo-custom-2-raw.json)

You can read and edit the plain text version of chain specification file.
However, the chain specification file must be converted to the SCALE-encoded raw format before you can use it to start a node.
For information about converting a chain specification to use the raw format, see [Customize a chain specification](/reference/how-to-guides/basics/customize-a-chain-specification/).

The sample chain specification is only valid for a single parachain with two validator nodes.
If you add other validators, add additional parachains to your relay chain, or want to use custom account keys instead of the predefined account, you'll need to create a custom chain specification file.

## Start the relay chain node

Before you can start block production for a parachains, you need to start a relay chain for them to connect to.

To start the validator nodes using the [raw sample chain specification file](/assets/tutorials/relay-chain-specs/rococo-custom-2-raw.json):

1. Copy the raw chain specification file to a working directory on the local computer.
   
   For example, save the file as `raw-chain-spec.json` in the `/tmp` directory.
   You'll need to specify the path to the file in the commands to start the nodes.

2. Start the `alice` validator by running the following command:
   
   ```bash
   ./target/release/polkadot \
   --alice \
   --validator \
   --base-path /tmp/relay/alice \
   --chain /tmp/raw-chain-spec.json \
   --port 30333 \
   --ws-port 9944
   ```

   This command uses `/tmp/raw-chain-spec.json` as the location of the sample chain specification file. 
   Be sure to replace the setting for the `--chain` command-line option with the path to the chain specification in your working environment.
   This command also uses the default values for the port (`port`) and WebSocket port (`ws-port`).
   The values are included here as a reminder to always check these values.
   After the node starts, no other nodes on the same local machine can use these ports.

3. Review log messages as the node starts and take note of the Local node identity.
   
   You need to specify this identifier to enable other nodes to connect.
   
   ```bash
   🏷 Local node identity is: 12D3KooWGjsmVmZCM1jPtVNp6hRbbkGBK3LADYNniJAKJ19NUYiq
   ```

4. Start the `bob` validator by running the following command.

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

<!-- TODO NEW CONTENT docker and using prebuilt bins suggested https://github.com/substrate-developer-hub/substrate-docs/issues/1073 -->
