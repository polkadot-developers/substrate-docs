---
title: Basic Storage Migration
desciption: Example about how to migrate storage for Nicks pallet
keywords:
  - storage migration
  - runtime
  - upgrades
---

This guide will step through a storage migration on [FRAME's Nick's pallet](https://github.com/paritytech/substrate/tree/master/frame/nicks). 
It shows how to modify a storage map to provide an optional field that includes a last name, and how to write the migration function ready to be triggered upon a runtime upgrade. This guide can equally be used in other contexts which require a simple storage migration that modifies a storage map in a runtime.

## Steps

### 1. Add the Nicks pallet locally in our node
We are going to make a change in the [FRAME's Nick's pallet](https://github.com/paritytech/substrate/tree/master/frame/nicks), in the tutorial [Add a pallet to the runtime](https://docs.substrate.io/tutorials/work-with-pallets/add-a-pallet/) we show how to add the Nicks pallet to the runtime for the node template.

For this guide, because we are going to make changes in the code of the pallet we are going to take the code of the pallet and add it locally in out node template. You can check an example of how to add it locally [here] (https://github.com/substrate-developer-hub/substrate-node-template/commit/022b6da0d1d55f54de3568e97aa5fe45a7975fa5).

For testing we can now start our node and set a nickname using the Nicks pallet within the extrinsic `setName`.

### 2. Create a storage struct and update storage item.

The Nicks pallet keeps track of a lookup table in storage, where it stores a BoundedVec with the name.
We want to update the storage to add an optional field that includes a last name too. For that we create a new struct `Nickname` to manage the previous and new storage items, first name and last name:

```rust
    #[derive(Encode, Decode, Default, TypeInfo, MaxEncodedLen, PartialEqNoBound, RuntimeDebug)]
	#[scale_info(skip_type_params(T))]
	#[codec(mel_bound())]
	pub struct Nickname<T: Config> {
		pub first: BoundedVec<u8, T::MaxLength>,
		pub last: Option<BoundedVec<u8, T::MaxLength>>,
	}
```
To change now the data stored in the storage we will update the StorageMap `NameOf` to store the Nickname struct instead of only a `BoundedVec`

```rust
    #[pallet::storage]
	pub(super) type NameOf<T: Config> =
		StorageMap<_, Twox64Concat, T::AccountId, (Nickname<T>, BalanceOf<T>)>;
```

### 3. Update all functions

All of the Nicks pallet functions need to account for the new `last: Option<Vec<u8>>` storage item. Update each function by adding it as a parameter, for example:

```rust
//--snip
pub fn set_name(origin,
    first: Vec<u8>,
    last: Option<Vec<u8>>)  -> DispatchResult{
```

In addition, update all storage writes with the `Nickname` struct:
```rust
//--snip
pub fn set_name(origin,
    first: Vec<u8>,
    last: Option<Vec<u8>>)  -> DispatchResult{
    //--snip

    let bounded_first: BoundedVec<_, _> =
        first.try_into().map_err(|_| Error::<T>::TooLong)?;
    ensure!(bounded_first.len() >= T::MinLength::get() as usize, Error::<T>::TooShort);

    let mut bounded_last: BoundedVec<_, _> = Default::default();
    if let Some(last) = last {
        bounded_last= last.try_into().map_err(|_| Error::<T>::TooLong)?;
        ensure!(bounded_last.len() >= T::MinLength::get() as usize, Error::<T>::TooShort);	
    }
    let bounded_last: Option<BoundedVec<u8, T::MaxLength>> = Some(bounded_last);

    //--snip
    <NameOf<T>>::insert(&sender, (Nickname{first: bounded_first, last: bounded_last}, deposit));
    }
```
Check an example of how to update the extrinsics [here] (https://github.com/substrate-developer-hub/substrate-node-template/commit/a9ee9b2b9096c2b85ecb4448366df2b8502e7aa7).

### 4. Add the storage version
The `pallet::pallet` macro implements `traits::GetStorageVersion` but the current storage version needs to be communicated to the macro. This can be done by using the `pallet::storage_version` macro.
```rust
    /// The current storage version, we set to 2 our new version.
	const STORAGE_VERSION: StorageVersion = StorageVersion::new(2);


    #[pallet::pallet]
	#[pallet::generate_store(pub(super) trait Store)]
	#[pallet::storage_version(STORAGE_VERSION)]
	pub struct Pallet<T>(_);
```

### 5. Declare a migration module

The migration module should contain two parts:

1. A module indicating the deprecated storage to migrate from.
2. The migration function which returns a weight.

Create a new file in src/pallets/nicks/migration.rs

The scaffolding of this module looks like this:

```rust
pub mod migration {
  use super::*;

  pub mod v1 {...} // only contains V1 storage format

  pub fn migrate_to_v2<T: Config>() -> Weight {...} // contains checks and transforms storage to V2 format
}
```

### 6. Write `migrate_to_v2`

Here's an overview of what this function needs to do:

- Check the storage version to make sure a migration is needed (good practice)
- Transform the storage values into the new storage format
- Update the storage version
- Return the weight consumed by the migration

#### Check the storage version

Construct the `migrate_to_v2` logic around the check. If the storage migration doesn't need to happen, return 0:

```rust
    let onchain_version =  Pallet::<T>::on_chain_storage_version();
    if onchain_version < 2 {

    }
    else {
        // We don't do anything here.
		Weight::zero()
    }
```

#### Transform storage values

Using the [`translate storage method`][translate-storage-rustdocs],
transform the storage values to the new format. Since the existing `nick` value in storage can be made of a string separated by a
space, split it at the `' '` and place anything after that into the new `last` storage item. If it isn't, `last` takes the `None` value:

```rust
        // We transform the storage values from the old into the new format.
        NameOf::<T>::translate::<(Vec<u8>, BalanceOf<T>), _>(
            |k: T::AccountId, (nick, deposit): (Vec<u8>, BalanceOf<T>)| {
                info!(target: LOG_TARGET, "     Migrated nickname for {:?}...", k);

                // We split the nick at ' ' (<space>).
                match nick.iter().rposition(|&x| x == b" "[0]) {
                    Some(ndx) => {
                        let bounded_first: BoundedVec<_, _> = nick[0..ndx].to_vec().try_into().unwrap();
                        let bounded_last: BoundedVec<_, _> = nick[ndx + 1..].to_vec().try_into().unwrap();
                        Some((Nickname {
                            first: bounded_first,
                            last: Some(bounded_last)
                        }, deposit))
                },
                    None => {
                        let bounded_name: BoundedVec<_, _> = nick.to_vec().try_into().unwrap();
                        Some((Nickname { first: bounded_name, last: None }, deposit))
                    }
                }
            }
        );
```

#### Update the storage version
```rust
    // Update storage version.
	StorageVersion::new(2).put::<Pallet::<T>>();
```

#### Return the consumed weight

To do this, count the number of storage reads and writes and return the corresponding weight:

```rust
let count = NameOf::<T>::iter().count();
T::DbWeight::get().reads_writes(count as Weight + 1, count as Weight + 1)
```

### 7. Use `migrate_to_v2` in `on_runtime_upgrade`
In your pallet lib.rs, declare the mod migration.
```rust
mod migration;
```

And go back to the pallet's functions and specify the `migrate_to_v2` function in `on_runtime_upgrade`. This lets you express what should happen when the runtime upgrades:

```rust
    #[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
		fn on_runtime_upgrade() -> frame_support::weights::Weight {
			migration::migrate_to_v2::<T>()
		}
	}
```

Check an example of the full migration code [here] (https://github.com/substrate-developer-hub/substrate-node-template/commit/cfbe01dd4be358d0df45a81b87b6ba7393e20368).

### 8. Fix unit tests

When writing a runtime migration module it is important to test it to avoid any critical issues caused by mangling storage items.

For the Nicks pallet we have following tests:

- `fn kill_name_should_work()`
- `fn force_name_should_work()`
- `fn normal_operation_should_work()`
- `fn error_catching_should_work()`

We have to update them to work with the new code we have added, for example: 
```rust
    #[test]
	fn normal_operation_should_work() {
		new_test_ext().execute_with(|| {
			assert_ok!(Nicks::set_name(RuntimeOrigin::signed(1), b"Gav".to_vec(), None));
			assert_eq!(Balances::reserved_balance(1), 2);
			assert_eq!(Balances::free_balance(1), 8);
			assert_eq!(<NameOf<Test>>::get(1).unwrap().0.first, b"Gav".to_vec());

			assert_ok!(Nicks::set_name(RuntimeOrigin::signed(1), b"Gavin".to_vec(), None));
			assert_eq!(Balances::reserved_balance(1), 2);
			assert_eq!(Balances::free_balance(1), 8);
			assert_eq!(<NameOf<Test>>::get(1).unwrap().0.first, b"Gavin".to_vec());

			assert_ok!(Nicks::clear_name(RuntimeOrigin::signed(1)));
			assert_eq!(Balances::reserved_balance(1), 0);
			assert_eq!(Balances::free_balance(1), 10);
		});
	}
```
Check an example of the full test fixes [here] (https://github.com/substrate-developer-hub/substrate-node-template/commit/fa021b11878e8621bb455d4638e1821b681c085e).
## Examples

- [Migrating the Nicks pallet](https://github.com/substrate-developer-hub/substrate-node-template/tree/alexd10s/how-to-storage-migration-example)

## Resources

#### Rust docs

- [`Option` in Rust](https://doc.rust-lang.org/std/option/)
- [`frame_support::storage::migration`](https://paritytech.github.io/substrate/master/frame_support/storage/migration/index.html) utility docs

[translate-storage-rustdocs]: https://paritytech.github.io/substrate/master/frame_support/storage/types/struct.StorageMap.html#method.translate
[nicks-migration-htg-diff]: https://github.com/substrate-developer-hub/migration-example/pull/2/files