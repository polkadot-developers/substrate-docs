---
title: FRAME
section: reference
category: 
keywords: Frame, pallets, API
---

The FRAME development environment provides modules—called pallets—and support libraries that you can use, modify, and extend to build the runtime logic to suite the needs of your blockchain.

<!--TODO-Compare against Rust doc-->

This section provides an overview of the predefined pallets and links to the Rust API reference documentation, where you can find details about each pallet's interfaces.

## System pallets

The FRAME system pallets are integral to the Substrate runtime and provide core functionality that all other pallets depend on.

|<div style="width:125px;">System pallet name </div>  | What it's for
|: -------------------- |: ------------------------------------
| [`frame_executive`](https://paritytech.github.io/substrate/master/frame_executive/index.html) | Orchestrates incoming function calls by sending them to the appropriate pallets in the runtime.
|[`frame_support`](https://paritytech.github.io/substrate/master/frame_support/index.html) | Provides Rust macros, types, traits, and modules that generate boilerplate code for the pallet structure when compiled.
|[`frame_system`](https://paritytech.github.io/substrate/master/frame_system/index.html) | Defines low-level types for Substrate primitives, storage items, and core functions for the blockchain. All other pallets depend on the `frame_system` crate.

## Functional pallets

The Substrate development framework includes many functional pallets that provide features you might find generally useful as composable components of your blockchain.
These functional pallets are prebuilt and freely available to enable the community to share, reuse, and improve the interfaces to address common use cases.

| Prebuilt pallet name | What it's for
| -------------------- | ------------------------------------
| [`pallet_assets`](https://paritytech.github.io/substrate/master/pallet_assets/index.html) | Provides simple and secure methods for dealing with fungible assets.
| [`pallet_atomic_swap`](https://paritytech.github.io/substrate/master/pallet_atomic_swap/index.html) | Enables sending funds from an origin to a target. A proof is used to allow the target to claim the swap. If the swap is not claimed within a specified duration of time, the sender may cancel it.
| [`pallet_aura`](https://paritytech.github.io/substrate/master/pallet_aura/index.html) | Extends the authority round (Aura) consensus model by managing offline reporting.
| [`pallet_authority_discovery`](https://paritytech.github.io/substrate/master/pallet_authority_discovery/index.html) | Retrieves the current set of authorities, learns its own authority ID, and signs and verifies messages to and from other authorities.
| [`pallet_authorship`](https://paritytech.github.io/substrate/master/pallet_authorship/index.html) | Tracks the current author of the block and recent uncles.
| [`pallet_babe`](https://paritytech.github.io/substrate/master/pallet_babe/index.html) | Extends BABE consensus by |collecting on-chain randomness from VRF outputs and managing epoch transitions.
| [pallet_balances](https://paritytech.github.io/substrate/master/pallet_balances/index.html) | Provides functionality for handling accounts and balances.
| [`frame_benchmarking`](https://paritytech.github.io/substrate/master/frame_benchmarking/trait.Benchmark.html) | Contains common runtime patterns for benchmarking and testing purposes.
| [`pallet_collective`](https://paritytech.github.io/substrate/master/pallet_collective/index.html) | Allows a set of account IDs to make their collective feelings known through dispatched calls from specialized origins.
| [`pallet_contracts`](https://paritytech.github.io/substrate/master/pallet_contracts/index.html) | Provides functionality for the runtime to deploy and execute WebAssembly smart contracts.
| [`pallet_democracy`](https://paritytech.github.io/substrate/master/pallet_democracy/index.html) | Provides a democratic system that handles administration of general stakeholder voting.
| [`pallet_elections_phragmen`](https://paritytech.github.io/substrate/master/pallet_elections_phragmen/index.html) | Provides an election module based on [sequential Phragmén](https://wiki.polkadot.network/docs/en/learn-phragmen).
| [`pallet_elections`](https://paritytech.github.io/substrate/master/pallet_elections/index.html) | Provides an election module for stake-weighted membership in a collective. This pallet is no longer maintained.
| [`pallet_example`](https://paritytech.github.io/substrate/master/pallet_example/index.html) | Demonstrates concepts, APIs, and structures that are applicable for most pallets.
| [pallet_example_offchain_worker](https://paritytech.github.io/substrate/master/pallet_example_offchain_worker/index.html) | Demonstrates concepts, APIs, and structures that are applicable for most offchain workers.
| [`pallet_grandpa`](https://paritytech.github.io/substrate/master/pallet_grandpa/index.html) | Extends the GRANDPA consensus by managing the GRANDPA authority set ready for the native code.
| [`pallet_identity`](https://paritytech.github.io/substrate/master/pallet_identity/index.html) | Enables a federated naming system that allows multiple registrars to be added from a specified origin. Registrars can set a fee to provide identity-verification service.
| [`pallet_im_online`](https://paritytech.github.io/substrate/master/pallet_im_online/index.html) | Allows validators to gossip a heartbeat transaction with each new session to signal that the node is online.
| [`pallet_indices`](https://paritytech.github.io/substrate/master/pallet_indices/index.html) | Allocates indices for newly created accounts. An index is a short form of an address.
| [`pallet_membership`](https://paritytech.github.io/substrate/master/pallet_membership/index.html) | Allows control of membership of a set of `AccountId`s, useful for managing the membership of a collective.
| [`pallet_multisig`](https://paritytech.github.io/substrate/master/pallet_multisig/index.html) | Enables multi-signature dispatches.
| [`pallet_nicks`](https://paritytech.github.io/substrate/master/pallet_nicks/index.html) | Demonstrates simplified account naming on-chain. It makes no effort to create a name hierarchy, be a DNS replacement, or provide reverse lookups.
| [`pallet_offences`](https://paritytech.github.io/substrate/master/pallet_offences/index.html) | Tracks reported offences.
| [`pallet_proxy`](https://paritytech.github.io/substrate/master/pallet_proxy/index.html)| Allows accounts to give permission to other accounts to dispatch types of calls from their signed origin.
| [`pallet_randomness_collective_flip`](https://paritytech.github.io/substrate/master/pallet_randomness_collective_flip/index.html) | Provides a `random` function that can be used in tests and generates low-influence random values based on the block hashes from the previous `81` blocks. This pallet is not intended for use in production.
| [`pallet_recovery`](https://paritytech.github.io/substrate/master/pallet_recovery/index.html) | Provides a social recovery tool for users to gain access to their accounts if their private key or other authentication mechanism is lost. This pallet enables an account owner to identify trusted parties who can act on the owner's behalf to recover access to an account.
| [`pallet_scheduler`](https://paritytech.github.io/substrate/master/pallet_scheduler/index.html) | Exposes capabilities for scheduling dispatches to occur at a specified block number or at a specified period. These scheduled dispatches can be named or anonymous and can be canceled.
| [`pallet_scored_pool`](https://paritytech.github.io/substrate/master/pallet_scored_pool/index.html)| Maintains a scored membership pool where the highest scoring entities are made members.
| [`pallet_session`](https://paritytech.github.io/substrate/master/pallet_session/index.html) | Allows validators to manage their session keys, provides a function for changing the session length, and handles session rotation.
| [`pallet_society`](https://paritytech.github.io/substrate/master/pallet_society/index.html) | Provides economic incentives for users to participate and maintain a membership society.
| [`pallet_staking`](https://paritytech.github.io/substrate/master/pallet_staking/index.html) | Manages funds that have been staked by network maintainers.
| [`pallet_sudo`](https://paritytech.github.io/substrate/master/pallet_sudo/index.html) | Allows for a single account—called the sudo key—to execute dispatchable functions that require a `Root` origin or designate a new account to replace them as the sudo key.
| [`pallet_timestamp`](https://paritytech.github.io/substrate/master/pallet_timestamp/index.html) | Provides functionality to get and set the on-chain time.
| [`pallet_transaction_payment`](https://paritytech.github.io/substrate/master/pallet_transaction_payment/index.html) | Provides the basic logic to compute pre-dispatch transaction fees.
| [`pallet_treasury`](https://paritytech.github.io/substrate/master/pallet_treasury/index.html) | Provides a reserve of funds that can be managed by stakeholders in the system and a structure for making spending proposals from this reserve.
| [`pallet_utility`](https://paritytech.github.io/substrate/master/pallet_utility/index.html) | Provides a stateless helper module for managing dispatches.
| [`pallet_vesting`](https://paritytech.github.io/substrate/master/pallet_vesting/index.html) | Places a linear curve on an account's locked balance. This module ensures that there is a lock in place to prevent the balance to drop below the unvested amount for any reason other than transaction fee payment.

## Additional information

For detailed information about any pallet, refer to the [Rust-generated API](https://docs.substrate.io/rustdocs/) documentation or the source code for the individual pallet.