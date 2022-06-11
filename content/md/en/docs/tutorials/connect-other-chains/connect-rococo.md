---
title: Connect to Rococo testnet
---

Rococo is Parity's public test network for cumulus-based parachains.
This section of the workshop steps through how you can onboard your parachain to it.

## Before you begin

Make sure you have successfully completed the [previous section](/tutorials/connect-other-chains/parachain) of this workshop and tested your parachain on your local machine.
This implies that:

- You're familiar with registering and reserving your unique para ID.
- You have your parachain's genesis state exported as a JSON file.
- You have your parachain's runtime Wasm blob.

**In addition, you will need 5 ROCs from the [Rococo faucet](https://matrix.to/#/#rococo-faucet:matrix.org) to register a para ID.**
Use the `!drip <accountID>` command in that channel to get 100 ROC before you continue.

Lastly, you MUST have you collator's peering ports for the embedded relay chain and your parachain publicly accessible and discoverable.
This way you are able to peer with Rococo validator nodes, otherwise you will not be able to produce blocks.
The peering port is set with the `--port <collator node>-- --port <relay node>` CLI flags, be sure to do this for _both_ nodes separately.
It's very likely you want at least your collator's `--ws-port <ws port>` port open as well to allow for yourself (and others) to connect with it via the Polkadot Apps UI or API calls.

## Register as a parathread

To get started with registering your chain as a parathread:

1. Go to [the Polkadot-JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/parachains/parathreads) parathreads section for Rococo.

1. Reserve a unique para ID. You will be assigned to the next available ID.

![paraid-reserve.png](../../../../src/images/tutorials/09-cumulus/paraid-reserve.png)

1. After successfully reserving your para ID, you can now register as a **parathread**.

![register-parathread.png](../../../../src/images/tutorials/09-cumulus/register-parathread.png)

1. Once your extrinsic succeeds, you will see a `registrar.Registered` event emitted.

![parathread-register-success.png](../../../../src/images/tutorials/09-cumulus/parathread-register-success.png)

1. Go to the [Parachains -> Parathreads](https://polkadot.js.org/apps/#/parachains/parathreads) page and you will see that your parathread registration is **Onboarding**:

![parathread-onboarding.png](../../../../src/images/tutorials/09-cumulus/parathread-onboarding.png)

After the extrinsic succeeds, it takes 2 sessions for the chain to fully onboard as a parathread.

## Request your parachain slot

Once the parachain is active as a parathread, the related project team should [open a request](https://github.com/paritytech/subport/issues/new?assignees=&labels=Rococo&template=rococo.yaml) for either a **permanent** or a **temporary parachain slot** on Rococo.

- **Permanent slots** are parachain slots assigned to teams who currently have a parachain slot on Polkadot (following a successful slot lease auction) and thus have the needs for continuously testing their codebase for compatibility with the latest bleeding edge features in a real-world live environment (Rococo).
  There is a limited number of permanent slots made available (see note below).

- **Temporary slots** are parachain slots that are dynamically allocated in a continuous rollover manner.
  Concretely, at every start of a lease period, a certain number of parathreads (up to a maximum defined in the relay chain's configuration) will be automatically upgraded to parachains for a certain duration.
  The parachains that were active during the ending lease period will be automatically downgraded to parathreads to free the slots for others to use in the subsequent one.
  The temporary slots are meant to be used by teams who do not have a parachain slot yet on Polkadot, and are aiming for one in the near future.

The goal of this more dynamic allocations aims at helping teams to test their runtimes more often, and in a more streamlined manner.

> **NOTE:**
>
> Rococo's runtime sets `AssignSlotOrigin = EnsureRoot<Self::AccountId>;` at this time, thus ONLY someone with sudo access can assign slots!
>
> The Rococo `sudo` key is presently controlled by Parity Technologies at this time, so to have the operation required to get a slot, please go to the [Subport repo and open a `Rococo Slot Request`](https://github.com/paritytech/subport/issues/new?assignees=&labels=Rococo&template=rococo.yaml) once you complete the above and are ready to connect!
> A Parity team member will initiate the slot for you ASAP.
>
> Long-term, the plan is to make it a community-driven process via Rococo's governance framework.

Using an account with the `AssignSlotOrigin` origin, follow these steps to assign a temporary slot:

1. In the [Polkadot-JS Apps for Rococo](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/extrinsics), go to `Developer -> Extrinsics`.
1. Select the account with enough ROC balance that you wish to use to submit a transaction with.
1. Select the `assignedSlots` pallet.
1. Choose the `assignTempParachainSlot` function.
1. Insert your reserved para ID. Make sure this matches the one you reserved from the previous section!
1. Select `Current` for the `LeasePeriodStart`. If the current slot is full, you will be assigned the next available slot.
1. Sign and submit the transaction.

Given a period lease duration of 1 day, the current settings for assigned parachain slots on Rococo are (at the time of writing):

- **Permanent slot least duration**: 1 year (365 days)
- **Temporary slot least duration**: 3 days
- **Maximum number of permanent slots**: up to 25 permanent slots
- **Maximum number of temporary slots**: up to 20 temporary slots
- **Maximum temporary slots allocated per leased period**: up to 5 temporary slots per 3-day temporary lease periods

These are subject to change, based on the needs of the community.

🎉**_Congratulations!_**🎉

With your slot activated by the Parity team, you're now able to test your parachain on the Rococo test net!
Please do note that when your temporary slot's lease ends, the parachain is automatically downgraded to a parathread. Registered and approved slots are cycled through automatically in a round-robin fashion, so you will expect to come back online as a parachain from time to time.
