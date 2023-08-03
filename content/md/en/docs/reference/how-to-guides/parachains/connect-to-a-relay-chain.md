---
title: Connect to a relay chain
difficulty: 1
keywords:
  - collator
  - parachain
  - parathread
  - upgrade
  - cumulus
  - storage
  - migration
  - paraid
  - register
  - launch
---

This guide summarizes how to connect a parachain to a relay chain.
It is intended to be a quick reference for when you are ready to deploy a parachain on a test or production network and have already performed similar steps in a local testing environment.
If you haven't previously set up a local relay chain and connected a parachain to it, you should follow the steps in [Prepare a local relay chain](/tutorials/build-a-parachain/prepare-a-local-relay-chain/) and [Connect a local parachain](/tutorials/build-a-parachain/connect-a-local-parachain/) before using this guide.

The guide highlights the following topics:

- How to obtain a unique identifier for your parachain
- How to register a parachain
- How to obtain a parachain slot

Before you can secure a slot on a relay chain, you must prepare some information about the parachain and provide this information to the relay chain that you want to connect to.

To prepare a parachain for connecting to a relay chain, you must successfully complete the following steps:

- Reserve a unique identifier on the specific relay chain that you want to connect to.
- Compile the WebAssembly runtime binary.
- Generate the genesis state from the chain specification for the parachain.

After you complete these steps to register the parachain for a specific relay chain, you can request a slot on that relay chain to add your parachain to the network.
For testing purposes, you can acquire a slot on the relay chain using the Sudo pallet.
For production networks, you can acquire a slot through auctions and crowdloans.
After you secure a slot on a relay chain, the parachain can start producing blocks.

## Reserve a unique identifier

You must have a unique identifier for a specific relay chain before you can perform any operation that involves your parachain or parathread.
For example, you must have a unique identifier to load the WebAssembly blob, register the genesis state, create messaging channels to other parachains, or start a crowdloan.

To reserve an identifier:

1. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/) in a web browser and connect to the WebSocket port for your running parachain node.

2. Click **Network** and select **Parachains**. 

3. Click **Parathreads**, then click **+ParaID**.
   
   ![Reserve a `ParaID`](/media/images/docs/tutorials/parachains/paraid-reserve.png)

4. Submit a transaction to reserve the **ParaID** for the relay chain that you want to connect to. 
   
   The transaction requires a deposit.
   The account you use to reserve the identifier is charged for the transaction and will be the origin account for the parathread associated with the identifier.

   Note that the identifier can only be used with for the relay chain you are registering with and that you must specify the identifier to complete additional steps.

## Customize the parachain specification

You must configure the chain specification for your parachain to use the identifier you have reserved.
To perform this task, you must:

- Generate the chain specification as a plain text JSON file.
- Modify the chain specification in a text editor.
- Generate the modified chain specification in raw format.

To create the custom chain specification:

1. Generate the plain chain specification by running a command similar to the following:
   
   ```text
   ./target/release/parachain-template-node build-spec --disable-default-bootnode > rococo-local-parachain-plain.json
   ```

   The command in this example assumes that `rococo-local` is the relay chain you have registered with in the  `node/chan_spec.rs` file.

2. Open the plain text chain specification file in a text editor and set the `ParaID` to the `ParaID` you previously reserved.
   
   For example, open the  `rococo-local-parachain-plain.json` file and modify two fields:
   
   ```text
  // --snip--
  "para_id": <your-reserved-identifier> ,
  // --snip--
      "parachainInfo": {
        "parachainId": <your-reserved-identifier> 
      },
  // --snip--
  ```

3. Generate the raw chain specification from your modified chain specification file by running a command similar to the following:
   
   ```text
   ./target/release/parachain-template-node build-spec \
     --chain rococo-local-parachain-plain.json \
     --raw \
     --disable-default-bootnode > rococo-local-parachain-raw.json
     ```

## Save and distribute the raw chain specification

If you intend to let others connect to your network, you must build and distribute a deterministic runtime build for your network.
For inforamtion about how to build a deterministic runtime, see [Build a deterministic runtime](/build/build-a-deterministic-runtime/).

By convention, chain specifications are in a `/chain-specs` folder that is published in the codebase fot your node.
For example:

