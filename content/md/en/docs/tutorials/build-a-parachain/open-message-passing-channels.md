---
title: Open message passing channels
description: Demonstrates how to use horizontal relay-routed message passing (HRMP) for communication between parachains.
keywords:
  - Polkadot
  - cross-consensus messaging
  - HRMP
  - XCM
  - parachain
---

<div class="warning">
	<p>
	<strong>⚠️ WARNING:</strong> This page contains potentially outdated information 
  and instructions. Reading it might still be useful, yet we suggest taking it with a grain of salt. When the new [Polkadot developer documentation](https://forum.polkadot.network/t/decentralized-futures-ecosystem-devrel-team-for-polkadot-by-papermoon/5811) is published, the content on this page will be updated. Thanks for your patience!
	</p>
</div>

In the Polkadot ecosystem, chains can communicate with each other by passing messages over secure channels.
There are three main communication channels:

- Upward message passing (UMP) to enable a parachain to pass messages up to its relay chain.
- Downward message passing (DMP) to enable the relay chain to pass messages down to a parachain.
- Cross-consensus message passing (XCMP) to enable parachains to send messages to each other.

Horizontal relay-routed message passing (HRMP) is an interim version of cross-consensus message passing (XCMP).
This interim solution—also sometimes referred to as XCMP-Lite—provides the same functionality as XCMP but stores all of the messages passed between chains in the relay chain storage.

Although HRMP is intended to be phased out when XCMP is fully implemented, this tutorial uses HRMP to illustrate how you can open message passing channels to enable parachains to communicate with each other.

## About the XCM format

The messages passed through the Polkadot communication channels use the [XCM format](https://github.com/paritytech/xcm-format) to express what should be done by the message receiver.
The XCM format is designed to support communication between chains, but also messages from smart contracts and pallets, over bridges, and through other transport protocols.

## Opening HRMP channels

It is important to note that HRMP channels are unidirectional.
If you want parachain 1000 to communicate with parachain 1001, you must first make a request to open an HRMP channel from parachain 1000 to parachain 1001.
Parachain 1001 must then accept the request before parachain 1000 can pass messages to it.
Because the channel is unidirectional, however, parachain 1000 can't receive messages from parachain 1001 over the channel.

For parachain 1000 to receive messages from parachain 1001, you must open another channel from parachain 1001 to parachain 1000.
After parachain 1000 confirms that it will accept messages from parachain 1001, the chains can exchange messages at the next session change.

## Before you begin

In this tutorial, you'll open HRMP channels that enable a parachain with the unique identifier 1000 and a parachain with the unique identifier 1001 to exchange messages.
Before you begin, verify the following:

- You have set up a [parachain test network](/test/simulate-parachains) using Zombienet or a local relay chain using the `rococo-local` chain specification.

- You have set up two local or virtual parachains for testing purposes.

  For the purposes of this tutorial, parachain A has the unique identifier 1000 and parachain B has the unique identifier 1001.

- You have the Sudo pallet available for both local parachains to use.

  For this tutorial in a test environment, you can add the Sudo pallet to each collator node.
  The pallet is not included by default if you use the `substrate-parachain-template` to build your node.
  To add the Sudo pallet, you must update the `runtime/src/lib.rs` and `node/src/chain_spec.rs` files.
  For the runtime, you can implement the configuration trait and modify the construct_runtime macro, similar to how you would add any other pallet.
  For an example of a chain specification with the Sudo pallet, see [parachain-template-1001.rs](/assets/tutorials/relay-chain-specs/parachain-template-1001.rs).

  In a production environment, you would use governance proposals and voting instead of the Sudo pallet for privileged transactions.

## Add the sovereign accounts

Before the parachain can exchange messages with another parachain, it must have an account on the relay chain that has assets available to pay for XCM instructions to be executed.

To add sovereign account addresses to the relay chain:

1. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps) and connect to a relay chain endpoint.

2. Calculate the parachain [sovereign account address](https://substrate.stackexchange.com/questions/1200/how-to-calculate-sovereignaccount-for-parachain) to use on the relay chain.

   Parachain A (1000) address: 5Ec4AhPZk8STuex8Wsi9TwDtJQxKqzPJRCH7348Xtcs9vZLJ

   Parachain B (1001) address: 5Ec4AhPZwkVeRmswLWBsf7rxQ3cjzMKRWuVvffJ6Uuu89s1P

   Note that if the parachain identifier registered for a parachain changes, the sovereign account and address will also change.
   You should also note that the account address used for a parachain on the relay chain is different from the address used for the parachain on another parachain.

3. Click **Accounts** and select **Address Book**.

4. Click **Add contact**.

5. Add the address and a name for parachain A (1000), then click **Save**.

6. Click **Accounts** and transfer some assets from Alice to the parachain A (1000) account.

   Repeat step 3 through step 6 for parachain B (1001).

## Prepare the open channel encoded call

To set up communication between the parachains, you must first send a request to open a message passing channel.
The request must take the form of an encoded call with parameters that specify the parachain to receive the request, the message capacity for the channel, and maximum message size.
You'll need to include the encoded version of this information in the message you create to make the request, but you can generate the encoded call without submitting the transaction to prepare the request.

To prepare the encoded call to open a channel:

1. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps) and connect to a relay chain endpoint.

2. Check the channel configuration limits for the relay chain, if needed.

   To check the configuration settings for the current relay chain:

   - Click **Developer** and select **Chain State**.
   - Select **configuration**, then select **activeConfig()** and click **+**.
   - Check the parameter values for `hrmpChannelMaxCapacity` and `hrmlChannelMaxMessageSize`.

   For example:

      ```text
      hrmpChannelMaxCapacity: 8
      hrmlChannelMaxMessageSize: 1,048,576
      ```

3. Click **Developer** and select **Extrinsics**.

4. Select **hrmp**, then select **hrmpInitOpenChannel(recipient, proposedMaxCapacity, proposedMaxMessageSize)** to initialize the request to open a new channel.

   For the transaction parameters, specify the following to prepare the call data:

   - recipient: Type the identifier for the parachain you want to open the channel with (1001).
   - proposedMaxCapacity: Type the maximum number of messages that can be in the channel at once (8).
   - proposedMaxMessageSize: Specify the maximum size of the messages (1048576).

   Note that the values you set for **proposedMaxCapacity** and **proposedMaxMessageSize** shouldn't exceeded the values defined for the `hrmpChannelMaxCapacity` and `hrmpChannelMaxMessageSize` parameters for the relay chain.

5. Copy the **encoded call data**.

   ![Copy the encoded call data](/media/images/docs/tutorials/parachains/hrmp-encoded-call.png)

   You'll need this information to construct the XCM Transact instruction.
   The following is an example of the encoded call data in Rococo: `0x3c00e90300000800000000001000`

## Configure the open channel request

Now that you have the encoded call, you can configure the request to open a channel from parachain A to parachain B through the relay chain.

1. Connect to the endpoint for parachain A (1000) using the [Polkadot/Substrate Portal](https://polkadot.js.org/apps).

2. Click **Developer** and select **Extrinsics**.

3. Select **sudo**, then select **sudo(call)** to use the Sudo pallet to execute privileged transactions.

3. Select **polkadotXcm**, then select **send(dest, message)** to notify the relay chain that you want to open a channel with parachain B (1001).

   ![Send message using the Sudo pallet](/media/images/docs/tutorials/parachains/hrmp-sudo-call.png)

4. Specify the destination parameters to indicate the relative location for the message to be delivered.

   The destination parameters specify where the XCM should be executed.
   In this example, the parent of parachain 1000 is the relay chain, and in the context of the parent the interior setting of Here means that the relay chain is going to execute the XCM.
   For more information about specifying relative locations for XCM, see [Universal Consensus Location Identifiers](https://github.com/paritytech/xcm-format#7-universal-consensus-location-identifiers).

   ![Destination parameters](/media/images/docs/tutorials/parachains/hrmp-destination.png)

5. Specify the XCM version, then click **Add item** to construct the message to be executed.

   At a minimum, you need to add the following set of instructions for this message:

   - [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset) to move the specified on-chain assets into the virtual [holding register](https://polkadot.network/blog/xcm-the-cross-consensus-message-format/#-the-holding-register).

   - [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution) to pay for the execution of the current message using the assets that were deposited in the virtual holding register using the WithdrawAsset instruction.
     For more information about paying fees, see [Fee payment in XCM](https://polkadot.network/blog/xcm-the-cross-consensus-message-format/#-fee-payment-in-xcm).

   - [Transact](https://github.com/paritytech/xcm-format#transact) to specify the encoded call that you prepared on the relay chain.

   In most cases, you also want to include the following instructions:

   - [RefundSurplus](https://github.com/paritytech/xcm-format#refundsurplus) to move any overestimate of fees previously paid using the BuyExecution instruction into a second virtual register called the refunded weight register.

   - [DepositAsset](https://github.com/paritytech/xcm-format#depositasset) to subtract assets from the refunded weight register and deposit on-chain equivalent assets under the ownership of the beneficiary.

   Note that each instruction requires you to specify additional information to enable the message recipient to execute the intended XCM instructions.
   Be sure that you construct the information for each instruction from the point of view of the receiving system.

   Let's take a closer look at the instructions.

### WithdrawAsset instruction

To move assets into the virtual holding register:

1. Select [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset) as the first instruction for this message.

2. Click **Add item** to identify the on-chain assets to withdraw.

   ![Add instructions or add information about the instruction](/substrate-docs/content/media/images/docs/tutorials/parachains/construction-xcm-instruction.png)

3. Select **Concrete** to use the location of the asset to identify the asset to be withdrawn.

     For more information about specifying asset locations, see [Concrete identifiers](https://github.com/paritytech/xcm-format#concrete-identifiers).

4. Set **parents: 0** and **interior: Here** to withdraw assets from the sovereign account on the relay chain.

5. Select **Fungible** to identify the asset as a fungible asset.

6. Specify the total fungible assets to withdraw.

   ![WithdrawAsset and settings](/media/images/docs/tutorials/parachains/withdraw-asset-instruction-settings.png)

### BuyExecution instruction

To pay for execution from assets deposited in the holding register:

1. Click **Add item** to select [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution) as the second instruction for this message.

2. Select **Concrete** to use the location of the asset to identify the asset to be used to pay for executing XCM instructions.

3. Set **parents: 0** and **interior: Here** to indicate that you're using the local chain's native asset for execution payment.

4. Select **Fungible** to identify the asset as a fungible asset.

5. Specify the total fungible assets to use.

6. Select **Unlimited** to skip setting a weight limit for this instruction.

   ![BuyExecution and settings](/media/images/docs/tutorials/parachains/buy-execution-open.png)

### Transact instruction

To execute the encoded call that you prepared on the relay chain:

1. Click the top **Add item** to select [Transact](https://github.com/paritytech/xcm-format#transact) as the third instruction for this message.

2. Select **Native** as the message origin for executing the instruction.

3. Set **requireWeightAtMost**  to specify the maximum amount of weight to use in dispatching the XCM call.

   If the XCM dispatch requires more weight than specified, the transaction fails.
   If the XCM dispatch requires less weight than specified, the difference can be added to the surplus weight register.

1. Specify the encoded call data for transaction you want to be executed by the Transact instruction.

   For example, paste the encoded call for initiating an open channel request.

   ![Transact and settings](/media/images/docs/tutorials/parachains/transact-open-request.png)

### RefundSurplus and DepositAsset instructions

To move any overestimate of fees:

1. Click the top **Add item** to select [RefundSurplus](https://github.com/paritytech/xcm-format#transact) as the four instruction for this message.

1. Click the top **Add item** to select [DepositAsset](https://github.com/paritytech/xcm-format#transact) as the fifth instruction for this message.

1. Select **Wild** to allow an unspecified number of assets to be deposited.

1. Select **All** to allow all of the refunded assets to be deposited.

2. Set **1** as the maximum number of unique assets to remove from the holding register for the deposit.

   In this tutorial, there's only one asset instance available to be removed.

1. Specify the beneficiary to receive the deposited assets.

   Typically, the beneficiary for the DepositAsset instruction is the sovereign account of the message sender.
   In this case, you can specify parachain A (1000) as **parents: 0**, **interior: X1**, **Parachain: 1000** so that any surplus assets are returned to the account and can be used to deliver other XCM instructions or to open additional HRMP channels.

   ![RefundSurplus and DepositAsset instructions and settings](/media/images/docs/tutorials/parachains/refund-and-deposit.png)

   Alternatively, you can specify the beneficiary as **parents: 0**, **interior: X1**, **AccountId** and identify a network and account address to receive the assets.

   For more information about the RefundSurplus and DepositAsset instructions, see [Weight](https://polkadot.network/blog/xcm-part-three-execution-and-error-management/#-weight).

### Review the full set of instructions

This set of XCM instructions:

- Withdraw assets from the parachain A sovereign account to the virtual holding register.

- Uses the assets in the holding register to pay for the execution time the XCM instructions require.

- Executes the initialization request for an open channel on the relay chain.

- Refunds any left over assets and deposits the refunded assets into the account owned by the specified beneficiary.

For an example that illustrates all of the settings for this set of instructions, see the sample [xcm-instructions](/assets/tutorials/relay-chain-specs/xcm-instructions.txt) file.
For more information and answers to specific technical questions, try the following tags on [Substrate and Polkadot Stack Exchange](https://substrate.stackexchange.com/):

- xcm
- hrmp
- weight
- cumulus

### Submit the transaction

To submit the transaction:

1. Click **Submit Transaction**.

1. Click **Sign and Submit**.

1. Click **Network** and select **Explorer** to verify the message is sent.

## Verify the request

After you submit the transaction, you should verify that the message was received and executed on the relay chain.

To verify the request:

1. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps) in two separate browser tabs or windows with one instance connecting to the relay chain and one instance connecting to the parachain endpoint.

2. In the browser instance connecting to the parachain, click **Network** then select **Explorer**.

3. Check the list of recent events and verify that there is a **sudo.Sudid** event and a **polkadotXcm.Sent** event.

   ![Events for XCM instructions on the parachain](/media/images/docs/tutorials/parachains/hrmp-parachain-events.png)

   You can expand the **polkadotXcm.Sent** event to see details about the instructions included in the message that was sent.

4. In the browser instance connecting to the relay chain, click **Network** then select **Explorer**.

3. Check the list of recent events and verify that the **ump.UpwardMessagesReceived**, **hrmp.OpenChannelRequested**, and **ump.ExecutedUpward** events are displayed.

   ![Events for XCM instructions on the relay chain](/media/images/docs/tutorials/parachains/hrmp-relay-chain-request-complete.png)

   You can expand these events to see details about the instructions that were executed.

4. Check the sovereign account balance for parachain A (1000).

   ![Account balance after message execution](/media/images/docs/tutorials/parachains/hrmp-after-msg-execution-balance.png)

## Prepare the acceptance encoded call

After you have successfully created the open channel request, parachain B (1001) must accept the request before you can send any messages using the channel you've requested.
The steps are similar to the steps for initiating an open channel request, but you'll use a different encoded call and you'll send the message from parachain B instead of parachain A.

The first step is to prepare the encoded call on the relay chain.

To prepare the encoded call:

1. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps) and connect to the relay chain.

2. Click **Developer** and select **Extrinsics**.

3. Select **hrmp**, then select **hrmpAcceptOpenChannel(sender)** and specify the **sender**, in this case, parachain A (1000).

4. Copy the **encoded call data**.

   ![Copy the encoded call data](/media/images/docs/tutorials/parachains/hrmp-relay-chain-accept-request.png)

   You'll need this information to craft the XCM Transact instruction.
   The following is an example of encoded call data in Rococo:
   0x3c01e8030000

## Accept the open channel request

Now that you have the encoded call, you can construct the the set of XCM instructions to accept the open channel requested by parachain A.

1. Connect to the endpoint for parachain B (1001) using the [Polkadot/Substrate Portal](https://polkadot.js.org/apps).

2. Click **Developer** and select **Extrinsics**.

3. Select **sudo**, then select **sudo(call)** to use the Sudo pallet to execute privileged transactions.

4. Select **polkadotXcm**, then select **send(dest, message)** to notify the relay chain that you want to open a channel with parachain B (1001).

5. Specify the destination parameters to indicate the relative location for the message to be delivered.

6. Specify the XCM version, then click **Add item** to construct the message to be executed.

   You can use a similar set of instructions for this message:

   - [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset) to move the specified on-chain assets into the virtual holding register.

   - [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution) to pay for the execution of the current message using the assets that were deposited in the virtual holding register.

   - [Transact](https://github.com/paritytech/xcm-format#transact) to specify the encoded call—for example, 0x3c01e8030000—that you prepared on the relay chain.

   - [RefundSurplus](https://github.com/paritytech/xcm-format#refundsurplus) to move any overestimate of fee into the refunded weight register.

   - [DepositAsset](https://github.com/paritytech/xcm-format#depositasset) to subtract assets from the refunded weight register and deposit on-chain equivalent assets under the ownership of the beneficiary.

7. Click **Submit Transaction**.

   After you submit the transaction, you must wait for the next epoch to see the change reflected in the chain state.

## Verify the open channel

After you submit the transaction, you can verify that the message was received and executed on the relay chain.

To verify the request:

1. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps) in two separate browser tabs or windows with one instance connecting to the relay chain and one instance connecting to the parachain endpoint.

2. In the browser instance connecting to the parachain, click **Network** then select **Explorer**.

3. Check the list of recent events and verify that there is a **sudo.Sudid** event and a **polkadotXcm.Sent** event.

4. In the browser instance connecting to the relay chain, click **Network** then select **Explorer**.

5. Check the list of recent events and verify that the **hrmp.OpenChannelAccepted** and **ump.ExecutedUpward** events are displayed.

   ![Events for XCM instructions on the relay chain](/media/images/docs/tutorials/parachains/hrmp-relay-chain-request-accepted.png)

   After the start of the next epoch, you can also query the chain state for **hrmpChannels** to verify that you've opened a channel from parachain A (1000) to parachain B (1001).

   ![Query HRMP channels](/media/images/docs/tutorials/parachains/hrmp-verify-channel.png)

## Open a second channel

If you only want to send XCM instructions to parachain B (1001), your work is done.

However, if you want to enable two-way communication-where both chains can receive and execute instructions sent by the other chain, you need to follow the same steps for parachain B that you just completed for parachain A. After parachain A accepts the open channel requests, both chains can send, receive, and execute XCM instructions.

Repeat all of the steps for preparing the encoded calls, sending the open channel request, and accepting the request to enable communication from parachain B (1001) to parachain A (1000).
After you open the channel from parachain B to parachain A, the two parachains can send messages directly to each other or have messages routed through the relay chain.

Although you can send XCM instructions between the parachains at this point, constructing messages that can be executed successfully on a remote chain requires additional configuration to reach a shared understanding of assets that can be transferred or to define mutual trust relationships that allow assets to be moved from one chain to another.
In future tutorials, you'll see examples of a few common scenarios for communication between parachains.

## Where to go next

- [XCM Part I: The Cross-Consensus Message Format](https://polkadot.network/blog/xcm-the-cross-consensus-message-format)
- [XCM Part II: Versioning and Compatibility](https://polkadot.network/blog/xcm-part-two-versioning-and-compatibility)
- [XCM Part III: Execution and Error Management](https://polkadot.network/blog/xcm-part-three-execution-and-error-management)
