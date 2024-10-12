---
title: Build
description: Exposes details about how Substrate nodes are constructed and compiled.
keywords:
---

The topics in this section provide a more detailed exploration of the code used to construct the runtime logic, including the libraries and tools available for building and interacting with the node and a closer look at how the logic is compiled to build a Substrate node.

- [Smart contracts](/build/smart-contracts-strategy/) summarizes how you can use build smart contracts as an approach to application development in a Substrate-based chain.
- [Custom pallets](/build/custom-pallets) exposes the macros and attributes that form the foundation for building custom pallets.
- [Runtime storage](/build/runtime-storage) offers a closer look at storage structure and how to navigate to data stored in the runtime.
- [Transactions, weights, and fees](/build/tx-weights-fees) explains the role of weights and fees in executing transactions and the mechanics of how fees are calculated and refunded.
- [Pallet coupling](/build/pallet-coupling) describes how pallets can be tightly or loosely coupled in a runtime.
- [Events and errors](/build/events-and-errors) explains how to emit events and errors from the runtime.
- [Randomness](/build/randomness) suggests ways you can include randomness in applications that run on a Substrate-based blockchain.
- [Privileged calls and origins](/build/origins) describes how you can use predefined or custom origins to identify the originator of a function call.
- [Remote procedure calls](/build/remote-procedure-calls/) summarizes how you can use remote procedure calls and RPC methods to interact with a Substrate node.
- [Application development](/build/application-development/) introduces the role of metadata and front-end libraries as tools for building applications that run on the blockchain.
- [Chain specification](/build/chain-spec) discusses the use of chain specifications, including what you can and can't modify, and how to distribute customized chain specifications.
- [Genesis configuration](/build/genesis-configuration) describes the main elements of the genesis configuration.
- [Build process](/build/build-process) delves into the details of how the Rust code compiles to a Rust binary and a WebAssembly target and how these two targets are used to optimize node operations.
- [Build a deterministic runtime](/build/build-a-deterministic-runtime) explains how to use the Substrate runtime toolbox (`srtool`) and Docker to build the WebAssembly runtime for Substrate-based chains.
- [Troubleshoot your code](/build/troubleshoot-your-code) highlights general and Substrate-specific coding techniques for troubleshooting issues and following best practices.
