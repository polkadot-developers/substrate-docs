---
title: Why Substrate?
description: docs
keywords:
  - vision
  - smart contracts
  - runtime development
  - blockchain
  - consensus
  - substrate
  - architecture
---

Blockchain development is complex.
It involves sophisticated technologies—including advanced cryptography and distributed network communication—that you have to get right to provide a secure platform for applications to run on and for users to trust.
There are hard problems around scale, governance, interoperability, and upgradeability to address.
The complexity creates a high barrier to entry for developers to overcome.
With this in mind, the first question to answer is: what do you want to build?

Substrate isn't a perfect fit for every use case, application, or project.
However, Substrate might be the perfect choice if you want to build a blockchain that is:

- tailored to a very specific use case
- able to connect and communicate with other blockchains
- customizable with predefined composable modular components
- able to evolve and change with upgrades over time

Substrate is a Software Development Kit (SDK) specifically designed to provide you with all of the fundamental components a blockchain requires so you can focus on crafting the logic that makes your chain unique and innovative.
Unlike other distributed ledger platforms, Substrate is:

- [Flexible](#flexible)
- [Open](#open)
- [Interoperable](#interoperable)
- [Future-proof](#future-proof)

## Flexible

Most blockchain platforms have very tightly coupled, opinionated, sub-systems that are quite hard to decouple.
There is risk as well in a chain based on a fork of another blockchain that those non-obvious couplings can fundamentally undermine the blockchain system itself.

Substrate is a fully modular blockchain framework that lets you compose a chain with explicitly decoupled components, by selecting the network stack, consensus model, or governance method that suits your project or by creating your own components.

With Substrate, you can deploy a blockchain that's designed and built for your specifications, but that can also evolve with your changing needs.

## Open

All of the Substrate architecture and tooling is available under [open-source licensing](https://github.com/paritytech/substrate#license).
Core components of the Substrate framework use open protocols such as `libp2p` and `jsonRPC` while empowering you to decide how much you want to customize your blockchain architecture.
Substrate also has a large, active, and helpful [builder community](https://substrate.io/ecosystem/) contributing to the ecosystem.
Contributions from the community enhance the capabilities available for you to incorporate into your own blockchain as it evolves.

## Interoperable

Most blockchain platforms provided limited ability to interact with other blockchain networks.
All Substrate-based blockchains can interoperate with the other blockchains through [Cross-Consensus Messaging](https://wiki.polkadot.network/docs/learn-crosschain) (XCM).
Substrate can be used to create chains as independent networks (solo chains), or tightly coupled to a [relay chain](https://wiki.polkadot.network/docs/learn-architecture#relay-chain) to share its security as a [parachain](https://wiki.polkadot.network/docs/learn-parachains).

## Future-proof

Substrate is built to be upgradeable, composable, and adaptable.
The state transition logic—the Substrate runtime—is a self-contained WebAssembly object.
Your nodes can be given the ability to completely change the runtime itself under specific conditions, inducing a runtime upgrade _network wide_.
Thus "forkless" upgrades are possible, as no action is required in most cases for nodes to operate with this new runtime.
Over time, your network's runtime protocols can seamlessly, and perhaps radically, evolve with the needs of your users.

## Where to go next

Substrate provides a unique and powerful framework for building blockchain networks and blockchain applications.

- You can get started with a pre-configured node and start a solo chain with no code.
- You can use Substrate to build a custom solo chain that runs independent of any other blockchains.
- You can couple your Substrate chain to a relay chain like Polkadot or Kusama.

Depending on your background and interests, explore the following resources to learn more.

#### Tell me

- [Blockchain basics](/fundamentals/blockchain-basics/)
- [Architecture](/fundamentals/architecture/)
- [Runtime development](/fundamentals/runtime-development)
- [Networks and blockchains](/fundamentals/node-and-network-types/)
- [Install](/install/)

#### Guide me

- [Build a local blockchain](/tutorials/get-started/build-local-blockchain/)
- [Simulate a network](/tutorials/get-started/simulate-network/)
- [Add trusted validators](/tutorials/get-started/add-trusted-nodes/)

If you prefer to explore code directly, you can start building in the [Substrate Playground](https://docs.substrate.io/playground/) and consult the [API reference (Rustdocs)](https://paritytech.github.io/substrate/master) to get details about the Rust crates within Substrate.