- Polkadot includes these **relay chain** chain specifications under [node/service/chain-specs](https://github.com/paritytech/polkadot/tree/master/node/service/chain-specs)
- Cumulus includes these **parachain** chain specifications under [chain-specs](https://github.com/paritytech/cumulus/tree/master/polkadot-parachains/chain-specs).

It is good practice to commit the raw chain specification into your source before proceeding.

## Obtain the WebAssembly runtime validation function

The relay chain also needs the parachain-specific runtime validation logic to validate parachain blocks.
You can run the `export-genesis-wasm` command on a parachain collator node to produce this WebAssembly blob.
For example:

```bash
./target/release/parachain-template-node export-genesis-wasm --chain rococo-local-parachain-raw.json > para-wasm
```

## Generate a parachain genesis state

To register a parachain, the relay chain needs to know the [genesis state](/build/chain-spec#the-genesis-state) for the parachain.
You can run the `export-genesis-state` command on a parachain collator node to produce the hex-encoded genesis state for the parachain.
For example:

```bash
./target/release/parachain-template-node export-genesis-state --chain parachain-raw.json > para-genesis
```

## Start the collators

You are now ready to start a collator node with a command similar to the following:

```text
parachain-collator \
--alice \
--collator \
--force-authoring \
--chain parachain-raw.json \
--base-path /tmp/parachain/alice \
--port 40333 \
--rpc-port 8844 \
-- \
--execution wasm \
--chain <relay-chain-spec-json> \
--port 30343 \
--rpc-port 9977
```

In this command, the arguments passed before the lone `--` argument are for the parachain collator.
The arguments after the `--` are for the embedded relay chain node.
Note that the relay chain specification should be the chain specification for relay chain you have registered with. 

You should see the collator running and peering with relay chain nodes.
However, the parachain won't be authoring parachain blocks yet.
Authoring begins after the collator is registered on the relay chain.

## Parachain registration

Depending on your target relay chain and the authorities there, you have options to register.
Typically, you use Sudo transactions for testing and parachain [auctions](https://wiki.polkadot.network/docs/learn-auction) and [crowdloans](https://wiki.polkadot.network/docs/learn-crowdloans) for production.

This guide only covers the using Sudo transactions.

### Registration deposit calculation

Optionally, you can calculate the exact formulas for deposit calculation for Polkadot runtimes in the function:

```rust
pub const fn deposit(items: u32, bytes: u32) -> Balance {}
```

You can find this function for each relay chain in the Polkadot repository.
For example:

- [Kusama](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/constants/src/lib.rs)
- [Polkadot](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/constants/src/lib.rs)
- [Rococo](https://github.com/paritytech/polkadot/blob/master/runtime/rococo/constants/src/lib.rs)
- [Westend](https://github.com/paritytech/polkadot/blob/master/runtime/westend/constants/src/lib.rs)

### Register using sudo

To register the parachain on the relay chain using a `sudo` call.

1. Open [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/explorer) in a browser and connect to the target relay chain.

1. Click **Developer** and select **Sudo**.

5. Select **paraSudoWrapper**, then select **sudoScheduleParaInitialize(id, genesis)** to initialize the reserved identifier at the start of the next relay chain session.

   For the transaction parameters:

   - `id`: Type your reserved `ParaId`. 

   - `genesisHead`: Click **file upload** and upload the genesis state you exported for the parachain. 
     For this tutorial, select the `para-2000-genesis` file.
  
   - `validationCode`: Click **file upload** and upload the WebAssembly runtime you exported for the parachain
     For this tutorial, select the `para-2000-wasm` file.
     
   - `paraKind`: Select **Yes**.
  
   ![Set parameters for registration](/media/images/docs/tutorials/parachains/register-with-sudo.png)

1. Verify the transaction is successful by clicking **Network** and selecting **Explorer** to view the `sudo.Sudid` _and_ `paras.PvfCheckAccepted` events in the list of recent events.

### Registering using a slot lease

You can also use a Sudo transaction to force a slot lease.

To force a slot lease:

1. Open [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/explorer) in a browser and connect to the target relay chain.

1. Click **Developer** and select **Sudo**.

2. Select **slots** then select **forceLease(para, leaser, amount, period_begin, period_end)**.
   
   ![Sudo transaction to force a slot lease](/media/images/docs/tutorials/parachains/forceLease.png)

   For the transaction parameters:
   
   - `period_begin`: Specify the slot you want to start with. For example, the active slot `0` in a test environment.
  
   - `period_end`: Specify a slot beyond the time you have set aside for testing the parachain.
     If you want to test onboarding and offboarding, you should select slot leases that have gaps.
    
   After the parachain is onboarded and block production starts, you should see information similar to the following for your parachain:
   
   ![View information about the parachain](/media/images/docs/tutorials/parachains/parachain-active-lease.png)

## Block production and finalization

The collator should start producing parachain blocks after the registration is successful and a new relay chain epoch has begun.

> It can take a while for a new epoch to begin.

You can keep track of the parachains that are registered and their latest head data in the Polkadot/substrate Portal by clicking **Network** and selecting **Parachains**.

## Examples

- [Prepare a local relay chain](/tutorials/build-a-parachain/prepare-a-local-relay-chain)
- [Connect a local parachain](/tutorials/build-a-parachain/connect-a-local-parachain/)
- [Acquire a testnet slot](/tutorials/build-a-parachain/acquire-a-testnet-slot/)
