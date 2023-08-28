---
title: Use loose pallet coupling
description:
keywords:
---

This guide demonstrates how to reuse a function or type from one pallet in another pallet using a technique called **loose coupling**.

Loose coupling enables you to reuse part of the logic defined in an external pallet inside your current pallet.
This guide illustrates loose coupling by using the trait bounds in a pallet's configuration trait to reuse a type that's declared in an external pallet.
In this example, the current pallet makes use of a method for the `Currency` trait from the [`frame_support`](https://paritytech.github.io/substrate/master/frame_support/traits/tokens/currency/trait.Currency.html) pallet.

## Steps preview

1. Configure your workspace manifest to include the external pallet.
2. Import the trait you want to use.
3. Add a type to the configuration trait.
4. Provide the implementation in the runtime.

## Configure your workspace manifest

For the pallet in your working directory to reuse code from another pallet, the external pallet must be included in the list of package dependencies that are imported for your pallet.
Therefore, the manifest in the `Cargo.toml` file for your project must specify the
pallet you want to import.
In this example, you are reusing `Currency` trait information from the `frame-support` pallet, so you must ensure that `frame-support` is included in the `dependencies` and `features` sections of the manifest.

To configure your workspace manifest:

1. Open a terminal shell on your computer and navigate to the root directory for your project.
   
2. Open the manifest `Cargo.toml` file in a text editor.
   
3. Add the you are loosely coupling with to the dependencies.
   
   For example:
   
   ```text
   [dependencies]
   frame-support = { default-features = false, git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v1.0.0"}
   ```
   
   Note that you should use the same branch and version information for all of the pallets to ensure that the imported pallets are compatible with each other.
   Using pallets from different branches can result in compiler errors.
   This example illustrates adding the `frame-support` pallet to the `Cargo.toml` file if the other pallets use `branch = "polkadot-v1.0.0"`.
   
   Because the build process compiles both a standard binary and the WebAssembly target, you must also include  `frame-support/std` in the features for your pallet.

1. Add `frame-support/std` to the `std` features for your pallet.
   
   For example:
   
   ```text
   [features]
   default = ["std"]
   std = [
     "frame-support/std",
   ]
   ```

1. Save your changes and close the `Cargo.toml` file.

## Import the trait you want to use

In this example, you want to use the [`Currency`](https://paritytech.github.io/substrate/master/frame_support/traits/tokens/currency/trait.Currency.html) trait from the `frame_support` pallet so that your current pallet can access its methods.

To import a trait from another pallet:

1. Open a terminal shell on your computer and navigate to the root directory for your project.
   
2. Open the `src/lib.rs` file for your current pallet in a text editor.
   
3. Import the `Currency` trait by adding the following line:
      
   ```rust
   use frame_support::traits::Currency;
   ```

4. Save your change.

## Add a type to the configuration trait

The next step is to create a type that is bound by the type you want to expose in your pallet.

To update the configuration trait for your pallet:

1. Open a terminal shell on your computer and navigate to the root directory for your project.
   
2. Open the `src/lib.rs` file for your current pallet in a text editor.
   
3. Create a type to use in your pallet that is bound by the type you want to access in the external pallet:

   For example:
   
   ```rust
   pub trait Config: frame_system::Config {
       // --snip--

       /// A type that is accessing our loosely coupled pallet `my-pallet`
       type LocalCurrency: Currency<Self::AccountId>;
   }
   ```

5. Use a method that the trait of your loosely-coupled pallet provides with the type you've created to access the method.
   
   For example:

   ```rust
   // Use the getter from `my-pallet`
   let total_balance = T::LocalCurrency::total_issuance();
   ```
   
   In this example, [`total_issuance`](https://paritytech.github.io/substrate/master/frame_support/traits/tokens/currency/trait.Currency.html#tymethod.total_issuance) is a method that the `Currency` trait exposes from the `frame_support` pallet.

1. Save your changes and close the `src/lib.rs` file for your project.

## Provide the implementation in the runtime

After you have completed the updates in your project, you are ready to implement the runtime configuration to include the `LocalCurrency` that is based on the the `Currency` trait.

To update the runtime configuration for your pallet:

1. Open a terminal shell on your computer and navigate to the root directory for the node template.
   
2. Open the `runtime/src/lib.rs` file in a text editor.

1. Add the runtime configuration for your pallet to specify the `LocalCurrency` type to use the implementation defined for the `Balances` pallet.
   
   ```rust
   impl my_pallet::Config for Runtime {
     type LocalCurrency = Balances;
   }
   ```

1. Check the `Balances` definition inside `construct_runtime!` macro.
   
   ```rust
   construct_runtime! (
     pub enum Runtime where
     Block = Block,
     NodeBlock = opaque::Block,
     UncheckedExtrinsic = UncheckedExtrinsic
     {
       Balances: pallet_balances,
     }
   )
   ```

   In this example, your pallet can inherit the implementation of the `Currency` trait from the [`pallet_balances`](https://paritytech.github.io/substrate/master/pallet_balances/index.html#implementations-1) pallet and access methods from the loosely-coupled `frame-support` pallet.
   
   By default, the `construct_runtime!` macro includes all pallet attributes for all pallets listed in the macro definition. 

## Examples

- [`EnsureOrigin`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.EnsureOrigin.html) trait in the [Democracy pallet](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/democracy/src/lib.rs#L294-L352)
- [Weighting methods](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/identity/src/weights.rs#L46-L64) in the [Identity pallet](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/identity/src/lib.rs#L149-L151).  
-[`KeyOwnerProofSystem`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.KeyOwnerProofSystem.html) in [Grandpa pallet](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/grandpa/src/lib.rs#L106).

## Resources

- [Pallet coupling](/build/pallet-coupling)
- [Use tight pallet coupling](/reference/how-to-guides/pallet-design/use-tight-coupling/)
