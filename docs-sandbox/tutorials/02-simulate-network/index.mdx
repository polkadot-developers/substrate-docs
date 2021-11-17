---
title: Simulate a two-node network
slug: /tutorials/02-simulate-network
version: '3.0'
section: tutorials
category: substrate chain
keywords: node template, basics, consortium, authority, aura, private network
difficulty: 1
duration: 1 Hour
relevantSkills:
  - Rust
  - Blockchain basics
---

This tutorial provides a basic introduction to how to start a private blockchain network with an **authority set** of private **validators**.

The Substrate node template uses an authority consensus model that limits block production to a rotating list of authorized accounts.
The authorized accounts—**authorities**—are responsible for creating blocks in a round robin fashion.

In this tutorial, you'll see how the authority consensus model works in practice by using two predefined accounts as the authorities that enable the nodes to produce blocks. 
In this simulated network, the two nodes are started using different accounts and keys but run on a single computer.

## Before you begin

Before you begin, verify the following:

* You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/v3/getting-started/installation).

* You have completed [Build a local blockchain](./build-local-blockchain.md) and have the Substrate node template installed locally.

* You are generally familiar with software development and using command-line interfaces.

* You are generally familiar with blockchains and smart contract platforms.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

* Start a blockchain node using using a predefined account.

* Learn the key command-line options used to start a node.

* Determine if a node is running and producing blocks.

* Connect a second node to a running network.

* Verify peer computers produce and finalize blocks.

## Start the first blockchain node

Before you generate keys to start your own private Substrate network, you can learn the fundamental principles using a predefined network specification called `local` and running under predefined user accounts.

This tutorial simulates a private network by running two Substrate nodes on a single local computer using predefined accounts that are named `alice` and `bob`.

To start the blockchain:

1. Open a terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Purge old chain data by running the following command:
    
    ```
    ./target/release/node-template purge-chain --base-path /tmp/alice --chain local
    ```

    The command prompts you to confirm the operation:

    ```bash
    Are you sure to remove "/tmp/alice/chains/local_testnet/db"? [y/N]:
    ```

1. Type `y` to confirm that you want to remove the chain data.
    
    You should always remove old chain data when starting a new network.

1. Start the local blockchain node using the alice account by running the following command:
    
    <pre>
    ./target/release/node-template \
    --base-path /tmp/alice \
    --chain local \
    --alice \
    --port 30333 \
    --ws-port 9945 \
    --rpc-port 9933 \
    --node-key 0000000000000000000000000000000000000000000000000000000000000001 \
    --telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
    --validator
    </pre>

### Review the command-line options

Before moving on, have a look at how the following options are used to start the node template.

|:<div style="min-width:110pt;font-weight:bold;">Option</div> |:<div style="font-weight:bold;">Description</div> |
|:--------------- |: ---------------------------------------------- |
| `--base-path` | Specifies the directory for storing all of the data related to this chain.|
| `--chain local` | Specifies the chain specification to use. Valid predefined chain specifications include `local`, `development`, and `staging`.|
| `--alice` | Adds the predefined keys for the `alice` account to the node's keystore. With this setting, the `alice` account is used for block production and finalization.|
| `--port 30333` | Specifies the port to listen on for peer-to-peer (`p2p`) traffic. Because this tutorial uses two nodes running on the same physical computer to simulate a network, you must explicitly specify a different port for at least one account. |
| `--ws-port 9945`  | Specifies the port to listen on for incoming WebSocket traffic. The default port is `9944`. This tutorial uses a custom web socket port number (`9945`). |
| `--rpc-port 9933` | Specifies the port to listen on for incoming RPC traffic. The default port is `9933`.|
| `--node-key <key>` | Specifies the Ed25519 secret key to use for `libp2p` networking. You should only use this option for development and testing.|
| `--telemetry-url` | Specifies where to send telemetry data. For this tutorial, you can send telemetry data to a server hosted by Parity that is available for anyone to use.|
| `--validator` | Specifies that this node participates in block production and finalization for the network. |

