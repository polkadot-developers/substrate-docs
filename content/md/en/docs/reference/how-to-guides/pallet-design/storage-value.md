---
title: Create a storage structure (struct)
description:
keywords:
  - pallet design
  - intermediate
  - runtime
---

Creating a struct of similarly grouped storage items is an orderly way to keep track of them.
When grouped in this way, it is easier to reference them than it is if individual `StorageValue` items are kept separately.
This can make testing and genesis configuration easier.

This guide shows you how to create a [`StorageValue`](https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageValue.html) storage item that holds a struct and is used in [`on_initialize`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.Hooks.html#method.on_initialize).
This struct does the following:

- Keeps track of an initial amount (`issuance`)
- Keeps track of the account that receives that amount (`minter`)
- Keeps track of an account that can burn some amount (`burner`)
- Is (partially) used in `on_initialize`

## Before you begin

Make sure you have a working pallet to build your struct for.
Use the [template pallet](https://github.com/substrate-developer-hub/substrate-node-template/blob/main/pallets/template/src/lib.rs) if you don't have one you're already working on.

1. Create a struct

   Name the struct `MetaData` and declare its different types:

   ```rust
   #[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, Default)]
   pub struct MetaData<AccountId, Balance> {
   	issuance: Balance,
   	minter: AccountId,
   	burner: AccountId,
   }
   ```

1. Declare the struct as a storage item

   Use `StorageValue` to declare the struct as a new single item in storage:

   ```rust
   #[pallet::storage]
   #[pallet::getter(fn meta_data)]
   	pub(super) type MetaDataStore<T: Config> = StorageValue<_, MetaData<T::AccountId, T::Balance>, ValueQuery>;
   ```

1. Configure `GenesisConfig`

   Use the `#[pallet::genesis_config]` attribute to initialize values from your `MetaData` struct.

   ```rust
   // Declare `admin` as type `T::AccountId`.
   #[pallet::genesis_config]
   pub struct GenesisConfig<T: Config> {
   	pub admin: T::AccountId,
   	}
   // Give it a default value.
   #[cfg(feature = "std")]
   impl<T: Config> Default for GenesisConfig<T> {
   	fn default() -> Self {
   		Self {
   			admin: Default::default(),
   			}
   		}
   	}
   ```

   This `admin` variable must correspond with the variable used in the `node/chainspec.rs` file inside `fn testnet_genesis`.

1. Configure `GenesisBuild`

   Use the `#[pallet::genesis_build]` attribute to initialize the values of your struct, using `admin` to initialize the values of type `T::AccountId`:

   ```rust
   #[pallet::genesis_build]
   impl<T: Config> GenesisBuild<T> for GenesisConfig<T> {
   	fn build(&self) {
   		MetaDataStore::<T>::put(MetaData {
   			issuance: Zero::zero(),
   			minter: self.admin.clone(),
   			burner: self.admin.clone(),
   		});
   	}
   }
   ```

1. Use the struct in `on_initialize()`

   Assign an amount to the `issuance` field of `MetaData` to be initialized when the chain is launched:

   ```rust
   fn on_initialize(_n: T::BlockNumber) -> Weight {
   	// Create an alias for the StorageValue struct.
   	let mut meta = MetaDataStore::<T>::get();

   	// Add a value to the `issuance` field.
   	let value: T::Balance = 50u8.into();
   	meta.issuance = meta.issuance.saturating_add(value);

   	// Add the amount to the `minter` account in storage.
   	Accounts::<T>::mutate(&meta.minter, |bal| {
   		*bal = bal.saturating_add(value);
   	});
   }
   ```

The `on_initialize` function ensures that the values for the specified items are written to storage when the chain is launched.

## Examples

- [`reward-coin`](https://github.com/substrate-developer-hub/substrate-how-to-guides/blob/d3602a66d66be5b013f2e3330081ea4e0d6dd978/example-code/template-node/pallets/reward-coin/src/lib.rs#L24-L29) example pallet

## Resources

- [`Default::default()`](https://paritytech.github.io/substrate/master/sp_std/default/trait.Default.html)
