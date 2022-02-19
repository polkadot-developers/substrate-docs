---
title: Substrate architecture
description: An introduction to the core components of a SUbstrate node.
featured_image:
---

A Substrate node is designed to be modular, extensible and adaptable to change. 
This article presents the architecture of a Substrate node, using the [node template](https://github.com/substrate-developer-hub/substrate-node-template) as a reference which provides a set of core components ready to use out of the box.

A Substrate node can be thought of as video gaming environment, where the console is the client (or the "outer part") and the current game being played is the current runtime (i.e. everything "on-chain").
Each of these components are created using Substrate's [multitude of core libraries](/main-docs/06-build/libraries/) for building blockchain clients and their runtime logic. 
Throughout the material here, we'll refer to a node as both runtime and client.

The architecture of a Substrate node contains:

- **[A runtime](#runtime)**: the logic that defines how blocks are processed, including state transition logic. 
In Substrate, runtime code is compiled to [Wasm](/v3/getting-started/glossary#webassembly-wasm) and becomes part of the blockchain's storage state. 
This enables [forkless runtime upgrades](/v3/runtime/upgrades#forkless-runtime-upgrades). 
Everything responsible for handling on-chain logic and state persistence happens in the runtime.
- **[A storage component](#storage)**: used to persist the evolving state of a Substrate blockchain.
Substrate ships with a simple and highly efficient [key-value storage mechanism](/v3/advanced/storage).
- **[An executor](#executor)**: the component of the client that dispatches calls to the runtime is known as the [executor](/v3/advanced/executor), whose role is to select an execution environment for the runtime.
- **A network layer**: the capabilities that allow the client to communicate with other network participants. 
Substrate uses the Rust implementation of the [`libp2p` network stack](https://libp2p.io/).
- **A consensus engine**: the logic that allows network participants to agree on the state of the blockchain.
Substrate makes it possible to supply custom consensus engines and also ships with several consensus mechanisms that have been built on top of [Web3 Foundation research](https://w3f-research.readthedocs.io/en/latest/index.html).
- **An RPC API**: the capabilities that allow blockchain users to interact with the network. 
Substrate provides HTTP and WebSocket RPC servers.
- **A telemetry layer**: client metrics that are exposed by the embedded [Prometheus](https://prometheus.io/) server.

Any of these components can be swapped out for different ones, depending on the target optimization or use case.

## Runtime and client

The runtime contains the business logic of the chain. 
It defines what transactions are valid and invalid and determines how the chain's state changes in response to transactions. 

The client on the other hand, or everything part of the node that's outside the runtime, is responsible for handling peer discovery, transaction pools, consensus and answering RPC calls from the outside world. 
While performing these tasks, the outer node sometimes needs to query the runtime for information, or provide information to the runtime. 

Learn more about [availble runtime APIs](./link-todo-design) in Substrate.

### Wasm runtimes

A super powerful feature of Substrate runtimes is their ability to compile to [WebAssembly (Wasm)](/v3/getting-started/glossary#webassembly-wasm) bytecode.
Among a few things, this provides forkless runtime upgrade capabilities, browser compatibility, checking runtime validity and providing validation proofs for relay chain consensus mechanisms.

Native runtimes-those that are produced by running the Rust executable only-mainly have their use in development and testing environments. 
Compiling to native only is faster, more efficient and easier to debug, especially considering that developers can't use Rust's standard library for debugging Wasm runtimes. 
However, although native runtimes could in theory be used by operating nodes in production, Substrate nodes will always select the latest available runtime which is always the Wasm runtime since forkless upgrades use the Wasm runtime.
Once a forkless update occurs, nodes will execute the new runtime which is just a new Wasm blob in the chain's storage.

There are ongoing discussions about removing the native runtime altogether to encourage developers to move away from using the native runtime.
Refer to this open [issue](https://github.com/paritytech/substrate/issues/7288) for more details. 
Learn more about the [build process of a Substrate runtime]().

### Executor

As core part of the client, the [executor](/v3/getting-started/glossary#executor) is responsible for dispatching and executing calls into the Substrate runtime.
It's role is also to determine which runtime to use after a runtime is upgraded.

## Storage

All of Substrate's critical storage components use a simple key-value data store implemented as a database-backed modified [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree).
This allows any higher-level storage abstraction to be built ontop of it, providing many different ways to persist state on-chain, or create sandboxes for testing runtime upgrades locally (see: [externalities]()).

The key-value database enables implementations for various types of storage maps, as well as persisting state changes for events, balances, errors and pallet functions.  
Even the runtime itself is stored on-chain using a magic key (see: [`:code`](https://docs.substrate.io/rustdocs/latest/sp_storage/well_known_keys/constant.CODE.html)).

Currently, Substrate uses the Rust implementation of [Rocks DB](http://rocksdb.org/) to provide the storage layer for Substrate chains, however Substrate is designed to support any key-value database implementation. 
There is a different implementation under developement called [Parity DB](https://github.com/paritytech/parity-db), which aims to optimize storage and retrieval of state data. 

[ TODO: Elaborate on storage layers, including externalities]
[ Add a diagram to show "full call path of a storage read in Substrate"] 

db  <--> trie <--> overlay(s) <-->  sp_io host functions <--> runtime  

(where "DB" includes all the key-value layer; ["overlays"](https://github.com/paritytech/substrate/blob/ded44948e2d5a398abcb4e342b0513cb690961bb/primitives/state-machine/src/overlayed_changes/mod.rs#L92); host function impls; runtime; and pallet call)

## Learn more

- Discover the [libraries]() you can use to build with Substrate  
- Learn about the different types of [networks and nodes]()
- Read our article covering [blockchain basics]()
