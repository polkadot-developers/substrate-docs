---
title: Acquire a testnet slot
description: Acquire a slot on a public test network for parachains
keywords:
  - rococo
  - testnet
  - faucet
  - relay chain
---

This tutorial demonstrates how you can deploy a parachain on a public test network, such as the [Rococo](https://wiki.polkadot.network/docs/build-pdk#rococo-testnet) test network.
Public test networks have a higher bar to entry than a private network, but represent an important step in preparing a parachain project to move into a production network. 

## Before you begin

Because Rococo is a shared test network, this tutorial requires additional steps to prepare your environment that aren't required for local testing.
Before you begin, verify the following:

- You know how to generate and modify chain specification files as described in [Add trusted nodes](/tutorials/build-a-blockchain/add-trusted-nodes/).
  
- You know how to generate and store keys as described in [Add trusted nodes](/tutorials/build-a-blockchain/add-trusted-nodes/).
  
- You have completed the [Prepare a local relay chain](/tutorials/build-a-parachain/prepare-a-local-relay-chain/) and [Connect a local parachain](/tutorials/build-a-parachain/connect-a-local-parachain/) tutorials on your local computer.

## Get started with an account and tokens

To perform any action on Rococo, you need ROC tokens and to store the tokens, you must have access to a Substrate-compatible digital currency wallet.
You can't use [development keys and accounts](/reference/command-line-tools/subkey/#predefined-accounts-and-keys) for operations in any public setting.
There are many options available for holding digital currency—including hardware wallets and browser-based applications—and some are more reputable than others.
You should do your own research before selecting one.

However, you can use the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/explorer) to get you started for testing purposes.

To prepare an account:

1. Connect the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/explorer) to the Rococo network.

2. Click and select **Accounts**.

1. Click **Add Account**.

1. Copy your secret seed phrase and put it in a secure location, then click **Next**.
   
2. Type an account name and password, then click **Next**.

1. Click **Save**.

2. Join the [Rococo Element channel](https://matrix.to/#/#rococo-faucet:matrix.org) and send a message with`!drip` and the public address for your Rococo to get 100 ROC in your wallet.

   For example, send a message similar to the following:

   ```text
   !drip 5CVYesFxbDBU5rkZXYTAA6BnADbCoSpQkvexBQZvbtvyGTP1
   ```

## Reserve a parachain identifier

You must reserve a parachain identifier before you can register as a parathread on Rococo.
The steps are similar to the ones you followed in [Connect a local parachain](/tutorials/build-a-parachain/connect-a-local-parachain/) to reserve an identifier on the local relay chain.
However, for the public testnet, you'll be assigned the next available identifier.

To reserve an identifier:

1. Connect the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/explorer) to the Rococo network.

1. Click **Network** and select **Parachains**. 
   
   ![Select Parachains from the network menu](/media/images/docs/tutorials/parachains/rococo-select-parachains.png)
   
2. Click **Parathreads**, then click **ParaId**.

3. Review the transaction and note the parachain identifier that you are assigned, then click **Submit**.
   
4. Type your password to authenticate your identity, then click **Sign and Submit**.
   
   ![Authorize the transaction](/media/images/docs/tutorials/parachains/auth-rococo-id.png)

5. Click **Network** and select **Explorer** to check the list of recent events for successful `registrar.Reserved`.
   
   ![Reserved identifier for the Rococo network](/media/images/docs/tutorials/parachains/rococo-reserved-id-event.png)

## Modify the chain specification file

The files required to register a parachain must specify the correct relay chain to connect to and parachain identifier that you have been assigned.
To make these changes, you must build and modify the chain specification file for your parachain.
In this tutorial, the relay chain is `rococo` instead of `rococo-local` used in the [Connect a local parachain](/tutorials/build-a-parachain/connect-a-local-parachain/) tutorial and the para identifier is `4105`.

To modify the chain specification:

