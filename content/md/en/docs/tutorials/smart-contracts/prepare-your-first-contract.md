---
title: Prepare your first contract
description: Build and test a simple smart contract using the ink! smart contract language.
keywords:
---

As you learned in [Blockchain basics](/main-docs/learn/blockchain-basics/) decentralized applications are most often written as **smart contracts**.

Although Substrate is primarily a framework and toolkit for building custom blockchains, it can also provide a platform
for smart contracts.

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

Note that in addition to Rust, installing `cargo-contract` requires a C++ compiler that supports C++17.

Modern releases of `gcc`, `clang`, as well as Visual Studio 2019+ should work.

1. Add the `rust-src` compiler component:

```bash
rustup component add rust-src
```

2. Install the latest version of `cargo-contract`:

```bash
cargo install --force --locked cargo-contract --version 2.0.0-rc
```

3. Verify the installation and explore the commands available by running the following command:

```bash
cargo contract --help
```

## Install the Substrate Contracts Node

To simplify this tutorial, you can [download](https://github.com/paritytech/substrate-contracts-node/releases) a
precompiled Substrate node for Linux or macOS.

The precompiled binary includes the FRAME pallet for smart contracts by default.

To install the contracts node on macOS or Linux:

1. Open the [Releases](https://github.com/paritytech/substrate-contracts-node/releases) page.

1. Download the appropriate compressed archive for your local computer.

1. Open the downloaded file and extract the contents to a working directory.

If you can't download the precompiled node, you can compile it locally with a command similar to the following. 
You can find the latest tag on the [Releases](https://github.com/paritytech/substrate-contracts-node/releases) page:

```bash
cargo install contracts-node --git https://github.com/paritytech/substrate-contracts-node.git --tag <latest-tag> --force --locked
```

You can find the latest tag to use on the [Tags](https://github.com/paritytech/substrate-contracts-node/tags) page.

You can verify the installation by running `substrate-contracts-node --version`.

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

By default, creating a new ink! project generates some template source code for a very simple contract.

This contract has one function — `flip()` — that changes a Boolean variable from true to false and a second function —
`get()` — that gets the current value of the Boolean.

The `lib.rs` file also contains two functions for testing that the contract works as expected.

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

1. Use the `test` subcommand to execute the default tests for the `flipper` contract by running the following command:

   ```bash
   cargo test
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
   Application Binary Interface (ABI), and a `.contract` file that you use to deploy the contract.

   For example, you should see output similar to the following:

   ```text
   Original wasm size: 35.5K, Optimized: 11.9K

   The contract was built in DEBUG mode.

   Your contract artifacts are ready. You can find them in:
   /Users/dev-doc/flipper/target/ink

   - flipper.contract (code + metadata)
   - flipper.wasm (the contract's code)
   - flipper.json (the contract's metadata)
   ```

   The `.contract` file includes both the business logic and metadata. This is the file that tooling (e.g UIs) expect
   when you want to deploy your contract on-chain.

   The `.json` file describes all the interfaces that you can use to interact with this contract. This file
   contains several important sections:

   - The `spec` section includes information about the functions—like **constructors** and **messages**—that can be
     called, the **events** that are emitted, and any documentation that can be displayed. This section also includes a
     `selector` field that contains a 4-byte hash of the function name and is used to route contract calls to the
     correct functions.

   - The `storage` section defines all the **storage** items managed by the contract and how to access them.

   - The `types` section provides the custom **data types** used by the contract.

## Start the Substrate Contracts Node

If you have [successfully installed the  `substrate-contracts-node`](tutorials/smart-contracts/prepare-your-first-contract/#install-the-substrate-contracts-node),
it's time to start a local node.

1. Start the contracts node in local development mode by running the following command:

   ```bash
   substrate-contracts-node --log info,runtime::contracts=debug 2>&1
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

   Note that no blocks will be produced unless we send an extrinsic to the node. This is because the
   `substrate-contracts-node` uses `Manual Seal` as its consensus engine.

## Deploy the contract

At this point, you have completed the following steps:

- Installed the packages for local development.
- Generated the WebAssembly binary for the `flipper` smart contract.
- Started the local node in development mode.

The next step is to deploy the `flipper` contract on your Substrate chain.

However, deploying a smart contract on Substrate is a little different than deploying on traditional smart contract
platforms.

For most smart contract platforms, you must deploy a completely new blob of the smart contract source code each time you
make a change.

For example, the standard ERC20 token has been deployed to Ethereum thousands of times.

Even if a change is minimal or only affects some initial configuration setting, each change requires a full redeployment
of the code.

Each smart contract instance consumes blockchain resources equivalent to the full contract source code, even if no code
was actually changed.

In Substrate, the contract deployment process is split into two steps:

- Upload the contract code to the blockchain.
- Create an instance of the contract.

With this pattern, you can store the code for a smart contract like the ERC20 standard on the blockchain once, then
instantiate it any number of times.

You don't need to reload the same source code repeatedly, so your smart contract doesn't consume unnecessary resources
on the blockchain.

### Uploading the ink! Contract Code

For this tutorial, you use the `cargo-contract` CLI tool to `upload` and `instantiate` the `flipper` contract on a
Substrate chain.

1. Start your node using `substrate-contracts-node --log info,runtime::contracts=debug 2>&1`

1. Go to the `flipper` project folder.

1. Build the contract using `cargo contract build`.

1. Upload and instantiate your contract using:

   ```bash
   cargo contract instantiate --constructor new --args "false" --suri //Alice --salt $(date +%s)
   ```

   Some notes about the command:
   - The `instantiate` command will do both the `upload` and `instantiate` steps for you.

   - We need to specify the contract constructor to use, which in this case is `new()`

   - We need to specify the argument to the constructor, which in this case is `false`

   - We need to specify the account uploading and instantiating the contract, which in this case is the default
     development account of `//Alice`

   - During development we may want to upload the instantiate the same contract multiple times, so we specify a `salt`
     using the current time. Note that this is optional.

   After running the command confirming that we're happy with the gas estimatation we should see something like this:

   ```text
   Dry-running new (skip with --skip-dry-run)
      Success! Gas required estimated at Weight(ref_time: 328660939, proof_size: 0)
  Confirm transaction details: (skip with --skip-confirm)
   Constructor new
          Args false
     Gas limit Weight(ref_time: 328660939, proof_size: 0)
  Submit? (Y/n):
        Events
         Event Balances ➜ Withdraw
           who: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
           amount: 98.986123μUNIT
         Event System ➜ NewAccount
           account: 5GRAVvuSXx8pCpRUDHzK6S1r2FjadahRQ6NEgAVooQ2bB8r5
         ... snip ...
         Event TransactionPayment ➜ TransactionFeePaid
           who: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
           actual_fee: 98.986123μUNIT
           tip: 0UNIT
         Event System ➜ ExtrinsicSuccess
           dispatch_info: DispatchInfo { weight: Weight { ref_time: 2827629132, proof_size: 0 }, class: Normal, pays_fee: Yes }

      Contract 5GRAVvuSXx8pCpRUDHzK6S1r2FjadahRQ6NEgAVooQ2bB8r5
   ```

We will need the `Contract` address to `call` the contract, so make sure you don't lose it.


## Calling the Deployed ink! Contract

We can not only `upload` and `instantiate` contracts using `cargo-contract`, we can also `call` them!

### `get()` Message

When we initialized the contract we set the initial value of the `flipper` to `false`. We can confirm this by calling
the `get()` message.

Since we are only reading from the blockchain state (we're not writing any new data) we can use the `--dry-run` flag to
avoid submitting an extrinsic.

```bash
cargo contract call --contract $INSTANTIATED_CONTRACT_ADDRESS --message get --suri //Alice --dry-run
```

Some notes about the command:
  - The address of the contract we want to call had to be specified using the `--contract` flag

  - This can be found in the output logs of the `cargo contract instantiate` command

  - We need to specify the contract message to use, which in this case is `get()`

  - We need to specify the account callling the contract, which in this case is the default development account of
     `//Alice`

  - We specify `--dry-run` to avoid submitting an extrinsic on-chain

After running the command should see something like this:

```text
Result Success!
Reverted false
    Data Tuple(Tuple { ident: Some("Ok"), values: [Bool(false)] })
```

We're interested in the `value` here, which is `false` as expected.

### `flip()` Message

The `flip()` message changes the storage value from `false` to `true` and vice versa.

To call the `flip()` message we will need to submit an extrinsic on-chain because we are altering the state of the
blockchain.

To do this we can use the following command:

```bash
cargo contract call --contract $INSTANTIATED_CONTRACT_ADDRESS --message flip --suri //Alice
```

Notice that we changed the message to `flip` and removed the `--dry-run` flag.

After running we expect to see something like:

```text
Dry-running flip (skip with --skip-dry-run)
    Success! Gas required estimated at Weight(ref_time: 8013742080, proof_size: 262144)
Confirm transaction details: (skip with --skip-confirm)
     Message flip
        Args
   Gas limit Weight(ref_time: 8013742080, proof_size: 262144)
Submit? (Y/n):
      Events
       Event Balances ➜ Withdraw
         who: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
         amount: 98.974156μUNIT
       Event Contracts ➜ Called
         caller: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
         contract: 5GQwxP5VTVHwJaRpoQsK5Fzs5cERYBzYhgik8SX7VAnvvbZS
       Event TransactionPayment ➜ TransactionFeePaid
         who: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
         actual_fee: 98.974156μUNIT
         tip: 0UNIT
       Event System ➜ ExtrinsicSuccess
         dispatch_info: DispatchInfo { weight: Weight { ref_time: 1410915697, proof_size: 13868 }, class: Normal, pays_fee: Yes }
```

If we call the `get()` message again we can see that the storage value was indeed flipped!

```text
Result Success!
Reverted false
    Data Tuple(Tuple { ident: Some("Ok"), values: [Bool(true)] })
```

## Next steps

Congratulations!

In this tutorial, you learned:

- How to create a new smart contract project using the ink! smart contract language.

- How to test and build a WebAssembly binary for a simple default smart contract.

- How to start a working Substrate-based blockchain node using the contracts node.

- How to deploy a smart contract by connecting to a local node and uploading and instantiating the contract.

- How to interact with a smart contract using the `cargo-contract` CLI tool.

Additional smart contract tutorials build on what you learned in this tutorial and lead you deeper into different stages
of contract development.

You can learn more about smart contract development in the following topics:

- [Develop a smart contract](/tutorials/smart-contracts/develop-a-smart-contract/)
- [Build an ERC20 token contract](/tutorials/smart-contracts/build-a-token-contract/)
- [Troubleshoot smart contracts](/tutorials/smart-contracts/troubleshoot-smart-contracts/)
