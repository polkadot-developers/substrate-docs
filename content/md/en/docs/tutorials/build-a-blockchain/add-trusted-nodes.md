---
title: Add trusted nodes
description: Generate account keys and a custom chain specification for a private blockchain network.
keywords:
  - enterprize
  - private
  - permission
---

This tutorial illustrates how you can start a small, standalone blockchain network with an **authority set** of private **validators**.

As you learned in [Blockchain basics](/learn/blockchain-basics/), all blockchains require the nodes in the network to agree on the state of data at any specific point in time and this agreement about the state is called **consensus**.

The Substrate node template uses a proof of authority consensus model also referred to as **authority round** or **Aura** consensus.
The Aura consensus protocol limits block production to a rotating list of authorized accounts.
The authorized accounts—**authorities**—create blocks in a round robin fashion and are generally considered to be trusted participants in the network.

This consensus model provides a simple approach to starting a solo blockchain for a limited number of participants.
In this tutorial, you'll see how to generate the keys required to authorize a node to participate in the network, how to configure and share information about the network with other authorized accounts, and how to launch the network with an approved set of validators.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have completed [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/) and have the Substrate node template installed locally.

- You have used predefined accounts as described in [Simulate a network](/tutorials/build-a-blockchain/simulate-network/) to start nodes on a single computer.

- You are generally familiar with software development and using command-line interfaces.

- You are generally familiar with blockchains and smart contract platforms.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Generate key pairs for use as a network authority.

- Create a custom chain specification file.

- Launch a private two-node blockchain network.

## Generate your account and keys

In [Simulate a network](/tutorials/build-a-blockchain/simulate-network/), you started peer nodes using predefined accounts and keys.
For this tutorial, you generate your own secret keys for the validator nodes in the network.
It's important to remember that each participant in the blockchain network is responsible for generating unique keys.

For the most part, an "account" and "keys" are interchangeable terms; the keys you generate identify the account you have. Keys can also be derived deterministically based on a couple of inputs, namely a **secret phrase** and, optionally, an additional **password**. Using these inputs, you can use one of several **schemes** to derive the actual keys (`sr25519` or `ed25519` being the most common schemes). You'll see this in action when we generate keys for different purposes to be used by your blockchain node.

### Key generation options

There are several ways you can generate keys.
For example, you can generate key pairs using a `node-template` subcommand, the standalone [subkey](/reference/command-line-tools/subkey/) command-line program, the Polkadot-JS application, or third-party key generation utilities.

Although you could use predefined key pairs to complete this tutorial, you would never use those keys in a production environment.
Instead of using predefined keys or the more secure `subkey` program, this tutorial illustrates how to generate keys using the Substrate node template and the `key` subcommand.

### Generate local keys using the node template

As a best practice, you should use an air-gapped computer that has never been connected to the internet when you generate keys for a production blockchain.
At a minimum, you should disconnect from the internet before you generate any keys you intend to use on a public or private blockchain that is not under your control.

However, for this tutorial, you can use the `node-template` command-line options to generate random keys locally, while remaining connected to the internet.

To generate keys using the node template:

1. Open a terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Generate a random secret phrase and keys by running the following command:

   ```bash
   ./target/release/node-template key generate --scheme sr25519 --password-interactive
   ```

1. Type a password for the generated keys.

   The command generates keys and displays output similar to the following:

   ```text
   Secret phrase:  pig giraffe ceiling enter weird liar orange decline behind total despair fly
   Secret seed:       0x0087016ebbdcf03d1b7b2ad9a958e14a43f2351cd42f2f0a973771b90fb0112f
   Public key (hex):  0x1a4cc824f6585859851f818e71ac63cf6fdc81018189809814677b2a4699cf45
   Account ID:        0x1a4cc824f6585859851f818e71ac63cf6fdc81018189809814677b2a4699cf45
   Public key (SS58): 5CfBuoHDvZ4fd8jkLQicNL8tgjnK8pVG9AiuJrsNrRAx6CNW
   SS58 Address:      5CfBuoHDvZ4fd8jkLQicNL8tgjnK8pVG9AiuJrsNrRAx6CNW
   ```

   You now have the Sr25519 key for producing blocks using `aura` for one node.
   In this example, the Sr25519 public key for the account is `5CfBuoHDvZ4fd8jkLQicNL8tgjnK8pVG9AiuJrsNrRAx6CNW`.

1. Next, use the **secret phrase** for the account you just generated to derive keys using the Ed25519 signature scheme, which you'll need for the `grandpa` [pallet](/reference/frame-pallets/).

   For example, run a command similar to the following:

   ```bash
   ./target/release/node-template key inspect --password-interactive --scheme ed25519 "pig giraffe ceiling enter weird liar orange decline behind total despair fly"
   ```

