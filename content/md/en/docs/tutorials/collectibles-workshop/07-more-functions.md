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
		 let mut collectible = CollectibleMap::<T>::get(&collectible_id).ok_or(Error::<T>::NoCollectible)?;
		 let from = collectible.owner;
		 
		 ensure!(from != to, Error::<T>::TransferToSelf);
		 let mut from_owned = OwnerOfCollectibles::<T>::get(&from);
		 
		 // Remove collectible from list of owned collectible.
		 if let Some(ind) = from_owned.iter().position(|&id| id == collectible_id) {
			 from_owned.swap_remove(ind);
			} else {
			  return Err(Error::<T>::NoCollectible.into())
			}
				// Add collectible to the list of owned collectibles.
				let mut to_owned = OwnerOfCollectibles::<T>::get(&to);
				to_owned.try_push(collectible_id).map_err(|_id| Error::<T>::MaximumCollectiblesOwned)?;
				
				// Transfer succeeded, update the owner and reset the price to `None`.
				collectible.owner = to.clone();
				collectible.price = None;

				// Write updates to storage
				CollectibleMap::<T>::insert(&collectible_id, collectible);
				OwnerOfCollectibles::<T>::insert(&to, to_owned);
				OwnerOfCollectibles::<T>::insert(&from, from_owned);
				
				Self::deposit_event(Event::TransferSucceeded { from, to, collectible: collectible_id });
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

1. Save your changes.

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
        let sender = ensure_signed(origin)?;
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

- The proposed buying price is greater than or equal to the price set for the collectible by its owner and returns the `BidPriceTooLow` error if the proposed price is too low.
- The collectible is for sale and returns a `NotForSale` error if the collectible price is `None`.
- The account for the buyer has a free balance available to cover the price set for the collectible.
- The account for the buyer doesn't already own too many collectibles to receive another collectible.

If all of the checks pass, the `do_buy_collectible` internal function updates account balances and transfers ownership of the collectible using the `Currency` trait's transfer method.

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
	 to_owned.try_push(unique_id).map_err(|_id| Error::<T>::MaximumCollectiblesOwned)?;
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
   
	 ```rust
	 /// Buy a collectible. The bid price must be greater than or equal to the price
	 /// set by the collectible owner.
	 #[pallet::weight(0)]
	 pub fn buy_collectible(
		 origin: OriginFor<T>,
		 unique_id: [u8; 16],
		 bid_price: BalanceOf<T>,
	 ) -> DispatchResult {
		 // Make sure the caller is from a signed origin
		 let buyer = ensure_signed(origin)?;
		 // Transfer the collectible from seller to buyer.
		 Self::do_buy_collectible(unique_id, buyer, bid_price)?;
	 Ok(())
	 }
	 ```

2. Verify that your program compiles without errors by running the following command:
   
   ```bash
   cargo build --package collectibles
   ```

