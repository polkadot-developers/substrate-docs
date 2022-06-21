---
title: Deploy on a testnet
description:
keywords:
---

A typical parachain project will undergo several network testing phases before it is ready for a production environment.
Projects that are ready to deploy their chain to a live testnet are highly recommended to create and maintain their own testnet before connecting to one.
Here's what the progression from starting as a solo chain to deploying on a parachain test network looks like:

- Start a single node local network, using Cumulus and a local relay chain.
- Use Polkadot launch to create a local test network with multiple relay chain nodes and parachain nodes.
- Deploy on Rococo, the community live test network.

**Cumulus** exists to help convert a solo chain into a parachain designed to connect to the Polkadot relay chain.
Any solo chain must use Cumulus to become a parachain compatibile with Polkadot, Kusama and Rococo.
Using Cumulus also makes it easy to set up a local test network for parachains and eventually connect to Rococo.

**Polkadot launch** is a tool for launching a test network with several parachain collator nodes already connected to it.
This makes it a valuable tool for creating a testnet to connect to and test cross-chain interactions.
It is designed for projects who have already updated their chains to parachains using Cumulus and are looking to bootstrap their own local test networks.

### Connecting to Rococo

Rococo is a community test network for parachains, designed to provide a way for teams to regularly test their runtimes in a near-real environment.
Since it's a live relay chain, a limited number of slots must be respected and slots must be reserved using freely available ROC tokens.
Currently, there are two types of slots:

- **Permanent slots** are parachain slots assigned to teams who currently have a parachain slot on Polkadot and have a need to continuously test their codebase for compatibility with the latest bleeding edge features in a real-world live environment.
- **Temporary slots** are parachain slots that are dynamically allocated in a continuous rollover manner.

At every start of a lease period, a certain number of parathreads will be automatically upgraded to parachains for a certain duration.
The parachains that were active during the ending lease period will be automatically downgraded to parathreads to free the slots for others to use.
The temporary slots are meant to be used by teams who do not have a parachain slot yet on Polkadot, and are aiming for one in the near future.

The goal of having dynamic allocations aims to help teams to test their runtimes more often, and in a more streamlined manner.
Requesting a permanent or temporary parachain slot is currently a privileged (sudo) operation performed by the test chain's operator.
The long-term plan is to make it a community-driven process via the chain's governance framework.

Note that on Rococo, `ParaID` numbers `0-999` are reserved for [system parachains](https://wiki.polkadot.network/docs/learn-common-goods#system-level-chains) and `1000-1999` are reserved for [public utility parachains](https://wiki.polkadot.network/docs/learn-common-goods#public-utility-chains).
Only numbers `2000` and above that aren't already reserved can be used for community parachains.

### Checklist

Things to be mindful of when setting up a test network and connecting to it:

- [ ] Reserve a unique para ID, choosing an integer greater than `2000`.
- [ ] Your parachain genesis state starts at block 0. It is not possible to connect a parachain with any previous state to a relay chain.
- [ ] Make sure that the para ID for your parachain is the same in the chain spec of both the relay chain and your parachain. You can verify this by checking that the genesis head of the parathread you create matches the genesis head from your relay chain node.
- [ ] After you modify a plain chain spec with a new para ID for example, make sure to generate the new raw chain spec, name it appropriately and discard the plain chain spec to avoid potential confusion.
- [ ] For better security, verify that the chain specification for your relay chain has a minimum of 2 relay chain nodes per collator node.

## Learn how

- Follow this guide on converting your solo chain to a parachain
- Follow this guide on how to deploy a local test network using Polkadot laucnh
- Following this guide on how to request a slot on Rococo
