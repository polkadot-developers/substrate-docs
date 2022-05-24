---
title: Randomness
description: Describes how you can introduce randomness in a Substrate runtime.
keywords: []
---

Randomness has many applications in computer science and beyond. 
For example it is used in selecting councilors in some governance systems, performing statistical or scientific analyses, performing cryptographic operations, and gaming and gambling.
Many randomness-requiring applications are already finding a home on blockchain networks. 
This article describes how randomness is produced and used in Substrate runtimes.

## Deterministic randomness

In traditional non-blockchain computing, an application that required randomness could choose to use a real random value drawn from hardware, or a pseudo-random value that is actually deterministic, but impractical to predict thanks to cryptography.

Applications that run on the blockchain are more tightly constrained because all authorities in the network must agree on any on-chain value, including any randomness data that is injected. 
Because of this constraint, using real randomness directly is impossible.

Luckily, advancements in cryptographic primitives like [Verifiable Random Functions](https://en.wikipedia.org/wiki/Verifiable_random_function) and the development of multi-party randomness computation allow applications that require randomness to still be used in the blockchain.

## Substrate's randomness trait

Substrate provides a trait called [`Randomness`](/rustdocs/latest/frame_support/traits/trait.Randomness.html) that codifies the interface between the logic that generates randomness and the logic that consumes it. 
This trait allows the two pieces of logic to be written independently of each other.

### Consuming randomness

A developer who is writing a pallet that needs randomness, does not need to worry about providing that randomness. 
Rather, the pallet can simply require a randomness source that implements the trait.
The `Randomness` Trait provides two methods for gaining randomness.

The first method is called `random_seed`. 
It takes no parameters and gives back a raw piece of randomness. 
Calling this method multiple times in a block will return the same value each time.
Thus, it is not recommended to use this method directly.

The second method is called `random`.
It takes a byte-array which is used as a context identifier and returns a result as unique to this context and as independently from other contexts as allowed by the underlying randomness source.

### Generating randomness

There are many different ways to implement the `Randomness` trait, each of which represents different trade-offs between performance, complexity, and security. 
Substrate ships with two implementations, and developers are able to provide their own implementation if they would like to make different tradeoffs.

The first implementation provided by Substrate is the [Randomness Collective Flip Pallet](/rustdocs/latest/pallet_randomness_collective_flip/index.html).
This pallet is based on collective coin flipping.
It is quite performant, but not very secure.
This pallet should be used only when testing randomness-consuming pallets, not it production.

The second implementation is the [BABE pallet](/rustdocs/latest/pallet_babe/index.html), which uses verifiable random functions. 
This pallet provides production-grade randomness, and is used in Polkadot. 
Selecting this randomness source dictates that your blockchain use Babe consensus.

## Security properties

The `Randomness` trait provides a convenient and useful abstraction over randomness sources in Substrate runtimes. 
But the trait itself does not make any security guarantees. 
A runtime developer must ensure that the randomness source used meets the security requirements of _all_ pallet's that consume its randomness.

## Where to go next


- [How-to: Randomness](/reference/how-to-guides/pallet-design/randomness/)
- [`Randomness`](/rustdocs/latest/frame_support/traits/trait.Randomness.html)
