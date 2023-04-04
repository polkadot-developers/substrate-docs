---
title: Develop smart contracts
description: Demonstrates using the ink! programming language to create and deploy smart contracts on a Substrate-based network.
keywords:
  - smart contracts
---

The **Develop smart contracts** tutorials guide you through how you can use
[the ink! programming language](https://use.ink) to build smart contracts that run on a Substrate-based
blockchain.

The tutorials in this section use a preconfigured
[`substrate-contracts-node`](https://github.com/paritytech/substrate-contracts-node).

If you want to use the [standard node template](https://github.com/substrate-developer-hub/substrate-node-template),
you need to add the [Contracts pallet](https://github.com/paritytech/substrate/tree/master/frame/contracts)
and a few other components to your development environment.

Preparing the node template for building smart contracts is covered in
[Configure the contracts pallet](/tutorials/build-application-logic/contracts-pallet).

- [Prepare your first contract](/tutorials/smart-contracts/prepare-your-first-contract/) describes how to update your
  development environment and create a smart contract project using the ink! programming language.
- [Develop a smart contract](/tutorials/smart-contracts/develop-a-smart-contract/) demonstrates how to store, increment,
  and retrieve simple values using a smart contract.
- [Use maps for storing values](/tutorials/smart-contracts/use-maps-for-storing-values/) extends the previous tutorial
  by illustrating how to use maps to store and retrieve values in a smart contract.
- [Build a token contract](/tutorials/smart-contracts/build-a-token-contract/) illustrates how you can build a simple
  smart contract for transferring ERC-20 tokens.
- [Troubleshoot smart contracts](/tutorials/smart-contracts/troubleshoot-smart-contracts/) describes a few common issues
  that you might encounter when writing and deploying smart contracts.
