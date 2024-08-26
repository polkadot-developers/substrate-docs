---
title: Simulate a network
description: Start a private blockchain network using predefined accounts as authorized validators.
keywords:
---

<div class="warning">
	<p>
	<strong>⚠️ WARNING:</strong> This page contains potentially outdated information 
  and instructions. Reading it might still be useful, yet we suggest taking it with a grain of salt. When the new <a href="https://forum.polkadot.network/t/decentralized-futures-ecosystem-devrel-team-for-polkadot-by-papermoon/5811">Polkadot developer documentation</a> is published, the content on this page will be updated. Thanks for your patience!
	</p>
</div>

This tutorial provides a basic introduction to how you can start a private blockchain network with an **authority set** of private **validators**.

The Substrate node template uses an authority consensus model that limits block production to a rotating list of authorized accounts.
The authorized accounts—**authorities**—are responsible for creating blocks in a round robin fashion.

In this tutorial, you'll see how the authority consensus model works in practice by using two predefined accounts as the authorities that enable the nodes to produce blocks.
In this simulated network, the two nodes are started using different accounts and keys but run on a single computer.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have completed [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/) and have the Substrate node template installed locally.

- You are generally familiar with software development and using command-line interfaces.

- You are generally familiar with blockchains and smart contract platforms.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Start a blockchain node using a predefined account.

- Learn the key command-line options used to start a node.

- Determine if a node is running and producing blocks.

- Connect a second node to a running network.

- Verify peer computers produce and finalize blocks.

## Start the first blockchain node

Before you generate keys to start your own private Substrate network, you can learn the fundamental principles using a predefined network specification called `local` and running under predefined user accounts.

This tutorial simulates a private network by running two Substrate nodes on a single local computer using predefined accounts that are named `alice` and `bob`.

To start the blockchain:

1. Open a terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Purge old chain data by running the following command:

   ```bash
   ./target/release/node-template purge-chain --base-path /tmp/alice --chain local
   ```

   The command prompts you to confirm the operation:

   ```bash
   Are you sure to remove "/tmp/alice/chains/local_testnet/db"? [y/N]:
   ```

1. Type `y` to confirm that you want to remove the chain data.

   You should always remove old chain data when starting a new network.

1. Start the local blockchain node using the `alice` account by running the following command:

   ```bash
   ./target/release/node-template \
   --base-path /tmp/alice \
   --chain local \
   --alice \
   --port 30333 \
   --rpc-port 9945 \
   --node-key 0000000000000000000000000000000000000000000000000000000000000001 \
   --telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
   --validator
   ```

### Review the command-line options

Before moving on, have a look at how the following options are used to start the node.

