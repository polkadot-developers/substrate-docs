---
title: Import a pallet
description:
keywords:
  - basics
  - beginner
  - runtime
---

This guide demonstrates how to quickly integrate both local and external pallets in a runtime.
For more detailed step-by-step instructions, see [Add a pallet to the runtime](/tutorials/build-application-logic/add-a-pallet).

This guide illustrates:

- How to include a custom local pallet that implements an event and a call for the runtime.
- How to include an external pallet from `Crates.io` in the runtime.

## Create a local pallet

1. Create a local pallet called `pallet_something`.

1. Import this pallet by adding the following to `/runtime/src/lib.rs`:

   ```rust
   // Import your pallet.
   pub use pallet_something;
   ```

1. Configure your pallet's runtime implementation.
   Assume the local pallet only has the `Event` and `Call` types exposed to the runtime. Add the following to `/runtime/src/lib.rs`:

   ```rust
   // Configure your pallet.
   impl pallet_something::Config for Runtime {
   	type RuntimeEvent = RuntimeEvent;
   	type RuntimeCall = RuntimeCall;
   }
   ```

1. Declare your pallet for the [`construct_runtime` macro](/reference/frame-macros/#construct_runtime):

   ```rust
   construct_runtime!(
   	pub enum Runtime where
   	Block = Block,
   	NodeBlock = opaque::Block,
   	UncheckedExtrinsic = UncheckedExtrinsic
   	{
   		/* --snip-- */
   		Something: pallet_something,
   		/* --snip-- */
   	}
   );
   ```

1. Update `/runtime/Cargo.toml`

   In `/runtime/Cargo.toml`, include your pallet as a local dependency in `std` and add `runtime-benchmarks`.
   For example:

   ```toml
   # --snip--
   pallet-something = { default-features = false,   path = '../pallets/something'
   version = '3.0.0'
   # --snip--
   [features]
   default = ['std']
   runtime-benchmarks = [
     # --snip--
     'pallet-something/runtime-benchmarks',
   ]
   std = [
     'pallet-something/std',
     # --snip--
   ]
   ```

## Import an external pallet

To add an external pallet, you use a similar method to the one you used with the local pallet, but you must include all of the types your pallet exposes.
You must also include the relevant parameter types and constants.
For examples of how to declare parameters and constants, see [`pallet_timestamp`](https://paritytech.github.io/substrate/master/pallet_timestamp/index.html).

The following is an example of how you would add an external pallet to the `/runtime/Cargo.toml` dependencies if the pallet is hosted on [crates.parity.io](https://crates.parity.io/):

```toml
[dependencies]
pallet-external = {default-features = false, git = "https://github.com/paritytech/substrate.git", version = "4.0.0-dev"}

# --snip--
runtime-benchmarks = [
  /* --snip */
  'pallet-external/runtime-benchmarks',
]
std = [
  'pallet-external/std',
  # --snip--
]
```

## Examples

- [Template pallet](https://paritytech.github.io/substrate/master/pallet_template/index.html)
- [Timestamp pallet](https://paritytech.github.io/substrate/master/pallet_timestamp/index.html)

## Related material

- [Timestamp Pallet associated types](https://paritytech.github.io/substrate/master/pallet_timestamp/index.html)
- [FRAME `pallet-timestamp`](https://crates.io/crates/pallet-timestamp)
- [Unit test](/test/unit-testing)
