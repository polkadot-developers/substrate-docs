---
title: Develop smart contracts
description: Demonstrates using the ink! programming language to create and deploy smart contracts on a Substrate-based network.
keywords:
  - smart contracts
---

<div class="warning">
	<p>
	<strong>⚠️ WARNING:</strong> This page contains a list of tutorials with potentially outdated information 
  and instructions. When the new <a href="https://forum.polkadot.network/t/decentralized-futures-ecosystem-devrel-team-for-polkadot-by-papermoon/5811">Polkadot developer documentation</a> is published, the content and 
  links on this page will be updated. Thanks for your patience!
	</p>
</div>

The **Develop smart contracts** tutorials guide you through how you can use [the ink! programming language](https://use.ink) to build smart contracts that run on a Substrate-based blockchain.

The tutorials in this section use a preconfigured
[`substrate-contracts-node`](https://github.com/paritytech/substrate-contracts-node) to keep your work focused on the basics of writing smart contracts.

If you use the [standard node template](https://github.com/substrate-developer-hub/substrate-node-template), you must manually add the [Contracts pallet](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/contracts) and make other changes to your development environment.
You can compare the runtime code for the two nodes to see additional information about the differences between them.

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
