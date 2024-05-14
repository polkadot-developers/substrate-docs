---
title: Networks and nodes
description: Describes the different network types and node roles for Substrate-based chains.
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
However, keeping a full copy of an entire blockchain requires a lot of storage and downloading all of the blocks from genesis to the most recent isn’t practical for most use cases.
To make it easier to maintain the security and integrity of the chain but reduce the resource requirements for clients wanting access to blockchain data, there are different types of nodes that can interact with the chain:

- [Full nodes](#full-nodes)
- [Archive nodes](#archive-nodes)
- [Light client nodes](#light-client-nodes)

### Full nodes

Full nodes are a critical part of the blockchain network infrastructure and are the most common node type.
Full nodes store blockchain data and, typically, participate in common blockchain operations, such as validating blocks, receiving and verifying transactions, and serving data in response to user requests.

![Full node](/media/images/docs/full-node.png)

By default, full nodes are configured to store all the blocks but only the most recent 256 states. They discard states older than that&nbsp;—&nbsp;with the exception of the genesis block&nbsp;—&nbsp;to prevent the full node from consuming too much disk space.
You can configure the number of blocks a full node retains (see `--{state,blocks}-pruning` options).

Although older states are discarded, full nodes retain all the blocks from genesis to the head, allowing to rebuild all the intermediate states.
It is achieved by taking the genesis state as initial state and executing all the blocks successively on top of if.
Retrieving information about some previous state thus requires an expensive computation which can be avoided by using an archive node, which does not discard the states.

Full nodes allow you to read the current state of the chain and to submit and validate transactions directly on the network.
By discarding state from older blocks, a full node requires much less disk space than an archive node.
However, a full node requires far more computational resources to query and retrieve information about some previous state.
If you need to query historical blocks, you should purge the full node then restart it as an archive node.

### Archive nodes

Archive nodes are similar to full nodes except that they do not discard old states. As a result, they have complete state for every block available without computation.
For this reason, archive nodes are often used by utilities&nbsp;—&nbsp;such as block explorers, wallets, discussion forums, and similar applications&nbsp;—&nbsp;that need access to historical information.

![Archive nodes](/media/images/docs/archive-node.png)

Because archive nodes retain historical state, they require a lot of disk space.
Because of the disk space required to run them, archive nodes are less common than full nodes.
However, archive nodes make it convenient to query the past state of the chain at any point in time.
For example, you can query an archive node to look up an account balance in a certain block or to see details about a transaction resulted in a specific state change.
These types of queries are faster and more efficient when you run them on the data in an archive node.

### Light client nodes

Light client nodes enable you to connect to a Substrate network with minimal hardware requirements.

![Light client nodes](/media/images/docs/light-node.png)

Because light client nodes require minimal system resources, they can be embedded into web-based applications, browser extensions, mobile device applications, or internet of things (IoT) devices.
Light client nodes provide a runtime and access to the current state through RPC endpoints.
The RPC endpoints for light client nodes can be written in Rust, JavaScript, or other languages and used to read block headers, submit transactions, and view the results of transactions.

Light client nodes don't participate in blockchain or network operations.
For example, light client nodes aren't responsible for block authoring or validation, gossipping transactions or reaching consensus.
The light client node doesn't store any past blocks, so it can't read historical data without requesting it from a node that has it.

## Node roles

Depending on the command-line options you specify when you start a node, nodes can play different roles in the progression of the chain and can provide different levels of access to the on-chain state.
For example, you can limit the nodes that are authorized to author new blocks and which nodes can communicate with peers.
Peer nodes that aren't authorized as block producers can import new blocks, receive transactions, and send and receive gossip about new transactions to other nodes.
Nodes can also be prevented from connecting to the broader network and restricted to communicating with specific nodes.

## Where to go next

You can use Substrate to build virtually any type of network—from a completely self-contained and private solo-chain to your own relay chain ecosystem or compatible parachains.

To take a deeper dive into networks and nodes types, explore the following topics.

- [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/)
- [Simulate a network](/tutorials/build-a-blockchain/simulate-network/)
- [Add trusted nodes](/tutorials/build-a-blockchain/add-trusted-nodes/)
- [Authorize specific nodes](/tutorials/build-a-blockchain/authorize-specific-nodes/)
