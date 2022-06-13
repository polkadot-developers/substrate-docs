---
title: "Start a local relay chain"
description: 
---

In this tutorial, you will create a local relay chain—like Polkadot—use [Cumulus](https://github.com/paritytech/cumulus) to create your own parachain, and connect it to the relay chain in a local test environment.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/main-docs/install/).

- You have completed [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) and have the Substrate node template installed locally.

- You have generated accounts and chain specifications for a private network of trusted validators as described in [Add trusted validators](/tutorials/get-started/trusted-network/).

- You are generally familiar with Polkadot and [parachain basic concepts](https://wiki.polkadot.network/docs/learn-parachains) and [parachain development](https://wiki.polkadot.network/docs/build-build-with-polkadot).

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Identify hardware and software requirements.
- Set up your parachain build environment.
- Prepare a relay chain specification.
- Start a relay chain locally.

## Hardware and software requirements

Compiling this project is a resource intensive process. 
You should ensure your hardware meets the following minimum requirements:

- 8 GB of RAM (16 GB is suggested)
- 4 CPU cores (8 cores are suggested)
- 50 GB of free HDD/SSD space
  
  Without the minimal RAM here, you are likely run out of memory resulting in a `SIGKILL` error during the compilation process.
  This error typically occurs when building the `polkadot-service` crate.
  You should monitor your RAM usage with tools like [htop](https://htop.dev/) and be aware if swap memory starts to be used.

### Build with underpowered hardware

If you **_cannot_** find a machine with the minimums here, try the following solutions which trade longer build times for more limited memory usage.

- Use less threads: cargo `-j` flag specifies the number of threads used to build.
  Try to use one less than the CPU cores your machine has.
- Use cargo [codegen units](https://doc.rust-lang.org/cargo/reference/profiles.html#codegen-units) feature makes more optimized builds with less ram, but _much_ longer compile times.

```bash
# set the number of cores/threads to compile (used to build cumulus/polkadot on rpi 3)
cargo build --release -j 1
# use less codegen units
RUSTFLAGS="-C codegen-units=1" cargo build --release
```

### Software versioning

This tutorial has been tested on:

- [Polkadot `v0.9.18`](https://github.com/paritytech/polkadot/tree/release-v0.9.18)
- [Substrate Parachain Template `polkadot-v0.9.18`](https://github.com/substrate-developer-hub/substrate-parachain-template/tree/polkadot-v0.9.18)
- [Polkadot-JS Apps `v0.106.2-29`](https://github.com/polkadot-js/apps/commit/087af7bc9ad388bd98216f2ed9b3d655429ce249).
  It is generally expected that the [hosted Polkadot-JS Apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer) should work.
  If you have issues, build and run this UI yourself at this tagged version/commit.

## Exact Versions Matter

You **must** use the _exact_ versions set forth in this tutorial to ensure that you do not run into conflicts.
Parachains are _very tightly coupled_ with the relay chain codebase they are connecting to. 
To have the least amount of hiccups, be sure to use the corresponding tagged version of Polkadot and the parachain template when working on this tutorial. 
For example, if you are using [Polkadot `v0.9.18`](https://github.com/paritytechtree/release-), use the `polkadot-v0.9.18` version of the [parachain template](https://github.com/substrate-developer-hub/substrate-parachain-template/tree/polkadot-v0.9.18).

We're doing our best to keep the parachain template and this tutorial updated presently with the <ExternalLink url="https://github.com/paritytechreleases"> latest release of Polkadot.</ExternalLink>

**Please join the [Parachain Technical matrix channel](https://matrix.to/#/#parachain-technical:matrix.parity.io) to report any issues you run into and get further support!**

## Build the relay chain node

Polkadot network will serve as our relay chain in this workshop. So clone the **Polkadot** repository and build the node:

```bash
# Clone the Polkadot Repository
git clone https://github.com/paritytech/polkadot.git

# Switch into the Polkadot directory
cd polkadot

# Checkout the proper commit
git checkout release-v0.9.18

# Build the relay chain Node
cargo build --release

# Check if the help page prints to ensure the node is built correctly
./target/release/polkadot --help
```

**After you start the compilation, it will take a while (15 mins to 60 mins) to complete.**
So go ahead and continue to read through the rest of the workshop during the wait. 😉

If the help page is printed, you have succeeded in building a Polkadot node.

### Building the parachain template

We will use the [Substrate parachain template](https://github.com/substrate-developer-hub/substrate-parachain-template) to launch our first parachain and make cross-chain asset transfers.
The parachain template is similar but not identical to the [node template](https://github.com/substrate-developer-hub/substrate-node-template).
Later, we will use this parachain template as the starting point for developing our own parachains.

See the guide on [converting a solo chain to a parachain](/refeerence/how-to-guides/parachains/convert) for details on how the parachain template was created, and how to convert your chain's logic (not state migrations!) to a parachain.**

In a new terminal window:

```bash
# Clone the parachain template
git clone https://github.com/substrate-developer-hub/substrate-parachain-template

# Switch into the parachain template directory
cd substrate-parachain-template

# Checkout the proper commit
git checkout polkadot-v0.9.18

# Build the parachain template collator
cargo build --release

# Check if the help page prints to ensure the node is built correctly
./target/release/parachain-collator --help
```

> Again, this will take 15 to 60 mins to complete.

If the help page is printed, you have succeeded in building a Cumulus-based parachain collator.

## Relay chain specification

You will need a [chain specification](/main-docs/build/chain-spec/)) for your relay chain network.

Always have one or more relay chain validator nodes running than the total connected parachains. 
For example, if you want to connect two parachains, run three or more relay chain validator nodes.

Whichever chain spec file you choose to use we will refer to the file simply as `chain-spec.json` in the instructions below. You will need to supply the proper path to the chain spec you are using.

### Pre-configured chain spec files

We have included a two-validator relay chain with Alice and Bob as authorities chan spec file in this tutorial that you can use **without modification** for a local test network.
This is useful for registering a **single** parachain:

- [_Plain_ `rococo-local` **relay** chain spec](/assets/tutorials/cumulus/chain-spec/rococo-custom-2-plain.json)
- [_Raw_ `rococo-local` **relay** chain spec](/assets/tutorials/cumulus/chain-spec/rococo-custom-2-raw.json)

Plain chain spec files are in a more human readable and modifiable format for your inspection.
You will need to convert it to a SCALE encoded **raw** chain spec to use when starting your nodes.
Jump to the [raw chainspec generation](/tutorials/connect-other-chains/connect-parachain/#configure-a-parachain-for-a-specific-relay-chain-and-para-id) section to see how to do that.

The above raw chain specs were created according to the steps in the [create your own chain spec](/tutorials/get-started/trusted-network/#create-a-custom-chain-specification) section.

## Start your relay chain

Before we can attach any cumulus-based parachains, we need to launch a relay chain for them to connect to.
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

### Starting additional validators (optional)

If you are using the [two-validator raw chain spec](/assets/tutorials/cumulus/chain-spec/rococo-custom-2-raw.json), you do not need to start additional nodes, but others may need to start more nodes.
Again, this command is entirely analogous.
You just need to make sure that nodes on the same local machine do not have conflicting ports or base paths.

```bash
./target/release/polkadot \
--charlie \
--validator \
--base-path /tmp/relay-charlie \
--chain <path to spec json> \
--bootnodes /ip4/<Alice IP>/tcp/30333/p2p/<Alice Peer ID> \
--port 30335 \
--ws-port 9946
```

## Custom relay chain specifications

Optionally, explore the [how-to guide on configuring a custom chain spec](/reference/how-to-guides/basics/custom-chainspec) for instructions to tweak the provided [plain chain spec](/assets/tutorials/cumulus/chain-spec/rococo-custom-2-plain.json) for addition of more validators without modification of Polkadot's source code.

For this tutorial, your final chain spec filename **must** start with `rococo` or the node will not know what runtime logic to include.
