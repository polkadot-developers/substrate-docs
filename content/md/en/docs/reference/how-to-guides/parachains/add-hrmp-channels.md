---
title: Add HRMP channels
keywords:
  - parachain
  - channel
  - hrmp
  - xcm
  - crosschain
---

In this guide, you will learn how to make a request for parachain B to accept a channel with parachain A.
Read more about HRMP channels in the [Polkadot wiki](https://wiki.polkadot.network/docs/build-hrmp-channels).

**Channels are unidirectional**

The general flow is that one of the parachains interested in opening a channel must make a request to the parachain it wishes to open one with.
Then, the other parachain needs to accept this request for opening a channel, meaning that the channel is unidirectional by default.
For bidirectional communication we need to open another channel in the opposite way.

A channel can be opened only after the recipient confirms it and only on a session change.

For the purpose of this guide, we'll assume we have:

- A Relay chain
- A Parachain A with ParaId 2000
- A Parachain B with ParaId 3000

## Parachain A actions

1. On the relay chain, prepare the following call:

   ```
   hrmp.hrmpInitOpenChannel(
       recipient: 3000                    //the other parachain you want to open the channel with
       proposedMaxCapacity: 1000          // specifies how many messages can be in the channel at once
       proposed_max_message_size: 102400  //specifies the maximum size of the messages
   )
   ```

   Note that these numbers are subject to the relay chain's configuration limits.

   After setting the desired parameters, save the encoded call data.
   For example, the encoded call data for this call in Rococo is: [`0x3c00b80b0000e803000000900100`](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/extrinsics/decode/0x3c00b80b0000e803000000900100).

1. On the parachain now we have to compose an XCM message to notify the relay chain that we want to open a chanel with parachain B.

   The message should look similar to the following (using the encoded call data from the previous step):

   ```
   polkadotXcm.send(
       dest: V1
           parents: 1
           interior: Here
       message: V2
           XcmV2Instruction: WithdrawAsset
               id: Concrete
                   parents: 0
                   interior: Here
               fun: Fungible
                   Fungible: 1_000_000_000_000
           XcmV2Instruction: BuyExecution
               id: Concrete
                   parents: 0
                   interior: Here
               fun: Fungible
                   Fungible: 1_000_000_000_000
               weightLimit: Unlimited
           XcmV2Instruction: Transact
               originType: Native
               requireWeightAtMost: 4_000_000_000
                   encoded: 0x3c00b80b0000e803000000900100 // our hrmpInitOpenChannel encoded call data
           XcmV2Instruction: DepositAsset
             assets: Wild::All
             maxAssets: 1
             beneficiary:
               parents: 0
               interior: Parachain(2000)           
   )
   ```

   Keep in mind that you should compose your message taking into account the active XCM configuration, this is just an example.

## Parachain B actions

So far Parachain A has done its part: the request to Parachain B is sent.
Now this request has to be accepted by Parachain B.

The process repeats itself, but this time we will have to encode a different call.

1. On the relay chain, submit the following extrinsic and save the encoded call data:

   ```
   hrmp.hrmpAcceptOpenChannel(
       sender: 2000
   )
   ```

   The encoded call data on Rococo is: [`0x1701d0070000`](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/extrinsics/decode/0x1701d0070000)

1. Now on Parachain B we can use our last XCM message as a basis to compose this one, and execute it as a call on the relay chain (using the encoded call data from the previous step).

   ```
   polkadotXcm.send(
       dest: V1
           parents: 1
           interior: Here
       message: V2
           XcmV2Instruction: WithdrawAsset
               id: Concrete
                   parents: 0
                   interior: Here
               fun: Fungible
                   Fungible: 1_000_000_000_000
           XcmV2Instruction: BuyExecution
               id: Concrete
                   parents: 0
                   interior: Here
               fun: Fungible
                   Fungible: 1_000_000_000_000
               weightLimit: Unlimited
           XcmV2Instruction: Transact
               originType: Native
               requireWeightAtMost: 4_000_000_000
                   encoded: 0x1701d0070000 // our hrmpAcceptOpenChannel encoded call data

   )
   ```

Keep in mind that you should compose your message taking into account the active XCM configuration, this is just an example.

And that's it &mdash; the channel has been accepted and it will remain open, such that communication from Parachain A to Parachain B can now flow.
For making this a bidirectional channel you'll need to open another channel, from Parachain B to Parachain A.
You can do this by making a request from B and accepting it from A by following the same steps in this guide.
