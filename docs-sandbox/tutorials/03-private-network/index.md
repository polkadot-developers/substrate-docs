---
title: Start a private network
slug: /tutorials/03-private-network
version: 3.0 
section: tutorials
category: private network
keywords: private blockchain, consortium, authority, aura, round robin, validators,network
difficulty: 1
duration: 2 Hour
relevantSkills: 
  - Rust 
  - Blockchain basics
  - FRAME
---

This tutorial illustrates how you can start a small, standalone blockchain network with an **authority set** of private **validators**.

As you learned in [Blockchain basics](), all blockchains require the nodes in the network to agree on the state of data at any specific point in time and this agreement about the state is called **consensus**.

The Substrate node template uses a proof of authority consensus model also referred to as **authority round** or **Aura** consensus.
The Aura consensus protocol limits block production to a rotating list of authorized accounts.
The authorized accounts—**authorities**—create blocks in a round robin fashion and are generally considered to be trusted participants in the network.

This consensus model provides a simple approach to starting a solo blockchain for a limited number of participants. 
In this tutorial, you'll see how to generate the keys required to authorize a node to participate in the network, how to configure and share information about the network with other authorized accounts, and how to launch the network with an approved set of validators.

## Before you begin

Before you begin, verify the following:

* You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/v3/getting-started/installation).

* You have completed [Build a local blockchain](./build-local-blockchain.md) and have the Substrate node template installed locally.

* You have used predefined accounts as described in [Simulate a private two-node network](./simulate-two-node-network.md) to start nodes on a single computer.

* You are generally familiar with software development and using command-line interfaces.

* You are generally familiar with blockchains and smart contract platforms.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

* Generate key pairs for use as a network authority.

* Create a custom chain specification file.

* Launch a private two-node blockchain network.

## Generate your account and keys

Now that you know how to start and connect running nodes as peers using command-line options, you are ready to generate your own secret keys instead of using the predefined account keys. 
It's important to remember that each participant in the blockchain network is responsible for generating unique keys.

### Key generation options

There are several ways you can generate keys.
For example, you can generate key pairs using a `node-template` subcommand, the standalone <a target="_blank" href="/v3/tools/subkey">Subkey</a> command-line program, the Polkadot-JS application, or third-party key generation utilities.

Although you could use predefined key pairs to complete this tutorial, you would never use those keys in a production environment.
Instead of using predefined keys or the more secure `subkey` program, this tutorial illustrates how to generate keys using the Substrate node template and the `key` subcommand.

### Generate local keys using the node template

You have already used the some command-line options to start your local blockchain node using the predefined `alice` and `bob` accounts.
You can also use command-line options to generate random keys to use with Substrate.

For this tutorial, you can remain connected to the internet and use your local node to generate your keys. 
As a best practice, you should use an air-gapped computer that has never been connected to the internet when you generate keys for a production blockchain. 
At a minimum, you should disconnect from the internet before you generate any keys you intend to use on a public or private blockchain that is not under your control.

To generate keys using the node template:

1. Open a terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Generate a random secret phrase and keys by running the following command:
    
    ```
    ./target/release/node-template key generate --scheme Sr25519 --password-interactive
    ```

1. Type a password for the generated keys.
    
    The command generates keys and displays output similar to the following:

    <pre>
    Secret phrase:  pig giraffe ceiling enter weird liar orange decline behind total despair fly
    Secret seed:       0x0087016ebbdcf03d1b7b2ad9a958e14a43f2351cd42f2f0a973771b90fb0112f
    Public key (hex):  0x1a4cc824f6585859851f818e71ac63cf6fdc81018189809814677b2a4699cf45
    Account ID:        0x1a4cc824f6585859851f818e71ac63cf6fdc81018189809814677b2a4699cf45
    Public key (SS58): 5CfBuoHDvZ4fd8jkLQicNL8tgjnK8pVG9AiuJrsNrRAx6CNW
    SS58 Address:      5CfBuoHDvZ4fd8jkLQicNL8tgjnK8pVG9AiuJrsNrRAx6CNW
    </pre>

