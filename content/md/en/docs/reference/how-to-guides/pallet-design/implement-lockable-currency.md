---
title: Implement lockable currency
description:
keywords:
  - pallet design
  - currency
  - intermediate
  - runtime
---

This guide shows you how to write a pallet that allows users to lock funds for staking and voting.
The [`LockableCurrency`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.LockableCurrency.html) trait is useful in the context of economic systems that enforce accountability by collateralizing fungible resources.
You can use the Substrate [staking pallet](https://paritytech.github.io/substrate/master/pallet_staking/index.html) to manage locked funds in time-based increments.

In this guide, we will implement the `set_lock`, `extend_lock` and `remove_lock` methods in our own custom pallet.

## Before you begin

You will need to have a pallet already integrated in a runtime to follow this guide.
This guide assumes you are using a runtime that contains the [Balances pallet](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/balances) to handle the accounts and balances for your chain.
You can use the template pallet in the [node template](https://github.com/substrate-developer-hub/substrate-node-template) to follow.

## Declare the necessary dependencies

The methods from [`LockableCurrency`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.LockableCurrency.html) require us to import a few traits from `frame_support`.

1. Ensure you have the following traits imported in the top section of your pallet:

   ```rust
   use frame_support::{
   	dispatch::DispatchResult,
   	traits::{Currency, LockIdentifier, LockableCurrency, WithdrawReasons},
   };
   ```

1. Declare the `LockIdentifier` constant.

   To use `LockableCurrency`, you must declare a `LockIdentifier`.
   Given that it requires a `[u8; 8]` type, this identifier must be eight characters long.

   ```rust
   const EXAMPLE_ID: LockIdentifier = *b"example ";
   ```

   You will need this to declare the methods we'll be including later on.

## Declare your custom pallet types

Defining your custom configuration type will allow your pallet to inherit the methods we want to implement.

1. Define the lockable currency type, let's call it `StakeCurrency`:

   ```rust
   	type StakeCurrency: LockableCurrency<Self::AccountId, Moment = Self::BlockNumber>;
   ```

1. Define a type to satisfy the associated type [`Balance`](https://paritytech.github.io/substrate/master/frame_support/traits/tokens/currency/trait.Currency.html#associatedtype.Balance) from the [`Currency`](https://paritytech.github.io/substrate/master/frame_support/traits/tokens/currency/trait.Currency.html) trait we're using:

   ```rust
   	type BalanceOf<T> =
   		<<T as Config>::StakeCurrency as Currency<<T as frame_system::Config>::AccountId>>::Balance;
   ```

   This ensures that our pallet has a type to handle the `amount` field in the methods we'll be implementing.

1. Specify the new type for your runtime:

   ```rust
   	impl pallet_template::Config for Runtime {
   		type RuntimeEvent = RuntimeEvent;
   		type StakeCurrency = Balances; // <- add this line
   	}
   ```

   Passing in `Balances` ensures that your pallet's `LockableCurrency` methods have the same understanding of `Balance` than the pallet that handles accounts balances of your blockchain.

## Create dispatchable functions using the required methods

The required methods are:

- `fn lock_capital`: Locks the specified amount of tokens from the caller.
- `fn extend_lock`: Extends the lock period.
- `fn unlock_all`: Releases all locked tokens.

1. Write `lock_capital`, using `T::StakeCurrency::set_lock`:

   ```rust
   	#[pallet::weight(10_000 + T::DbWeight::get().writes(1))]
   	pub(super) fn lock_capital(
   		origin: OriginFor<T>,
   		#[pallet::compact] amount: BalanceOf<T>
   	) -> DispatchResultWithPostInfo {

   		let user = ensure_signed(origin)?;

   		T::StakeCurrency::set_lock(
   			EXAMPLE_ID,
   			&user,
   			amount,
   			WithdrawReasons::all(),
   		);

   		Self::deposit_event(Event::Locked(user, amount));
   		Ok(().into())
   	}
   ```

1. Write `extend_lock`, using `T::StakeCurrency::extend_lock`:

   ```rust
   	#[pallet::weight(1_000)]
   	pub(super) fn extend_lock(
   		origin: OriginFor<T>,
   		#[pallet::compact] amount: BalanceOf<T>,
   	) -> DispatchResultWithPostInfo {
   		let user = ensure_signed(origin)?;

   		T::StakeCurrency::extend_lock(
   			EXAMPLE_ID,
   			&user,
   			amount,
   			WithdrawReasons::all(),
   		);

   		Self::deposit_event(Event::ExtendedLock(user, amount));
   		Ok(().into())
   	}
   ```

1. Write `unlock_all`, using `T::StakeCurrency::remove_lock`:

   ```rust
   	#[pallet::weight(1_000)]
   	pub(super) fn unlock_all(
   		origin: OriginFor<T>,
   	) -> DispatchResultWithPostInfo {
   		let user = ensure_signed(origin)?;

   		T::StakeCurrency::remove_lock(EXAMPLE_ID, &user);

   		Self::deposit_event(Event::Unlocked(user));
   		Ok(().into())
   	}
   ```

1. Write the events for all three dispatchables:

   ```rust
   	#[pallet::event]
   	#[pallet::generate_deposit(pub(super) fn deposit_event)]
   	pub enum Event<T: Config> {
   		Locked(T::AccountId, BalanceOf<T>),
   		Unlocked(T::AccountId),
   		LockExtended(T::AccountId, BalanceOf<T>),
   	}
   ```

## Examples

- [`lockable-currency`](https://github.com/substrate-developer-hub/substrate-how-to-guides/blob/main/example-code/template-node/pallets/lockable-currency/src/lib.rs) example pallet

## Related material

- [Currency trait](https://paritytech.github.io/substrate/master/frame_support/traits/tokens/currency/trait.Currency.html)
- [LockableCurrency](https://paritytech.github.io/substrate/master/frame_support/traits/trait.LockableCurrency.html)
- [LockIdentifier](https://paritytech.github.io/substrate/master/frame_support/traits/type.LockIdentifier.html)
