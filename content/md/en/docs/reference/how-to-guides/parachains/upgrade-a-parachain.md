---
title: Upgrade a parachain
description:
keywords:
  - collators
  - parachains
  - upgrade
  - cumulus
  - storage
  - migration
---

The goal of this guide is to help parachain developers ensure that runtime upgrades succeed.

This guide illustrates:

- How to modify parachain runtimes (add/remove pallets)
- How to do a parachain storage migration

Runtime upgrades on a parachain have _much_ stricter requirements and a slightly different flow required as they you _must_ coordinate with the relay chain to facilitate this.
Because of this, and the very confined nature of state transition coordination both **quickly and succinctly** enough for the block inclusion in the relay chain.

## Before you continue

Before you attempt to upgrade the runtime for your parachain, verify the following:

- You are familiar with how to perform [Runtime upgrades](/maintain/runtime-upgrades) for Substrate nodes that don't connect to a relay chain.
- You have followed the steps to [Prepare a local relay chain](/tutorials/build-a-parachain/prepare-a-local-relay-chain) and are familiar with the interaction between the parachain collator nodes and the relay chain.
- You have access to `polkadot-launch` for testing.

## Choose your upgrade approach

If your existing Substrate chain has a very large state which you are migrating between different storage formats, it might not be possible to run all of the runtime migrations within one block.
There are a handful of strategies you can use to remedy this problem:

1. If the amount of storage items to be migrated can feasibly be processed within two or three blocks you can run the migrations using the [Scheduler pallet](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/scheduler) to ensure they get executed regardless of block producer.

1. Use versioned storage and only execute migrations when storage values that haven't yet been upgraded are accessed.
   This can cause variance in transaction fees between users and could potentially result in more complex runtime code.
   However, if properly metered (weights are properly benchmarked) this approach will ensure minimal downtime for migration.

1. If you must split your migrations among multiple blocks you can do it either on-chain or off-chain:

   - An on-chain multi-block migration will require custom pallet logic to be written which can either queue changes over time or use the Scheduler pallet to migrate chunks of storage at a time.

   - Instead of adding migration code to your runtime you can generate the migration manually off-chain and use multiple `system.setStorage` calls to add and remove storage items as necessary via an origin with root permission (for example democracy).
     If you are limited in the number of transactions you can make, you can batch multiple transactions to occur over time via the scheduler.

After your migration strategy is established, you should test the migration on a non-production testnet to ensure it will work _before_ you continue.

Testing in a confined network will help you prepare for potential failures in a real network with many collators and validators and constraints like bandwidth and latency.
The more closely you can simulate a real network for testing, the more sure you can be that your runtime upgrades will succeeds.

## Authorize -> enact an upgrade flow

When finally ready to upgrade a parachain, the relay chain needs to be informed about the runtime upgrade of your chain before it happens.
The [Cumulus](https://github.com/paritytech/polkadot-sdk/tree/master/cumulus) library provides functionality to help you notify the relay chain about the upcoming upgrade by:

1. **Using [`authorize_upgrade`](https://paritytech.github.io/cumulus/cumulus_pallet_parachain_system/pallet/struct.Pallet.html#method.authorize_upgrade)** to provide the hash of your upgrade and authorize it.
1. **Using [`enact_authorized_upgrade`](https://paritytech.github.io/cumulus/cumulus_pallet_parachain_system/pallet/struct.Pallet.html#method.enact_authorized_upgrade)** to provide the actual code for the upgrade.

With both these functions called, the relay chain will be notified that the new upgrade has been scheduled.

## Examples

- [Substrate migrations example repo](https://github.com/apopiak/substrate-migrations)
- [Staking pallet migration logic](https://github.com/paritytech/substrate/blob/6be513d663836c5c5b8a436f5712402a1c5365a3/frame/staking/src/lib.rs#L757)

## Resources

- [Runtime upgrade](/maintain/runtime-upgrades)
- [Fork off Substrate](https://github.com/maxsam4/fork-off-substrate)
- [`try-runtime`](/reference/command-line-tools/try-runtime)
- [`try-runtime` video workshop](https://www.crowdcast.io/e/substrate-seminar/41)
