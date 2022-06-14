---
title: Prepare your first contract
description:
keywords:
---

As you learned in [Blockchain basics](/main-docs/fundamentals/blockchain-basics/) decentralized applications are most often written as **smart contracts**.
Although Substrate is primarily a framework and toolkit for building custom blockchains, it can also provide a platform for smart contracts.
This tutorial demonstrates how to build a basic smart contract to run on a Substrate-based chain.
In this tutorial, you'll explore using ink! as a programming language for writing Rust-based smart contracts.

## Before you begin

Before you begin, verify the following:

- You have good internet connection and access to a shell terminal on your local computer.

- You are generally familiar with software development and using command-line interfaces.

- You are generally familiar with blockchains and smart contract platforms.

- You have installed Rust and set up your development environment as described in [Install](/main-docs/install/).

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Learn how to create a smart contract project.

- Build and test a smart contract using the ink! smart contract language.

- Deploy a smart contract on a local Substrate node.

- Interact with a smart contract through a browser.

## Update your Rust environment

For this tutorial, you need to add some Rust source code to your Substrate development environment.

To update your development environment:

1. Open a terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Update your Rust environment by running the following command:

   ```bash
   rustup component add rust-src --toolchain nightly
   ```

1. Verify that you have the WebAssembly target installed by running the following command:

   ```bash
   rustup target add wasm32-unknown-unknown --toolchain nightly
   ```

   If the target is installed and up-to-date, the command displays output similar to the following:

   ```bash
   info: component 'rust-std' for target 'wasm32-unknown-unknown' is up to date
   ```

## Install the Substrate contracts node

