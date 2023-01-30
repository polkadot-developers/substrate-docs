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

- Modify the storage for a pallet to include a new item.
- 
## Update the Nicks pallet

To add the storage item to the Nicks pallet:

1. Open a terminal shell and change to the root directory for the node template.

2. Create a storage struct and utility type

Write a struct to manage the previous and new storage items, first and last:

```rust
pub struct Nickname {
    first: Vec<u8>,
    last: Option<Vec<u8>>, // handles empty storage
}
```

Write a utility type enum to keep track of the storage versions:

```rust
#[derive(codec::Encode, codec::Decode, Clone, frame_support::RuntimeDebug, PartialEq)]
pub enum StorageVersion {
	V1Bytes,
	V2Struct,
}
```

### 2. Update your storage items

The Nicks pallet only keeps track of a lookup table in storage, but we also need to add `PalletVersion` to
declare the current version in storage. To update these items, use the `Nickname` struct in the `NameOf` item and add the new storage item `PalletVersion`:

```rust
decl_storage! {
	trait Store for Module<T: Trait> as MyNicks {
		/// The lookup table for names.
		NameOf: map hasher(twox_64_concat) T::AccountId => Option<(Nickname, BalanceOf<T>)>;
		/// The current version of the pallet.
		PalletVersion: StorageVersion = StorageVersion::V1Bytes;
	}
}
```

### 3. Update all functions

All of the Nicks pallet functions need to account for the new `last: Option<Vec<u8>>` storage item. Update each function by adding it as a parameter, for example:

```rust
//--snip
fn force_name(origin,
    target: <T::Lookup as StaticLookup>::Source,
    first: Vec<u8>,
    last: Option<Vec<u8>>) {
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