1. Type the password you used to generate the keys.

   The command displays output similar to the following:

   ```text
   Secret phrase `pig giraffe ceiling enter weird liar orange decline behind total despair fly` is account:
   Secret seed:       0x0087016ebbdcf03d1b7b2ad9a958e14a43f2351cd42f2f0a973771b90fb0112f
   Public key (hex):  0x2577ba03f47cdbea161851d737e41200e471cd7a31a5c88242a527837efc1e7b
   Public key (SS58): 5CuqCGfwqhjGzSqz5mnq36tMe651mU9Ji8xQ4JRuUTvPcjVN
   Account ID:        0x2577ba03f47cdbea161851d737e41200e471cd7a31a5c88242a527837efc1e7b
   SS58 Address:      5CuqCGfwqhjGzSqz5mnq36tMe651mU9Ji8xQ4JRuUTvPcjVN
   ```

   You now have the Ed25519 key for finalizing blocks using `grandpa` for one node.
   In this example, the Ed25519 public key for the account is `5CuqCGfwqhjGzSqz5mnq36tMe651mU9Ji8xQ4JRuUTvPcjVN`.

### Generate a second set of keys

For this tutorial, the private network consists of just two nodes, so you need two sets of keys.
You have a few options to continue the tutorial:

- You can use the keys for one of the predefined accounts.

- You can repeat the steps in the previous section using a different identity on your local computer to generate a second key pair.

- You can derive a child key pair to simulate a second identity on your local computer.

- You can recruit other participants to generate the keys required to join your private network.

For illustration purposes, the second set of keys used in this tutorial are:

- Sr25519: 5EJPj83tJuJtTVE2v7B9ehfM7jNT44CBFaPWicvBwYyUKBS6 for `aura`.
- Ed25519: 5FeJQsfmbbJLTH1pvehBxrZrT5kHvJFj84ZaY5LK7NU87gZS for `grandpa`.

## Create a custom chain specification

After you generate the keys to use with your blockchain, you are ready to create a custom **chain specification** using those key pairs then share your custom chain specification with trusted network participants called **validators**.

To enable others to participate in your blockchain network, ensure that they generate their own keys.
After you collect the keys for network participants, you can create a custom chain specification to replace the `local` chain specification.

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

   If you open the `customSpec.json` file in a text editor, you would see that it contains several fields. One of those fields is the WebAssembly (Wasm) binary for the runtime you built using the `cargo build --release` command.
   Because the WebAssembly (Wasm) binary is a large blob, you can preview the first and last few lines to see the fields you need to change.

1. Preview the first few fields in the `customSpec.json` file by running the following command:

   ```bash
   head customSpec.json
   ```

   The command displays the first fields from the file.
   For example:

   ```json
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
   "aura": { "authorities": [
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

- Modify the `aura` section to include **Sr25519** addresses.

- Modify the `grandpa` section to include **Ed25519** addresses and a voting weight.

Be sure to use unique keys for each validator.
If two validators have the same keys, they produce conflicting blocks.

For additional information about working with key pairs and signatures, see [Public-Key cryptography](/learn/cryptography/#public-key-cryptography).

## Convert the chain specification to raw format

After you prepare a chain specification with the validator information, you must convert it into a raw specification format before it can be used.
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

## Prepare to launch the private network

After you distribute the custom chain specification to all network participants, you're ready to launch your own private blockchain.
The steps are similar to the steps you followed in [Start the first blockchain node](/tutorials/build-a-blockchain/simulate-network/#Start-the-first-blockchain-node).
However, if you follow the steps in this tutorial, you'll be able to add multiple computers to your network.

To continue, verify the following:

- You have generated or collected the account keys for at least two authority accounts.
- You have updated your custom chain specification to include the keys for block production (`aura`) and block finalization (`grandpa`).
- You have converted your custom chain specification to raw format and distributed the raw chain specification to the nodes participating in the private network.

If you have completed these steps, you are ready to start the first node in the private blockchain.

## Start the first node

As the first participant in the private blockchain network, you are responsible for starting the first node, called the **bootnode**.

To start the first node:

1. Open a terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Start the first node using the custom chain specification by running a command similar to the following:

   ```bash
   ./target/release/node-template \
      --base-path /tmp/node01 \
      --chain ./customSpecRaw.json \
      --port 30333 \
      --rpc-port 9945 \
      --telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
      --validator \
      --rpc-methods Unsafe \
      --name MyNode01 \
      --password-interactive
   ```
You will be asked for a keystore password, type the password you used to generate the node01 keys.

Note the following command-line options you are using to start the node:

- The `--base-path` command-line option specifies a custom location for the chain associated with this first node.

- The `--chain` command-line option specifies the custom chain specification.

- The `--validator` command-line option indicates that this node is an authority for the chain.

- The `--rpc-methods Unsafe` command-line option allows you to continue the tutorial using an unsafe communication mode because your blockchain is not being used in a production setting.

- The `--name` command-line option enables you to give your node a human-readable name in the telemetry UI.

This command also starts the node using your own keys instead of a predefined account.
Because you aren't using a predefined account with known keys, you'll need to add your keys to the keystore in a separate step.

## View information about node operations

After you start the local node, information about the operations performed is displayed in the terminal shell.
In that terminal, verify that you see output similar to the following:

```text
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