To simplify this tutorial, you can [download](https://github.com/paritytech/substrate-contracts-node/releases) a precompiled Substrate node for Linux or macOS.
The precompiled binary includes the FRAME pallet for smart contracts by default.
Alternatively, you can build the preconfigured `contracts-node` manually by running `cargo install contracts-node` on your local computer.

To install the contracts node on macOS or Linux:

1. Open the [Releases](https://github.com/paritytech/substrate-contracts-node/releases) page.

1. Download the appropriate compressed archive for your local computer.

1. Open the downloaded file and extract the contents to a working directory.

If you can't download the precompiled node, you can compile it locally with a command similar to the following:

```bash
cargo install contracts-node --git https://github.com/paritytech/substrate-contracts-node.git --tag <latest-tag> --force --locked
```

You can find the latest tag to use on the [Tags](https://github.com/paritytech/substrate-contracts-node/tags) page.

## Install additional packages

After compiling the `contracts-node` package, you need to install two additional packages:

- The WebAssembly **binaryen** package for your operating system to optimize the WebAssembly bytecode for the contract.
- The `cargo-contract` command line interface you'll use to set up smart contract projects.

### Install the WebAssembly optimizer

To install the **binaryen** package:

1. Open a terminal shell on your computer.

1. Use the appropriate package manager for your operating system to install the package.

   For example, on Ubuntu or Debian, run the following command:

   ```bash
   sudo apt install binaryen
   ```

   On macOS, run the following command:

   ```bash
   brew install binaryen
   ```

   For other operating systems, you can download the `binaryen` release directly from [WebAssebly releases](https://github.com/WebAssembly/binaryen/releases).

### Install the cargo-contract package

After you've installed the WebAssembly `binaryen` package, you can install the `cargo-contract` package.
The `cargo-contract` package provides a command-line interface for working with smart contracts using the ink! language.

1. Open a terminal shell on your computer.

1. Install `cargo-contract` by running the following command:

   ```bash
   cargo install cargo-contract --vers ^0.17 --force --locked
   ```

1. Verify the installation and explore the commands available by running the following command:

   ```bash
   cargo contract --help
   ```

## Create a new smart contract project

You are now ready to start developing a new smart contract project.

To generate the files for a smart contract project:

1. Open a terminal shell on your computer.

1. Create a new project folder named `flipper` by running the following command:

   ```bash
   cargo contract new flipper
   ```

1. Change to the new project folder by running the following command:

   ```bash
   cd flipper/
   ```

1. List all of the contents of the directory by running the following command:

   ```bash
   ls -al
   ```

   You should see that the directory contains the following files:

   ```bash
   -rwxr-xr-x   1 dev-doc  staff   285 Mar  4 14:49 .gitignore
   -rwxr-xr-x   1 dev-doc  staff  1023 Mar  4 14:49 Cargo.toml
   -rwxr-xr-x   1 dev-doc  staff  2262 Mar  4 14:49 lib.rs
   ```

   Like other Rust projects, the `Cargo.toml` file is used to provides package dependencies and configuration information.
   The `lib.rs` file is used for the smart contract business logic.

### Explore the default project files

By default, creating a new smart contract project generates some template source code for a very simple contract that has one function—`flip()`—that changes a Boolean variable from true to false and a second function—`get`—that gets the current value of the Boolean.
The `lib.rs` file also contains two functions for testing that the contract works as expected.

As you progress through the tutorial, you'll modify different parts of the starter code.
By the end of the tutorial, you'll have a more advanced smart contract that looks like the [Flipper example](https://github.com/paritytech/ink/blob/v3.0.0-rc9/examples/flipper/lib.rs).

To explore the default project files:

1. Open a terminal shell on your computer, if needed.

1. Change to project folder for the `flipper` smart contract, if needed:

1. Open the `Cargo.toml` file in a text editor and review the dependencies for the contract.

1. In the `[dependencies]` section, modify the `scale` and `scale-info` settings, if necessary.

   ```toml
   scale = { package = "parity-scale-codec", version = "3", default-features = false, features = ["derive"] }
   scale-info = { version = "2", default-features = false, features = ["derive"], optional = true }
   ```

1. Save any changes to the `Cargo.toml` file, then close the file.

1. Open the `lib.rs` file in a text editor and review the functions defined for the contract.

### Test the default contract

At the bottom of the `lib.rs` source code file, there are simple test cases to verify the functionality of the contract.
You can test whether this code is functioning as expected using the **off-chain test environment**.

To test the contract:

1. Open a terminal shell on your computer, if needed.

1. Verify that you are in the `flipper` project folder, if needed.

1. Use the `test` subcommand and `nightly` toolchain to execute the default tests for the `flipper` contract by running the following command:

   ```bash
   cargo +nightly test
   ```

   The command should display output similar to the following to indicate successful test completion:

   ```bash
   running 2 tests
   test flipper::tests::it_works ... ok
   test flipper::tests::default_works ... ok

   test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
   ```

### Build the contract

After testing the default contract, you are ready to compile this project to WebAssembly.

To build the WebAssembly for this smart contract:

1. Open a terminal shell on your computer, if needed.

1. Verify that you are in the `flipper` project folder.

1. Compile the `flipper` smart contract by running the following command:

   ```bash
   cargo +nightly contract build
   ```

   This command builds a WebAssembly binary for the `flipper` project, a metadata file that contains the contract Application Binary Interface (ABI), and a `.contract` file that you use to deploy the contract.
   For example, you should see output similar to the following:

   ```text
   Original wasm size: 47.9K, Optimized: 22.8K

   The contract was built in DEBUG mode.

   Your contract artifacts are ready. You can find them in:
   /Users/dev-doc/flipper/target/ink

   - flipper.contract (code + metadata)
   - flipper.wasm (the contract's code)
   - metadata.json (the contract's metadata)
   The `.contract` file can be used for deploying your contract to your chain.
   ```

   The `metadata.json` file in the `target/ink` directory describes all the interfaces that you can use to interact with this contract. This file contains several important sections:

   - The `spec` section includes information about the functions—like **constructors** and **messages**—that can be called, the **events** that are emitted, and any documentation that can be displayed. This section also includes a `selector` field that contains a 4-byte hash of the function name and is used to route contract calls to the correct functions.

   - The `storage` section defines all the **storage** items managed by the contract and how to access them.

   - The `types` section provides the custom **data types** used throughout the rest of the JSON.

## Start the Substrate smart contracts node

If you have successfully installed [`substrate-contracts-node`](https://github.com/paritytech/substrate-contracts-node), you can start a local blockchain node for your smart contract.

To start the preconfigured `contracts-node`:

1. Open a terminal shell on your computer, if needed.

1. Start the contracts node in local development mode by running the following command:

   ```bash
   substrate-contracts-node --dev
   ```

   You should see output in the terminal similar to the following:

   ```text
   2022-03-07 14:46:25 Substrate Contracts Node
   2022-03-07 14:46:25 ✌️  version 0.8.0-382b446-x86_64-macos
   2022-03-07 14:46:25 ❤️  by Parity Technologies <admin@parity.io>, 2021-2022
   2022-03-07 14:46:25 📋 Chain specification: Development
   2022-03-07 14:46:25 🏷  Node name: possible-plants-8517
   2022-03-07 14:46:25 👤 Role: AUTHORITY
   2022-03-07 14:46:25 💾 Database: RocksDb at /var/folders/2_/g86ns85j5l7fdnl621ptzn500000gn/T/substrateEdrJW9/chains/dev/db/full
   2022-03-07 14:46:25 ⛓  Native runtime: substrate-contracts-node-100 (substrate-contracts-node-1.tx1.au1)
   2022-03-07 14:46:25 🔨 Initializing Genesis block/state (state: 0xe9f1…4b89, header-hash: 0xa1b6…0194)
   2022-03-07 14:46:25 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
   2022-03-07 14:46:26 🏷  Local node identity is: 12D3KooWQ3P8BH7Z1C1ZoNSXhdGPCiPR7irRSeQCQMFg5k3W9uVd
   2022-03-07 14:46:26 📦 Highest known block at #0
   ```

   After a few seconds, you should see blocks being finalized.

   To interact with the blockchain, you need to connect to this node.
   You can connect to the node through a browser by opening the [Contracts UI](https://paritytech.github.io/contracts-ui).

1. Navigate to the [Contracts UI](https://paritytech.github.io/contracts-ui) in a web browser, then click **Yes allow this application access**.

1. Select **Local Node**.

   ![Connect to the local node](/media/images/tutorials/ink-workshop/connect-to-local-node.png)

## Deploy the contract

At this point, you have completed the following steps:

- Installed the packages for local development.
- Generated the WebAssembly binary for the `flipper` smart contract.
- Started the local node in development mode.
- Connected to a local node through the Contracts UI front-end.

The next step is to deploy the `flipper` contract on your Substrate chain.

However, deploying a smart contract on Substrate is a little different than deploying on traditional smart contract platforms.
For most smart contract platforms, you must deploy a completely new blob of the smart contract source code each time you make a change.
For example, the standard ERC20 token has been deployed to Ethereum thousands of times.
Even if a change is minimal or only affects some initial configuration setting, each change requires a full redeployment of the code.
Each smart contract instance consume blockchain resources equivalent to the full contract source code, even if no code was actually changed.

In Substrate, the contract deployment process is split into two steps:

- Upload the contract code to the blockchain.
- Create an instance of the contract.

With this pattern, you can store the code for a smart contract like the ERC20 standard on the blockchain once, then instantiate it any number of times.
You don't need to reload the same source code repeatedly, so your smart contract doesn't consume unnecessary resources on the blockchain.

### Upload the contract code

For this tutorial, you use the Contracts UI front-end to deploy the `flipper` contract on the Substrate chain.

To upload the smart contract source code:

1. Open to the [Contracts UI](https://paritytech.github.io/contracts-ui) in a web browser.

1. Verify that you are connected to the **Local Node**.

1. Click **Add New Contract**.

1. Click **Upload New Contract Code**.

1. Select an **Account** to use to create a contract instance.

   You can select any existing account, including a predefined account such as `alice`.

1. Type a descriptive **Name** for the smart contract, for example, Flipper Contract.

1. Browse and select or drag and drop the `flipper.contract` file that contains the bundled Wasm blob and metadata into the upload section.

   ![Upload the contract](/media/images/docs/tutorials/ink-workshop/upload-contract.png)

1. Click **Next** to continue.

### Create an instance on the blockchain

Smart contracts exist as an extension of the account system on the Substrate blockchain.
When you create an instance of this smart contract, Substrate creates a new `AccountId` to store any balance managed by the smart contract and to allow you to interact with the contract.

After you upload the smart contract and click **Next**, the Contracts UI displays information about the content of the smart contract.

To create the instance:

1. Review and accept the default **Deployment Constructor** options for the initial version of the smart contract.

1. Review and accept the default **Max Gas Allowed** of `200000`.

   ![Create an instance of the smart contract](/media/images/docs/tutorials/ink-workshop/create-instance.png)

1. Click **Next**.

   The transaction is now queued.
   If you needed to make changes, you could click **Go Back** to modify the input.

   ![Complete instantiation](/media/images/docs/tutorials/ink-workshop/complete-upload.png)

1. Click **Upload and Instantiate**.

   Depending on the account you used, you might be prompted for the account password.
   If you used a predefined account, you won't need to provide a password.

   ![Successfully deployed instance of the smart contract](/media/images/docs/tutorials/ink-workshop/first-contract.png)

## Call the smart contract

Now that your contract has been deployed on the blockchain, you can interact with it.
The default flipper smart contract has two functions—`flip()` and `get()`—and you can use the Contracts UI to try them out.

### get() function

You set the initial value of the `flipper` contract `value` to `false` when you instantiated the contract.
You can use the `get()` function to verify the current value is `false`.

To test the `get()` function:

1. Select any account from the **Account** list.

   This contract doesn't place restrictions on who is allowed to send the `get()` request.

1. Select **get(): bool** from the **Message to Send** list.

1. Click **Read**.

1. Verify that the value `false` is returned in the Call Results.

![Calling the get() function returns false](/media/images/docs/tutorials/ink-workshop/call-results-get.png)

### flip() function

The `flip()` function changes the value from `false` to `true`.

To test the `flip()` function:

1. Select any predefined account from the **Account** list.

   The `flip()` function is a transaction that changes the chain state and requires an account with funds to be used to execute the call.
   Therefore, you should select an account that has a predefined account balance, such as the `alice` account.

1. Select **flip()** from the **Message to Send** list.

1. Click **Call**.

1. Verify that the transaction is successful in the Call Results.

   ![Successful transaction](/media/images/docs/tutorials/ink-workshop/ssuccessful-transaction.png)

1. Select **get(): bool** from the **Message to Send** list.

1. Click **Read**.

1. Verify the new value is `true` in the Call Results.

   ![The get() function displays the current value is true](/media/images/docs/tutorials/ink-workshop/flipped-true.png)

## Next steps

Congratulations!

In this tutorial, you learned:

- How to create a new smart contract project using the ink! smart contract language.

- How to test and build a WebAssembly binary for a simple default smart contract.

- How to start a working Substrate-based blockchain node using the contracts node.

- How to deploy a smart contract by connecting to a local node and uploading and instantiating the contract.

- How to interact with a smart contract using the Contracts UI browser client.

Additional smart contract tutorials build on what you learned in this tutorial and lead you deeper into different stages of contract development.

You can find an example of the final code for this tutorial in the assets for the [ink-workshop](https://docs.substrate.io/assets/tutorials/ink-workshop/1.4-finished-code.rs).
You can learn more about smart contract development in the following topics:

- [Develop a smart contract](/tutorials/smart-contracts/develop-contract/)
- [Build an ERC20 token contract](/tutorials/smart-contracts/erc20-token/)
- [Troubleshoot smart contracts](tutorials/smart-contracts/sc-common-issues/)

If you experienced any issues with this tutorial, submit an issue, ask questions or provide feedback.

- [Submit an issue](https://github.com/substrate-developer-hub/substrate-docs/issues/new/choose).

- [Substrate Stack Exchange](https://substrate.stackexchange.com/).
