---
title: Rococo testnet slot acquisition
description: Acquire a slot on Rococo - a public test network for parachains
keywords:
  - rococo
  - testnet
  - faucet
  - relay chain
---

<!-- TODO NAV.YAML -->
<!-- TODO migrate to HTG section once live! This isn't a really a "tutorial" worthy item. -->

<!-- TODO Stand alone Rococo page instead of the wiki when ready. -->

[Rococo](https://wiki.polkadot.network/docs/build-pdk#rococo-testnet) is Parity's public test network for parachains.
This will guide you through how you can onboard your parachain to it.

## Before you begin

Because Rococo is a shared test network, this tutorial requires additional steps to prepare your environment that aren't required for local testing.
Before you begin, verify the following:

- You know how to generate and modify chain specification files as described in [Add trusted nodes](/tutorials/get-started/trusted-network/).
- You know how to generate and store keys using one of the methods described in [Add trusted nodes](/tutorials/get-started/trusted-network/).
- You have completed the [parachain tutorial](/tutorials/connect-other-chains/local-parachain/) and tested a parachain on your local computer.

## Set up a wallet

To perform any action on Rococo, you need ROC tokens.
To store these, you need a Substrate compatible cryptocurrency wallet.
For this operations in any public setting, you can not use [development keys and accounts](/reference/command-line-tools/subkey/#predefined-accounts-and-keys).
There are many options available for setting up wallet account.
For information about some of these options, see the [Build wallets](https://wiki.polkadot.network/docs/build-wallets) on the Polkadot wiki.
If you are just getting started, you can use the [`polkadot-js` extension](https://github.com/polkadot-js/extension).
After you have an account, be sure to:
- Back up your secret seed phrase.
- Make note of your `accountID` that is using the default 42 [SS58 prefix](/reference/glossary/#ss58-address-format) for use with Rococo.

To acquire ROC, join the [Rococo faucet matrix channel](https://matrix.to/#/#rococo-faucet:matrix.org) and use the `!drip <accountID>` command in the faucet channel to get 100 ROC in your wallet.

## Acquire a ParaID

With a minimal 5 ROC free balance, register as a parathread on Rococo:

1. Go to [the Polkadot-JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/parachains/parathreads) parathreads section for Rococo.

1. Reserve a unique `ParaID`. You will be assigned to the next available ID - **make note of this**.

![paraid-reserve.png](/media/images/docs/tutorials/09-cumulus/paraid-reserve.png)

Note that on Rococo, `ParaID` numbers `0-999` are reserved for [system parachains](https://wiki.polkadot.network/docs/learn-common-goods#system-level-chains) and `1000-1999` are reserved for [public utility parachains](https://wiki.polkadot.network/docs/learn-common-goods#public-utility-chains).
Only numbers `2000` and above that aren't already reserved can be used for community parachains.

## Generate parachain genesis and Wasm files

The files required to register a parachain must explicitly specify the correct relay chain and the right `ParaID`.
In this tutorial, the relay chain is `rococo` instead of `rococo-local` used in the [Connect a local parachain](/tutorials/connect-other-chains/local-parachain/) tutorial.

1. Configure your chain specification to use:
   - Your Rococo `ParaID`.
   - Unique alternatives to the [development keys and accounts](/reference/command-line-tools/subkey/#predefined-accounts-and-keys) for your collator nodes.
     While `Alice` and such accounts _will work_ you should absolutely not use them!
1. Generate the appropriate parachain's genesis state for Rococo.
1. Generate the parachain runtime Wasm blob for Rococo.

## Start your collator

You must have your collator's peering ports for the embedded relay chain and your parachain publicly accessible and discoverable.
This way you are able to peer with Rococo validator nodes, otherwise you will not be able to produce blocks!
The peering port is set with the `--port <collator node>-- --port <relay node>` CLI flags, be sure to do this for _both_ nodes separately.
It's very likely you want at least your collator's `--ws-port <ws port>` port open as well to allow for yourself (and others) to connect with it via the Polkadot Apps UI or API calls.

## Register as a parathread

Before you can become a parachain, you must register as a parathread on Rococo:

1. Register as a **parathread**. using your reserved `ParaID`.

![register-parathread.png](/media/images/docs/tutorials/09-cumulus/register-parathread.png)

1. Check that you see a `registrar.Registered` event in the Polkadot-JS application to verify registration succeeded.

![parathread-register-success.png](/media/images/docs/tutorials/09-cumulus/parathread-register-success.png)

1. Click [Parachains -> Parathreads](https://polkadot.js.org/apps/#/parachains/parathreads) and verify that your parathread registration is **Onboarding**:

![parathread-onboarding.png](/media/images/docs/tutorials/09-cumulus/parathread-onboarding.png)

After the extrinsic succeeds, it takes [2 sessions](https://wiki.polkadot.network/docs/glossary#session) for the chain to fully onboard as a parathread.

## Request your parachain slot

After the parachain is active as a parathread, the related project team should [open a request](https://github.com/paritytech/subport/issues/new?assignees=&labels=Rococo&template=rococo.yaml) for either a **permanent** or a **temporary parachain slot** on Rococo.

- **Permanent slots** are parachain slots assigned to teams who currently have a parachain slot on Polkadot (following a successful slot lease auction) and thus have the needs for continuously testing their codebase for compatibility with the latest bleeding edge features in a real-world live environment (Rococo).
  Only a limited number of permanent slots are available (see note below).

- **Temporary slots** are parachain slots that are dynamically allocated in a continuous, round-robbin style roation.
  At the start of every lease period, a certain number of parathreads—up to a maximum defined in the relay chain's configuration—are automatically upgraded to parachains for a certain duration.
  The parachains that were active during the ending lease period are automatically downgraded to parathreads to free the slots for others to use in the subsequent period.
  The temporary slots are meant to be used by teams who do not have a parachain slot yet on Polkadot, and are aiming for one in the near future.

The goal dynamic allocations is to help teams test their runtimes more often, and in a more streamlined manner.

The Rococo runtime requires `sudo` access to assign slots (`AssignSlotOrigin = EnsureRoot<Self::AccountId>;`).
The Rococo `sudo` key is currently controlled by Parity Technologies at this time, so to have the operation required to get a slot, please go to the [Subport repo and open a `Rococo Slot Request`](https://github.com/paritytech/subport/issues/new?assignees=&labels=Rococo&template=rococo.yaml) once you complete the above and are ready to connect!
A Parity team member will respond once your slot has been activated.
Eventually, this process is intended to be community-driven through the Rococo governance framework.

Using an account with the `AssignSlotOrigin` origin, follow these steps to assign a temporary slot:

1. Open [Polkadot-JS Apps for Rococo](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/extrinsics).
1. Click **Developer** > **Extrinsics**.
1. Select the account you want to use to submit the transaction.
1. Select the `assignedSlots` pallet.
1. Choose the `assignTempParachainSlot` function.
1. Insert your reserved `ParaID`. 
   Make sure you use the ParaID you previously reserved.
1. Select `Current` for the `LeasePeriodStart`.
   If the current slot is full, you will be assigned the next available slot.
1. Sign and submit the transaction.

Given a period lease duration of 1 day, the current settings for assigned parachain slots on Rococo are (at the time of writing):

- **Permanent slot least duration**: 1 year (365 days)
- **Temporary slot least duration**: 3 days
- **Maximum number of permanent slots**: up to 25 permanent slots
- **Maximum number of temporary slots**: up to 20 temporary slots
- **Maximum temporary slots allocated per leased period**: up to 5 temporary slots per 3-day temporary lease periods

These are subject to change, based on the needs of the community.

**_Congratulations!_**

After your slot is activated by the Parity team, you can test your parachain on the Rococo test network.
Note that when your temporary slot's lease ends, the parachain is automatically downgraded to a parathread.
Registered and approved slots are cycled through automatically in a round-robin fashion, so you can expect to come back online as a parachain from time to time.

## Next steps

After rigorous testing and validation of your parachain, you should consider joining the _production_ [Kusama network](https://kusama.network/) though a [slot auction](https://guide.kusama.network/docs/learn-auction/)!