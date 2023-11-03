---
title: Offchain local storage
description:
keywords:
  - offchain worker
  - ocw
  - local
  - storage
---

This guide will teach you how to use an offchain worker to save retrieved data in local storage for future access.

In the last section, we mentioned that offchain workers (**OCW** for short) cannot modify the blockchain state directly, so they have to submit transactions to save their computed results back on-chain.
Nonetheless there are also times when the data is not suitable to be saved on-chain yet still needs to be stored somewhere for future access.
This includes temporary data or intermediate calculations that can be discarded once the computation is completed.

In this guide, we will instruct offchain workers to write data to the local storage without passing the data among the whole blockchain network.
The concept of a **Storage Lock** is introduced to have value accessible consistently among multiple OCWs.
OCWs are asynchronously run at the end of each block production and they are not limited by how long they run, so at any point of time there could be multiple OCW instances being initiated.

The local storage APIs are similar to their on-chain counterpart, using `get`, `set`, and `mutate` to access them.
`mutate` is using a [**compare-and-set pattern**](https://en.wikipedia.org/wiki/Compare-and-swap)-it compares the content of a memory location with a given value and, only if they are the same, modifies the contents of that memory location to a new given value.
This is done as a single atomic operation.
The atomicity guarantees that the new value is calculated based on up-to-date information; if the value had been updated by another thread in the meantime, the write would fail.

Note that as values stored in local storage has not gone through the consensus mechanism among the network, so they are subject to manipulation of the node operator.

In this how-to guide, we will first check from the storage, which acts as a cache, if the computed value exists.
If the cached value is found, offchain worker returns; else it will try to acquire a lock, perform the intensive computation, and save it to the storage/cache.

## Steps

1. Define a storage reference in your pallet's `offchain_worker` function hook:

   ```rust
   fn offchain_worker(block_number: T::BlockNumber) {
     // Create a reference to Local Storage value.
     // Since the local storage is common for all offchain workers, it's a good practice
     // to prepend our entry with the pallet name.
     let storage = StorageValueRef::persistent(b"pallet::my-storage");
   }
   ```

   In the above code, a persistent local storage is defined using [`StorageValueRef::persistent()`](https://paritytech.github.io/substrate/master/sp_runtime/offchain/storage/struct.StorageValueRef.html#method.persistent) which is identified by `pallet::my-storage` key.
   The key is in a byte array type instead of a `str` type.
   This local storage is persisted and shared across runs of the offchain workers.

1. Check if the storage contains a cached value.

   ```rust
   fn offchain_worker(block_number: T::BlockNumber) {
     // ...
     let storage = StorageValueRef::persistent(b"pallet::my-storage");

     if let Ok(Some(res)) = storage.get::<u64>() {
       log::info!("cached result: {:?}", res);
       return Ok(());
     }
   }
   ```

   The result is fetched using [`get<T: Decode>()`](https://paritytech.github.io/substrate/master/sp_runtime/offchain/storage/struct.StorageValueRef.html#method.get) function, returning a `Result<Option<T>, StorageRetrievalError>` type.
   We only care about the case of having a valid value. If yes, return `Ok(())`.
   Note we also need to define the type of the returned value.

   Use [`set()`](https://paritytech.github.io/substrate/master/sp_runtime/offchain/storage/struct.StorageValueRef.html#method.get) to write to storage and [`mutate<T, E, F>()`](https://paritytech.github.io/substrate/master/sp_runtime/offchain/storage/struct.StorageValueRef.html#method.mutate) to read and change the storage atomically.

1. If there is no valid value (`None`) or having a `StorageRetrievalError`, proceed to compute the required result and acquire the storage lock.

   First define the storage lock as follows.

   ```rust
   const LOCK_BLOCK_EXPIRATION: u32 = 3; // in block number
   const LOCK_TIMEOUT_EXPIRATION: u64 = 10000; // in milli-seconds

   fn offchain_worker(block_number: T::BlockNumber) {
     // ...
     let storage = StorageValueRef::persistent(b"pallet::my-storage");

     if let Ok(Some(res)) = storage.get::<u64>() {
       log::info!("cached result: {:?}", res);
       return Ok(());
     }

     // Very intensive computation here
     let val: u64 = 100 + 100;

     // Define the storage lock
     let mut lock = StorageLock::<BlockAndTime<Self>>::with_block_and_time_deadline(
       b"pallet::storage-lock",
       LOCK_BLOCK_EXPIRATION,
       Duration::from_millis(LOCK_TIMEOUT_EXPIRATION)
     );
   }
   ```

   In the above code snippet, a storage lock is defined with both the [block and time deadline specified](https://paritytech.github.io/substrate/master/sp_runtime/offchain/storage_lock/struct.StorageLock.html#method.with_block_and_time_deadline).
   This function takes in a lock identifier, block number expiration, and time expiration.
   The above lock expires when it either passes the specified amount of block number or time duration.
   We can also specify the expiration period with [just the block number](https://paritytech.github.io/substrate/master/sp_runtime/offchain/storage_lock/struct.StorageLock.html#method.with_block_deadline) or [time duration](https://paritytech.github.io/substrate/master/sp_runtime/offchain/storage_lock/struct.StorageLock.html#method.with_deadline).

1. Acquire the storage lock using [`.try_lock()`](https://paritytech.github.io/substrate/master/sp_runtime/offchain/storage_lock/struct.StorageLock.html#method.try_lock).

   ```rust
   fn offchain_worker(block_number: T::BlockNumber) {
     // ...

     let mut lock = /* .... */;

     if let Ok(_guard) = lock.try_lock() {
       storage.set(&val);
     }
   }
   ```

   It returns `Result<StorageLockGuard<'a, '_, L>, <L as Lockable>::Deadline>`.
   The mechanism here is to get a hold of the lock guard first which can only be held by one process at a time before writing to storage.
   Then the value is written to the storage using `set()`.
   The data type of the value passed into `set()` must be the same as the type specified above in the `get<T>()` call.

1. Finally, return from the offchain worker function.

   The full code looks similar to the following:

   ```rust
   const LOCK_BLOCK_EXPIRATION: u32 = 3; // in block number
   const LOCK_TIMEOUT_EXPIRATION: u64 = 10000; // in milli-seconds

   fn offchain_worker(block_number: T::BlockNumber) {
     let storage = StorageValueRef::persistent(b"pallet::my-storage");

     if let Ok(Some(res)) = storage.get::<u64>() {
       log::info!("cached result: {:?}", res);
       return Ok(());
     }

     // Very intensive computation here
     let val: u64 = 100 + 100;

     // Define the storage lock
     let mut lock = StorageLock::<BlockAndTime<Self>>::with_block_and_time_deadline(
       b"pallet::storage-lock",
       LOCK_BLOCK_EXPIRATION,
       Duration::from_millis(LOCK_TIMEOUT_EXPIRATION)
     );

     if let Ok(_guard) = lock.try_lock() {
       storage.set(&val);
     }
     Ok(())
   }
   ```

## Examples

- [**Off-chain worker example pallet** in Substrate](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/examples/offchain-worker/src/lib.rs#L372-L441)
- [**OCW pallet** demo](https://github.com/jimmychu0807/substrate-offchain-worker-demo/blob/master/pallets/ocw/src/lib.rs#L299-L342)