Take note of the following information:

- The output indicates that the chain specification being used is the custom chain specification you created and specified using the `--chain` command-line option.
- The output indicates that the node is an authority because you started the node using the `--validator` command-line option.
- The output shows the **genesis block** being initialized with the block hash `(state: 0x2bde…8f66, header-hash: 0x6c78…37de)`.
- The output specifies the **Local node identity** for your node.
  In this example, the node identity is `12D3KooWLmrYDLoNTyTYtRdDyZLWDe1paxzxTw5RgjmHLfzW96SX`.
- The output specifies the **IP address** used for the node is the local host `127.0.0.1`.

These values are for this specific tutorial example.
The values in your output will be specific to your node and you must provide the values for your node to other network participants to connect to the bootnode.

Now that you have successfully started a validator node using your own keys and taken note of the node identity, you can continue to the next step.
Before you add your keys to the keystore, however, stop the node by pressing Control-c.

## Add keys to the keystore

After you start the first node, no blocks are yet produced.
The next step is to add two types of keys to the keystore for each node in the network.

For each node:

- Add the `aura` authority keys to enable [block _production_](/reference/glossary/#author).

- Add the `grandpa` authority keys to enable [block _finalization_](/reference/glossary/#finality).

There are several ways you can insert keys into the keystore.
For this tutorial, you can use the `key` subcommand to insert locally-generated secret keys.

To insert keys into the keystore:

1. Open a terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Insert the `aura` secret key generated from the `key` subcommand by running a command similar to the following:

   ```bash
   ./target/release/node-template key insert --base-path /tmp/node01 \
      --chain customSpecRaw.json \
      --scheme Sr25519 \
      --suri <your-secret-seed> \
      --password-interactive \
      --key-type aura
   ```

   Replace `<your-secret-seed>` with the secret phrase or secret seed for the first key pair that you generated in [Generate local keys using node template](#generate-local-keys-using-the-node-template).

   In this tutorial, the secret phrase is `pig giraffe ceiling enter weird liar orange decline behind total despair fly`, so the `--suri` command-line option specifies that string to insert the key into the keystore.

   For example:

   ```text
   --suri "pig giraffe ceiling enter weird liar orange decline behind total despair fly"
   ```

   You can also insert a key from a specified file location.
   For information about the command-line options available, run the following command:

   ```bash
   ./target/release/node-template key insert --help
   ```

1. Type the password you used to generate the keys.

1. Insert the `grandpa` secret key generated from the `key` subcommand by running a command similar to the following:

   ```bash
   ./target/release/node-template key insert \
      --base-path /tmp/node01 \
      --chain customSpecRaw.json \
      --scheme Ed25519 \
      --suri <your-secret-key> \
      --password-interactive \
      --key-type gran
   ```

   Replace `<your-secret-seed>` with the secret phrase or secret seed for the first key pair that you generated in [Generate local keys using the node template](#generate-local-keys-using-the-node-template).

   In this tutorial, the secret phrase is `pig giraffe ceiling enter weird liar orange decline behind total despair fly`, so the `--suri` command-line option specifies that string to insert the key into the keystore.
   For example:

   ```text
   --suri "pig giraffe ceiling enter weird liar orange decline behind total despair fly"
   ```

1. Type the password you used to generate the keys.

1. Verify that your keys are in the keystore for `node01` by running the following command:

   ```bash
   ls /tmp/node01/chains/local_testnet/keystore
   ```

   The command displays output similar to the following:

   ```text
   617572617e016f19ab623ba5f487f540017c1edbab06c0b211a16d40531dbd62d94ceb24
   6772616e4ac976937e53fd836512cfd288bb438584ba366cbf9be403a0acd82c1c7c0739
   ```

After you have added your keys to the keystore for the first node under /tmp/node01, you can restart the node using the command you used previously in [Start the first node](#start-the-first-node).

## Enable other participants to join

You can now allow other validators to join the network using the `--bootnodes` and `--validator` command-line options.

To add a second validator to the private network:

1. Open a terminal shell on a second computer.

1. Change to the root directory where you compiled the Substrate node template.

1. Start a second blockchain node by running a command similar to the following:

   ```bash
   ./target/release/node-template \
      --base-path /tmp/node02 \
      --chain ./customSpecRaw.json \
      --port 30334 \
      --rpc-port 9946 \
      --telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
      --validator \
      --rpc-methods Unsafe \
      --name MyNode02 \
      --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWLmrYDLoNTyTYtRdDyZLWDe1paxzxTw5RgjmHLfzW96SX \
      --password-interactive
   ```

   This command uses the `base-path`, `name` and `validator` command-line options to identify this node as a second validator for the private network.
   The `--chain` command-line option specifies the chain specification file to use.
   This file must be _identical_ for all validators in the network.
   Be sure to set the correct information for the `--bootnodes` command-line option.
   In particular, be sure you have specified the local node identifier from the first node in the network.
   If you don't set the correct `bootnode` identifier, you see errors like this:

   ```text
   The bootnode you want to connect to at ... provided a different peer ID than the one you expect: ...
   ```

1. Add the `aura` secret key generated from the `key` subcommand by running a command similar to the following:

   ```bash
   ./target/release/node-template key insert --base-path /tmp/node02 \
      --chain customSpecRaw.json \
      --scheme Sr25519 \
      --suri <second-participant-secret-seed> \
      --password-interactive \
      --key-type aura
   ```

   Replace `<second-participant-secret-seed>` with the secret phrase or secret seed that you generated in [Generate a second key pair](#generate-a-second-set-of-keys).
   The `aura` key type is required to enable block production.

1. Type the password you used to generate the keys.

1. Add the `grandpa` secret key generated from the `key` subcommand to the local keystore by running a command similar to the following:

   ```bash
   ./target/release/node-template key insert --base-path /tmp/node02 \
      --chain customSpecRaw.json \
      --scheme Ed25519 --suri <second-participant-secret-seed> \
      --password-interactive \
      --key-type gran
   ```

   Replace `<second-participant-secret-seed>` with the secret phrase or secret seed that you generated in [Generate a second key pair](#generate-a-second-set-of-keys).
   The `gran` key type is required to enable block finalization.

   Block finalization requires at least two-thirds of the validators to add their keys to their respective keystores.
   Because this network is configured with two validators in the chain specification, block finalization can only start after the second node has added its keys.

1. Type the password you used to generate the keys.

1. Verify that your keys are in the keystore for `node02` by running the following command:

   ```bash
   ls /tmp/node02/chains/local_testnet/keystore
   ```

   The command displays output similar to the following:

   ```text
   617572610a6cadb3d6f55a121de4c89754dd835e634ae83249734dfad01c2fae7e9ac102
   6772616e5f273f61a4910897cec969b598a70a832fb7894ad7c741e2a559617898426f20
   ```

   Substrate nodes require a restart after inserting a `grandpa` key, so you must shut down and restart nodes before you see blocks being finalized.

1. Shut down the node by pressing Control-c.

1. Restart the second blockchain node by running the following command:

   ```bash
   ./target/release/node-template \
      --base-path /tmp/node02 \
      --chain ./customSpecRaw.json \
      --port 30334 \
      --rpc-port 9946 \
      --telemetry-url 'wss://telemetry.polkadot.io/submit/ 0' \
      --validator \
      --rpc-methods Unsafe \
      --name MyNode02 \
      --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWLmrYDLoNTyTYtRdDyZLWDe1paxzxTw5RgjmHLfzW96SX \
      --password-interactive
   ```

   After both nodes have added their keys to their respective keystores—located under `/tmp/node01` and `/tmp/node02`—and been restarted, you should see the same genesis block and state root hashes.

   You should also see that each node has one peer (`1 peers`), and they have produced a block proposal (`best: #2 (0xe111…c084)`).
   After a few seconds, you should see new blocks being finalized on both nodes.

## Next steps

You have now seen how you can start a private blockchain with trusted participants.

In this tutorial you learned:

- How to start and stop peer blockchain nodes.

- How to generate your own secret key pairs.

- How to create a custom chain specification that uses the keys you generated.

- How to add validators to a private network that uses your custom chain specification.

To learn more about the topics introduced in this tutorial, see the following sections:

- [Accounts, addresses, and keys](/learn/accounts-addresses-keys)
- [Chain specification](/build/chain-spec/)
- [subkey](/reference/command-line-tools/subkey/)
- [Cryptography](/learn/cryptography//)

<!-- TODO link to the followup tutorial about starting a 3 node network using the demo substrate node
Details in https://github.com/substrate-developer-hub/tutorials/issues/16 -->
