---
title: Use maps for storing values
description:
keywords:
---

In [Develop a smart contract](/tutorials/smart-contracts/develop-contract/), you developed a smart contract for storing and retrieving a single numeric value.
This tutorial illustrates how you can extend the functionality of your smart contract to manage one number per user.
To add this functionality, you'll use the [`Mapping`](https://paritytech.github.io/ink/ink_storage/struct.Mapping.html) type.

The ink! language provides the [`Mapping`](https://paritytech.github.io/ink/ink_storage/struct.Mapping.html) type to enable you to store data as key-value pairs.
For example, the following code illustrates mapping a user to a number:

```rust
#[ink(storage)]
pub struct MyContract {
	// Store a mapping from AccountIds to a u32
	my_number_map: ink_storage::Mapping<AccountId, u32>,
}
```

With the `Mapping` data type, you can store a unique instance of the storage value for each key.
For this tutorial, each `AccountId` represents a key that maps to one and only one stored numeric `my_value`.
Each user can only store, increment, and retrieve the value associated with his or her own `AccountId`.

## Initialize a mapping

The first step is to initialize the mapping between an `AccountId` and a stored value.
You must always initialize a mapping before you use it in your contract to avoid mapping errors and inconsistencies.
To initialize a mapping, you need to do the following:

- Add the [`SpreadAllocate`](https://paritytech.github.io/ink/ink_storage/traits/trait.SpreadAllocate.html) trait on the storage structure.

- Specify the mapping key and the value mapped to it.

- Call the [`ink_lang::utils::initalize_contract`](https://paritytech.github.io/ink/ink_lang/utils/fn.initialize_contract.html) function to initialize the mapping for the contract.

The following example illustrates how to initialize a mapping and retrieve a value:

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
            // This call is required to correctly initialize the
            // Mapping of the contract.
            ink_lang::utils::initialize_contract(|contract: &mut Self| {
                let caller = Self::env().caller();
                contract.map.insert(&caller, &count);
            })
        }

        #[ink(constructor)]
        pub fn default() -> Self {
            ink_lang::utils::initialize_contract(|_| {})
        }

        // Get the number associated with the caller's AccountId, if it exists
        #[ink(message)]
        pub fn get(&self) -> u32 {
            let caller = Self::env().caller();
            self.map.get(&caller).unwrap_or_default()
        }
    }
}
```

### Identifying the contract caller

In the preceding example, you might have noticed the `self.env().caller()` function call.
This function is available throughout the contract logic and always returns the **contract caller**.
It is important to note that the contract caller is not the same as the **origin caller**.
If a user accesses a contract that then calls a subsequent contract, the `self.env().caller()` in the second contract is the address of the first contract, not the original user.

### Using the contract caller

There are many scenarios where having the contract caller available is useful.
For example, you can use `self.env().caller()` to create an access control layer that only allows users to access their own values.
You can also use `self.env().caller()` to save the contract owner during contract deployment.
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

Because you have saved the contract caller using the `owner` identifier, you can later write functions that check whether the current contract caller is the owner of the contract.

## Add mapping to the smart contract

You are now ready to introduce a storage map to the `incrementer` contract.

To add a storage map to the `incrementer` contract:

1. Open a terminal shell on your computer, if needed.

1. Verify that you are in the `incrementer` project folder.

1. Open the `lib.rs` file in a text editor.

1. Import the `SpreadAllocate` trait and derive it for your contract.

   ```rust
   #[ink::contract
   mod incrementer {
       use ink_storage::traits::SpreadAllocate;

       #[ink(storage)]
       #[derive(SpreadAllocate)]
   ```

1. Add the mapping key from `AccountId` to the `i32` data type stored as `my_value`.

   ```rust
   pub struct Incrementer {
       value: i32,
       my_value: ink_storage::Mapping<AccountId, i32>,
   }
   ```

1. Use the `initialize_contract` function to set an initial `value` and `my_value` for the `new` function in the contract.

   ```rust
   #[ink(constructor)]
   pub fn new(init_value: i32) -> Self {
       ink_lang::utils::initialize_contract(|contract: &mut Self| {
           contract.value = init_value;
           let caller = Self::env().caller();
           contract.my_value.insert(&caller, &0);
       })
   }

   ```

1. Use the `initialize_contract` function to set an initial `value` for the `default` function in the contract.

   ```rust
   #[ink(constructor)]
   pub fn default() -> Self {
       ink_lang::utils::initialize_contract(|contract: &mut Self| {
           contract.value = Default::default();
       })
   }
   ```

1. Add a `get_mine` function to read `my_value` using the Mapping API `get` function and return `my_value` for the contract caller .

   ```rust
   #[ink(message)]
   pub fn get_mine(&self) -> i32 {
       self.my_value.get(&self.env().caller()).unwrap_or_default()
   }
   ```

1. Add a new test to the initialize accounts.

   ```rust
    #[ink::test]
   fn my_value_works() {
       let contract = Incrementer::new(11);
       assert_eq!(contract.get(), 11);
       assert_eq!(contract.get_mine(), 0);
   }

   ```

1. Save your changes and close the file.

1. Use the `test` subcommand and `nightly` toolchain to test your work by running the following command:

   ```bash
   cargo +nightly test
   ```

   The command should display output similar to the following to indicate successful test completion:

   ```bash
   running 3 tests
   test incrementer::tests::default_works ... ok
   test incrementer::tests::it_works ... ok
   test incrementer::tests::my_value_works ... ok

   test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   ```

## Insert, update, or remove values

The final step in the Incrementer contract is to allow users to update their own values.
You can use calls to the Mapping API to provide this functionality in the smart contract.

The `ink_storage` Mapping provides direct access to storage items.
For example, you can replace a previous value held for a storage item by calling `Mapping::insert()` with an existing key.
You can also update values by first reading them from storage using `Mapping::get()`, then update the value with `Mapping::insert()`.
If there is no existing value at a given key, `Mapping::get()` returns
`None`.

Because the Mapping API provides direct access to storage, you can use the
`Mapping::remove()` method to remove the value at a given key from storage.

To add insert and remove functions to the contract:

1. Open a terminal shell on your computer, if needed.

1. Verify that you are in the `incrementer` project folder.

1. Open the `lib.rs` file in a text editor.

1. Add an `inc_mine()` function that allows the contract caller to get the `my_value` storage item and insert an incremented `value` into the mapping.

   ```rust
   #[ink(message)]
   pub fn inc_mine(&mut self, by: i32) {
       let caller = self.env().caller();
       let my_value = self.get_mine();
       self.my_value.insert(caller, &(my_value + by));
   }
   ```

1. Add a `remove_mine()` function that allows the contract caller to get the clear the `my_value` storage item from storage.

   ```rust
   #[ink(message)]
   pub fn remove_mine(&self) {
       self.my_value.remove(&self.env().caller())
   }
   ```

1. Add a new test to verify that the `inc_mine()` functions works as expected.

   ```rust
   #[ink::test]
   fn inc_mine_works() {
       let mut contract = Incrementer::new(11);
       assert_eq!(contract.get_mine(), 0);
       contract.inc_mine(5);
       assert_eq!(contract.get_mine(), 5);
       contract.inc_mine(5);
       assert_eq!(contract.get_mine(), 10);
   }
   ```

1. Add a new test to verify that the `remove_mine()` functions works as expected.

   ```rust
   #[ink::test]
   fn remove_mine_works() {
       let mut contract = Incrementer::new(11);
       assert_eq!(contract.get_mine(), 0);
       contract.inc_mine(5);
       assert_eq!(contract.get_mine(), 5);
       contract.remove_mine();
       assert_eq!(contract.get_mine(), 0);
   }
   ```

1. Use the `test` subcommand and `nightly` toolchain to test your work by running the following command:

   ```bash
   cargo +nightly test
   ```

   The command should display output similar to the following to indicate successful test completion:

   ```bash
   running 5 tests
   test incrementer::tests::default_works ... ok
   test incrementer::tests::it_works ... ok
   test incrementer::tests::remove_mine_works ... ok
   test incrementer::tests::inc_mine_works ... ok
   test incrementer::tests::my_value_works ... ok

   test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   ```

## Next steps

In this tutorial, you learned how to use the `ink_storage` Mapping type and Mapping API in a smart contract.
For example, this tutorial illustrated:

- How to initialize a mapping for storing key-value pairs.

- How to identify and use the contract caller in a smart contract.

- How to add functions that enable users to insert and remove the values stored for them in a map using a smart contract.

You can find an example of the final code for this tutorial in the assets for the [ink-workshop](https://docs.substrate.io/assets/tutorials/ink-workshop/1.6-finished-code.rs)
You can learn more about smart contract development in the following topics:

- [Build an ERC20 token contract](/tutorials/smart-contracts/erc20-token/)
- [Troubleshoot smart contracts](tutorials/smart-contracts/sc-common-issues/)

If you experienced any issues with this tutorial, submit an issue, ask questions or provide feedback.

- [Submit an issue](https://github.com/substrate-developer-hub/substrate-docs/issues/new/choose).

- [Substrate Stack Exchange](https://substrate.stackexchange.com/).
