---
title: Runtime development
description: Introduces the core programming interfaces, primitives, and modules that are essential to developing the runtime for a Substrate blockchain.
keywords:
---

As discussed in [Architecture](/learn/architecture/), the **runtime** for a Substrate node contains all of the business logic for executing transactions, saving state transitions, and interacting with the outer node.
Substrate provides all of the tools required to build common blockchain components so you can focus on developing the runtime logic that defines the blockchain behavior.

## State transitions and the runtime

At the most basic level, every blockchain is essentially a ledger or record of each change that takes place on-chain.
In Substrate-based chains, these changes to state are recorded in the runtime.
Because the runtime handles this operation, the runtime is sometimes described as providing the [state transition function](/reference/glossary#state-transition-function-stf).

Because state transitions occur in the runtime, the runtime is where you define the **storage items** that represent the blockchain [state](/reference/glossary#state) and the [transactions](/learn/transaction-types) that allow blockchain users to make changes to this state.

![State and functions in the runtime](/media/images/docs/state-transition-function.png)

The Substrate runtime determines which transactions are valid and invalid and how the chain state is changed in response to transactions.

## Runtime interfaces

As you learned in [Architecture](/learn/architecture/), the outer node is responsible for handling peer discovery, transaction pooling, block and transaction gossiping, consensus, and answering RPC calls from the outside world.
These tasks frequently require the outer node to query the runtime for
information or to provide information to the runtime.
The runtime API facilitates this kind of communication between the outer node and the runtime.

In Substrate, the `sp_api` crate provides an interface to implement a runtime API.
It is designed to give you flexibility in defining your own custom interfaces using the [`impl_runtime_apis`](https://paritytech.github.io/substrate/master/sp_api/macro.impl_runtime_apis.html)
macro.
However, every runtime must implement the [`Core`](https://paritytech.github.io/substrate/master/sp_api/trait.Core.html) and [`Metadata`](https://paritytech.github.io/substrate/master/sp_api/trait.Metadata.html) interfaces.
In addition to these required interfaces, most Substrate nodes—like the node template—implement the following runtime interfaces:

- [`BlockBuilder`](https://paritytech.github.io/substrate/master/sp_block_builder/trait.BlockBuilder.html) for the functionality required to build a block.
- [`TaggedTransactionQueue`](https://paritytech.github.io/substrate/master/sp_transaction_pool/runtime_api/trait.TaggedTransactionQueue.html) for validating transactions.
- [`OffchainWorkerApi`](https://paritytech.github.io/substrate/master/sp_offchain/trait.OffchainWorkerApi.html) for enabling offchain operations.
- [`AuraApi`](https://paritytech.github.io/substrate/master/sp_consensus_aura/trait.AuraApi.html) for block authoring and validation using a round-robin method of consensus.
- [`SessionKeys`](https://paritytech.github.io/substrate/master/sp_session/trait.SessionKeys.html) for generating and decoding session keys.
- [`GrandpaApi`](https://paritytech.github.io/substrate/master/sp_finality_grandpa/trait.GrandpaApi.html) for block finalization into the runtime.
- [`AccountNonceApi`](https://paritytech.github.io/substrate/master/frame_system_rpc_runtime_api/trait.AccountNonceApi.html) for querying transaction indices.
- [`TransactionPaymentApi`](https://paritytech.github.io/substrate/master/pallet_transaction_payment_rpc_runtime_api/trait.TransactionPaymentApi.html) for querying information about transactions.
- [`Benchmark`](https://paritytech.github.io/substrate/master/frame_benchmarking/trait.Benchmark.html) for estimating and measuring execution time required to complete transactions.

## Core primitives

Substrate also defines the core primitives that the runtime must implement.
The Substrate framework makes minimal assumptions about what your runtime must provide to the other layers of Substrate.
However, there are a few data types that must be defined and must fulfill a particular
interface to work within the Substrate framework.

These core primitives are:

- `Hash`: A type which encodes a cryptographic digest of some data. Typically just a 256-bit
  quantity.

- `DigestItem`: A type which must be able to encode one of a number of "hard-wired" alternatives
  relevant to consensus and change-tracking as well as any number of "soft-coded" variants, relevant
  to specific modules within the runtime.

- `Digest`: A series of DigestItems. This encodes all information that is relevant for a
  light-client to have on hand within the block.

- `Extrinsic`: A type to represent a single piece of data external to the blockchain that is
  recognized by the blockchain. This typically involves one or more signatures, and some sort of
  encoded instructions (e.g. for transferring ownership of funds or calling into a smart contract).

- `Header`: A type which is representative (cryptographically or otherwise) of all information
  relevant to a block. It includes the parent hash, the storage root and the extrinsics trie root,
  the digest and a block number.

- `Block`: Essentially just a combination of `Header` and a series of `Extrinsics`, together with a
  specification of the hashing algorithm to be used.

- `BlockNumber`: A type which encodes the total number of ancestors any valid block has. Typically a
  32-bit quantity.

## FRAME

[FRAME](/reference/glossary/#frame) is one of the most powerful tools available to you as a runtime developer.
As mentioned in [Substrate empowers developers](/), FRAME is an acronym for **Framework for Runtime Aggregation of Modularized Entities** and it encompasses a significant number of modules and support libraries that simplify runtime development.
In Substrate, these modules—called **pallets**—offer customizable business logic for different use cases and features that you might want to include in your runtime.
For example, there are pallets that provide a framework of business logic for staking, consensus, governance, and other common activities.

For a summary of the pallets available, see [FRAME pallets](/reference/frame-pallets/).

In addition to pallets, FRAME provides services to interact with the runtime through the following libraries and modules

- [FRAME system crate `frame_system`](https://paritytech.github.io/substrate/master/frame_system/index.html) provides low-level types, storage, and functions for the runtime.

- [FRAME support crate `frame_support`](https://paritytech.github.io/substrate/master/frame_support/index.html) is a collection of Rust macros, types, traits, and modules that simplify the development of Substrate pallets.

- [FRAME executive pallet `frame_executive`](https://paritytech.github.io/substrate/master/frame_executive/index.html) orchestrates the execution of incoming function calls to the respective
  pallets in the runtime.

The following diagram illustrates how FRAME and its system, support, and executives modules provide services for the runtime environment.

![FRAME and the runtime architecture](/media/images/docs/runtime-and-frame.png)

### Composing a runtime with pallets

You can build a Substrate-based blockchain without using FRAME.
However, FRAME pallets enable you to compose custom runtime logic using predefined components as a starting point.
Each pallet defines specific types, storage items, and functions to implement a specific set of features or functionality for a runtime.

The following diagram illustrates how you can select and combine FRAME pallets to compose a runtime.

![Compose a runtime with FRAME](/media/images/docs/compose-runtime.png)

### Building custom pallets

In addition to the library of pre-built FRAME pallets, you can use the FRAME libraries and services to build your own custom pallets.
With custom pallets, you have the flexibility to define the runtime behavior that best suits your purposes.
Because each pallet has its own discrete logic, you can combine pre-built and custom pallets to control the features and functionality your blockchain provides and achieve the results you want.

For example, you might include the [Balances pallet](https://github.com/paritytech/substrate/tree/master/frame/balances) in your runtime to use its cryptocurrency-related storage items and functions for managing tokens, but add custom logic to call a pallet you write when an account balance changes.

Most pallets are composed with some combination of the following sections:

- Imports and dependencies
- Pallet type declaration
- Runtime configuration trait
- Runtime storage
- Runtime events
- Hooks for logic that should be executed in a specific context
- Function calls that can be used to execute transactions

For example, if you wanted to define a custom pallet, you might start with a skeleton structure for the pallet similar to the following:

```rust
// Add required imports and dependencies
pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
 use frame_support::pallet_prelude::*;
 use frame_system::pallet_prelude::*;

 // Declare the pallet type
 // This is a placeholder to implement traits and methods.
 #[pallet::pallet]
 #[pallet::generate_store(pub(super) trait Store)]
 pub struct Pallet<T>(_);

 // Add the runtime configuration trait
 // All types and constants go here.
 #[pallet::config]
 pub trait Config: frame_system::Config { ... }

 // Add runtime storage to declare storage items.
 #[pallet::storage]
 #[pallet::getter(fn something)]
 pub type MyStorage<T: Config> = StorageValue<_, u32>;

 // Add runtime events
 #[pallet::event]
 #[pallet::generate_deposit(pub(super) fn deposit_event)]
 pub enum Event<T: Config> { ... }

 // Add hooks to define some logic that should be executed
 // in a specific context, for example on_initialize.
 #[pallet::hooks]
 impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> { ... }

 // Add functions that are callable from outside the runtime.
 #[pallet::call]
 impl<T:Config> Pallet<T> { ... }
}
```

You can compose pallets with some or all of the sections, as needed.
As you start to design and build your custom runtime, you'll learn more about FRAME libraries and the runtime primitives used to define configuration traits, storage items, events, and errors, and how to write the function calls that are dispatched to the runtime for execution.

## Where to go next

Now that you are familiar with the basics of Substrate runtime development and working with pallets, explore the following topics and tutorials to learn more.

- [Frame pallets](/reference/frame-pallets/)
- [Add a module to the runtime](/tutorials/build-application-logic/add-a-pallet)
- [Rust for Substrate](/learn/rust-basics/)
- [Macro reference](/reference/frame-macros/)
- [Use macros in a custom pallet](/tutorials/build-application-logic/use-macros-in-a-custom-pallet/)
