---
title: Use loose pallet coupling
keywords:
---

This guide steps through how to reuse a function or type from another pallet using a technique called loose coupling.

Loose coupling is a technique that enables re-using logic from another pallet inside a pallet.
In this guide, we show the simple pattern of using a type from an outside pallet in our working pallet, by using trait bounds in our pallet's configuration trait. 
We will loosely couple a pallet to make use of the \`Currency\` trait from [\`frame_support\`](/rustdocs/latest/frame_support/traits/tokens/currency/trait.Currency.html).

## Configure your workspace

In the `Cargo.toml` file of the pallet in your working directory, make sure you specify the
pallet you want to couple to accordingly:

  ```toml
  [dependencies]
  frame-support = { default-features = false, git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.18", version = "4.0.0-dev" }

  # -- snip

  [features]
  default = ['std']
  std = [
    'frame-support/std',
  # -- snip
  ]
  ```

## Import the trait you want to use

In this example, we want to use the [`Currency` trait](/rustdocs/latest/frame_support/traits/tokens/currency/trait.Currency.html) from `frame_support` so that we can give our pallet access to the its methods.

Import the trait in your pallet:

```rust
use frame_support::traits::Currency;
```

## Create a type for your pallet's `Config` trait

1. In your configuration trait, create a type that is bound by the type you want to expose to your pallet  
(in `this-pallet/src/lib.rs`):

  ```rust
  pub trait Config: frame_system::Config {
      // --snip--

      /// A type that is accessing our loosely coupled pallet `my-pallet`
      type LocalCurrency: Currency<Self::AccountId>;
  }
  ```

1. Use the method that the type of your loosely coupled pallet provides (in `this-pallet/src/lib.rs`):

  ```rust
  // Use the getter from `my-pallet`
  let total_balance = T::LocalCurrency::total_issuance();
  ```

  In the above snippet, we're using [`total_issuance`](/rustdocs/latest/frame_support/traits/tokens/currency/trait.Currency.html#tymethod.total_issuance)
  that the Currency trait exposes from `frame_support`.

## Provide the implementation in runtime configuration

In our runtime configuration, usually `runtime/src/lib.rs`, we specify the `LocalCurrency` to be
`Balances`, which is defined inside `construct_runtime!` macro and has a type of `pallet_balances`
that [implements the `Currency` trait](/rustdocs/latest/pallet_balances/index.html#implementations-1).

```rust
impl my_pallet::Config for Runtime {
  type LocalCurrency = Balances;
}

construct_runtime! (
  pub enum Runtime where
  Block = Block,
  NodeBlock = opaque::Block,
  UncheckedExtrinsic = UncheckedExtrinsic
  {
    Balances: pallet_balances::{Pallet, Call, Storage, Config<T>, Event<T>},
  }
)
```
## Examples

- `try_origin` from the [`EnsureOrigin`](/rustdocs/latest/frame_support/traits/trait.EnsureOrigin.html) trait
  in FRAME's [Democracy pallet](https://github.com/paritytech/substrate/blob/master/frame/democracy/src/lib.rs#L294-L352)
- the use of `WeightInfo` in all FRAME pallets, such as the
  the [Identity pallet](https://github.com/paritytech/substrate/blob/master/frame/identity/src/lib.rs#L149-L151) and its use of its
  [specific weighting methods](https://github.com/paritytech/substrate/blob/master/frame/identity/src/weights.rs#L46-L64)
- the [`KeyOwnerProofSystem` trait](/rustdocs/latest/frame_support/traits/trait.KeyOwnerProofSystem.html)
  [used in `pallet_grandpa`](https://github.com/paritytech/substrate/blob/master/frame/grandpa/src/lib.rs#L106)

## Resources

- [Pallet coupling](/vmain-docs/build/pallet-coupling)
- [Tightly Coupling two pallets](../tight-coupling)
