---
title: Account data structures
description: Describes the storage map data structure used for accounts in FRAME.
keywords:
---

Accounts are a fundamental part of any blockchain, and, in Substrate, accounts can be used in many different ways.
This article describes how accounts are stored in Substrate and how the account data
structure is used to manage the account lifecycle in the runtime logic.

## Account

The `Account` data type is a storage map that is defined generically in the [`frame-system` pallet](https://paritytech.github.io/substrate/master/src/frame_system/lib.rs.html#530):

```rust
/// The full account information for a particular account ID.
#[pallet::storage]
#[pallet::getter(fn account)]
pub type Account<T: Config> = StorageMap<
  _,
  Blake2_128Concat,
  T::AccountId,
  AccountInfo<T::Nonce, T::AccountData>,
  ValueQuery,
>;
```

The `StorageMap` for an `Account` consists of the following parameters:

- The first parameter (\_) is used in macro expansion.
- `Blake2_128Concat` specifies the hashing algorithm to use.
- `T::AccountId` is used as the key for over the `AccountInfo<T::Nonce, T::AccountData>` struct.

See [`StorageMap` API](https://paritytech.github.io/substrate/master/frame_support/storage/types/struct.StorageMap.html#impl) for details.

## AccountInfo

The `AccountInfo` for an account is defined in the [`frame_system` pallet](https://paritytech.github.io/substrate/master/src/frame_system/lib.rs.html#788-803):

```rust
#[derive(Clone, Eq, PartialEq, Default, RuntimeDebug, Encode, Decode)]
pub struct AccountInfo<Nonce, AccountData> {
  /// The number of transactions this account has sent.
  pub nonce: Nonce,
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

Every account has an `AccountInfo` consisting of:

- The `nonce` indicating the number of transactions the account has sent.
- The `consumers` reference counter indicating the number of other modules that currently depend on this account's existence.
- The `providers` reference counter indicating the number of other modules that allow this account to exist.
- The `sufficients` reference counter indicating the number of modules that allow this account to exist for their own purposes only.
- The `AccountData` structure that you can configure to hold different kinds of data.

## Account reference counters

The account reference counters track account dependencies in the runtime.
For example, if you store data under a map controlled by an account, you wouldn't want to delete the account until the data stored under the map the account controls has been deleted.

The `consumers` and `providers` reference counters are designed to be used together.
For example, the `consumers` reference counter in the `Session` pallet is incremented when an account sets its session keys prior of becoming a validator.
The `providers` reference counter must be greater than zero before the `consumer`
counter can be incremented.

The `providers` reference counter indicates if an account is ready to be depended upon.
For example, the `providers` reference counter is incremented when a new account is created with more than the existential deposit [[2]](#ref-system-created).

The `providers` reference counter prevents Substrate pallets from storing data about an account until the account is active (`providers` > 0).
The `consumers` reference counter prevents Substrate pallets from removing an account until data about the account is removed in all pallets (`consumers` == 0).
The `consumers` reference counter holds users accountable for the data stored on-chain.
If users want to remove their accounts and get back the existential deposit, they need to remove all of the data they have stored on all on-chain pallets to decrement `consumers` counter.

Pallets also have cleanup functions to decrement the `providers` reference counter to mark the account as deactivated within the pallet-managed scope.
When the account `providers` reference counter is zero and the `consumers` is zero, the account is considered **deactivated** by all on-chain pallets.

The `sufficients` reference counter indicates if an account is self-sufficient and can exist by itself.
For example, in the Assets pallet, an account can have sufficient number of certain assets but without owning any native account balance.

Runtime developers can update these counters using the `inc_consumers()`, `dec_consumers()`, `inc_providers()`, `dec_providers()`, `inc_sufficients()`, and `dec_sufficients()` methods exposed by the `frame-system` pallet.
Each increment call of a certain counter should be accompanied by a corresponding decrement call of the counter in an account life cycle.

There are also three query functions to ease usage on these counters:

- `can_inc_consumer()` to check if an account is ready to be used (`providers` > 0).
- `can_dec_provider()` to check if an account is no longer referenced in runtime whatsoever (`consumers` == 0) before decrementing `providers` to 0.
- `is_provider_required()` to check if an account has outstanding consumer references
  (`consumers` > 0).

See [`frame-system` API](https://paritytech.github.io/substrate/master/frame_system/pallet/struct.Pallet.html#impl-11) for details.

## AccountData trait and implementation

The `AccountInfo` can be any struct as long as the struct satisfies the associated type `AccountData` trait bound defined in the [`frame-system::pallet::Config` trait](https://paritytech.github.io/substrate/master/frame_system/pallet/trait.Config.html#associatedtype.AccountData).
By default, the Substrate runtime configures `AccountInfo` to be as defined in [`pallet-balances`](https://paritytech.github.io/substrate/master/pallet_balances/struct.AccountData.html).

## Where to go next

For addtional technical details, see the following resources:

- [`frame_system::AccountInfo` API](https://paritytech.github.io/substrate/master/frame_system/struct.AccountInfo.html)
- [`pallet_balances::AccountData` API](https://paritytech.github.io/substrate/master/pallet_balances/struct.AccountData.html).
- [`pallet_session::Pallet::set_keys` dispatchable call](https://paritytech.github.io/substrate/master/src/pallet_session/lib.rs.html#508-571)
- [`frame_system::Provider` `HandleLifetime` implementation](https://paritytech.github.io/substrate/master/src/frame_system/lib.rs.html#1549-1561)
- [`pallet_assets` `new_account` function](https://paritytech.github.io/substrate/master/src/pallet_assets/functions.rs.html#46-61)
