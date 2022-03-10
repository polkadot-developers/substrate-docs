---
title: Use hashmaps for key-value pairs
slug: /tutorials/smart-contracts/use-mapping/
description: tutorials
keywords:
  - smart contracts
  - erc20
  - wasm
---

In [Develop a smart contract](/tutorials/smart-contracts/develop-contract/), you developed a smart contract for storing and retrieving a single numeric value.
This tutorial illustrates how you can extend the functionality of your smart contract to manage one number per user.
To add this functionality, you'll use the [`Mapping`](https://paritytech.github.io/ink/ink_storage/struct.Mapping.html) type.

The [`Mapping`](https://paritytech.github.io/ink/ink_storage/struct.Mapping.html) type enables you to store data as key-value pairs.
For example, the following code illustrates mapping a user to a number:

```rust
#[ink(storage)]
pub struct MyContract {
	// Store a mapping from AccountIds to a u32
	my_number_map: ink_storage::Mapping<AccountId, u32>,
}
```

With the `Mapping` data type, you can store a unique instance of the `value` storage item for each key,. For this tutorial, each `AccountId` represents a key that maps to one and only one stored numeric `value`. Each user can only store, increment, and retrieve the value associated with his or her own `AccountId`.

## Initialize a mapping

To initialize the mapping between an `AccountId` and a stored value, you need:

* An implementation of the [`SpreadAllocate`](https://paritytech.github.io/ink/ink_storage/traits/trait.SpreadAllocate.html) trait on the storage struct.

* The [`ink_lang::utils::initalize_contract`](https://paritytech.github.io/ink/ink_lang/utils/fn.initialize_contract.html) initializer.

The following example illustrates how to initialize a `Mapping` and how to write
and read entries from it.

```rust
#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod mycontract {
    use ink_storage::traits::SpreadAllocate;

    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct MyContract {
        // Store a mapping from AccountIds to a u32
        map: ink_storage::Mapping<AccountId, u32>,
    }

    impl MyContract {
        #[ink(constructor)]
        pub fn new(count: u32) -> Self {
            // This call is required in order to correctly initialize the
            // `Mapping`s of our contract.
            ink_lang::utils::initialize_contract(|contract: &mut Self| {
                let caller = Self::env().caller();
                contract.map.insert(&caller, &count);
            })
        }

        #[ink(constructor)]
        pub fn default() -> Self {
            // Even though we're not explicitly initializing the `Mapping`,
            // we still need to call this
            ink_lang::utils::initialize_contract(|_| {})
        }

        // Grab the number at the caller's AccountID, if it exists
        #[ink(message)]
        pub fn get(&self) -> u32 {
            let caller = Self::env().caller();
            self.map.get(&caller).unwrap_or_default()
        }
    }
}
```

## Contract caller

In the preceding example, you might have noticed the `self.env().caller()` function call. 
This function is available throughout the contract logic and always returns the contract caller.
Note that the contract caller is not the same as the origin caller. 
If a user accesses a contract that then calls a subsequent contract, the `self.env().caller()` in the second contract is the address of the first contract, not the original user.

You can use `self.env().caller()` in a number of different ways. 
For example, you can use it to create an access control layer that only allows users to access their own values. 
You can also save the contract owner during contract deployment for future reference.
For example:

```rust
#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod mycontract {

	#[ink(storage)]
	pub struct MyContract {
		// Store a contract owner
		owner: AccountId,
	}

	impl MyContract {
		#[ink(constructor)]
		pub fn new() -> Self {
			Self {
				owner: Self::env().caller();
			}
		}
		/* --snip-- */
	}
}
```

Then you can write functions that checks whether the current caller is the owner of the contract.

### 4. Your Turn

Follow the `ACTION`s in the template code to introduce a storage map to your contract.

Remember to run `cargo +nightly test` to test your work.

#### ** Template **

[template-code](/assets/tutorials/ink-workshop/1.5-template.rs)

#### ** Solution **

[template-code-final](/assets/tutorials/ink-workshop/1.5-finished-code.rs)

#### ** Previous Solution **

[template-code-previous](/assets/tutorials/ink-workshop/1.4-finished-code.rs)

## Updating a Value

The final step in our Incrementer contract is to allow users to update their own values.

### 1. Updating a Mapping

The `Mapping` API is quite low level. We can directly override a previous value held at a
storage entry by calling `Mapping::insert()` with an existing key. The `Mapping` will do
nothing to "protect" us in this case.

We can also update values by first reading them from storage using `Mapping::get()`, and
then overriding the entry with `Mapping::insert()`.

Note that if there is no existing value at a given key, `Mapping::get()` will return
`None`.

### 2. Cleaning up

Since `Mapping` is low level we're required to do clean-up ourselves. `Mapping` provides
a `Mapping::remove()` method which clears the value at a given key from storage.

### 3. Your Turn

Follow the `ACTION`s to finish your Incrementer smart contract.

Remember to run `cargo +nightly test` to test your work.

#### ** Template **

[template-code](/assets/tutorials/ink-workshop/1.6-template.rs)

#### ** Solution **

[template-code-final](/assets/tutorials/ink-workshop/1.6-finished-code.rs)

#### ** Previous Solution **

[template-code-previous](/assets/tutorials/ink-workshop/1.5-finished-code.rs)

