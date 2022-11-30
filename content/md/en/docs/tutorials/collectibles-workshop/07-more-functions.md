---
title: More functions
description:
tutorial:
---

To make this pallet more useful and realistic as the foundation for a simple collectible trading application, let's add a few more basic functions to perform the following tasks:

- Transfer collectibles between accounts. 
- Set the price of a collectible.
- Buy a collectible.

## Transfer

To allow users to transfer a collectible from one account to another, you need to create a publicly callable function. 
For this workshop, the public function—`transfer`—will rely on an internal function called `do_transfer` to perform checks and write changes to storage. 
The internal function includes the following checks to determine whether a collectible can be transferred:

- A collectible must exist to be transferrable.
- A collectible cannot be transferred to its current owner.
- A collectible cannot be transferred to an account that already has the maximum number of collectibles allowed.

If the collectible exists and isn't being transferred to its current owner, the `do_transfer`internal function updates the `OwnerOfCollectibles` storage map to reflect the new owner and writes the change to the underlying database.
To handle errors and emit events, you'll also need:

- `NoCollectible`, `NotOwner`, and `TransferToSelf` errors when checks fail.
- A `TransferSucceeded` event when a transfer is successful.

The publicly callable function simply checks the origin of the caller and calls the `do_transfer` internal function.

1. Add the `NoCollectible`, `NotOwner`, and `TransferToSelf` variants to the enumeration of errors.
   
	 ```rust
	 // Pallet error messages.
	 #[pallet::error]
	 pub enum Error<T> {
		 /// Each collectible must have a unique identifier
		 DuplicateCollectible,
		 /// An account can't exceed the `MaximumOwned` constant
		 MaximumCollectiblesOwned,
		 /// The total supply of collectibles can't exceed the u64 limit
		 BoundsOverflow,
		 /// The collectible doesn't exist
		 NoCollectible,
		 /// You are not the owner
		 NotOwner,
		 /// Trying to transfer a collectible to yourself
		 TransferToSelf,
	 }
   ```

2. Add the `TransferSucceeded` event to your pallet.
   
	 ```rust
	 // Pallet events.
	 #[pallet::event]
	 #[pallet::generate_deposit(pub(super) fn deposit_event)]
	 pub enum Event<T: Config> {
		  /// A new collectible was successfully created.
			CollectibleCreated { collectible: [u8; 16], owner: T::AccountId },
			/// A collectible was successfully transferred.
			TransferSucceeded { from: T::AccountId, to: T::AccountId, collectible: [u8; 16] },
	 }
	 ```

3. Create an internal function that enables transferring collectibles.
   
	 ```rust
	 // Update storage to transfer collectible
	 pub fn do_transfer(
		 collectible_id: [u8; 16],
		 to: T::AccountId,
	 ) -> DispatchResult {
		 // Get the collectible
		 let mut collectible = CollectibleMap::<T>::get(&unique_id).ok_or(Error::<T>::NoCollectible)?;
		 let from = collectible.owner;
		 
		 ensure!(from != to, Error::<T>::TransferToSelf);
		 let mut from_owned = OwnerOfCollectibles::<T>::get(&from);
		 
		 // Remove collectible from list of owned collectible.
		 if let Some(ind) = from_owned.iter().position(|&id| id == unique_id) {
			 from_owned.swap_remove(ind);
			} else {
			  return Err(Error::<T>::NoCollectible.into())
			}
				// Add collectible to the list of owned collectibles.
				let mut to_owned = OwnerOfCollectibles::<T>::get(&to);
				to_owned.try_push(unique_id).map_err(|()| Error::<T>::MaximumCollectiblesOwned)?;
				
				// Transfer succeeded, update the owner and reset the price to `None`.
				collectible.owner = to.clone();
				collectible.price = None;

				// Write updates to storage
				CollectibleMap::<T>::insert(&unique_id, collectible);
				OwnerOfCollectibles::<T>::insert(&to, to_owned);
				OwnerOfCollectibles::<T>::insert(&from, from_owned);
				
				Self::deposit_event(Event::TransferSucceeded { from, to, collectible: unique_id });
			Ok(())
		}
		```

