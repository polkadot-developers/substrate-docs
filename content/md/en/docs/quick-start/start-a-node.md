---
title: Start a node
description: Started your first Substrate node from a template.
keywords:
---

All of the Substrate tutorials and how-to guides require you to build and run a Substrate node in your development environment.
To help you set up a working environment quickly, the [Substrate Developer Hub](https://github.com/substrate-developer-hub/) maintains _templates_ for you to use.
For example, the [substrate-node-template](https://github.com/substrate-developer-hub/substrate-node-template/tags/) is a snapshot of the main Substrate `node-template` binary that includes a core set of features to get you started.

After you start the node, you can connect to it using a web browser and a simple application that allows you to look up a balance for a predefined account.

## Before you begin

Before you begin, verify the following:

- You have an internet connection and access to an interactive shell terminal on your local computer.

- You are generally familiar with software development and using command-line interfaces.

- You have the Rust compiler and toolchain installed.

  You can check whether you have Rust installed by running the `rustup show` command.
  If Rust is installed, this command displays version information for the toolchain and compiler.
  If Rust is not installed, the command doesn't return any output.
  For information about installing Rust, see [Install](/install).

## Build the node template

1. Clone the node template repository by running the following command:

   ```sh
   git clone https://github.com/substrate-developer-hub/substrate-node-template
   ```

   This command clones the main branch. 
   If you are familiar with Polkadot, you can use the `--branch` command-line option and a [tag](https://github.com/substrate-developer-hub/substrate-node-template/tags) to specify the version of Polkadot you want to work with.
   
2. Change to the root of the cloned directory:

   ```sh
   cd substrate-node-template
   ```

1. Create a new branch to save your work by running a command similar to the following:

   ```bash
   git switch -c my-learning-branch-yyyy-mm-dd
   ```

   You can name the branch using any identifying information you choose, but the recommended practice is to include a numerical year-month-day in the name. 
   For example:
   
   ```bash
   git switch -c my-learning-branch-2023-03-31
   ```

2. Compile the node template:

   ```sh
   cargo build --package node-template --release
   ```

   Because of the number of packages involved, the first time you compile the node can take some time to complete.

   It should complete with a line like this:
   
   ```bash
   Finished release [optimized] target(s) in 11m 23s
   ```

## View information for the node

1. Verify that your node is ready to use and see information about the command-line options available by running the following command:

   ```sh
   ./target/release/node-template --help
   ```

   The usage information displays the command-line options you can use to:

   - start the node
   - work with accounts
   - modify node operations

1. View account information for the predefined `Alice` development account by running the following command:

   ```sh
   ./target/release/node-template key inspect //Alice
   ```

   The command displays the following account information:

   ```text
   Secret Key URI `//Alice` is account:
   Network ID:        substrate 
   Secret seed:       0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a
   Public key (hex):  0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
   Account ID:        0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
   Public key (SS58): 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
   SS58 Address:      5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
   ```

   Predefined development accounts like  `Alice` and  `Bob` are configured in a **chain specification** file.
   You'll learn more about node template files in [Explore the code](/quick-start/explore-the-code/) and more specifically about the chain specification file in [Chain specification](/build/chain-spec/).
   For now, it's enough to be aware that development accounts exist to enable testing of simple transactions like balance transfers.

## Start the blockchain

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

1. Create a simple HTML file with JavaScript and the [Polkadot-JS API](https://polkadot.js.org/docs/) to interact with the blockchain.

   For example, create an `index.html` file that uses JavaScript and HTML to:

   - take an account address as input
   - look up the account balance using an `onClick` event
   - display the balance for the account as output

   This sample [index.html](/assets/quickstart/index.html) provides a simple example of how to use JavaScript, the Polkadot-JS API, and HTML to get an account balance.

2. Copy and paste the [sample code](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/quickstart/index.html) for the **Quick start: Get Balance** application into a new file in your text editor and save the file on your local computer.

3. Open the `index.html` file in a web browser.

4. Copy and paste the SS58 Address for the `Alice` account in the input field, then click **Get Balance**.

## Stop the node

1. Go to the terminal that displays blockchain operations.

1. Stop the local blockchain and clear all state by pressing the `control-c` key combination.
