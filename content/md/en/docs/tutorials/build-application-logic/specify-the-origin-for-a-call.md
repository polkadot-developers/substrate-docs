---
title: Specify the origin for a call
description: Demonstrates how you can specify the account to use as the originator of a function call.
keywords:
  - FRAME
  - runtime
  - origins
---

In [Add a pallet to the runtime](/tutorials/build-application-logic/add-a-pallet), you added functions from `pallet_nicks` to the [Substrate node template](https://github.com/substrate-developer-hub/substrate-node-template) runtime.

The Nicks pallet allows blockchain users to pay a deposit to reserve a nickname for an account they control.
It implements the following functions:

- The `set_name` function to enable an account owner to set the name of his or her own account if the name is not already reserved.
- The `clear_name` function to enable an account owner to remove the name associated with an account and return the deposit.
- The `kill_name` function to forcibly remove an account name for another party without returning the deposit.
- The `force_name` function to set an account name for another party without requiring a deposit.

This tutorial illustrates how you can call these functions using different originating accounts and why calling the functions using different originating accounts matters.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have the Substrate node template installed locally.

- You have the Substrate front-end template installed locally.

- You have completed the [Add a pallet to the runtime](/tutorials/build-application-logic/add-a-pallet) tutorial and successfully compiled the runtime that includes the `nicks` pallet.

- You are generally familiar with software development and using command-line interfaces.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Call the `set_name` function using an account that has permission to execute the call.
- Call the `clear_name` function using an account that has permission to execute the call.
- Call the `force_name` function using an account that isn't allowed to execute the call.
- Call the `kill_name` function using an origin that doesn't have administrative privileges.
- Call the `kill_name` function using the `Root` origin account.
- See how calling function using different origin accounts can lead to failed or successful results.

## Identify the administrative account

As you saw in [Add a pallet to the runtime](/tutorials/build-application-logic/add-a-pallet), the `Config` trait for the `nicks` pallet declares several types.
For this tutorial, the focus is on the `ForceOrigin` type.
The `ForceOrigin` type is used to specify the account that can perform certain operations.
For this pallet, the `ForceOrigin` type specifies the account that can set or remove a name for another account.
Typically, only an account with administrative privileges—such as a root superuser account—can act on behalf of another account.
In the case of the Nicks pallet, only the owner of an account or the Root account can set or remove a reserved nickname.
You configured this Root account in the implementation (`impl`) block when you identified the FRAME System [`Root` origin](https://paritytech.github.io/substrate/master/frame_system/enum.RawOrigin.html#variant.Root) as the `nicks` pallet administrator.
For example:

```rust
type ForceOrigin = frame_system::EnsureRoot<AccountId>;
```

In the development [chain specification](https://github.com/substrate-developer-hub/substrate-node-template/blob/main/node/src/chain_spec.rs) for the node template, the [Sudo pallet](https://paritytech.github.io/substrate/master/pallet_sudo/index.html) is configured to use the Alice account as the FRAME system `Root` origin.
As a result of this configuration, by default, only the Alice account can call the functions that require the `ForceOrigin` type.

If you attempt to call the `kill_name` or `force_name` with an account other than the Alice account, the call will fail to be executed.

## Set the name for an account

To demonstrate how the origin for a call affects operations, let's set and try to forcibly remove the account name for another account.
For this demonstration, be sure you have:

- The node template running in development mode: `./target/release/node-template --dev`
- The frontend template running and connecting to the local node: `yarn start`
- Your browser connected to the local web server: <http://localhost:8000/><!-- markdown-link-check-disable-line -->

1. Change the active account in the front-end template from Alice to Bob.

1. With **Extrinsic** selected in the Pallet Interactor:

   - Select the `nicks` pallet.
   - Select the `setName` function.
   - Type a name for the account.
   - Click **Signed** to submit this transaction signed by Bob.

   Because Bob is the owner of this account, the transaction is successful.
   As the owner of the account, Bob can also execute the `clearName` function in a signed transaction to remove the nickname for the account.

1. With **Extrinsic** selected:

   - Select the `nicks` pallet.
   - Select the `clearName` function.
   - Click **Signed** to submit this transaction signed by Bob.

      Because Bob is the owner of this account, the transaction is successful.
      For Bob to set or remove the nickname for another account, he must call the `forceName` or `killName` function using the `ForceOrigin` that was configured for the pallet.

1. With **Extrinsic** selected:

   - Select the `nicks` pallet.
   - Select the `forceName` function.
   - Copy and paste the account address for Charlie as the target.
   - Type a name for the account.
   - Click **Signed** to submit this transaction signed by Bob.

   Because you signed this transaction using Bob's account, the function is dispatched using the [`Signed` origin](https://paritytech.github.io/substrate/master/frame_system/enum.RawOrigin.html#variant.Signed) rather than the `Root` origin.
   In this case, the function call itself is successful.
   However, the name reservation can't be completed and a `BadOrigin` error is emitted as a result.

   ![BadOrigin error](/media/images/docs/tutorials/add-a-pallet/badOrigin.png)

   As you can see in the Events, the transaction resulted in a withdrawal from Bob's account as a [fee](/build/tx-weights-fees/) for submitting the transaction, but there were no state changes because the `Root` origin didn't submit the transaction.
   The failure to change state also illustrates the [verify-first-write-last](/build/runtime-storage#verify-first-write-last) principle for database reads and writes to ensure only successful operations are committed to disk.

## Use the Root origin to dispatch a call

   The Sudo pallet enables you to dispatch a call using the `Root` origin.
   In the Nick pallet, the forceName and killName functions must be called using the `Root` origin as specified by the `ForceOrigin` configuration.
   In the front-end template, you can access the Sudo pallet to dispatch a call using the `Root` origin by clicking **SUDO**.

For this demonstration, be sure you have:

- The node template running in development mode: `./target/release/node-template --dev`
- The frontend template running and connecting to the local node: `yarn start`
- Your browser connected to the local web server: <http://localhost:8000/><!-- markdown-link-check-disable-line -->

1. Change the active account to Alice.

   As mentioned in [Identify the administrative account](#identify-the-administrative-account), Alice is the account associated with the `Root` origin when running the chain in development mode.

1. With **Extrinsic** selected in the Pallet Interactor:

   - Select the `nicks` pallet.
   - Select the `forceName` function.
   - Copy and paste the account address for Charlie as the target.
   - Type a name for the account.
   - Click **SUDO** to submit this transaction using the `Root` origin.

   ![Use SUDO to submit a transaction](/media/images/docs/tutorials/add-a-pallet/sudo-tx.png)

1. With **Extrinsic** selected:

   - Select the `nicks` pallet.
   - Select the `killName` function.
   - Copy and paste the account address for Bob as the target.
   - Click **SUDO** to submit this transaction using the `Root` origin.

   In this case, the Sudo pallet emits a [`Sudid` event](https://paritytech.github.io/substrate/master/pallet_sudo/pallet/enum.Event.html) to inform network participants that the `Root` origin dispatched a call, but an error occurred.

   ![Submitting a killName function emitted an error](/media/images/docs/tutorials/add-a-pallet/sudo-error.png)

   This dispatch error includes two pieces of metadata:

   - an `nonce` number that indicates the pallet from which the error originated.
   - an `error` number that indicates the error emitted from that pallet's `Error` enum.

   The `nonce` number corresponds with the position of the pallet within the `construct_runtime!` macro, with the _first_ pallet in the `construct_runtime!` macro having an nonce number of zero (0).

   In this example, the `nonce` is `6` (the _seventh_ pallet) and the `error` is `2` (the _third_ error).

   ```rust
   construct_runtime!(
    pub enum Runtime where
      Block = Block,
      NodeBlock = opaque::Block,
      UncheckedExtrinsic = UncheckedExtrinsic
    {
      System: frame_system,                                        // nonce 0
      RandomnessCollectiveFlip: pallet_randomness_collective_flip, // nonce 1
      Timestamp: pallet_timestamp,                                 // nonce 2
      Aura: pallet_aura,                                           // nonce 3
      Grandpa: pallet_grandpa,                                     // nonce 4
      Balances: pallet_balances,                                   // nonce 5
      Nicks: pallet_nicks,                                         // nonce 6
    }
   ```

   Regardless of the value of `nonce`, the `error` value `2` corresponds to the [`Unnamed` error](https://paritytech.github.io/substrate/master/pallet_nicks/pallet/enum.Error.html) in the Nicks pallet.
   This is the error you would expect if Bob has not reserved a nickname or has previously cleared the name reservation.

   You can confirm that Alice can use SUDO to invoke the `killName` function to remove the nickname reserved for any account that has currently has a name reserved.

1. With **Extrinsic** selected:

   - Select the `nicks` pallet.
   - Select the `killName` function.
   - Copy and paste the account address for Charlie as the target.
   - Click **SUDO** to submit this transaction using the `Root` origin.

   ![Submitting a successfuk killName transaction](/media/images/docs/tutorials/add-a-pallet/sudo-error.png)

## Where to go next

This tutorial introduced the use of `Root` and `Signed` origins to specify the account used to submit a transaction and demonstrated the results of using different originating accounts to call functions.
There are several [tutorials](/tutorials/) that can serve as next steps for learning more about Substrate development.

In addition to tutorials, you might want to explore the following resources to learn more.

- [Privileged calls and origins](/build/origins) provides a closer look at the default raw origin types and how to create custom origins.
- [Events and errors](/build/events-and-errors) explains how to emit events and errors from the runtime.
- [FRAME pallets](/reference/frame-pallets/) offers an overview of the most commonly-used predefined FRAME pallets.
