---
title: Runtime storage structures
description:
keywords:
---

As you develop runtime logic, you'll need to make important decisions about the information you store and how to make storing information as efficient as possible.
As discussed in [State transitions and storage](/learn/state-transitions-and-storage/), reading and writing data to storage is expensive.
In addition, storing unnecessarily large data sets can slow your network and strain system resources.

Substrate is designed to provide a flexible framework that allows you to build the blockchain that suits your needs.
However, you should keep a few basic guidelines in mind when designing runtime storage to ensure that you build a blockchain that is secure, performant, and maintainable in the long-term.

## Deciding what to store

The fundamental principle for blockchain runtime storage is to minimize both the number and size of the data items you store.
For example, you should only store _consensus-critical_ information in the runtime.
You shouldn't store intermediate or temporary data in the runtime or data that won't be needed if an operation fails.

## Use hashed data

Whenever possible, use techniques like hashing to reduce the amount of data you must store.
For example, many governance capabilities—such as the [`propose`](https://paritytech.github.io/substrate/master/pallet_democracy/pallet/enum.Call.html#variant.propose) function in the Democracy pallet—allow network participants to vote on the _hash_ of a dispatchable call instead of the call itself.
The hash of the call is always bounded in size, whereas the call might be unbounded in length.

Using the hash of a call is particularly important in the case of runtime upgrades where the dispatchable call takes an entire runtime Wasm blob as its parameter.
Because these governance mechanisms are implemented _on-chain_, all the information that is needed to come to consensus on the state of a given proposal must also be stored on-chain - this includes _what_ is being voted on.
However, by binding an on-chain proposal to its hash, Substrate's governance mechanisms allow this to be done in a way that defers bringing all the data associated with a proposal on-chain until _after_ it has been approved.
This means that storage is not wasted on proposals that fail.

Once a proposal has passed, someone can initiate the actual dispatchable call (including all its parameters), which will be hashed and compared to the hash in the proposal.

Another common pattern for using hashes to minimize data that is stored on-chain is to store the pre-image associated with an object in [IPFS](https://docs.ipfs.io); this means that only the IPFS location (a hash that is bounded in size) needs to be stored on-chain.

### Avoid storing transient data

Do not use runtime storage to store intermediate or transient data within the context of an operation that is logically atomic or data that will not be needed if the operation is to fail.
This does not mean that runtime storage should not be used to track the state of actions that require multiple atomic operations, as in the case of [the multi-signature capabilities from the Utility pallet](https://paritytech.github.io/substrate/master/pallet_utility/pallet/enum.Call.html#variant.as_multi).
In this case, runtime storage is used to track the signatories on a dispatchable call even though a given call may never receive enough signatures to actually be invoked.
In this case, each signature is considered an atomic event in the ongoing multi-signature operation.
The data needed to record a single signature is not stored until after all the preconditions associated with that signature have been met.

### Create bounds

Creating bounds on the size of storage items is an extremely effective way to control the use of runtime storage and one that is used repeatedly throughout the Substrate codebase.
In general, any storage item whose size is determined by user action should have a bound on it.
The multi-signature capabilities from the [Multisig pallet](https://paritytech.github.io/substrate/master/pallet_multisig/pallet/trait.Config.html#associatedtype.MaxSignatories) that were described above are one such example.
In this case, the list of signatories associated with a multi-signature operation is provided by the multi-signature participants.
Because this signatory list is [necessary to come to consensus](#what-to-store) on the state of the multi-signature operation, it must be stored in the runtime. However, to control how much space signatory list can use, the Utility pallet requires users to configure a bound on this number to be included as a precondition before anything is written to storage.

## Transactional storage

As explained in [State transitions and storage](/learn/state-transitions-and-storage/), runtime storage involves an underlying key-value database and in-memory storage overlay abstractions that keep track of keys and state changes until the values are committed to the underlying database.
By default, functions in the runtime write changes to a single in-memory **transactional storage layer** before committing them to the main storage overlay.
If an error prevents the transaction from being completed, the changes in the transactional storage layer are discarded instead of being passed on to the main storage overlay and state in the underlying database remains unchanged.

### Adding transactional storage layers

You can extend the transactional storage layer by using the `#[transactional]` macro to spawn additional in-memory storage overlays.
By spawning additional in-memory transactional storage overlays, you can choose whether you want to commit specific changes to the main storage overlay or not.
The additional transactional storage layers give you the flexibility to isolate changes to specific function calls and select at any point which changes to commit.

You can also nest transactional storage layers up to a maximum of ten nested transactional layers.
With each nested transactional storage layer you create, you can choose whether you want to commit changes to the transactional layer below it, giving you a great deal of control over what is committed to the underlying database.
Limiting the total number of nested transactional storage layers limits the computational overhead in resolving the changes to be committed.

### Dispatching transactional storage layer call

If you want to dispatch a function call within its own transactional layer, you can use the `dispatch_with_transactional(call)` function to explicitly spawn a new transactional layer for the call and use that transactional layer context to handle the result.

### Committing changes without the transactional storage layer

If you want to commit changes to the main storage overlay without using the default transactional storage layer, you can use the `#[without_transactional]` macro.
The `#[without_transactional]` macro enables you to identify a function that is safe to be executed without its own transactional layer.

For example, you might define a function like this:

```rust
/// This function is safe to execute without an additional transactional storage layer.
#[without_transactional]
fn set_value(x: u32) -> DispatchResult {
    Self::check_value(x)?;
    MyStorage::set(x);
    Ok(())
}
```

Calling this function doesn't spawn a transactional storage layer.

However, if you use the `#[without_transactional]` macro, keep in mind that changes to storage will affect the values in the main in-memory storage overlay.
If an error occurs after you have modified storage, those changes will persist, and potentially could result in your database being left in an inconsistent state.

## Accessing runtime storage

In [State transitions and storage](/learn/state-transitions-and-storage/), you learned how Substrate uses storage abstractions to provide read and write access to the underlying key-value database.
The FRAME [`Storage`](https://paritytech.github.io/substrate/master/frame_support/storage) module simplifies access to these layered storage abstractions.
You can use the FRAME storage data structures to read or write any value that can be encoded by the [SCALE codec](/reference/scale-codec/).
The storage module provides the following types of storage structures:

- [StorageValue](https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageValue.html) to store any single value, such as a `u64`.
- [StorageMap](https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageMap.html) to store a single key to value mapping, such as a specific account key to a specific balance value.
- [StorageDoubleMap](https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageDoubleMap.html) to store values in a storage map with two keys as an optimization to efficiently remove all entries that have a common first key.
- [StorageNMap](https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageNMap.html) to store values in a map with any arbitrary number of keys.

You can include any of these storage structures in pallets to introduce new storage items that will become part of the blockchain state.
The type of storage items you choose to implement depends entirely on how you want to use the information in the context of the runtime logic.

## Simple storage values

You can use `StorageValue` storage items for values that are viewed as a single unit by the runtime.
For example, you should use this type of storage for the following common use cases:

- Single primitive values
- Single `struct` data type objects
- Single collection of related items

If you use this type of storage for lists of items, you should be conscious about the size of the lists you store.
Large lists and `structs` incur storage costs and iterating over a large list or `struct` in the runtime can affect network performance or stop block production entirely.
If iterating over storage exceeds the block production time and your project is a [parachain](/reference/glossary/#parachain), the blockchain will stop producing blocks and functioning.

Refer to the [StorageValue](https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageValue.html#required-methods) documentation for a comprehensive list of methods that StorageValue exposes.

## Single key storage maps

Map data structures are ideal for managing sets of items whose elements will be accessed randomly, as opposed to iterating over them sequentially in their entirety.
Single key storage maps in Substrate are similar to traditional [hash maps](https://en.wikipedia.org/wiki/Hash_table) with key-to-value mapping to perform random lookups.
To give you flexibility and control, Substrate allows you to select the hashing algorithm you want to use to generate the map keys.
For example, if a map stores sensitive data you might want to generate keys using a hashing algorithm with stronger encryption over a hashing algorithm with better performance but weaker encryption properties.
For more information about selecting a hashing algorithm for a map to use, see [Hashing algorithms](#hashing-algorithms).

Refer to the [StorageMap](https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageMap.html#required-methods) documentation for a comprehensive list of methods that StorageMap exposes.

## Double key storage maps

[DoubleStorageMap](https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageDoubleMap.html) storage items are similar to single key storage maps except that they contain two keys.
Using this type of storage structure is useful for querying values with common keys.

## Multi-key storage maps

The [StorageNMap](https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageNMap.html) storage structure is also similar to single key and double key storage maps, but enable you to define any number of keys.
To specify the keys in a `StorageNMap` structure, you must provide a tuple containing the `NMapKey` struct as a type to the Key type parameter while declaring the `StorageNMap`.

Refer to the [StorageNMap documentation](https://paritytech.github.io/substrate/master/frame_support/storage/types/struct.StorageNMap.html) for more details about the syntax to use in declaring this type of storage structure.

## Iterating over storage maps

You can iterate over Substrate storage maps using the map keys and values.
However, it's important to keep in mind that maps are often used to track unbounded or very large sets of data, such as accounts and balances.
Iterating over a large data set can consume a lot of the limited resources you have available for producing blocks.
For example, if the time it takes to iterate over a data set exceeds the maximum time allocated for producing blocks, the runtime might stop producing new blocks, halting the progress of the chain.
In addition, the database reads required to access the elements in a storage map far exceeds the database reads required to access the elements in a list.
Therefore, it is significantly more costly—in terms of performance and execution time—to iterate over the elements in a storage map than to read the elements in a list.

With the relative costs in mind, it's generally better to avoid iterating over storage maps in the runtime.
However, there are no firm rules about how you use Substrate storage capabilities, and, ultimately, it's up to you to decide the best way to access runtime storage for your application.

Substrate provides the following methods to enable you to iterate over storage maps:

| Method        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `iter()`      | Enumerates all elements in the map in no particular order. If you alter the map while doing this, you'll get undefined results. For more information, see [`IterableStorageMap`](https://paritytech.github.io/substrate/master/frame_support/storage/trait.IterableStorageMap.html#tymethod.iter), [`IterableStorageDoubleMap`](https://paritytech.github.io/substrate/master/frame_support/storage/trait.IterableStorageDoubleMap.html#tymethod.iter), or [`IterableStorageNMap`](https://paritytech.github.io/substrate/master/frame_support/storage/trait.IterableStorageNMap.html#tymethod.iter).                                   |
| `drain()`     | Removes all elements from the map and iterate through them in no particular order. If you add elements to the map while doing this, you'll get undefined results. For more information, see [`IterableStorageMap`](https://paritytech.github.io/substrate/master/frame_support/storage/trait.IterableStorageMap.html#tymethod.drain), [`IterableStorageDoubleMap`](https://paritytech.github.io/substrate/master/frame_support/storage/trait.IterableStorageDoubleMap.html#tymethod.drain), [`IterableStorageNMap`](https://paritytech.github.io/substrate/master/frame_support/storage/trait.IterableStorageNMap.html#tymethod.drain). |
| `translate()` | Translates all elements of the map in no particular order. To remove an element from the map, return `None` from the translation function. For more information, see [`IterableStorageMap`](https://paritytech.github.io/substrate/master/frame_support/storage/trait.IterableStorageMap.html#tymethod.translate), [`IterableStorageDoubleMap`](https://paritytech.github.io/substrate/master/frame_support/storage/trait.IterableStorageDoubleMap.html#tymethod.translate), [`IterableStorageNMap`](https://paritytech.github.io/substrate/master/frame_support/storage/trait.IterableStorageNMap.html#tymethod.translate).            |

## Declaring storage items

You can create runtime storage items with the[`#[pallet::storage]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#storage-palletstorage-optional) attribute macro in any FRAME-based pallet.
The following examples illustrate how to declare different types of storage items.

### Single storage value

```rust
#[pallet::storage]
type SomePrivateValue<T> = StorageValue<
    _,
    u32,
    ValueQuery
>;

#[pallet::storage]
#[pallet::getter(fn some_primitive_value)]
pub(super) type SomePrimitiveValue<T> = StorageValue<_, u32, ValueQuery>;

#[pallet::storage]
pub(super) type SomeComplexValue<T: Config> = StorageValue<_, T::AccountId, ValueQuery>;
```

### Single key storage map

```rust
#[pallet::storage]
#[pallet::getter(fn some_map)]
pub(super) type SomeMap<T: Config> = StorageMap<
    _,
    Blake2_128Concat, T::AccountId,
    u32,
    ValueQuery
>;
```

### Double key storage map

```rust
#[pallet::storage]
pub(super) type SomeDoubleMap<T: Config> = StorageDoubleMap<
    _,
    Blake2_128Concat, u32,
    Blake2_128Concat, T::AccountId,
    u32,
    ValueQuery
>;
```

### Multi-key storage map

```rust
#[pallet::storage]
#[pallet::getter(fn some_nmap)]
pub(super) type SomeNMap<T: Config> = StorageNMap<
    _,
    (
        NMapKey<Blake2_128Concat, u32>,
        NMapKey<Blake2_128Concat, T::AccountId>,
        NMapKey<Twox64Concat, u32>,
    ),
    u32,
    ValueQuery,
>;
```

Notice that the map's storage items specify [the hashing algorithm](#hashing-algorithms) that will
be used.

### Handling query return values

When you declare a storage item, you can specify how queries should handle the return value if there is no value in storage for the specified key.
In the storage declaration, you specify the following:

- [`OptionQuery`](https://paritytech.github.io/substrate/master/frame_support/storage/types/struct.OptionQuery.html) to query an optional value from storage and return `Some` if storage contains a value or `None` if there's no value in storage.
- [`ResultQuery`](https://paritytech.github.io/substrate/master/frame_support/storage/types/struct.ResultQuery.html) to query a result value from storage and return an error if there's no value is in storage.

- [`ValueQuery`](https://paritytech.github.io/substrate/master/frame_support/storage/types/struct.ValueQuery.html) to query a value from storage and return the value.
  You can also use `ValueQuery` to return the default value if you have configured a specific default for a storage item or return the value configured with the `OnEmpty` generic.

### Visibility

In the examples above, all the storage items except `SomePrivateValue` are made public by way of the `pub` keyword.
Blockchain storage is always publicly visible from _outside_ of the runtime.
The visibility of Substrate storage items only impacts whether or not other pallets _within_ the runtime will be able to access a storage item.

### Getter methods

The `#[pallet::getter(..)]` macro provides an optional `get` extension that can be used to implement a getter method for a storage item on the module that contains that storage item.
The extension takes the desired name of the getter function as an argument.
If you omit this optional extension, you can access the storage item value, but you will not be able to do so by way of a getter method implemented on the module; instead, you will need to use [the storage item's `get` method](#methods).

The optional `getter` extension only impacts the way that a storage item can be accessed from _within_ Substrate code&mdash;you will always be able to [query the storage of your runtime](/build/runtime-storage#Querying-Storage) to get the value of a storage item.

Here is an example that implements a getter method named `some_value` for a Storage Value named `SomeValue`.
This pallet would now have access to a `Self::some_value()` method in addition to the `SomeValue::get()` method:

```rust
#[pallet::storage]
#[pallet::getter(fn some_value)]
pub(super) type SomeValue = StorageValue<_, u64, ValueQuery>;
```

### Default values

Substrate allows you to specify a default value that is returned when a storage item's value is not set.
Although the default value does **not** actually occupy runtime storage, the runtime logic will see this value during execution.

Here is an example of specifying a default value in storage:

```rust
#[pallet::type_value]
pub(super) fn MyDefault<T: Config>() -> T::Balance { 3.into() }
#[pallet::storage]
pub(super) type MyStorageValue<T: Config> =
    StorageValue<Value = T::Balance, QueryKind = ValueQuery, OnEmpty = MyDefault<T>>;
```

Notice that for the sake of adding clarity to each storage field, the syntax above is the non-abbreviated version of declaring storage items.

## Accessing storage items

Blockchains that are built with Substrate expose a remote procedure call (RPC) server that can be used to query runtime storage. You can use software libraries like [Polkadot JS](https://polkadot.js.org/) to easily interact with the RPC server from your code and access storage items. The Polkadot JS team also maintains [the Polkadot Apps UI](https://polkadot.js.org/apps), which is a fully-featured web app for interacting with Substrate-based blockchains, including querying storage.

## Hashing algorithms

A novel feature of Storage Maps in Substrate is that they allow developers to
specify the hashing algorithm that will be used to generate a map's keys.
A Rust object that is used to encapsulate hashing logic is referred to as a "hasher".
Broadly speaking, the hashers that are available to Substrate developers can be described in two ways:
(1) whether or not they are cryptographic; and
(2) whether or not they produce a transparent output.

For the sake of completeness, the characteristics of non-transparent hashing algorithms are described below, but keep in mind that any hasher that does not produce a transparent output has been deprecated for FRAME-based blockchains.

### Cryptographic hashing algorithms

Cryptographic hashing algorithms enable us to build tools that make it extremely difficult to manipulate the input of a hashing algorithm to influence its output.
For example, a cryptographic hashing algorithm would produce a wide distribution of outputs even if the inputs were the numbers 1 through 10.
It is critical to use cryptographic hashing algorithms when users are able to influence the keys of a Storage Map.
Failure to do so creates an attack vector that makes it easy for malicious actors to degrade the performance of your blockchain network.
An example of a map that should use a cryptographic hash algorithm to generate its keys is a map used to track account balances.
In this case, it is important to use a cryptographic hashing algorithm so that an attacker cannot bombard your system with many small transfers to sequential account numbers.
Without the appropriate cryptographic hashing algorithm this would create an imbalanced storage structure that would suffer in performance. Read more about common hashers in Subsrate in [Common Substrate hashers](#common-substrate-hashers).

Cryptographic hashing algorithms are more complex and resource-intensive than their non-cryptographic counterparts, which is why it is important for runtime engineers to understand their appropriate usages in order to make the best use of the flexibility Substrate provides.

### Transparent hashing algorithms

A transparent hashing algorithm is one that makes it easy to discover and verify the input that was
used to generate a given output. In Substrate, hashing algorithms are made transparent by
concatenating the algorithm's input to its output. This makes it trivial for users to retrieve a
key's original unhashed value and verify it if they'd like (by re-hashing it). The creators of
Substrate have **deprecated the use of non-transparent hashers** within FRAME-based runtimes, so
this information is provided primarily for completeness. In fact, it is _necessary_ to use a
transparent hashing algorithm if you would like to access [iterable map](#iterable-storage-maps)
capabilities.

### Common Substrate hashers

This table lists some common hashers used in Substrate and denotes those that are cryptographic and those that are transparent:

| Hasher                                                                                                        | Cryptographic | Transparent |
| ------------------------------------------------------------------------------------------------------------- | ------------- | ----------- |
| [Blake2 128 Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Blake2_128Concat.html) | X             | X           |
| [TwoX 64 Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Twox64Concat.html)        |               | X           |
| [Identity](https://paritytech.github.io/substrate/master/frame_support/struct.Identity.html)                  |               | X           |

The Identity hasher encapsulates a hashing algorithm that has an output equal to its input (the identity function).
This type of hasher should only be used when the starting key is already a cryptographic hash.

## Where to go next

Check out some guides covering various topics on storage:

- [How-to: Create a storage structure](/reference/how-to-guides/pallet-design/create-a-storage-structure)
- [StorageValue](https://paritytech.github.io/substrate/master/frame_support/storage/types/struct.StorageValue.html)
- [StorageMap](https://paritytech.github.io/substrate/master/frame_support/storage/types/struct.StorageMap.html)
- [StorageDoubleMap](https://paritytech.github.io/substrate/master/frame_support/storage/types/struct.StorageDoubleMap.html)
- [StorageNMap](https://paritytech.github.io/substrate/master/frame_support/storage/types/struct.StorageNMap.html)