1. Create the callable function.
   
	 ```rust
	 /// Transfer a collectible to another account.
	 /// Any account that holds a collectible can send it to another account. 
	 /// Transfer resets the price of the collectible, marking it not for sale.
	 #[pallet::weight(0)]
	 pub fn transfer(
		  origin: OriginFor<T>,
			to: T::AccountId,
			unique_id: [u8; 16],
	 ) -> DispatchResult {
		// Make sure the caller is from a signed origin
		let from = ensure_signed(origin)?;
		let collectible = CollectibleMap::<T>::get(&unique_id).ok_or(Error::<T>::NoCollectible)?;
		ensure!(collectible.owner == from, Error::<T>::NotOwner);
		Self::do_transfer(unique_id, to)?;
		Ok(())
	 }
   ```

1. Save your changes and close the file.

2. Verify that your program compiles without errors by running the following command:
   
   ```bash
   cargo build --package collectibles
   ```

## Set price

To allow collectible owners to set the price of the collectibles they own, the pallet must provide a function to update the price field in Collectible data structure and emit in event. 
For this function, you can use the `get` and `insert` methods for the `CollectibleMap` storage item to modify and update the Collectible object.

Like previous functions, you'll want to perform a few checks before you allow the caller to write a new price to storage:

- The caller must be a signed origin.
- The collectible must already exist.
- The caller must be the owner of the collectible.

If the checks pass, the function writes the new price to storage and emits a `PriceSet` event.

1. Add the `PriceSet` event to your pallet.
   
	 ```rust
	 // Pallet events
	 #[pallet::event]
	 #[pallet::generate_deposit(pub(super) fn deposit_event)]
	 pub enum Event<T: Config> {
	   /// A new collectible was successfully created.
     CollectibleCreated { collectible: [u8; 16], owner: T::AccountId },
     /// A collectible was successfully transferred.
     TransferSucceeded { from: T::AccountId, to: T::AccountId, collectible: [u8; 16] },
		 /// The price of a collectible was successfully set.
		 PriceSet { collectible: [u8; 16], price: Option<BalanceOf<T>> },
	 }
	 ```

2. Add the callable function for setting a price.
   
	 ```rust
	 /// Update the collectible price and write to storage.
	 #[pallet::weight(0)]
	 pub fn set_price(
		  origin: OriginFor<T>,
			unique_id: [u8; 16],
			new_price: Option<BalanceOf<T>>,
	 ) -> DispatchResult {
	    // Make sure the caller is from a signed origin
	    let sender = ensure_signed(origin)?;0
			// Ensure the collectible exists and is called by the owner
			let mut collectible = CollectibleMap::<T>::get(&unique_id).ok_or(Error::<T>::NoCollectible)?;
			ensure!(collectible.owner == sender, Error::<T>::NotOwner);
			// Set the price in storage
			collectible.price = new_price;
			CollectibleMap::<T>::insert(&unique_id, collectible);
			
			// Deposit a "PriceSet" event.
			Self::deposit_event(Event::PriceSet { collectible: unique_id, price: new_price });
   Ok(())
	 }
	 ```

2. Verify that your program compiles without errors by running the following command:
   
   ```bash
   cargo build --package collectibles
   ```

## Buy a collectible

To enable users to buy collectibles, you need to expose another callable function—`buy_collectible`—that, like the previous callable functions, uses an internal function to perform checks before writing any changes to storage.

For this workshop, the internal function is `do_buy_collectible` and it does most of the heavy lifting to determine whether the attempt to purchase a collectible will succeed.
For example, the `do_buy_collectible` internal function checks that:

- The proposed buying price is greater than or equal to the price set for the collectible by its owner and return the `BidPriceTooLow` error if the proposed price is too low.
- The collectible is for sale and return a `NotForSale` error if the collectible price is `None`.
- The account for the buyer has a free balance available to cover the price set for the collectible.
- The account for the buyer doesn't already own too many collectibles to receive another collectible.

If all of the checks pass, the `do_buy_collectible` internal function updates account balances and transfers ownership of the collectible using `Currency` trait and its transfer method.

