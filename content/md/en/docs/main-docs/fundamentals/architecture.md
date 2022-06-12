---
title: Architecture
description: Introduces the core components of a Substrate node.
featured_image:
keywords: blockchain, substrate, architecture, module
---

As noted in [Blockchain basics](/main-docs/fundamentals/blockchain-basics), a blockchain relies on a decentralized network of computers—called nodes—that communicate with each other.

Because the node is a core component of any blockchain, it’s important to understand what makes a Substrate node unique, including the core services and libraries that are provided by default and how the node can be customized and extended to suit different project goals.

## Substrate's high-level architecture

In a decentralized network, all nodes act as both clients that request data and as servers that respond to requests for data.
Conceptually and programmatically, the Substrate architecture divides operational responsibilities along similar lines.
The following diagram illustrates this separation of responsibilities in simplified form to help you visualize the architecture and how Substrate provides a modular framework for building blockchains.

![Substrate architecture](/media/images/docs/main-docs/sub-arch-1.png)

At a high level, a Substrate node provides a layered environment with two main elements:

- An [**outer node**](#outer-node) that handles network activity such as peer discovery, managing transaction requests, reaching consensus with peers, and responding to RPC calls.

- A [**runtime**](#runtime) that contains all of the business logic for executing the state transition function of the blockchain.

### Outer node

The outer node is responsible for activity that takes place outside of the runtime.
For example, the outer node is responsible for handling peer discovery, managing the transaction pool, communicating with other nodes to reach consensus, and answering RPC calls or browser requests from the outside world.

Some of the most important activities that are handled by the outer node involve the following components:

- [Storage](/main-docs/fundamentals/storage/): The outer node persists the evolving state of a Substrate blockchain using a simple and highly efficient key-value storage layer.

- [Peer-to-peer networking](/main-docs/fundamentals/networking): The outer node uses the Rust implementation of the [`libp2p` network stack](https://libp2p.io/) to communicate with other network participants.

- [Consensus](/main-docs/fundamentals/consensus/): The outer node communicates with other network participants to ensure they agree on the state of the blockchain.

- [Remote procedure call (RPC) API](/main-docs/fundamentals/networking): The outer node accepts inbound HTTP and WebSocket requests to allow blockchain users to interact with the network.

- Telemetry: The outer node collects and provides access to node metrics through an embedded [Prometheus](https://prometheus.io/) server.

- [Executor](/reference/glossary/#executor): The outer node defines an environment for runtime execution and provides [host functions](https://paritytech.github.io/substrate/master/sp_io/index.html) as the interface for the runtime to dispatch instructions to the outer node.

Performing these tasks often requires the outer node to query the runtime for information or to provide information to the runtime.
This communication is handled by calling specialized [runtime APIs](/reference/runtime-apis.md) embedded into the runtime.

### Runtime

The runtime defines the blockchain's state transition functions.
It wholly contains the logic that transactions call into to modify the chain's state.
It is the core component of the node for building Substrate blockchains.

The Substrate runtime is designed to compile to a single [WebAssembly (Wasm)](/reference/glossary#webassembly-wasm) byte code blob.
This design decision enables:

- Support for forkless upgrades.
- Multi-platform compatibility.
- Runtime validity checking.
- Validation proofs for relay chain consensus mechanisms.

## Light client nodes

A light client node is a leaner version of a typical Substrate node that cannot participate in progressing network consensus but provides a robust subset of features for network participants.
Light client nodes connect to a Substrate network with minimal hardware requirements in a fast, trustless, way.
As such, these are commonly embedded into websites, browser extensions, mobile device apps, and even IoT devices.
Light client nodes exposes the same RPC endpoints written in Rust, JavaScript, or other languages to read block headers, submit transactions, and view the results of transactions.

## Where to go next

Now that you have an overview of the Substrate architecture and core node components, explore the following topics to learn more.

- [Networks and blockchains](/main-docs/fundamentals/node-and-network-types)
- [Transactions and block basics](/main-docs/fundamentals/transaction-types)
- [Transaction lifecycle](/main-docs/fundamentals/transaction-lifecycle/)
- [State transitions and storage](/main-docs/fundamentals/state-transitions-and-storage/)
- [Runtime APIs](/reference/runtime-apis/)
