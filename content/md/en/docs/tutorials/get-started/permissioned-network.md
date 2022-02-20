---
title: Authorize specific node activities
description: permissioned network
keywords: permissioned, consortium,
difficulty: 1
duration: 1 Hour
relevantSkills:
  - Rust
  - Blockchain basics
---

In [Start a trusted validator network](/tutorials/get-started/trusted-network/), you saw how to build a simple network with a known set of validator nodes.
That tutorial illustrated a simplified version of a **permissioned network**.
In a permissioned network, only **authorized nodes** are allowed to perform specific network activities.
For example, you might grant some nodes the permission to validate blocks and other nodes the permission to propagate transactions.
 
A blockchain with nodes that are granted specific permissions is different from a **public** or **permissionless** blockchain. 
In a permissionless blockchain, anyone can join the network by running the node software on suitable hardware.
In general, a permissionless blockchain offers greater decentralization of the network.
However, there are use cases where creating a permissioned blockchain might be appropriate.
For example, a permissioned blockchain would be suitable for the following types of projects:

* For a private or consortium network, such as a private enterprise or a non-profit organization.
* In a highly-regulated data environments, such as healthcare, finance, or business-to-business ledgers.
* For testing of a pre-public blockchain network at scale.

This tutorial illustrates how you can build a permissioned network with Substrate by using the
[node authorization pallet](/rustdocs/latest/pallet_node_authorization/index.html).

## Node authorization and ownership

The `node-authorization` pallet is a prebuilt FRAME pallet that enables you to manage a configurable set of nodes for a network.
Each node is identified by a `PeerId`.
Each `PeerId` is owned by  **one and only one** `AccountId` that claims the node.

There are two ways you can authorize a node to join the network:

* By adding the `PeerId` to the list of predefined nodes.
   You must be approved by the governance or sudo pallet in the network to do this.

* By asking for a _paired peer_ connection from a specific node.
   This node can either be a predefined node `PeerId` or a normal one.

Note that _any_ user can claim to be the owner of a `PeerId`.
To protect against false claims, you should claim the node _before_ you start the node.
After you start the node, its `PeerID` is visible to the network and _anyone_ could subsequently claim it.

As the owner of a node, you can add and remove connections for your node.
For example, you can manipulate the connection between a predefined node
and your node or between your node and other non-predefined nodes.
You can't change the connections for predefined nodes.
They are always allowed to connect with each other.

The `node-authorization` pallet uses an [offchain worker](/main-docs/fundamentals/offchain-operations)
to configure its node connections. 
Make sure to enable the offchain worker with the right CLI flag as offchain worker is disabled by default for non-authority nodes.

## Before you begin

Before you begin, verify the following:

* You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/main-docs/install/).

* You have completed [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) and have the Substrate node template installed locally.

* You have completed the [Start a trusted validator network](/tutorials/get-started/trusted-network/) tutorial.

