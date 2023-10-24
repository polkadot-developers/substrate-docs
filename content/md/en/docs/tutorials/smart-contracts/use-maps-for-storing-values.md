---
title: Use maps for storing values
description: Use mapping to store data as key-value pairs.
keywords:
---

In [Develop a smart contract](/tutorials/smart-contracts/develop-a-smart-contract/), you developed a smart contract for
storing and retrieving a single numeric value.

This tutorial illustrates how you can extend the functionality of your smart contract to manage one number per user. To
add this functionality, you'll use the [`Mapping`](https://docs.rs/ink/4.0.0-beta.1/ink/storage/struct.Mapping.html) type.

The ink! language provides the Mapping type to enable you to store data as key-value pairs. For example, the following
code illustrates mapping a user to a number:

```rust
// Import the `Mapping` type
use ink::storage::Mapping;

#[ink(storage)]
pub struct MyContract {
  // Store a mapping from AccountIds to a u32
  my_map: Mapping<AccountId, u32>,
}
```

With the `Mapping` data type, you can store a unique instance of the storage value for each key.

For this tutorial, each `AccountId` represents a key that maps to one and only one stored numeric `my_map`.

Each user can only store, increment, and retrieve the value associated with their own `AccountId`.

## Initialize a `Mapping`

The first step is to initialize the mapping between an `AccountId` and a stored value.

- Specify the mapping key and the value mapped to it.

The following example illustrates how to initialize a `Mapping` and retrieve a value:

```rust
#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod mycontract {
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct MyContract {
        // Store a mapping from AccountIds to a u32
        my_map: Mapping<AccountId, u32>,
    }

    impl MyContract {
        #[ink(constructor)]
        pub fn new(count: u32) -> Self {
            let mut my_map = Mapping::default();
            let caller = Self::env().caller();
            my_map.insert(&caller, &count);

            Self { my_map }
        }

        // Get the number associated with the caller's AccountId, if it exists
        #[ink(message)]
        pub fn get(&self) -> u32 {
            let caller = Self::env().caller();
            self.my_map.get(&caller).unwrap_or_default()
        }
    }
}
```

### Identifying the contract caller

In the preceding example, you might have noticed the `Self::env().caller()` function call.

This function is available throughout the contract logic and always returns the **contract caller**.

It is important to note that the contract caller is not the same as the **origin caller**.

If a user accesses a contract that then calls a subsequent contract, the `Self::env().caller()` in the second contract
is the address of the first contract, not the original user.

### Using the contract caller

There are many scenarios where having the contract caller available is useful.

For example, you can use `Self::env().caller()` to create an access control layer that only allows users to access their
own values.

You can also use `Self::env().caller()` to save the contract owner during contract deployment.

For example:

```rust
#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod my_contract {

    #[ink(storage)]
    pub struct MyContract {
        // Store a contract owner
        owner: AccountId,
    }

    impl MyContract {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                owner: Self::env().caller(),
            }
        }
        /* --snip-- */
    }
}
```

Because you have saved the contract caller using the `owner` identifier, you can later write functions that check
whether the current contract caller is the owner of the contract.

## Add mapping to the smart contract

You are now ready to introduce a storage map to the `incrementer` contract.

To add a storage map to the `incrementer` contract:

1. Open a terminal shell on your computer, if needed.

1. Verify that you are in the `incrementer` project folder.

1. Open the `lib.rs` file in a text editor.

1. Import the `Mapping` type.

   ```rust
   #[ink::contract
   mod incrementer {
       use ink::storage::Mapping;
   ```

1. Add the mapping key from `AccountId` to the `i32` data type stored as `my_map`.

   ```rust
   pub struct Incrementer {
       value: i32,
       my_map: Mapping<AccountId, i32>,
   }
   ```

1. In the `new` constructor create a new `Mapping` and use that to initialize your contract.

   ```rust
   #[ink(constructor)]
   pub fn new(init_value: i32) -> Self {
       let mut my_map = Mapping::default();
       let caller = Self::env().caller();
       my_map.insert(&caller, &0);

       Self {
           value: init_value,
           my_map,
       }
   }
   ```

