---
title: Networks and blockchains
description: Describes network types and deployment scenarios.
featured_image:
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
- **Relay chains** that provide decentralized security to other chains that connect to them.
  Kusama and Polkadot are examples of relay chains.
- **Parachains** that are built to connect to a relay chain and have the ability to connect to other chains.
  Parachains must implement the same consensus protocol as the relay chain they target.
  To connect to other Substrate blockchains in an ecosystem, however, all of the chains must implement a common communication channel.

Regardless of the type of chain you want to create, you should plan for deploying to a test network before deploying to a live production network.
For example, there are there are currently test networks like Kusama for deploying real-world economics in a canary network and test networks like Rococo for deploying a chain without issuing tokens or having any real-world economic impact.
Polkadot is a production relay chain.

<!--[ TODO: Diagrams / illustrations for each type of chain ]-->

## Local development

The nodes that participate in your blockchain define the boundaries of your network.
For example, if you are developing a runtime on a local computer, you must install the software required for a Substrate node on the local computer.
In most cases, you'll run that local node in development mode by specifying the `--dev` command-line option.
In development mode, the node creates a temporary directory to store state while the chain is running.
The state in the temporary directory is purged each time you stop the node.
Development mode is primarily for testing and experimentation.

## Validator nodes produce blocks

As new nodes join the network, you'll want to preserve state rather than purge it.
You'll also want the chain to progress by adding new blocks, so you'll want to allow additional nodes to author blocks.

As a node operator, you use command-line options to control the operation of the node and how it communicates with its peers.
For example, you use the `--chain` command-line option to specify the [chain specification](/main-docs/build/chain-specification/) your network should use and the `--validator` command-line option to specify that your node is authorized to author blocks and participate in consensus.

With information from the chain specification, the first node in the blockchain generates the genesis block.
To seals the first block, a validator node starts with the blockchain state from the genesis block. 
The node applies all pending changes to state, and emits the events that are the result of these changes.
The state of the chain from the first block is used in the same way by the validator node building the state of the chain at the second block, and so on.
After two thirds of the validators nodes agree that a specific block is valid, it is finalized.

## Querying and storing state

Depending on the command-line options you specify, nodes can play different roles in the progression of the chain and can provide different levels of access to the on-chain state.
For example, an **archive node** keeps all the past blocks.
An archive node makes it convenient to query the past state of the chain at any point in time. You can query an archive node to look up an account balance in a certain block or to see which transaction resulted in a certain state change.
There types of queries are fast operations when you use an archive node. 
However, an archive node requires a lot of disk space.

Archive nodes are used by utilities—such as block explorers and wallets—that need access to past on-chain information.
A **full node** discards all finalized blocks older than a configurable number except the genesis block
By default, a full node is pruned to only include the last 256 blocks. 
A node that is pruned this way requires much less space than an archive node.
Full nodes allow you to read the current state of the chain and to submit and validate extrinsics directly on the network without relying on a centralized infrastructure provider.
If you need to query historical blocks that have been pruned, you must purge the node then restart the node in archive mode.
It is possible to rebuild the state of the entire blockchain by using a full node and executing all the blocks from the genesis block.
However, a full node requires more computation to query state or retrieve information about some previous state.

In addition to archive nodes and full nodes, you can deploy a **light node**.
A light node has only the runtime and the current state.
It does not store any past blocks and so cannot read historical data without requesting it from a node that has it. 
Light nodes are useful for devices with limited resources. 

## Specify the node type

You can use the following command-line option to specify whether a node is an `archive` node or a pruned full node:

```bash
--pruning <PRUNING_MODE>
```

Specifies the maximum number of block states to keep or `archive` to keep all block states. 
If the node is running as a validator, the default is to keep all block states. 
If the node does not run as a validator, only state for the last 256 blocks is kept by default.

If the node is a full node, you can use the following command-line option to specify the number of finalized blocks to keep in the database:

```bash
--keep-blocks <COUNT>
```

You can use the following command-line option to run a node as a light node:

```bash
--light                            
```
