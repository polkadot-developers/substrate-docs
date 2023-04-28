---
title: Architecture and Rust libraries
description: Introduces the core components of a Substrate node.
keywords:
---

As noted in [Blockchain basics](/learn/blockchain-basics), a blockchain relies on a decentralized network of computers—called nodes—that communicate with each other.

Because the node is a core component of any blockchain, it’s important to understand what makes a Substrate node unique, including the core services and libraries that are provided by default and how the node can be customized and extended to suit different project goals.

## Client and runtime

At a high level, a Substrate node consists of two main parts:

- A **core client** with **outer node services** that handles network activity such as peer discovery, managing transaction requests, reaching consensus with peers, and responding to RPC calls.

- A **runtime** that contains all of the business logic for executing the state transition function of the blockchain.

The following diagram illustrates this separation of responsibilities in simplified form to help you visualize the architecture and how Substrate provides a modular framework for building blockchains.

![Substrate architecture](/media/images/docs/simplified-architecture.png)

## Client outer node services

The core client includes several outer node services that are responsible for activity that takes place outside of the runtime.
For example, the outer node service in the core client handle peer discovery, manage the transaction pool, communicate with other nodes to reach consensus, and respond to RPC requests from the outside world.

Some of the most important activities that are handled by core client services involve the following components:

- [Storage](/learn/state-transitions-and-storage/): The outer node persists the evolving state of a Substrate blockchain using a simple and highly efficient key-value storage layer.

- [Peer-to-peer networking](/learn/node-and-network-types/): The outer node uses the Rust implementation of the [`libp2p` network stack](https://libp2p.io/) to communicate with other network participants.

- [Consensus](/learn/consensus/): The outer node communicates with other network participants to ensure they agree on the state of the blockchain.

- [Remote procedure call (RPC) API](/build/remote-procedure-calls/): The outer node accepts inbound HTTP and WebSocket requests to allow blockchain users to interact with the network.

- [Telemetry](/maintain/monitor/): The outer node collects and provides access to node metrics through an embedded [Prometheus](https://prometheus.io/) server.

- [Execution environment](/build/build-process/): The outer node is responsible for selecting the execution environment—WebAssembly or native Rust—for the runtime to use then dispatching calls to the runtime selected.

Substrate provides default implementations for handling these activities through its core blockchain components.
In principle, you can modify or replace the default implementation of any component with your own code.
In practice, it's rare for an application to require changes to any of the underlying blockchain features, but Substrate allows you to make changes so you are free to innovate where you see fit.

Performing these tasks often requires the client node services to communicate with the runtime.
This communication is handled by calling specialized [runtime APIs](/reference/runtime-apis/).

## Runtime

The runtime determines whether transactions are valid or invalid and is responsible for handling changes to the blockchain state.
Requests coming from the outside come through the client into the runtime, and the runtime is responsible for the state transition functions and storing the resulting state.

Because the runtime executes the functions it receives, it controls how transactions are included in blocks and how blocks are returned to the outer node for gossiping or importing to other nodes.
In essence, the runtime is responsible for handling everything that happens on-chain.
It is also the core component of the node for building Substrate blockchains.

The Substrate runtime is designed to compile to [WebAssembly (Wasm)](/reference/glossary#webassembly-wasm) byte code.
This design decision enables:

- Support for forkless upgrades.
- Multi-platform compatibility.
- Runtime validity checking.
- Validation proofs for relay chain consensus mechanisms.

Similar to how the outer node has a way to provide information to the runtime, the runtime uses specialized [host functions](https://paritytech.github.io/substrate/master/sp_io/index.html) to communicate with the outer node or the outside world.

## Core libraries

To keep things simple in the node template, many aspects of the blockchain are configured with a default implementation.
For example, there are default implementations of the networking layer, database, and consensus mechanism that you can use as-is to get your blockchain running without a lot of customization.
However, the libraries underlying the basic architecture provide a great deal of flexibility for defining your own blockchain components.

Much like the node consists of two main parts—the core client and the runtime—that provide different services, the Substrate libraries are divided into three main areas of responsibility:

- Core client libraries for outer node services.
- FRAME libraries for the runtime.
- Primitive libraries for underlying functions and interfaces for communication between the libraries.

The following diagram illustrates how the libraries mirror the core client outer node and runtime responsibilities and how the library of **primitives** provides the communication layer between the two.

![Core node libraries for the outer node and runtime](/media/images/docs/libraries.png)

### Core client libraries

The libraries that enable a Substrate node to handle its network responsibilities, including consensus and block execution are Rust crates that use the `sc_` prefix in the crate name.
For example, the [`sc_service`](https://paritytech.github.io/substrate/master/sc_service/index.html) library is responsible for building the networking layer for Substrate blockchains, managing the communication between the network participants and the transaction pool.

### FRAME libraries for the runtime

The libraries that enable you to build the runtime logic and to encode and decode the information passed into and out of the runtime are Rust crates that use the `frame_` prefix in the crate name.

The `frame_*` libraries provide the infrastructure for the runtime.
For example, the [`frame_system`](https://paritytech.github.io/substrate/master/frame_system/index.html) library provides a basic set of functions for interacting with other Substrate components and[`frame_support`](https://paritytech.github.io/substrate/master/frame_support/index.html) enables you to declare runtime storage items, errors, and events.

In addition to the infrastructure provided by the `frame_*` libraries, the runtime can include one or more `pallet_*` libraries.
Each Rust crate that uses the `pallet_` prefix represents a single FRAME module.
In most cases, you use the `pallet_*` libraries to assemble the functionality you want to incorporate in the blockchain to suit your project.

You can build a Substrate runtime without using the `frame_*` or `pallet_*` libraries using the **primitives** libraries.
However, the `frame_*` or `pallet_*` libraries provide the most efficient path to composing a Substrate runtime.

### Primitive libraries

At the lowest level of the Substrate architecture, there are primitive libraries that give you control over underlying operations and enable communication between the core client services and the runtime.
The primitive libraries are Rust crates that use the `sp_` prefix in the crate name.

The primitive libraries provide the lowest level of abstraction to expose interfaces that the core client or the runtime can use to perform operations or interact with each other.

For example:

- The [`sp_arithmetic`](https://paritytech.github.io/substrate/master/sp_arithmetic/index.html) library defines fixed point arithmetic primitives and types for the runtime to use.
- The [`sp_core`](https://paritytech.github.io/substrate/master/sp_core/index.html) library provides a set of shareable Substrate types.
- The [`sp_std`](https://paritytech.github.io/substrate/master/sp_std/index.html) library exports primitives from the Rust standard library to make them usable with any code that depends on the runtime.

## Modular architecture

The separation of the core Substrate libraries provides a flexible and modular architecture for writing the blockchain logic.
The primitives library provides a foundation that both the core client and the runtime can build on without communicating directly with each other.
Primitive types and traits are exposed in their own separate crates, so they are available to the outer node services and runtime components without introducing cyclic dependency issues.

## Where to go next

Now that you are familiar with the architecture and libraries used to build and interact with Substrate nodes, you might want to explore the libraries in more depth.
To learn more about the technical details for any library, you should review the [Rust API](https://paritytech.github.io/substrate/master/) documentation for that library.
