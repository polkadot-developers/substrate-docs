---
title: Substrate empowers builders
description:
keywords:
---

The Substrate framework empowers you to make many types of design decisions for your project.
Substrate doesn't enforce any assumptions about the consensus model you want to use, the form of governance you might implement, or whether you'll charge transaction fees.
With every design decision, you are free to choose between the complexity of technical innovation and the ease of development using predefined modules and feature-specific logic.
The following diagram illustrates the nature of this flexibility.

![Technical freedom vs development ease](/media/images/docs/main-docs/technical-freedom.png)

As this diagram suggests, Substrate provides a sliding scale between complete technical freedom and development ease.
At one end of the spectrum, you can deploy predefined Substrate nodes with minimal configuration and launch a blockchain with virtually no development effort.
At the other end of the spectrum, you can design and implement a Substrate-based blockchain from scratch—including core outer node components, like consensus, networking, and storage—giving you the technical freedom to innovate.

Naturally, the most common scenario falls between these two extremes.
In the middle of the spectrum, you can use [FRAME](/reference/glossary/#frame)—an acronym for Framework for Runtime Aggregation of Modularized Entities—to create a customized Substrate **runtime**.
With this approach, you can choose how much control you have over the blockchain logic by selecting and configuring the modules—called **pallets**—that you want to use from a library.
If a pallet doesn't exist for the functionality you need, you can use FRAME to create your own custom pallet, then add it to your customized runtime.

Because building a blockchain from scratch is a complex business that requires a lot of specialized skills and knowledge, most builders start with a core set of the outer node components and focus their energy on building customized runtime logic.
However, even if you aren't building lower-level blockchain components, building a custom runtime will require you to make some important design decisions.
For example, you can build a Substrate runtime:

- Without any predefined FRAME pallets.
- Only using predefined FRAME pallets.
- Using a combination of predefined and custom pallets.
- Using smart contracts and predefined FRAME pallets.
- With a combination of predefined and custom pallets and smart contracts.

As part of your design process, you can explore the predefined [FRAME pallets](https://github.com/paritytech/substrate/tree/master/frame) to see if they provide features that you want to use or customize and identify any custom pallets you might need.

## Where to go next

Explore the following resources to learn more.

#### Tell me more

- [Blockchain basics](/main-docs/fundamentals/blockchain-basics/)
- [Why substrate?](/main-docs/fundamentals/why-substrate)
- [Architecture](/main-docs/fundamentals/architecture/)
- [Runtime development](/main-docs/fundamentals/runtime-development/)

#### Guide me

- [Build a local blockchain](/tutorials/get-started/build-local-blockchain/)
- [Simulate a network](/tutorials/get-started/simulate-network/)
- [Add trusted nodes](/tutorials/get-started/add-trusted-nodes/)

<!--
#### Show me (related video content)

*

#### Teach me (related how to content)

*
-->
