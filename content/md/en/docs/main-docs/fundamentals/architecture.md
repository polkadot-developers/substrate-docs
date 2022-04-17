---
title: Architecture
description: Introduces the core components of a Substrate node.
featured_image:
keywords: 
---

As noted in [Blockchain basics](/main-docs/fundamentals/blockchain-basics), a blockchain relies on a decentralized network of computers—called **nodes**—that communicate with each other.
Because the node is a core component of a Substrate blockchain and it takes a lot of nodes working together to build a secure and robust chain, it's important to understand the architecture of a Substrate node, including the core services and libraries that are provided by default and how the node can be customized and extended to suit different project goals.

## Node and client architecture

In a decentralized network, all nodes are both clients that request data and servers that respond to requests for data.
Conceptually and programmatically, the Substrate architecture divides operational responsibilities along similar lines.
The following diagram illustrates this separation of responsibilities in simplified form to help you visualize the architecture.

![Substrate architecture](/media/images/docs/main-docs/sub-arch-1.png)

As illustrated in the diagram, Substrate nodes provide a layered environment with three main elements:

* An **outer node** that handles network activity such as peer discovery, managing transaction requests, reaching consensus with peers, and responding to RPC calls.

* A **runtime** that contains all of the business logic for executing transactions, saving state transitions, and reaching consensus.

* A **light client** that accesses the data stored in the blockchain but does not participate in producing blocks or reaching consensus.

## Outer node responsibilities

The outer node is responsible for activity that takes place outside of the runtime.
For example, the outer node is responsible for handling peer discovery, managing transaction pools, communicating with other nodes to reach consensus, and answering RPC calls or browser requests from the outside world.
Performing these tasks often requires the outer node to query the runtime for information or to provide information to the runtime.

Some of the most important activities that are handled by the outer node involve the following components:

* [Storage](/main-docs/fundamentals/storage/): The outer node persists the evolving state of a Substrate blockchain using a simple and highly efficient key-value storage layer.

* [Peer-to-peer networking](/main-docs/fundamentals/networking): The outer node uses the Rust implementation of the [`libp2p` network stack](https://libp2p.io/) to communicate with other network participants.

* [Consensus](/main-docs/fundamentals/consensus/): The outer node communicates with other network participants to ensure they agree on the state of the blockchain.

* [Remote procedure call (RPC) API](/main-docs/fundamentals/networking): The outer node accepts inbound HTTP and WebSocket requests to allow blockchain users to interact with the network.

* [Telemetry](): The outer node collects and provides access to node metrics through an embedded [Prometheus](https://prometheus.io/) server.

* [Executor](/reference/glossary/#executor): The outer node is responsible for selecting the execution environment—WebAssembly or native Rust—for the runtime to use then dispatching calls to the runtime selected.

## Runtime responsibilities

The [runtime](/nain-docs/fundamentals/runtime/) defines the business logic of your blockchain.
The runtime determines whether transactions are valid or invalid and the runtime is responsible for handling the state changes that occur in response to transactions.

Because the runtime executes the functions it receives, it controls how transactions are included in blocks and how blocks are returned to the outer node for gossiping or importing to other nodes.
In essence, the runtime is responsible for handling everything that happens on-chain.
It is also the core component of the node for building Substrate blockchains.

### WebAssembly runtime

The Substrate runtime compiles as a standard Rust binary and to [WebAssembly (Wasm)](/reference/glossary#webassembly-wasm) byte code.
The WebAssembly target enables:

* Support for forkless upgrades.
* Browser compatibility.
* Runtime validity checking.
* Validation proofs for relay chain consensus mechanisms.

### Standard Rust runtime

Compiling Rust using the standard Rust libraries results in a Rust binary version of the runtime.
The standard Rust runtime is mainly used in development and testing environments because compiling a standard Rust executable is faster and more efficient than compiling to the WebAssembly target.
The Rust runtime is also easier to debug because you can use standard Rust libraries that aren't available for debugging WebAssembly targets.

In theory, you could use the Rust runtime to operate nodes in production.
However, Substrate nodes always select WebAssembly runtime as the latest available runtime to use as a way to support forkless upgrades.
After an upgrade, nodes always execute the updated WebAssembly blob that's stored on-chain.

For more information about building the Substrate runtime, see [Build process](/main-docs/build/build-process/).

## Light clients

Light clients connect to the runtime to enable users to interact with the blockchain through a browser, browser extension, mobile device, and desktop computer.
In most cases, a light client connects to the WebAssembly execution environment to read block headers, submit transactions, and view the results of transactions.
You can use RPC endpoints with Rust, JavaScript, or other languages to implement a light client.

## Where to go next

Now that you have an overview of the Substrate architecture and core node components, explore the following topics to learn more.

* [Blockchain basics](/main-docs/fundamentals/blockchain-basics)
* [State transitions and storage](/main-docs/fundamentals/state-transitions-and-storage/)
* [Transaction lifecycle](/main-docs/fundamentals/transaction-lifecycle/)
* [Runtime APIs](/reference/runtime-apis/)
