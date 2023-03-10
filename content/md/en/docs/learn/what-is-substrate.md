---
title: What is Substrate?
description: Explains the core principles behind the design of Substrate and how the design decisions informed the technologies used.
keywords:
---

Substrate is a Rust-based framework for building purpose-driven blockchains that can interoperate in a multi-chain network, much like the internet enables computers on diverse networks to interoperate.

An important part of learning how to use this framework is understanding that it envisions and embraces a multi-chain universe.
Instead of a single general-purpose chain with the limitations of the underlying environment, Substrate is designed to allow for specialization, optimization, and adaptability.

In this vision of the future—a multi-chain future—blockchains are specialized for different purposes and built to address specific problems or use cases.
Substrate is designed to make blockchains easy to customize and upgrade, so that projects can evolve over time and adapt to new opportunities. 
Instead of a single dominant chain with an inflexible protocol, Substrate is designed to allow for experimentation, coordination, and collaboration across multiple chains.

But if the future of the blockspace consists of many different blockchains performing specialized tasks, how does one go about building those blockchains?
Building a blockchain from scratch is expensive, time-consuming, and error-prone. It requires an investment of capital and advanced expertise in multiple technologies and disciplines, Making mistakes can be prohibitively costly.
It is, inherently, not for the faint of heart.

With so many barriers to entry, how then is a multi-chain future possible?
And if you were to overcome all of these difficulties to build a blockchain, how would you upgrade it to keep it relevant as society and technology evolve? 

## Core design principles

Before Substrate, a lot of resources were expended trying to get this blockchain of the multi-chain future right, trying to build a blockchain that was future-proof and upgradeable, with all the right components.
All of that work—time, money, and energy—resulted in a realization that well thought-out choices made today would likely become the mistakes of tomorrow. If the blockchain relied on some specific technology or assumption, over time that technology or assumption would likely hamper and, ultimately, stifle innovation. 
That realization, along with the need to provide tools for a multi-chain future, led to the development of Substrate. The following defining principles emerged as core design decisions for the Substrate framework:

- Rust as the core programming language for the codebase.
- WebAssembly as an execution environment for application logic.
- Extensive use of layered abstractions, generic implementations, and flexible application programming interfaces as primary coding practices and the separation of libraries into distinct architectural components.

Each of these design decisions plays an important role in how Substrate operates and how you can use Substrate to build specialized composable blockchains using reusable and customizable components.

## Why Substrate uses Rust

There are several important benefits that are the direct result of selecting Rust as the underlying programming language for the Substrate framework.
Although it might be somewhat more complex to learn, Rust is a highly performant system-level programming language designed for building bullet-proof, mission-critical, and production-grade software.

- Rust has a sophisticated memory management system that relies on ownership rules rather than memory allocation and garbage collection. 
   These ownership rules enable the compiler to verify every variable you use and every memory address you reference to avoid memory leaks.

- The Rust compiler also prevents you from introducing the kinds of coding mistakes that make systems vulnerable.

- Rust provides abstractions—like traits and generics—that make code more flexible without imposing performance overhead. 

- The compiler performs static checks on your application source code while the code is being compiled. 
   When you execute the compiled code, the performance is comparable to the fastest programming languages currently available.

- Compiled Rust code has a relatively small footprint and can run on embedded devices with support for any operating system.

In addition to all of these other benefits, Rust code can be compiled to WebAssembly and WebAssembly is at the heart of what makes Substrate flexible and its runtime upgradeable.

## WebAssembly and upgradeability

Most components in a Substrate blockchain are customizable or support multiple implementations for maximum flexibility.
However, storing the application logic onchain as a WebAssembly binary is one of the few attributes of Substrate that you can’t change.

If you don't use WebAssembly for the application logic, you're no longer using Substrate.
Substrate-based chains are designed to be upgradable by default. 
This is made possible by encoding the application logic of your blockchain—the specialized business logic—as a WebAssembly binary and storing that binary as a part of the blockchain state. 
In the same way you can execute a transaction to change an account balance, you can execute a transaction to change the WebAssembly code. 
After the block containing that transaction is produced, the next block reflects the updated blockchain state.

## Abstractions and generics

In addition to the core application logic in the WebAssembly binary, there are many other components of a Substrate-based blockchain that you can customize. 
For example, there are multiple implementations for the consensus, networking, and database layers, including support for the following:

- Multiple consensus engines (BABE/Grandpa/AURA)
- Multiple network protocols (QUIC, TCP)
- Multiple database implementations (ParityDB, RocksDB)

In the Polkadot ecosystem, there are numerous examples of parachain projects that have customized different aspects of the Substrate node. 
In many cases, those ecosystem applications require access to the core components of the chain—such as the consensus layer or transaction pool—wouldn’t be possible if they were written as smart contract applications.
At the application layer, you have even more flexibility. 
For example, you can choose between an accounts-based ledger format or UTXO. 
You have full control over how to implement transaction fees or define custom incentives around resource usage.
With Substrate, you can build virtually any type of blockchain you can imagine by customizing and extending the framework to suit your needs.