* You are generally familiar with [peer-to-peer networking](https://wiki.polkadot.network/docs/faq#networking) in Substrate.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

* Check out and compile the node template.

* Add the node authorization pallet to the node template runtime.

* Launch multiple nodes and authorize new nodes to join.

## Build the node template

If you have completed previous tutorials, you should have the Substrate node template repository available locally.

1. Open a terminal shell on the computer where you have Substrate node template repository.

1. Change to the root of the node template directory, if necessary, by running the following command:
    
    ```bash
    cd substrate-node-template
    ```

1. Switch to the version of the repository that has the `latest` tag by running the following command:
    
    ```bash
    git checkout latest
    ```

    This command checks out the repository in a detached state.
    If you want to save your changes, you can create a branch from this state.

1. Compile the node template by running the following command:
    
    ```bash
    cargo build --release
    ```

    The node template should compile without any errors.
    If you encounter issues when you compile, you can try the troubleshooting tips in [Troubleshoot Rust issues](/main-docs/install/troubleshoting/).

## Add node authorization pallet

Before you can use a new pallet, you must add some information about it to the configuration file that the compiler uses to build the runtime binary.

For Rust programs, you use the `Cargo.toml` file to define the configuration settings and dependencies that determine what gets compiled in the resulting binary.
Because the Substrate runtime compiles to both a native Rust binary that includes standard library functions and a [WebAssembly (Wasm)](https://webassembly.org/) binary that does not include the standard library, the `Cargo.toml` file controls two important pieces of information:

* The pallets to be imported as dependencies for the runtime, including the location and version of the pallets to import.
* The features in each pallet that should be enabled when compiling the native Rust binary. By enabling the standard (`std`) feature set from each pallet, you can compile the runtime to include functions, types, and primitives that would otherwise be missing when you build the WebAssembly binary.

For information about adding dependencies in `Cargo.toml` files, see [Dependencies](https://doc.rust-lang.org/cargo/guide/dependencies.html) in the Cargo documentation.
For information about enabling and managing features from dependent packages, see [Features](https://doc.rust-lang.org/cargo/reference/features.html) in the Cargo documentation.

To add the node-authorization pallet to the Substrate runtime:

1. Open a terminal shell and change to the root directory for the node template.

1. Open the `runtime/Cargo.toml` configuration file in a text editor.

1. Import the `pallet-node-authorization` crate to make it available to the node template runtime by adding it to the list of dependencies.

    ```toml
    [dependencies.pallet-node-authorization]
    default-features = false
    git = 'https://github.com/paritytech/substrate.git'
    tag = 'devhub/latest'
    version = '4.0.0-dev'
    ```

   * The first line imports the `pallet-node-authorization` crate as a dependency.
    * The second line specifies that the pallet features are not enabled by default when compiling the runtime.
    * The third line specifies the repository location for retrieving the `pallet-node-authorization` crate.
    * The fourth line specifies a commit tag for retrieving the crate.
    * The fifth line specifies a version identifier for the crate.

1. Add the `pallet-node-authorization/std` features to the list of `features` to enable when compiling the runtime.

    ```toml
    [features]
    default = ['std']
    std = [
      ...
      'pallet-aura/std',
      'pallet-balances/std',
      'pallet-node-authorization/std',    # add this line
      ...
    ]
    ```
    
    This section specifies the default feature set to compile for this runtime is the `std` features set. 
    When the runtime is compiled using the `std` feature set, the `std` features from all of the pallets listed as dependencies are enabled.
    For more detailed information about how the runtime is compiled as a native Rust binary with the standard library and as a WebAssembly binary using the `no_std` attribute, see [Building the runtime](/main-docs/build/build-runtime/).
    
    If you forget to update the `features` section in the `Cargo.toml` file, you might see `cannot find function` errors when you compile the runtime binary.

1. Check that the new dependencies resolve correctly by running the following command:

   ```bash
   cargo check -p node-template-runtime
   ```



**`runtime/Cargo.toml`**

```TOML
[dependencies]
#--snip--

#--snip--
[features]
default = ['std']
std = [
    #--snip--
    'pallet-node-authorization/std',
    #--snip--
]
```

We need to simulate the governance in our simple blockchain, so we just let a `sudo` admin rule,
configuring the pallet's interface to `EnsureRoot`. 
In a production environment we would want to have
difference, governance based checking implemented here. More details of this `Config` can be found in
the pallet's
[reference docs](/rustdocs/latest/pallet_node_authorization/pallet/trait.Config.html).

**`runtime/src/lib.rs`**

```rust

/* --snip-- */

use frame_system::EnsureRoot;

/* --snip-- */

parameter_types! {
	pub const MaxWellKnownNodes: u32 = 8;
	pub const MaxPeerIdLength: u32 = 128;
}

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

/* --snip-- */
```

Finally, we are ready to put our pallet in `construct_runtime` macro with following extra line of code:

**`runtime/src/lib.rs`**

```rust
construct_runtime!(
    pub enum Runtime where
        Block = Block,
        NodeBlock = opaque::Block,
        UncheckedExtrinsic = UncheckedExtrinsic
    {
        /* --snip-- */

        /*** Add This Line ***/
        NodeAuthorization: pallet_node_authorization::{Pallet, Call, Storage, Event<T>, Config<T>},

        /* --snip-- */

    }
);
```

### Add genesis storage for our pallet

`PeerId` is encoded in bs58 format, so we need a new library
[bs58](https://docs.rs/bs58/) in **node/Cargo.toml** to decode it to get its bytes.

**`node/cargo.toml`**

```TOML
[dependencies]
#--snip--
bs58 = "0.4.0"
#--snip--
```

Now we add a proper genesis storage in **node/src/chain_spec.rs**. Similarly, import the necessary dependencies:

**node/src/chain_spec.rs**

```rust
/* --snip-- */
use sp_core::OpaquePeerId; // A struct wraps Vec<u8>, represents as our `PeerId`.
use node_template_runtime::NodeAuthorizationConfig; // The genesis config that serves for our pallet.
/* --snip-- */
```

Adding our genesis config in the helper function `testnet_genesis`,

**node/src/chain_spec.rs**

```rust
/// Configure initial storage state for FRAME modules.
fn testnet_genesis(
	wasm_binary: &[u8],
	initial_authorities: Vec<(AuraId, GrandpaId)>,
	root_key: AccountId,
	endowed_accounts: Vec<AccountId>,
	_enable_println: bool,
) -> GenesisConfig {

    /* --snip-- */

    /*** Add This Block Item ***/
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
   		}),

    /* --snip-- */

}
```

`NodeAuthorizationConfig` contains a property named `nodes`, which is vector of tuple.
The first element of the tuple is the `OpaquePeerId` and we use `bs58::decode` to convert
the `PeerId` in human readable format to bytes. The second element of the tuple is `AccountId`
and represents the owner of this node, here we are using one of the provided endowed accounts
for demonstration: [Alice and Bob](/v3/tools/subkey#well-known-keys).

You may wondering where the `12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2` comes from.
We can use [subkey](/v3/tools/subkey#generating-node-keys) to generate
the above human readable `PeerId`.

```bash
subkey generate-node-key
```

<br />
<Message
  type={`gray`}
  title={`Note`}
  text="`subkey` is a CLI tool that comes bundled with substrate, and you can install it natively too! 
	Refer to the [install Instructions](/v3/tools/subkey#installation).
  	"
/>

The output of the command is like:

```bash
12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2 // this is PeerId.
c12b6d18942f5ee8528c8e2baf4e147b5c5c18710926ea492d09cbd9f6c9f82a // This is node-key.
```

Now all the code changes are finished, we are ready to launch our permissioned network!

<Message
  type={`yellow`}
  title={`Information`}
  text="Stuck? The solution with all required changes to the base template can be found ',
		[here](https://github.com/substrate-developer-hub/substrate-node-template/tree/tutorials/solutions/permissioned-network-v3).',
		"
/>

In the next section, we will use well-known node keys and Peer IDs to launch your permissioned network
and allow access for other nodes to join.

## Launch our Permissioned Network

In this part, we will demonstrate how to launch and add new nodes to our permissioned chain.

Let's first make sure everything compiles:

```bash
# from the root dir of your node template:
cargo build --release
```

For this demonstration, we'll launch 4 nodes: 3 well known nodes that are allowed
to author and validate blocks, and 1 sub-node that only has read-only
access to data from a selected well-known node (upon it's approval).

### Obtaining Node Keys and PeerIDs

For Alice's _well known_ node:

```bash
# node key
c12b6d18942f5ee8528c8e2baf4e147b5c5c18710926ea492d09cbd9f6c9f82a

# peerid, generated from node key
12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2

# bs58 decoded peer id in hex:
0024080112201ce5f00ef6e89374afb625f1ae4c1546d31234e87e3c3f51a62b91dd6bfa57df
```

For Bob's _well known_ node:

```bash
# node key
6ce3be907dbcabf20a9a5a60a712b4256a54196000a8ed4050d352bc113f8c58

# peer id, generated from node key
12D3KooWQYV9dGMFoRzNStwpXztXaBUjtPqi6aU76ZgUriHhKust

# bs58 decoded peer id in hex:
002408011220dacde7714d8551f674b8bb4b54239383c76a2b286fa436e93b2b7eb226bf4de7
```

For Charlie's _NOT well known_ node:

```bash
# node key
3a9d5b35b9fb4c42aafadeca046f6bf56107bd2579687f069b42646684b94d9e

# peer id, generated from node key
12D3KooWJvyP3VJYymTqG7eH4PM5rN4T2agk5cdNCfNymAqwqcvZ

# bs58 decoded peer id in hex:
002408011220876a7b4984f98006dc8d666e28b60de307309835d775e7755cc770328cdacf2e
```

For Dave's _sub-node_ (to Charlie, [more below](#add-dave-as-a-sub-node-to-charlie)):

```bash
# node key
a99331ff4f0e0a0434a6263da0a5823ea3afcfffe590c9f3014e6cf620f2b19a

# peer id, generated from node key
12D3KooWPHWFrfaJzxPnqnAYAoRUyAHHKqACmEycGTVmeVhQYuZN

# bs58 decoded peer id in hex:
002408011220c81bc1d7057a1511eb9496f056f6f53cdfe0e14c8bd5ffca47c70a8d76c1326d
```

The nodes of Alice and Bob are already configured in genesis storage and serve as
well known nodes. We will later add Charlie's node into the set of well known nodes.
Finally we will add the connection between Charlie's node and Dave's node without
making Dave's node as a well known node.

<Message
  type={`gray`}
  title={`Note`}
  text="You can get the above bs58 decoded peer id by using `bs58::decode` similar',
    to how it was used in our genesis storage configuration. Alternatively, there are tools online like ',
    [this one](https://whisperd.tech/bs58-codec/)
    to en/decode bs58 IDs.
    "
/>

### Alice and Bob Start the Network

Let's start Alice's node first:

```bash
./target/release/node-template \
--chain=local \
--base-path /tmp/validator1 \
--alice \
--node-key=c12b6d18942f5ee8528c8e2baf4e147b5c5c18710926ea492d09cbd9f6c9f82a \
--port 30333 \
--ws-port 9944
```

Here we are using `--node-key` to specify the key that are used for the security
connection of the network. This key is also used internally to generate the human
readable PeerId as shown in above section.

Other used CLI flags are:

- `--chain=local` for a local testnet (not the same as the `--dev` flag!).
- `--alice` to make the node an authority which can author and finalize block,
  also give the node a name which is `alice`.
- `--port` assign a port for peer to peer connection.
- `--ws-port` assign a listening port for WebSocket connection.

<Message
  type={`yellow`}
  title={`Information`}
  text={`You can get the detailed description of above flags and more by running \`./target/release/node-template -h\`.`}
/>

Start Bob's node:

```bash
# In a new terminal, leave Alice running
./target/release/node-template \
--chain=local \
--base-path /tmp/validator2 \
--bob \
--node-key=6ce3be907dbcabf20a9a5a60a712b4256a54196000a8ed4050d352bc113f8c58 \
--port 30334 \
--ws-port 9945
```

After both nodes are started, you should be able to see new blocks authored and
finalized in bother terminal logs. Now let's use the
[polkadot.js apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer)
and check the well known nodes of our blockchain. Don't forget to switch to one of
our local nodes running: `127.0.0.1:9944` or `127.0.0.1:9945`.

Firstly, we need to add an extra setting to tell the frontend the type of the `PeerId` used
in node-authorization pallet. Note: the format of `PeerId` here is a wrapper on bs58 decoded
peer id in bytes. Go to the **Settings Developer**
[page in apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/settings/developer)
, add following [custom type mapping](https://polkadot.js.org/docs/api/start/types.extend)
information:

```json
// add this as is, or with other required types you have set already:
{
  "PeerId": "(Vec<u8>)"
}
```

<br />
<Message
  type={`red`}
  title={`Warning`}
  text="If you don't do this, you will get extrinsic errors of the form:
    `Verification Error: Execution(ApiError(Could not convert parameter 'tx' between node and runtime)`. 
    More details [here](https://polkadot.js.org/docs/api/FAQ#the-node-returns-a-could-not-convert-error-on-send).
    "
/>

Then, let's go to **Developer** page, **Chain State sub-tab**, and check the data
stored in the `nodeAuthorization` pallet, `wellKnownNodes` storage. You should be
able to see the peer ids of Alice and Bob's nodes, prefixed with `0x` to show its
bytes in hex format.

We can also check the owner of one node by querying the storage `owners` with the
peer id of the node as input, you should get the account address of the owner.

![query_well_known_nodes](../img/tutorials//03-permissioned-network/get_well_known_nodes.png)

### Add Another Well Known Node

Let's start Charlie's node,

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

<br />
<Message
  type={`yellow`}
  title={`Important`}
  text="The `node-authorization` pallet integrates an
    [offchain worker](/v3/concepts/off-chain-features#off-chain-workers)
    to configure node connections. As Charlie is not _yet_ a well-known node, and we
    intend to attach Dave\'s node, we require the offchain worker to be enabled.
    "
/>{' '}

After it was started, you should see there are **no connected peers** for this node.
This is because we are trying to connect to a permissioned network, you need to
get authorization to to be connectable! Alice and Bob were configured already in
the genesis `chain_spec.rs`, where all others mut be added manually via extrinsic.

Remember that we are using `sudo` pallet for our governance, we can make a sudo call
on `add_well_known_node` dispatch call provided by node-authorization pallet to add
our node. You can find more avaliable calls in this
[reference doc](/rustdocs/latest/pallet_node_authorization/pallet/enum.Call.html).

Go to **Developer** page, **Sudo** tab, in apps and submit the `nodeAuthorization` -
`add_well_known_node` call with the peer id in hex of Charlie's node and the
owner is Charlie, of course. Note Allice is the valid sudo origin for this call.

![add_well_known_node](../img/tutorials/03-permissioned-network/add_well_known_node.png)

After the transaction is included in the block, you should see Charlie's node is
connected to Alice and Bob's nodes, and starts to sync blocks. Notice the reason
the three nodes can find each other is
[mDNS](/rustdocs/latest/sc_network/index.html) discovery mechanism is enabled
by default in a local network.

<Message
  type={`gray`}
  title={`Note`}
  text="If your nodes are not on the same local network, you don't need mDNS and should use
    `--no-mdns` to disable it. If running node in a public internet, you need to use
    `--no-mdns` to disable it. If running node in a public internet, you need to use
    Otherwise put the reachable nodes as bootnodes of Chain Spec.
    "
/>

Now we have 3 well known nodes all validating blocks together!

### Add Dave as a Sub-Node to Charlie

Let's add Dave's node, not as a well-known node, but a "sub-node" of Charlie.
Dave will _only_ be able to connect to Charlie to access the network.
This is a security feature: as Charlie is therefor solely responsible for any
connected sub-node peer. There is one point of access control for David in case
they need to be removed or audited.

Start Dave's node with following command:

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

![charlie_add_connections](../img/tutorials/03-permissioned-network/charlie_add_connections.png)

Then, Dave needs to configure his node to allow the connection from Charlie's node.
But before he adds this, Dave needs to _claim_ his node, hopefully it's not too late!

![dave_claim_node](../img/tutorials/03-permissioned-network/dave_claim_node.png)

Similarly, Dave can add connection from Charlie's node.

![dave_add_connections](../img/tutorials/03-permissioned-network/dave_add_connections.png)

You should now see Dave is catching up blocks and only has one peer which belongs to Charlie!
Restart Dave's node in case it's not connecting with Charlie right away.

<Message
  type={`gray`}
  title={`Note`}
  text="_Any_ node may issue _extrinsics_ that effect other node\'s behavior, as long as it
    is _on chain data_ that is used for reference, and you have the _singing key_ in the keystore 
    available for the account in question for the extrinsics\' required origin. 
    All nodes in this demonstration have access to the developer signing keys, thus 
    we were able to issue commands that effected Chalie\'s sub-nodes from _any_ connected node 
    on our network on behalf of Charlie. In a real world application, node operators would 
    _only_ have access to their node keys, and would be the only ones able to sign and submit 
    extrinsics properly, very likely from their own node where they have control of the key\'s security.
    "
/>

**Congratulations!**

You are at the end of this tutorial and are already learned about how to build a
permissioned network. You can also play with other dispatchable calls like
`remove_well_known_node`, `remove_connections`.

## Next steps

- Complete the [Private Network Tutorial](/tutorials/v3/private-network)
- Read more about the [Subkey tool](/v3/tools/subkey)
