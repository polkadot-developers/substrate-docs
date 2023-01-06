---
title: Configure crowdfunding
description: How to use FRAME pallets to create a crowdfunding campaign.
keywords:
  - pallet design
  - intermediate
  - runtime
  - child trie
---

This guide shows you how to build a pallet that controls multiple token accounts and stores data in child storage.
This structure is useful for building crowdfunding apps.

For this guide, we will focus on the use of a child storage trie, which allows any contributor to prove that they contributed using a small Merkle proof.
Being able to make a simple proof of contribution can help users claim rewards for participating in a crowdloan.

In this guide, you'll see how to create a new child trie for each different crowdfund campaign.
Any user can start a crowdfund by specifying a goal amount for the crowdfund, an end time, and a beneficiary who will receive the pooled funds if the goal is reached by the end time.
If the fund is not successful, it can be dissolved, returning funds to the original owners.

## Before you begin

To follow this guide and implement the crowdfunding capabilities in your own pallet, include the following dependencies in your pallet:

```rust
use frame_support::{
	ensure,
	pallet_prelude::*,
	sp_runtime::traits::{AccountIdConversion, Hash, Saturating, Zero},
	storage::child,
	traits::{Currency, ExistenceRequirement, Get, ReservableCurrency, WithdrawReasons},
	PalletId,
};
use frame_system::{pallet_prelude::*, ensure_signed};
use super::*;
```

This guide assumes that you know how to create your own errors and events according to the pallet logic your creating.

## Configure your pallet

1. Declare your pallet's configuration traits.

   In addition to the `Event` type, this pallet will need the following traits:

   - **`Currency`** - The currency in which the crowdfunds will be denominated.
   - **`SubmissionDeposit`** - The amount to be held on deposit by the owner of a crowdfund.
   - **`MinContribution`** - The minimum amount that may be contributed to a crowdfund.

   Extend your trait with the following types:

   ```rust
   /// The pallet's configuration trait.
   #[pallet::config]
   pub trait Config: frame_system::Config {
   	type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
   	type Currency: ReservableCurrency<Self::AccountId>;
   	type SubmissionDeposit: Get<BalanceOf<Self>>;
   	type MinContribution: Get<BalanceOf<Self>>;
   	type RetirementPeriod: Get<Self::BlockNumber>;
   }
   ```

   And the following type aliases:

   ```rust
   pub type FundIndex = u32;
   type AccountIdOf<T> = <T as frame_system::Config>::AccountId;
   type BalanceOf<T> = <<T as Config>::Currency as Currency<AccountIdOf<T>>>::Balance;
   ```

1. Create a struct to store the configuration of crowdfunds.

   ```rust
   #[derive(Encode, Decode, Default, PartialEq, Eq, TypeInfo)]
   #[cfg_attr(feature = "std", derive(Debug))]
   pub struct FundInfo<AccountId, Balance, BlockNumber> {
   	/// The account that will recieve the funds if the campaign is successful.
   	beneficiary: AccountId,
   	/// The amount of deposit placed.
   	deposit: Balance,
   	/// The total amount raised.
   	raised: Balance,
   	/// Block number after which funding must have succeeded.
   	end: BlockNumber,
   	/// Upper bound on `raised`.
   	goal: Balance,
   }
   ```

   And a new alias to more easily use this:

   ```rust
   type FundInfoOf<T> =
   	FundInfo<AccountIdOf<T>, BalanceOf<T>, <T as frame_system::Config>::BlockNumber>;
   ```

1. Declare your storage items.

   Your storage items will keep track of which user contributed to what fund as well as how much they contributed.
   Define the following types which will be used to declare your storage items:

   ```rust
   #[pallet::storage]
   #[pallet::getter(fn funds)]
   /// Info on all of the funds.
   pub(super) type Funds<T: Config> = StorageMap<
   	_,
   	Blake2_128Concat,
   	FundIndex,
   	FundInfoOf<T>,
   	OptionQuery,
   >;

   #[pallet::storage]
   #[pallet::getter(fn fund_count)]
   /// The total number of funds that have so far been allocated.
   pub(super) type FundCount<T: Config> = StorageValue<_, FundIndex, ValueQuery>;
   ```

## Write child trie API helper functions

Create a function that provides the pallet's dispatchables with the account ID for the pot of funds.

1. Inside `impl<T: Config> Pallet<T>`, write:

   ```rust
   pub fn fund_account_id(index: FundIndex) -> T::AccountId {
   	const PALLET_ID: ModuleId = ModuleId(*b"ex/cfund");
   	PALLET_ID.into_sub_account(index)
   }
   ```