For more information about the command-line options that are available for the node template, see the usage help by running the following command:

`./target/release/node-template --help`

### Review the node messages displayed

If the node starts successfully, the terminal displays messages describing network operations. 
For example, you should see output similar to this:

```bash
2021-03-10 17:34:27  Substrate Node
2021-03-10 17:34:27  ✌️  version 3.0.0-1c5b984-x86_64-linux-gnu
2021-03-10 17:34:27  ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2021
2021-03-10 17:34:27  📋 Chain specification: Local Testnet
2021-03-10 17:34:27  🏷 Node name: Alice
2021-03-10 17:34:27  👤 Role: AUTHORITY
2021-03-10 17:34:27  💾 Database: RocksDb at /tmp/alice/chains/local_testnet/db
2021-03-10 17:34:27  ⛓  Native runtime: node-template-100 (node-template-1.tx1.au1)
2021-03-10 17:34:27  🔨 Initializing Genesis block/state (state: 0xea47…9ba8, header-hash: 0x9d07…7cce)
2021-03-10 17:34:27  👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2021-03-10 17:34:27  ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2021-03-10 17:34:27  Using default protocol ID "sup" because none is configured in the chain specs
2021-03-10 17:34:27  🏷 Local node identity is: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp
2021-03-10 17:34:27  📦 Highest known block at #0
2021-03-10 17:34:27  〽️ Prometheus server started at 127.0.0.1:9615
2021-03-10 17:34:27  Listening for new connections on 127.0.0.1:9945.
2021-03-10 17:34:32  💤 Idle (0 peers), best: #0 (0x9d07…7cce), finalized #0 (0x9d07…7cce), ⬇ 0 ⬆ 0
2021-03-10 17:34:37  💤 Idle (0 peers), best: #0 (0x9d07…7cce), finalized #0 (0x9d07…7cce), ⬇ 0 ⬆ 0
...
```

In particular, you should note the following messages in the output:

* `🔨 Initializing Genesis block/state (state: 0xea47…9ba8, header-hash: 0x9d07…7cce)` identifies the initial or **genesis block** that the node is using. 
  When you start the next node, verify that these values are the same.

* `🏷 Local node identity is: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp` specifies a string that uniquely identifies this node. 
  This string is determined by the `--node-key` that was used to start the node using the `alice` account. 
  You use this string to identify the node to connect to when you start a second node.
   
* `2021-03-10 17:34:37  💤 Idle (0 peers), best: #0 (0x9d07…7cce), finalized #0 (0x9d07…7cce), ⬇ 0 ⬆ 0` indicates that there are no other nodes in the network and that no blocks are being produced.
  Another node must join the network before blocks can start to be produced.

<!--
### Attach a frontend to see information about the node

You can see a lot of information about node operations by watching the output it produces in your terminal.
You can also view information about node operations by using a web browser to access the Polkadot-JS graphical user interface.

To view node operations using the Polkadot-JS application:

1. Open a web browser.

