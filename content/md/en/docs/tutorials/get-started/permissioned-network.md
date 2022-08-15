---
title: Authorize specific nodes
description: Configure a network that has authorized nodes and nodes with restricted access.
keywords:
  - permissioned
  - private
  - authorization
  - restricted access
---

In [Add trusted nodes](/tutorials/get-started/trusted-network/), you saw how to build a simple network with a known set of validator nodes.
That tutorial illustrated a simplified version of a **permissioned network**.
In a permissioned network, only **authorized nodes** are allowed to perform specific network activities.
For example, you might grant some nodes the permission to validate blocks and other nodes the permission to propagate transactions.

A blockchain with nodes that are granted specific permissions is different from a **public** or **permissionless** blockchain.
In a permissionless blockchain, anyone can join the network by running the node software on suitable hardware.
In general, a permissionless blockchain offers greater decentralization of the network.
However, there are use cases where creating a permissioned blockchain might be appropriate.
For example, a permissioned blockchain would be suitable for the following types of projects:

- For a private or consortium network, such as a private enterprise or a non-profit organization.
- In highly-regulated data environments, such as healthcare, finance, or business-to-business ledgers.
- For testing of a pre-public blockchain network at scale.

This tutorial illustrates how you can build a permissioned network with Substrate by using the [node authorization pallet](https://paritytech.github.io/substrate/master/pallet_node_authorization/index.html).

## Node authorization and ownership

The `node-authorization` pallet is a prebuilt FRAME pallet that enables you to manage a configurable set of nodes for a network.
Each node is identified by a `PeerId`.
Each `PeerId` is owned by **one and only one** `AccountId` that claims the node.

There are two ways you can authorize a node to join the network:

- By adding the `PeerId` to the list of predefined nodes.
  You must be approved by the governance or sudo pallet in the network to do this.

- By asking for a _paired peer_ connection from a specific node.
  This node can either be a predefined node `PeerId` or a normal one.

Note that _any_ user can claim to be the owner of a `PeerId`.
To protect against false claims, you should claim the node _before_ you start the node.
After you start the node, its `PeerID` is visible to the network and _anyone_ could subsequently claim it.

As the owner of a node, you can add and remove connections for your node.
For example, you can manipulate the connection between a predefined node and your node or between your node and other non-predefined nodes.
You can't change the connections for predefined nodes.
They are always allowed to connect with each other.

The `node-authorization` pallet uses an [offchain worker](/main-docs/fundamentals/offchain-operations) to configure its node connections.
Make sure to enable the offchain worker when you start the node because it is disabled by default for non-authority nodes.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/main-docs/install/).

- You have completed [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) and have the Substrate node template installed locally.

* You have completed the [Add trusted nodes](/tutorials/get-started/trusted-network/) tutorial.

