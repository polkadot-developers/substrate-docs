---
title: Offchain indexing
description:
keywords:
  - offchain worker
  - ocw
  - indexing
---

<div class="warning">
	 Please refer to the <a href="https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/reference_docs/frame_offchain_workers/index.html">Rust Docs</a> for the most up-to-date documentation on this topic.
</div>

This guide will step you through how to pass data from an extrinsic to an offchain worker without writing to storage.

Occasionally on-chain extrinsics need to pass data to offchain workers with predictable write behavior.
This data could be written to on-chain storage for offchain workers to read, but this could potentially incur a huge cost to the blockchain.
Another way of handing data from on-chain to offchain worlds is by saving it in the local storage of a node via **offchain indexing**.

Off-chain indexing is called from on-chain extrinsics which implies that the data written locally is expected to be consistent across all nodes in the network.

Another use case is when needing to store large chunks of data on-chain for offchain workers to process.
This would be too expensive.
The solution would be to use offchain indexing to store a hash of that data on-chain and have the corresponding raw data stored locally for an offchain worker to read later on.

Notice that the same extrinsic could be run multiple times when there are forked blocks.
The consequence is that in case non-unique keys are used, the data might be overwritten by different forked blocks and the content in the local storage will be different between nodes.
So developers should be careful in forming the right indexing key to prevent potential overwrites.

Note: In order to see the offchain indexing feature in action, run your Substrate node with the offchain indexing flag _ON_.
For example: `./target/release/substrate-node --enable-offchain-indexing true`

## Steps

1. Create a unique key used for indexing.

   In the `src/lib.rs` of your pallet:

   ```rust
   const ONCHAIN_TX_KEY: &[u8] = b"my_pallet::indexing1";

   #[pallet::call]
   impl<T: Config> Pallet<T> {
   	#[pallet::weight(100)]
   	pub fn extrinsic(origin: OriginFor<T>, number: u64) -> DispatchResult {
   		let who = ensure_signed(origin)?;

   		let key = Self::derived_key(frame_system::Module::<T>::block_number());
   		// ...

   		Ok(())
   	}
   }

   impl<T: Config> Pallet<T> {
   	fn derived_key(block_number: T::BlockNumber) -> Vec<u8> {
   		block_number.using_encoded(|encoded_bn| {
   			ONCHAIN_TX_KEY.clone().into_iter()
   				.chain(b"/".into_iter())
   				.chain(encoded_bn)
   				.copied()
   				.collect::<Vec<u8>>()
   		})
   	}
   }
   ```

   In the above code within a regular extrinsic, the `Self::derived_key()` helper method is called to generate the key used later for indexing.
   It concatenates a predefined prefix with the current encoded block number and returns it as a vector of bytes.

1. Define the indexing data and save it using offchain indexing:

   ```rust
   use sp_io::offchain_index;
   const ONCHAIN_TX_KEY: &[u8] = b"my_pallet::indexing1";

   #[derive(Debug, Deserialize, Encode, Decode, Default)]
   struct IndexingData(Vec<u8>, u64);

   #[pallet::call]
   impl<T: Config> Pallet<T> {
   	#[pallet::weight(100)]
   	pub fn extrinsic(origin: OriginFor<T>, number: u64) -> DispatchResult {
   		let who = ensure_signed(origin)?;

   		let key = Self::derived_key(frame_system::Module::<T>::block_number());
   		let data = IndexingData(b"submit_number_unsigned".to_vec(), number);
   		offchain_index::set(&key, &data.encode());
   		Ok(())
   	}
   }

   impl<T: Config> Pallet<T> {
   	// -- skipped for brevity --
   }
   ```

   The indexing data can be any data type that can be bound by the `Encode`, `Decode`, and `Deserialize` traits.
   In the above code, data is stored via offchain indexing using the [`offchain_index::set()`](https://paritytech.github.io/substrate/master/sp_io/offchain_index/fn.set.html) method.

1. Use the `offchain_worker` hook method to read the data in the offchain workers' database:

   ```rust
   use sp_runtime::offchain::StorageValueRef;

   #[derive(Debug, Deserialize, Encode, Decode, Default)]
   struct IndexingData(Vec<u8>, u64);

   fn offchain_worker(block_number: T::BlockNumber) {
   	// Reading back the offchain indexing value. This is exactly the same as reading from
   	// ocw local storage.
   	let key = Self::derived_key(block_number);
   	let storage_ref = StorageValueRef::persistent(&key);

   	if let Ok(Some(data)) = storage_ref.get::<IndexingData>() {
   		debug::info!("local storage data: {:?}, {:?}",
   			str::from_utf8(&data.0).unwrap_or("error"), data.1);
   	} else {
   		debug::info!("Error reading from local storage.");
   	}

   	// -- snip --
   }
   ```

   With this, an offchain worker could read the corresponding data from a node's local storage.
   The [Offchain local storage](/reference/how-to-guides/offchain-workers/offchain-local-storage/) how-to guide explains how to do that.

## Related material

- [Offchain operations](/learn/offchain-operations/)
- [Offchain local storage](/reference/how-to-guides/offchain-workers/offchain-local-storage/)
