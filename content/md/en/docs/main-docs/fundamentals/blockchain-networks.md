---
title: Blockchain Networks
description: Describes network types and deployment scenarios.
featured_image:
---

When thinking about building a blockchain, it's useful to consider that boundaries are what define a network.
For example, a set of computers connected to a single router can be considered a home network.
A firewall might be the boundary that defines an enterprise network.
Smaller, isolated networks can be connected to wider area networks through a common communication protocol.
Similarly, you can think of a blockchain network as being defined by its boundaries and its' isolation from or communication with other blockchains.

As a blockchain builder's toolkit, Substrate enables you to develop any type of blockchain you can imagine and to define its boundaries based on your application-specific requirements. With this flexibility in mind, one of the decisions you need to make is the type of network you want to build and the role that different nodes might play in that network.

## Network types

Substrate-based blockchains can be used in different types of network architecture.
For example, Substrate blockchains are used to build the following network types:

- **Private networks** that limit peers to a restricted set of nodes.
  These may or may not be accessible to the public to interact with.
- **Solo chains** that implement their own security protocol and don't connect or communicate with any other chains.
  Bitcoin and Ethereum are example of (non-Substrate based) solo chains.
- **Relay chains** that provide shared security and communication for other chains that couple with them.
  Kusama and Polkadot are examples of relay chains.
- **Parachains** that are built to couple to a relay chain and have the ability to securely communicate to other parachains on the same relay chain.
  Parachains depend on the relay chain to achive [finality](/reference/glossary/#finality) for state transitions.


<!--[ TODO: Diagrams / illustrations for each type of chain ]-->

## Node types

In blockchain networks, there are a few canonical types of nodes that 

- [**Archive nodes**](#archive-nodes): A node with complete blockchain state from genesis, un-pruned. 
- [**Full nodes**](#full-nodes): A node with (verified from genesis) recent state.
- [**Light client nodes**](#light-client-nodes): A node with incomplete (but verifiably correct) state, that relies on other nodes for data it is missing.

These nodes are best suited to different use cases fulfil specific [node roles](#node-roles) and fit different use cases.

<!--[ TODO: Diagrams / illustrations for each type of node, in a network {Dan S has ideas} ]-->


### Archive nodes

An **archive node** keeps all the past blocks in local storage, with complete state available for every block.
Archive node requires a lot of disk space, and thus are typically less common on the network.
They are simply [full nodes](#full-nodes) that enable query the past state of the chain at any point in time.
There types of queries are fast operations when you use an archive node.

Archive nodes are used by utilities—such as block indexing engines used in block explorers, wallets, and various dApps that need access to past on-chain information.

### Full nodes

A **full node** discards the state of older than a configurable number of blocks, except the genesis block.
Full nodes are the most common node type on the network and can fill any node role.
Full nodes allow you to read the recent state of the chain and to submit transactions to the network.
A pruned full node requires much less disk space than an archive node.

By default, a full node is pruned to only store the last 256 blocks from the behind the latest finalized block.
It still retains the [block headers](/reference/glossary/#header) to validate it's state is correct, from genesis.
It is possible to rebuild the state of the entire blockchain by using a full node and executing all the blocks from the genesis block.
Thus it requires much more computation to retrieve information about some previous state, and an archive should generally be used instead.

## Light client nodes

A light client node is a leaner node that provides a robust subset of features for network participants.
Light client nodes connect to a Substrate network with minimal hardware requirements in a fast, trustless, way.
As such, these are commonly embedded into websites, browser extensions, mobile device apps, and even IoT devices.
Light client nodes exposes the same RPC endpoints written in Rust, JavaScript, or other languages to read block headers, submit transactions, and view the results of transactions.

Light client nodes do not have  participate in progressing network consensus though, as we will discuss next.

## Node roles

Substrate nodes can be instructed to play different roles in the progression of the chain and can provide different levels of access to the on-chain state.

- Authority (block author)
- Normal peer
- ... others?

All gossip with all other peers about:
- new blocks
- new transactions to be included in blocks
- ...others?