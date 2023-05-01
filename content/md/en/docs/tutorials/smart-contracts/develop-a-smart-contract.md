---
title: Develop a smart contract
description: Develop a smart contract that increments a value.
keywords:
---

In [Prepare your first contract](/tutorials/smart-contracts/prepare-your-first-contract/), you learned the basic steps
for building and deploying a smart contract on a Substrate-based blockchain using a default first project.

For this tutorial, you'll develop a new smart contract that increments a counter value each time you execute a function
call.

## Before you begin

Before you begin, verify the following:

- You have good internet connection and access to a shell terminal on your local computer.

- You are generally familiar with software development and using command-line interfaces.

- You are generally familiar with blockchains and smart contract platforms.

- You have installed Rust and set up your development environment as described in [Install](/install/).

- You have completed [Prepare your first contract](/tutorials/smart-contracts/prepare-your-first-contract/) and have the
  Substrate contracts node installed locally.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Learn how to use a smart contract template.

- Store simple values using a smart contract.

- Increment and retrieve stored values using a smart contract.

- Add public and private functions to a smart contract.

## Smart contracts and ink!

In [Prepare your first contract](/tutorials/smart-contracts/prepare-your-first-contract/), you installed the
`cargo-contract` package for command-line access to the ink! programming language.

The ink! language is an [embedded domain specific language](https://wiki.haskell.org/Embedded_domain_specific_language).

This language enables you to write WebAssembly-based smart contracts using the Rust programming language.

The language uses standard Rust patterns with specialized `#[ink(...)]` attribute macros.

These attribute macros describe what different parts of your smart contract represent so they can be transformed into
Substrate-compatible WebAssembly bytecode.

## Create a new smart contract project

Smart contracts that run on Substrate start as projects.
You create projects using `cargo contract` commands.

For this tutorial, you'll create a new project for the `incrementer` smart contract.

Creating a new project adds a new project directory and default starter files — also called **template files** — to the
project directory.

You will modify these starter template files to build the smart contract logic for the `incrementer` project.

To create a new project for your smart contract:

1. Open a terminal shell on your local computer, if you don’t already have one open.

1. Create a new project named `incrementer` by running the following command:

   ```bash
   cargo contract new incrementer
   ```

1. Change to the new project directory by running the following command:

   ```bash
   cd incrementer/
   ```

1. Open the `lib.rs` file in a text editor.

   By default, the template `lib.rs` file contains the source code for the `flipper` smart contract with instances of
   the `flipper` contract name renamed `incrementer`.

1. Replace the default template source code with new
   [incrementer](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/smart-contracts/incrementer-template.rs)
   source code

1. Save the changes to the `lib.rs` file, then close the file.

1. Verify that the program compiles and passes the trivial test by running the following command:

   ```bash
   cargo test
   ```

   You can ignore any warnings because this template code is simply a skeleton.
   The command should display output similar to the following to indicate successful test completion:

   ```text
   running 1 test
   test incrementer::tests::default_works ... ok

   test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   ```

1. Verify that you can build the WebAssembly for the contract by running the following command:

   ```bash
   cargo contract build
   ```

   If the program compiles successfully, you are ready to start programming.

## Storing Simple Values

Now that you have some starter source code for the `incrementer` smart contract, you can introduce some new
functionality.

For example, this smart contract requires storage of simple values.

The following code in this section is intended to illustrate the functionality of the ink! language.
The code you will be using in the rest of this tutorial begins in the next section,
[Update your smart contract](#update-your-smart-contract).

You can store simple values for a contract using the `#[ink(storage)]` attribute macro:

```rust
#[ink(storage)]
pub struct MyContract {
  // Store a bool
  my_bool: bool,
  // Store a number
  my_number: u32,
}
```

### Supported types

ink! smart contracts support most Rust common data types, including booleans, unsigned and signed integers, strings,
tuples, and arrays.

These data types are encoded and decoded using the [Parity scale codec](https://github.com/paritytech/parity-codec) for
efficient transmission over the network.

In addition to common Rust types that can be encoded and decoded using the scale codec, the ink! language supports
Substrate-specific types — like `AccountId`, `Balance`, and `Hash` — as if they were primitive types.

The following code illustrates how to store an `AccountId` and `Balance` for this contract:

```rust
#[ink::contract]
mod MyContract {

  // Our struct will use those default ink! types
  #[ink(storage)]
  pub struct MyContract {
    // Store some AccountId
    my_account: AccountId,
    // Store some Balance
    my_balance: Balance,
  }
/* --snip-- */
}
```

### Constructors

Every ink! smart contract must have at least one constructor that runs when the contract is created.
However, a smart contract can have multiple constructors, if needed.

The following code illustrates using multiple constructors:

```rust
#[ink::contract]
mod my_contract {

    #[ink(storage)]
    pub struct MyContract {
        number: u32,
    }

    impl MyContract {
        /// Constructor that initializes the `u32` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(init_value: u32) -> Self {
            Self {
                number: init_value,
            }
        }

        /// Constructor that initializes the `u32` value to the `u32` default (0).
        ///
        /// Constructors can delegate to other constructors.
        #[ink(constructor)]
        pub fn default() -> Self {
            Self {
                number: Default::default(),
            }
        }
    /* --snip-- */
    }
}
```

## Update your smart contract

Now that you have learned about storing simple values, declaring data types, and using constructors, you can update your
smart contract source code to implement the following:

- Create a storage value called `value` with a data type of `i32`.
- Create a new `Incrementer` constructor and set its `value` to `init_value`.
- Create a second constructor function named `default` that has no input, and creates a new `Incrementer` with its
  `value` set to `0`.

To update the smart contract:

1. Open the `lib.rs` file in a text editor.

1. Replace the `Storage Declaration` comment by declaring the storage item named `value` with the data type of `i32`.

   ```rust
   #[ink(storage)]
   pub struct Incrementer {
       value: i32,
   }
   ```

1. Modify the `Incrementer` constructor to set its `value` to `init_value`.

   ```rust
   impl Incrementer {
        #[ink(constructor)]
        pub fn new(init_value: i32) -> Self {
            Self { value: init_value }
        }
   }
   ```

1. Add a second constructor function named `default` that creates a new `Incrementer` with its `value` set to `0`.

   ```rust
   #[ink(constructor)]
   pub fn default() -> Self {
       Self {
           value: 0,
       }
   }
   ```

1. Save your changes and close the file.

1. Try running the `test` subcommand again and you will see that the tests are now failing. This is because we need to update the `get` function and modify the tests to match the changes we implemented. We will do that in the next section.

## Add a function to get a storage value

Now that you have created and initialized a storage value, you can interact with it using public and private functions.
For this tutorial, you add a public function (a.k.a message) to get a storage value.

Note that all public functions must use the `#[ink(message)]` attribute macro.

To add the public function to the smart contract:

1. Open the `lib.rs` file in a text editor.

1. Update the `get` public function to return the data for the `value` storage item that has the `i32` data type.

   ```rust
   #[ink(message)]
   pub fn get(&self) -> i32 {
       self.value
   }
   ```

   Because this function only _reads_ from the contract storage, it uses the `&self` parameter to access the contract
   functions and storage items.

   This function does not allow changes to the state of the `value` storage item.

   If the last expression in a function does not have a semicolon (;), Rust treats it as the return value.

1. Replace the `Test Your Contract` comment in the private `default_works` function with code to test the `get`
   function.

   ```rust
   #[ink::test]
   fn default_works() {
       let contract = Incrementer::default();
       assert_eq!(contract.get(), 0);
   }
   ```

1. Save your changes and close the file.

1. Check your work using the `test` subcommand, and you will see that it is still failing, because we need to update the `it_works` test and add a new public function to increment the `value` storage item.

   ```bash
   cargo test
   ```

## Add a function to modify the storage value

At this point, the smart contract does not allow users modify the storage.
To enable users to _modify_ storage items, you must explicitly mark `value` as a mutable variable.

To add a function for incrementing the stored value:

1. Open the `lib.rs` file in a text editor.

1. Add a new `inc` public function to increment the `value` stored using the `by` parameter that has data type of `i32`.

   ```rust
   #[ink(message)]
   pub fn inc(&mut self, by: i32) {
       self.value += by;
   }
   ```

1. Add a new test to the source code to verify this function.

   ```rust
   #[ink::test]
   fn it_works() {
       let mut contract = Incrementer::new(42);
       assert_eq!(contract.get(), 42);
       contract.inc(5);
       assert_eq!(contract.get(), 47);
       contract.inc(-50);
       assert_eq!(contract.get(), -3);
   }
   ```

1. Save your changes and close the file.

1. Check your work using the `test` subcommand:

   ```bash
   cargo test
   ```

   The command should display output similar to the following to indicate successful test completion:

   ```text
   running 2 tests
   test incrementer::tests::it_works ... ok
   test incrementer::tests::default_works ... ok

   test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   ```

### Build the WebAssembly for the contract

After you test the `incrementer` contract, you are ready to compile this project to WebAssembly.

To build the WebAssembly for this smart contract:

1. Open a terminal shell on your computer, if needed.

1. Verify that you are in the `incrementer` project folder.

1. Compile the `incrementer` smart contract by running the following command:

   ```bash
   cargo contract build
   ```

   The command displays output similar to the following:

   ```text
   Your contract artifacts are ready. You can find them in:
   /Users/dev-docs/incrementer/target/ink

   - incrementer.contract (code + metadata)
   - incrementer.wasm (the contract's code)
   - incrementer.json (the contract's metadata)
   ```

## Deploy and test the smart contract

If you have the [`substrate-contracts-node`](https://github.com/paritytech/substrate-contracts-node) node installed
locally, you can start a local blockchain node for your smart contract.

Then you can use `cargo-contract` to deploy and test the smart contract.

To deploy on the local node:

1. Open a terminal shell on your computer, if needed.

2. Start the contracts node in local development mode by running the following command:

   ```bash
   substrate-contracts-node --log info,runtime::contracts=debug 2>&1
   ```

3. Upload and instantiate the contract

   ```bash
   cargo contract instantiate --constructor default --suri //Alice --salt $(date +%s)
   ```

   ```text
   Dry-running default (skip with --skip-dry-run)
       Success! Gas required estimated at Weight(ref_time: 321759143, proof_size: 0)
   Confirm transaction details: (skip with --skip-confirm)
    Constructor default
           Args
      Gas limit Weight(ref_time: 321759143, proof_size: 0)
   Submit? (Y/n):
      Events
       Event Balances ➜ Withdraw
         who: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
         amount: 2.953956313mUNIT
       ... snip ...
       Event System ➜ ExtrinsicSuccess
         dispatch_info: DispatchInfo { weight: Weight { ref_time: 2772097885, proof_size: 0 }, class: Normal, pays_fee: Yes }

   Code hash 0x71ddef2422fdb8358b503d5ef122c088a2dc6486dd460c37b01d672a8d319959
   Contract 5Cf6wFEyZnqvNJaKVxnWswefo7uT4jVsgzWKh8b78GLDV6kN
   ```

4. Increment the value

   ```bash
   cargo contract call --contract $INSTANTIATED_CONTRACT_ADDRESS --message inc --args 42 --suri //Alice
   ```

  ```text
   Dry-running inc (skip with --skip-dry-run)
    Success! Gas required estimated at Weight(ref_time: 8013742080, proof_size: 262144)
   Confirm transaction details: (skip with --skip-confirm)
        Message inc
           Args 42
      Gas limit Weight(ref_time: 8013742080, proof_size: 262144)
   Submit? (Y/n):
      Events
       Event Balances ➜ Withdraw
         who: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
         amount: 98.97416μUNIT
       Event Contracts ➜ Called
         caller: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
         contract: 5Cf6wFEyZnqvNJaKVxnWswefo7uT4jVsgzWKh8b78GLDV6kN
       Event TransactionPayment ➜ TransactionFeePaid
         who: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
         actual_fee: 98.97416μUNIT
         tip: 0UNIT
       Event System ➜ ExtrinsicSuccess
         dispatch_info: DispatchInfo { weight: Weight { ref_time: 1383927346, proof_size: 13255 }, class: Normal, pays_fee: Yes }
  ```

5. Get the current value

   ```bash
   cargo contract call --contract 5Cf6wFEyZnqvNJaKVxnWswefo7uT4jVsgzWKh8b78GLDV6kN --message get --suri //Alice --dry-run
   ```

   ```text
   Result Success!
   Reverted false
     Data Tuple(Tuple { ident: Some("Ok"), values: [Int(42)] })
   ```

As you can see the `value` being read from the contract is `42`, which matches our previous step!

## Next steps

In this tutorial, you learned some basic techniques for creating smart contracts using the ink! programming language and
attribute macros.

For example, this tutorial illustrated:

- How to add storage items, specify data types, and implement constructors in a new smart contract project.

- How to add functions to a smart contract.

- How to add a test to a smart contract.

- How to upload and instantiate the contract using `cargo-contract`.

You can find an example of the final code for this tutorial in the assets for the
[smart-contracts](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/smart-contracts/incrementer-basics.rs).

You can learn more about smart contract development in the following topics:

- [Use maps for storing values](/tutorials/smart-contracts/use-maps-for-storing-values/)
- [Build an ERC20 token contract](/tutorials/smart-contracts/build-a-token-contract/)
- [Troubleshoot smart contracts](/tutorials/smart-contracts/troubleshoot-smart-contracts/)
