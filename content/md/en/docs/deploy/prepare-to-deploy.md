---
title: Prepare to deploy
description:
keywords:
  - parachain
  - relay chain
  - node types
  - deployment targets
---

To prepare for deployment, you'll want to look more carefully at your network architecture, including how and where to deploy different nodes, the type of infrastructure you are deploying on, and the command-line options you'll use to manage node operations.
The topics in this section highlight some of these key considerations for moving from a local development and test environment into production.

## Node roles and responsibilities

As discussed in [Networks and nodes](/learn/networks-and-nodes/), you can use Substrate to build blockchains that can be deployed as solo chains or parachains, as private networks, or as custom relay chains.
You also learned that nodes can take on different roles depending on your chain and project requirements.

As you prepare for deployment, it's important to keep in mind how different types of nodes are used to ensure they are configured with appropriate hardware and software required to perform their duties.
The following table summarizes the most common node types and responsibilities:

| Node type      | What it does                                                                                                                                                                                                               |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Validator node | Secures the relay chain by staking DOT, processes the validating proofs from parachain collator node, and votes on consensus along with other validators.                                                                  |
| Collator node  | Maintains a parachain by collecting parachain transactions and producing state transition proofs for the validators.                                                                                                       |
| Boot node      | Provides a static address and peer-to-peer (`libp2p`) public key that is used to bootstrap a node onto the network’s distributed hash table and to find peer nodes.                                                        |
| RPC node       | Exposes an RPC interface over HTTP or WebSocket ports for the relay chain or the parachain so that users can read the blockchain state and submit transactions. There are often multiple RPC nodes behind a load balancer. |
| Archive node   | Maintains all blocks starting from the genesis block with complete state available for every block.                                                                                                                        |
| Full node      | Synchronizes with the relay chain or parachain to store the most recent block state and block headers for older blocks.                                                                                                    |

### Role-specific command-line options

The command-line settings you use to start a node typically reflect the type of node you are starting.
For example, if you are starting a validator node, you should always specify at least the `--validator` command-line option to enable block validation.
You should also ensure that the node keys are injected using the command line or by calling the `author_rotateKeys` RPC method.

For collator nodes, you should always specify at least the `--collator` command-line option to enable parachain collation.

Bootnodes use a static key file to ensure the public address for peer-to-peer networking is always the same.
You should store the private node key in a file and use the `--node-key-file` command-line option to specify the path to the file.

For RPC nodes, you should specify the following command-line options to allow up to 5000 public RPC or WebSocket connections:

`--unsafe-ws-external`
`--rpc-methods Safe`
`--rpc-cors ‘*’ `
`--ws-max-connections 5000`

If you want a node to be an archive node, you must specify the`-–pruning=archive` command-line option to prevent the node from discarding any block state.

## Parachain-specific syntax

For parachain nodes, you must specify two sets of command-line options.
The first set of command-line options apply to the parachain.
The second set of command-line options apply to the relay chain that runs locally in parallel with the parachain.
For example:

```
./statemine $PARACHAIN_OPTIONS -- $RELAYCHAIN_OPTIONS
```

For example, the following command illustrates starting a Statemine collator node:

```bash
./statemine  --chain statemine --in-peers 25 --out-peers 25 --db-cache 512 --pruning=1000 --unsafe-pruning -- --chain kusama -db-cache 512 --pruning=1000 --wasm-execution Compiled
```

## Common deployment targets

There are many different ways you could deploy the nodes that define your network topology, and different deployment scenarios have different hardware and software requirements.
The following table provides a non-exhaustive list of the common deployment targets:

| Type               | Description                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Physical server    | Physical hardware is typically deployed as a rack-mounted server located in a data center.                                                                                                                                      |
| Virtual machine    | Virtual hardware is typically deployed as a virtual image hosted on a cloud provider platforms or self-hosted onsite.                                                                                                           |
| Kubernetes cluster | Kubernetes is a container orchestration engine that can be used to host your blockchain instances. This option is only recommended if you already have prior experience with Kubernetes, especially in production environments. |
| Local container    | Local container engines—such as `containerd`, Docker, and Pod Manager—provide simpler containerization services than Kubernetes and can be used to create and deploy node images.                                               |
