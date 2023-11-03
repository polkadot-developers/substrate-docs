---
title: Configure genesis state
description:
keywords:
  - basics
  - beginner
  - runtime
---

Genesis configuration defines the initial state for storage items such as accounts, balances, genesis for custom pallets, and more.
This guide demonstrates how to configure the genesis state for a pallet with the following storage items:

- A `SingleValue<T>` type for a single `StorageValue` storage item.
- An `AccountMap<T>` type for simple single key `StorageMap` storage item. 

## Steps preview

1. Add the storage items in the pallet.
2. Add the genesis configuration macros in the pallet.
3. Set initial values in the chain specification.

## Add storage items to the pallet

1. Open the `src//lib.rs` file for your pallet in a text editor.
   
1. Add the `StorageValue` storage item.
   
   For example:
   
   ```rust
   #[pallet::storage]
   #[pallet::getter(fn something)]
   pub type SingleValue<T: Config> = StorageValue<
      _, 
      T::Balance
   >;
   
1. Add the `StorageMap` storage item for a map that has enumerable entries.
   
      For example:
   
   ```rust
   #[pallet::storage]
   #[pallet::getter(fn accounts)]
   pub type AccountMap<T: Config> = StorageMap<
      _, 
      Blake2_128Concat, 
      T::AccountId, 
      T::Balance
   >;
   ```

## Add genesis configuration macros

The `GenesisConfig` code should go after your storage items.

1. Add the `#[pallet::genesis_config]` attribute macro and define the `GenesisConfig` struct for the storage items to initialize.

   ```rust
   #[pallet::genesis_config]
   pub struct GenesisConfig<T: Config> {
   	pub single_value: T::Balance,
   	pub account_map: Vec<(T::AccountId, T::Balance)>,
   }
   ```

2. Set the default value for the `GenesisConfig` struct.

   ```rust
   #[cfg(feature = "std")]
   impl<T: Config> Default for GenesisConfig<T> {
   	fn default() -> Self {
   		Self { single_value: Default::default(), account_map: Default::default() }
   	}
   }
   ```

3. Add the `#[pallet::genesis_build]` attribute macro and implement the [`GenesisBuild`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.GenesisBuild.html) trait.

   ```rust
   #[pallet::genesis_build]
   impl<T: Config> GenesisBuild<T> for GenesisConfig<T> {
   	fn build(&self) {
   		<SingleValue<T>>::put(&self.single_value);
   		for (a, b) in &self.account_map {
   			<AccountMap<T>>::insert(a, b);
   		}
   	}
   }
   ```

   The `#[pallet::genesis_build]` macro allows you to execute some logic to define how the `GenesisConfig` struct places something in storage.

## Set initial values

After you configure the storage items and genesis configuration in your pallet, you can specify the values you want to set for the storage items in the genesis state of the chain.
In this example, assume that the `construct_runtime!` macro for runtime refers to `PalletSomething` as the pallet name and `pallet_something` as the path to the pallet.

```rust
construct_runtime!(
   pub struct Runtime
   where
      Block = Block,
      NodeBlock = opaque::Block,
      UncheckedExtrinsic = UncheckedExtrinsic,
   {
      PalletSomething: pallet_something,
   }
)
```

1. Open the  `node/chain_spec.rs` file in a text editor.
   
2. Verify the `use node_template_runtime::BalanceConfig;` imported at the top of our `chain_spec.rs` file.

3. Create a constant value of type `T::Balance` to be stored in `<SingleValue<T>>` (inside the `testnet_genesis` method).

   ```rust
   const VALUE: Balance = 235813;
   ```

4. Create a vector of accounts to initialize `<AccountMap<T>>` with inside the `testnet_genesis` method.

   ```rust
   let accounts_to_map: Vec<AccountId> =
   	vec![
   		get_account_id_from_seed::<sr25519::Public>("Alice"),
   		get_account_id_from_seed::<sr25519::Public>("Bob"),
   		get_account_id_from_seed::<sr25519::Public>("Charlie"),
   	];
   ```

5. Add the pallet to the `GenesisConfig` clause in the `testnet_genesis` function.

   The convention is to use lowercase spelling of the name of your pallet in `runtime/src/lib.rs` inside `construct_runtime!`.
   For pallets declared as `CamelCase` for example, the convention is to refer to it as `camel_case` in the `testnet_genesis` function.

   For this example pallet, the code looks like this:

   ```rust
   pallet_something: PalletSomethingConfig {
   	single_value: VALUE,
   	account_map: accounts_to_map.iter().cloned().map(|x| (x, VALUE)).collect(),
   }
   ```

   This sample code maps each account from `accounts_to_map` to an amount equal to `VALUE`.
   This pattern is very similar to the `GenesisConfig` for the Balances pallet.

## Example

- [Node template 'chain_spec.rs'](https://github.com/substrate-developer-hub/substrate-node-template/blob/master/node/src/chain_spec.rs)
- [Example pallet](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/examples/basic/src/lib.rs)
