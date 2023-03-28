---
title: Chain specification
description: Describes the role of the chain specification in a Substrate-based network, how to specify the chain specification to use when starting a node, and how to customize and distribute chain specifications.
keywords:
  - genesis
  - configuration
  - chain spec
---

In Substrate, a **chain specification** is the collection of information that describes a Substrate-based blockchain network.
For example, the chain specification identifies the network that a blockchain node connects to, the other nodes that it initially communicates with, and the initial state that nodes must agree on to produce blocks.

The chain specification is defined using the [`ChainSpec` struct](https://paritytech.github.io/substrate/master/sc_service/struct.GenericChainSpec.html).
The `ChainSpec` struct separates the information required for a chain into two parts:

- A client specification that contains information used by the Substrate **outer node** to communicate with network participants and send data to telemetry endpoints.
  Many of these chain specification settings can be overridden by command-line options when starting a node or can be changed after the blockchain has started.

- The initial **genesis state** that all nodes in the network agree on.
  The genesis state must be established when the blockchain is first started and it cannot be changed thereafter without starting an entirely new blockchain.

## Customizing outer node settings

For the outer node, the chain specification controls information such as:

- The boot nodes the node communicates with.

- The server endpoints for the node to send telemetry data to.

- The human- and machine-readable names for the network the node connects to.

Because the Substrate framework is extensible, you can also customize the chain specification to include additional information.
For example, you can to configure the outer node to connect to specific blocks at specific heights to prevent long range attacks when syncing a new node from genesis.

Note that you can customize outer node settings after genesis.
However, nodes only add peers that use the same `protocolId`.

## Customizing the genesis configuration

All nodes in the network must agree on the genesis state before they can agree on any subsequent blocks.
The information configured in the genesis portion of a chain specification is used to create a genesis block.
It takes effect when you start the first node and cannot be overridden with command-line options.
However, you can configure some information in the genesis portion of a chain specification.
For example, you can customize the genesis portion of the chain specification to include information such as:

- Initial token holder balances.

- Accounts that are initially part of a governance council.

- The administrative account that controls the `sudo` key.

Substrate nodes also include the compiled WebAssembly for the runtime logic on the chain, so the initial runtime must also be supplied in the chain specification.

## Storing chain specification information

The information in the chain specification can be stored as Rust code or as a JSON file.
Substrate nodes typically include at least one, and often many, hard-coded chain specifications.
Including this information as Rust code directly in the node ensures that the node can connect to at least one chain without any additional information supplied by the node operator.
If you are building a blockchain with the intent to define a main network, this main network specification is usually hard-coded in the outer node.

Alternatively, you can use the `build-spec` subcommand to serialize the chain specification into a JSON file.
It is common to distribute a JSON-encoded chain specification with a node binary when launching a test network or a private chain.

## Providing the chain specification to start a node

Each time you start a node, you provide the chain specification that the node should use.
In the simplest case, the node uses a default chain specification that is hard-coded into the node binary.
You can choose an alternative hard-coded chain specification by using the `--chain` command-line option when you start a node.
For example, you can instruct the node to use the chain specification associated with the string "local" by specifying `--chain local` as a command-line option.

If you don't want to start a node with a hard-coded chain specification, you can provide it as a JSON file.
For example, you can instruct the node to use the chain specification in the `someCustomSpec.json` file by specifying `--chain=someCustomSpec.json` as a command-line option.
If you specify a JSON file, the node attempts to de-serialize the provided JSON
chain specification, and then use it.

## Declaring storage items for a runtime

In most cases, a Substrate runtime requires some storage items to be configured at genesis.
For example, if you are developing the runtime with FRAME, any storage item that is declared with the `Config` trait in the runtime requires configuration at genesis.
These storage values are configured in the genesis portion of the chain specification.
For information about how to set initial values for storage items in a pallet, see [Genesis configuration](/build/genesis-configuration/).

### Creating a custom chain specification

If you are creating a one-off network for development, testing, or demonstration purposes, you might want a fully customized chain specification.
To create a completely customized chain spec, you can export the default chain spec to JSON format, then edit the fields in the JSON file.
For example, you can use the `build-spec`sub-command to export the chain specification to a JSON file:

```bash
substrate build-spec > myCustomSpec.json
```

After you export the chain spec, you can modify any of its fields in a text editor.
For example, you might want to change the network name, bootnodes, and any genesis storage items, such as token balances.
After editing the JSON file, you can start the node using the customized JSON.
For example:

```bash
substrate --chain=myCustomSpec.json
```

## Raw chain specifications

Substrate nodes support runtime upgrades.
With runtime upgrades, the blockchain's runtime can be different than when the chain began.
Chain specifications contain information structured in a way that can be understood by the node's runtime.
For example, consider this excerpt from the default chain specification for the Substrate node template:

```json
"sudo": {
  "key": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
}
```

In the JSON file, this key and its associated value are human-readable text.
However, this information can't be stored in this format in the underlying storage structures that Substrate uses.
Before you can use the chain specification to initialize the genesis storage for a node, the human-readable keys must be transformed into actual storage keys that allow the values to be stored in the [storage trie](/learn/state-transitions-and-storage/).
This transformation is straight-forward, but it requires that the chain specification to be encoded in a format that node runtime can read.

To enable a node with an upgraded runtime to synchronize with a chain from genesis, the human-readable chain specification is encoded in a **raw** format.
The raw format enables you distribute chain specifications that all nodes can use to synchronize the chain even after runtime upgrades. 

Substrate-based nodes support the `--raw` command-line option to produce the raw chain specifications.
For example, you can produce the raw chain specification for a human-readable `myCustomSpec.json` file by running the following command:

```bash
substrate build-spec --chain=myCustomSpec.json --raw > customSpecRaw.json
```

After the conversion to the raw format, the `sudo key` snippet looks like this:

```json
"0x50a63a871aced22e88ee6466fe5aa5d9": "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
```

## Where to go next

- [Add trusted nodes](/tutorials/build-a-blockchain/add-trusted-nodes/)
- [How-to: Configure genesis state](/reference/how-to-guides/basics/configure-genesis-state/)
- [How-to: Customize a chain specification](/reference/how-to-guides/basics/customize-a-chain-specification/)
- [Node template chain specification](https://github.com/substrate-developer-hub/substrate-node-template/blob/master/node/src/chain_spec.rs)
- [ChainSpec struct](https://paritytech.github.io/substrate/master/sc_service/struct.GenericChainSpec.html)
- [ProtocolId struct](https://paritytech.github.io/substrate/master/sc_network/config/struct.ProtocolId.html)
