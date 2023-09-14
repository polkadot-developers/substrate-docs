---
title: Use tight pallet coupling
description:
keywords:
---

Tight coupling two pallets is a technique to write pallets that re-use types and methods from an existing pallet.

It is useful for breaking up some runtime logic into separate pallets that need access to common type and methods.
To learn more about tight coupling and loose coupling between pallets, see [pallet coupling](/build/pallet-coupling).

This guide will show you how to use a method from an existing pallet inside your own.

## Before you begin

This guide assumes you have a pallet that you would like to couple another pallet with.
Use the [template pallet](https://github.com/substrate-developer-hub/substrate-node-template/blob/main/pallets/template/src/lib.rs) if you don't yet have a pallet to work with.

1. Configure your workspace

   Assume you want to use a pallet called `special-pallet`, which is a pallet in your local workspace.
   Import it by providing its path in your pallet's `Cargo.toml` file:

   ```toml
   special-pallet = { path = '../special-pallet', default-features = false }
   ```

1. Add a trait bound to your pallet

   Now all you need to do is create a trait bound around your pallet's configuration trait:

   ```rust
   pub trait Config: frame_system::Config + special_pallet::Config {
       // --snip--
   }
   ```

1. Use a getter function

   In order to use a method from `special_pallet`, call it the following way:

   ```rust
   // Get the members from `special-pallet` pallet
   let who = special_pallet::Pallet::<T>::get();
   ```

   The above snippet assumes that `special_pallet` contains a method called `get()` which returns a vector of account IDs.

## Examples

- FRAME's [Bounties](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/bounties)
  and [Tipping](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/tips) pallets with the Treasury pallet

## Resources

- [Pallet coupling](/build/pallet-coupling)
- [Loosely coupling two pallets](/reference/how-to-guides/pallet-design/use-loose-coupling/)
