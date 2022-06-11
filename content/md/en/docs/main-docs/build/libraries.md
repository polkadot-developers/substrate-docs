---
title: Introduction to libraries
description: 
keywords:
---

In working with the node template, you don’t need to know anything about the underlying architecture or libraries being used because the basic components are already assembled and ready to use.  
However, if you want to design and build a custom blockchain, you might want to be familiar with the libraries available and know what these different libraries do.

In [Architecture](/fundamentals/architecture/), you learned about the core components of a Substrate node and how different parts of the node take on different responsibilities.
On a more technical level, the separation of duties between different layers of a node are reflected in the core libraries used to build a Substrate-based blockchain.
The following diagram illustrates how the libraries mirror the outer node and runtime responsibilities and how a library of **primitives** provides the communication layer between the two.

![Core node libraries for the outer node and runtime](/media/images/docs/libraries.png)

## Core node libraries

The libraries that enable a Substrate node to handle its network responsibilities,including consensus and block execution are Rust crates that use the `sc_` prefix in the crate name.
For example, the [`sc_service`](https://docs.substrate.io/rustdocs/latest/sc_service/index.html) library is responsible for building the networking layer for Substrate blockchains, managing the communication between the network participants and the transaction pool.

The libraries that provide the communication layer between the outer node and the runtime are Rust crates that use the `sp_` prefix in the crate name.
These libraries orchestrate the activities that require outer node and runtime to interact.
For example, the[`sp_std`](https://docs.substrate.io/rustdocs/latest/sp_std/index.html) libraris takes useful primitives from Rust's standard library and makes them usable with any code that depends on the runtime.

The libraries that enable you to build the runtime logic and to encode and decode the information passed into and out of the runtime are Rust crates that use the `frame_` prefix in the crate name.
The `frame_*` libraries provide the infrastructure for the runtime.
For example, the [`frame_system`](https://docs.substrate.io/rustdocs/latest/frame_system/index.html) library provides a basic set of functions for interacting with other Substrate components and[`frame_support`](https://docs.substrate.io/rustdocs/latest/frame_support/index.html) enables you to  declare runtime storage items, errors, and events.

In addition to the infrastructure provided by the `frame_*` libraries, the runtime can include one or more `pallet_*` libraries.
Each Rust crate that uses the `pallet_` prefix represents a single FRAME module.
In most cases, you use the `pallet_*` libraries to assemble the functionality you want to incorporate in the blockchain to suit your project.

You can build a Substrate runtime without using the `frame_*` or `pallet_*` libraries using the primitives exposed by the `sp_*` core libraries.
However, the `frame_*` or `pallet_*` libraries provide the most efficient path to composing a Substrate runtime.

## Modular architecture

The separate of the core libraries provides a flexible and modular architecture for writing the blockchain logic.
The primitives library provides a foundation that both the outer node and the runtime can build on without communicating directly with each other.
Primitive types and traits are exposed in their own separate crates, so they are available to the outer node and runtime components without introducing cyclic dependency issues.

[Visualizing the Substrate code base](https://octo-repo-visualization.vercel.app/?repo=paritytech%2Fsubstrate).

## Front-end libraries

In addition to the core libraries that enable you to build a Substrate-based blockchain, there are client libraries that you can use to interact with Substrate nodes.
You can use the client libraries to build application-specific front-ends.
In general, the capabilities that the client libraries expose are implemented on top of [Substrate remote procedure call (RPC) APIs](./frontend#RPC-APIs).

| Name | Description  | Language  | Use case  |
|---|---|---|---|
| [Polkadot JS API](https://polkadot.js.org/docs/api) | A Javascript library for interacting with a Substrate chain. | Javascript | Applications that need to dynamically adapt to changes in a node, such as for block explorers or chain-agnostic interfaces. 
| [Polkadot JS extension](https://polkadot.js.org/docs/extension/) | An API for interacting with a browser extension build with the Polkadot JS API. | Javascript | Browser extensions.
| [`Substrate Connect`](https://paritytech.github.io/substrate-connect/) | A library for developers to build applications that act as their own light client for their target chain. It also provides a browser extension designed to connect to multiple chains from a single application (web or desktop browser). | Javascript | Any browser application.
| [`subxt`](https://github.com/paritytech/subxt/) | Short for "submit extrinsics", `subxt` is a library that generates a statically typed Rust interface to interact with a node's RPC APIs based on a target chain's metadata. | Rust | Building lower level applications, such as non-browser graphic user interfaces, chain-specific CLIs or user facing applications that require type-safe communication between the node and the generated interface, preventing users from constructing transactions with bad inputs or submitting calls that don't exist. 
| [`txwrapper`](https://github.com/paritytech/txwrapper) | A Javascript library for offline generation of Substrate transactions. | Javascript | Write scripts to generate signed transactions to a node, useful for testing and decoding transactions.

## Where to go next

Now that you are familiar with the libraries used to build and interact with Substrate nodes, you might want to explore the libraries in more depth.
To learn more about the technical details for any library, you should review the [Rust API](/rustdocs/) documentation for that library.