- You are generally familiar with [peer-to-peer networking](https://wiki.polkadot.network/docs/faq#networking) in Substrate.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Check out and compile the node template.

- Add the node authorization pallet to the node template runtime.

- Launch multiple nodes and authorize new nodes to join.

## Build the node template

If you have completed previous tutorials, you should have the Substrate node template repository available locally.

1. Open a terminal shell on the computer where you have Substrate node template repository.

1. Change to the root of the node template directory, if necessary, by running the following command:

   ```bash
   cd substrate-node-template
   ```

1. Switch to the version of the repository that has the `polkadot-v0.9.26` tag by running the following command:

   ```bash
   git checkout polkadot-v0.9.26
   ```

   This command checks out the repository in a detached state.
   If you want to save your changes, you can create a branch from this state.

1. Compile the node template by running the following command:

   ```bash
   cargo build --release
   ```

   The node template should compile without any errors.
   If you encounter issues when you compile, you can try the troubleshooting tips in [Troubleshoot Rust issues](/main-docs/install/troubleshooting/).

## Add the node authorization pallet

Before you can use a new pallet, you must add some information about it to the configuration file that the compiler uses to build the runtime binary.

For Rust programs, you use the `Cargo.toml` file to define the configuration settings and dependencies that determine what gets compiled in the resulting binary.
Because the Substrate runtime compiles to both a native Rust binary that includes standard library functions and a [WebAssembly (Wasm)](https://webassembly.org/) binary that does not include the standard library, the `Cargo.toml` file controls two important pieces of information:

- The pallets to be imported as dependencies for the runtime, including the location and version of the pallets to import.

- The features in each pallet that should be enabled when compiling the native Rust binary. By enabling the standard (`std`) feature set from each pallet, you can compile the runtime to include functions, types, and primitives that would otherwise be missing when you build the WebAssembly binary.

For general information about adding dependencies in `Cargo.toml` files, see [Dependencies](https://doc.rust-lang.org/cargo/guide/dependencies.html) in the Cargo documentation.
For information about enabling and managing features from dependent packages, see [Features](https://doc.rust-lang.org/cargo/reference/features.html) in the Cargo documentation.

### Add note-authorization dependencies

To add the `node-authorization` pallet to the Substrate runtime:

1. Open a terminal shell and change to the root directory for the node template.

1. Open the `runtime/Cargo.toml` configuration file in a text editor.

1. Locate the `[dependencies]` section and add the `pallet-node-authorization` crate to make it available to the node template runtime.

   ```toml
   [dependencies]
   pallet-node-authorization = { default-features = false, version = "4.0.0-dev", git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.26" }
   ```

   This line imports the `pallet-node-authorization` crate as a dependency and specifies the following configuration details for the crate:

   - The pallet features are not enabled by default when compiling the runtime.
   - The repository location for retrieving the `pallet-node-authorization` crate.
   - The commit tag for retrieving the crate.
   - The version identifier for the crate.

1. Add the `pallet-node-authorization/std` features to the list of `features` to enable when compiling the runtime.

   ```toml
   [features]
   default = ['std']
   std = [
     ...
     "pallet-node-authorization/std",    # add this line
     ...
   ]
   ```

   This section specifies the default feature set to compile for this runtime is the `std` features set.
   When the runtime is compiled using the `std` feature set, the `std` features from all of the pallets listed as dependencies are enabled.
   For more detailed information about how the runtime is compiled as a native Rust binary with the standard library and as a WebAssembly binary using the `no_std` attribute, see [Building the runtime](/main-docs/build/build-process/).

   If you forget to update the `features` section in the `Cargo.toml` file, you might see `cannot find function` errors when you compile the runtime binary.

1. Check that the new dependencies resolve correctly by running the following command:

   ```bash
   cargo check -p node-template-runtime
   ```

### Add an administrative rule

To simulate governance in this tutorial, you can configure the pallet to use the `EnsureRoot` privileged function that can be called using the Sudo pallet.
The Sudo pallet is included in the node template by default and enables you to make calls through the root-level administrative account.
In a production environment, you would use more realistic governance-based checking.

To enable the `EnsureRoot` rule in your runtime:

1. Open the `runtime/src/lib.rs` file in a text editor.

1. Add the following line to the file:

   ```rust
   use frame_system::EnsureRoot;
   ```

## Implement the Config trait for the pallet

Every pallet has a [Rust **trait**](https://doc.rust-lang.org/book/ch10-02-traits.html) called `Config`.
The `Config` trait is used to identify the parameters and types that the pallet needs.

Most of the pallet-specific code required to add a pallet is implemented using the `Config` trait.
You can review what you to need to implement for any pallet by referring to its Rust documentation or the source code for the pallet.
For example, to see what you need to implement for the `Config` trait in the node-authorization pallet, you can refer to the Rust documentation for [`pallet_node_authorization::Config`](https://paritytech.github.io/substrate/master/pallet_node_authorization/pallet/trait.Config.html).

To implement the `node-authorization` pallet in your runtime:

1. Open the `runtime/src/lib.rs` file in a text editor.

1. Add the `parameter_types` section for the pallet using the following code:

   ```rust
   parameter_types! {
     pub const MaxWellKnownNodes: u32 = 8;
     pub const MaxPeerIdLength: u32 = 128;
   }
   ```

1. Add the `impl` section for the `Config` trait for the pallet using the following code:

   ```rust
   impl pallet_node_authorization::Config for Runtime {
     type Event = Event;
     type MaxWellKnownNodes = MaxWellKnownNodes;
     type MaxPeerIdLength = MaxPeerIdLength;
     type AddOrigin = EnsureRoot<AccountId>;
     type RemoveOrigin = EnsureRoot<AccountId>;
     type SwapOrigin = EnsureRoot<AccountId>;
     type ResetOrigin = EnsureRoot<AccountId>;
     type WeightInfo = ();
   }
   ```

1. Add the pallet to the `construct_runtime` macro with the following line of code:

   ```rust
   construct_runtime!(
   pub enum Runtime where
       Block = Block,
       NodeBlock = opaque::Block,
       UncheckedExtrinsic = UncheckedExtrinsic
     {
       /*** Add This Line ***/
       NodeAuthorization: pallet_node_authorization::{Pallet, Call, Storage, Event<T>, Config<T>},
     }
   );
   ```

1. Save your changes and close the file.

1. Check that the configuration can compile by running the following command:

   ```bash
   cargo check -p node-template-runtime
   ```

### Add genesis storage for authorized nodes

Before you can launch the network to use node authorization, some additional configuration is needed to handle the peer identifiers and account identifiers.
For example, the `PeerId` is encoded in bs58 format, so you need to add a new dependency for the [bs58](https://docs.rs/bs58/) library in the `node/Cargo.toml` to decode the `PeerId` to get its bytes.
To keep things simple, the authorized nodes are associated with predefined accounts.

To configure genesis storage for authorized nodes:

1. Open the `node/Cargo.toml` file in a text editor.

1. Locate the `[dependencies]` section and add the `bs58` library to the node template.

   ```toml
   [dependencies]
   bs58 = "0.4.0"
   ```

1. Save your changes and close the file.

1. Open the `node/src/chain_spec.rs` file in a text editor.

1. Add genesis storage for nodes that are authorized to join the network using the following code:

   ```rust
   use sp_core::OpaquePeerId; // A struct wraps Vec<u8>, represents as our `PeerId`.
   use node_template_runtime::NodeAuthorizationConfig; // The genesis config that serves for our pallet.
   ```

1. Locate the `testnet_genesis` function that configures initial storage state for FRAME modules.

   For example:

   ```rust
   /// Configure initial storage state for FRAME modules.
   fn testnet_genesis(
     wasm_binary: &[u8],
     initial_authorities: Vec<(AuraId, GrandpaId)>,
     root_key: AccountId,
     endowed_accounts: Vec<AccountId>,
     _enable_println: bool,
     ) -> GenesisConfig {

   ```

1. Within the `GenesisConfig` declaration, add the following code block:

   ```rust
     node_authorization: NodeAuthorizationConfig {
       nodes: vec![
         (
           OpaquePeerId(bs58::decode("12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2").into_vec().unwrap()),
           endowed_accounts[0].clone()
         ),
         (
           OpaquePeerId(bs58::decode("12D3KooWQYV9dGMFoRzNStwpXztXaBUjtPqi6aU76ZgUriHhKust").into_vec().unwrap()),
           endowed_accounts[1].clone()
         ),
       ],
     },
   ```

   In this code, `NodeAuthorizationConfig` contains a `nodes` property, which is a vector with a tuple of two elements.
   The first element of the tuple is the `OpaquePeerId`.
   The `bs58::decode` operation converts the human-readable `PeerId`—for example, `12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2`—to bytes.
   The second element of the tuple is the `AccountId` that represents the owner of this node.
   This example uses the predefined [Alice and Bob](/reference/command-line-tools/subkey/#well-known-keys), identified here as endowed accounts [0] and [1].

1. Save your changes and close the file.

### Verify that the node compiles

Now that you have completed the code changes, you are ready to verify that the node compiles.

To compile the node:

1. Change to the root of the `substrate-node-template` directory, if necessary:

1. Compile the node by running the following command:

   ```bash
   cargo build --release
   ```

   If there are no syntax errors, you are ready to proceed.
   If there are errors, follow the instructions in the compile output to fix them then rerun the `cargo build` command.

## Launch the permissioned network

You can now use the node keys and peer identifiers for the predefined accounts to launch the permissioned network and authorize other nodes to join.

For the purposes of this tutorial, yo are going to launch four nodes.
Three of the nodes are associated with predefined accounts and all three of those nodes are allowed to author and validate blocks.
The fourth node is a **sub-node** that is only authorized to read data from a selected node with the approval of that node's owner.

### Obtain node keys and peerIDs

You have already configured the nodes associated with the Alice and Bob account in genesis storage.
You can use the [`subkey`](/reference/command-line-tools/subkey/) program to inspect the keys associated with predefined accounts and to generate and inspect your own keys.
However, if you run the `subkey generate-node-key` command, your node key and peer identifier are randomly generated and won't match the keys used in the tutorial.
Because this tutorial uses predefined accounts and well-known node keys, the following table summarizes the keys for each account.

| Account | Keys associated with the account                                                                    |
| ------- | --------------------------------------------------------------------------------------------------- |
| Alice   | Node key: c12b6d18942f5ee8528c8e2baf4e147b5c5c18710926ea492d09cbd9f6c9f82a                          |
|         | PeerID (generated from the node key): 12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2          |
|         | Decoded PeerID in hex: 0024080112201ce5f00ef6e89374afb625f1ae4c1546d31234e87e3c3f51a62b91dd6bfa57df |
|         |
| Bob     | Node key: 6ce3be907dbcabf20a9a5a60a712b4256a54196000a8ed4050d352bc113f8c58                          |
|         | PeerID (generated from the node key): 12D3KooWQYV9dGMFoRzNStwpXztXaBUjtPqi6aU76ZgUriHhKust          |
|         | Decoded PeerID in hex: 002408011220dacde7714d8551f674b8bb4b54239383c76a2b286fa436e93b2b7eb226bf4de7 |

The two other development accounts—Charlie and Dave—do not have well-known node keys or peer identifiers.
For demonstration purposes, we'll use the following keys:

| Account | Keys associated with the account                                                                    |
| ------- | --------------------------------------------------------------------------------------------------- |
| Charlie | Node key: 3a9d5b35b9fb4c42aafadeca046f6bf56107bd2579687f069b42646684b94d9e                          |
|         | PeerID (generated from the node key): 12D3KooWJvyP3VJYymTqG7eH4PM5rN4T2agk5cdNCfNymAqwqcvZ          |
|         | Decoded PeerID in hex: 002408011220876a7b4984f98006dc8d666e28b60de307309835d775e7755cc770328cdacf2e |
|         |
| Dave    | Node key: a99331ff4f0e0a0434a6263da0a5823ea3afcfffe590c9f3014e6cf620f2b19a                          |
|         | PeerID (generated from the node key): 12D3KooWPHWFrfaJzxPnqnAYAoRUyAHHKqACmEycGTVmeVhQYuZN          |
|         | Decoded PeerID in hex: 002408011220c81bc1d7057a1511eb9496f056f6f53cdfe0e14c8bd5ffca47c70a8d76c1326d |

### Start the first node

Because you have configured genesis storage to use the well-known node keys for Alice and Bob, you can use the `--alice` command shortcut for `--name alice --validator` to start the first node.

To start the first node:

1. Open a terminal shell on your computer, if necessary.

1. Change to the root directory where you compiled the Substrate node template.

1. Start the first node by running the following command:

   ```bash
   ./target/release/node-template \
   --chain=local \
   --base-path /tmp/validator1 \
   --alice \
   --node-key=c12b6d18942f5ee8528c8e2baf4e147b5c5c18710926ea492d09cbd9f6c9f82a \
   --port 30333 \
   --ws-port 9944
   ```

   In this command, the `--node-key` option to specify the key to be used for a secure connection to the network.
   This key is also used internally to generate the human-readable PeerId as shown in above section.

   As you might have seen in other tutorials, the command-line options used are:

   - `--chain=local` for a local testnet (not the same as the `--dev` flag!).
   - `--alice` to name the node `alice` and make the node a validator that can author and finalize blocks.
   - `--port` to assign a port for peer-to-peer communication.
   - `--ws-port` to assign a listening port for WebSocket connections.

### Start the second node

You can start the second node using the `--bob` command shortcut for `--name bob --validator` to start the second node.

To start the second node:

1. Open a **new** terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Start the second node by running the following command:

   ```bash
   ./target/release/node-template \
   --chain=local \
   --base-path /tmp/validator2 \
   --bob \
   --node-key=6ce3be907dbcabf20a9a5a60a712b4256a54196000a8ed4050d352bc113f8c58 \
   --port 30334 \
   --ws-port 9945
   ```

   After both nodes are started, you should be able to see new blocks authored and finalized in both terminal logs.

### Add a third node to the list of well-known nodes

You can start the third node with the `--name charlie` command.
The `node-authorization` pallet uses an [offchain worker](/main-docs/fundamentals/offchain-operations) to configure node connections.
Because the third node is not a well-known node and it will have the fourth node in the network configured as a read-only sub-node, you must include the command line option to enable the offchain worker.

To start the third node:

1. Open a **new** terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Start the third node by running the following command:

   ```bash
   ./target/release/node-template \
   --chain=local \
   --base-path /tmp/validator3 \
   --name charlie  \
   --node-key=3a9d5b35b9fb4c42aafadeca046f6bf56107bd2579687f069b42646684b94d9e \
   --port 30335 \
   --ws-port=9946 \
   --offchain-worker always
   ```

   After you start this node, you should see there are **no connected peers** for the node.
   Because this is a permissioned network, the node must be explicitly authorized to connect.
   The Alice and Bob nodes were configured in the genesis `chain_spec.rs`file.
   All other nodes mut be added manually using a call to the Sudo pallet.

### Authorize access for the third node

This tutorial uses the `sudo` pallet for governance.
Therefore, you can use the `sudo` pallet to call the `add_well_known_node` function provided by `node-authorization` pallet to add the third node.

Go to **Developer** page, **Sudo** tab, in apps and submit the `nodeAuthorization` -
`add_well_known_node` call with the peer id in hex of Charlie's node and the
owner is Charlie, of course. Note Alice is the valid sudo origin for this call.

![add_well_known_node](/media/images/docs/tutorials/permissioned-network/add_well_known_node.png)

After the transaction is included in the block, you should see the `charlie` node is
connected to the `alice` and `bob` nodes, and starts to sync blocks.
The three nodes can find each other using the [mDNS](https://paritytech.github.io/substrate/master/sc_network/index.html) discovery mechanism that is enabled by default in a local network.

If your nodes are not on the same local network, you should use the command-line option `--no-mdns` to disable it.

### Add a sub-node

The fourth node in this network is not as a well-known node.
This node is owned by the user `dave`, but is a sub-node of the `charlie` node.
The sub-node can only access the network by connecting to the node owned by `charlie`.
The parent node is responsible for any sub-node it authorizes to connect and controls access if the sub-node needs to be removed or audited.

To start the fourth node:

```bash
./target/release/node-template \
--chain=local \
--base-path /tmp/validator4 \
--name dave \
--node-key=a99331ff4f0e0a0434a6263da0a5823ea3afcfffe590c9f3014e6cf620f2b19a \
--port 30336 \
--ws-port 9947 \
--offchain-worker always
```

After it was started, there is no available connections. This is a _permissioned network_,
so first, Charlie needs to configure his node to allow the connection from Dave's node.

In the **Developer Extrinsics** page, get Charlie to submit an `addConnections` extrinsic.
The first PeerId is the peer id in hex of Charlie's node. The connections is a list
of allowed peer ids for Charlie's node, here we only add Dave's.

![charlie_add_connections](/media/images/docs/tutorials/permissioned-network/charlie_add_connections.png)

Then, Dave needs to configure his node to allow the connection from Charlie's node.
But before he adds this, Dave needs to _claim_ his node, hopefully it's not too late!

![dave_claim_node](/media/images/docs/tutorials/permissioned-network/dave_claim_node.png)

Similarly, Dave can add connection from Charlie's node.

![dave_add_connections](/media/images/docs/tutorials/permissioned-network/dave_add_connections.png)

You should now see Dave is catching up blocks and only has one peer which belongs to Charlie!
Restart Dave's node in case it's not connecting with Charlie right away.

Any node can issue _extrinsics_ that affect the behavior of other nodes, as long as it is _on chain data_ that is used for reference, and you have the _singing key_ in the keystore available for the account in question for the required origin.
All nodes in this demonstration have access to the developer signing keys, thus we were able to issue commands that affected charlie's sub-nodes from _any_ connected node on our network on behalf of Charlie.
In a real world application, node operators would _only_ have access to their node keys, and would be the only ones able to sign and submit extrinsics properly, very likely from their own node where they have control of the key's security.

**Congratulations!**

You have now learned how to build a network where some nodes have limited permissions and restricted access to network resources.
To learn more about the topics introduced in this tutorial, see the following sections:

- [Monitor node metrics](/tutorials/get-started/node-metrics/)
- [Upgrade the runtime](/tutorials/get-started/forkless-upgrade/)
- [Accounts, addresses, and keys](/main-docs/fundamentals/accounts-addresses-keys)
