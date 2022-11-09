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

In the Polkadot ecosystem, chains can communicate with each other by passing messages over secure channels.
There are three main communication channels:

- Upward message passing (UMP) to enable a parachain to pass messages to its relay chain. 
- Downward message passing (DMP) to enable the relay chain to pass messages to a parachain. 
- Cross-consensus messaging passing (XCMP) to enable parachains to send messages to each other.
  
## About horizontal relay-routed message passing

Horizontal relay-routed message passing (HRMP) is an interim version of cross-consensus message passing (XCMP). 
This interim solution—also sometimes referred to as XCMP-Lite—provides the same functionality as XCMP.
However, HRMP stores all of the messages passed between chains in the relay chain storage and is therefore more resource-intensive than XCMP.

Although HRMP is intended to be phased out when XCMP is fully implemented, this tutorial uses HRMP to illustrate how you can open message passing channels to enable parachains to communicate with each other.

## About the XCM message format

The messages passed through the Polkadot communication channels use the [XCM message format](https://github.com/paritytech/xcm-format) to express what should be done by the message receiver.
The XCM message format is designed to support communication between chains, but also messages from smart contracts and pallets, over bridges, and through other transport protocols.

## Opening HRMP channels

It is important to note that HRMP channels are unidirectional.
If you want parachain 1002 to communicate with parachain 1001, you must first make a request to open an HRMP channel from parachain 1002 to parachain 1001.
Parachain 1001 must then accept the request before parachain 1002 can pass messages to it.
Because the channel is unidirectional, however, parachain 1002 can't receive messages from parachain 1001 over the channel.

For parachain 1002 to receive messages from parachain 1001, you must open another channel from parachain 1001 to parachain 1002. 
After parachain 1002 confirms that it will accept messages from parachain 1001, the chains can exchange messages at the next session change.

## Before you begin

In this tutorial, you'll open HRMP channels that enable a parachain with the unique identifier 1001 and a parachain with the unique identifier 1002 to exchange XCM messages.
Before you begin, verify the following:

- You have set up a [zombienet](https://substrate.stackexchange.com/questions/4692/how-do-i-spin-up-a-testnet-with-zombienet) test network or a local relay chain using the `rococo-local`  chain specification.
- You have set up two local parachain for testing purposes.
- You have the `sudo` pallet configured for both local parachains.
  
  In a production environment, you would use governance instead of the `sudo` pallet for privileged transactions.

## Prepare the channel request

1. Open the Polkadot/Substrate Portal and connect to the test network.
2. Create an hrmpInitOpenChannel call. 
Do not submit the call, instead copy the encoded call data for later use:

![]()

proposed_max_capacity - specifies how many messages can be in the channel at once.
proposed_max_message_size - specifies the maximum size of the messages.

These numbers are a subject to the relay chain’s configuration limits.

You can find this in the relay chain’s active configuration:

![]

## Fund the parachain’s sovereign account

The next step will be to create and submit an XCM on parachain 1001 with our encoded call data from above, but before we can do this we need to make sure parachain 1001’s sovereign account on the relay chain is funded so it can take care of any XCM transact fees.

Let’s add parachain 1001’s sovereign account to our address book.

On the relay chain, open the address book and add the following contact:



If you’re unsure as to how to calculate the parachain’s sovereign account checkout this post:

https://substrate.stackexchange.com/questions/1200/how-to-calculate-sovereignaccount-for-parachain

Note that if the parachain’s paraId changes, then sovereign account will also change. Therefore, as a rule-of-thumb, avoid hard coding the parachain’s sovereign account.

We can now transfer some tokens from Alice to the sovereign account:

## Where to go next

- [XCM: The Cross-Consensus Message Format](https://polkadot.network/blog/xcm-the-cross-consensus-message-format)
- [XCM Part II: Versioning and Compatibility](https://polkadot.network/blog/xcm-part-two-versioning-and-compatibility)
- [XCM Part III: Execution and Error Management](https://polkadot.network/blog/xcm-part-three-execution-and-error-management)
