---
title: Fundamentals
description: Explains the core principles and unique features of the Substrate-based blockchains and Substrate runtime development.
section: docs
keywords:
  - blockchain
  - consensus
  - substrate
  - architecture
---

The topics in Fundamentals explain many of the core principles and unique features of the Substrate development environment and highlights some of the design decisions available to you as a blockchain builder.
Substrate offers a modular and flexible library of tools that empower you to select, compose, modify, and reuse components to suit the specific purpose of the blockchain you want to create, whether that is a private network or publish a blockchain that can interact with other blockchains through the Polkadot network.

The topics in Fundamentals are intended to help you learn what's possible when you build a Substrate-based blockchain and how Substrate can help you build a blockchain that best serves your specific project requirements or business model.

Before you start building, though, you want to make sure you are in the right place.

- [Blockchain basics](/main-docs/fundamentals/blockchain-basics/) provides context about the complexity associated with blockchain development and how Substrate simplifies the process by taking an approach that is modular, flexible, and interoperable.

- [Why Substrate?](/main-docs/fundamentals/why-substrate/) discusses how developing on a traditional smart contract platform differs from developing with Substrate and why Substrate might—or might not—suit your project requirements and goals.

- [Architecture](/main-docs/fundamentals/architecture/) describes the key components of the Substrate node architecture and how these components relate to the design and architecture of your custom blockchain.

- [Networks and blockchains](/main-docs/fundamentals/node-and-network-types/) defines the network topology for different blockchain deployment scenarios and how they apply to Substrate-based blockchains.

- [Runtime development](/main-docs/fundamentals/runtime-development) highlights the importance of the Substrate runtime and introduces the core application interfaces and primitives required for Substrate runtime development.

- [Consensus](/main-docs/fundamentals/consensus/) describes the most common consensus models and the types of consensus you can implement for a Substrate blockchain.

- [Transactions and block basics](/main-docs/fundamentals/transaction-types/) introduces transaction types and the components that make up a block.

- [Transaction lifecycle](/main-docs/fundamentals/transaction-lifecycle/) explains how transactions are received, queued, and executed to eventually be included in a block.

- [State transitions and storage](/main-docs/fundamentals/state-transitions-and-storage/) describes how the state changes processed in the runtime are stored and managed using trie data structures and a key-value database.

- [Accounts, addresses, and keys](/main-docs/fundamentals/accounts-addresses-keys/) explains the relationship between accounts, addresses, and keys and how they are used.

- [Rust for Substrate](/main-docs/fundamentals/rust-basics/) highlights the specific Rust features—including traits, generics, associated types, and macros—that you should be most familiar with to build a Substrate-based blockchain.

- [Offchain operations](/main-docs/fundamentals/offchain-operations/) explores reasons for handling some operations off the chain and alternatives for performing those offchain operations.

After you digest the information in these introductory sections, you'll be ready to start designing, building, and testing your own custom blockchain solution.
