---
title: Build a smart contract
slug: /tutorials/get-started/smart-contract/
description: 
keywords:
  - smart contracts
  - erc20
  - wasm
difficulty: 2
duration: 2.5 Hours
relevantSkills:
  - ink!
  - Smart Contracts
---

As you learned in [Blockchain basics](/main-docs/fundamentals/blockchain-basics/) decentralized applications are most often written as **smart contracts**.
Although Substrate is primarily a framework and toolkit for building custom blockchains, it can also provide a platform for smart contracts.
This tutorial demonstrates how to build a basic smart contract to run on a Substrate-based chain. 
In this tutorial, you'll explore using ink! as a programming language for writing Rust-based smart contracts.

## Before you begin

Before you begin, verify the following:

* You have good internet connection and access to a shell terminal on your local computer.

* You are generally familiar with software development and using command-line interfaces.

* You are generally familiar with blockchains and smart contract platforms.

* You have installed Rust and set up your development environment as described in [Install](/main-docs/install/).

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

* Learn how to create a smart contract project.

* Build and test a smart contract using the ink! smart contract language.

* Deploy a smart contract on a local Substrate node.

* Interact with a smart contract through a browser.

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

To simplify this tutorial, you can install a Substrate node that is preconfigured with the FRAME pallet for smart contracts.
The`pallet-contracts` is included by default in the Substrate `contracts-node` sample code.\

To install the contracts node:

1. Open a terminal shell on your computer.

