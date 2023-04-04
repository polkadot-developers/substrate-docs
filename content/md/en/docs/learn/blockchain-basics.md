---
title: Blockchain basics
description: Introduces common blockchain concepts, components, and terminology.
keywords:
  - blockchain
  - block
  - consensus
  - state machine
  - limitations
---

A blockchain is a decentralized ledger that records information in a sequence of blocks.
The information contained in a block is an ordered set of instructions that might result in a change in state.

In a blockchain network, individual computers—called nodes—communicate with each other to form a decentralized peer-to-peer (P2P) network.
There is no central authority that controls the network and, typically, each node that participates in block production stores a copy of the blocks that make up the canonical chain.

In most cases, users interact with a blockchain by submitting a request that might result in a change in state, for example, a request to change the owner of a file or to transfer funds from one account to another.
These transactions requests are gossiped to other nodes on the network and assembled into a block by a block author.
To ensure the security of the data on the chain and the ongoing progress of the chain, the nodes use some form of consensus to agree on the state of the data in each block and on the order of transactions executed.

## What is a blockchain node?

At a high level, all blockchain nodes require the following core components:

- Data storage for the state changes recorded as a result of transactions.
- Peer-to-peer networking for decentralized communication between nodes.
- Consensus methodology to protect against malicious activity and ensure the ongoing progress of the chain.
- Logic for ordering and processing incoming transactions.
- Cryptography for generating hash digests for blocks and for signing and verifying the signatures associated with transactions.

Because of the complexity involved in building the core components a blockchain requires, most blockchain projects start with a complete copy of an existing blockchain code base so that developers can modify existing code to add new features instead of writing everything from scratch.
For example, the Bitcoin repository was forked to create Litecoin, ZCash, Namecoin and Bitcoin Cash.
Similarly, the Ethereum repository was forked to create Quorum, POA Network, KodakCoin, and Musicoin.

However, most blockchain platforms are not designed to allow for modification or customization.
As a result, building a new blockchain by forking has serious limitations, including limitations such as scalability that are inherent in the originating blockchain code.
Before you explore how Substrate alleviates many of the limitations associated with other blockchain projects, it's important to understand some of the common properties that most blockchains share.
By learning about how most blockchains operate, you'll be better prepared to see how Substrate provides alternatives and capabilities for building a blockchain best suited to your needs.

## State transitions and conflicts

A blockchain is essentially a [state machine](https://en.wikipedia.org/wiki/Finite-state_machine).
At any point in time, the blockchain has a current internal state.
As inbound transactions are executed, they result in changes to state so the blockchain must transition from its current state to a new state.
However, there can be multiple valid transitions that would result in different future states, and the blockchain must select a single state transition that can be agreed upon.
To agree on the state after a transition, all operations within a blockchain must be deterministic.
For the chain to progress successfully, a majority of the nodes must agree on all of the state transitions, including:

- The initial state of the chain, called the genesis state or genesis block.
- The series of state transitions that result from executed transactions that are recorded in each block.
- A final state for the block to be included in the chain.

In centralized networks, a central authority can choose between mutually exclusive state transitions.
For example, a server configured as the primary authority might record changes to state transition in the order it sees them or use a weighting process to choose between competing alternatives when a conflict arises.
In a decentralized network, the nodes see transactions in different orders, so they must use a more elaborate method to select transactions and choose between conflicting state transition.

The method that a blockchain uses to batch transactions into blocks and to select which node can submit a block to the chain is called the blockchain's consensus model or consensus algorithm.
The most commonly-used consensus model is called the proof-of-work consensus model.
With the proof-of-work consensus model, the node that completes a computational problem first has the right to submit a block to the chain.

For a blockchain to be fault tolerant and provide a consistent view of state even if some nodes are compromised by malicious actors or network outages, some consensus models require at least two-thirds of the nodes to agree on state at all time.
This two-thirds majority ensures that the network is fault tolerant and can withstand some network participants behaving badly, regardless of whether the behavior is intentional or accidental.

## Blockchain economics

All blockchains require resources—processors, memory, storage, and network bandwidth—to perform operations.
The computers that participate in the network—the nodes that produce blocks—provide these resources to blockchain users.
The nodes create a distributed, decentralized network that serves the needs of a community of participants.

To support a community and make a blockchain sustainable, most blockchains require users to pay for the network resources they use in the form of transaction fees.
The payment of transaction fees requires user identities to be associated with accounts that hold assets of some type.
Blockchains typically use tokens to represent the value of assets in an account and network participants purchase tokens outside of the chain through an exchange.
Network participants can then deposit the tokens to enable them to pay for transactions.

## Blockchain governance

Some blockchains allow network participants to submit and vote on proposals that affect network operations or the blockchain community.
By submitting and voting on proposals—referenda—the blockchain community can determine how the blockchain evolves in an essentially democratic process.
On-chain governance is relatively rare, however, and to participate, a blockchain might require users to maintain a significant stake of tokens in an account or to be selected as a representative for other users.

## Applications running on a blockchain

Applications that run on a blockchain—often referred to as decentralized applications or dApps—are typically web applications that are written using front-end frameworks but with backend **smart contracts** for changing the blockchain state.

A smart contract is a program that runs on a blockchain and executes transactions on behalf of users under specific conditions.
Developers can write smart contracts to ensure that the outcome of programmatically-executed transactions is recorded and can't be tampered with.
Yet, with smart contracts alone, developers don't have access to some underlying blockchain functionality—such as the consensus, storage, or transaction layers—and instead, abide by a chain's fixed rules and restrictions.
Smart contract developers often accept these limitations as a tradeoff that enables faster development time with fewer core design decisions to make.

## Where to go next

All blockchains share some common characteristics.
Substrate—while not a blockchain itself—is a blockchain builders' toolkit with a modular framework of components to create a custom blockchain.
With Substrate, you can take the common blockchain components—like storage and consensus and cryptography—and combine them to use the functions they provide as-is or modify them to suit the purpose of your project.

You can explore the following resources to learn more.

#### Tell me

- [Learn](/learn/)
- [Welcome to Substrate](/learn/welcome-to-substrate/)
- [Architecture and Rust libraries](/learn/architecture/)
- [Networks and blockchains](/learn/node-and-network-types/)

#### Guide me

- [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/)
- [Simulate a network](/tutorials/build-a-blockchain/simulate-network/)
- [Add trusted nodes](/tutorials/build-a-blockchain/add-trusted-nodes/)

If you prefer to explore code directly, you can start building in the [Substrate Playground](https://docs.substrate.io/playground/) or consult the API reference to get details about the Rust crates you use.