1. Generate the plain text chain specification for the parachain template node by running the following command:
   
   ```bash
   ./target/release/parachain-template-node build-spec --disable-default-bootnode > plain-parachain-chainspec.json
   ```

1. Open the plain text chain specification for the parachain template node in a text editor.

2. Set `relay-chain` to `rococo` and `para_id` to the identifier you've been assigned.
   
   For example, if your reserved identifier is `4105`, set the `para_id` field to `4105`:
   
   ```json
   ...
   "relay_chain": "rococo",
   "para_id": 4105,
   "codeSubstitutes": {},
   "genesis": {
      ...
   }
   ```
   
3. Set the `parachainId` to the parachain identifier that you previously reserved.
      
   ```json
   ...
      "parachainSystem": null,
      "parachainInfo": {
        "parachainId": 4105
      },
   ...
   ```

1. Add the public key for your account to the session keys section. Each configured session key will require a running collator.

   ```json
   ...
      "session": {
        "keys": [
         [
           "5CVYesFxbDBU5rkZXYTAA6BnADbCoSpQkvexBQZvbtvyGTP1",
           "5CVYesFxbDBU5rkZXYTAA6BnADbCoSpQkvexBQZvbtvyGTP1",
           {
            "aura": "5CVYesFxbDBU5rkZXYTAA6BnADbCoSpQkvexBQZvbtvyGTP1"
           }
         ],
        ]
      }
    ...
    ```

2. Save your changes and close the plain text chain specification file.
   
3. Generate a raw chain specification file from the modified chain specification file by running the following command:
   
   ```bash
   ./target/release/parachain-template-node build-spec --chain plain-parachain-chainspec.json --disable-default-bootnode --raw > raw-parachain-chainspec.json
   ```

## Export required files

To prepare the parachain collator to be registered:

1. Export the WebAssembly runtime for the parachain by running a command similar to the following:

   ```bash
   ./target/release/parachain-template-node export-genesis-wasm --chain raw-parachain-chainspec.json para-4105-wasm
   ```

2. Generate a parachain genesis state by running a command similar to the following:
   
   ```bash
   ./target/release/parachain-template-node export-genesis-state --chain raw-parachain-chainspec.json para-4105-genesis-state
   ```

## Start the collator node

You must have the ports for the collator publicly accessible and discoverable to enable parachain nodes to peer with Rococo validator nodes to produce blocks.
You can specify the ports to use with the `--port` command-line option. 
For example, you can start the collator with a command  similar to the following:

```bash
./target/release/parachain-template-node --collator \
  --chain raw-parachain-chainspec.json \
  --base-path /tmp/parachain/pubs-demo \
  --port 50333 \
  --ws-port 8855 \
  -- \
  --execution wasm \
  --chain rococo \
  --port 50343 \
  --ws-port 9988
  ```

In this example, the first `--port` setting specifies the port for the collator node and the second `--port` specifies the port for the embedded relay chain node.
The first `--ws-port` setting specifies the port you can use to connect to collator using Polkadot-JS API calls or the Polkadot/Substrate Portal application.
The second `--ws-port` specifies the port for connecting to the embedded relay chain using the Polkadot-JS API or the Polkadot/Substrate Portal application.

## Register as a parathread

Before you can lease a slot on a public relay chain to become a parachain, you must register as a parathread on Rococo.

To register as a parathread:

1. Connect the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/explorer) to the Rococo network.

1. Click **Network** and select **Parachains**. 

1. Click **Parathread**, then click **ParaThread**.

   ![Click ParaThread to register](/media/images/docs/tutorials/parachains/rococo-parathread.png)

2. Verify the parachain owner and the parachain identifier and upload the files that contain the WebAssembly validation function and the genesis state for the parachain, then click **Submit**.

3. Type your password to authenticate your identity, then click **Sign and Submit**.

