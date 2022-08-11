---
title: Mint basic tokens
description: Demonstrates how to create a simple pallet to mint tokens.
keywords:
  - basics
  - beginner
  - runtime
  - tokens
---

This guide demonstrates how you can mint a token by leveraging the primitive capabilities of a [StorageMap](https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageMap.html).
In this guide, the `StorageMap` primitive uses the [blake2_128_concat](/build/runtime-storage#hashing-algorithms) `hasher` to map balances to account IDs.
This approach is similar to how the [Balances](https://paritytech.github.io/substrate/master/pallet_balances/index.html) pallet makes use of it to store to keep track of account balances.

You should note that this guide is only intended to illustrate a simple approach to creating tokens in Substrate.
This approach _is not_ a recommended best practice.
You should keep in mind the following limitations and assumptions used in this guide:

- **Safety.** The `mint` function takes in an amount to mint which is _not good practice_ because it implies that users have unlimited access to writing to storage.
  Safer approaches include using a `GenesisConfig` or fixing a predetermined maximum value in runtime.
- **Weights.** This guide uses an arbitrary weight of 10_000 in the code snippets.
  Learn more about weight configuration in [Transactions, weights, and fees](/build/tx-weights-fees).
- **Origins.** This guide assumes that the origin will always be the `sudo` user.
  Origins are a powerful capability in Substrate.
  Learn more about how they work in [Privileged calls and origins](/build/origins/).

See the [Examples section](#examples) for practical implementations of this guide.

## Use cases

Give any account the ability to create a token supply in exchange for native token fee.

## Steps preview

1. Set up the `Config` trait.
1. Declare your `StorageMap` storage item.
1. Create the `mint` function.
1. Create the `transfer` function.
1. Add checks and error handling.
1. Write to storage.
1. Add your new pallet to the runtime.

## Set up the Config trait

Using the node template as a starting point, specify the types your pallet depends on and the [`Events`](/build/events-errors/) it emits:

```rust

// TODO - this block was malformed

/* --snip-- */
pub enum Event<T: Config> {
	MintedNewSupply(T::AccountId),
	Transferred(T::AccountId, T::AccountId, T::Balance),
}
```

## Declare your storage item

This pallet only keeps track of the balance to account ID mapping.
Call it `BalanceToAccount`:

```rust
/* --snip-- */
#[pallet::storage]
#[pallet::getter(fn get_balance)]
pub(super) type BalanceToAccount<T: Config> = StorageMap<
	_,
	Blake2_128Concat,
	T::AccountId,
	T::Balance,
	ValueQuery
	>;
/* --snip-- */
```

## Create the mint function

We can now bring our attention to creating the intended capabilities of our pallet.
Create the `mint()` function to issue a token supply from any origin.

```rust
	/* --snip-- */
	#[pallet::weight(10_000 + T::DbWeight::get().writes(1))]
	pub(super) fn mint(
		origin: OriginFor<T>,
		#[pallet::compact] amount: T::Balance
		) -> DispatchResultWithPostInfo {

		let sender = ensure_signed(origin)?;

		// Check if the kitty does not already exist in our storage map
		 ensure!(Self::kitties(&kitty_id) == None, <Error<T>>::KittyExists);

		// Update storage.
		<BalanceToAccount<T>>::insert(&sender, amount);

		// Emit an event.
		Self::deposit_event(Event::MintedNewSupply(sender));

		// Return a successful DispatchResultWithPostInfo.
		Ok(().into())
	}
	/* --snip-- */
```

## Create the transfer function

Create the `transfer()` function to allow the minting account to transfer a given balance to another account.

Start with writing out the variables, using `get_balance` to reference to `StorageMap` of balances previously declared in storage:

```rust
pub(super) fn transfer(
	origin: OriginFor<T>,
	to: T::AccountId,
	#[pallet::compact] amount: T::Balance,
	) -> DispatchResultWithPostInfo {
		let sender = ensure_signed(origin)?;
		let sender_balance = Self::get_balance(&sender);
		let receiver_balance = Self::get_balance(&to);
/* --snip-- */
```

## Add checks and error handling

When performing balance updates, use `checked_sub` and `checked_add` to handle potential errors with overflow:

```rust
/* --snip-- */
// Calculate new balances.
let updated_from_balance = sender_balance.checked_sub(value).ok_or(<Error<T>>::InsufficientFunds)?;
let updated_to_balance = receiver_balance.checked_add(value).expect("Entire supply fits in u64, qed");
/* --snip-- */
```

## Write to storage

Once the new balances are calculated, write their values to storage and deposit the event to the current block:

```rust
	// Write new balances to storage.
	<Balances<T>>::insert(&sender, updated_from_balance);
	<Balances<T>>::insert(&to, updated_to_balance);

	Self::deposit_event(RawEvent::Transfer(sender, to, value));
	Ok(())
}
/* --snip-- */
```

If `checked_sub()` returns `None`, the operation caused an overflow and throws an error.

## Add your pallet to the runtime

See [Import a pallet](/reference/how-to-guides/basics/import-a-pallet/) if you’re not yet familiar with this procedure.

## Examples

- [mint-token](https://github.com/substrate-developer-hub/substrate-how-to-guides/blob/main/example-code/template-node/pallets/mint-token/src/lib.rs) example pallet
- [reward-coin](https://github.com/substrate-developer-hub/substrate-how-to-guides/blob/main/example-code/template-node/pallets/reward-coin/src/lib.rs) example pallet

## Related material

- [Configure a runtime constant](/reference/how-to-guides/basics/configure-runtime-constants/)
- [Deposit event method](https://paritytech.github.io/substrate/master/frame_system/pallet/struct.Pallet.html#method.deposit_event)
