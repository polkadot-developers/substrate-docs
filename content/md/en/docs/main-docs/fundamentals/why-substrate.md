---
title: Why Substrate?
description: docs
keywords: vision, smart contracts, runtime development, blockchain, consensus, substrate, architecture
---

Blockchain development is complex.
It involves sophisticated technologies—including advanced cryptography and distributed network communication—that you have to get right to provide a secure platform for applications to run on and for users to trust.
There are hard problems around scale, governance, interoperability, and upgradeability to address.
The complexity creates a high barrier to entry tor developers to overcome.
With this in mind, the first question to answer is: what do you want to build?

Substrate isn't a perfect fit for every use case, application, or project.
However, Substrate might be the perfect choice if you want to build:

* A blockchain that is tailored to a specific purpose.
* A blockchain that can connect and communicate with other blockchains.
* A blockchain that can be customized with predefined mix-and-match components.
* A blockchain that can evolve and change with upgrades.
* A blockchain that overcomes many of the limitations that are inherent in other blockchain platforms.

Substrate is a software development kit (SDK) specifically designed for building blockchains with the capability to run as solo chains or to connect to other chains through the Polkadot ecosystem.
The pioneers and web3 leaders who are behind Substrate believe you shouldn't have to recreate blockchain fundamentals but should have the freedom to innovate without the restrictions and limitation imposed by the blockchain platform.

Unlike other distributed ledger platforms, Substrate is:

* [Flexible](#flexible)
* [Open](#open)
* [Interoperable](#interoperable)
* [Future-proof](#future-proof)

## Flexible

Most blockchain platforms require you to work within the rigid boundaries of design decisions made by others.

Substrate is a fully modular blockchain framework that lets you choose the components to use, by selecting the network stack, consensus model, or governance method that suits your project or by creating your own components.

With Substrate, you can deploy a blockchain that's designed and built for your specifications, but that can also evolve with your changing needs.

## Open

All of the Substrate architecture and tooling is available under open-source licensing. Core components of the Substrate framework use open protocols such as `libp2p` and `jsonRPC` while empowering you decide how much you want to customize your blockchain architecture. 
Substrate also has a large, active, and helpful builder community contributing to the ecosystem. 
Contributions from the community enhance the capabilities available for you to incorporate into your own blockchain as it evolves.

## Interoperable

Most blockchain platforms provided limited ability to interact with data that exists off-chain or on other chain platforms.
Substrate enables you to choose whether you blockchain operates independently as a solo chain, can connect as a solo chain to another chain using a bridge, or is integrated through a relay chain to connect with other chains. 
Independent Substrate-based blockchains can interoperate with the other blockchains through cross-chain message passing (XCMP). 
The XCMP protocol enables chains—referred to as **parachains**—to share trusted logic, for example, transferring tokens between networks, without any additional trust assumptions.

Substrate chains inherit security from relay chains like Polkadot or Kusama. As a result, even a small blockchain network can leverage the security guarantees of a large scale network.

## Future-proof

Substrate is built to be upgradeable, composable, and adaptable.
Its base layer—the Substrate runtime—is intentionally simple and based on the widely-accepted open protocol WebAssembly.
Keeping the foundation simple enables Substrate to adopt new technology as it evolves because it doesn't require alterations to the foundation. 
As a core design principle, Substrate enables you to build a blockchain comprised of components specific to your needs.

## Where to go next

Substrate provides a unique and powerful framework for building blockchain networks and blockchain applications. 
You can get started with something asa simple as a single node deployed using a JSON configuration file.
You can use Substrate to build a solo chain that runs independent of any other blockchains or you can connect your Substrate chain to a relay chain like Polkadot or Kusama and realize the benefits of a larger network.
If you are even more ambitious, you can use the Substrate core to design and implement a fully customized blockchain runtime from scratch and do so in any language that can compile to WebAssembly. 

Depending on your background and interests, explore the following resources to learn more.

#### Tell me

* [Fundamentals](/main-docs/fundamentals/)
* [Blockchain basics](/main-docs/fundamentals/blockchain-basics/)
* [Node architecture](/main-docs/fundamentals/node-architecture/)
* [Network topologies](/main-docs/fundamentals/network-topologies/)
* [Install](/main-docs/install/)

#### Guide me

* [Build a local blockchain](/tutorials/get-started/build-local-blockchain/)
* [Simulate a network](/tutorials/get-started/simulate-network/)
* [Add trusted validators](/tutorials/get-started/trusted-network/)

If you prefer to explore code directly, you can start building in the Developer Playground and consult the API reference to get details about the Rust crates you use.
