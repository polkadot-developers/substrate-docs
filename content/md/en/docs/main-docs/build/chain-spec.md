---
title: Chain specification
description:
keywords:
  - genesis
  - configuration
  - chain spec
---

In Substrate, a **chain specification** is the collection of information that describes a Substrate-based blockchain network.
For example, the chain specification identifies the network that a blockchain node connects to, the other nodes that it initially communicates with, and the initial state that nodes must agree on to produce blocks.

The chain specification is defined using the [`ChainSpec` struct](/rustdocs/latest/sc_service/struct.GenericChainSpec.html).
The `ChainSpec` struct separates the information required for a chain into two parts:

* A client specification that contains information used by the Substrate **client** to communicate with network participants and send data to telemetry endpoints.
  Many of the client specification settings an be overridden by command-line options when starting a node or can be changed after the blockchain has started.

* The initial **genesis state** that all nodes in the network agree on.
  The genesis state must be established when the blockchain is first started and it cannot be changed thereafter without starting an entirely new blockchain.
  
## Customizing client settings

The Substrate client is the part of the node that runs outside of the runtime.
The client portion of the chain specification controls information such as:

* The boot nodes the client communicates with.

* The server endpoints for the client to send telemetry data to.

* The human- and machine-readable names for the network the client connects to.

Because the Substrate framework is extensible, you can also customize the client specification to include additional information.
For example, you can to configure the client to connect to specific blocks at specific heights to prevent long range attacks when syncing a new node from genesis.

Note that you can customize client settings after genesis.
However, nodes only add peers that use the same `protocolId`.

## Customizing the genesis configuration

All nodes in the network must agree on the genesis state before they can agree on any subsequent blocks.
The information configured in the genesis portion of a chain specification is used to create a genesis block.
It takes effect when you start the first node and cannot be overridden with command-line options.
However, you can configure some information in the genesis portion of a chain specification.
For example, you can customize the genesis portion of the chain specification to include information such as:

* Initial token holder balances.

* Accounts that are initially part of a governance council.

* The administrative account that controls the sudo key.

Substrate nodes also include the compiled WebAssembly for the runtime logic on the chain, so the initial runtime must also be supplied in the chain spec.

## Storing chain specification information

The information in the chain specification can be stored in as Rust code or as a JSON file.
Substrate nodes typically include at least one, and often many, chain specifications hard-coded into the client.
Including this information as Rust code directly in the client ensures that the node can connect to at least one chain without any additional information supplied by the node operator. 
In protocols that have a notion of main network, this main network specification is usually hard-coded in the client.

Alternatively, you can use the build-spec subcommand serialize the chain specification into a JSON file. 
It is common to distribute a JSON-encoded chain specification with a node binary when launching a test network or a private chain.

## Providing the chain specification to start a node

Each time a node operator starts a node, they provide a chain specification that the node should use. 
In the simplest case, the chain spec is provided implicitly and the node uses a default chain spec that is hard-coded into the node binary.

A common task is to start a testnet or private network that behaves similarly to an existing
protocol, but is not connected to the mainnet. To achieve this, the operator may choose an
alternative hard-coded chain spec by using a command-line flag such as `--chain local` that
instructs the node to use the spec associated with the string "local". A third option available to
node operators is to provide a chain spec as a JSON file with a command-line flag such as
`--chain=someCustomSpec.json`, in which case the node will attempt to de-serialize the provided JSON
chain spec, and then use it.

### Developing a runtime

Nearly every Substrate runtime will have storage items that need to be configured at genesis. When
developing with [FRAME](/v3/runtime/frame), any storage item that is declared with the `config()`
option requires configuration at genesis. It is the job of the chain spec, specifically the genesis
portion, to configure such storage values.

### Customizing a chain spec

When creating a one-off network for development, testing, or demonstration purposes, a truly
customized chain spec may be desired. Node operators may export the default chain spec for the
protocol to JSON format and then make edits. Substrate-based nodes are equipped with a `build-spec`
sub-command that does this exporting.

```bash
substrate build-spec > myCustomSpec.json
```

Once the chain spec has been exported, the node operator is free to modify any of its fields. It is
common to modify the network's name and bootnodes as well as any genesis storage items, such as
token balances, that the operator wishes. Once the edits are made, the operator may launch their
customized chain by supplying the customized JSON.

```bash
substrate --chain=myCustomSpec.json
```

See the [custom chain spec how-to guide](/how-to-guides/v3/basics/custom-chain-spec) for a more concrete example.

## Raw chain specifications

Substrate nodes support runtime upgrades, which means a blockchain's runtime may be different than
when the chain began. Chain specs, as discussed so far, contain information structured in a way that
can be understood by the node's runtime. For example, consider this excerpt from the default
Substrate node's chain specification `.json` file:

```json
"sudo": {
  "key": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
}
```

Before this spec can be used to initialize a node's genesis storage, the human-readable keys must be
transformed into actual storage keys for the [storage trie](/v3/advanced/storage). This
transformation is straight-forward, but it requires that the node's runtime be able to understand
the chain spec.

If a node with an upgraded runtime attempts to synchronize a chain from genesis, it will not
understand the information in this human-readable chain spec. For this reason, there is a second
encoding of the chain spec known as the "raw" chain spec.

When distributing chain specs in JSON format, they should be distributed in this raw format to
ensure that all nodes can sync the chain even after runtime upgrades. Substrate-based nodes support
the `--raw` flag to produce such raw chain specs.

```bash
substrate build-spec --chain=myCustomSpec.json --raw > customSpecRaw.json
```

After the conversion process, the above snippet looks like this:

```json
"0x50a63a871aced22e88ee6466fe5aa5d9": "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
```

## Next steps

### Learn more

- Have a look at the [how-to guide on basic genesis configuration](/how-to-guides/v3/basics/genesis/)
- Rustdocs for the
  [`ChainSpec` struct](/rustdocs/latest/sc_service/struct.GenericChainSpec.html)
- Rustdocs for the
  [`ProtocolId` struct](/rustdocs/latest/sc_network/config/struct.ProtocolId.html)

### Examples

- Gain hands-on experience with chain specs by
  [starting a private network](/tutorials/v3/private-network).
- The
  [node template's chain specification](https://github.com/substrate-developer-hub/substrate-node-template/blob/master/node/src/chain_spec.rs)
  stored as rust code.
