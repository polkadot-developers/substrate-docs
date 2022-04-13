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

* A **light client** that accesses the data stored in the blockchain but does not participate in producing blocks or reaching consensus.

* An **outer node** that handles network activity such as peer discovery, managing transaction requests, reaching consensus with peers, and responding to RPC calls.

* A **runtime** that contains all of the business logic for executing transactions, producing blocks, and reaching consensus.

## Outer node responsibilities

The outer node on the other hand, or everything part of the node that's outside the runtime, is responsible for handling peer discovery, transaction pools, consensus and answering RPC calls from the outside world. 
While performing these tasks, this "outer part" sometimes needs to query the runtime for information, or provide information to the runtime. 

**[A storage component](#storage)**: storage is used to persist the evolving state of a Substrate blockchain.
Substrate ships with a simple and highly efficient [key-value storage layer](/v3/advanced/storage).

**[An executor](#executor)**: the component of the client that dispatches calls to the runtime is known as the [executor](/v3/advanced/executor), whose role is to select an execution environment for the runtime (either native or Wasm).

**A network layer**: the capabilities that allow the client to communicate with other network participants.
Substrate uses the Rust implementation of the [`libp2p` network stack](https://libp2p.io/).

**A consensus engine**: the logic that allows network participants to agree on the state of the blockchain.
Substrate makes it possible to supply custom consensus engines and also ships with several consensus mechanisms that have been built on top of [Web3 Foundation research](https://w3f-research.readthedocs.io/en/latest/index.html).

**An RPC API**: this provides capabilities for blockchain users to interact with the network. 
Substrate ships with HTTP and WebSocket RPC servers.

**A telemetry layer**: this layer enables viewing node metrics, exposed by an embedded [Prometheus](https://prometheus.io/) server.

### Executor

As core part of the client, the [executor](/v3/getting-started/glossary#executor) is responsible for dispatching and executing calls into the Substrate runtime.
It's role is also to determine which runtime to use after a runtime is upgraded.

## Storage

All of Substrate's critical storage components use a simple key-value data store implemented as a database-backed modified [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree).
This allows any higher-level storage abstraction to be built ontop of it, providing many different ways to persist state on-chain, or create sandboxes for testing runtime upgrades locally, such as with node externalities.

The key-value database enables implementations for various types of storage maps, as well as persisting state changes for events, balances, errors and pallet functions.  
Even the runtime itself is stored on-chain using a magic key (see: [`:code`](https://docs.substrate.io/rustdocs/latest/sp_storage/well_known_keys/constant.CODE.html)).

Currently, Substrate uses the Rust implementation of [Rocks DB](http://rocksdb.org/) to provide the storage layer for Substrate chains, however Substrate is designed to support any key-value database implementation. 
There is a different implementation under developement called [Parity DB](https://github.com/paritytech/parity-db), which aims to optimize storage and retrieval of state data. 

<!-- [ TODO: Elaborate on storage layers, including externalities and add a diagram to show "full call path of a storage read in Substrate"] 

`db  -- trie -- overlay(s) --  sp_io host functions -- runtime`  

(where "DB" includes all the key-value layer; ["overlays"](https://github.com/paritytech/substrate/blob/ded44948e2d5a398abcb4e342b0513cb690961bb/primitives/state-machine/src/overlayed_changes/mod.rs#L92); host function impls; runtime; and pallet call) -->

## Runtime responsibilities

In essence, the runtime represents everything that executes on-chain and is the core component of the node for building Substrate blockchains.

The [runtime](#runtime) defines how blocks are processed, including state transitions and business logic execution.
Runtime code is compiled to [WebAssembly (Wasm](/reference/glossary#webassembly-wasm) to enable for [forkless upgrades](/main-docs/maintain/upgrades). 
Everything responsible for handling on-chain logic and state persistence happens in the runtime.

The runtime defines what transactions are valid and invalid and determines how the chain's state changes in response to transactions. 

Learn more about [available runtime APIs](./link-todo-design) in Substrate.

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

For more information about building the Substrate runtime, see [] ](/main-docs/build/build-process/).


## Learn more

- Discover the [libraries]() you can use to build with Substrate  
- Learn about the different types of [networks and nodes]()
- Read our article covering [blockchain basics]()
