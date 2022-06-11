---
title: Convert a Solo-Chain to a Parachain
keywords:
  - collator
  - parachain
  - parathread
  - upgrade
  - cumulus
  - storage
  - migration
  - paraid
  - register
  - launch
  - convert
---

This guide will show you how to add Cumulus to a solo chain and use a relay chain to provide finality.
  
You will learn how to:

- Bootstrap a solo-chain's security
- Access XCMP with Parachains on a common relay chain

The integration of Cumulus for any Substrate chain enables this chain to couple it's _finality_ with a
relay chain, like Polkadot. 
This guide does _not_ inform on how to migrate a _running solo-chain_, only the steps required to convert the _codebase_ of a node to use Cumulus for consensus instead of something like GRANDPA that is common for other Substrate solo-chains.

<!-- FIXME TODO WORK IN PROGRESS - NOT COMPLETE! -->

This is an _overview_, not a proper how-to guide presently!

## Parachain node template overview

Substrate developers who are familiar with the Substrate node template will find the Substrate parachain template familiar.
They have the same general structure featuring `node`, `runtime`, and `pallets` directories.
Their runtimes are similar and feature many of the same pallets. Apart from a few new traits, the `pallet-template` itself is essentially identical.
Many of the [tutorials](/tutorials/v3) can be used with few modifications on the parachain template.

The similarities between these two templates should give you confidence that if you've built a Substrate chain, you will have no problem building a parachain!

### Differences from the node template

There are, however, a few important differences between the two templates that are worth observing at the outset.

#### Parachain info pallet

Parachain template runtime ([`runtime/Cargo.toml`](https://github.com/substrate-developer-hub/substrate-parachain-template/blob/latest/runtime/Cargo.toml)) has integrated [`parachain-info` pallet](https://paritytech.github.io/cumulus/parachain_info/pallet/index.html) in.
This pallet is designed to inject information about the parachain's registration into its own runtime.
Currently it just injects the para ID that the chain is registered at.
This allows the runtime to know which cross-chain messages are intended for it.

#### `register_validate_block!` macro

Each parachain must supply a `validate_block` function, expressed as a Wasm blob, to the relay chain when registering.
The node template does not provide this function, but the parachain template does,
Thanks to cumulus, creating this function for a Substrate runtime is as simple as adding one line of code as shown [at the bottom of the runtime](https://github.com/substrate-developer-hub/substrate-parachain-template/blob/latest/runtime/src/lib.rs#L648-L652):

```rust
cumulus_pallet_parachain_system::register_validate_block!(
  Runtime = Runtime,
  BlockExecutor = cumulus_pallet_aura_ext::BlockExecutor::<Runtime, Executive>,
  CheckInherents = CheckInherents,
);
```

#### No `GRANDPA` pallet

Many popular Substrate runtimes including the node template features a finality-related GRANDPA pallet and its associated `GrandpaApi`.
These are both missing from the parachain template.

This is because parachains follow the finality of the relay chain rather than running their own finality gadget.
This is fundamental to Polkadot's architecture and will not change.

#### Service

The collator service ([`node/src/service.rs`](https://github.com/substrate-developer-hub/substrate-parachain-template/blob/latest/node/src/service.rs)) is entirely different from the one of Node template.
While you can find similarities, the structure of the service is much different.
This new service is the primary change that cumulus provides.

When modifying an existing Substrate chain to use Cumulus, it is generally best to copy the service code from the parachain template.
