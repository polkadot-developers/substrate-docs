---
title: Libraries
description: 
keywords:
---

This article goes over the different libraries available for building blockchains with Substrate. 

## Core libraries

At a high level, Substrate's core libraries consists of libraries to build: clients, runtimes and the communication layer between the two. 



                                ┌────────────────────────┐
                                │ Client                 │
                                │                        │
                                │                        │
                                │                        │
                                │     ┌──────────────────┤
                                │     │ Primitives       │
                                │     │                  │
                                │     │     ┌────────────┤
                                │     │     │            │
                                │     │     │            │
                                │     │     │   Runtime  │
                                └─────┴─────┴────────────┘

> _TODO: Diagram is a rough sketch. Each part is not meant to be interpreted as nested, rather that "primitives" enable communication between the Clients and Runtimes. Need to annotate diagram with below:_

> - **Client**: Libraries that enable the client and networking layer, including consensus and block execution. 
> - **Primitives**: Libraries responsible for communicating between the client and the runtime, creating the transaction pool and building blocks for the block executor.
> - **FRAME**: Libraries to facilitate building runtime logic and encoding and decoding information passing to and from the runtime.

Each of these components are built from Rust libraries that fall under four categories:

- `sc_*`: Substrate client libraries encapsulate the numerous crates for node and client facing infrastructure, including consensus critical infrastructure, P2P networking, RPC APIs and block execution.
For example, [`sc_service`](https://docs.substrate.io/rustdocs/latest/sc_service/index.html) is responsible for building the networking layer for Substrate blockchains, managing the communication between the network, client and transaction pool. 

- `sp_*`: Substrate primitives are libraries to facilitate communication between the client and the runtime. 
For example, [`sp_std`](https://docs.substrate.io/rustdocs/latest/sp_std/index.html) takes useful primitives from Rust's standard library and makes them usable with any code that depends on the runtime.

- `frame_*`: runtime SDK libraries for building use case specific runtime logic and calling to and from a runtime.
For example, [`frame_support`](https://docs.substrate.io/rustdocs/latest/frame_support/index.html) enables developers to easily declare runtime storage items, errors and events and [`frame_system`](https://docs.substrate.io/rustdocs/latest/frame_system/index.html) acts as the base layer for other pallets to interact with other Substrate components.

- `pallet_*`: a single FRAME module, of which exists an [existing collection](/frame-pallets) created for Polkadot and Kusama. 
Other pallet libraries exist such as the [Open Runtime Module Library (ORML)](https://github.com/open-web3-stack/open-runtime-module-library).

Although it is possible to build an alternative to [FRAME](./link-to-frame) using the primitives exposed by Substrate's core libraries, there has not yet been any significant community efforts to do so yet and FRAME remains the easiest and most reliable way to compose Substrate runtimes.

## Front-end libraries

There are a number of client libraries that can be used to interact with [Substrate nodes](/link-to-architecture-page) to build application specific clients or front-ends.
In general, the capabilities that these libraries expose are implemented on top of [Substrate remote procedure call (RPC) APIs](./frontend#RPC-APIs).

### Parity maintained

| Name | Description  | Language  | Use case  |   
|---|---|---|---|
| [Polkadot JS API](https://polkadot.js.org/docs/api) | A Javascript library for interacting with a Substrate chain. | Javascript | Applications that need to dynamically adapt to changes in a node, such as for block explorers or chain-agnostic interfaces. 
| [Polkadot JS extension](https://polkadot.js.org/docs/extension/) | An API for interacting with a browser extension build with the Polkadot JS API. | Javascript | Browser extensions.
| [`Substrate Connect`](https://paritytech.github.io/substrate-connect/) | A library for developers to build applications that act as their own light client for their target chain. It also provides a browser extension designed to connect to multiple chains from a single application (web or desktop browser). | Javascript | Any browser application.
| [`subxt`](https://github.com/paritytech/subxt/) | Short for "submit extrinsics", `subxt` is a library that generates a statically typed Rust interface to interact with a node's RPC APIs based on a target chain's metadata. | Rust | Building lower level applications, such as non-browser graphic user interfaces, chain-specific CLIs or user facing applications that require type-safe communication between the node and the generated interface, preventing users from constructing transactions with bad inputs or submitting calls that don't exist. 
| [`txwrapper`](https://github.com/paritytech/txwrapper) | A Javascript library for offline generation of Substrate transactions. | Javascript | Write scripts to generate signed transactions to a node, useful for testing and decoding transactions.

### Community maintained

| Name | Description  | Maintainer |
|---|---|---|
| [Go Substrate RPC Client](https://github.com/centrifuge/go-substrate-rpc-client/) | A Go library that provides APIs and types around Polkadot and any Substrate-based chain RPC calls. | [Centrifuge](https://centrifuge.io/) 
| [Polkadot API DotNet](https://github.com/usetech-llc/polkadot_api_dotnet) | A Substrate RPC client library for .NET developers. |[Usetech](https://usetech.com/blockchain/)
| [Polkadot API CPP](https://github.com/usetech-llc/polkadot_api_cpp) | A C++ library for interacting with the Substrate RPC. | [Usetech](https://usetech.com/blockchain/)
| [Python Substrate Interface](https://github.com/polkascan/py-substrate-interface) | A Python library for interacting with the Substrate RPC interface. It supports a wide range of capabilities and powers the [Polkascan multi-chain block explorer](https://polkascan.io/). | [Polkascan Foundation](https://polkascan.org/)
| [Substrate API Client](https://github.com/scs/substrate-api-client) | A general-purpose Substrate client Rust library. | [Supercomputing Systems](https://www.scs.ch/en/) 
| [SubstrateNetApi](https://github.com/dotmog/SubstrateNetApi) | A .NET Standard API ([nuget](https://www.nuget.org/packages/SubstrateNetApi)) allowing full Substrate integration in Unity3D for game development. | [DOTMog](https://www.dotmog.com/)