1. Navigate to the
[Polkadot-JS Explorer](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9945#/explorer).
    
  The Polkadot-JS Explorer link uses the `rpc` URL parameter to connect to the local node.

  Some browsers have ad blocking features that prevent connecting to a local node.
  If you have trouble connecting to the local node, see if you have ad blocking enabled and disable it, as needed. 
	If your browser prevents connections to a local node, try using another browser, like Chromium or downloading and hosting the [Polkadot-JS application](https://github.com/polkadot-js/apps#development) locally.

1. Click the network icon displayed in the top left corner of the Polkadot-JS Explorer page.

  ![Display the list of networks](../../../src/images/tutorials/05-private-network/private-network-top-left-network-icon.png)

1. Expand **DEVELOPMENT** in the list of networks available.

  ![Display DEVELOPMENT networks](../../../src/images/tutorials/05-private-network/polkadot-list-networks.png)

1. Verify the custom endpoint is set to your local host and the port number you specified for incoming WebSocket traffic.
  
    You can use a single instance of the Polkadot-JS application to connect to different networks, nodes, and endpoints.

    ![Custom endpoint](../../../src/images/tutorials/05-private-network/private-network-custom-endpoint.png)

    You should now see something like this displayed in the Polkadot-JS Explorer **Network** page.

    ![No blocks displayed in Polkadot-JS](../../../src/images/tutorials/05-private-network/private-network-no-blocks.png)-->

## Add a second node to the blockchain network

Now that the node you started using the `alice` account keys is running, you can add another node to the network using the `bob` account.
Because you are joining a network that is already running, you can use the running node to identify the network for the new node to join.
The commands are similar to the ones you used before, but with a few important differences.

To add a node to the running blockchain:

1. Open a **new** terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Purge old chain data by running the following command:
        
    ```
    ./target/release/node-template purge-chain --base-path /tmp/bob --chain local -y
    ```

    By adding `-y` to the command, you can remove chain data without being prompted you to confirm the operation.

1. Start a second local blockchain node using the `bob` account by running the following command:
    
    <pre>
    ./target/release/node-template \
    --base-path /tmp/bob \
    --chain local \
    --bob \
    --port 30334 \
    --ws-port 9946 \
    --rpc-port 9934 \
    --telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
    --validator \
    --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp
    </pre>
    
    Note the following differences between this command and the previous one:
    
    * Because the two nodes are running on the same physical computer, you must specify different values for the `--base-path`, `--port`, `--ws-port`, and `--rpc-port` options.

    * This command includes the `--bootnodes` option and specifies a single boot node, the node started by `alice`.
    
    The `--bootnodes` option specifies the following information:
    
    * `ip4` indicates that the IP address for the node uses the IPv4 format
    * `127.0.0.1` specifies the IP address for the running node.
      In this case, the address for the `localhost`.
    * `tcp` specifies TCP as the protocol used for peer-to-peer communication.
    * `30333` specifies the port number used for peer-to-peer communication. 
      In this case, the port number for TCP traffic.
    * `12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp` identifies the running node to communicate with for this network. 
      In this case, the identifier for the node started using the `alice` account.
      
## Verify blocks are produced and finalized
    
After you start the second node, the nodes should connect to each other as peers and start producing blocks.

To verify blocks are being finalized:

1. Verify that you see lines similar to the following in the terminal where you started the first node:
      
    ```bash
    2021-03-10 17:47:32  🔍 Discovered new external address for our node: /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp
    2021-03-10 17:47:32  🔍 Discovered new external address for our node: /ip4/<your-computer-LAN-IP>/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp
    2021-03-10 17:47:33  💤 Idle (1 peers), best: #0 (0x9d07…7cce), finalized #0 (0x9d07…7cce), ⬇ 1.0kiB/s ⬆ 1.0kiB/s
    2021-03-10 17:47:36  🙌 Starting consensus session on top of parent 0x9d07d1757a9ca248e58141ce52a11fca37f71007dec16650b87a853f0d4c7cce
    2021-03-10 17:47:36  🎁 Prepared block for proposing at 1 [hash: 0x727826a5e6fba9a13af11422d4677b5f0743cc733c382232328e69fd307d1d2f; parent_hash: 0x9d07…7cce; extrinsics (1): [0x768a…a9e2]]
    2021-03-10 17:47:36  🔖 Pre-sealed block for proposal at 1. Hash now 0x4841d8b2e62483fa4702b3ddcd1b603803842374dcdc1e9533ad407708b33dd8, previously 0x727826a5e6fba9a13af11422d4677b5f0743cc733c382232328e69fd307d1d2f.
    2021-03-10 17:47:36  ✨ Imported #1 (0x4841…3dd8)
    2021-03-10 17:47:36  ✨ Imported #1 (0xb241…2ae8)
    2021-03-10 17:47:38  💤 Idle (1 peers), best: #1 (0x4841…3dd8), finalized #0 (0x9d07…7cce), ⬇ 0.8kiB/s ⬆ 0.8kiB/s
    2021-03-10 17:47:42  ♻️  Reorg on #1,0x4841…3dd8 to #2,0x8b6a…dce6, common ancestor #0,0x9d07…7cce
    2021-03-10 17:47:42  ✨ Imported #2 (0x8b6a…dce6)
    2021-03-10 17:47:43  💤 Idle (1 peers), best: #2 (0x8b6a…dce6), finalized #0 (0x9d07…7cce), ⬇ 0.8kiB/s ⬆ 0.7kiB/s
    2021-03-10 17:47:48  🙌 Starting consensus session on top of parent 0x8b6a3ab2fe9891b1af008ea0d92dae9bc84cfa5578231e81066d47928822dce6
    2021-03-10 17:47:48  🎁 Prepared block for proposing at 3 [hash: 0xb887aef2097eff5869e38ccec0302bce372ad05ac2cdf9cc4725c38ec071fb7a; parent_hash: 0x8b6a…dce6; extrinsics (1): [0x82ac…2f20]]
    2021-03-10 17:47:48  🔖 Pre-sealed block for proposal at 3. Hash now 0x34d608dd8be6b82bef4a7aaae1ec80930a5c4b8cf9bdc99013410e91544f3a2a, previously 0xb887aef2097eff5869e38ccec0302bce372ad05ac2cdf9cc4725c38ec071fb7a.
    2021-03-10 17:47:48  ✨ Imported #3 (0x34d6…3a2a)
    2021-03-10 17:47:48  💤 Idle (1 peers), best: #3 (0x34d6…3a2a), finalized #0 (0x9d07…7cce), ⬇ 0.7kiB/s ⬆ 0.8kiB/s
    2021-03-10 17:47:53  💤 Idle (1 peers), best: #3 (0x34d6…3a2a), finalized #1 (0xb241…2ae8), ⬇ 0.6kiB/s ⬆ 0.7kiB/s
    2021-03-10 17:47:54  ✨ Imported #4 (0x2b8a…fdc4)
    2021-03-10 17:47:58  💤 Idle (1 peers), best: #4 (0x2b8a…fdc4), finalized #2 (0x8b6a…dce6), ⬇ 0.7kiB/s ⬆ 0.6kiB/s
    ...
    ```
    
    In these lines, you can see the following information aout your blockchain:

    * The first node was started by `alice`.
    * The node has a one peer (`1 peers`).
    * The nodes have produced some blocks (`best: #4 (0x2b8a…fdc4)`).
    * The blocks are being finalized (`finalized #2 (0x8b6a…dce6)`).
      
1. Verify that you see similar output in the terminal where you started the second node.

1. Shut down both nodes by pressing Control-c in each terminal shell.

<!-- MOVED OUT was step 3 
1. Open the [Polkadot-JS Explorer](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9945#/explorer) to verify the network is producing and finalizing blocks.
    
    ![Blocks are produced and finalized](../../../src/images/tutorials/05-private-network/private-network-displays-blocks.png) 

END OF HIDDEN Step -->

## Next steps

This tutorial introduced the first basic steps for starting a private blockchain network.
In this tutorial, you simulated the private network by running two nodes on a single computer and using predefined accounts as participants.

You learned:

* How to use several of the node template commands and command-line options.

* How to start two blockchain nodes that communicate with each other as peers.

* How to verify your private blockchain nodes are producing blocks.

The next tutorial builds on the information you learned in this tutorial to illustrate how you can start a private network with other participants and nodes running on separate computers.

In [Start a private network](./start-a-private-network.md), you'll learn:

* How to generate your own secret key pairs.

* How to create a custom chain specification that uses the keys you generated.

* How to add validators to a private network that uses your custom chain specification.
