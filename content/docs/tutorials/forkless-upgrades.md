---
title: Initiate a Forkless Runtime Upgrade
description: Perform a forkless runtime upgrade on a running Substrate network.
featured_image: /media/images/docs/tutorials/forkless-upgrades/thumbnail.jpg
keywords:
  - runtime upgrades
  - forkless
  - schedular pallet
difficulty: 1
duration: 120
skills:
  - Rust
  - Blockchain basics
  - FRAME
  - Wasm
---

## Introduction

One of the defining features of the Substrate blockchain development framework is its support for
**forkless runtime upgrades**. Forkless upgrades are a means of enhancing a blockchain runtime in a
way that is supported and protected by the capabilities of the blockchain itself. A blockchain's
[runtime](/v3/concepts/runtime) defines the [state](/v3/runtime/storage) the
blockchain can hold and also defines the logic for effecting changes to that state.

![node-diagram.png](/media/images/docs/tutorials/build-blockchain/thumbnail.jpg)
![node-diagram.png](/media/images/docs/tutorials/forkless-upgrade/fu-thumbnail.jpg)

Substrate makes it possible to deploy enhanced runtime capabilities (**including _breaking_ changes(!)**)
without a [hard fork](/v3/getting-started/glossary#fork). Because the definition of the
runtime is itself an element in a Substrate chain's state, network participants may update this
value by way of an [extrinsic](/v3/concepts/extrinsics), specifically
[the `set_code` function](/rustdocs/latest/frame_system/pallet/enum.Call.html#variant.set_code).
Since updates to runtime state are bound by the blockchain's consensus mechanisms and cryptographic
guarantees, network participants can use the blockchain itself to trustlessly distribute updated or
extended runtime logic without needing to fork the chain or even release a new blockchain client.

This tutorial will use the Substrate Developer Hub
[node template](https://github.com/substrate-developer-hub/substrate-node-template) to explore two
mechanisms for forkless upgrades of [FRAME](/v3/runtime/frame)-based runtimes.
First, the
[`sudo_unchecked_weight`](/rustdocs/latest/pallet_sudo/pallet/enum.Call.html#variant.sudo_unchecked_weight)
function from the [Sudo pallet](/v3/runtime/frame#sudo) will be used to perform an
upgrade that adds the [Scheduler pallet](/v3/runtime/frame#scheduler). Then, the
[`schedule`](/rustdocs/latest/pallet_scheduler/pallet/enum.Call.html#variant.schedule)
function from the Scheduler pallet will be used to perform an upgrade that increases the
[existential (minimum) balance](/v3/getting-started/glossary#existential-deposit)
for network accounts.

If you have problems with this tutorial, the Substrate community is full of helpful resources! We
maintain an active
[Substrate Technical chat room](https://matrix.to/#/#substrate-technical:matrix.org) and
monitor the
[`substrate` tag on Stack Overflow](https://stackoverflow.com/questions/tagged/substrate). You can
also use the [`subport` GitHub repository](https://github.com/paritytech/subport/issues/new) to
create an Issue.

[[info]]
| Please do note that your problem may already solved on Stackoverflow or Subport do a search first for keywords in your error messages and concepts, and if you found them useful as well, comment to let us know that it\'s a common issue to escalate for a fix.

## Next Steps

- Learn about [storage migrations](/v3/runtime/upgrades#storage-migrations) and
  attempt one alongside a runtime upgrade.
- Explore the [how-to guides section on storage migrations](/how-to-guides/v3/storage-migrations/basics).
