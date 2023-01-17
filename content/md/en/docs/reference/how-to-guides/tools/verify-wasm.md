---
title: Verify a Wasm binary
description: Expose the features of the runtime for any Substrate chain.
keywords:
  - tooling
  - wasm
  - runtime
---

The [subwasm](https://github.com/chevdor/subwasm) tool provides a way to expose the features of the runtime for any Substrate chain.
This guide shows you how to use Subwasm to do the following:

- Get a snapshot of the modules in a runtime.
- Expose verifiable historical information of a chain's runtime for front end applications.
- Check for changes between two runtimes using a diff.

## Before you begin

Make sure you have the following:

- The [latest release](https://github.com/chevdor/subwasm/releases) of Subwasm installed.
- A chain running locally that is executing the runtime you wish to examine.
- [JQ](https://stedolan.github.io/jq/download/) installed in your environment to enable filtering the metadata.

## Get information about a runtime of a local chain

1. Launch a local node from inside your chain's directory.
   This example launches a node template in dev mode.

   ```bash
   ./target/release/node-template --tmp --dev
   ```

1. In a new terminal, create a temporary folder called `TempWasms`.

   ```bash
   mkdir TempWasms
   ```

1. Inside the new folder, use Subwasm to get and save the Wasm of your local chain.

   ```bash
   cd TempWasms
   subwasm get --chain local -o mychain.wasm
   ```

   The `-o` flag will save the Wasm file to `mychain.wasm`.

1. Run the following command to save your chain's metadata to a JSON file:

   ```bash
    subwasm --json meta mychain.wasm | jq 'del( .. | .documentation? )' > mychain-metadata.json
   ```

   You can use JQ to filter the metadata details from the `subwasm --json meta mychain.wasm` command.
   This example ignores all documentation metadata.
   For information about the metadata fields that a Substrate chain exposes, see the documentation on [Substrate Metadata](https://polkadot.js.org/docs/substrate).

1. After you have saved the metadata in a JSON file, you can use it in a front-end application.

## Compare two different runtimes of a live chain

You can also use Subwasm to compare the runtimes of a chain at different blocks.
Subwasm uses a function that takes the URL of common Substrate chains such as Polkadot, Kusama and Westend, and returns the node's endpoint.
The following example compares the Polkadot runtime at block 500,000 with its latest runtime.

1. Go to a block explorer and retrieve the block hash for the runtime you want to compare against.

   For example, go to [PolkadotJS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/explorer) and retrieve the block hash at [block 500000](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/explorer/query/500000).

   `0xfdeab19649426aadbdab046c9b5dac0a5b0c850b8fd0927e3b4e6c896d5fb0b7`

1. Save the Wasm blob of a previous state.

   ```bash
   BLOCK_HASH=0xfdeab19649426aadbdab046c9b5dac0a5b0c850b8fd0927e3b4e6c896d5fb0b7
   subwasm get --chain polkadot --block $BLOCK_HASH -o polkadot-500000.wasm
   ```

1. Get the latest Wasm blob of the runtime.

   ```bash
   subwasm get --chain polkadot -o polkadot-latest.wasm
   ```

1. Compare the two runtimes and put the output into a JSON file.

   ```bash
   subwasm diff polkadot-latest.wasm polkadot-500000.wasm --json > polkadot-wasm-diff.json
   ```

## Examples

There are many use cases for `subwasm` as outlined above.
Some additional examples include:

- Compressing and decompressing a Wasm file.
- Inspecting a Wasm file to verify a runtime upgrade in governance.
