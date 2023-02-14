---
title: Migrate a storage value
description: Illustrates how to write a simple storage migration for a pallet to update the runtime storage.
keywords:
  - storage migration
  - runtime
  - upgrades
---

This tutorial illustrates how to perform a simple storage migration for a specific pallet by modifying the FRAME [Nicks pallet](https://github.com/paritytech/substrate/tree/master/frame/nicks).
In this tutorial, you'll modify the storage map in the [Nicks pallet](https://github.com/paritytech/substrate/tree/master/frame/nicks) to provide a new, optional field that allows end users to include a last name for their account nickname.
Because this change modifies the storage layout for the Nicks pallet, you'll need to write a migration function that can then be triggered with a runtime upgrade. 
After you complete a runtime upgrade that executes the migration function, your storage migration will be complete.

You can use this type of simple storage migration when changes are limited to specific pallets and individual storage items.
You can follow similar steps for more complex data migration, but you'll need to write more complex migration functions and use additional tooling to test your migration than explained in this tutorial.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have completed [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) and have the Substrate node template installed locally.

- You have completed [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet) to add the Nicks pallets to the runtime.
  
## Tutorial objectives

By completing this tutorial, you'll accomplish the following objectives:

- Add the Nicks pallet to your local development environment.
- Modify the storage for a pallet to include a new item.
- Update the functions that modify storage to account for the new item.
- Set the new storage version.
- Create a migration module with a migration function to transform storage.
- Add the migration function to the `on_runtime_upgrade` function for the pallet.

## Prepare your local environment

In [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet/), you saw how to add the Nicks pallet to the runtime as a remote dependency.
For this tutorial, you are going to update a local copy of the `nicks` pallet folder, so the first step is to add the `nicks` folder to the `pallets` directory for the `substrate-node-template` and modify the runtime to use this local pallet.

To prepare your environment:

1. Download the [nicks](https://github.com/paritytech/substrate/tree/master/frame/nicks) pallet, if necessary.

2. Open a terminal shell and change to the root directory for the node template.

3. Move the local copy of the `nicks` pallet to the `pallets` directory.

4. Open the `runtime/Cargo.toml` file in a text editor.
   
   If you are using the same runtime you used in [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet/), remove or comment out the remote dependency you previously added.

5. Add the `nicks` pallet to the local dependencies for the runtime.
   
   ```toml
   pallet-nicks = { version = "4.0.0-dev", default-features = false, path = "../pallets/nicks" }
   ```

6. Save your changes and close the file.

7. Open the `pallets/nicks/Cargo.toml` file in a text editor.

8. Update the dependencies to use the same pallet branch as the node template runtime.
   
   For example, if the runtime manifest uses `branch = "polkadot-v0.9.37"`, update the `Cargo.toml` file for the `nicks` pallet to use that branch.

9. Save your changes and close the file.

   If you are using the same runtime you used in [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet/), your `runtime/src/lib.rs` file already includes the configuration required for the Nicks pallet.
   You can check that your code compiles by running the following command:

   ```bash
   cargo check --package node-template-runtime --release
   ```

   To test your updates, compile the node and use the `substrate-front-end-template` or Polkadot/Substrate Portal to verify that you can set a nickname using the `setName` extrinsic function call.

## Update storage in the pallet

By default, the Nicks pallet uses a storage map to provide a lookup table with a `BoundedVec` to store the nickname.
For example, the default storage definition looks like this:

```text
/// The lookup table for names.
	#[pallet::storage]
	pub(super) type NameOf<T: Config> =
		StorageMap<_, Twox64Concat, T::AccountId, (BoundedVec<u8, T::MaxLength>, BalanceOf<T>)>;
```

For this tutorial, you're going to update the storage to add an optional field so that a nickname can include a first and last name.
To make this change, you'll create a new storage structure—Nickname—to manage the previous storage item (now called `first`) and the new storage item (`last`).

To add the storage structure to the Nicks pallet:

1. Open a terminal shell and change to the root directory for the node template.

2. Open the `pallets/nicks/src/lib.rs` file in a text editor.

3. Add a structure to manage the previous and new storage items, first and last:
   
   ```rust
   #[derive(Encode, Decode, Default, TypeInfo, MaxEncodedLen, PartialEqNoBound, RuntimeDebug)]
   #[scale_info(skip_type_params(T))]
   #[codec(mel_bound())]
   pub struct Nickname<T: Config> {
		 pub first: BoundedVec<u8, T::MaxLength>,
		 pub last: Option<BoundedVec<u8, T::MaxLength>>,
   }
   ```

4. Update the `NameOf` storage map to store the new `Nickname` data structure instead of only a `BoundedVec`.
   
   For example:
   
   ```rust
   #[pallet::storage]
   pub(super) type NameOf<T: Config> =
		 StorageMap<_, Twox64Concat, T::AccountId, (Nickname<T>, BalanceOf<T>)>;
   ```
   
## Update functions

Now that you have added the new data structure and modified storage to include both a first name and an optional last name, you must update the Nicks pallet functions to include the new `last: Option<BoundedVec<u8>>` parameter declaration.
In most cases, updating the functions when modifying storage items will require adding some logic to account for the changes.For example, you might need to modify parameter names or add new variables.

In this case, most of the changes required are in the `set_name` and `force_name` functions.
For example, you might modify the `set_name` function to change `bounded_name` to `bounded_first` and add the `bounded_last` declaration with code similar to the following:

```rust
//--snip
#[pallet::call_index(0)]
#[pallet::weight(50_000_000)]
		pub fn set_name(origin: OriginFor<T>, first: Vec<u8>, last: Option<Vec<u8>>) -> DispatchResult {
			let sender = ensure_signed(origin)?;

			let bounded_first: BoundedVec<_, _> =
				first.try_into().map_err(|_| Error::<T>::TooLong)?;
			ensure!(bounded_first.len() >= T::MinLength::get() as usize, Error::<T>::TooShort);
.
			let mut bounded_last: BoundedVec<_, _> = Default::default();
			if let Some(last) = last {
				bounded_last= last.try_into().map_err(|_| Error::<T>::TooLong)?;
				ensure!(bounded_last.len() >= T::MinLength::get() as usize, Error::<T>::TooShort);	
			}
			let bounded_last: Option<BoundedVec<u8, T::MaxLength>> = Some(bounded_last);

      let deposit = if let Some((_, deposit)) = <NameOf<T>>::get(&sender) {
				Self::deposit_event(Event::<T>::NameChanged { who: sender.clone() });
				deposit
			} else {
				let deposit = T::ReservationFee::get();
				T::Currency::reserve(&sender, deposit)?;
				Self::deposit_event(Event::<T>::NameSet { who: sender.clone() });
				deposit
			};
			
			<NameOf<T>>::insert(&sender, (Nickname{first: bounded_first, last: bounded_last}, deposit));
			Ok(())
		}
```

Notice that this code sample for the `set_name` function includes an update to the storage map `insert` operation to use the `Nickname` struct.
You would make similar changes to the `force_name` function:

```rust
		pub fn force_name(
			origin: OriginFor<T>,
			target: AccountIdLookupOf<T>,
			first: Vec<u8>, 
			last: Option<Vec<u8>>
		) -> DispatchResult .{ 
```

## Add the storage version

The `pallet::pallet` macro implements `traits::GetStorageVersion`, but you must specify the current storage version to pass to the macro. 
You can specify the current storage version by using the `pallet::storage_version` macro.
For example:

```rust
  /// The current storage version, we set to 2 our new version.
	const STORAGE_VERSION: StorageVersion = StorageVersion::new(2);
  #[pallet::pallet]
	#[pallet::generate_store(pub(super) trait Store)]
	#[pallet::storage_version(STORAGE_VERSION)]
	pub struct Pallet<T>(_);
```

## Declare a migration module

The next step in preparing your storage migration is to create a Rust migration module.
The migration module contains two parts:

- A module indicating the deprecated storage to migrate from.
- The migration function that transforms storage and returns a weight.

The migration function—`migrate_to_v2`—must perform the following tasks:

- Check the storage version to make sure a migration is needed.
- Transform the storage values to use the new storage format.
- Update the storage version.
- Return the weight consumed by the migration.

To create a migration module for the Nicks pallet:

1. Open a terminal shell and change to the root directory for the node template.

2. Create a new `migration.rs` file in the `pallets/nicks/src` directory.

3. Open the `pallets/nicks/src/migration.rs` file in a text editor.

4. Prepare the scaffolding for migration module with code like this:
   
   ```rust
   pub mod migration {
     use super::*;
    
     pub mod v1 {
       // contains V1 storage format
     } 
     pub fn migrate_to_v2<T: Config>() -> frame_support::weights::Weight {
       // contains checks and transforms storage to V2 format
     } 
   }
   ```

5. Construct the `migrate_to_v2` logic to check the storage version, and return 0 if no storage migration is needed.
   
   For example:
   
   ```rust
     let onchain_version =  Pallet::<T>::on_chain_storage_version();
     if onchain_version < 2 {
        // Migrate tp V2
     }
     else {
        // We don't do anything here.
		 Weight::zero()
     }
   ```

6. Use the `translate` storage method to transform the storage values to the new format. 
   
   In this example, the existing nickname value in storage can be a string with embedded spaces.
   To handle existing values, you can split the name at the first blank space and place anything after that space into the new `last` storage item. 
   If the existing name doesn't have a space, the `last` storage item is assigned a value of `None`.
   For example:
   
   ```rust
        // Transform the storage values from the old format into the new format.
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

7. Update the storage version.
   
   For example:

   ```rust
   StorageVersion::new(2).put::<Pallet::<T>>();
   ```

8. Return the consumed weight by counting the number of storage reads and writes and returning the corresponding weight.
   
   For example:
   
   ```rust
   let count = NameOf::<T>::iter().count();
   T::DbWeight::get().reads_writes(count as Weight + 1, count as Weight + 1)
   ```

9. Save your changes and close the migration module.

## Add migration to the runtime upgrade function

To add the migration function to the pallet:

1. Open a terminal shell and change to the root directory for the node template.

2. Open the `pallets/nicks/src/lib.rs` file in a text editor.
   
3. Add the migration module to the pallet.
   
   ```rust
   mod migration;
   ```

1. Add the `migrate_to_v2` function in `on_runtime_upgrade` hook.
   
   For example:
   
   ```rust
    #[pallet::hooks]
    impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
		  fn on_runtime_upgrade() -> frame_support::weights::Weight {
			  migration::migrate_to_v2::<T>()
		  }
	  }
   ```

## Update unit tests

It's important to test runtime migrations to prevent any issues or errors that might result in lost or corrupted storage items.
In most cases, testing migration involves both updating unit tests for the new code you have added and using `try-runtime` to execute the `on_runtime_upgrade` logic in a test environment.
For this tutorial, the Nicks pallet has the following unit tests:

- `fn kill_name_should_work()`
- `fn force_name_should_work()`
- `fn normal_operation_should_work()`
- `fn error_catching_should_work()`

You should update each test to work with the new code.
For example: 

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

## Examples

- [Migrating the Nicks pallet][nicks-migration-htg-diff]

## Resources

#### Rust docs

- [`Option` in Rust](https://doc.rust-lang.org/std/option/)
- [`frame_support::storage::migration`](/rustdocs/latest/frame_support/storage/migration/index.html) utility docs

[translate-storage-rustdocs]: /rustdocs/latest/frame_support/storage/types/struct.StorageMap.html#method.translate
[nicks-migration-htg-diff]: https://github.com/substrate-developer-hub/migration-example/pull/2/files
