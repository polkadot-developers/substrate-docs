---
title: Runtime development
description: Introduces the core programming interfaces, primitives, and modules that are essential to developing the runtime for a Substrate blockchain.
keywords: []
---

As discussed in [Architecture](/main-docs/fundamentals/architecture/), the **runtime** for a Substrate node contains all of the business logic for executing transactions, saving state transitions, and interacting with the outer node.
Substrate provides all of the tools required to build common blockchain components so you can focus on developing the runtime logic that defines the blockchain behavior.

## State transitions and the runtime

At the most basic level, every blockchain is essentially a ledger or record of each change that takes place on-chain.
In Substrate-based chains, these changes to state are recorded in the runtime.
Because the runtime handles this operation, the runtime is sometimes described as providing the [state transition function](/reference/glossary#state-transition-function-stf).

Because state transitions occur in the runtime, the runtime is where you define the **storage items** that represent the blockchain [state](/reference/glossary#state) and the [functions](/main-docs/fundamentals/extrinsics) that allow blockchain users to make changes to this state.

![State and functions in the runtime](/media/images/docs/main-docs/state-transistion-function.png)

The Substrate runtime determines which transactions are valid and invalid and how the chain state is changed in response to transactions.

## Runtime interfaces

As you learned in [Architecture](/main-docs/fundamentals/architecture/), the outer node is responsible for handling peer discovery, transaction pooling, block and transaction gossiping, consensus, and answering RPC calls from the outside world. 
These tasks frequently require the outer node to query the runtime for
information or to provide information to the runtime.
The runtime API facilitates this kind of communication between the outer node and the runtime.

In Substrate, the `sp_api` crate provides an interface to implement a runtime API.
It is designed to give you flexibility in defining your own custom interfaces using the [`impl_runtime_apis`](/rustdocs/latest/sp_api/macro.impl_runtime_apis.html)
macro. 
However, every runtime must implement the [`Core`](/rustdocs/latest/sp_api/trait.Core.html) and [`Metadata`](/rustdocs/latest/sp_api/trait.Metadata.html) interfacess. 
In addition to these required interfaces, most Substrate nodes—like the node template—implement the following runtime interfaces:

- [`BlockBuilder`](/rustdocs/latest/sp_block_builder/trait.BlockBuilder.html) for the functionality required to build a block.
- [`TaggedTransactionQueue`](/rustdocs/latest/sp_transaction_pool/runtime_api/trait.TaggedTransactionQueue.html) for validating transactions.
- [`OffchainWorkerApi`](/rustdocs/latest/sp_offchain/trait.OffchainWorkerApi.html) for enabling off-chain operations.
- [`AuraApi`](/rustdocs/latest/sp_consensus_aura/trait.AuraApi.html) for block authoring and validation using a round-robin method of consensus.
- [`SessionKeys`](/rustdocs/latest/sp_session/trait.SessionKeys.html) for generating and decoding session keys.
- [`GrandpaApi`](/rustdocs/latest/sp_finality_grandpa/trait.GrandpaApi.html) for block finalization into the runtime.
- [`AccountNonceApi`](/rustdocs/latest/frame_system_rpc_runtime_api/trait.AccountNonceApi.html) for querying transaction indices.
- [`TransactionPaymentApi`](/rustdocs/latest/pallet_transaction_payment_rpc_runtime_api/trait.TransactionPaymentApi.html) for querying information about transactions.
- [`Benchmark`](/rustdocs/latest/frame_benchmarking/trait.Benchmark.html) for estimating and measuring execution time required to complete tranactions.

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

- `Block`: Essentially just a combination of `Header` and a series of `Extrinsic`s, together with a
  specification of the hashing algorithm to be used.

- `BlockNumber`: A type which encodes the total number of ancestors any valid block has. Typically a
  32-bit quantity.

## FRAME primitives

The core Substrate codebase ships with [FRAME](/v3/runtime/frame), Parity's system
for Substrate runtime development that is used for chains like
[Kusama](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/lib.rs) and
[Polkadot](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/src/lib.rs). FRAME
defines additional runtime primitives and
provides a framework that makes it easy to construct a runtime by composing modules, called
[pallets](/v3/runtime/frame#pallets). Each pallet encapsulates domain-specific logic that is
expressed as a set of a [storage items](/v3/runtime/storage),
[events](/v3/runtime/events-and-errors),
[errors](/v3/runtime/events-and-errors#errors), and
[dispatchable functions](/v3/getting-started/glossary#dispatch). FRAME developers
can [create their own pallets](/v3/runtime/frame#pallets) and reuse existing pallets,
including [over 50 of those shipped with Substrate](/v3/runtime/frame#prebuilt-pallets).

![Runtime Composition](../../../../src/images/docs/concepts/frame-runtime.png)

There are an additional set of primitives that are assumed about a runtime built with the Substrate
FRAME. These are:

- `Call`: The dispatch type that can be called via an extrinsic.

- `Origin`: Represents where a call came from. For example, a signed message (a transaction), an
  unsigned message (an inherent extrinsic), or a call from the runtime itself (a root call).

- `Index`: An account index (aka nonce) type. This stores the number of previous transactions
  associated with a sender account.

- `Hashing`: The hashing algorithm being used in the runtime (e.g. Blake2).

- `AccountId`: The type used to identify user accounts in the runtime.

- `Event`: The type used for events emitted by the runtime.

- `Version`: A type which represents the version of the runtime.

Although a lot of core runtime development can be enabled with FRAME and
its related primitives, FRAME is not the only system for developing
Substrate based blockchains.

## Next steps

### Learn more

- Learn about the [Substrate FRAME](/v3/runtime/frame).
- Follow a
  [tutorial to develop your first Substrate chain](/tutorials/v3/create-your-first-substrate-chain).
- Follow a [tutorial to add a pallet to your Substrate runtime](/tutorials/v3/add-a-pallet).

### References

- See the
  [primitive types defined in `node-primitives`](/rustdocs/latest/node_primitives/index.html).

- See the
  [`traits` defined in `sp-runtime`](/rustdocs/latest/sp_runtime/traits/index.html).
