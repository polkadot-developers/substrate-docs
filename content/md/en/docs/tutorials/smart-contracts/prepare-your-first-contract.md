---
title: Prepare your first contract
description: Build and test a simple smart contract using the ink! smart contract language.
keywords:
---

As you learned in [Blockchain basics](/main-docs/fundamentals/blockchain-basics/) decentralized applications are most often written as **smart contracts**.
Although Substrate is primarily a framework and toolkit for building custom blockchains, it can also provide a platform
for smart contracts. This tutorial demonstrates how to build a basic smart contract to run on a Substrate-based chain.
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

- Interact with a smart contract using the `cargo-contract` CLI

## Update your Rust environment

For this tutorial, you need to add some Rust source code to your Substrate development environment.

To update your development environment:

1. Open a terminal shell on your computer.

1. Update your Rust environment by running the following command:

   ```bash
   rustup component add rust-src
   ```

1. Verify that you have the WebAssembly target installed by running the following command:

   ```bash
   rustup target add wasm32-unknown-unknown --toolchain nightly
   ```

   If the target is installed and up-to-date, the command displays output similar to the following:

   ```text
   info: component 'rust-std' for target 'wasm32-unknown-unknown' is up to date
   ```

## Install `cargo-contract` CLI Tool

`cargo-contract` is a command-line tool which you will use to build, deploy, and interact with your ink! contracts.

Note that in addition to Rust, installing `cargo-contract` requires a C++ compiler that supports C++17. Modern releases
of `gcc`, `clang`, as well as Visual Studio 2019+ should work.

1. Add the `rust-src` compiler compone

```bash
rustup component add rust-src
```

1. Install the latest version of `cargo-contract`

```bash
cargo install --force --locked cargo-contract --version 2.0.0-rc
```

1. Verify the installation and explore the commands available by running the following command:

   ```bash
   cargo contract --help
   ```

## Install the Substrate Contracts Node