1. Generate unique [ChildInfo](https://paritytech.github.io/substrate/master/sp_storage/enum.ChildInfo.html) IDs:

   ```rust
   pub fn id_from_index(index: FundIndex) -> child::ChildInfo {
   		let mut buf = Vec::new();
   		buf.extend_from_slice(b"crowdfnd");
   		buf.extend_from_slice(&index.to_le_bytes()[..]);

   		child::ChildInfo::new_default(T::Hashing::hash(&buf[..]).as_ref())
   }
   ```

1. Write the following helper functions that make use of the [Child API](https://paritytech.github.io/substrate/master/frame_support/storage/child/index.html):

   - **`pub fn contribution_put`**: record a contribution in the associated child trie using [`put`](https://paritytech.github.io/substrate/master/frame_support/storage/child/fn.put.html)

   - **`pub fn contribution_get`**: lookup a contribution in the associated child trie using [`get`](https://paritytech.github.io/substrate/master/frame_support/storage/child/fn.get.html)

   - **`pub fn contribution_kil`**: remove a contribution from an associated child trie using [`kill`](https://paritytech.github.io/substrate/master/frame_support/storage/child/fn.kill.html)

   - **`pub fn crowdfund_kill`**: remove the entire record of contributions in the associated child trie in a single storage write using [`kill_storage`](https://paritytech.github.io/substrate/master/frame_support/storage/child/fn.kill_storage.html)

## Write your dispatchable functions

The follow steps outline how to write the dispatchables for this pallet.
After various checks within the dispatchables' logic, each function alters the `Funds<T>` storage map using its associated methods.
Our pallet's `create` function also makes use of the `FundInfo` struct created in step 2.

1. Create a new fund

   `fn create`:

   - create an imbalance variable using [`T::Currency::withdraw`](https://paritytech.github.io/substrate/master/frame_support/traits/tokens/currency/trait.Currency.html#tymethod.withdraw)
   - update the `Funds` storage item using the `FundInfo` struct from step 2
   - deposit a `Created` event

1. Contribute to an existing fund

   `fn contribute`:

   - perform preliminary safety checks using `ensure!`
   - add the contribution to the fund using `T::Currency::transfer`
   - record the contribution in the child trie using the helper function `contribution_put`
   - deposit a `Contributed` event

1. Withdraw full balance of a contributor to a fund

   `fn withdraw`:

   - perform preliminary safety checks using `ensure!`
   - return funds by using [`T::Currency::resolve_into_existing`](https://paritytech.github.io/substrate/master/frame_support/traits/tokens/currency/trait.Currency.html#method.resolve_into_existing)
   - calculate new balances and update storage using child trie helper functions `funds`, `contribution_get` and `contribution_kill`
   - deposit `Withdrew` event

1. Dissolve an entire crowdfund after its retirement period has expired.

   `fn dissolve`:

   - perform preliminary safety checks using `ensure!`
   - allow dissolver to collect funds by using [`T::Currency::resolve_creating`](https://paritytech.github.io/substrate/master/frame_support/traits/tokens/currency/trait.Currency.html#method.resolve_creating) for dissolver to collect funds
   - use the child trie helper function `crowdfund_kill` to remove contributor info from storage
   - deposit `Dissolved` event

1. Dispense a payment to the beneficiary of a successful crowdfund

   `fn dispense`:

   - use [`T::Currency::resolve_creating`](https://paritytech.github.io/substrate/master/frame_support/traits/tokens/currency/trait.Currency.html#method.resolve_creating) for beneficiary and caller (separately) to collect funds
   - give initial deposit to account who calls this function as an incentive to clean up storage
   - remove the fund from storage using `<Funds<T>>::remove(index);` and `Self::crowdfund_kill(index);` to remove all contributors from storage in a single write

## Examples

- [`pallet_simple_crowdfund`](https://github.com/substrate-developer-hub/substrate-how-to-guides/blob/main/example-code/template-node/pallets/simple-crowdfund/src/lib.rs#L1)

## Resources

- [Currency Imbalance trait](https://paritytech.github.io/substrate/master/frame_support/traits/tokens/imbalance/trait.Imbalance.html)
- [Child trie API](https://paritytech.github.io/substrate/master/frame_support/storage/child/index.html)
- [`extend_from_slice`](https://paritytech.github.io/substrate/master/frame_support/dispatch/struct.Vec.html#method.extend_from_slice)
- [`using_encode`](https://paritytech.github.io/substrate/master/frame_support/pallet_prelude/trait.Encode.html#method.using_encoded)