4. Scroll down the list of Parathreads and verify that your parathread registration is **Onboarding**:
   
   ![Parathread onboarding](/media/images/docs/tutorials/parachains/rococo-onboarding.png)

   You can also verify your registration request by checking for a `registrar.Registered` event in the Network Explorer.
      
   After you submit the registration request, it takes two [sessions](https://wiki.polkadot.network/docs/glossary#session) for the parathread to finish onboarding.

## Request a parachain slot

After the parachain is active as a parathread, the related project team should [open a request](https://github.com/paritytech/subport/issues/new?assignees=&labels=Rococo&template=rococo.yaml) for either a **permanent** or a **temporary parachain slot** on Rococo.

- **Permanent slots** are typically assigned to teams who have completed a successful slot lease auction and have deployed a parachain with a slot on Polkadot.
  
  Permanent slots enable those teams to continuously test their codebase for compatibility with the latest Polkadot features in a live public environment.
  Only a limited number of permanent slots are available.

- **Temporary slots** are parachain slots that are dynamically allocated in a continuous, round-robbin style rotation.
  
  At the start of every lease period, a certain number of parathreads—up to a maximum defined in the relay chain configuration—are automatically upgraded to parachains for a certain duration.
  The parachains that were active during the ending lease period are automatically downgraded to parathreads to free the slots for others to use in the subsequent period.
  Temporary slots with dynamic allocation enables teams who don't have a parachain slot on Polkadot to test their runtimes more often in a realistic network environment.

### Submitting a slot request
  
The Rococo runtime requires `sudo` access to assign slots.
For example, the Rococo runtime specifies that the account used to assign slots must have root level permissions:

```text
AssignSlotOrigin = EnsureRoot<Self::AccountId>;
```

Eventually, slot assignment is intended to be community-driven through Rococo governance.
However, the Rococo `sudo` key is currently controlled by Parity Technologies.
Therefore, you must submit a [Rococo Slot Request](https://github.com/paritytech/subport/issues/new?assignees=&labels=Rococo&template=rococo.yaml) to receive a slot assignment.
After the slot is assigned, you'll receive notification and be ready to connect.

### Assigning a slot using an administrative account 

If you have an account with the `AssignSlotOrigin` origin, you can use that account to assign a temporary slot on the Rococo network.

To assign a temporary slot:

1. Connect the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/explorer) to the Rococo network.

2. Click **Developer** and select [**Extrinsics**](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/extrinsics).
   
3. Select the account you want to use to submit the transaction.
   
4. Select the `assignedSlots` pallet.

5. Select the `assignTempParachainSlot` function.
   
6. Type the reserved parachain identifier you were assigned.
   
7. Select `Current` for the `LeasePeriodStart`.
   
   If the current slot is full, you'll be assigned the next available slot.

8. Click **Submit Transaction**.
   
9. Type your password to authenticate your identity, then click **Sign and Submit**.
   
   In your account doesn't have sufficient privileges, the transaction will fail with a `BadOrigin` error.

### Lease duration

The current lease duration and slot availability settings for assigned parachain slots on Rococo are currently:

- **Permanent slot lease duration**: 1 year (365 days)
- **Temporary slot lease duration**: 3 days
- **Maximum number of permanent slots**: up to 25 permanent slots
- **Maximum number of temporary slots**: up to 20 temporary slots
- **Maximum temporary slots allocated per leased period**: up to 5 temporary slots per 3-day temporary lease periods

These setting are subject to change based on the needs of the community.

## Test your parachain

After a slot is assigned and activated for you, you can test your parachain on the Rococo test network.
Note that when the temporary slot lease period ends, the parachain is automatically downgraded to a parathread.
Registered and approved slots are cycled through automatically in a round-robin fashion, so you can expect to come back online as a parachain from time to time.

## Next steps

After rigorous testing and validation of the parachain on a test network like Rococo, you can consider joining a production network such as [Kusama](https://kusama.network/) though a [slot auction](https://guide.kusama.network/docs/learn-auction/).