1. Install the contracts node by running the following command:
    
    ```bash
    cargo install contracts-node --git https://github.com/paritytech/substrate-contracts-node.git --tag v0.8.0 --force --locked
    ```

    Note the tag is subject to change.
    To see if a new tag is available, check the [substrate-contracts-node repository](https://github.com/paritytech/substrate-contracts-node/tags).


## Install additional packages

After compiling the contrcts node, you need to install two additional packages:

* The WebAssembly  **binaryen** package for your operating system to optimize the WebAssembly bytecode for the contract.
* The cargo-contract command line interface you'll use to set up smart contract projects.

### Install the WebAssemvly binary

To install the **binaryen** package:

1. Open a terminal shell on your computer.

1. Use the approproate package manager for your operating system to install the package.
    
    For example:
    
    ```ubuntu | debian
    sudo apt install binaryen
    ```
    
    ```macOS
    brew install binaryen
    ```
    
    If you an operating system that's not listed, you can download the `binaryen` release directly from [WebAssebly releases](https://github.com/WebAssembly/binaryen/releases).

### Install the cargo-contract package

After you've installed the WebAssembly `binaryen` package, you can install the `cargo-contract` package.
The `cargo-contract` package provides a command-line interface for working with smart contracts using the ink! language.

1. Open a terminal shell on your computer.

1. Install `cargo-contract` by running the following command:
    
    ```bash
    cargo install cargo-contract --vers ^0.17 --force --locked
    ```

1. Verify the installation and explore the commands avilable by running the following command:
    
    ```bash
    cargo contract --help
    ```

## Create a new smart contract project

You are now ready to start developing a new smart contract project.

To generate the files for a smart contract project:

1. Open a terminal shell on your computer.

1. Create a new project folder named `flipper`  by running the following command:
    
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
    
    -rwxr-xr-x   1 docs  staff   285 Mar  4 14:49 .gitignore
    -rwxr-xr-x   1 docs  staff  1023 Mar  4 14:49 Cargo.toml
    -rwxr-xr-x   1 docs  staff  2262 Mar  4 14:49 lib.rs
    
    Like other Rust projects, the `Cargo.toml` file is used to provides package dependencies and configuration information. 
    The lib.rs file is used for the smart contract business logic.

### Explore the default project source code

By default, creating a new smart contract project generates some template source code for a very simple contract that has one function—`flip()`—that changes a Boolean variable from true to false.

As you progress through the tutorial, you'll modify different parts of the starter code.
By the end of the tutorial, you'll have a more advanced smart contract that looks like the [Flipper example](https://github.com/paritytech/ink/blob/v3.0.0-rc9/examples/flipper/lib.rs).

### Test the default contract

At the bottom of the `lib.rs` source code file, there are simple test cases to verify the functionality of the contract. 
You can test whether this code is functioning as expected using the **off-chain test environment**.

To test the contract:

1. Open a terminal shell on your computer, if needed.

1. Verify that you are in the `flipper` project folder.

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

After testing the default contract, you are ready to compile this project to WebAssmebly.

To build the WebAssmeby for this smart contract:

1. Open a terminal shell on your computer, if needed.

1. Verify that you are in the `flipper` project folder.

1. Compile the `flipper` smart contract vy running the following command: 
    
    ```bash
    cargo +nightly contract build
    ```
    
    This command builds a WebAssembly binary for the `flipper` project, a metadata file that contains the Contract Application Binary Interface (ABI), and a `.contract` file that contains both files. 
    The `.contract` file can be used for deploying your contract to your chain. 

1. Check the `target` folder for your smart contract.
    
    The `target` folder contains the following files:


```bash
target
  └─ ink
    └─ release
      └─ ...
    └─ .rustc_info.json
    └─ CACHEDIR.TAG
    └─ flipper.contract
    └─ flipper.wasm
    └─ metadata.json
```

Let's take a look at the structure of `metadata.json`:

```JSON
{
  "metadataVersion": "0.1.0",
  "source": {...},
  "contract": {...},
  "spec": {
    "constructors": [...],
    "docs": [],
    "events": [],
    "messages": [...],
  },
  "storage": {...},
  "types": [...]
}
```

This file describes all the interfaces that can be used to interact with your contract:

- `types` provides the custom **data types** used throughout the rest of the JSON.
- `storage` defines all the **storage** items managed by your contract and how to ultimately access
  them.
- `spec` stores information about the callable functions like **constructors** and **messages** a
  user can call to interact with the contract. It also has helpful information like the **events**
  that are emitted by the contract or any **docs**.

If you look closely at the constructors and messages, you will also notice a `selector` which
contains a 4-byte hash of the function name and is used to route your contract calls to the correct
functions.

In the next section we will start a
[Substrate Smart Contracts node](https://github.com/paritytech/substrate-contracts-node) and
configure the [Contracts UI](https://github.com/paritytech/contracts-ui) to interact with it.

## Running a Substrate Smart Contracts Node

After successfully installing [`substrate-contracts-node`](https://github.com/paritytech/substrate-contracts-node),
you can start a local development chain by running:

```bash
substrate-contracts-node --dev
```

![Substrate Smart Contracts Node](/assets/tutorials/ink-workshop/start-canvas-node.png)

You should start seeing blocks being produced by your node in your terminal.

## Deploying your Contract

Go to the [hosted version of Contracts UI](https://paritytech.github.io/contracts-ui) to interact with
your node. You first need to configure the UI to connect to it:

- Click on the dropdown selector at top left corner.
- Choose the Local Node.

![Connect to local node](/assets/tutorials/ink-workshop/canvas-connect-to-local.png)

Now that we have generated the Wasm binary from our source code and connected to a local node, we want
to deploy this contract onto our Substrate blockchain.

Smart contract deployment on Substrate is a little different than on traditional smart contract
blockchains.

Whereas a completely new blob of smart contract source code is deployed each time you push a
contract on other platforms, Substrate opts to optimize this behavior. For example, the standard
ERC20 token has been deployed to Ethereum thousands of times, sometimes only with changes to the
initial configuration (through the Solidity `constructor` function). Each of these instances take
up space on the blockchain equivalent to the contract source code size, even though no code was
actually changed.

In Substrate, the contract deployment process is split into two steps:

1. Putting your contract code on the blockchain
2. Creating an instance of your contract

With this pattern, contract code like the ERC20 standard can be put on the blockchain one single
time, but instantiated any number of times. No need to continually upload the same source code over
and waste space on the blockchain.

### 1. Upload Contract Code

Here we will upload the contract code and instantiate one copy of the contract on the blockchain (
which is usually why we upload the contract code in the first place):

- Click the **Add New Contract** button in the sidebar.
- Click the **Upload New Contract Code** button in the Add New Contract page.
- Choose an **Instantiation account** (e.g. ALICE).
- Give the contract a descriptive **Name** (e.g. Flipper Contract).
- Drag the `flipper.contract` file that contains the bundled Wasm blob and metadata into the drag
  & drop area. You will see the UI parse the metadata and enabling the button that takes you to the next step.
- Click the **Next** button

![Flipper Instantiate Contract 01](/assets/tutorials/ink-workshop/flipper-instantiate-01.png)

### 2. Instantiate a Contract on the Blockchain

Smart contracts exist as an extension of the account system on the blockchain. Thus creating an
instance of this contract will create a new `AccountId` which will store any balance managed by the
smart contract and allow us to interact with the contract.

Now a screen displays the information that represents our smart contract. We are going to
instantiate a copy of the smart contract:

- Accept the default options for the contract **Deployment Constructor**.
- Accept the default options **Max Gas Allowed** of `200000`.
- Click on `Next`

![Flipper Instantiate Contract 02](/assets/tutorials/ink-workshop/flipper-instantiate-02.png)

The transaction is now queued, review your data and click **Upload and Instantiate** or go back and modify your inputs.

![Flipper Instantiate Contract 03](/assets/tutorials/ink-workshop/flipper-instantiate-03.png)

When you click **Upload and Instantiate** you should see
the extrinsic `instantiateWithCode` is processing, and a flurry of events appear including the
creation of a new account (`system.NewAccount`) and the instantiation of the contract
(`contracts.Instantiated`).
You will be redirected to a new page, where you can interact with the newly created contract instance.

![Flipper Instantiate Success](/assets/tutorials/ink-workshop/flipper-instantiate-04.png)

## Calling your Contract

Now that your contract has been fully deployed, we can start interacting with it! Flipper only has
two functions, `flip()` and `get()` so we will show you what it's like to play with both of them.

### 1. get() function

We set the initial value of the Flipper contract
`value` to `false` when we instantiated the contract. Let's check that this is the case.

In the **Message to Send** section, select the "**get(): bool**" message and accept the default
values for the other options.

Press **"Read"** and confirm that it returns the value `false`:

![An image of Flipper RPC call with false](/assets/tutorials/ink-workshop/flipper-false.png)

### 2. flip() function

So let's make the value turn `true` now!

The alternative message to send with the UI is `flip()`. Again, accept the default values for the other options and click **Call**

![An image of a Flipper transaction](/assets/tutorials/ink-workshop/send-as-transaction.png)

If the transaction was successful, we should then be able to go back to the `get()` function and see our updated storage:

![An image of Flipper RPC call with true](/assets/tutorials/ink-workshop/flipper-true.png)

Woohoo! You deployed your first smart contract!

### 3. Moving Forward

We will not go over these setup and deployment steps again, but you can use them throughout the
tutorial to deploy certain contract on-chain.

The rest of the tutorial will have **template code** which you will use to walk through the
different steps of contract development. Each template comes with a fully designed suite of tests
that should pass if you programmed your contract correctly. Before you move on from a section, make
sure that you run:

```bash
cargo +nightly test
```

and that the tests all execute successfully without any warnings.

You need not deploy your contract between each section, but if we ask you to deploy your contract,
you will need to follow these same steps you have done with the Flipper contract.

## Troubleshooting

Here are solutions to some of the common problems you may come across:

### 1. Unexpected Epoch Change

There is a known issue with the Substrate block production (BABE) on a running chain. If you stop
your node for too long (closing the terminal, putting your computer to sleep, etc...), you will get
the following error:

```bash
ClientImport("Unexpected epoch change")
```

To solve this you will need to restart your node with: `substrate-contracts-node --dev --tmp`. At that point, you will
need to re-deploy any contracts and re-do any steps that you may have done before on your node. As
long as you keep your node running, you should face no issues.

### 2. Old Contracts in Local Storage

**Contracts UI** uses its own local storage to track the contracts that you have deployed. This means
that if you deploy a contract using the UI, and then purge your node, you will be prompted to
reset your local storage and please do so. And then re-deploy any contracts and re-do any steps that
you may have done before on your node.

### 3. Other Issues

If you run into any other issues during this tutorial, please [report an issue](https://github.com/substrate-developer-hub/substrate-contracts-workshop/issues)!