1. In the `default` constructor add a new default `Mapping` along with the already defined default `value`.

    ```rust
    #[ink(constructor)]
    pub fn default() -> Self {
    Self {
            value: 0,
            my_map: Mapping::default(),
        }
    }
    ```

1. Add a `get_mine()` function to read `my_map` using the Mapping API's `get()` method and return `my_map` for the
   contract caller.

   ```rust
   #[ink(message)]
   pub fn get_mine(&self) -> i32 {
        let caller = self.env().caller();
        self.my_map.get(&caller).unwrap_or_default()
   }
   ```

1. Add a new test to the initialize accounts.

   ```rust
    #[ink::test]
   fn my_map_works() {
       let contract = Incrementer::new(11);
       assert_eq!(contract.get(), 11);
       assert_eq!(contract.get_mine(), 0);
   }
   ```

1. Save your changes and close the file.

1. Use the `test` subcommand and `nightly` toolchain to test your work by running the following command:

   ```bash
   cargo test
   ```

   The command should display output similar to the following to indicate successful test completion:

   ```text
   running 3 tests
   test incrementer::tests::default_works ... ok
   test incrementer::tests::it_works ... ok
   test incrementer::tests::my_map_works ... ok

   test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   ```

## Insert, update, or remove values

The final step in the `Incrementer` contract is to allow users to update their own values.

You can use calls to the Mapping API to provide this functionality in the smart contract.

The `Mapping` provides direct access to storage items.

For example, you can replace a previous value held for a storage item by calling `Mapping::insert()` with an existing
key.

You can also update values by first reading them from storage using `Mapping::get()`, then update the value with
`Mapping::insert()`.

If there is no existing value at a given key, `Mapping::get()` returns `None`.

Because the Mapping API provides direct access to storage, you can use the
`Mapping::remove()` method to remove the value at a given key from storage.

To add insert and remove functions to the contract:

1. Open a terminal shell on your computer, if needed.

1. Verify that you are in the `incrementer` project folder.

1. Open the `lib.rs` file in a text editor.

1. Add an `inc_mine()` function that allows the contract caller to get the `my_map` storage item and insert an
   incremented `value` into the mapping.

   ```rust
   #[ink(message)]
   pub fn inc_mine(&mut self, by: u32) {
       let caller = self.env().caller();
       let my_value = self.get_mine();
       self.my_map.insert(caller, &(my_value + by));
   }
   ```

1. Add a `remove_mine()` function that allows the contract caller to clear the `my_map` storage item from storage.

   ```rust
   #[ink(message)]
   pub fn remove_mine(&self) {
       let caller = self.env().caller();
       self.my_map.remove(&caller)
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

1. Check your work using the `test` subcommand:

   ```bash
   cargo test
   ```

   The command should display output similar to the following to indicate successful test completion:

   ```text
   running 5 tests
   test incrementer::tests::default_works ... ok
   test incrementer::tests::it_works ... ok
   test incrementer::tests::remove_mine_works ... ok
   test incrementer::tests::inc_mine_works ... ok
   test incrementer::tests::my_map_works ... ok

   test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   ```

## Next steps

In this tutorial, you learned how to use the `ink::storage::Mapping` type and Mapping API in a smart contract. For
example, this tutorial illustrated:

- How to initialize a mapping for storing key-value pairs.

- How to identify and use the contract caller in a smart contract.

- How to add functions that enable users to insert and remove the values stored for them in a map using a smart contract.

You can find an example of the final code for this tutorial in the assets for the
[smart-contracts](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/smart-contracts/incrementer-mapping.rs).

You can learn more about smart contract development in the following topics:

- [Build an ERC20 token contract](/tutorials/smart-contracts/build-a-token-contract/)
- [Troubleshoot smart contracts](/tutorials/smart-contracts/troubleshoot-smart-contracts/)
