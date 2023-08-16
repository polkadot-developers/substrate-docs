---
title: Pallet builder basics
description:
tutorial: 1
---

Welcome to the first part of the Substrate collectibles workshop.
This is an interactive, hands-on, and self-paced workshop that introduces the basic steps for building a blockchain-based application using [Substrate](https://substrate.io/developers/).

In the workshop, you'll learn about the core development environment for Substrate-based blockchains—the runtime—and about the library of modules that plug in to the runtime—called pallets.

The runtime is where you define the application-specific logic for a blockchain, so this workshop focuses on building an application that runs on the blockchain instead of the underlying mechanics—like peer-to-peer networking or consensus—that allow the computers in a blockchain to communicate with each other.

The application you'll build in this workshop is a blockchain that enables users to create and manage collectible digital assets.
Because these assets will be managed on a blockchain network, users will be able to transfer and prove ownership of the assets they collect.

NOTE: Currently, this workshop only compiles if you use `branch = "polkadot-v1.0.0"` of the Substrate node template. You can check out this branch by using the `git checkout --detach polkadot-v1.0.0` command.