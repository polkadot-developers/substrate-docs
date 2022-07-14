---
title: Networks and blockchains
description: Describes network types and deployment scenarios.
keywords:
---

When thinking about building a blockchain, it's useful to consider that boundaries are what define a network.
For example, a set of computers connected to a single router can be considered a home network.
A firewall might be the boundary that defines an enterprise network.
Smaller, isolated networks can be connected to wider area networks through a common communication protocol.
Similarly, you can think of a blockchain network as being defined by its boundaries and its isolation from or communication with other blockchains.

As a blockchain builder's toolkit, Substrate enables you to develop any type of blockchain you can imagine and to define its boundaries based on your application-specific requirements. With this flexibility in mind, one of the decisions you need to make is the type of network you want to build and the role that different nodes might play in that network.

## Network types

Substrate-based blockchains can be used in different types of network architecture.
For example, Substrate blockchains are used to build the following network types:

- **Private networks** that limit access to a restricted set of nodes.
- **Solo chains** that implement their own security protocol and don't connect or communicate with any other chains.
  Bitcoin and Ethereum are examples of non-Substrate based solo chains.
- **Relay chains** that provide decentralized security and communication for other chains that connect to them.
  Kusama and Polkadot are examples of relay chains.
- **Parachains** that are built to connect to a relay chain and have the ability to communicate with other chains that use the same relay chain.
  Because parachains depend on the relay chain to finalize the blocks produced, parachains must implement the same consensus protocol as the relay chain they target.

## Node types

Blockchains require network nodes to be synchronised to present a consistent and up-to-date view of the blockchain state.
Each synchronised node stores a copy of the blockchain and keeps track of incoming transactions.
However, keeping a full copy of an entire blockchain requires a lot of storage and computing resources and downloading all of the blocks from genesis to the most recent isn’t practical for most use cases.
To make it easier to maintain the security and integrity of the chain but reduce the resource requirements for clients wanting access to blockchain data, there are different types of nodes that can interact with the chain:

- [Full nodes](#full-nodes)
- [Archive nodes](#archive-nodes)
- [Light client nodes](#light-client-nodes)

### Full nodes

Full nodes are a critical part of the blockchain network infrastructure and are the most common node type.
Full nodes store blockchain data and, typically, participate in many common blockchain operations, such as authoring and validating blocks, receiving and verifying transactions, and serving data is response to user requests.

![Full node](/media/images/docs/main-docs/full-node.png)

By default, full nodes are configured to store only the most recent 256 blocks and to discard state older than that—with the exception of the genesis block—to prevent the full node from growing indefinitely and consuming all available disk space.
You can configure the number of blocks a full node retains.

Although older blocks are discarded, full nodes retain all of the [block headers](/reference/glossary/#header) from the genesis block to the most recent block to validate the state is correct.
Because the full node has access to all of the block headers, it can rebuild the state of the entire blockchain by executing all of the blocks from the genesis block.
Thus it requires much more computation to retrieve information about some previous state, and an archive should generally be used instead.

### Archive nodes

Archive nodes are similar to full nodes except that they store all past blocks with complete state available for every block.
Archive nodes are most often used by utilities—such as block explorers, wallets, and similar applications—that need access to historical information.

![Archive nodes](/media/images/docs/main-docs/archive-node.png)

Because archive nodes retain historical state, they require a lot of disk space.
Because of the disk space required to run them, archive nodes are less common than full nodes.
However, archive nodes make it convenient to query the past state of the chain at any point in time.
For example, you can query an archive node to look up an account balance in a certain block or to see details about a transaction resulted in a specific state change.
These types of queries are faster and more efficient when you run them on the data in an archive node.



Depending on the command-line options you specify, nodes can play different roles in the progression of the chain and can provide different levels of access to the on-chain state.



A **full node** discards all finalized blocks older than a configurable number except the genesis block
By default, a full node is pruned to only include the last 256 blocks.
A node that is pruned this way requires much less space than an archive node.
Full nodes allow you to read the current state of the chain and to submit and validate extrinsics directly on the network without relying on a centralized infrastructure provider.
If you need to query historical blocks that have been pruned, you must purge the node then restart the node in archive mode.
It is possible to rebuild the state of the entire blockchain by using a full node and executing all the blocks from the genesis block.
However, a full node requires more computation to query state or retrieve information about some previous state.

### Light client nodes

A light client node is a leaner node that provides a robust subset of features for network participants.

![Light client nodes](/media/images/docs/main-docs/light-node.png)

Light client nodes connect to a Substrate network with minimal hardware requirements in a fast, trustless, way.
As such, these are commonly embedded into websites, browser extensions, mobile device apps, and even IoT devices.
Light client nodes expose the same RPC endpoints written in Rust, JavaScript, or other languages to read block headers, submit transactions, and view the results of transactions.

Light client nodes do not have participate in progressing network consensus though, as we will discuss next.

In addition to archive nodes and full nodes, you can deploy a **light node**.
A light node has only the runtime and the current state.
It does not store any past blocks and so cannot read historical data without requesting it from a node that has it.
Light nodes are useful for devices with limited resources.

## Node roles

Substrate nodes can be instructed to play different roles in the progression of the chain and can provide different levels of access to the on-chain state.

- Authority (block author)
- Normal peer
- ... others?

All gossip with all other peers about:
- new blocks
- new transactions to be included in blocks
- ...others?
