---
title: Substrate empowers builders
description:
keywords:
---

The Substrate framework empowers you to make many types of design decisions for your project.
Substrate doesn't enforce any assumptions about the consensus model you want to use, the form of governance you might implement, or whether you'll charge transaction fees.
With every design decision, you are free to choose between the complexity of technical innovation and the ease of development using predefined modules and feature-specific logic.

The following diagram illustrates how different approaches to building your project affect development time and complexity.

![Balancing technical freedom and development ease](/media/images/docs/development-complexity.png)

As this diagram suggests, Substrate provides predefined templates and tools to reduce complexity and development time.
However, Substrate also exposes the low-level primitives that build the core features of the blockchain, so you have complete technical freedom to innovate at any point in the development stack.

If you want to minimize development time and complexity, you can deploy predefined Substrate nodes with minimal configuration and launch a blockchain with virtually no development effort.
If you want to modify lower-level components or operations—such as, consensus, networking, or storage—you can design and implement a Substrate-based blockchain from core primitives or build your own components from scratch.

## Using FRAME

Naturally, the most common scenario falls between these two extremes and involves the use of predefined modules and libraries to simplify development.
Collectively, the predefined modules and libraries form the [FRAME](/reference/glossary/#frame) development environment.
FRAME is an acronym for Framework for Runtime Aggregation of Modularized Entities, and the main purpose of FRAME is to enable you to create a customized Substrate **runtime**.

By using FRAME, you can select and configure the specific modules—called **pallets**—that you want to use.
For example, if you know your application needs to manage account balances, you can simply include the Balances pallet in the configuration of your runtime logic.
You can then modify different aspects of the pallet in the context of your runtime to suit your application.
If a pallet doesn't currently exist for the functionality you need, you can use FRAME to create your own custom pallet, then add that custom pallet to your customized runtime.

## Basic runtime design decisions

Because building a blockchain from scratch is a complex business that requires a lot of specialized skills and knowledge, most builders start with a core set of the outer node components and focus their energy on building customized runtime logic.
However, even if you aren't building lower-level blockchain components, building a custom runtime will require you to make some important design decisions.
For example, you can build a Substrate runtime:

- Without any predefined FRAME pallets.
- Only using predefined FRAME pallets.
- Using a combination of predefined and custom pallets.
- Using smart contracts and predefined FRAME pallets.
- With a combination of predefined and custom pallets and smart contracts.

As part of your design process, you can explore the predefined [FRAME pallets](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame) to see if they provide features that you want to use or customize and identify any custom pallets you might need.

## Where to go next

Explore the following resources to learn more.

#### Tell me more

- [Blockchain basics](/main-docs/learn/blockchain-basics/)
- [Why substrate?](/main-docs/learn/why-substrate)
- [Architecture](/main-docs/learn/architecture/)
- [Runtime development](/main-docs/learn/runtime-development/)

#### Guide me

- [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/)
- [Simulate a network](/tutorials/build-a-blockchain/simulate-network/)
- [Add trusted nodes](/tutorials/build-a-blockchain/add-trusted-nodes/)

<!--
#### Show me (related video content)

*

#### Teach me (related how to content)

*
-->
