---
title: Connect a local parachain
description: Demonstrates how to deploy a parachain by connecting to a local relay chain.
keywords:
  - parachain
  - testnet
  - local
  - collator
  - chain specification
---

This tutorial illustrates how to connect a local parachain to a local relay chain.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Register a unique identifier—called the `ParaID`—for a parachain to enable a connection to the local relay chain.
- Start block production for the parachain.

## Before you begin

Before you begin, verify the following:

- You have configured a local relay chain with two validators as described in [Prepare a local relay chain](/tutorials/connect-other-chains/prepare-a-local-relay-chain/).

- You are aware that parachain versions and dependencies are tightly coupled with the version of the relay chain they connect to and know the software version you used to configure the relay chain.
  
  Tutorials generally use the latest Polkadot branch to demonstrate features.
  If a tutorial doesn't work as expected, you should check whether you have the latest Polkadot branch in your local environment and update your local software, if needed.

## Build the parachain template

This tutorial uses the [Substrate parachain template](https://github.com/substrate-developer-hub/substrate-parachain-template) to illustrate how to launch a parachain that connects to a local relay chain.
The parachain template is similar to the [node template](https://github.com/substrate-developer-hub/substrate-node-template) used in solo chain development.
You can also use the parachain template as the starting point for developing a custom parachain project.

To build the parachain template:

1. Open a new terminal shell on your computer, if needed.

2. Clone the branch of the `substrate-parachain-template` repository that matches the release branch you used to configure the relay chain.
   
   For example, if you used the `release-v0.9.28` Polkadot release branch to configure the local relay chain, use the `polkadot-v0.9.28` branch for the parachain template.
   
   ```bash
   git clone --depth 1 --branch polkadot-v0.9.28 https://github.com/substrate-developer-hub/substrate-parachain-template.git
   ```

1. Change to the root of the parachain template directory by running the following command:

   ```bash
   cd substrate-parachain-template
   ```

   You now have a detached branch.
   If you want to save your changes and make this branch easy to identify you can create a new branch by running a command similar to the following:

   ```bash
   git switch -c my-branch-v0.9.28
   ```

3. Build the parachain template collator by running the following command:

   ```bash
   cargo build --release
   ```
   
   Compiling the node can take up to 60 minutes, depending on your hardware and software configuration.

## Reserve a unique identifier

Every parachain must reserve a unique identifier—the `ParaID`—that enables it to connect to its specific relay chain.
Each relay chain manages its own set of unique identifiers for the parachains that connect to it. 
The identifier is referred to as a `ParaID` because the same identifier can be used to identify a slot occupied by a [parachain](https://wiki.polkadot.network/docs/learn-parachains) or to identify a slot occupied by a [parathread](https://wiki.polkadot.network/docs/learn-parathreads).

You should note that you must have an account with sufficient funds to reserve a slot on a relay chain.
You can determine the number of tokens a specific relay chain requires by checking the `ParaDeposit` configuration in the `paras_registrar` pallet for that relay chain.
For example, Rococo requires 5 ROC to reserve an identifier:

```rust
parameter_types! {
	pub const ParaDeposit: Balance = 5 * DOLLARS;
	pub const DataDepositPerByte: Balance = deposit(0, 1);
}

impl paras_registrar::Config for Runtime {
	type Event = Event;
	type Origin = Origin;
	type Currency = Balances;
	type OnSwap = (Crowdloan, Slots);
	type ParaDeposit = ParaDeposit;
	type DataDepositPerByte = DataDepositPerByte;
	type WeightInfo = weights::runtime_common_paras_registrar::WeightInfo<Runtime>;
}
```

Each relay chain allots its own identifiers by incrementing the identifier starting at `2000` for all chains that are not [common good parachains](https://wiki.polkadot.network/docs/learn-common-goods).
Common good chains use a different method to allocate slot identifiers.

To reserve a parachain identifier:

1. Validate your local relay chain validators are running.
   
2. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/parachains/parathreads) in a browser.
   
3. Connect to a local relay chain node.
   
4. Click **Network** and select **Parachains**.
   
   ![Navigate to Parachains](/media/images/docs/tutorials/parachain/network-parachains.png)

5. Click **Parathreads**, then click **ParaId**.
   
   ![Reserve an identifier](/media/images/docs/tutorials/parachain/parathread-paraid.png)

6. Review the settings for the transaction to reserve a ParaId, then click **Submit**.
   
   The account used to reserve the identifier will be the account charged for the transaction and will the origin account for the parathread associated with the identifier.

7. Click **Sign and Submit** to authorize the transaction.
   
   After you submit the transaction, click **Network** and select **Explorer**.
   
8. Check the list of recent events for successful `registrar.Reserved` and click the event to see details about the transaction.
   
   ![View your reserved identifier](/media/images/docs/tutorials/parachain/paraid-registration-event.png)
   
   You are now ready to generate the files required for your parachain using the reserved identifier (`paraId` `2000`).

## Modify the default chain specification

To register your parachain with the local relay chain, you must modify the default chain specification to use the parachain identifier you have reserved.

1. Generate the plain text chain specification for the parachain template node by running the following command:
   
   ```bash
   ./target/release/parachain-template-node build-spec > plain-parachain-chainspec.json
   ```

1. Open the plain text chain specification for the parachain template node in a text editor.

1. Set the `bootNodes` to use the local relay chain validator nodes.
   
   For example:

   ```json
   {
    "name": "Local Parachain Testnet",
    "id": "local_testnet",
    "chainType": "Local",
    "bootNodes": [
       "/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWKaWYB1xeCJFQdGSqsJPWkqUCJJXUYdKPwSY161GM8brY"
    ],
    ...
   }
   ```

2. Set the `para_id` to the parachain identifier that you previously reserved.
   
   For example, if your reserved identifier is `2000`, set the `para_id` field to `2000`:
   
   ```json
   ...
   "relay_chain": "rococo-local",
   "para_id": 2000,
   "codeSubstitutes": {},
   "genesis": {
      ...
   }
   ```

3. Set the `parachainId` to the parachain identifier that you previously reserved.
   
   For example, if your reserved identifier is `2000`, set the `para_id` field to `2000`:
   
   ```json
   ...
      "parachainSystem": null,
      "parachainInfo": {
        "parachainId": 2000
      },
   ...
   ```

4. Save your changes and close the plain text chain specification file.
   
5. Generate a raw chain specification file from the modified chain specification file by running the following command:
   
   ```bash
   ./target/release/parachain-template-node build-spec --chain plain-parachain-chainspec.json --disable-default-bootnode --raw > raw-parachain-chainspec.json
   ```

   The command generates a new raw chain specification file with two collators.

   ```text
   2022-08-30 13:00:50 Building chain spec    
   2022-08-30 13:00:50 assembling new collators for new session 0 at #0    
   2022-08-30 13:00:50 assembling new collators for new session 1 at #0
   ```    

## Prepare the parachain collator

With the local relay chain running and the raw chain specification for the parachain template updated, you are ready to start the parachain collator node and export information about its runtime and genesis state.

To prepare the parachain collator to be registered:

1. Export the WebAssembly runtime for the parachain.
   
   The relay chain needs the parachain-specific runtime validation logic to validate parachain blocks.
   You can export the WebAssembly runtime for a parachain collator node by running a command similar to the following:

   ```bash
   ./target/release/parachain-template-node export-genesis-wasm --chain raw-parachain-chainspec.json para-2000-wasm
   ```

2. Generate a parachain genesis state.
   
   To register a parachain, the relay chain needs to know the parachain's genesis state.
   You can export the entire genesis state—hex-encoded—to a file by running a command similar to the following:
   
   ```bash
   ./target/release/parachain-template-node export-genesis-state --chain raw-parachain-chainspec.json para-2000-genesis-state
   ```
   
   You should note that the runtime and state you export must be for the _genesis_ block.
   You can't connect a parachain with any previous state to a relay chain. 
   All parachains must start from block 0 on the relay chain.
   See the guide on [converting a solo chain to a parachain](/reference/how-to-guides/parachains/convert-a-solo-chain/) for details on how the parachain template was created and how to convert your chain's logic—not its history or state migrations—to a parachain.

3. Start a collator node with a command similar to the following:
   
   ```bash
   ./target/release/parachain-template-node \
   --alice \
   --collator \
   --force-authoring \
   --chain raw-parachain-chainspec.json \
   --base-path /tmp/parachain/alice \
   --port 40333 \
   --ws-port 8844 \
   -- \
   --execution wasm \
   --chain /tmp/raw-local-chainspec.json \
   --port 30343 \
   --ws-port 9977
   ```
   
   In this command, the arguments passed before the lone `--` argument are for the parachain template collator.
   The arguments after the `--` are for the embedded relay chain node.
   Notice that this command specifies both the raw chain specification for the parachain and the raw chain specification for the relay chain.
   In this example, the raw chain specification for the local relay chain is located in `/tmp/raw-local-chainspec.json`.
   Be sure the second `--chain` command-line specifies the path to the raw chain specification for your local relay chain.

   If you start another node for the parachain, you would use the same relay chain specification file, but a different base path and port numbers.
   
   In the terminal where you started the parachain template node, you should see output similar to the following:
   
   ```bash
   2022-08-30 13:49:17 Parachain Collator Template    
   2022-08-30 13:49:17 ✌️  version 0.1.0-fd9771eed9c    
   2022-08-30 13:49:17 ❤️  by Anonymous, 2020-2022    
   2022-08-30 13:49:17 📋 Chain specification: Local Parachain Testnet    
   2022-08-30 13:49:17 🏷  Node name: Alice    
   2022-08-30 13:49:17 👤 Role: AUTHORITY    
   2022-08-30 13:49:17 💾 Database: RocksDb at /tmp/parachain/alice/chains/local_testnet/db/full    
   2022-08-30 13:49:17 ⛓  Native runtime: template-parachain-1 (template-parachain-0.tx1.au1)
   2022-08-30 13:51:58 Parachain id: Id(2000)    
   2022-08-30 13:51:58 Parachain Account: 5Ec4AhPUwPeyTFyuhGuBbD224mY85LKLMSqSSo33JYWCazU4    
   2022-08-30 13:51:58 Parachain genesis state: 0x0000000000000000000000000000000000000000000000000000000000000000003c28ac319eab2cac949139fd0376f16bc97f698d1cde1bc3f46c2ec0edd1b9fb03170a2e7597b7b7e3d84c05391d139a62b157e78786d8c082f29dcf4c11131400    
   2022-08-30 13:51:58 Is collating: yes    
   2022-08-30 13:52:00 [Relaychain] 🏷  Local node identity is: 12D3KooWNNP9Z1D86KKgrzht6Pvd3WjKqxQaNkC6HpW5wVTUEEKR
   ...
   ```
   
   You should see the template collator node running as a standalone node and its relay node connecting as a peer with the local relay chain validator nodes.
   If you don't see the embedded relay chain peering with local relay chain node, try disabling your firewall or adding the `bootnodes` parameter with the relay node's address.
   
   It has not started authoring parachain blocks yet.
   Authoring will begin when the collator is actually **registered on the relay chain**.

## Register with the local relay chain

With the local relay chain and collator node running, you are ready to register the parachain on the local relay chain. 
In a live public network, registration typically involves a [parachain auction](https://wiki.polkadot.network/docs/en/learn-auction).
For this tutorial and local testing, you can use a Sudo transaction and the Polkadot/Substrate Portal.
Using a Sudo transactin enable you to bypass the steps required to acquire a parachain or parathread slot.

To register the parachain:

1. Validate your local relay chain validators are running.
   
2. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/parachains/parathreads) in a browser.
   
3. Connect to a local relay chain node, if needed.
   
4. Click **Developer** and select **Sudo**.
   
   ![Select Sudo to register a parachain](/media/images/docs/tutorials/parachain/developer-sudo.png)

5. Select **paraSudoWrapper**, then select **sudoScheduleParaInitialize(id, genesis)** to initialize the reserved paraID at the start of the next relay chain session.

   For the transaction parameters:

   - `id`: Type your reserved `ParaId`. 
     For this tutorial, the reserved identifier is 2000.

   - `genesisHead`: Click **file upload** and upload the genesis state you exported for the parachain. 
     For this tutorial, select the `para-2000-genesis` file.
  
   - `validationCode`: Click **file upload** and upload the WebAssembly runtime you exported for the parachain
     For this tutorial, select the `para-2000-wasm` file.
     
   - `parachain`: Select **Yes**.
  
   ![parachain-registration-sudo.png](/media/images/docs/tutorials/parachain/parachain-registration-sudo.png)  

6. Click **Submit Sudo**.
   
7. Review the transaction details, then click **Sign and Submit** to authorize the transaction.
   
   After you submit the transaction, click **Network** and select **Explorer**.

8. Check the list of recent events for successful `sudo.Suid` and click the event to see details about the transaction.
   
   ![View the Sudo registration](/media/images/docs/tutorials/parachain/sudo-registration-event.png)

   After the parachain is initialized, you can see it in the Polkadot/Substrate Portal byt clicking **Network**, then selecting **Parachains**.

  ![View the parachain](/media/images/docs/tutorials/parachain/view-parachain.png)

### Block finalization

The relay chain tracks the latest block (the head) of each parachain.
When a relay chain block is finalized, every parachain blocks that have completed the [validation process](https://polkadot.network/the-path-of-a-parachain-block) are also finalized.
This is how Polkadot achieves **pooled, shared security** for its parachains!

You can see the registered parachains and their latest data by clicking **Network** > **Parachains** in the Apps UI.

![parachain-summary-screenshot.png](/media/images/docs/tutorials/09-cumulus/parachain-summary-screenshot.png)

## Interact with your parachain

The entire point of launching and registering parachains is that we can submit transactions to the parachains and interact with them.
We are finally ready to submit extrinsics on our parachains!

### Connecting with the Apps UI

We've already connected the Apps UI to the relay chain node.
Now we can also connect to the parachain collator.
Open another instance of Apps UI in a new browser window, and connect it to the appropriate endpoint.
If you have followed this tutorial so far, you can connect to the parachain node at:

https://polkadot.js.org/apps/?rpc=ws%3A%2F%2Flocalhost%3A8844#/

### Submit extrinsics

You can make some simple token transfers to ensure that the parachain is operating normally.
You can also make some on-chain remarks by going to the `Extrinsics` page, choosing `System` pallet and `remark` extrinsic.

If the transaction go through as expected, you have a working parachain.

**_Congratulations!_**

Read on for more optional material.

#### Cross-chain Message Passing (XCMP)

The defining feature of connecting parachains to a _common_ relay chain is the ability to communicate _between_ all connected chains.
This area of functionality is at the cutting edge development and is not included in this tutorial.

To learn more about XCMP, refer to [Polkadot wiki on XCMP](https://wiki.polkadot.network/docs/en/learn-crosschain).

<!-- TODO NAV.YML -->
<!-- add info on and link to /tutorials/connect-other-chains/xcm/ page implemented and referenced here-->

## Chain purging

Your sole collator is the **only home of the parachain blockchain data** as there is only one node on your entire parachain network.
Relay chains only store parachains header information.
**If the parachain data is lost, you will not be able to recover the chain.**
In testing though, you may need to start things from scratch.

To purge your parachain chain data from the relay chain, you need to deregister and re-register the parachain collator.
It may be easier in testing to instead just purge the relay and parachains and start again form genesis.
You can purge all chain data for all chains by running the following commands:

```bash
# Purge the collator(s)
./target/release/parachain-collator purge-chain \
  --base-path <your collator DB path set above>

# Purge the validator(s)
polkadot purge-chain \
  --base-path <your relay chain DB path set above>
```

Then register from a blank slate again.

## Next steps

- Learn more about collators on the [Polkadot Wiki](https://wiki.polkadot.network/docs/learn-collator).
- [Add more parachain nodes](/reference/how-to-guides/parachains/add-paranodes/) to your parachain network.
- Very rigorously [Test](/test/) your local parachain network.
- Connect your parachain to rococo by getting a [Rococo testnet slot](/tutorials/connect-other-chains/acquire-a-testnet-slot/).
- See the guide on [converting a solo chain to a parachain](/reference/how-to-guides/parachains/convert-a-solo-chain/) to convert your chain's logic-not state or running-chain migrations-to a parachain.