To simplify this tutorial, you can [download](https://github.com/paritytech/substrate-contracts-node/releases)
a precompiled Substrate node for Linux or macOS. The precompiled binary includes the FRAME pallet for smart contracts by
default.

To install the contracts node on macOS or Linux:

1. Open the [Releases](https://github.com/paritytech/substrate-contracts-node/releases) page.

1. Download the appropriate compressed archive for your local computer.

1. Open the downloaded file and extract the contents to a working directory.

If you can't download the precompiled node, you can compile it locally with a command similar to the following:

```bash
cargo install contracts-node --git https://github.com/paritytech/substrate-contracts-node.git --tag <latest-tag> --force --locked
```

You can find the latest tag to use on the [Tags](https://github.com/paritytech/substrate-contracts-node/tags) page.

You can verify the installation buy running `substrate-contracts-node --version`.

## Create a new smart contract project

You are now ready to start developing a new ink! smart contract project.

To generate the files for an ink! project:

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

   ```text
   -rwxr-xr-x   1 dev-doc  staff   285 Mar  4 14:49 .gitignore
   -rwxr-xr-x   1 dev-doc  staff  1023 Mar  4 14:49 Cargo.toml
   -rwxr-xr-x   1 dev-doc  staff  2262 Mar  4 14:49 lib.rs
   ```

Like other Rust projects, the `Cargo.toml` file is used to provide package dependencies and configuration information.
The `lib.rs` file is used for the smart contract business logic.

### Explore the default project files

By default, creating a new ink! project generates some template source code for a very simple contract. This contract
has one function — `flip()` — that changes a Boolean variable from true to false and a second function — `get()` — that
gets the current value of the Boolean. The `lib.rs` file also contains two functions for testing that the contract works
as expected.

As you progress through the tutorial, you'll modify different parts of the starter code.
By the end of the tutorial, you'll have a more advanced smart contract that looks like the
[Flipper example](https://github.com/paritytech/ink/blob/master/examples/flipper/lib.rs).

To explore the default project files:

1. Open a terminal shell on your computer, if needed.

1. Change to project folder for the `flipper` smart contract, if needed:

1. Open the `Cargo.toml` file in a text editor and review the dependencies for the contract.

1. Open the `lib.rs` file in a text editor and review the macros, constructors, and functions defined for the contract.

   - The `#[ink::contract]` macro defines the entry point for your smart contract logic.
   - The `#[ink(storage)` macro defines a structure to stores a single boolean value for the contract.
   - The `new` and `default` functions initialize the boolean value to false.
   - There's a `#[ink(message)` macro with a `flip` function to change the state of the data stored for the contract.
   - There's a `#[ink(message)` macro with a `get` function to get the current state of the data stored for the contract.

### Test the default contract

At the bottom of the `lib.rs` source code file, there are simple test cases to verify the functionality of the contract.
These are annotated using the `#[ink(test)]` macro. You can test whether this code is functioning as expected using the
**offchain test environment**.

To test the contract:

1. Open a terminal shell on your computer, if needed.

1. Verify that you are in the `flipper` project folder, if needed.

2. Use the `test` subcommand to execute the default tests for the `flipper` contract by running the following command:

   ```bash
   cargo contract test
   ```

   The command should compile the program and display output similar to the following to indicate successful test
   completion:

   ```text
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
   cargo contract build
   ```

   This command builds a WebAssembly binary for the `flipper` project, a metadata file that contains the contract
   Application Binary Interface (ABI), and a `.contract` file that you use to deploy the contract. For example, you
   should see output similar to the following:

   ```text
   Original wasm size: 35.5K, Optimized: 11.9K

   The contract was built in DEBUG mode.

   Your contract artifacts are ready. You can find them in:
   /Users/dev-doc/flipper/target/ink

   - flipper.contract (code + metadata)
   - flipper.wasm (the contract's code)
   - metadata.json (the contract's metadata)
   ```

   The `.contract` file includes both the business logic and metadata. This is the file that tooling (e.g UIs) expect
   when you want to deploy your contract on-chain.

   The `metadata.json` file describes all the interfaces that you can use to interact with this contract. This file
   contains several important sections:

   - The `spec` section includes information about the functions—like **constructors** and **messages**—that can be
     called, the **events** that are emitted, and any documentation that can be displayed. This section also includes a
     `selector` field that contains a 4-byte hash of the function name and is used to route contract calls to the
     correct functions.

   - The `storage` section defines all the **storage** items managed by the contract and how to access them.

   - The `types` section provides the custom **data types** used by the contract.

## Start the Substrate Contracts Node

If you have [successfully installed the  `substrate-contracts-node`](TODO: previous section),
it's time to start a local node.

1. Start the contracts node in local development mode by running the following command:

   ```bash
   substrate-contracts-node --dev --log info,runtime::contracts=debug 2>&1
   ```

   The extra logging is useful for development.

   You should see output in the terminal similar to the following:

   ```text
   2023-01-30 23:08:49.835  INFO main sc_cli::runner: Substrate Contracts Node
   2023-01-30 23:08:49.836  INFO main sc_cli::runner: ✌️  version 0.23.0-87a3d76c880
   2023-01-30 23:08:49.836  INFO main sc_cli::runner: ❤️  by Parity Technologies <admin@parity.io>, 2021-2023
   2023-01-30 23:08:49.836  INFO main sc_cli::runner: 📋 Chain specification: Development
   2023-01-30 23:08:49.836  INFO main sc_cli::runner: 🏷  Node name: profuse-grandmother-6287
   2023-01-30 23:08:49.836  INFO main sc_cli::runner: 👤 Role: AUTHORITY
   2023-01-30 23:08:49.836  INFO main sc_cli::runner: 💾 Database: ParityDb at /tmp/substrateCu3FVo/chains/dev/paritydb/full
   2023-01-30 23:08:49.836  INFO main sc_cli::runner: ⛓  Native runtime: substrate-contracts-node-100 (substrate-contracts-node-1.tx1.au1)
   2023-01-30 23:08:54.570  INFO main sc_service::client::client: 🔨 Initializing Genesis block/state (state: 0x27d2…a1d8, header-hash: 0x6a05…1669)
   2023-01-30 23:08:54.573  INFO main sub-libp2p: 🏷  Local node identity is: 12D3KooWG4h1FpwAhybzyMxoEGQgY8SbrLb4F5FB6mCBZCY6u7W1
   2023-01-30 23:08:58.643  INFO main sc_service::builder: 📦 Highest known block at #0
   2023-01-30 23:08:58.643  INFO tokio-runtime-worker substrate_prometheus_endpoint: 〽️ Prometheus exporter started at 127.0.0.1:9615
   2023-01-30 23:08:58.644  INFO                 main sc_rpc_server: Running JSON-RPC HTTP server: addr=127.0.0.1:9933, allowed origins=None
   2023-01-30 23:08:58.644  INFO                 main sc_rpc_server: Running JSON-RPC WS server: addr=127.0.0.1:9944, allowed origins=None
   2023-01-30 23:09:03.645  INFO tokio-runtime-worker substrate: 💤 Idle (0 peers), best: #0 (0x6a05…1669), finalized #0 (0x6a05…1669), ⬇ 0 ⬆ 0
   2023-01-30 23:09:08.646  INFO tokio-runtime-worker substrate: 💤 Idle (0 peers), best: #0 (0x6a05…1669), finalized #0 (0x6a05…1669), ⬇ 0 ⬆ 0

   ```

   Note that no blocks will be produced until we send an extrinsic to the node. This is because the
   `substrate-contracts-node` uses [Manual Seal](TODO) as its consensus engine.

## Deploy the contract

At this point, you have completed the following steps:

- Installed the packages for local development.
- Generated the WebAssembly binary for the `flipper` smart contract.
- Started the local node in development mode.

The next step is to deploy the `flipper` contract on your Substrate chain.

However, deploying a smart contract on Substrate is a little different than deploying on traditional smart contract
platforms. For most smart contract platforms, you must deploy a completely new blob of the smart contract source code
each time you make a change. For example, the standard ERC20 token has been deployed to Ethereum thousands of times.
Even if a change is minimal or only affects some initial configuration setting, each change requires a full redeployment
of the code. Each smart contract instance consumes blockchain resources equivalent to the full contract source code,
even if no code was actually changed.

In Substrate, the contract deployment process is split into two steps:

- Upload the contract code to the blockchain.
- Create an instance of the contract.

With this pattern, you can store the code for a smart contract like the ERC20 standard on the blockchain once, then
instantiate it any number of times. You don't need to reload the same source code repeatedly, so your smart contract
doesn't consume unnecessary resources on the blockchain.

### Upload the contract code

For this tutorial, you use the Contracts UI front-end to deploy the `flipper` contract on the Substrate chain.

To upload the smart contract source code:

1. Open the [Contracts UI](https://contracts-ui.substrate.io/?rpc=ws://127.0.0.1:9944) in a web browser.

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

2. Review and accept the default **Max Gas Allowed**.

   ![Create an instance of the smart contract](/media/images/docs/tutorials/ink-workshop/create-instance.png)

3. Click **Next**.

   The transaction is now queued.
   If you needed to make changes, you could click **Go Back** to modify the input.

   ![Complete instantiation](/media/images/docs/tutorials/ink-workshop/complete-upload.png)

4. Click **Upload and Instantiate**.

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

   ![Successful transaction](/media/images/docs/tutorials/ink-workshop/successful-transaction.png)

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

You can learn more about smart contract development in the following topics:

- [Develop a smart contract](/tutorials/smart-contracts/develop-a-smart-contract/)
- [Build an ERC20 token contract](/tutorials/smart-contracts/build-a-token-contract/)
- [Troubleshoot smart contracts](/tutorials/smart-contracts/troubleshoot-smart-contracts/)