With most of the work done by the internal function, the publicly exposed `buy_collectible` function simply verifies the account of the function caller and calls the `do_buy_collectible` function.

1. Add the `BidPriceTooLow` and `NotForSale` to the variants for the Error enumerated data type.
   
	 ```rust
	 // Pallet errors
	 #[pallet::error]
      pub enum Error<T> {
        /// Each collectible must have a unique identifier
        DuplicateCollectible,
        /// An account can't exceed the `MaximumOwned` constant
        MaximumCollectiblesOwned,
        /// The total supply of collectibles can't exceed the u64 limit
        BoundsOverflow,
        /// The collectible doesn't exist
        NoCollectible,
        // You are not the owner
        NotOwner,
        /// Trying to transfer a collectible to yourself
        TransferToSelf,
				/// The bid is lower than the asking price.
				BidPriceTooLow,
				/// The collectible is not for sale.
				NotForSale,

      }

2. Add the `Sold` event to your Pallet.
   
	 ```rust
	 // Pallet events
   #[pallet::event]
	 #[pallet::generate_deposit(pub(super) fn deposit_event)]
      pub enum Event<T: Config> {
        /// A new collectible was successfully created.
        CollectibleCreated { collectible: [u8; 16], owner: T::AccountId },
        /// A collectible was successfully transferred.
        TransferSucceeded { from: T::AccountId, to: T::AccountId, collectible: [u8; 16] },
        /// The price of a collectible was successfully set.
        PriceSet { collectible: [u8; 16], price: Option<BalanceOf<T>> },
        /// A collectible was successfully sold.
				Sold { seller: T::AccountId, buyer: T::AccountId, collectible: [u8; 16], price: BalanceOf<T> },
      }
		```

1. Create an internal function to be called when users want to purchase a collectible.
   
	 ```rust
	 // An internal function for purchasing a collectible
	 pub fn do_buy_collectible(
		  unique_id: [u8; 16],
		  to: T::AccountId,
		  bid_price: BalanceOf<T>,
	 ) -> DispatchResult {
	 
	 // Get the collectible from the storage map
	 let mut collectible = CollectibleMap::<T>::get(&unique_id).ok_or(Error::<T>::NoCollectible)?;
	 let from = collectible.owner;
	    ensure!(from != to, Error::<T>::TransferToSelf);
		  let mut from_owned = OwnerOfCollectibles::<T>::get(&from);
	 	 
	 // Remove collectible from owned collectibles.
	 if let Some(ind) = from_owned.iter().position(|&id| id == unique_id) {
			from_owned.swap_remove(ind);
		} else {
			return Err(Error::<T>::NoCollectible.into())
		}
	 // Add collectible to owned collectible.
	 let mut to_owned = OwnerOfCollectibles::<T>::get(&to);
	 to_owned.try_push(unique_id).map_err(|()| Error::<T>::MaximumCollectiblesOwned)?;
	 // Mutating state with a balance transfer, so nothing is allowed to fail after this.
	 if let Some(price) = collectible.price {
			ensure!(bid_price >= price, Error::<T>::BidPriceTooLow);
			// Transfer the amount from buyer to seller
			T::Currency::transfer(&to, &from, price, frame_support::traits::ExistenceRequirement::KeepAlive)?;
			// Deposit sold event
			Self::deposit_event(Event::Sold {
				seller: from.clone(),
				buyer: to.clone(),
				collectible: unique_id,
				price,
			});
	 } else {
		  return Err(Error::<T>::NotForSale.into())
   }
	 
	 // Transfer succeeded, update the collectible owner and reset the price to `None`.
	 collectible.owner = to.clone();
	 collectible.price = None;
	 // Write updates to storage
	 CollectibleMap::<T>::insert(&unique_id, collectible);
	 OwnerOfCollectibles::<T>::insert(&to, to_owned);
	 OwnerOfCollectibles::<T>::insert(&from, from_owned);
	 Self::deposit_event(Event::TransferSucceeded { from, to, collectible: unique_id });
	 Ok(())
	 }
   ```

1. Add a callable function to allow a user to purchase a collectible.

/// Buy a saleable kitty. The bid price provided from the buyer has to be equal or higher
/// than the ask price from the seller.
///
/// This will reset the asking price of the kitty, marking it not for sale.
/// Marking this method `transactional` so when an error is returned, we ensure no storage
/// is changed.
#[pallet::weight(0)]
pub fn buy_kitty(
	origin: OriginFor<T>,
	kitty_id: [u8; 16],
	bid_price: BalanceOf<T>,
) -> DispatchResult {
	// Make sure the caller is from a signed origin
	let buyer = ensure_signed(origin)?;
	// Transfer the kitty from seller to buyer as a sale.
	Self::do_buy_kitty(kitty_id, buyer, bid_price)?;

	Ok(())
}

** SOLUTION **
This should compile successfully by running:

cargo build -p pallet-template
There should be no warnings.

#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;

	use frame_support::traits::{Currency, Randomness};

	// The basis which we buil
	#[pallet::pallet]
	pub struct Pallet<T>(_);

	// Allows easy access our Pallet's `Balance` type. Comes from `Currency` interface.
	type BalanceOf<T> =
		<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

	// The Gender type used in the `Kitty` struct
	#[derive(Clone, Encode, Decode, PartialEq, Copy, RuntimeDebug, TypeInfo, MaxEncodedLen)]
	pub enum Gender {
		Male,
		Female,
	}

	// Struct for holding kitty information
	#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen, Copy)]
	#[scale_info(skip_type_params(T))]
	pub struct Kitty<T: Config> {
		// Using 16 bytes to represent a kitty DNA
		pub dna: [u8; 16],
		// `None` assumes not for sale
		pub price: Option<BalanceOf<T>>,
		pub gender: Gender,
		pub owner: T::AccountId,
	}

	/// Keeps track of the number of kitties in existence.
	#[pallet::storage]
	pub(super) type CountForKitties<T: Config> = StorageValue<_, u64, ValueQuery>;

	/// Maps the kitty struct to the kitty DNA.
	#[pallet::storage]
	pub(super) type Kitties<T: Config> = StorageMap<_, Twox64Concat, [u8; 16], Kitty<T>>;

	/// Track the kitties owned by each account.
	#[pallet::storage]
	pub(super) type KittiesOwned<T: Config> = StorageMap<
		_,
		Twox64Concat,
		T::AccountId,
		BoundedVec<[u8; 16], T::MaxKittiesOwned>,
		ValueQuery,
	>;

	// Your Pallet's configuration trait, representing custom external types and interfaces.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

		/// The Currency handler for the kitties pallet.
		type Currency: Currency<Self::AccountId>;

		/// The maximum amount of kitties a single account can own.
		#[pallet::constant]
		type MaxKittiesOwned: Get<u32>;

		/// The type of Randomness we want to specify for this pallet.
		type KittyRandomness: Randomness<Self::Hash, Self::BlockNumber>;
	}

	// Your Pallet's events.
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// A new kitty was successfully created.
		Created { kitty: [u8; 16], owner: T::AccountId },
		/// A kitty was successfully transferred.
		Transferred { from: T::AccountId, to: T::AccountId, kitty: [u8; 16] },
		/// The price of a kitty was successfully set.
		PriceSet { kitty: [u8; 16], price: Option<BalanceOf<T>> },
		/// A kitty was successfully sold.
		Sold { seller: T::AccountId, buyer: T::AccountId, kitty: [u8; 16], price: BalanceOf<T> },
	}

	// Your Pallet's error messages.
	#[pallet::error]
	pub enum Error<T> {
		/// An account may only own `MaxKittiesOwned` kitties.
		TooManyOwned,
		/// This kitty already exists!
		DuplicateKitty,
		/// An overflow has occurred!
		Overflow,
		/// This kitty does not exist!
		NoKitty,
		/// You are not the owner of this kitty.
		NotOwner,
		/// Trying to transfer or buy a kitty from oneself.
		TransferToSelf,
		/// Ensures that the buying price is greater than the asking price.
		BidPriceTooLow,
		/// This kitty is not for sale.
		NotForSale,
	}

	// Your Pallet's callable functions.
	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// Create a new unique kitty.
		///
		/// The actual kitty creation is done in the `mint()` function.
		#[pallet::weight(0)]
		pub fn create_kitty(origin: OriginFor<T>) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let sender = ensure_signed(origin)?;

			// Generate unique DNA and Gender using a helper function
			let (kitty_gen_dna, gender) = Self::gen_dna();

			// Write new kitty to storage by calling helper function
			Self::mint(&sender, kitty_gen_dna, gender)?;

			Ok(())
		}

		/// Directly transfer a kitty to another recipient.
		///
		/// Any account that holds a kitty can send it to another Account. This will reset the
		/// asking price of the kitty, marking it not for sale.
		#[pallet::weight(0)]
		pub fn transfer(
			origin: OriginFor<T>,
			to: T::AccountId,
			kitty_id: [u8; 16],
		) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let from = ensure_signed(origin)?;
			let kitty = Kitties::<T>::get(&kitty_id).ok_or(Error::<T>::NoKitty)?;
			ensure!(kitty.owner == from, Error::<T>::NotOwner);
			Self::do_transfer(kitty_id, to)?;
			Ok(())
		}

		/// Set the price for a kitty.
		///
		/// Updates kitty price and updates storage.
		#[pallet::weight(0)]
		pub fn set_price(
			origin: OriginFor<T>,
			kitty_id: [u8; 16],
			new_price: Option<BalanceOf<T>>,
		) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let sender = ensure_signed(origin)?;

			// Ensure the kitty exists and is called by the kitty owner
			let mut kitty = Kitties::<T>::get(&kitty_id).ok_or(Error::<T>::NoKitty)?;
			ensure!(kitty.owner == sender, Error::<T>::NotOwner);

			// Set the price in storage
			kitty.price = new_price;
			Kitties::<T>::insert(&kitty_id, kitty);

			// Deposit a "PriceSet" event.
			Self::deposit_event(Event::PriceSet { kitty: kitty_id, price: new_price });

			Ok(())
		}

		/// Buy a saleable kitty. The bid price provided from the buyer has to be equal or higher
		/// than the ask price from the seller.
		///
		/// This will reset the asking price of the kitty, marking it not for sale.
		/// Marking this method `transactional` so when an error is returned, we ensure no storage
		/// is changed.
		#[pallet::weight(0)]
		pub fn buy_kitty(
			origin: OriginFor<T>,
			kitty_id: [u8; 16],
			bid_price: BalanceOf<T>,
		) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let buyer = ensure_signed(origin)?;
			// Transfer the kitty from seller to buyer as a sale.
			Self::do_buy_kitty(kitty_id, buyer, bid_price)?;

			Ok(())
		}
	}

	// Your Pallet's internal functions.
	impl<T: Config> Pallet<T> {
		// Generates and returns DNA and Gender
		fn gen_dna() -> ([u8; 16], Gender) {
			// Create randomness
			let random = T::KittyRandomness::random(&b"dna"[..]).0;

			// Create randomness payload. Multiple kitties can be generated in the same block,
			// retaining uniqueness.
			let unique_payload = (
				random,
				frame_system::Pallet::<T>::extrinsic_index().unwrap_or_default(),
				frame_system::Pallet::<T>::block_number(),
			);

			// Turns into a byte array
			let encoded_payload = unique_payload.encode();
			let hash = frame_support::Hashable::blake2_128(&encoded_payload);

			// Generate Gender
			if hash[0] % 2 == 0 {
				(hash, Gender::Male)
			} else {
				(hash, Gender::Female)
			}
		}

		// Helper to mint a kitty
		pub fn mint(
			owner: &T::AccountId,
			dna: [u8; 16],
			gender: Gender,
		) -> Result<[u8; 16], DispatchError> {
			// Create a new object
			let kitty = Kitty::<T> { dna, price: None, gender, owner: owner.clone() };

			// Check if the kitty does not already exist in our storage map
			ensure!(!Kitties::<T>::contains_key(&kitty.dna), Error::<T>::DuplicateKitty);

			// Performs this operation first as it may fail
			let count = CountForKitties::<T>::get();
			let new_count = count.checked_add(1).ok_or(Error::<T>::Overflow)?;

			// Append kitty to KittiesOwned
			KittiesOwned::<T>::try_append(&owner, kitty.dna)
				.map_err(|_| Error::<T>::TooManyOwned)?;

			// Write new kitty to storage
			Kitties::<T>::insert(kitty.dna, kitty);
			CountForKitties::<T>::put(new_count);

			// Deposit our "Created" event.
			Self::deposit_event(Event::Created { kitty: dna, owner: owner.clone() });

			// Returns the DNA of the new kitty if this succeeds
			Ok(dna)
		}

		// Update storage to transfer kitty
		pub fn do_transfer(
			kitty_id: [u8; 16],
			to: T::AccountId,
		) -> DispatchResult {
			// Get the kitty
			let mut kitty = Kitties::<T>::get(&kitty_id).ok_or(Error::<T>::NoKitty)?;
			let from = kitty.owner;

			ensure!(from != to, Error::<T>::TransferToSelf);
			let mut from_owned = KittiesOwned::<T>::get(&from);

			// Remove kitty from list of owned kitties.
			if let Some(ind) = from_owned.iter().position(|&id| id == kitty_id) {
				from_owned.swap_remove(ind);
			} else {
				return Err(Error::<T>::NoKitty.into())
			}

			// Add kitty to the list of owned kitties.
			let mut to_owned = KittiesOwned::<T>::get(&to);
			to_owned.try_push(kitty_id).map_err(|()| Error::<T>::TooManyOwned)?;

			// Transfer succeeded, update the kitty owner and reset the price to `None`.
			kitty.owner = to.clone();
			kitty.price = None;

			// Write updates to storage
			Kitties::<T>::insert(&kitty_id, kitty);
			KittiesOwned::<T>::insert(&to, to_owned);
			KittiesOwned::<T>::insert(&from, from_owned);

			Self::deposit_event(Event::Transferred { from, to, kitty: kitty_id });

			Ok(())
		}

		// A helper function for purchasing a kitty
		pub fn do_buy_kitty(
			kitty_id: [u8; 16],
			to: T::AccountId,
			bid_price: BalanceOf<T>,
		) -> DispatchResult {
			// Get the kitty
			let mut kitty = Kitties::<T>::get(&kitty_id).ok_or(Error::<T>::NoKitty)?;
			let from = kitty.owner;

			ensure!(from != to, Error::<T>::TransferToSelf);
			let mut from_owned = KittiesOwned::<T>::get(&from);

			// Remove kitty from list of owned kitties.
			if let Some(ind) = from_owned.iter().position(|&id| id == kitty_id) {
				from_owned.swap_remove(ind);
			} else {
				return Err(Error::<T>::NoKitty.into())
			}

			// Add kitty to the list of owned kitties.
			let mut to_owned = KittiesOwned::<T>::get(&to);
			to_owned.try_push(kitty_id).map_err(|()| Error::<T>::TooManyOwned)?;

			// Mutating state here via a balance transfer, so nothing is allowed to fail after this.
			if let Some(price) = kitty.price {
				ensure!(bid_price >= price, Error::<T>::BidPriceTooLow);
				// Transfer the amount from buyer to seller
				T::Currency::transfer(&to, &from, price, frame_support::traits::ExistenceRequirement::KeepAlive)?;
				// Deposit sold event
				Self::deposit_event(Event::Sold {
					seller: from.clone(),
					buyer: to.clone(),
					kitty: kitty_id,
					price,
				});
			} else {
				return Err(Error::<T>::NotForSale.into())
			}

			// Transfer succeeded, update the kitty owner and reset the price to `None`.
			kitty.owner = to.clone();
			kitty.price = None;

			// Write updates to storage
			Kitties::<T>::insert(&kitty_id, kitty);
			KittiesOwned::<T>::insert(&to, to_owned);
			KittiesOwned::<T>::insert(&from, from_owned);

			Self::deposit_event(Event::Transferred { from, to, kitty: kitty_id });

			Ok(())
		}
	}
}