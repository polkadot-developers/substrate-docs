---
title: Convert a solo chain
description:
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

This guide illustrates how to add Cumulus to a solo chain and use a relay chain to provide finality.

You will learn how to:

- Bootstrap a solo-chain's security
- Access XCMP with parachains on a common relay chain

The integration of Cumulus for any Substrate chain enables this chain to couple it's _finality_ with a
relay chain, like Polkadot.
This guide does _not_ inform on how to migrate a _running solo chain_, only the steps required to convert the _codebase_ of a node to use Cumulus for consensus instead of something like GRANDPA that is common for other Substrate solo chains.

## Parachain and solo chain node templates

The Substrate parachain template is similar to the Substrate node template.
Both templates include the `node`, `runtime`, and `pallets` directories and many of the same predefined pallets and traits.
You can follow most of the [tutorials](/tutorials/) using either template.
However, there are a few important differences between the node and parachain templates that you should take note of at the outset.

### Parachain info pallet

By default, the parachain template [runtime](https://github.com/paritytech/polkadot-sdk-parachain-template/blob/master/runtime/Cargo.toml) includes several parachain-specific pallets, including a [`parachain-info` pallet](https://paritytech.github.io/polkadot-sdk/master/staging_parachain_info/pallet/index.html).
This pallet is designed to inject the unique parachain identifier into the parachain runtime.
This information allows the runtime to know which cross-chain messages are intended for it.

### Validate block macro

Each parachain must supply a `validate_block` function—in the form of a WebAssembly blob—to the relay chain when it registers with that relay chain.
This function is only required for parachains, so it isn't included in the node template by default.
However, the parachain template creates this function for a Substrate runtime by adding the following code to the bottom of the runtime logic:

```rust
cumulus_pallet_parachain_system::register_validate_block!(
  Runtime = Runtime,
  BlockExecutor = cumulus_pallet_aura_ext::BlockExecutor::<Runtime, Executive>,
  CheckInherents = CheckInherents,
);
```

### Finality depends on the relay chain

The parachain template doesn't include any block finalization mechanism because parachains are intended to use the finality provided by the relay chain.
Relay chain finalization is a fundamental concept in the architecture of Polkadot and other relay chains.
In contrast, the Substrate node template and many other Substrate-based chains implement their own block finalization mechanism, typically using the GRANDPA pallet and associated API.

### Collator service

The collator service—[`node/src/service.rs`](https://github.com/paritytech/polkadot-sdk-parachain-template/blob/master/node/src/service.rs)—is entirely different in the parachain template from the similarly-named [`node/src/service.rs`](https://github.com/paritytech/polkadot-sdk-parachain-template/blob/master/node/src/service.rs) in the node template.
The collator service is explicitly designed as a wrapper to provide parachain-specific operations that a standard Substrate node doesn't require.

If you have an existing Substrate chain that you want to convert to a parachain, you should copy the [`node/src/service.rs`](https://github.com/paritytech/polkadot-sdk-parachain-template/blob/master/node/src/service.rs) from the parachain template as a starting point.
