---
title: Send remote transfer messages
description: Demonstrates how to use cross-consensus messages to execute a remote transfer to a parachain through the relay chain.
keywords:
  - XCM
  - XCMP
  - HRMP
  - VMP 
  - messaging
  - cross chain 
  - cross consensus
---

In [Open message passing channels](/tutorials/connect-relay-and-parachains/open-message-passing-channels.md), you saw how to open a two-way communication channel between chains be sending messages to the relay chain.
You can use a similar strategy to send messages that allow a local chain to manage an account on a remote chain.
In this tutorial, parachain B transfers assets into the sovereign account on the relay chain for parachain A.

The outcome for this tutorial is similar to using the `transfer` function from the balances pallet, except in this case the transfer is initiated by a parachain and demonstrates how the holding register is used when executing the `WithdrawAsset` and `DepositAsset`XCM instructions.

## Before you begin

Before you begin, verify the following:

- You have set up a [parachain test network](/test/simulate-parachains) using Zombienet or a local relay chain using the `rococo-local` chain specification.
  
- You have set up two local or virtual parachains for testing purposes.
  
  For the purposes of this tutorial, parachain A has the unique identifier 1000 and parachain B has the unique identifier 1001.

- You have the Sudo pallet available for both local parachains to use.

- You have opened the message passing channel to allow communication between parachain B and parachain A.

## Configure XCM instructions

To illustrate the interaction between the two chains, in the following example, parachain B sends XCM instructions to deposit assets into an account on parachain A.

1. Connect to the endpoint for parachain B (1001) using the [Polkadot/Substrate Portal](https://polkadot.js.org/apps).

2. Click **Developer** and select **Extrinsics**.

3. Select **sudo**, then select **sudo(call)** to use the Sudo pallet to execute privileged transactions.

4. Select **polkadotXcm**, then select **send(dest, message)**.
   
5. Specify the destination parameters to indicate the relative location for the message to be delivered.
      
6. Specify the XCM version, then click **Add item** to construct the message to be executed.


