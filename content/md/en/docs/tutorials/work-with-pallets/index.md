---
title: Work with pallets
description: Demonstrates how you can add pallets to customize the Substrate runtime environment.
keywords:
---

The **Work with pallets** tutorials focus on how you can customize the runtime using pallets, including how to add simple and complex pallets to the runtime and how to use pallets in combination with smart contracts.
You'll learn how to:

- [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet/) introduces the common steps for adding a simple predefined pallet to the node template runtime.
- [Use macros in a custom pallet](/tutorials/work-with-pallets/use-macros-in-a-custom-pallet) illustrates how to create a custom pallet using macros.
- [Specify the origin for a call](/tutorials/work-with-pallets/specify-the-origin-for-a-call) demonstrates how you can specify the account to use as the originator of a function call.
- [Add offchain workers](/tutorials/work-with-pallets/add-offchain-workers/) illustrates how to modify a pallet to include an offchain worker and configure the pallet and runtime to enable the offchain worker to submit transactions that update the on-chain state.
- [Publish custom pallets](/tutorials/work-with-pallets/publish-custom-pallets/) illustrates how to publish custom pallets and crates so they are available to the community.

If you want to experiment with smart contract development for your blockchain, you should use the preconfigured [substrate-contracts-node](https://github.com/paritytech/substrate-contracts-node) instead of the standard node template.
There are compatibility issues between the pallets that support smart contracts and the current node template. 
To resolve these compatibility issues would require extensive changes to the configuration of the standard node template, including using older versions of all crates and modifying multiple files. 
To dive directly into smart contract development, see the tutorials in [Develop smart contracts](/tutorials/smart-contracts/).

<!--
- [Configure the contracts pallet](/tutorials/work-with-pallets/contracts-pallet/) demonstrates how to configure a complex pallet to work with smart contracts.

-->