1. Use the secret seed for the account you generated to derive keys using the Ed25519 signature scheme by running the following command:
    
    <pre>
    ./target/release/node-template key inspect \
    --password-interactive --scheme Ed25519 0x0087016ebbdcf03d1b7b2ad9a958e14a43f2351cd42f2f0a973771b90fb0112f
    </pre>

1. Type the password you used to the generated keys.
    
    The command displays output similar to the following:

    <pre>
    Secret Key URI `0x0087016ebbdcf03d1b7b2ad9a958e14a43f2351cd42f2f0a973771b90fb0112f` is account:
    Secret seed:       0x0087016ebbdcf03d1b7b2ad9a958e14a43f2351cd42f2f0a973771b90fb0112f
    Public key (hex):  0x2577ba03f47cdbea161851d737e41200e471cd7a31a5c88242a527837efc1e7b
    Account ID:        0x2577ba03f47cdbea161851d737e41200e471cd7a31a5c88242a527837efc1e7b
    Public key (SS58): 5CuqCGfwqhjGzSqz5mnq36tMe651mU9Ji8xQ4JRuUTvPcjVN
    SS58 Address:      5CuqCGfwqhjGzSqz5mnq36tMe651mU9Ji8xQ4JRuUTvPcjVN
    </pre>

    You now have the Sr25519 key for producing blocks using `aura` and the Ed25519 key for finalizing blocks using `grandpa` for one node.

    * 5CfBuoHDvZ4fd8jkLQicNL8tgjnK8pVG9AiuJrsNrRAx6CNW for `aura`.
    * 5CuqCGfwqhjGzSqz5mnq36tMe651mU9Ji8xQ4JRuUTvPcjVN for `grandpa`.

### Generate or collect additional accounts and keys

You can repeat the steps to generate a second key pair on another computer or you can recruit other participants to generate the accounts and keys required to join your private network.

For this tutorial, the private network consists of just two nodes, so you need two sets of keys. 
For illustration purposes, the second set of keys used in this tutorial are:

* 5CXGP4oPXC1Je3zf5wEDkYeAqGcGXyKWSRX2Jm14GdME5Xc5 for `aura`.
* 5DpdMN4bVTMy67TfMMtinQTcUmLhZBWoWarHvEYPM4jYziqm for `grandpa`.

If you recruit other participants to join your network, be sure to collect the Sr25519 key for producing blocks using `aura` and the Ed25519 key for finalizing blocks using `grandpa` for each participant you plan to authorize as a validator before continuing to the next step.

## Create a custom chain specification

After you generate and collect the keys to use with your blockchain, you are ready to create a custom **chain specification** using those key then share your custom chain specification with trusted network participants that you are authorizing as validators.

To enable others to participate in your blockchain network, you should ensure that they generate their own keys. 
If other participants have generated their key pairs, you can create a custom chain specification to replace the `local` chain specification that you used previously.

For simplicity, the custom chain specification you create in this tutorial is a modified version of the `local` chain specification that illustrates how to create a two-node network.
You can follow the same steps to add more nodes to the network if you have the required keys.

### Modify the local chain specification

Instead of writing a completely new chain specification, you can modify the predefined `local` chain specification. 

To create a new chain specification based on the local specification:

1. Open a terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Export the `local` chain specification to a file named `customSpec.json` by running the following command: 
    
    ```bash
    ./target/release/node-template build-spec --disable-default-bootnode --chain local > customSpec.json
    ```

    If you open the `customSpec.json` file in a text editor, you would see that it contains several fields, including a large blob that contains the WebAssembly (Wasm) binary for the runtime you built using the `cargo build --release` command.
    Instead of viewing the entire file, you can preview the first and last few lines to see the fields you need to change.

1. Preview the first few fields in the `customSpec.json` file by running the following command:
    
    ```bash
    head customSpec.json
    ```

    The command displays the first fields from the file.
    For example:

    ```bash
    {
      "name": "Local Testnet",
      "id": "local_testnet",
      "chainType": "Local",
      "bootNodes": [],
      "telemetryEndpoints": null,
      "protocolId": null,
      "properties": null,
      "consensusEngine": null,
      "codeSubstitutes": {},
    ```

