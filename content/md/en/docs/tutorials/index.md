---
title: Tutorials
description:
keywords:
---

If you are someone who likes to learn by doing, the Substrate tutorials are a great place to start your journey.
Tutorials don't provide much background about _why_ you are performing certain steps or explain the coding details.
Instead, the tutorials give you hands-on experience performing the tasks essential to building your own blockchain and focus on ensuring a successful result.

If you prefer to experiment on your own with less guidance, you might want to explore the [Substrate Playground](/playground/).
If you prefer to dig into the details of the code directly, you might want to start with the [Rust API](https://paritytech.github.io/substrate/master/sc_service/index.html) documentation.
But if you want to start your journey with a guided tour, try out the following tutorials.

## Build a blockchain

The [Build a blockchain](/tutorials/build-a-blockchain/) tutorials illustrate the basics for working with blockchains nodes and networks, including how to make nodes communicate with each other in a network of peers and how to collect metrics about node operations.
You'll learn how to:

- Build a local node in your development environment.
- Simulate a two-node network using predefined accounts.
- Start a small network of trusted validator nodes.
- Monitor node operations by collecting metrics.
- Upgrade the runtime for a node.

## Build application logic

The [Build application logic](/tutorials/build-application-logic/) tutorials focus on how you can customize the runtime using pallets, including how to add simple and complex pallets to the runtime and how to use pallets in combination with smart contracts.
You'll learn how to:

- Add a simple predefined pallet to the runtime.
- Create a custom pallet using macros.
- Specify the account to use as the originator of a function call.
- Add an offchain worker and submit transactions using an offchain worker.
- Publish a custom pallet for others to use.

For a deeper dive into how to create a custom pallet from start to finish, you might want to explore the first part of the [Collectibles workshop](/tutorials/collectibles-workshop/).
Future iterations are intended to include an introduction to front-end development and how to convert an application from a solo chain to a parachain project.

## Build a parachain

The [Build a parachain](/tutorials/build-a-parachain/) tutorials delve into more advanced topics for moving beyond solo chain development, including how to connect your chain to other chains.
You'll learn how to:

- Turn a solo chain into a parachain.
- Deploy a local test network and interact with multiple connected parachains.
- Connect your parachain to a public test network.
- Work with the cross-consensus messaging format.

<!--
## Integrate with tools

The **Integrate with tools** tutorials highlight additional tools and node extensions that enable you to interact with Substrate nodes or the information in the blockchain in unique ways.
You'll learn how to:

- Integrate a light client node to connect to a Substrate-based chain.
- Interact with a Substrate-based chain using the `sidecar` RESTful API and endpoints.
- Access EVM accounts and work with EVM-compatible applications.

## Develop smart contracts

The **Develop smart contracts** tutorials guide you through how you can use the ink programming language to build smart contracts that run on a Substrate-based blockchain.
You'll learn how to:

- Create a smart contract project the ink! programming language.
- Store, increment, and retrieve simple values using a smart contract.
- Use maps to store and retrieve values in a smart contract.
- Build a smart contract for transferring ERC-20 tokens.

-->
