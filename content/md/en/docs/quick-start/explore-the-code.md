---
title: Explore the code
description: Get a closer look at the contents of the node template.
keywords:
---

In [Start a node](/quick-start/start-a-node/), you compiled and started a local Substrate node in development mode.
This particular node—the `substrate-node-template`—provides a simplified environment with only a few common modules to get you started.
Without going too deeply into the details, there's a lot you can learn from exploring the basic building blocks of the node template code.

## About the node template

The node template includes some default blockchain essentials, like peer-to-peer networking, a simple consensus mechanism, and transaction handling.
The node template also includes some basic functionality for working with accounts, balances, and transaction fees and performing administrative actions.
This core set of functionality is provided through several predefined modules—called **pallets**—that implement specific features.

For example, the following core modules are predefined in the node template:

- `pallet_balances` for managing account assets and transfers between accounts.
- `pallet_transaction_payment` for managing transaction fees for the transactions performed.
- `pallet_sudo` for performing operations that require administrative permissions.

The node template also provides a starter `pallet_template` that illustrates how to implement features in custom pallets.

Now that you have an overview of the features included in the node template, let's take a closer look at the code in the `substrate-node-template` directory and its subdirectories.

## Manifest files

Because Substrate is a Rust-based framework, each package has a manifest file—the `Cargo.toml` file—that contains information required to compile the package.
If you open the `Cargo.toml` file located in the root directory for the `substrate-node-template`, you can see that it describes the member packages that make up the node template workspace.
For example:

```toml
[workspace]
members = [
    "node",
    "pallets/template",
    "runtime",
]
[profile.release]
panic = "unwind"
```

From this manifest, you see that the node template workspace includes three packages:

- The `node` package provides Rust modules for many core blockchain services like peer-to-peer networking, block authoring, block finalization, and transaction pool management.
- The `template` package in the `pallets` subdirectory is the starter template that illustrates how to implement features when building your own custom modules.
- The `runtime` package provides all of the application logic for handling accounts, balances, transaction fees, and other features that have been included in the node template.

Each member package also has its own manifest—its own `Cargo.toml` file—that contains package-specific information, including dependencies and configuration settings, that are required to compile that member package.
For example, the `Cargo.toml` file for the `node` member of the workspace specifies the name of the package as `node-template` and lists the core libraries and primitives that enable the node template to provide essential blockchain services.
You'll learn more about libraries and primitives in [Architecture and Rust libraries](/learn/architecture).
For now, it's enough to understand the importance of the manifest in describing dependencies and other critical information for each package.

If you open the `runtime/Cargo.toml` file and the `pallets/template/Cargo.toml`, you’ll see different libraries and primitives as dependencies, but you’ll get a general sense of what’s required to compile these packages.
For example, the manifest for the runtime lists all of the pallets—including the `frame_system`, `frame_support` and previously-mentioned `pallet_balances`, `pallet_transaction_payment`, and `pallet_sudo` modules—that comprise the default runtime for the node template.

## Core client source code

One of the most important aspects of Substrate is that nodes consist of two main parts: the **core client** and the **runtime**.
The node template also consists of separate packages for core client services in the the `node/src` directory and the runtime in the `runtime/src` directory.

By default, the `node/src` directory includes the following Rust modules:

- `benchmarking.rs`
- `chain_spec.rs`
- `cli.rs`
- `command.rs`
- `lib.rs`
- `main.rs`
- `rpc.rs`
- `service.rs`

Most core client service are encapsulated in the `node/src/service.rs` Rust module.
It's rare that you need to modify this file or the other Rust modules in the `node/src` directory.
A file you are likely to modify is the `chain_spec.rs` file.
The `chain_spec.rs` file describes the configuration of the default Development and Local Testnet chains, including information about default pre-funded development accounts and the nodes that are preconfigured with the authority to produce blocks.
If you create a custom chain, you use this file to identify the network that a node connects to and the other nodes that the local node communicates with.

## Default node template runtime

Because Substrate provides a modular and flexible framework for building blockchains, you can make changes to any package in the workspace.
However, most application development work is done in the runtime and in the modules—the pallets—used to construct the runtime.
Before you start to customize the runtime for your own project, you should spend a little time exploring what’s in the default node template.

### Default manifest

You've already seen how the default manifest for the runtime lists the default dependencies and features for the runtime in lines similar to the following:

```rust
pallet-balances = { version = "4.0.0-dev", default-features = false, git = "https://github.com/paritytech/polkadot-sdk.git", branch = "polkadot-vX.Y.Z" }

pallet-sudo = { version = "4.0.0-dev", default-features = false, git = "https://github.com/paritytech/polkadot-sdk.git", branch = "polkadot-vX.Y.Z" }

pallet-transaction-payment = { version = "4.0.0-dev", default-features = false, git = "https://github.com/paritytech/polkadot-sdk.git", branch = "polkadot-vX.Y.Z" }
```

There are also dependencies on core packages—such as `frame-system`, `frame-support`, and `frame-executive`.
You'll learn more about these core services in [Core FRAME services](/learn/runtime-development/#core-frame-services).
For now, just notice that these and other modules are required to compile the runtime for the node template.

### Default source code

The main source code for the runtime is located in the `runtime/src/lib.rs` file.
If you open this file in your code editor, it might seen complicated at first.
There are some nuances that are covered in other parts of the documentation, but in essence, the source code does the following:

- Imports the frame_system and frame_support core services.
- Specifies version information for the runtime.
- Declares the pallets to include.
- Declares the types and parameters for each pallet included.
- Sets constant and variable values for each pallet included.
- Implements the `Config` trait for each pallet included.
- Constructs the runtime from the pallets included.
- Prepares the benchmarking framework for evaluating pallet performance.
- Implements the interfaces that enable the core client to call into the runtime.

You’ll learn more about constructing the runtime, defining benchmarks, and using runtime interfaces in topics in the [Build](/build/) and [Test](/test/) sections.
For now, you only need to have a general sense of how the runtime is composed and how the default pallets are implemented using the `Config` trait.
