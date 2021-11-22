---
title: Runtime Upgrades
slug: /how-to-guides/v3/parachains/runtime-upgrades
version: polkadot-0.9.11
section: how to guides
category: parachains
difficulty: 3
keywords: collators, parachains, upgrade, cumulus, storage, migration
---

<Objectives
  data={[
    {
      title: 'Goal',
      description: 'Ensure that parachain runtime upgrades succeed.',
    },
    {
      title: 'Use Cases',
      description: `
  - Modifying parachain runtimes (add/remove pallets)
  - Parachain storage migrations
      `,
    },
    {
      title: 'Overview',
      description: `
  Runtime upgrades on a parachain have _much_ stricter requirements and a slightly different
  flow required as they you _must_ coordinate with the relay chain to facilitate this. Because
  of this, and the very confined nature of state transition coordination both
  **quickly and succinctly** enough for the block inclusion in the relay chain.
      `,
    },
  ]}
/>

## Before you continue

Please do the folowing:

- Read the general [runtime upgrade docs](/v3/runtime/upgrades).
- Complete the [cumulus tutorial](/tutorials/v3/cumulus/start-relay), and learn the
  `polkadot-launch` tool for testing.

## Steps

### 1. Choose your upgrade approach

If your existing Substrate chain has a very large state which you are migrating
between different storage formats, it might not be possible to run all of the
runtime migrations within one block. There are a handful of strategies you can
use to remedy this problem:

1. If the amount of storage items to be migrated can feasibly be processed
   within two or three blocks you can run the migrations using the
   [Scheduler pallet](https://github.com/paritytech/substrate/tree/master/frame/scheduler)
   to ensure they get executed regardless of block producer.

1. Use versioned storage and only execute migrations when storage values that
   haven't yet been upgraded are accessed. This can cause variance in
   transaction fees between users and could potentially result in more complex
   runtime code. However, if properly metered (weights are properly benchmarked)
   this approach will ensure minimal downtime for migration.

1. If you must split your migrations among multiple blocks you can do it either
   on-chain or off-chain:

   - An on-chain multi-block migration will require custom pallet logic to be
     written which can either queue changes over time or use the Scheduler
     pallet to migrate chunks of storage at a time.

   - Instead of adding migration code to your runtime you can generate the
     migration manually off-chain and use multiple `system.setStorage` calls to
     add and remove storage items as necessary via an origin with root
     permission (for example democracy). If you are limited in the number of
     transactions you can make, you can batch multiple transactions to occur
     over time via the scheduler.

<Message
  type={`red`}
  title={`You need to test!`}
  text={`
After your migration strategy is established, you absolutely should test this migration on a
non-production testnet to _ensure_ it will work _before_ you continue!
See the [how-to guide on storage migration testing](/how-to-guides/v3/storage-migrations/tests) to
proceed.
\n
Also keep in mind that testing in a confined small dummy network will tests your failure modes in a
real network with latency and many collators and validators. The closer you can get to testing this
in the same environment, the more sure you can be that your runtime upgrades will not fail.
`}
/>

### 2. Authorize -> enact an upgrade flow

When finally ready to upgrade a parachain, the relay chain needs to be informed about the runtime
upgrade of your chain before it happens.
[Cumulus][https://github.com/paritytech/cumulus#cumulus-cloud] provides functionality to help you
notify the relay chain about the upcoming upgrade by:

1. **Using [`authorize_upgrade`](https://paritytech.github.io/cumulus/cumulus_pallet_parachain_system/pallet/struct.Pallet.html#method.authorize_upgrade)** to provide the hash of your upgrade and authorize it.
1. **Using [`enact_authorized_upgrade`](https://paritytech.github.io/cumulus/cumulus_pallet_parachain_system/pallet/struct.Pallet.html#method.enact_authorized_upgrade)** to provide the actual code for the upgrade.

With both these functions called, the relay chain will be notified that the new
upgrade has been scheduled.

## Examples

- [Substrate migrations example repo](https://github.com/apopiak/substrate-migrations)
- [Staking pallet migration logic](https://github.com/paritytech/substrate/blob/6be513d663836c5c5b8a436f5712402a1c5365a3/frame/staking/src/lib.rs#L757)

## Resources

- [Regular runtime upgrade docs](/v3/runtime/upgrades)
  - [Fork Off Substrate tool](https://github.com/maxsam4/fork-off-substrate)
- [`try-runtime` tool](/v3/tools/try-runtime)
  - [`try-runtime` video workshop](https://www.crowdcast.io/e/substrate-seminar/41)
- [Storage migrations Guide](/how-to-guides/v3/storage-migrations/basics)
  - [Storage migration testing Guide](/how-to-guides/v3/storage-migrations/tests)
  - [Substrate Builders Program Storage Migration Discussion](https://drive.google.com/file/d/19HPFUmSQIxVkxaVSg1SWveSdvjHUw1b8/view?usp=sharing)
