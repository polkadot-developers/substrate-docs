---
title: Fundamentals
slug: /main-docs/fundamentals/
section: docs
keywords: blockchain, consensus, substrate, architecture
---

The topics in Fundamentals explain many of the core principles and unique features of the Substrate development environment and highlights some of the design decisions available to you as a blockchain builder. 
Substrate offers a modular and flexible library of tools that empower you to select, compose, modify, and reuse components to suit the specific purpose of the blockchain you want to create, whether that is a private network or publish a blockchain that can interact with other blockchains through the Polkadot network.

The topics in Fundamentals are intended to help you learn what's possible when you build a Substrate-based blockchain and how Substrate can help you build a blockchain that best serves your specific project requirements or business model.

Before you start building, though, you want to make sure you are in the right place.

* [Blockchain basics](main-docs/02-fundamentals/blockchain-basics.md) provides context about the complexity associated with blockchain development and how Substrate simplifies the process by taking an approach that is modular, flexible, and interoperable.

* [Choosing a development platform](main-docs/01-why-substrate/choose-a-dev-platform.md) discusses how developing on a traditional smart contract platform differs from developing with Substrate and why Substrate might—or might not—suit your project requirements and goals.

* [Blockchain network topology]() defines the network topology for different blockchain deployment scenarios and how they apply to Substrate-based blockchains. 
  - Private solo chain
  - Private enterprise chain (permissioned?)
  - Parachain
  - Relay chain
  - Substrate as the foundation for Polkadot, Kusama, testnets

* [Substrate node architecture](main-docs/02-fundamentals/substrate-client.md) describes the key components of the Substrate node architecture and how these components relate to the design and architecture of your custom blockchain.

* [Runtime as the core of Substrate chains](main-docs/02-fundamentals/runtime.md) highlights the importance of the Substrate runtime and introduces the core application interfaces and primitives required for Substrate runtime development.

After you digest the information in these introductory sections, you'll be ready to start designing, building, and testing your own custom blockchain solution.

- Inbound request pool (extrinsic, peer-to-peer induction, 

- Consensus (models, block authoring, selection, validation, finalization,life cycle of a message))

- Economics (incentives, safety of the network, guardrails)

- Governance 

- Software development (Rust, Wasm, frame and pallets, data storage, tech stack)
