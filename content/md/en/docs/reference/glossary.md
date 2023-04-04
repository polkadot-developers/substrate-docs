---
title: Glossary
description: Defines and explains concepts and terminology that are specific to blockchain technology or to the Substrate ecosystem.
keywords:
---

This glossary defines and explains concepts and terminology that are specific to blockchain technology or the Substrate ecosystem.

## adaptive quorum biasing (AQB)

Provides a mechanism for adjusting the passing threshold for a referendum based on voter turnout.
Adaptive quorum biasing allows for more flexible governance by removing the requirement to have an arbitrary quorum for voting purposes, which create undesirable governance mechanics.
Adaptive quorum biasing is implemented in the [Democracy pallet](/reference/frame-pallets#democracy).
The Democracy pallet provides the interfaces for on-chain bodies such as a [collective](#council) or individual token holder—to call referenda with positive,
negative, or neutral biases.

With a **positive turnout bias**, the passing threshold _decreases_ as more votes are cast, so that a higher turnout increases the likelihood of a referendum passing.
With a **negative turnout bias**, the passing threshold _increases_ as more votes are cast.
Negative turnout bias is also sometimes called a "default carries" position because if there's an apathetic voting body, the referendum passes by default.
A **neutral turnout bias** specifies a simple majority passing threshold.

## aggregation

Used in the context of [FRAME](#frame), _aggregation_ or _[pallet](#pallet) aggregation_ is the process of combining analogous types from multiple runtime modules into a single type.
Pallet aggregation allows each module's analogous types to be represented.
The call containing the aggregated types is sometimes referred to as an _outer call_ or a call to an _outer object_.
Currently, there are six data types that can be aggregated:

- `Call` for published functions that can be called with a set of arguments.
- `Error` for messages that indicate why a function invocation (`Call`) failed.
- `Event` for pallet-emitted events that describe state changes.
- `Log` for extensible header items.
- `Metadata` for information that allows inspection of the above.
- `Origin` for the source of a function invocation (`Call`).

## approval voting

Voting system where voters can vote for as many candidates as desired.
The candidate with the highest overall number of votes wins.
With approval voting, it is worth noting the following:

- Voting for all candidates is the same as voting for none.
- It is possible to vote against a single candidate by voting for all other candidates.

Approval voting is used by the [FRAME Elections Phragmen pallet](/reference/frame-pallets#elections-phragmen) as a governing [Council](#council) on a number of Substrate-based chains.

## author

Describes the [node](#node) that is responsible for the creation of a [block](#block).
Block authors are also referred to as _block producers_.
In a proof-of-work blockchain, these nodes are called _miners_.

## authority

The [nodes](#node) that act as a collective to manage [consensus](#consensus) on a [blockchain](#blockchain) network.
In a [proof-of-stake](#nominated-proof-of-stake-npos) blockchain—for example, a blockchain that uses the [Staking pallet](/reference/frame-pallets#staking) from [FRAME](#frame)—authorities are determined through a token-weighted nomination and voting system.

The terms _authorities_ and _[validators](#validator)_ sometimes seem to refer the same thing.
However, _validators_ is a broader term that can include other aspects of chain maintenance such as parachain validation.
In general, authorities are a (non-strict) subset of validators and many validators are authorities.

## authority round (Aura)

Deterministic [consensus](#consensus) protocol where [block](#block) production is limited to a rotating list of [authorities](#authority) that take turns creating blocks.
With authority round (Aura) consensus, the majority of online authorities are assumed to be honest.

Learn more by reading [the official wiki article](https://openethereum.github.io/Aura) for the Aura consensus algorithm.

The Aura protocol is often used in combination with GRANDPA as a [hybrid consensus](#hybrid-consensus) protocol where [Aura](#aura) is used for block production and short-term [probabilistic finality](#probabilistic-finality), with [deterministic finality](#deterministic-finality) provided by [GRANDPA](#grandpa).

## blind assignment of blockchain extension (BABE)

A [block authoring](#author) protocol similar to [Aura](#aura).
However, with the blind assignment of blockchain extension (BABE) protocol, [authorities](#authority) win [slots](#slot) based on a verifiable random function (VRF) as opposed to the round-robin selection method.
The winning authority can select a chain and submit a new block for it.

Learn more about BABE by referring to its [official Web3 Foundation research document](https://research.web3.foundation/en/latest/polkadot/block-production/Babe.html).

## block

A block is a single element of a blockchain that contains an ordered set of instructions—often in the form of transactions—that might result in a state change.

Each block is identified by a [cryptographic digest](#cryptographic-primitives)—a hash—and includes a pointer back to the hash of its parent block.
Every block has a [header](#header) and a body that contains the executed instructions that made it into the block within certain parameters.
Blocks are most often visualized as a vertical stack with each block referencing its parent block until there are conflicts that must be resolved using a [fork-choice rule](/learn/consensus#fork-choice-rules) and an optional [finality](#finality) mechanism.

## block height

Because blocks are often visualized as a vertical stack, block height is used to describe the distance a specific block is away from the first block.
The block height for any particular block in a blockchain indicates how many blocks preceded that block.

Similarly, the terms _top_ or _tip_ are used to describe the most recently-added block in a chain.

## block number

Similar to block height, a block number is used to describe the distance a specific block is away from the first block.
The block number for any particular block in a blockchain indicates how many blocks preceded that block.

## blockchain

Describes a distributed network of computers that uses [cryptography](#cryptographic-primitives) to allow a group of participants to trustlessly come to [consensus](#consensus) on the [state](#state) of a system as it evolves over time.
The computers that compose the blockchain network are called [nodes](#node).

## byzantine fault tolerance (BFT)

Defines the ability of a distributed computer network to remain operational if a certain proportion of its [nodes](#node) or [authorities](#authority) are defective or behaving maliciously.
Typically, a distributed network is considered byzantine fault tolerant if it can remain functional with up to one-third of nodes assumed to defective, offline, actively malicious, and acting as part of a coordinated attack.

### byzantine failure

The loss of a network service due to node failures that exceed the proportion of nodes required to reach consensus.

### practical byzantine fault tolerance (pBFT)

An early approach to byzantine fault tolerance. pBFT systems tolerate byzantine behavior from up to one-third of participants.
The communication overhead for such systems is `O(n²)`, where `n` is the number of nodes (participants) in the system.

## call

In a general context, a call describes the act of invoking a function to be executed.
In the context of pallets that contain functions to be dispatched to the runtime, `Call` is an enumeration data type that describes the functions that can be dispatched with one variant per pallet. The object that a `Call` represents is a [dispatch](#dispatch) data structure or a dispatchable.

## collator

An [author](#author) of a [parachain](#parachain) network.
They are not [authorities](#authority) in themselves, as they require a [relay chain](#relay-chain) to coordinate [consensus](#consensus).
More details are found on the [Polkadot Wiki on collators](https://wiki.polkadot.network/docs/learn-collator).

## consensus

In the context of a [blockchain](#blockchain), consensus is the process nodes use to agree on the canonical [fork](#fork) of a chain.
Consensus is comprised of [authorship](#author), [finality](#finality), and [fork-choice rule](/learn/consensus#fork-choice-rules).

In the Substrate ecosystem, these three components are separated from one another, and the term consensus often refers specifically to authorship.
In the context of a Substrate [node](#node), the term **consensus engine** describes the node subsystem that is responsible for consensus tasks.

See also [hybrid consensus](#hybrid-consensus).

## consensus algorithm

An algorithm that ensures that a set of [actors](#authority)—who don't necessarily trust each other—can reach agreement about state as the result of some computation.
Most consensus algorithms assume that up to one-third of the actors or nodes can be [byzantine fault tolerant](#byzantine-fault-tolerance-bft).

Consensus algorithms are generately concerned with ensuring two properties:

- **safety** indicating that all honest nodes eventually agreed on the state of the chain.
- **liveness** indicating the ability for the chain to keep making progress.

For detailed information about the consensus strategies of the [Polkadot network](#polkadot-network), see the [Polkadot Consensus](https://polkadot.network/polkadot-consensus-part-1-introduction/) blog series.

See also [hybrid consensus](#hybrid-consensus).

## cryptographic primitives

A general term used to describe fundamental cryptographic concepts such as signature schemes and hashing algorithms.
Cryptographic primitives are essential to many aspects of the Substrate ecosystem. For example:

- Hashing algorithms produce [blocks](#block) of hashed data and each block uses the hash generated by the hashing algorithm to reference its parent block.
- Hashing is used to encode [state](#state) as a [trie](#trie-patricia-merkle-tree) data structure to facilitate efficient verification.
- Digital signature schemes are used to secure different [consensus](#consensus) models such as [authorities](#authority).
- Cryptographic schemes identify and authenticate the [accounts](/learn/accounts-addresses-keys/) used to perform [transactions](#transaction) in the Substrate runtime.

## council

Most often used to refer to an instance of the [Collective pallet](/reference/frame-pallets#collective) on Substrate-based networks such as [Kusama](#kusama) or [Polkadot](#polkadot) if the Collective pallet is part of the [FRAME](#frame)-based [runtime](#runtime) for the network.
A council primarily serves to optimize and balance the more inclusive referendum system.

## database backend

The means by which the [state](#state) of a [blockchain](#blockchain) network is persisted between invocations of the [blockchain node](#node) application.
For information about how the database backend is implemented and used by Substrate-based chains, see [Runtime storage](/build/runtime-storage).

## dev phrase

A [mnemonic phrase](https://en.wikipedia.org/wiki/Mnemonic#For_numerical_sequences_and_mathematical_operations) that is intentionally made public.
All of the well-known development accounts—Alice, Bob, Charlie, Dave, Eve, and Ferdie—are generated from the same secret phrase.
The secret phrase is:
`bottom drive obey lake curtain smoke basket hold race lonely fit walk`

Many tools in the Substrate ecosystem, such as [`subkey`](/reference/command-line-tools/subkey), allow you to implicitly specify an account using a derivation path such as `//Alice`.

## digest

An extensible field of the [block header](#header) that encodes information needed by several actors in a blockchain network including:

- [Light clients](#light-client) for chain synchronization.
- Consensus engines for block verification.
- The runtime itself in the case of pre-runtime digests.

## dispatch

The execution of a function with a predefined set of arguments.
In the context of [runtime](#runtime) development with [FRAME](#frame), a dispatch takes pure data—the [`Call`](#call) type—and uses that data to execute a published function in a runtime module ([pallet](#pallet)) with predefined arguments.
The published functions take one additional parameter, known as [`origin`](#origin), that allows the function to securely determine the provenance of its execution.

## equivocating

A type of erroneous or malicious behavior that involves backing multiple mutually-exclusive options within the [consensus](#consensus) mechanism.

## ethash

A function used by some [proof-of-work](#proof-of-work) [consensus](#consensus) systems, such as the Ethereum blockchain.
It was developed by [a team led by Tim Hughes](https://github.com/ethereum/ethash/graphs/contributors).

## events

A means of recording, for the benefit of the offchain world, that some particular [state](#state) transition happened.
In the context of [FRAME](#frame), events are a composable data types that each [pallet](#pallet) can individually define.
Events in FRAME are implemented as a set of transient storage items that are inspected immediately after a block has executed and reset during block-initialization.

## executor

A means of executing a function call in a given [runtime](#runtime) with a set of dependencies.
There are two orchestration engines in Substrate, _WebAssembly_ and _native_.

- The _native executor_ uses a natively compiled runtime embedded in the [node](#node) to execute calls.
  This is a performance optimization that up-to-date nodes can take advantage of.

- The _WebAssembly executor_ uses a [Wasm](#webassembly-wasm) binary and a Wasm interpreter to execute calls.
  The binary is guaranteed to be up-to-date regardless of the version of the blockchain [node](#node) because it is persisted in the [state](#state) of the Substrate-based chain.

## extrinsic

Data that is external to the blockchain and included in a [block](#block).
Typical Substrate chains have extrinsics which contain a [`Call`](#call) value.
In general, there are two types of extrinsics:

- signed or unsigned [transactions](#transaction).
- inherent data that is inserted by a [block author](#author).

## existential deposit

The minimum balance an account is allowed to have in the [Balances pallet](/reference/frame-pallets#balances).
Accounts cannot be created with a balance less than the existential deposit amount.
If an account balance drops below this amount, the Balances pallet uses [a FRAME System API](https://paritytech.github.io/substrate/master/frame_system/pallet/struct.Pallet.html#method.dec_ref) to drop its references to that account.
If all of the references to an account are dropped, the account can be [reaped](https://paritytech.github.io/substrate/master/frame_system/pallet/struct.Pallet.html#method.allow_death).

## finality

The part of [consensus](#consensus) that makes the ongoing progress of the blockchain irreversible.
After a [block](#block) is finalized, all of the [state](#state) changes it encapsulates are irreversible without a hard fork.
The consensus algorithm _must_ guarantee that finalized blocks never need reverting.
However, different consensus algorithms can define different finalization methods.

In a consensus protocol that uses **deterministic finality**, each block is guaranteed to be the canonical block for that chain when the block is included.
Deterministic finality is desirable in situations where the full chain is not available, such as in the case of [light clients](#light-client).
[GRANDPA](#grandpa) is the deterministic finality protocol that is used by the [Polkadot Network](#polkadot-network).

In a consensus protocol that uses **probabilistic finality**, finality is expressed in terms of a probability, denoted by `p`, that a proposed block, denoted by `B`, will remain in the canonical chain.
As more blocks are produced on top of `B`, `p` approaches 1.

In a consensus protocol that uses **instant finality**, finality is guaranteed immediately upon block production.
This type of non-probabilistic consensus tends to use [practical byzantine fault tolerance (pBFT)](#practical-byzantine-fault-tolerance-pbft) and have expensive communication requirements.

## fork

Indicates that there are divergent paths a blockchain might take.
If two or more [blocks](#block) have the same parent but different state, the blockchain cannot continue to progress until the differences are resolved.
An unresolved fork would split the blockchain into two separate chains.
By resolving divergent forks, you can ensure that only one canonical chain exists.

## Flaming Fir

A Substrate-based [blockchain](#blockchain) test network that exists for developing and testing the Substrate blockchain development framework.
For more information about accessing Substrate networks and flaming fir, see the [Polkadot wiki](https://wiki.polkadot.network/docs/maintain-networks#flaming-fir).

## FRAME

An acronym for the _Framework for Runtime Aggregation of Modularized Entities_ that enables developers to create blockchain [runtime](#runtime) environments from a modular set of components called [pallets](#pallet).

Runtime developers interact with FRAME using [macros](#macro) such as the following:

- `#[pallet::event]`
- `#[pallet::error]`
- `#[pallet::storage]`
- `#[frame_support::pallet]`

The macros make it easy to define custom pallets and compose pallets to create a working runtime using the [`construct_runtime!`](/reference/frame-macros#construct_runtime)
macro to deploy a Substrate-based blockchain.

The convention used in [the Substrate codebase](https://github.com/paritytech/substrate/tree/master/frame) is to preface core FRAME modules with `frame_` and the optional pallets with `pallet_*`.
For example, the preceding macros are all defined in the [`frame_support`](/reference/frame-pallets#support-library) module and all FRAME-based runtimes _must_ include the [`frame_system`](/reference/frame-pallets#system-library) module.
After the `frame_support::construct_runtime` macro has been used to create a runtime that includes the `frame_system` module, optional pallets such as the [Balances](/reference/frame-pallets#balances) pallet can be used to extend the core capabilities of the runtime.

## full node

A [node](#node) that is able to synchronize a blockchain in a secure manner through execution and verification of all logic.
Full nodes stand in contrast to [light clients](#light-client).

## genesis configuration

A mechanism for specifying the initial [state](#state) of a [blockchain](#blockchain).
By convention, this initial state or first block is commonly referred to as the genesis state or genesis block.
The genesis configuration for Substrate-based chains is accomplished by way of a [chain specification](/build/chain-spec/) file.
The chain specification file makes it easy to use a single Substrate codebase as the foundation for multiple independently-configured chains.

## GRANDPA

A [deterministic finality](#deterministic-finality) mechanism for [blockchains](#blockchain) that is implemented in the [Rust](https://www.rust-lang.org/) programming language.
The [formal specification](https://github.com/w3f/consensus/blob/master/pdf/grandpa-old.pdf) is
maintained by the [Web3 Foundation](https://web3.foundation/).

## header

The structure that aggregates the information used to summarize a [block](#block).
A header consists primarily of [cryptographic](#cryptographic-primitives) information that is used by [light clients](#light-client) to get a minimally-secure but very efficient
synchronization of the chain.

## hybrid consensus

A blockchain consensus protocol that consists of independent or loosely-coupled mechanisms for [block production](#author) and [finality](#finality).
Hybrid consensus allows the chain to grow as fast as probabilistic consensus protocols, such as [Aura](#aura-aka-authority-round), while maintaining the same level of security as [deterministic finality](#deterministic-finality) consensus protocols, such as [GRANDPA](#grandpa).
In general, block production algorithms tend to be faster than finality mechanisms.
Making block production separate from block finalization gives Substrate developers greater control of their chain's performance.

## inherent transactions

Inherent transactions—sometimes referred to as inherents—are a special type of unsigned transaction.
This type of transaction enables a block authoring node to insert information that doesn't require validation directly to a block.
Only the block authoring node that calls the inherent transaction function can insert data into its block.
In general, validators assume the data inserted using an inherent transaction is valid and reasonable even if it can't be deterministically verified.

## JSON-RPC

A stateless, lightweight remote procedure call protocol that is encoded in JSON. JSON-RPC provides a standard way to call functions on a remote system by using JavaScript Object Notation.
For Substrate, this protocol is implemented thrinough the [Parity JSON-RPC](https://github.com/paritytech/jsonrpc) crate.

## keystore

A subsystem in Substrate for managing keys for the purpose of producing new blocks.

## Kusama

[Kusama](https://kusama.network/) is a Substrate-based [blockchain](#blockchain) that implements a design similar to the [Polkadot network](#polkadot-network).
Kusama is a [canary](https://en.wiktionary.org/wiki/canary_in_a_coal_mine) network and is referred to as [Polkadot's "wild cousin"](https://polkadot.network/kusama-polkadot-comparing-the-cousins/).
As a canary network, Kusama is expected to be more stable than a test network like [Westend](#westend), but not as stable as a production network like [Polkadot](#polkadot).

As a canary network, Kusama is [controlled by its network participants](/reference/frame-pallets#democracy) and is intended to be stable enough to encourage meaningful experimentation.

## libp2p

A peer-to-peer networking stack that allows use of many transport mechanisms, including WebSockets (usable in a web browser).
Substrate uses the [Rust implementation](https://github.com/libp2p/rust-libp2p) of the `libp2p` networking stack.

## light client

A type of blockchain [node](#node) that does not store the [chain state](#state) or produce blocks.
A light client is capable of verifying [cryptographic primitives](#cryptographic-primitives) and exposes a [remote procedure call (RPC)](https://en.wikipedia.org/wiki/Remote_procedure_call) server that allows blockchain users to interact with the blockchain network.

## macro

A programming language feature that enables developers to write a sequence of instructions that can be named and executed together.
The [FRAME](#frame) development environment provides several [macros](/reference/frame-macros) for [Rust](https://doc.rust-lang.org/1.7.0/book/macros.html) that you can use to compose a [runtime](#runtime).

## metadata

Data that provides information about one or more aspects of a system.
The metadata that exposes information about a Substrate [blockchain](#blockchain) enables you to interact with that system.

## node

A running instance of a blockchain client.
Each node is part of the [peer-to-peer](https://en.wikipedia.org/wiki/Peer-to-peer) network that allows blockchain participants to interact with one another.
Substrate nodes can fill a number of roles in a blockchain network.
For example, the nodes that produce blocks fulfill the [validator](#validator) role for the blockchain.
Nodes that run [light-clients](#light-client) facilitate scalable interactions in resource-constrained environments like [user interfaces](https://github.com/paritytech/substrate-connect) or embedded devices.

## nominated proof-of-stake (NPoS)

A method for determining [validators](#validator) or _[authorities](#authority)_ based on a willingness to commit their stake to the proper functioning of one or more block producing nodes.

## oracle

In a blockchain network, an oracle is a mechanism for connecting the blockchain to a non-blockchain data source.
Oracles enable the blockchain to access and act upon information from existing data sources and incorporate data from non-blockchain systems and services.

## origin

A [FRAME](#frame) primitive that identifies the source of a [dispatched](#dispatch) function call into the [runtime](#runtime).
The FRAME `system` module defines three built-in [origins](/build/origins#raw-origins).
As a [pallet](#pallet) developer, you can also define custom origins, such as those defined by the [Collective pallet](https://paritytech.github.io/substrate/master/pallet_collective/enum.RawOrigin.html).

## pallet

A module that can be used to extend the capabilities of a [FRAME](#frame)-based [runtime](#runtime).
Pallets bundle domain-specific logic with runtime primitives like [events](#event),
and [storage items](#storage-items).

## parachain

A parachain is a [blockchain](#blockchain) that derives shared infrastructure and security from a _[relay chain](#relay-chain)_.
You can learn more about parachains on the [Polkadot Wiki](https://wiki.polkadot.network/docs/en/learn-parachains).

## Polkadot network

The [Polkadot network](https://polkadot.network/) is a [blockchain](#blockchain) that serves as the central hub of a heterogeneous blockchain network.
It serves the role of the [relay chain](#relay-chain) and supports other chains—the [parachains](#parachain)—by providing shared infrastructure and security.

## proof-of-finality

Data that can be used to prove that a particular block is finalized.

## proof-of-work

A [consensus](#consensus) mechanism that deters attacks by requiring work on the part of network participants.
For example, some proof-of-work systems require participants to use the [Ethash](#ethash) function to calculate a hash as a proof of completed work.

## relay chain

The central hub in a heterogenous network of multiple blockchains.
Relay chains are [blockchains](#blockchain) that provide shared infrastructure and security to the other blockchains—the [parachains](#parachain)—in the network.
In addition to providing [consensus](#consensus) capabilities, relay chains also allow parachains to communicate and exchange digital assets without needing to trust one another.

## remote procedure call (RPC)

A mechanism for interacting with a computer program.
Remote procedure calls enable developers to query the remote computer programs or invoke program logic with parameters they supply.
Substrate nodes expose an RPC server on HTTP and WebSocket endpoints.

## rhododendron

An [instant finality](#instant-finality), [byzantine fault tolerant (BFT)](#byzantine-fault-tolerance-bft) [consensus](#consensus) algorithm.
One of a number of adaptions of [pBFT](#practical-byzantine-fault-tolerance-pbft) for blockchains.
Refer to its [implementation on GitHub](https://github.com/paritytech/rhododendron).

## rococo

A [parachain](#parachain) test network for the Polkadot network.
The Rococco network is a Substrate-based [blockchain](#blockchain) that is an evolving testbed for the capabilities of heterogeneous blockchain networks.

## runtime

The block execution logic of a blockchain.
The runtime provides the [state transition function](#state-transition-function-stf) for a node.
In Substrate, the runtime is stored as a [WebAssembly](#webassembly-wasm) binary in the [chain state](#state).

## slot

A fixed, equal interval of time used by consensus engines such as [Aura](#aura-aka-authority-round) and [BABE](#blind-assignment-of-blockchain-extension-babe).
In each slot, a subset of [authorities](#authority) is permitted—or obliged—to [author](#author) a [block](#block).

## sovereign account

The unique account identifier for each chain in the relay chain ecosystem.
The sovereign account for each chain is a root-level that can only be accessed using the Sudo pallet or through governance. 
The account identifier is calculated by concatenating the Blake2 hash of a specific text string and the registered parachain identifier.

For the relay chain, the parachain account identifier is calculated as the concatenation of (blake2(para+ParachainID) with the hash truncated to the correct length.
For example, the account identifier for the parachain with the parachain identifier of 1012 on the relay chain is:
String to hex para: 0x70617261
Encoded parachain identifier 1012: f4030000

0x70617261f4030000000000000000000000000000000000000000000000000000
ccount address: 5Ec4AhPc9b6e965pNRSsn8tjTzuKaKambivxcL7Gz9Gne9YB

For other parachains, the parachain account identifier is calculated as the concatenation of (blake2(sibl+ParachainID) with the hash truncated to the correct length. 
For example, the account identifier for the parachain with the parachain identifier of 1012 on the relay chain is:
String to hex sibl: 0x7369626c
Encoded parachain identifier 1012: f4030000

0x7369626cf4030000000000000000000000000000000000000000000000000000
Account address: 5Eg2fntREKHYGgoxvRPxtnEYiUadHjdsfNaPsHdmrsJMVugs

The sovereign account is most often used to sign XCM messages that are sent to either the relay chain or other chains in the ecosystem.

## SS58 address format

The SS58 address format is a public key address based on the Bitcoin [`Base-58-check`](https://en.bitcoin.it/wiki/Base58Check_encoding) encoding.
Each Substrate SS58 address uses a `base-58` encoded value to identify a specific account on a specific Substrate-based chain.
These are represented by a `base-58` encoded value to identify a specific account on a specific Substrate chain.
The [canonical `ss58-registry`](https://github.com/paritytech/ss58-registry) provide additional details about the address format used by different Substrate-based chains, including the network prefix and website used for different networks. 

## stake-weighted voting

A democratic voting system that uses a one-vote-per-token method for tallying votes rather than a one-vote-per-head method.

## state

Cryptographically-secure data that persists between blocks and can be used to create new blocks as part of the state transition function.
In Substrate-based blockchains, state is stored in a [trie](#trie-patricia-merkle-tree) data structure that supports the efficient creation of incremental digests.
This trie is exposed to the [runtime](#runtime) as [a simple key/value map](/learn/state-transitions-and-storage) where both keys and values can be arbitrary byte arrays.

## state transition function (STF)

The logic of a [blockchain](#blockchain) that determines how the state changes when a [block](#block) is processed.
In Substrate, the state transition function is effectively equivalent to the [runtime](#runtime).

## storage item

[FRAME](#frame) primitives that provide type-safe data persistence capabilities to the [runtime](#runtime).
Learn more about storage items in this article about [runtime storage](/build/runtime-storage).

## Substrate

A flexible framework for building modular, efficient, and upgradeable [blockchains](#blockchain).
Substrate is written in the [Rust](https://www.rust-lang.org/) programming language and is
maintained by [Parity Technologies](https://www.parity.io/).

## transaction

A type of [extrinsic](#extrinsic) that includes a [signature](/learn/transaction-types) that can be used to verify the account authorizing it inherently or via [signed extensions](/reference/transaction-format#signed-extension).

## transaction era

A definable period—expressed as a range of [block](#block) numbers—during which a transaction can be included in a block.
Transaction eras are used to protect against transaction replay attacks in the event that an account is reaped and its replay-protecting nonce is reset to zero.

## transaction pool

A collection of transactions that are not yet included in [blocks](#block) but have been determined to be valid.

A _tagged transaction pool_ is a transaction pool implementation that allows the [runtime](#runtime) to specify whether a given transaction is valid, how it should be prioritized, and how it relates to other transactions in the pool in terms of dependency and mutual-exclusivity.
The tagged transaction pool implementation is designed to be extensible and general enough to express both [unspent transaction output (UTXO)](https://github.com/danforbes/danforbes/blob/master/writings/utxo.md) and account-based transaction models.

## trie (Patricia Merkle Tree)

A data structure that is used to represent sets of key-value pairs.

The Patricia Merkle trie data structure enables the items in the data set to be stored and retrieved using a cryptographic hash. Because incremental changes to the data set result in a new hash, retrieving data is efficient even if the data set is very large. With this data structure, you can also prove whether the data set includes any particular key-value pair without the access to the entire data set.

## validator

A semi-trusted—or untrusted but well-incentivized—actor that helps maintain a [blockchain](#blockchain) network.
In Substrate, validators broadly correspond to the [authorities](#authority) running the [consensus](#consensus) system.
In [Polkadot](#polkadot-network), validators also manage other duties such as guaranteeing data availability and validating [parachain](#parachain) candidate [blocks](#block).

## WebAssembly (Wasm)

An execution architecture that allows for the efficient, platform-neutral expression of
deterministic, machine-executable logic.
[WebAssembly](https://webassembly.org/) can be compiled from many languages, including
the [Rust](http://rust-lang.org/) programming language.
Substrate-based chains use a WebAssembly binary to provide portable [runtimes](#runtime) that can be included as part of the chain's [state](#state).

## weight

A convention used in Substrate-based blockchains to measure and manage the time it takes to validate a block.
Substrate defines one unit of weight as one picosecond of execution time on reference hardware.

The maximum block weight should be equivalent to one-third of the target block time with an allocation of:

- One third for block construction
- One third for network propagation
- One third for import and verification

By defining weights, you can make trade-off decisions between the number of transactions per second and the hardware required to maintain the target block time as appropriate for your use case.
Because weights are defined in the runtime, you can tune them using runtime updates to keep up with hardware and software improvements.

## Westend

Westend is a Parity-maintained, Substrate-based [blockchain](#blockchain) that serves as a test network for the [Polkadot network](#polkadot-network).
