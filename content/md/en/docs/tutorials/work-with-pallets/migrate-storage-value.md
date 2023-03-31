---
title: Migrate a storage value
description: Illustrates how to write a simple storage migration for a pallet to update the runtime storage.
keywords:
  - storage migration
  - runtime
  - upgrades
---

This tutorial illustrates a simple storage migration to add a single storage item that you want to be included in a runtime upgrade. 
In this tutorial, you'll modify the storage map in the [Nicks pallet](https://github.com/paritytech/substrate/tree/master/frame/nicks) to provide an optional field that includes a last name and write the migration function ready to be triggered upon a runtime upgrade. 

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have completed [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) and have the Substrate node template installed locally.

- You have completed [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet) to add the Nicks pallets to the runtime.
  
## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Add a pallet to your local development environment.
- Modify the storage for a pallet to include a new item.
- 

## Prepare your local environment

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
   
   For example, if the runtime manifest uses `branch = "polkadot-v0.9.41"`, update the `Cargo.toml` file for the `nicks` pallet to use that branch.

9. Save your changes and close the file.

   If you are using the same runtime you used in [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet/), your `runtime/src/lib.rs` file already includes the configuration required for the Nicks pallet.
   You can check that your code compiles by running the following command:

   ```bash
   cargo check --package node-template-runtime --release
   ```

## Update storage in the Nicks pallet

By default, the Nicks pallet only stores a lookup table that maps a `NameOf` type to an `AccountId`.
For example, the default storage definition looks like this:

```text
/// The lookup table for names.
	#[pallet::storage]
	pub(super) type NameOf<T: Config> =
		StorageMap<_, Twox64Concat, T::AccountId, (BoundedVec<u8, T::MaxLength>, BalanceOf<T>)>;
```

For this tutorial, you're going to add a new storage structure—Nickname—to manage the previous storage item (`first`) and the new storage item (`last`).

To add the storage structure to the Nicks pallet:

1. Open a terminal shell and change to the root directory for the node template.

2. Open the `pallets/nicks/src/lib.rs` file in a text editor.

3. Add a structure to manage the previous and new storage items, first and last:
   
   ```rust
   pub struct Nickname {
       first: BoundedVec<u8>,
       last: Option<BoundedVec<u8>>, // handles empty storage
   }
   ```

4. Add an enumerated type to keep track of the storage versions:
   
   ```rust
   #[derive(codec::Encode, codec::Decode, Clone, frame_support::RuntimeDebug, PartialEq)]
   pub enum StorageVersion {
       V1Bytes,
       V2Struct,
   }
   ```

5. Add the `Nickname` struct in the `NameOf` configuration and add a new storage value item—`PalletVersion`—to declare the current version in storage.
   
   For example:
   
   ```rust

   ```

## Update functions

All of the Nicks pallet functions need to account for the new `last: Option<BoundedVec<u8>>` storage item. 
Therefore, you must update each function to include the `last` parameter declaration, for example:

```rust
//--snip
fn force_name(origin,
    target: <T::Lookup as StaticLookup>::Source,
    first: BoundedVec<u8>,
    last: Option<BoundedVec<u8>>) {
//--snip
    }
```

In addition, update all storage writes with the `Nickname` struct:

```rust
<NameOf<T>>::insert(&sender, (Nickname { first, last }, deposit));
```

### 4. Declare a migration module

The migration module should contain two parts:

1. A module indicating the deprecated storage to migrate from.
2. The migration function which returns a weight.

The scaffolding of this module looks like this:

```rust
pub mod migration {
  use super::*;

  pub mod v1 {...} // only contains V1 storage format

  pub fn migrate_to_v2<T: Config>() -> frame_support::weights::Weight {...} // contains checks and transforms storage to V2 format
}
```

### 5. Write `migrate_to_v2`

Here's an overview of what this function needs to do:

- Check the storage version to make sure a migration is needed (good practice)
- Transform the storage values into the new storage format
- Update the storage version
- Return the weight consumed by the migration

#### Check the storage version

Construct the `migrate_to_v2` logic around the check. If the storage migration doesn't need to happen, return 0:

```rust
if PalletVersion::get() == StorageVersion::V1Bytes {

    // migrate to v2

} else {
    frame_support::debug::info!(" >>> Unused migration!");
    0
}
```

#### Transform storage values

Using the [`translate storage method`][translate-storage-rustdocs],
transform the storage values to the new format. Since the existing `nick` value in storage can be made of a string separated by a
space, split it at the `' '` and place anything after that into the new `last` storage item. If it isn't, `last` takes the `None` value:

```rust
NameOf::<T>::translate::<(Vec<u8>, BalanceOf<T>), _>(
  |k: T::AccountId, (nick, deposit): (Vec<u8>, BalanceOf<T>)| {
    // We split the nick at ' ' (<space>).
    match nick.iter().rposition(|&x| x == b" "[0]) {
        Some(ndx) => Some((Nickname {
          first: nick[0..ndx].to_vec(),
				  last: Some(nick[ndx + 1..].to_vec())
          }, deposit)),
          None => Some((Nickname { first: nick, last: None }, deposit))
      }
		}
	);
```

<br />
<Message
  type={`green`}
  title={`Tip`}
  text={`Remove 'Option' wrapping to make sure 
  decoding works properly.`}
/>

#### Return the consumed weight

To do this, count the number of storage reads and writes and return the corresponding weight:

```rust
let count = NameOf::<T>::iter().count();
T::DbWeight::get().reads_writes(count as Weight + 1, count as Weight + 1)
```

#### Use `migrate_to_v2` in `on_runtime_upgrade`

Go back to the pallet's functions and specify the `migrate_to_v2` function in `on_runtime_upgrade`:

```rust
fn on_runtime_upgrade() -> frame_support::weights::Weight {
  migration::migrate_to_v2::<T>()
  }
```

### 6. Create a `types.json` file

Put the new storage types in a `types.json` which you will need to trigger the migration using a UI. Our new types in JSON are:

```rust
{
  "Nickname": {
    "first": "Vec<u8>",
    "last": "Option<Vec<u8>>"
  },
  "StorageVersion": {
    "_enum": [
      "V1Bytes",
      "V2Struct"
    ]
  }
}
```

## Examples

- [Migrating the Nicks pallet][nicks-migration-htg-diff]

## Resources

#### Rust docs

- [`Option` in Rust](https://doc.rust-lang.org/std/option/)
- [`frame_support::storage::migration`](/rustdocs/latest/frame_support/storage/migration/index.html) utility docs

[translate-storage-rustdocs]: /rustdocs/latest/frame_support/storage/types/struct.StorageMap.html#method.translate
[nicks-migration-htg-diff]: https://github.com/substrate-developer-hub/migration-example/pull/2/files
