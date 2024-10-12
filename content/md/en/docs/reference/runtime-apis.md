---
title: Runtime APIs
description: Highlights the runtime interfaces that enable communication with outer node services.
keywords:
---

As discussed in [Architecture](/learn/architecture), Substrate nodes consist of outer node services and a runtime and this separation of responsibilities is an important concept for designing Substrate-based chains and building upgradeable logic.
However, the outer node services and the runtime must communicate with each other to complete many critical operations, including reading and writing data and performing state transitions.
The outer node services communicate with the runtime by calling runtime application programming interfaces to perform specific tasks.
By default, the Substrate runtime provides the following traits for outer node services to call:

- [`AccountNonceApi`](https://paritytech.github.io/substrate/master/frame_system_rpc_runtime_api/trait.AccountNonceApi.html)
- [`AuraApi`](https://paritytech.github.io/substrate/master/sp_consensus_aura/trait.AuraApi.html)
- [`Benchmark`](https://paritytech.github.io/substrate/master/frame_benchmarking/trait.Benchmark.html)
- [`BlockBuilder`](https://paritytech.github.io/substrate/master/sp_block_builder/trait.BlockBuilder.html)
- [`GrandpaApi`](https://paritytech.github.io/substrate/master/sp_consensus_grandpa/trait.GrandpaApi.html)
- [`NominationPoolsApi`](https://paritytech.github.io/substrate/master/pallet_nomination_pools_runtime_api/trait.NominationPoolsApi.html)
- [`OffchainWorkerApi`](https://paritytech.github.io/substrate/master/sp_offchain/trait.OffchainWorkerApi.html)
- [`SessionKeys`](https://paritytech.github.io/substrate/master/sp_session/trait.SessionKeys.html)
- [`TaggedTransactionQueue`](https://paritytech.github.io/substrate/master/sp_transaction_pool/runtime_api/trait.TaggedTransactionQueue.html)
- [`TransactionPaymentApi`](https://paritytech.github.io/substrate/master/pallet_transaction_payment_rpc_runtime_api/trait.TransactionPaymentApi.html)

## AccountNonceApi

Use the `AccountNonceApi` to get the nonce for a specified account identifier.
The nonce for each account is incremented each time that account is used to complete a transaction.
Therefore, the nonce is also sometimes referred to as a transaction index.

This API provides the following methods:

- `account_nonce` to get the current account nonce for a specified AccountId.
- `account_nonce_with_context` to get the current account nonce for a specified AccountId and execution context.

## AuraApi

Use the `AuraApi` to manage block authoring with the slot-based consensus that uses a round-robin rotation of authorities.
Although most consensus-related tasks are handled by outer node services, the runtime must provide this API for consensus-related tasks that are part of the state transition logic.

This API provides the following methods for authority-based round-robin scheduling ([Aura](/reference/glossary/#aura)):

- `slot_duration` to get the slot duration for Aura consensus.
- `slot_duration_with_context` to get the slot duration for Aura consensus within a specified execution context.
- `authorities` to get the authorities set for Aura consensus.
- `authorities_with_context` to get the authorities set for Aura consensus within a specified execution context.

## Benchmark

Use the `Benchmark` API to provide the information required for [benchmarking](/test/benchmark/) function execution in a FRAME runtime.

This API provides the following methods:

- `benchmark_metadata` to get the benchmark metadata available for this runtime.
- `benchmark_metadata_with_context` to get the benchmark metadata available for this runtime within a specified execution context.
- `dispatch_benchmark` to dispatch the specified benchmark.
- `dispatch_benchmark_with_context` to dispatch the specified benchmark within a specified execution context.

## BlockBuilder

Use the `BlockBuilder` API to provide the functionality required for building and finalizing a block.
The runtime is responsible for checking transaction validity and executing the transactions to construct blocks.
For the outer node, transactions are an opaque vector array (Vec<u8>).

This API provides the following methods:

- `apply_extrinsic` to include the specified extrinsic in the current block.
  The method also returns a result that indicates whether the transaction was included in the block or not.
- `apply_extrinsic_with_context` to include the specified extrinsic in the current block and specified execution context.
  The method also returns a result that indicates whether the transaction was included in the block or not.
- `finalize_block` to finish construction of the current block.
- `finalize_block_with_context` to finish construction of the current block within the specified execution context.
- `inherent_extrinsics` to include inherent extrinsic transactions in the current block.
  Inherent transaction types vary from chain to chain.
- `inherent_extrinsics_with_context` to include inherent extrinsic transactions in the current block and specified execution context.
  Inherent transaction types vary from chain to chain.
- `check_inherents` to check that the inherent transactions are valid.
- `check_inherents_with_context` to check that the inherent transactions are valid within the specified execution contex.

## GrandpaApi

Use the `GrandpaApi` to integrate authority-set changes from the GRANDPA finalization protocol into the runtime.
The GRANDPA finalization protocol signals changes to the authority sets by specifying a delay of some number of blocks.
The changes ar then automatically applied in the runtime after the specified number of blocks have been finalized.

This API provides the following methods:

- `grandpa_authorities` to get the current authorities and weights for GRANDPA finalization.
- `grandpa_authorities_with_context` to get the current authorities and weights for GRANDPA finalization in the specified execution context.
- `current_set_id` to get the current GRANDPA authority set identifier.
- `current_set_id_with_context` to get the current GRANDPA authority set identifier in the specified execution context.

The `GrandpaApi` also provides methods for submitting transactions to report evidence of misbehavior and related proof of key ownership.
For information about these methods, see [`GrandpaApi`](https://paritytech.github.io/substrate/master/sp_consensus_grandpa/trait.GrandpaApi.html).

## NominationPoolsApi

Use the `NominationPoolsApi` to get information about nomination pools and nomination pool members.

This API provides the following methods:

- `pending_rewards` to get the pending rewards for the nomination pool member with the specified AccountId.
- `pending_rewards_with_context` to get the pending rewards for the nomination pool member with the specified AccountId within the specified execution context.

## OffchainWorkerApi

Use the `OffchainWorkerApi` to start [offchain worker operations](/learn/offchain-operations/).

This API provides the following methods:

- `offchain_worker` to start the off-chain task for a specified block header.
- `offchain_worker_with_context` to start the off-chain task for a specified block header and execution context.

## SessionKeys

Use the `SessionKeys` API to generate and decode [session keys](/learn/accounts-addresses-keys/)
(https://paritytech.github.io/substrate/master/sp_session/trait.SessionKeys.html)

This API provides the following methods:

- `generate_session_keys` to generate a set of session keys.
  If you generate the keys using a specified seed, the seed must to be a valid `utf8` string.
  You should store the generated keys in the keystore exposed by the runtime externalities.
  The method returns the public keys as concatenated SCALE-encoded values.

- `generate_session_keys_with_context` to generate a set of session keys within the specified execution context.
  If you generate the keys using a specified seed, the seed must to be a valid `utf8` string.
  You should store the generated keys in the keystore exposed by the runtime externalities.
  The method returns the public keys as concatenated SCALE-encoded values.

- `decode_session_keys` to decode the specified public session keys.
  The method returns the list of raw public keys and the key type.

- `decode_session_keys_with_context` to decode the specified public session keys within the specified execution context.
  The method returns the list of raw public keys and the key type.

## TaggedTransactionQueue

Use the `TaggedTransactionQueue` API to validate transactions in the transaction queue.

This API provides the following methods:

- `validate_transaction` to verify the specified transaction is a valid transaction given the state specified by the `block_hash` parameter.

- `validate_transaction_with_context` to verify the specified transaction is a valid transaction given the state specified by the `block_hash` parameter within the specified execution context.

## TransactionPaymentApi

Use the `TransactionPaymentApi` to query the runtime for information about transactions and transaction fees.

This API provides the following methods:

- `query_info` to return information about a specified transaction dispatched to the runtime.
- `query_info_with_context` to return information about a specified transaction dispatched to the runtime within the specified execution context.
- `query_fee_details` to return information about the transaction fees for a specified transaction.
- `query_fee_details_with_context` to return information about the transaction fees for a specified transaction within the specified execution context.

## Where to go next

- [Runtime development](/learn/runtime-development/)
- [FRAME macros](/reference/frame-macros)
- [impl_runtime_apis](https://paritytech.github.io/substrate/master/sp_api/macro.impl_runtime_apis.html)
