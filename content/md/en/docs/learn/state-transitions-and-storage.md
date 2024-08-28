---
title: State transitions and storage
description:
keywords:
---

Substrate uses a simple key-value data store implemented as a database-backed, modified Merkle tree.
All of Substrate's [higher-level storage abstractions](/build/runtime-storage) are built on top of this simple key-value store.

## Key-Value database

Substrate implements its storage database with [RocksDB](https://rocksdb.org/), a persistent key-value store for fast storage environments. It also supports an experimental [Parity DB](https://github.com/paritytech/parity-db).

The DB is used for all the components of Substrate that require persistent storage, such as:

- Substrate clients
- Substrate light-clients
- Off-chain workers

## Trie abstraction

One advantage of using a simple key-value store is that you are able to easily abstract storage structures on top of it.

Substrate uses a Base-16 Modified Merkle Patricia tree ("trie") from [`paritytech/trie`](https://github.com/paritytech/trie) to provide a trie structure whose contents can be modified and whose root hash is recalculated efficiently.

Tries allow efficient storing and sharing of the historical block state. The trie root is a representation of the data within the trie; that is, two tries with different data will always have different roots.
Thus, two blockchain nodes can easily verify that they have the same state by simply comparing their trie roots.

Accessing trie data is costly.
Each read operation takes O(log N) time, where N is the number of elements stored in the trie. To mitigate this, we use a key-value cache.

All trie nodes are stored in the DB and part of the trie state can get pruned, i.e. a key-value pair can be deleted from storage when it is out of pruning range for non-archive nodes.
We do not use [reference counting](http://en.wikipedia.org/wiki/Reference_counting) for performance reasons.

### State trie

Substrate-based chains have a single main trie, called the state trie, whose root hash is placed in each block header.
This is used to easily verify the state of the blockchain and provide a basis for light clients to verify proofs.

This trie only stores content for the canonical chain, not forks.
There is a separate [`state_db` layer](https://paritytech.github.io/substrate/master/sc_state_db/index.html) that maintains the trie state with references counted in memory for all that is non-canonical.

### Child trie

Substrate also provides an API to generate new child tries with their own root hashes that can be used in the runtime.

Child tries are identical to the main state trie, except that a child trie's root is stored and updated as a node in the main trie instead of the block header.
Since their headers are a part of the main state trie, it is still easy to verify the complete node state when it includes child tries.

Child tries are useful when you want your own independent trie with a separate root hash that you can use to verify the specific content in that trie.
Subsections of a trie do not have a root-hash-like representation that satisfy these needs automatically; thus a child trie is used instead.

## Querying storage

Blockchains that are built with Substrate expose a remote procedure call (RPC) server that can be used to query runtime storage. When you use the Substrate RPC to access a storage item, you only need to provide [the key](#key-value-database) associated with that item.
Substrate's [runtime storage APIs](/build/runtime-storage) expose a number of storage item types; keep reading to learn how to calculate storage keys for the different types of storage items.

### Storage value keys

To calculate the key for a simple [Storage Value](/build/runtime-storage#storage-value), take the [TwoX 128 hash](https://github.com/Cyan4973/xxHash) of the name of the pallet that contains the Storage Value and prepend to it the TwoX 128 hash of the name of the Storage Value itself.
For example, the [Sudo](https://paritytech.github.io/substrate/master/pallet_sudo/index.html) pallet exposes a Storage Value item named `Key`:

```rust
twox_128("Sudo")                   = "0x5c0d1176a568c1f92944340dbfed9e9c"
twox_128("Key")                    = "0x530ebca703c85910e7164cb7d1c9e47b"
twox_128("Sudo") + twox_128("Key") = "0x5c0d1176a568c1f92944340dbfed9e9c530ebca703c85910e7164cb7d1c9e47b"
```

If the familiar `Alice` account is the sudo user, an RPC request and response to read the Sudo pallet's `Key` Storage Value could be represented as:

```rust
state_getStorage("0x5c0d1176a568c1f92944340dbfed9e9c530ebca703c85910e7164cb7d1c9e47b") = "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
```

In this case, the value that is returned (`"0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"`) is Alice's [SCALE](/reference/scale-codec)-encoded account ID (`5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY`).

You may have noticed that the [non-cryptographic](/build/runtime-storage#cryptographic-hashing-algorithms) TwoX 128 hash algorithm is used to generate Storage Value keys.
This is because it is not necessary to pay the performance costs associated with a cryptographic hash function since the input to the hash function (the names of the pallet and storage item) are determined by the runtime developer and not by potentially malicious users of your blockchain.

### Storage map keys

Like Storage Values, the keys for [Storage Maps](/build/runtime-storage#storage-map) are equal to the TwoX 128 hash of the name of the pallet that contains the map prepended to the TwoX 128 hash of the name of the Storage Map itself.
To retrieve an element from a map, append the hash of the desired map key to the storage key of the Storage Map.
For maps with two keys (Storage Double Maps), append the hash of the first map key followed by the hash of the second map key to the Storage Double Map's storage key.

Like Storage Values, Substrate uses the TwoX 128 hashing algorithm for the pallet and Storage Map names, but you will need to make sure to use the correct [hashing algorithm](/build/runtime-storage#hashing-algorithms) (the one that was declared in [the `#[pallet::storage]` macro](/build/runtime-storage#declaring-storage-items)) when determining the hashed keys for the elements in a map.

Here is an example that illustrates querying a Storage Map named `FreeBalance` from a pallet named `Balances` for the balance of the `Alice` account.
In this example, the `FreeBalance` map is using [the transparent Blake2 128 Concat hashing algorithm](/build/runtime-storage#transparent-hashing-algorithms):

```rust
twox_128("Balances")                                             = "0xc2261276cc9d1f8598ea4b6a74b15c2f"
twox_128("FreeBalance")                                          = "0x6482b9ade7bc6657aaca787ba1add3b4"
scale_encode("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY") = "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"

blake2_128_concat("0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d") = "0xde1e86a9a8c739864cf3cc5ec2bea59fd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"

state_getStorage("0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b4de1e86a9a8c739864cf3cc5ec2bea59fd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d") = "0x0000a0dec5adc9353600000000000000"
```

The value that is returned from the storage query (`"0x0000a0dec5adc9353600000000000000"` in the example above) is the [SCALE](/reference/scale-codec/)-encoded value of Alice's account balance (`"1000000000000000000000"` in this example).
Notice that before hashing Alice's account ID it has to be SCALE-encoded.
Also notice that the output of the `blake2_128_concat` function consists of 32 hexadecimal characters followed by the function's input.
This is because the Blake2 128 Concat is [a transparent hashing algorithm](/build/runtime-storage#transparent-hashing-algorithms).

Although the above example may make this characteristic seem superfluous, its utility becomes more apparent when the goal is to iterate over the keys in a map (as opposed to retrieving the value associated with a single key).
The ability to iterate over the keys in a map is a common requirement in order to allow _people_ to use the map in a way that seems natural (such as UIs): first, a user is presented with a list of elements in the map, then, that user can select the element that they are interested in and query the map for more details about that particular element.

Here is another example that uses the same example Storage Map (a map named `FreeBalances` that uses a Blake2 128 Concat hashing algorithm in a pallet named `Balances` that demonstrates using the Substrate RPC to query a Storage Map
for its list of keys via the `state_getKeys` RPC endpoint:

```rust
twox_128("Balances")                                      = "0xc2261276cc9d1f8598ea4b6a74b15c2f"
twox_128("FreeBalance")                                   = "0x6482b9ade7bc6657aaca787ba1add3b4"

state_getKeys("0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b4") = [
 "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b4de1e86a9a8c739864cf3cc5ec2bea59fd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
 "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b432a5935f6edc617ae178fef9eb1e211fbe5ddb1579b72e84524fc29e78609e3caf42e85aa118ebfe0b0ad404b5bdd25f",
 ...
]
```

Each element in the list that is returned by the Substrate RPC's `state_getKeys` endpoint can be directly used as input for the RPC's `state_getStorage` endpoint.
In fact, the first element in the example list above is equal to the input used for the `state_getStorage` query in the previous example (the one used to find the balance for `Alice`).
Because the map that these keys belong to uses a transparent hashing algorithm to generate its keys, it is possible to determine the account associated with the second element in the list.
Notice that each element in the list is a hexadecimal value that begins with the same 64 characters; this is because each list element represents a key in the same map, and that map is identified by concatenating two TwoX 128 hashes, each of which are 128-bits or 32 hexadecimal characters.
After discarding this portion of the second element in the list, you are left with `0x32a5935f6edc617ae178fef9eb1e211fbe5ddb1579b72e84524fc29e78609e3caf42e85aa118ebfe0b0ad404b5bdd25f`.

You saw in the previous example that this represents the Blake2 128 Concat hash of some [SCALE](/reference/scale-codec)-encoded account ID.
The Blake 128 Concat hashing algorithm consists of appending (concatenating) the hashing algorithm's input to its Blake 128 hash.
This means that the first 128 bits (or 32 hexadecimal characters) of a Blake2 128 Concat hash represents a Blake2 128 hash, and the remainder represents the value that was passed to the Blake 2 128 hashing algorithm.
In this example, after you remove the first 32 hexadecimal characters that represent the Blake2 128 hash (i.e. `0x32a5935f6edc617ae178fef9eb1e211f`) what is left is the hexadecimal value `0xbe5ddb1579b72e84524fc29e78609e3caf42e85aa118ebfe0b0ad404b5bdd25f`, which is a [SCALE](/reference/scale-codec)-encoded account ID.
Decoding this value yields the result `5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY`, which is the account ID for the familiar `Alice_Stash` account.

## Runtime storage API

Substrate's [FRAME Support crate](https://paritytech.github.io/substrate/master/frame_support/index.html) provides utilities for generating unique, deterministic keys for your runtime's storage items.
These storage items are placed in the [state trie](#trie-abstraction) and are accessible by [querying the trie by key](#querying-storage).

## Where to go next

- [Runtime storage](/build/runtime-storage)
- [Type encoding (SCALE)](/reference/scale-codec/)
