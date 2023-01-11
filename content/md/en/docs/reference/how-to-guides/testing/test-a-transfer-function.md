---
title: Test a transfer function
description:
keywords:
  - testing
  - runtime
  - beginner
---

Testing each function is an important part of developing pallets for production.
This guide steps you through best practices for writing test cases for a basic `transfer` function.

## Outline the `transfer` function

A transfer function has two key elements: subtracting a balance from an account and adding that
balance to another account.
Here, we'll start by outlining this function:

```rust
#[pallet::weight(10_000)]
pub (super) fn transfer(
  origin: OriginFor<T>,
  to: T::AccountId,
  #[pallet::compact] amount: T::Balance,
  ) -> DispatchResultWithPostInfo {
    let sender = ensure_signed(origin)?;

    Accounts::<T>::mutate(&sender, |bal| {
      *bal = bal.saturating_sub(amount);
      });
      Accounts::<T>::mutate(&to, |bal| {
        *bal = bal.saturating_add(amount);
        });

    Self::deposit_event(Event::<T>::Transferred(sender, to, amount))
    Ok(().into())
}
```

## Check that the sender has enough balance

The first thing to verify, is whether the sender has enough balance.
In a separate `tests.rs` file, write out this first test case:

```rust
#[test]
fn transfer_works() {
  new_test_ext().execute_with(|| {
    MetaDataStore::<Test>::put(MetaData {
			issuance: 0,
			minter: 1,
			burner: 1,
		});
    // Mint 42 coins to account 2.
    assert_ok!(RewardCoin::mint(RuntimeOrigin::signed(1), 2, 42));
    // Send 50 coins to account 3.
    asset_noop!(RewardCoin::transfer(RuntimeOrigin::signed(2), 3, 50), Error::<T>::InsufficientBalance);
```

### Configure error handling

To implement some error check, replace `mutate` with `try_mutate` to use `ensure!`.
This will check whether _bal is greater or equal to amount_ and throw an error message if not:

```rust
Accounts::<T>::try_mutate(&sender, |bal| {
  ensure!(bal >= amount, Error::<T>::InsufficientBalance);
  *bal = bal.saturating_sub(amount);
  Ok(())
});
```

Run `cargo test` from your pallet's directory.

## Check that sending account doesn't go below minimum balance

Inside your `transfer_works` function:

```rust
assert_noop!(RewardCoin::transfer(RuntimeOrigin::signed(2), 3, 50), Error::<Test>::InsufficientBalance);
```

## Check that both tests work together

Use `#[transactional]` to generate a wrapper around both checks:

```rust
#[transactional]
pub(super) fn transfer(
/*--snip--*/
```

## Handle dust accounts

Make sure that sending and receiving accounts aren't dust accounts. Use `T::MinBalance::get()`:

```rust
/*--snip--*/
let new_bal = bal.checked_sub(&amount).ok_or(Error::<T>::InsufficientBalance)?;
ensure!(new_bal >= T::MinBalance::get(), Error::<T>::BelowMinBalance);
/*--snip--*/
```

## Examples

- Tests in the [`reward-coin` example pallet](https://github.com/substrate-developer-hub/substrate-how-to-guides/blob/main/example-code/template-node/pallets/reward-coin/src/tests.rs).

## Resources

- [`assert_ok!`](https://paritytech.github.io/substrate/master/frame_support/macro.assert_ok.html)
- [`assert_noop!`](https://paritytech.github.io/substrate/master/frame_support/macro.assert_noop.html)
- [`ensure!`](https://paritytech.github.io/substrate/master/frame_support/macro.ensure.html)
- [`try_mutate`](https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageMap.html#tymethod.try_mutate)