| <div style="min-width:110pt;font-weight:bold;">Option</div> | <div style="font-weight:bold;">Description</div>                                                                                                                                                                                           |
| :---------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--base-path`                                               | Specifies the directory for storing all of the data related to this chain.                                                                                                                                                                 |
| `--chain local`                                             | Specifies the chain specification to use. Valid predefined chain specifications include `local`, `development`, and `staging`.                                                                                                             |
| `--alice`                                                   | Adds the predefined keys for the `alice` account to the node's keystore. With this setting, the `alice` account is used for block production and finalization.                                                                             |
| `--port 30333`                                              | Specifies the port to listen on for peer-to-peer (`p2p`) traffic. Because this tutorial uses two nodes running on the same physical computer to simulate a network, you must explicitly specify a different port for at least one account. |
| `--rpc-port 9945`                                            | Specifies the port on which the server will listen for incoming JSON-RPC traffic via WebSocket and HTTP. The default port is `9944`. This tutorial uses a custom web socket port number (`9945`).                                                                                   |
| `--node-key <key>`                                          | Specifies the Ed25519 secret key to use for `libp2p` networking. You should only use this option for development and testing.                                                                                                              |
| `--telemetry-url`                                           | Specifies where to send telemetry data. For this tutorial, you can send telemetry data to a server hosted by Parity that is available for anyone to use.                                                                                   |
| `--validator`                                               | Specifies that this node participates in block production and finalization for the network.                                                                                                                                                |

For more information about the command-line options that are available for the node template, see the usage help by running the following command:

`./target/release/node-template --help`

### Review the node messages displayed

If the node starts successfully, the terminal displays messages describing network operations.
For example, you should see output similar to this:

```text
2022-08-16 15:29:55 Substrate Node    
2022-08-16 15:29:55 ✌️  version 4.0.0-dev-de262935ede    
2022-08-16 15:29:55 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2022    
2022-08-16 15:29:55 📋 Chain specification: Local Testnet    
2022-08-16 15:29:55 🏷  Node name: Alice    
2022-08-16 15:29:55 👤 Role: AUTHORITY    
2022-08-16 15:29:55 💾 Database: RocksDb at /tmp/alice/chains/local_testnet/db/full    
2022-08-16 15:29:55 ⛓  Native runtime: node-template-100 (node-template-1.tx1.au1)    
2022-08-16 15:29:55 🔨 Initializing Genesis block/state (state: 0x6894…033d, header-hash: 0x2cdc…a07f)    
2022-08-16 15:29:55 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.    
2022-08-16 15:29:56 Using default protocol ID "sup" because none is configured in the chain specs    
2022-08-16 15:29:56 🏷  Local node identity is: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp    
2022-08-16 15:29:56 💻 Operating system: macos    
2022-08-16 15:29:56 💻 CPU architecture: x86_64    
2022-08-16 15:29:56 📦 Highest known block at #0    
2022-08-16 15:29:56 〽️ Prometheus exporter started at 127.0.0.1:9615    
2022-08-16 15:29:56 Running JSON-RPC server: addr=127.0.0.1:9945, allowed origins=Some(["http://localhost:*", "http://127.0.0.1:*", "https://localhost:*", "https://127.0.0.1:*", "https://polkadot.js.org"])      
2022-08-16 15:29:56 creating instance on iface 192.168.1.125    
2022-08-16 15:30:01 💤 Idle (0 peers), best: #0 (0x2cdc…a07f), finalized #0 (0x2cdc…a07f), ⬇ 0 ⬆ 0
...
```

In particular, you should note the following messages in the output:

- `🔨 Initializing Genesis block/state (state: 0xea47…9ba8, header-hash: 0x9d07…7cce)` identifies the initial or **genesis block** that the node is using.
  When you start the next node, verify that these values are the same.

- `🏷 Local node identity is: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp` specifies a string that uniquely identifies this node.
  This string is determined by the `--node-key` that was used to start the node using the `alice` account.
  You use this string to identify the node to connect to when you start a second node.
- `2021-03-10 17:34:37 💤 Idle (0 peers), best: #0 (0x9d07…7cce), finalized #0 (0x9d07…7cce), ⬇ 0 ⬆ 0` indicates that there are no other nodes in the network and that no blocks are being produced.
  Another node must join the network before blocks can start to be produced.

## Add a second node to the blockchain network

Now that the node you started using the `alice` account keys is running, you can add another node to the network using the `bob` account.
Because you are joining a network that is already running, you can use the running node to identify the network for the new node to join.
The commands are similar to the ones you used before, but with a few important differences.

To add a node to the running blockchain:

1. Open a **new** terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Purge old chain data by running the following command:

   ```bash
   ./target/release/node-template purge-chain --base-path /tmp/bob --chain local -y
   ```

   By adding `-y` to the command, you can remove chain data without being prompted you to confirm the operation.

1. Start a second local blockchain node using the `bob` account by running the following command:

   ```bash
   ./target/release/node-template \
   --base-path /tmp/bob \
   --chain local \
   --bob \
   --port 30334 \
   --rpc-port 9946 \
   --telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
   --validator \
   --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp
   ```

   Note the following differences between this command and the previous one:

   - Because the two nodes are running on the same physical computer, you must specify different values for the `--base-path`, `--port` and `--rpc-port` options.

   - This command includes the `--bootnodes` option and specifies a single boot node, the node started by `alice`.

   The `--bootnodes` option specifies the following information:

   - `ip4` indicates that the IP address for the node uses the IPv4 format

   - `127.0.0.1` specifies the IP address for the running node.
     In this case, the address for the `localhost`.

   - `tcp` specifies TCP as the protocol used for peer-to-peer communication.

   - `30333` specifies the port number used for peer-to-peer communication.
     In this case, the port number for TCP traffic.

   - `12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp` identifies the running node to communicate with for this network.
     In this case, the identifier for the node started using the `alice` account.

## Verify blocks are produced and finalized

After you start the second node, the nodes should connect to each other as peers and start producing blocks.

To verify blocks are being finalized:

