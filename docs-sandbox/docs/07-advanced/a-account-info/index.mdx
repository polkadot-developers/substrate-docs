---
title: Account Information
slug: /v3/advanced/account-info
version: '3.0'
section: docs
category: advanced
keywords:
---

In this article we will look into how an account is stored in Substrate and how its underlying data
structure looks like. We will see that each account is associated with three reference counters, and
how they are used to manage its lifecycle. If your runtime stores data associated with accounts
on-chain, it is important to understand how to use these reference counters in your runtime logic.

## `Account` StorageMap

In Substrate, the entry point of account information is stored in
[`frame-system` pallet](/rustdocs/latest/frame_system/index.html),
extracted below.

[`frame/system/src/lib.rs`](/rustdocs/latest/src/frame_system/lib.rs.html#530):

```rust
/// The full account information for a particular account ID.
#[pallet::storage]
#[pallet::getter(fn account)]
pub type Account<T: Config> = StorageMap<
  _,
  Blake2_128Concat,
  T::AccountId,
  AccountInfo<T::Index, T::AccountData>,
  ValueQuery,
>;
```

`Account` storage map takes in five type parameters, of which the first argument is used in macro
expansion. Then it specifies using `Blake2_128Concat` as the hashing algorithm, and mapping
`T::AccountId` as key over `AccountInfo<T::Index, T::AccountData>` struct. See
[`StorageMap` API doc](/rustdocs/latest/frame_support/storage/types/struct.StorageMap.html#impl)
for details.

## `AccountInfo` structure

Looking further down in the source code, `AccountInfo` struct is defined as:

[`frame/system/src/lib.rs`](/rustdocs/latest/src/frame_system/lib.rs.html#788-803):

```rust
#[derive(Clone, Eq, PartialEq, Default, RuntimeDebug, Encode, Decode)]
pub struct AccountInfo<Index, AccountData> {
  /// The number of transactions this account has sent.
  pub nonce: Index,
  /// The number of other modules that currently depend on this account's existence. The account
  /// cannot be reaped until this is zero.
  pub consumers: RefCount,
  /// The number of other modules that allow this account to exist. The account may not be reaped
  /// until this and `sufficients` are both zero.
  pub providers: RefCount,
  /// The number of modules that allow this account to exist for their own purposes only. The
  /// account may not be reaped until this and `providers` are both zero.
  pub sufficients: RefCount,
  /// The additional data that belongs to this account. Used to store the balance(s) in a lot of
  /// chains.
  pub data: AccountData,
}
```

Every account has an `AccountInfo` consisting of an `nonce` indicating number of transactions the
account has sent, three reference counters, and an `AccountData` structure which can be configured
to hold different kinds of data, [further explained below](#accountdata-trait-and-implementation).

## Account reference counters

Let's look deeper into the three reference counters, `consumers`, `providers`, and `sufficients`.
These counters track references of an account being depended upon within runtime, for example when
we store data under a map controlled by an account. With these counters we are telling Substrate to
not destroy these accounts, which is usually triggered when users trying to transfer their
existential deposit away.

- **`consumers`** indicates how many times modules depend on this account. An example of using this
  counter is in `Session` pallet when an account setting its session key(s) prior of becoming a
  validator [[1]](#ref-session-set-keys). `providers` has to be greater than zero before `consumer`
  can be incremented. See below.

- **`providers`** indicates if an account is active/ready to be depended upon. One usage example
  is that the counter is incremented when a new account is created with more than the existential
  deposit [[2]](#ref-system-created).

  `consumers` and `providers` are designed to be used together. `providers` tells Substrate pallets
  not to store data about that account until it is active (i.e. `providers` > 0), and `consumers`
  tells Substrate not to remove an account until data about the account is removed in all pallets
  (i.e. `consumers` == 0). This is to keep users accountable for their data stored on-chain. If
  users want to remove their accounts and get back the exisitential deposit, they need to remove
  the dependencies from those on-chain pallets, such as clearing data stored on-chain for those
  pallets, which decrement `consumers` counter. Pallets also have cleanup functions to decrement
  `providers` to mark the account as deactivated within the pallet-managed scope. When the account
  `providers` reaches 0, with the prerequsite that `consumers` has reached 0 by this point, this
  account is considered **deactivated** by all on-chain pallets.

- **`sufficients`** indicates if there are any reasons this account is self-sufficient to exist by
  itself. An example of using this counter is in `Assets` pallet when an account has sufficient amount
  of certain assets but not owning any native account balance [[3]](#ref-assets-new-account).

Runtime developers can update these counters via `inc_consumers()`, `dec_consumers()`,
`inc_providers()`, `dec_providers()`, `inc_sufficients()`, and `dec_sufficients()` exposed by
`frame-system`. Each increment call of a certain counter should accompanied by a corresponding decrement call of the counter in an account life cycle, else it is a design bug.

There are also three query functions to ease usage on these counters:

- `can_inc_consumer()` to check if an account is ready to be used (`providers` > 0);
- `can_dec_provider()` to check if an account is no longer referenced in runtime whatsoever
  (`consumers` == 0) before decrementing `providers` to 0; and
- `is_provider_required()` to check if an account has outstanding consumer references
  (`consumers` > 0).

Refer to [`frame-system` API doc](/rustdocs/latest/frame_system/pallet/struct.Pallet.html#impl-11)
for details.

## `AccountData` trait and implementation

Back to the `AccountInfo` struct. The last piece of data in `AccountInfo` is `AccountData`. It can be any struct as long as it satisfies the associated type `AccountData` trait bound defined in [`frame-system::pallet::Config` trait](/rustdocs/latest/frame_system/pallet/trait.Config.html#associatedtype.AccountData). Out of the box Substrate runtime configures it to be [`AccountData` struct](/rustdocs/latest/pallet_balances/struct.AccountData.html) defined in `pallet-balances` as shown below.

[`frame/balances/src/lib.rs`](/rustdocs/latest/src/pallet_balances/lib.rs.html#566-586)

```rust
pub struct AccountData<Balance> {
  /// Non-reserved part of the balance. There may still be restrictions on this, but it is the
  /// total pool what may in principle be transferred, reserved and used for tipping.
  ///
  /// This is the only balance that matters in terms of most operations on tokens. It
  /// alone is used to determine the balance when in the contract execution environment.
  pub free: Balance,
  /// Balance which is reserved and may not be used at all.
  ///
  /// This can still get slashed, but gets slashed last of all.
  ///
  /// This balance is a 'reserve' balance that other subsystems use in order to set aside tokens
  /// that are still 'owned' by the account holder, but which are suspendable.
  pub reserved: Balance,
  /// The amount that `free` may not drop below when withdrawing for *anything except transaction
  /// fee payment*.
  pub misc_frozen: Balance,
  /// The amount that `free` may not drop below when withdrawing specifically for transaction
  /// fee payment.
  pub fee_frozen: Balance,
}
```

It contains:

- **Free balance** `free`. The portion of a balance that is not reserved. The free balance is
  usually what matters for most operations.

- **Reserved balance** `reserved`. Reserved balance still belongs to the account holder, but is
  suspended. Reserved balance can be slashed, but only after all the free balance has been slashed.
  The total balance of an account is the sum of its free balance and reserved balance.

- **Frozen balance**, split into `misc_frozen` and `fee_frozen`, represents balance that free
  balance cannot drop below. `fee_frozen` are specifically for transaction fee payment and
  `misc_frozen` for everything else. The actual frozen balance is the max of these two, and they are
  set when accounts are locked for transactions.

## Conclusion

By now, you have a clear picture how account data is stored in Substrate. You can dig deeper by
looking into the [`frame_system::AccountInfo` API doc](/rustdocs/latest/frame_system/struct.AccountInfo.html)
and [`pallet_balances::AccountData` API doc](/rustdocs/latest/pallet_balances/struct.AccountData.html).

## References

- [`pallet_session::Pallet::set_keys` dispatchable call](/rustdocs/latest/src/pallet_session/lib.rs.html#508-571)
- [`frame_system::Provider` `HandleLifetime` implementation](/rustdocs/latest/src/frame_system/lib.rs.html#1549-1561)
- [`pallet_assets` `new_account` function](/rustdocs/latest/src/pallet_assets/functions.rs.html#46-61)
