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
However, HRMP stores all of the messages passed between chains in the relay chain storage and is therefore  more resource-intensive than XCMP.

Although HRMP is intended to be phased out when XCMP is fully implemented, this tutorial uses HRMP to illustrate how you can open message passing channels to enable parachains to communicate with each other.

## About the XCM message format

The messages passed through the Polkadot communication channels use the [XCM message format](https://github.com/paritytech/xcm-format) to express what should be done by the message receiver.
The XCM message format is designed to support communication between chains, but also messages from smart contracts and pallets, over bridges, and through other transport protocols.

## Opening HRMP channels

It is important to note that HRMP channels are unidirectional.
If you want to open an HRMP channel to communicate with parachain 1001, you must make a request to that parachain.
After you make the request, parachain 1001 must accept the request before you can pass messages to that parachain.
Because the channel is unidirectional, you can't receive messages from parachain 1001 over the channel.

For you to receive messages from parachain 1001, you must open another channel in the opposite direction and confirm that you'll accept messages from parachain 1001.

## Before you begin

In this tutorial, you'll open HRMP channels that enable a parachain with the unique identifier 1001 and a parachain with the unique identifier 1002 to exchange XCM messages.
Before you begin, verify the following:

- You have set up a local relay chain using the `rococo-local`  chain specification.
- You have set up two local parachain for testing purposes.
- You have the `sudo` pallet configured for both local parachains.
  
  In a production environment, you would use governance instead of the sudo pallet for privileged transactions.


https://substrate.stackexchange.com/questions/4692/how-do-i-spin-up-a-testnet-with-zombienet

## Create the channel request

First we need to create an hrmpInitOpenChannel call. 
Do not submit the call, instead copy the encoded call data for later use:


proposed_max_capacity - specifies how many messages can be in the channel at once.
proposed_max_message_size - specifies the maximum size of the messages.
These numbers are a subject to the relay chain’s configuration limits.

You can find this in the relay chain’s active configuration:

- [XCM: The Cross-Consensus Message Format](https://polkadot.network/blog/xcm-the-cross-consensus-message-format)
- [XCM Part II: Versioning and Compatibility](https://polkadot.network/blog/xcm-part-two-versioning-and-compatibility)
- [XCM Part III: Execution and Error Management](https://polkadot.network/blog/xcm-part-three-execution-and-error-management)