1. Verify that you see lines similar to the following in the terminal where you started the first node:

   ```text
   2022-08-16 15:32:33 discovered: 12D3KooWBCbmQovz78Hq7MzPxdx9d1gZzXMsn6HtWj29bW51YUKB /ip4/127.0.0.1/tcp/30334
   2022-08-16 15:32:33 discovered: 12D3KooWBCbmQovz78Hq7MzPxdx9d1gZzXMsn6HtWj29bW51YUKB /ip6/::1/tcp/30334
   2022-08-16 15:32:36 🙌 Starting consensus session on top of parent 0x2cdce15d31548063e89e10bd201faa63c623023bbc320346b9580ed3c40fa07f
   2022-08-16 15:32:36 🎁 Prepared block for proposing at 1 (5 ms) [hash: 0x9ab34110e4617454da33a3616efc394eb1ce95ee4bf0daab69aa4cb392d4104b; parent_hash: 0x2cdc…a07f; extrinsics (1): [0x4634…cebf]] 
   2022-08-16 15:32:36 🔖 Pre-sealed block for proposal at 1. Hash now 0xf0869a5cb8ebd0fcc5f2bc194ced84ca782d9749604e888c8b9b515517179847, previously 0x9ab34110e4617454da33a3616efc394eb1ce95ee4bf0daab69aa4cb392d4104b.
   2022-08-16 15:32:36 ✨ Imported #1 (0xf086…9847)
   2022-08-16 15:32:36 💤 Idle (1 peers), best: #1 (0xf086…9847), finalized #0 (0x2cdc…a07f), ⬇ 1.0kiB/s ⬆ 1.0kiB/s
   2022-08-16 15:32:41 💤 Idle (1 peers), best: #1 (0xf086…9847), finalized #0 (0x2cdc…a07f), ⬇ 0.6kiB/s ⬆ 0.6kiB/s
   2022-08-16 15:32:42 ✨ Imported #2 (0x0d5e…2a7f)
   2022-08-16 15:32:46 💤 Idle (1 peers), best: #2 (0x0d5e…2a7f), finalized #0 (0x2cdc…a07f), ⬇ 0.6kiB/s ⬆ 0.6kiB/s
   2022-08-16 15:32:48 🙌 Starting consensus session on top of parent 0x0d5ef31979c2aa17fb88497018206d3057151119337293fe85d9526ebd1e2a7f
   2022-08-16 15:32:48 🎁 Prepared block for proposing at 3 (0 ms) [hash: 0xa307c0112bce39e0dc689132452154da2079a27375b44c4d94790b46a601346a; parent_hash: 0x0d5e…2a7f; extrinsics (1): [0x63cc…39a6]]    
   2022-08-16 15:32:48 🔖 Pre-sealed block for proposal at 3. Hash now 0x0c55670e745dd12892c9e7d5205085a78ccea98df393a822fa9b3865cfb3d51b, previously 0xa307c0112bce39e0dc689132452154da2079a27375b44c4d94790b46a601346a.
   2022-08-16 15:32:48 ✨ Imported #3 (0x0c55…d51b)
   2022-08-16 15:32:51 💤 Idle (1 peers), best: #3 (0x0c55…d51b), finalized #1 (0xf086…9847), ⬇ 0.7kiB/s ⬆ 0.9kiB/s    
   ...
   ```

   In these lines, you can see the following information about your blockchain:

   - The second node identity was discovered on the network (`12D3KooWBCbmQovz78Hq7MzPxdx9d1gZzXMsn6HtWj29bW51YUKB`).
   - The node has a one peer (`1 peers`).
   - The nodes have produced some blocks (`best: #3 (0x0c55…d51b)`).
   - The blocks are being finalized (`finalized #1 (0xf086…9847)`).

1. Verify that you see similar output in the terminal where you started the second node.

1. Shut down one of the nodes by pressing Control-c in the terminal shell.
   
   After you shut down the node, you'll see that the remaining node now has zero peers and has stopped producing blocks.
   For example:

   ```text
   2022-08-16 15:53:45 💤 Idle (1 peers), best: #143 (0x8f11…1684), finalized #141 (0x5fe3…5a25), ⬇ 0.8kiB/s ⬆ 0.7kiB/s
   2022-08-16 15:53:50 💤 Idle (0 peers), best: #143 (0x8f11…1684), finalized #141 (0x5fe3…5a25), ⬇ 83 B/s ⬆ 83 B/s
   ```  

2. Shut down the second node by pressing Control-c in the terminal shell.
   
   If you want to remove the chain state from the simulated network, use the `purge-chain` subcommand with the `--base-path` command-line options for the `/tmp/bob` and `/tmp/alice` directories.

## Next steps

This tutorial introduced the first basic steps for starting a private blockchain network.
In this tutorial, you simulated the private network by running two nodes on a single computer and using predefined accounts as participants.

You learned:

- How to use several of the node template commands and command-line options.

- How to start two blockchain nodes that communicate with each other as peers.

- How to verify your private blockchain nodes are producing blocks.

The next tutorial builds on the information you learned in this tutorial to illustrate how you can start a private network with other participants and nodes running on separate computers.

In [Add trusted nodes](/tutorials/build-a-blockchain/add-trusted-nodes/), you'll learn:

- How to generate your own secret key pairs.

- How to create a custom chain specification that uses the keys you generated.

- How to add validators to a private network that uses your custom chain specification.

If you experienced any issues with this tutorial, submit an issue, ask questions, or provide feedback.

- [Submit an issue](https://github.com/substrate-developer-hub/substrate-docs/issues/new/choose).

- [Substrate Stack Exchange](https://substrate.stackexchange.com/).