1. Preview the last fields in the `customSpec.json` file by running the following command:
    
    ```bash
    tail -n 80 customSpec.json
    ```
    
    This command displays the last sections following the Wasm binary field, including the details for several of the pallets—such as the `sudo` and `balances` pallets—that are used in the runtime.

1. Open the `customSpec.json` file in a text editor.

1. Modify the `name` field to identify this chain specification as a custom chain specification.
    
    For example:

    ```json
    "name": "My Custom Testnet",
    ```

1. Modify `aura` field to specify the nodes with the authority to create blocks by adding the Sr25519 SS58 address keys for each network participant.
    
    ```json
    "aura": {
        "authorities": [
          "5CfBuoHDvZ4fd8jkLQicNL8tgjnK8pVG9AiuJrsNrRAx6CNW",
          "5CXGP4oPXC1Je3zf5wEDkYeAqGcGXyKWSRX2Jm14GdME5Xc5"
        ]
      },
    ```

1. Modify the `grandpa` field to specify the nodes with the authority to finalize blocks by adding the Ed25519 SS58 address keys for each network participant. 
    
    ```json
    "grandpa": {
        "authorities": [
          [
            "5CuqCGfwqhjGzSqz5mnq36tMe651mU9Ji8xQ4JRuUTvPcjVN",
            1
          ],
          [
            "5DpdMN4bVTMy67TfMMtinQTcUmLhZBWoWarHvEYPM4jYziqm",
            1
          ]
        ]
      },
      ```

      Note that there are two data values for the `authorities` field in the `grandpa` section. 
      The first value is the address key. 
      The second value is used to support **weighted votes**. 
      In this example, each validator has a weight of **1** vote.

1. Save your changes and close the file.

### Add validators

As you have just seen, you can add and change the authority addresses in a chain specification by modifying the `aura` and `grandpa` sections. 
You can use this technique to add as many validators as
you like.

To add validators:

* Modify the `aura` section to include **Sr25519** addresses.

* Modify the `grandpa` section to include **Ed25519** addresses and a voting weight. 
 
Be sure to use unique keys for each validator. 
If two validators have the same keys, they produce conflicting blocks. 

