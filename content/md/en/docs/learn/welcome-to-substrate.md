---
title: Welcome to Substrate
description:
keywords:
---

Substrate is a Software Development Kit (SDK) that allows you to build application-specific blockchains that can run as standalone services or in parallel with other chains with the shared security provided by the Polkadot ecosystem.

## Simplicity with the freedom to innovate

With Substrate, you have complete creative control over the application you want to build.
You can select predefined application logic from a large library of open source modules and templates to speed your development time.
Not finding what you need in the current library?
That’s not a problem—it’s an opportunity to build custom modules from reusable Rust macros and scaffolding code.
If you’re feeling more adventurous or have a novel idea, you’re free to innovate on the blockchain design by using low-level primitives.

![Development time and complexity](/media/images/docs/development-complexity.png)

## Building with templates and modules

Most projects start with templates to reduce complexity and development time, then progress by modifying existing modules and adding new ones. The modules, macros, and libraries are the core components of the FRAME development environment. The main purpose of FRAME is to provide a modular and flexible collection of components for building a customized Substrate runtime.

The FRAME development environment enables you to select and configure the specific modules—called **pallets**—that you want to use in your runtime.
Pallets provide customizable business logic for common use cases like managing account balances and voting on proposals.
Pallets also provide the business logic for blockchain operations such as staking and consensus.

## Composing a runtime

Each pallet defines specific types, storage items, and functions to implement a specific set of features or functionality for a runtime.
You select and combine the pallets that suit your application to compose a custom runtime.
For example, if your application needs to manage account balances, you can simply include the Balances pallet in the configuration of your runtime logic.
You can then modify the configuration of the pallet in your custom runtime to suit your application.

In the following diagram, the runtime is composed of eight pallets to implement consensus, include timestamps for blocks, manage assets and balances, and prepare a framework for governance and managing pooled funds.

![Select pallets to compose the runtime](/media/images/docs/compose-runtime.png)

In addition to the pallets that provide the functionality you choose to use in the runtime, FRAME relies on a few underlying system services to construct and enable the client outer node services to interact with the runtime. These underlying services are provided by the following required modules:

- FRAME system crate frame_system provides low-level types, storage, and functions for the runtime.
- FRAME support crate frame_support is a collection of Rust macros, types, traits, and modules that simplify the development of Substrate pallets.
- FRAME executive pallet frame_executive orchestrates the execution of incoming function calls to the respective pallets in the runtime.

There are a lot of pallets available for you to use as building blocks for your runtime.
You can see the list of pallets available in the Substrate repository or in the Rust documentation.
For a summary with a brief description of the most common pallets, see FRAME pallets.

If you can’t find a pallet that provides the functionality you need, you can use FRAME to create your own custom pallet, then add that custom pallet to your customized runtime.

## Building with custom pallets

The FRAME development environment includes libraries that make it relatively easy to build your own custom pallets.
With custom pallets, you have the flexibility to define the runtime behavior that best suits your application.
Because each pallet has its own discrete logic, you can combine existing open source pallets with custom pallets to provide the specific features or functionality your application requires.
For example, you might include the Balances pallet in your runtime to use its functions and storage items for managing account balances, but add a custom pallet to send notifications to a service when an account balance changes.

## Why you should build with Substrate

Substrate is a fully **modular** and **flexible** framework that lets you compose a chain by selecting and customizing the infrastructure components best suited to your project.
For example, you can change the network stack, consensus model, transaction format, or governance method to deploy a blockchain that's uniquely designed for your application, but that can also evolve with your changing needs.

In addition to being composable and adaptable, Substrate is designed to be **upgradeable**.
The state transition logic—the Substrate runtime—is a self-contained WebAssembly object that you can change completely whenever you need to introduce new features or update existing features.
Because the runtime is a self-contained object, you can introduce runtime upgrades across the network without disrupting service or requiring nodes to be taken offline.
In most cases, no action is required for nodes to operate with a new runtime, so you can evolve your network protocols seamlessly over time to meet the needs of your users.

Substrate is also an **open source** project and all of the Substrate libraries and tools are available under open-source licensing.
In addition, core components of the Substrate framework use open protocols such as `libp2p` and `jsonRPC` while empowering you to decide how much you want to customize your blockchain architecture.
Substrate also has a large, active, and helpful builder community contributing to the ecosystem.
Contributions from the community enhance the capabilities available for you to incorporate into your own blockchain as it evolves.

Substrate supports **cross-consensus messaging (XCM)** to enable disparate systems to pass messages to each other.
