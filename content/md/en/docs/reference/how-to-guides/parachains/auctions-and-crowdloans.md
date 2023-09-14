---
title: Auctions and crowdloans
description:
keywords:
  - parachain
  - slot
  - loan
  - crowdloan
  - auction
---

Ready to launch a parachain on a _production network_ like Polkadot or Kusama?
You must to acquire a slot in a [parachain slot auction](https://wiki.polkadot.network/docs/learn-auction).

> Please first try everything out on the [Rococo Testnet](/tutorials/build-a-parachain/acquire-a-testnet-slot/) before you attempt to go on a production network!

As the total amount of DOT or KSM required to be locked for a slot is relatively large for most, [crowdloans](https://wiki.polkadot.network/docs/learn-crowdloans) are typically used to as the community to contribute to a pool used to participate in the auction.

Once you have read the two articles above, please see below for the more developer focused how-to on configuring crowdloans and bidding.

### Register as a Parathread

All parachains will need to register as a parathread first.
You will need:

- A deposit to register a `ParaID` (network dependant)

- Reserve a unique `ParaID`. This will be assigned to the next available ID.
  This integer will be greater than `2000`, as `0-999` are reserved for [system parachains](https://wiki.polkadot.network/docs/learn-common-goods#system-level-chains) and `1000-1999` are reserved for [public utility parachains](https://wiki.polkadot.network/docs/learn-common-goods#public-utility-chains).

- Your parachain genesis state.
  Refer to the genesis state export process in the [Prepare a local relay chain](/tutorials/build-a-parachain/prepare-a-local-relay-chain/).

- Your parachain Wasm runtime.
  Refer to the Wasm runtime export process in the [Prepare a local relay chain](/tutorials/build-a-parachain/prepare-a-local-relay-chain/).

The procedure will be as followed:

- Go to Polkadot-JS Apps parathreads section on the **_correct relay chain_** [here](https://polkadot.js.org/apps/#/parachains/parathreads).

- Reserve for the next available `ParaID`.

  ![paraid-reserve.png](/media/images/docs/tutorials/parachains/paraid-reserve.png)

- After successfully reserving your `ParaID`, you can now register as a **Parathread**.

  ![register-parathread.png](/media/images/docs/tutorials/parachains/register-parathread.png)

- Once your extrinsic succeeds, you will see the `registrar.Registered` event being emitted.

  ![parathread-register-success.png](/media/images/docs/tutorials/parachains/parathread-register-success.png)

- Also in the Polkadot-JS Apps [Parachains -> Parathreads](https://polkadot.js.org/apps/#/parachains/parathreads) page and you will see your parathread registration is **Onboarding**:

  ![parathread-onboarding.png](/media/images/docs/tutorials/parachains/parathread-onboarding.png)

After the extrinsic succeeds, it takes [**2 sessions**](#relevant-settings) for the chain to fully onboard as a parathread.

### Parachain Slot Auction

Parathread can then be transformed to parachain by winning a parachain slot auction.
This guarantees the now parachain will always have their block data hashed and included in the relay chain block (called Proof of Validation, or short for **PoV**), during the slot duration they are alloted.

**Only fully-onboarded parathreads are eligible to bid in a parachain slot auction.**
Common goods chains can bypass auctions and become parachains through on-chain governance decision.

#### Relevant Settings

> **Some _critical_ setting in the network dependant! These affect timing behavior on some parachain operations, and are subject to change!**

- Session length
- Lease Period Length
- Ending Period
- Current Lease Period Index = Current Block Number / 14400

Note that transitions of a parachain/Parathread into a different state will take at least 2 sessions, including on-boarding, off-boarding, upgrading, downgrading, etc.

Find these settings on the [Polkadot wiki](https://wiki.polkadot.network/docs/learn-crowdloans#starting-a-crowdloan-campaign) and the [source of the runtime](https://github.com/paritytech/polkadot-sdk/tree/master/polkadot/runtime) presently running on your target relay chain.
It is _absolutely essential_ that you understand these parameters before you commit to them.

#### Bidding

Anyone with a fully onboarded parathread can make a bid to win a parachain slot for their `ParaID`.
They need to out-bid all others participating in the slot auction.

You can do so in Polkadot-JS App [Network -> Parachains -> Auctions](https://polkadot.js.org/apps/#/parachains/auctions) page (make sure you are on the right network).

Pick your `ParaID`, how much you want to bid, and the slots you want to bid for:

![parachain-bid.png](/media/images/docs/tutorials/parachains/parachain-bid.png)

### Crowdloans

You may also choose to harness your community and get their supports in winning the parachain slot auction.
In this case, you would start a crowdloan campaign so your supporters can loan your project their tokens to win the auction.
These tokens will be held in custody during the auction process, and if won, the whole slot leasing duration also.

You will not do this for a testnet parachain slot, but you may consider this option for a mainnet parachain slot.

#### Start a Crowdloan Campaign

In the following, we are getting ready to submit an extrinsic to start a crowdloan.

![parachain-bid.png](/media/images/docs/tutorials/parachains/parachain-crowdloan.png)

Notes on the parameters:

- `parachain id`: You can only create a crowdloan campaign for a `ParaID` that you registered.

- `crowdfund cap`: The maximum amount your crowdloan campaign can collect.
  This is just a responsible measure for getting external support.

- `ending block`: This is when you want your crowdloan to end.
  If you know an auction will start in 3 days, and last for 5 days, you probably want to set your crowdloan to end in 10 days, a time with a little buffer at the end.
  This way you will be sure that your crowdloan is active during the entire auction process.
  On the other hand, you don't want to set your crowdloan period to be too long, or else prolong the community funds lock up period unnecessarily and discouraging them to participate in your campaign.

- `first period` / `last period`: The slot duration you want to bid for.
  So if the current auction has slots 3 - 6 open, these values can be any number in between.

- You can cancel a crowdloan as long as you have not received a contribution.

If your extrinsic succeeds, you can see your new crowdloan entry in [Network -> Parachains -> Crowdloan page](https://polkadot.js.org/apps/#/parachains/crowdloan):

![crowdloan-success.png](/media/images/docs/tutorials/parachains/crowdloan-success.png)

#### Fund a Crowdloan Campaign

Any accounts with a free balance and elect to contribute to your campaign, including the same account that started this campaign.

You can goto the same [Crowdloan page](https://polkadot.js.org/apps/#/parachains/crowdloan) above, and choose **+ Contribute** on the campaign you want to support.

You will see an extrinsic pop up similar to the following:

![crowdloan-contribute.png](/media/images/docs/tutorials/parachains/crowdloan-contribute.png)

Input the funding amount your want to support and submit the transaction.
