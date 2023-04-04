---
title: Add custom storage items
description:
tutorial: 1
---

For the `collectibles` pallet to be useful, it needs to store information about the number of collectibles created and who owns each collectible. 
After you decide the information you want to store, you need to decide how it should be stored: as a single value or in a storage map.
For the workshop, you'll create three custom storage items to track the state:

- A simple single value—`CollectiblesCount`—to keep track of the total number of collectibles in the pallet.
- A simple map of key-value pairs—`CollectiblesMap`—to map the properties associated with each collectible to its unique identifier.
- A simple map of key-value pairs—`OwnerOfCollectibles`—to map collectibles to the user account that owns them.

For a closer look at the storage architecture and abstractions that Substrate uses, see [State transitions and storage](/learn/state-transitions-and-storage/).

## Store a single value

The FRAME storage module provides a `StorageValue` trait to store single values in the runtime.
  
In this workshop, you'll use a `StorageValue` for the `CollectiblesCount`—to keep track of the total number of collectibles in the pallet. The `StorageValue` keeps track of a 64-bit unsigned integer (u64) value that is incremented each time you generate a new collectible, up to maximum of 18_446_744_073_709_551_615 unique collectibles.

```rust
#[pallet::storage]
pub(super) type CollectiblesCount<T: Config> = StorageValue<_, u64, ValueQuery>;
```

The `ValueQuery` in this declaration specifies what a query should return if there's no value in storage.
There are three possible settings for handling what the query returns:
`OptionQuery`, `ResultQuery`, or `ValueQuery`.
We use `ValueQuery` here so that if there is no value in storage—for example when you first start the network—the query should return the value zero (0) rather than an `OptionQuery` value of `None` or a `ResultQuery` value of `Err`.

## Map collectibles to their properties

The FRAME storage module provides a `StorageMap` trait to store single key maps in the runtime.
A StorageMap named `CollectiblesMap` maps each collectible to its unique information.
The key for the `CollectiblesMap` map is the `unique_id` of the collectible.

```rust
/// Maps the Collectible struct to the unique_id.
#[pallet::storage]
pub(super) type CollectibleMap<T: Config> = StorageMap<_, Twox64Concat, [u8; 16], Collectible<T>>;
```

The `Twox64Concat` in this declaration specifies the hashing algorithm to use to create this storage value.
By allowing you to specify the hashing algorithm to use, storage maps allow you to control the level of security appropriate to the type of information being stored. 
For example, you might choose a more performant but less secure hashing algorithm to store information about collectibles and a less performant but more secure hashing algorithm to store more sensitive information.
For information about the hashing algorithms Substrate supports and the security they provide, see [Hashing algorithms](/build/runtime-storage/#hashing-algorithms ).

## Map owners to their collectibles

A StorageMap named `OwnerOfCollectibles` maps user accounts to the collectibles they own.

The key for this storage map is a user account: `T::AccountID`.
The value for this storage map is a `BoundedVec` data type with the `unique_id` of each collectible that each user account owns. 
This map makes it easy to look up each individual collectible for its information since the  `unique_id`  is used as the key for the `collectiblesMap` map.
By using a BoundedVec, you can ensure that each storage item has a maximum length, which is important for managing limits within the runtime.

```rust
/// Track the collectibles owned by each account.
#[pallet::storage]
pub(super) type OwnerOfCollectibles<T: Config> = StorageMap<
	_,
	Twox64Concat,
	T::AccountId,
	BoundedVec<[u8; 16], T::MaximumOwned>,
	ValueQuery,
>;
```

In order for the code to compile, you'll need to annotate the `Collectible` data structure with this derive macro:

```rust
#[scale_info(skip_type_params(T))]
```

Verify that your program compiles by running the following command:

```bash
cargo build --package collectibles
```
   
You can ignore the compiler warnings for now.