For additional information about working with key pairs and signatures, see [Public-Key cryptography](/v3/advanced/cryptography#public-key-cryptography).

## Convert the chain specification to use the raw format

After you prepare a chain specification with the information you want to use, you must convert it into a raw specification before it can be used. 
The raw chain specification includes the same information as the unconverted specification.
However, the raw chain specification also contains encoded storage keys that the node uses to reference the data in its local storage. 
Distributing a raw chain specification ensures that each node stores the data using the proper storage keys.

To convert a chain specification to use the raw format:

1. Open a terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Convert the `customSpec.json` chain specification to the raw format with the file name `customSpecRaw.json` by running the following command: 
    
    ```bash
    ./target/release/node-template build-spec --chain=customSpec.json --raw --disable-default-bootnode > customSpecRaw.json
    ```

## Share the chain specification with others

If you are creating a private blockchain network to share with other participants, ensure that only one person creates the chain specifiction and shares the resulting raw version of that specification—for example, the `customSpecRaw.json` file—with all of the other validators in the network.

Because the Rust compiler produces optimized WebAssembly binaries that aren't deterministically reproducible, each person who generates the Wasm runtime produces a slightly different Wasm blob. 
To ensure determinism, all participants in the blockchain network must use exactly the same raw chain specification file.
For more information about this issue, see [Hunting down a non-determinism-bug in our Rust Wasm build](https://dev.to/gnunicorn/hunting-down-a-non-determinism-bug-in-our-rust-wasm-build-4fk1).

## Prepare to launch the private network

After you distribute the custom chain specification to all network participants, you're ready to launch your own private blockchain. 
The steps are similar to the steps you followed in [Start the blockchain using predefined accounts](#Start-the-blockchain-using-predefined-accounts). 
To continue with this part of the tutorial, you are no longer using a single physical computer or a single binary.

To continue, verify the following:

* You have generated or collected the account keys for at least two authority accounts.
* You have updated your custom chain specification to include the keys for block production (`aura`) and block finalization (`grandpa`).
* You have converted your custom chain specification to raw format and distributed the raw chain specification to the nodes participating in the private network.

If you have completed these steps, you are ready to start the first node in the private blockchain.

## Start the first blockchain node

As the first participant in the private blockchain network, you are responsible for starting the first node, called the **bootnode**.

To start the first node:

1. Open a terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Purge old chain data, if needed, by running the following command:
    
    ```bash
    ./target/release/node-template purge-chain --base-path /tmp/node01 --chain local -y
    ```
    
1. Start the first node using the custom chain specification by running the following command:
    
    ```bash
    ./target/release/node-template \
    --base-path /tmp/node01 \
    --chain ./customSpecRaw.json \
    --port 30333 \
    --ws-port 9945 \
    --rpc-port 9933 \
    --telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
    --validator \
    --rpc-methods Unsafe \
    --name MyNode01
    ```
    
    Note the following changes to the command you are running to start the node:
    
    * Instead of the predefined `--alice` account, you are using your own keys.
      You'll add your keys to the keystore in a separate step.
    
    * The `--chain` command-line option specifies the custom chain specification.
    
    * The `--name` command-line option enables you to give your node a human-readable name in the telemetry UI.
    
    * The `--rpc-methods Unsafe` command-line option allows you to continue the tutorial using an unsafe communication mode because your blockchain is not being used in a production setting.

    ---
    Before moving on, have a look at how the following options are used to start the node template.
    
    |:<div style="min-width:110pt;font-weight:bold;">Option</div> |:<div style="font-weight:bold;">Description</div> |
    |:--------------- |: ---------------------------------------------- |
    | `--base-path` | Specifies the directory for storing all of the data related to this chain.|
    | `--chain` | Specifies the custom chain specification to use.|
    | `--port | Specifies the port to listen on for peer-to-peer (`p2p`) traffic.|
    | `--ws-port` | Specifies the port to listen on for incoming WebSocket traffic.|
    | `--rpc-port` | Specifies the port to listen on for incoming RPC traffic.|
    | `--telemetry-url` | Specifies where to send telemetry data.|
    | `--validator` | Specifies that this node participates in block production and finalization for the network.|
    |`--rpc-methods` | Specifies the RPC methods to allow. The `Unsafe` setting allows unsafe communication methods because this blockchain is not being used in a production setting.|
    |`--name` | Specifies a human-readable name for the node that you can view in the telemetry user interface.|
    
    For more information about the command-line options that are available for the node template, see the usage help by running the following command:
    
    `./target/release/node-template --help`
    
1. Verify that you see output similar to the following:
    
    ```bash
    2021-11-03 15:32:14 Substrate Node    
    2021-11-03 15:32:14 ✌️  version 3.0.0-monthly-2021-09+1-bf52814-x86_64-macos    
    2021-11-03 15:32:14 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2021    
    2021-11-03 15:32:14 📋 Chain specification: My Custom Testnet    
    2021-11-03 15:32:14 🏷 Node name: MyNode01    
    2021-11-03 15:32:14 👤 Role: AUTHORITY    
    2021-11-03 15:32:14 💾 Database: RocksDb at /tmp/node01/chains/local_testnet/db    
    2021-11-03 15:32:14 ⛓  Native runtime: node-template-100 (node-template-1.tx1.au1)    
    2021-11-03 15:32:15 🔨 Initializing Genesis block/state (state: 0x2bde…8f66, header-hash: 0x6c78…37de)    
    2021-11-03 15:32:15 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.    
    2021-11-03 15:32:15 ⏱  Loaded block-time = 6s from block 0x6c78abc724f83285d1487ddcb1f948a2773cb38219c4674f84c727833be737de    
    2021-11-03 15:32:15 Using default protocol ID "sup" because none is configured in the chain specs    
    2021-11-03 15:32:15 🏷 Local node identity is: 12D3KooWLmrYDLoNTyTYtRdDyZLWDe1paxzxTw5RgjmHLfzW96SX    
    2021-11-03 15:32:15 📦 Highest known block at #0    
    2021-11-03 15:32:15 〽️ Prometheus exporter started at 127.0.0.1:9615    
    2021-11-03 15:32:15 Listening for new connections on 127.0.0.1:9945.    
    2021-11-03 15:32:20 💤 Idle (0 peers), best: #0 (0x6c78…37de), finalized #0 (0x6c78…37de), ⬇ 0 ⬆ 0    
    ```
    
    In the output, take note of the following information:
    
    * The initial or **genesis block** that the node is using is `(state: 0x2bde…8f66, header-hash: 0x6c78…37de)`.
      When you start the next node, verify that these values are the same.

    * The **node identity** is `12D3KooWLmrYDLoNTyTYtRdDyZLWDe1paxzxTw5RgjmHLfzW96SX`.
    
    * The **IP address** is `127.0.0.1`.
    
    * The **peer-to-peer (p2p) port** is `--port = 30333`.
    
    These values are for this specific tutorial example. 
    The values will be different for your node and you must provide the values for your node to other network participants to connect to the bootnode.

## Add keys to the keystore

After you start the first node, no blocks are yet produced. 
The next step is to add two types of keys to the keystore for each node in the network. 

For each node:

* Add the `aura` authority keys to enable [block _production_](/v3/getting-started/glossary#author).

* Add the `grandpa` authority keys to enable [block _finalization_](/v3/getting-started/glossary#finality).

There are several ways you can insert keys into the keystore.
For this tutorial, you can use the `key` subcommand to insert locally-generated secret keys.

To insert keys into the keystore:

1. Open a terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Insert the `aura` secret key generated from the `key` subcommand by running a command similar to the following:
    
    ```bash
    ./target/release/node-template key insert --base-path /tmp/node01 \
    --chain customSpecRaw.json \
    --suri 0x563d22ef5f00e589e07445a3ad88bb92efaa897d7f73a4543d9ac87476434e65 \
    --password-interactive \
    --key-type aura
    ```

    This example uses the secret seed generated from the `key` subcommand into the keystore.
    You can also insert a key from a specified file location.
    For information about the command-line option available, run the following command:
    
    ```bash
    ./target/release/node-template key insert --help
    ```

1. Insert the `grandpa` secret key generated from the `key` subcommand by running a command similar to the following:
    
    ```bash
    ./target/release/node-template key insert --base-path /tmp/node01 \
    --chain customSpecRaw.json \
    --suri 0x563d22ef5f00e589e07445a3ad88bb92efaa897d7f73a4543d9ac87476434e65 \
    --password-interactive \
    --key-type gran
    ```

1. Verify that your keys are in the keystore for `node01` by running the following command:
    
    ```bash
    ls /tmp/node01/chains/local_testnet/keystore
    ```
    
    The command displays output similar to the following:
    
    ```bash
    617572611441ddcb22724420b87ee295c6d47c5adff0ce598c87d3c749b776ba9a647f04
    6772616e1441ddcb22724420b87ee295c6d47c5adff0ce598c87d3c749b776ba9a647f04
    ```

## Enable other participants to join

You can now allow other validators to join the network using the `--bootnodes` and `--validator` command-line options.

To add a second validator to the private network:

1. Open a terminal shell on a second computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Purge old chain data, if needed, by running the following command:
    
    ```bash
    ./target/release/node-template purge-chain --base-path /tmp/node02 --chain local -y
    ```

1. Start a second blockchain node by running the following command:
    
    ```bash
    ./target/release/node-template \
    --base-path /tmp/node02 \
    --chain ./customSpecRaw.json \
    --port 30334 \
    --ws-port 9946 \
    --rpc-port 9934 \
    --telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
    --validator \
    --rpc-methods Unsafe \
    --name MyNode02 \
    --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWLmrYDLoNTyTYtRdDyZLWDe1paxzxTw5RgjmHLfzW96SX
    ```
    
    Be sure to set the correct `bootnode` identifier in the command.
    
    If you don't set the correct `bootnode` identifier, you see errors like this: 
    
    `💔 The bootnode you want to connect to at ... provided a different peer ID than the one you expect: ...`
    
    Note that the command includes the `base-path` and `name` command-line options plus an additional `validator` option to specify that this node is a validator for the private network.
    Also note that all validators must be using _identical chain specifications_ to peer.

1. Add the `aura` secret key generated from the `key` subcommand by running a command similar to the following:
    
    ```bash
    ./target/release/node-template key insert --base-path /tmp/node02 \
    --chain customSpecRaw.json \
    --suri  0x0087016ebbdcf03d1b7b2ad9a958e14a43f2351cd42f2f0a973771b90fb0112f \
    --password-interactive \
    --key-type aura
    ```

    Note that this command uses the second participant's secret key and that the `aura` key type is required to enable block production.

1. Add the `grandpa` secret key generated from the `key` subcommand to the local keystore by running a command similar to the following:
    
    ```bash
    ./target/release/node-template key insert --base-path /tmp/node02 \
    --chain customSpecRaw.json \
    --suri  0x0087016ebbdcf03d1b7b2ad9a958e14a43f2351cd42f2f0a973771b90fb0112f \
    --password-interactive \
    --key-type gran
    ```

    Note that this command uses the second participant's secret key and that the `gran` key type is required to enable block finalization.
    
    Block finalization requires at least two-thirds of the validators to add their keys to their respective keystores. 
    Because this network is configured with two validators in the chain specification, block finalization starts after the second node has added its keys.

1. Verify that your keys are in the keystore for `node02` by running the following command:
    
    ```bash
    ls /tmp/node02/chains/local_testnet/keystore
    ```
    
    The command displays output similar to the following:
    
    ```bash
    617572611a4cc824f6585859851f818e71ac63cf6fdc81018189809814677b2a4699cf45
    6772616e1a4cc824f6585859851f818e71ac63cf6fdc81018189809814677b2a4699cf45  
    ```

    Substrate nodes require a restart after inserting a `grandpa` key, so you must shut down and restart nodes before you see blocks being finalized.

1. Shut down the node by pressing Control-c.

1. Restart the second blockchain node by running the following command:
    
    ```bash
    ./target/release/node-template \
    --base-path /tmp/node02 \
    --chain ./customSpecRaw.json \
    --port 30334 \
    --ws-port 9946 \
    --rpc-port 9934 \
    --telemetry-url 'wss://telemetry.polkadot.io/submit/ 0' \
    --validator \
    --rpc-methods Unsafe \
    --name MyNode02 \
    --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWLmrYDLoNTyTYtRdDyZLWDe1paxzxTw5RgjmHLfzW96SX
    ```
    
    Note that the command includes the `base-path` and `name` command-line options plus an additional `validator` option to specify that this node is a validator for the private network.
    Also note that all validators must be using _identical chain specifications_ to peer.
    
    Be sure to set the correct `bootnode` identifier in the command.
    If you don't set the correct `bootnode` identifier, you see errors like this: 
    
    `💔 The bootnode you want to connect to at ... provided a different peer ID than the one you expect: ...`
    
    After both nodes have added their keys to their respective keystores and been restarted, you should see the same genesis block and state root hashes.
    
    You should also see that each node has one peer (`1 peers`), and they have produced a block proposal (`best: #2 (0xe111…c084)`).
    After a few seconds, you should see new blocks being finalized.
    
    ```bash
    
    ```

## Next steps

You have now seen how you can start a private blockchain with trusted participants.

In this tutorial you learned:

* How to start and stop peer blockchain nodes.

* How to generate your own secret key pairs.

* How to create a custom chain specification that uses the keys you generated.

* How to add validators to a private network that uses your custom chain specification.

To learn more about the topics introduced in this tutorial, see the following sections:

* [Executor](/v3/advanced/executor) for more information about the WebAssembly runtime that is a core component of the chain specification.

* [Accounts](https://wiki.polkadot.network/docs/learn-accounts) and [Key management](https://wiki.polkadot.network/docs/learn-account-generation) for more information about key generation and storage options.

* [Cryptography](https://docs.substrate.io/v3/advanced/cryptography/) for more information about the signature schemes used for different keys.

<!-- TODO link to the followup tutorial about starting a 3 node network using the demo substrate node
Details in https://github.com/substrate-developer-hub/tutorials/issues/16 -->
