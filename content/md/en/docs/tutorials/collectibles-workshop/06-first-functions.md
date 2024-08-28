---
title: Create basic functions
description:
tutorial:
---

You now have the scaffolding for the pallet that includes a few custom types and storage items.
It's time to start writing the functions that use the custom types and write changes to the storage items you've created.
To keep the code modular and flexible, most of the logic is defined in internal helper functions with only one callable function that allow users to interact with the blockchain.
One advantage of using internal functions is that you don't need to do any kind of authentication or authorization for the operations performed because the internal functions are only accessible to you as the runtime developer.

The only function you need to expose to users for this workshop is the `create_collectible` function.
This function enables users to create new unique collectibles that are stored in the `CollectibleMap` and added to the `OwnerOfCollectibles` map.
At a high level, you'll need to write functions to perform the following tasks:

- Create a unique identifier for each collectible and not allow duplicates.
- Limit the number of collectibles each account can own to manage the storage each user is allowed to consume.
- Ensure the total number of collectibles doesn't exceed the maximum allowed by the `u64` data type.
- Allow users to generate new collectibles.

In addition to the basic functionality required to generate new collectibles, your pallet should provide some basic event and error handling. 
With this in mind, you'll also need to:

- Create custom error messages to report what happened if something goes wrong.
- Create a custom event to signal when a new collectible was successfully created.

Errors and events are fairly straightforward, so let's start with those declarations first.

## Add custom errors

Here are some potential errors that the `create_collectible` function should address:

- `DuplicateCollectible` - thrown when the collectible item trying to be created already exists.
- `MaximumCollectiblesOwned`- thrown when an account exceeds the maximum amount of collectibles a single account can hold.
- `BoundsOverflow` - thrown if the supply of collectibles exceeds the `u64` limit.

To add the error handling to the runtime:

1. Open the `src/lib.rs` file for the `collectibles` pallet in your code editor.

2. Add the `#[pallet::error]` macro after the storage macros you previously defined.
   
	 ```rust
	 #[pallet::error]
	 ```

1. Define an enumerated data type with variants for the potential errors that the `create_collectibles` function might return.
   
	 ```rust
	 pub enum Error<T> {
		/// Each collectible must have a unique identifier
		DuplicateCollectible,
		/// An account can't exceed the `MaximumOwned` constant
		MaximumCollectiblesOwned,
		/// The total supply of collectibles can't exceed the u64 limit
		BoundsOverflow,
	}
	```

1. Save your changes.

1. Verify that your program compiles by running the following command:
   
   ```bash
   cargo build --package collectibles
   ```
   
   You can ignore the compiler warnings for now.

## Add an event

The runtime can emit events to notify front-end applications about the result of a transaction that executed successfully. 
Block explorers like [Subscan](https://www.subscan.io/) and the [Polkadot/Substrate Portal Explorer](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/explorer) also display events for completed transactions.

To add a `CollectibleCreated` event to the runtime:

1. Open the `src/lib.rs` file for the `collectibles` pallet in your code editor.

1. Add the `RuntimeEvent` from the `frame_system` configuration to the pallet configuration.
   
	 ```rust
	 #[pallet::config]
     pub trait Config: frame_system::Config {
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
	}
	 ```

2. Add the `#[pallet::event]` macro after the error macro you previously defined.
   
	 ```rust
	 #[pallet::event]
	 ```

1. Add the event for this pallet to the code.
   
	 ```rust
	 #[pallet::generate_deposit(pub(super) fn deposit_event)]
	 pub enum Event<T: Config> {
		 /// A new collectible was successfully created
		 CollectibleCreated { collectible: [u8; 16], owner: T::AccountId },
	 }
	 ```

1. Save your changes.

1. Verify that your program compiles by running the following command:
   
   ```bash
   cargo build --package collectibles
   ```
   
   You can ignore the compiler warnings for now.

##  Add internal and callable functions

With errors and events out of the way, it's time to write the core logic for creating collectibles.

1. Create an internal function that generates the `unique_id` for new collectibles.
   
	 ```rust
	 // Pallet internal functions
	impl<T: Config> Pallet<T> {
		// Generates and returns the unique_id and color
		fn gen_unique_id() -> ([u8; 16], Color) {
			// Create randomness
			let random = T::CollectionRandomness::random(&b"unique_id"[..]).0;
			
			// Create randomness payload. Multiple collectibles can be generated in the same block,
			// retaining uniqueness.
			let unique_payload = (
				random,
				frame_system::Pallet::<T>::extrinsic_index().unwrap_or_default(),
				frame_system::Pallet::<T>::block_number(),
		);
		
		// Turns into a byte array
		let encoded_payload = unique_payload.encode();
		let hash = frame_support::Hashable::blake2_128(&encoded_payload);
		
		// Generate Color 
		if hash[0] % 2 == 0 {
				(hash, Color::Red)
		} else {
				(hash, Color::Yellow)
			} 
		}
	}
   ```

1. Create an internal function that enables minting new collectibles.
   
	 ```rust
	     // Function to mint a collectible
		pub fn mint(
			owner: &T::AccountId,
			unique_id: [u8; 16],
			color: Color,
		) -> Result<[u8; 16], DispatchError> {
			// Create a new object
			let collectible = Collectible::<T> { unique_id, price: None, color, owner: owner.clone() };
			
			// Check if the collectible exists in the storage map
			ensure!(!CollectibleMap::<T>::contains_key(&collectible.unique_id), Error::<T>::DuplicateCollectible);
			
			// Check that a new collectible can be created
			let count = CollectiblesCount::<T>::get();
			let new_count = count.checked_add(1).ok_or(Error::<T>::BoundsOverflow)?;
			
			// Append collectible to OwnerOfCollectibles map
			OwnerOfCollectibles::<T>::try_append(&owner, collectible.unique_id)
				.map_err(|_| Error::<T>::MaximumCollectiblesOwned)?;
			
			// Write new collectible to storage and update the count
			CollectibleMap::<T>::insert(collectible.unique_id, collectible);
			CollectiblesCount::<T>::put(new_count);
			
			// Deposit the "CollectibleCreated" event.
			Self::deposit_event(Event::CollectibleCreated { collectible: unique_id, owner: owner.clone() });
			
			// Returns the unique_id of the new collectible if this succeeds
			Ok(unique_id)
		}
   ```

2. Create the callable function that uses the internal functions.
   
	 ```rust
	 // Pallet callable functions
	 #[pallet::call]
	 impl<T: Config> Pallet<T> {
		 
		 /// Create a new unique collectible.
		 ///
		 /// The actual collectible creation is done in the `mint()` function.
		 #[pallet::weight(0)]
		 pub fn create_collectible(origin: OriginFor<T>) -> DispatchResult {
			  // Make sure the caller is from a signed origin
				let sender = ensure_signed(origin)?;
				
				// Generate the unique_id and color using a helper function
				let (collectible_gen_unique_id, color) = Self::gen_unique_id();
				
				// Write new collectible to storage by calling helper function
				Self::mint(&sender, collectible_gen_unique_id, color)?;
				
				Ok(())
			}
	 }
   ```

1. Save your changes and verify that your program compiles by running the following command:
   
   ```bash
   cargo build --package collectibles
   ```

  Your code should now compile without any warnings.
