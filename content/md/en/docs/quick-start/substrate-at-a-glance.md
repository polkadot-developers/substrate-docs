---
title: Substrate at a glance
description: Offers a bare bones overview of the Substrate framework for building application-optimized blockchains.
keywords:
  - Substrate overview
  - FRAME overview
  - FAQ
---

This article offers a bare bones overview of the Substrate framework for building application-optimized blockchains.
All of the topics mentioned here are covered in more detail in other parts of the documentation.

## What is Substrate?

Substrate is a Software Development Kit (SDK) that uses Rust-based libraries and tools to enable you to build application-specific blockchains from modular and extensible components.
Application-specific blockchains that are built with Substrate can run as standalone services or in parallel with other chains to take advantage of the shared security provided by the Polkadot ecosystem.
Substrate includes default implementations of the core components of the blockchain infrastructure to allow you to focus on the application logic.

## What is FRAME?

FRAME provides the core modular and extensible components that make the Substrate software development kit flexible and adaptable to different use cases.
FRAME include Rust-based programs and libraries that simplify and streamline the development of application-specific logic.
Most of the functionality that FRAME provides takes the form of plug-in modules called **pallets** that you can add and configure to suit your requirements.

## Why use Substrate and FRAME?

By using Substrate and FRAME, you can build proof-of-concept application-specific blockchains without the complexity of building a blockchain from scratch or the limitations of building on a general-purpose blockchain.
With Substrate and FRAME, you can focus on crafting the business logic that makes your chain unique and innovative with the additional benefits of flexibility, upgradeability, open source licensing, and cross-consensus interoperability.

## What is a Substrate node?

Every blockchain platform relies on a decentralized network of computers—called nodes—that communicate with each other about transactions and blocks.
In general, a node in this context is the software running on the connected devices rather than the physical or virtual machine in the network.
As software, Substrate nodes consist of two main parts with separate responsibilities:

- A **core client** with outer node services to handle network and blockchain infrastructure activity.
- A **runtime** with the business logic for state transitions and the current state of the blockchain.

## Why build a custom runtime?

The separation of responsibilities into client-driven activity and runtime-driven activity is a critical part of what makes Substrate nodes upgradeable.
The application logic is what makes your chain unique and it's stored on-chain in the form of a WebAssembly binary.
If you make changes to the application logic, you simply compile a new WebAssembly binary.
You can then submit a transaction to update the WebAssembly binary currently stored on-chain with your updated binary.
Because the custom runtime is a self-contained object that's stored as part of the chain state, you can easily iterate on the application design and evolve your project as your community evolves.
