---
title: Quick start
description: Get started with Substrate.
keywords:
---

All of the Substrate tutorials and how-to guides require you to build and run a Substrate node in your development environment.
To this end, the [Substrate Developer Hub](https://github.com/substrate-developer-hub/) (Devhub) maintains various _templates_ for your use.

The [base node template {at the `latest` release tag}](https://github.com/substrate-developer-hub/substrate-node-template/releases/tag/latest) includes everything you need to get started with minimal features, acting as a basis to adds more to!

This _Quick start_ assumes that you are setting up a development environment for the first time and want to try out running a single template node on your local computer.

To keep things simple, you'll connect to the local node using a web browser and look up a balance for a predefined sample account.

## Before you begin

Before you begin, verify the following:

- You have an internet connection and access to a shell prompt on your local computer's terminal.

- You are generally familiar with software development and using command-line interfaces.

- You have the required packages for Substrate development installed.
  **See the [Install section](/main-docs/install/) before you continue to ensure you will not run into compilation errors.**

## Build the node template

1. Clone the node template repository using the `latest` tag by running the following command:

   ```sh
   git clone --branch latest --depth 1 https://github.com/substrate-developer-hub/substrate-node-template
	```

1. Change to the root of the cloned directory:

   ```sh
   cd substrate-node-template
   ```

1. Compile the node template:

   ```sh
   cargo b -r
   ```

   Because of the number of crates involved, compiling the node can take several minutes.

## Start a node

1. Verify that your node is ready to use and see information about the command-line options available by running the following command:

   ```sh
   ./target/release/node-template --help
   ```

   The usage information displays the command-line options you can use to:

   - start the node
   - work with accounts
   - modify node operations

1. View account information for the predefined `alice` account by running the following command:

   ```sh
   ./target/release/node-template key inspect //alice
   ```

   The command displays the following account information:

   ```sh
   Secret Key URI //alice is account:
   Secret seed:       0xc166b100911b1e9f780bb66d13badf2c1edbe94a1220f1a0584c09490158be31
   Public key (hex):  0xc81ebbec0559a6acf184535eb19da51ed3ed8c4ac65323999482aaf9b6696e27
   Account ID:        0xc81ebbec0559a6acf184535eb19da51ed3ed8c4ac65323999482aaf9b6696e27
   Public key (SS58): 5Gb6Zfe8K8NSKrkFLCgqs8LUdk7wKweXM5pN296jVqDpdziR
   SS58 Address:      5Gb6Zfe8K8NSKrkFLCgqs8LUdk7wKweXM5pN296jVqDpdziR
   ```

1. Start the node in development mode by running the following command:

   ```sh
   ./target/release/node-template --dev
   ```

   In development mode, the chain doesn't require any peer computers to finalize blocks.
   As the node starts, the terminal displays output about the operations performed.
   If you see messages that blocks are being proposed and finalized, you have a running node.

   ```text
   ... Idle (0 peers), best: #3 (0xcc78…5cb1), finalized #1 ...
   ... Starting consensus session on top of parent ...
   ... Prepared block for proposing at 4 (0 ms) ...
   ```

## Connect to the node

1. Use the hosted version of the feature-rich [Polkadot Apps](https://github.com/polkadot-js/apps/) User Interface (UI). 

   <https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer>

1. Navigate to the Accounts page, and attempt a transfer from some development pre-funded accounts.

## Stop the node

1. Go to the terminal that displays blockchain operations.

1. Stop the local blockchain and clear all state by pressing `ctrl-c`.

## Next steps

🎉**_Congratulations!_**🎉

You now have a operational blockchain and are ready to start learning how to customize it!