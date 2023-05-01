---
title: Build a token contract
description: Build an ERC-20 token supply using a smart contract written in the ink! language.
keywords:
  - erc20
  - ethereum
  - ink
  - token
  - fungible
---

This tutorial illustrates how you can build an [ERC-20 token](https://eips.ethereum.org/EIPS/eip-20) contract using the
ink! language.

The ERC-20 specification defines a common standard for fungible tokens.

Having a standard for the properties that define a token enables developers who follow the specification to build
applications that can interoperate with other products and services.

The ERC-20 token standard is not the only token standard, but it is one of the most commonly used.

## Before you begin

Before you begin, verify the following:

- You are generally familiar with smart contracts, tokens, and cryptocurrency concepts and terminology.

- You have installed Rust and set up your development environment as described in [Install](/install/).

- You have completed [Prepare your first contract](/tutorials/smart-contracts/prepare-your-first-contract/) and have the Substrate contracts node installed locally.

- You have completed [Develop a smart contract](/tutorials/smart-contracts/develop-a-smart-contract/) and are familiar
  with how ink! uses Rust attribute macros to build smart contracts.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Learn the basic properties and interfaces defined in the ERC-20 standard.

- Create tokens that adhere to the ERC-20 standard.

- Transfer tokens between contracts.

- Handle routing of transfer activity involving approvals or third-parties.

- Create events related to token activity.

## Basics of the ERC-20 standard

The [ERC-20 token standard](https://eips.ethereum.org/EIPS/eip-20) defines the interface for most of the smart contracts
that run on the Ethereum blockchain.

These standard interfaces allow individuals to deploy their own cryptocurrency on top of an existing smart contract
platform.

If you review the standard, you'll notice the following core functions are defined.

```javascript
// ----------------------------------------------------------------------------
// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
// ----------------------------------------------------------------------------

contract ERC20Interface {
    // Storage Getters
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function allowance(address tokenOwner, address spender) public view returns (uint remaining);

    // Public Functions
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    // Contract Events
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}
```

Users balances are mapped to account addresses and the interfaces allow users to transfer tokens that they own or allow
a third party to transfer tokens on their behalf.

Most importantly, the smart contract logic must be implemented to ensure that funds are not unintentionally created or
destroyed, and that a user's funds are protected from malicious actors.

Note that all of the public functions return a `bool` that only indicates whether the call was successful or not.

In Rust, these functions would typically return a `Result`.

## Create the token supply

A smart contract for handling ERC-20 tokens is similar to the Incrementer contract that used maps to store values in
[Use maps for storing values](/tutorials/smart-contracts/use-maps-for-storing-values/).

For this tutorial, the ERC-20 contract consists of a fixed supply of tokens that are all deposited into the account
associated with the contract owner when the contract is deployed.

The contract owner can then distribute the tokens to other users.

The simple ERC-20 contract you create in this tutorial does not represent the only way you can mint and distribute
tokens.

However, this ERC-20 contract provides a good foundation for extending what you've learned in other tutorials and how to
use the ink! language for building more robust smart contracts.

For the ERC-20 token contract, the initial storage consists of:

- `total_supply` representing the total supply of tokens in the contract.
- `balances` representing the individual balance of each account.

To get started, lets create a new project with some template code.

To build an ERC-20 token smart contract:

1. Open a terminal shell on your local computer, if you don’t already have one open.

1. Create a new project named `erc20` by running the following command:

   ```bash
   cargo contract new erc20
   ```

1. Change to the new project directory by running the following command:

   ```bash
   cd erc20/
   ```

1. Open the `lib.rs` file in a text editor.

1. Replace the default template source code with the following
   [ERC-20 template](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/smart-contracts/erc20-template.rs)

1. Save the changes to the `lib.rs` file, then close the file.

1. Verify that the program compiles and passes the trivial test by running the following command

   ```bash
   cargo test
   ```

   The command should display output similar to the following to indicate successful test completion:

   ```text
   running 2 tests
   test erc20::tests::new_works ... ok
   test erc20::tests::balance_works ... ok

   test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   ```

1. Verify that you can build the WebAssembly for the contract by running the following command:

   ```bash
   cargo contract build
   ```

   If the program compiles successfully, you are ready to upload it in its current state or start adding functionality
   to the contract.

## Upload and instantiate the contract

If you want to test what you have so far, you can upload the contract using the [Contracts UI](https://contracts-ui.substrate.io).

To test the ERC-20 contract before adding new functions:

1. Start the local contract node. You can refer back to the [Prepare your first contract](/tutorials/smart-contracts/prepare-your-first-contract/) tutorial for instructions if needed.

2. Instantiate the contract using the `new()` constructor.

  ```bash
  cargo contract instantiate --constructor new --args 1_000_000 --suri //Alice --salt $(date +%s)
  ```

3. Verify the `total_supply` by calling the `total_supply()` message. Don't forget to add the `--dry-run` flag since we
   only want to read from the chain state.

  ```bash
  cargo contract call --contract $INSTANTIATED_CONTRACT_ADDRESS \
      --message total_supply --suri //Alice --dry-run
  ```


4. Verify the amount of tokens Alice, the initial holder of all the tokens, has using `balance_of()`.

  ```bash
  cargo contract call --contract $INSTANTIATED_CONTRACT_ADDRESS \
      --message balance_of --args 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY \
      --suri //Alice --dry-run
  ```

  Notice that we have to put the full address of Alice (`5Grw...utQY`) as an argument since `cargo-contract` doesn't
  (yet) support well-known keys in that position.

  If you supply any other `AccountId` the balance should be zero because all of the tokens are owned by the contract
  owner.

## Transfer tokens

At this point, the ERC-20 contract has one user account that owns the `total_supply` of the tokens for the contract.

To make this contract useful, the contract owner must be able to transfer tokens to other accounts.

For this simple ERC-20 contract, you are going to add a public `transfer` function that enables you — as the contract
caller — to transfer tokens that you own to another user.

The public `transfer` function calls a private `transfer_from_to()` function.

Because this is an internal function, it can be called without any authorization checks.

However, the logic for the transfer must be able to determine whether the `from` account has tokens available to
transfer to the receiving `to` account.

The `transfer_from_to()` function uses the contract caller (`self.env().caller()`) as the `from` account.

With this context, the `transfer_from_to()` function then does the following:

- Gets the current balance of the `from` and `to` accounts.

- Checks that the `from` balance is less than the `value` number of tokens to be sent.

  ```rust
  let from_balance = self.balance_of(*from);
    if from_balance < value {
    return Err(Error::InsufficientBalance)
  }
  ```

- Subtracts the `value` from transferring account and adds the `value` to the receiving account.

  ```rust
  self.balances.insert(&from, &(from_balance - value));
  let to_balance = self.balance_of(*to);
  self.balances.insert(&to, &(to_balance + value));
  ```

To add the transfer functions to the smart contract:

1. Open a terminal shell on your local computer, if you don’t already have one open.

1. Verify your are in the `erc20` project directory.

1. Open `lib.rs` in a text editor.

1. Add an `Error` declaration to return an error if there aren't enough tokens in an account to complete a transfer.

   ```rust
   /// Specify ERC-20 error type.
   #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
   #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
   pub enum Error {
   /// Return if the balance cannot fulfill a request.
       InsufficientBalance,
   }
   ```

1. Add an `Result` return type to return the `InsufficientBalance` error.

   ```rust
   /// Specify the ERC-20 result type.
   pub type Result<T> = core::result::Result<T, Error>;
   ```

1. Add the `transfer()` public function to enable the contract caller to transfer tokens to another account.

   ```rust
   #[ink(message)]
   pub fn transfer(&mut self, to: AccountId, value: Balance) -> Result<()> {
       let from = self.env().caller();
       self.transfer_from_to(&from, &to, value)
   }
   ```

1. Add the `transfer_from_to()` private function to transfer tokens from account associated with the contract caller to
   a receiving account.

   ```rust
   fn transfer_from_to(
       &mut self,
       from: &AccountId,
       to: &AccountId,
       value: Balance,
   ) -> Result<()> {
        let from_balance = self.balance_of(*from);
        if from_balance < value {
            return Err(Error::InsufficientBalance)
        }

        self.balances.insert(&from, &(from_balance - value));
        let to_balance = self.balance_of(*to);
        self.balances.insert(&to, &(to_balance + value));

        Ok(())
   }
   ```

1. Add a test that transfers tokens from one account to another.

   ```rust
   #[ink::test]
   fn transfer_works() {
       let mut contract = Erc20::new(100);
       assert_eq!(contract.balance_of(alice()), 100);
       assert!(contract.transfer(bob(), 10).is_ok());
       assert_eq!(contract.balance_of(bob()), 10);
       assert!(contract.transfer(bob(), 100).is_err());
   }
   ```

1. Verify that the program compiles and passes the test cases by running the following command:

   ```bash
   cargo test
   ```

   The command should display output similar to the following to indicate successful test completion:

   ```text
   running 3 tests
   test erc20::tests::new_works ... ok
   test erc20::tests::balance_works ... ok
   test erc20::tests::transfer_works ... ok

   test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   ```

If you'd like to see our solution, you can take a look
[here](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/smart-contracts/erc20-transfer.rs).

## Create events

The ERC-20 token standard specifies that contract calls cannot directly return a value when submitting a transaction.
However, you might want your smart contract to signal in some way that an event has occurred.
For example, you might want your smart contract to indicate when a transaction was made or that a transfer was approved.
You can use [events](https://use.ink/basics/events) to send these kinds of signals.

You can use events to communicate any kind of data.
Defining the data for an event is similar to defining a `struct`.
Events should be declared using the `#[ink(event)]` attribute.

### Add a transfer event

For this tutorial, you'll declare a `Transfer` event to provide information about completed transfer operations.
The `Transfer` event contains the following information:

- A value of type `Balance`.
- An Option-wrapped `AccountId` variable for the `from` account.
- An Option-wrapped `AccountId` variable for the `to` account.

For faster access to the event data they can have _indexed fields_.
You can do this by using the `#[ink(topic)]` attribute tag on that field.

To add the `Transfer` event:

1. Open the `lib.rs` file in a text editor.

1. Declare the event using the `#[ink(event)]` attribute macro.

   ```rust
   #[ink(event)]
   pub struct Transfer {
       #[ink(topic)]
       from: Option<AccountId>,
       #[ink(topic)]
       to: Option<AccountId>,
       value: Balance,
     }
   ```

### Emit the event

Now that you have declared the event and defined the information the event contains, you need to add the code that emits
the event.

You do this by calling the
[`self.env().emit_event()`](https://docs.rs/ink_env/4.0.0-rc/ink_env/fn.emit_event.html) function with the event name as the sole argument to the call.

In this ERC-20 contract, you want to emit a `Transfer` event every time that a transfer takes place.
There are two places in the code where this occurs:

- During the `new` call to initialize the contract.

- Every time that `transfer_from_to` is called.

The values for the `from` and `to` fields are `Option<AccountId>` data types.
However, during the initial transfer of tokens, the value set for the *initial supply* doesn't come from any other
account.
In this case, the Transfer event has a `from` value of `None`.

To emit the Transfer event:

1. Open the `lib.rs` file in a text editor.

1. Add the `Transfer` event to the `new()` constructor.

   ```rust
   #[ink(constructor)]
   pub fn new(total_supply: Balance) -> Self {
       // -- snip --

       Self::env().emit_event(Transfer {
           from: None,
           to: Some(caller),
           value: total_supply,
       });

       // -- snip --
   }
   ```

1. Add the `Transfer` event to the `transfer_from_to()` function.

   ```rust
   fn transfer_from_to(
       &mut self,
       from: &AccountId,
       to: &AccountId,
       value: Balance,
   ) -> Result<()> {
      // -- snip --

       self.env().emit_event(Transfer {
           from: Some(*from),
           to: Some(*to),
           value,
       });

       // -- snip --
   }
   ```

   Notice that `value` does not need a `Some()` because the value is not stored in an `Option`.


1. Verify that the program compiles and passes all tests by running the following command:

   ```bash
   cargo test
   ```

   The command should display output similar to the following to indicate successful test completion:

   ```text
   running 3 tests
   test erc20::tests::new_works ... ok
   test erc20::tests::balance_works ... ok
   test erc20::tests::transfer_works ... ok

   test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   ```

If you'd like to see our solution, you can take a look
[here](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/smart-contracts/erc20-event.rs).

## Enable third-party transfers

The ERC-20 token contract can now transfer tokens between accounts and emit events when this happens.
As a final step, you can add the `approve` and `transfer_from` functions to enable third party transfers.

Enabling one account to spend tokens on behalf of another account allows your smart contract to support decentralized
exchanges.

Instead of transferring your tokens directly to another user in a contract, you can approve some number of the tokens
you own to be traded on your behalf.

While you wait for a trade to execute, you can still control and spend your tokens, if needed.

You can also approve multiple contracts or users to access your tokens, so if one contract offers the best trade, you
don't need to move tokens from one contract to another, which can be a costly and time-consuming process.

To ensure approvals and transfers can be done safely, the ERC-20 token contracts uses a two-step process, with separate
**approve** and **transfer From** operations.

### Add the approval logic

Approving another account to spend your tokens is the first step in the third party transfer process.

As a token owner, you can specify any account and any number of tokens that the designated account can transfer on your
behalf.

You don't have approve all tokens in your account and you can specify a maximum number that an approved account is
allowed to transfer.

When you call `approve` multiple times, you overwrite the previously-approved value with the new value.
By default, the approved value between any two accounts is `0`.
If you want to revoke access to the tokens in your account, you can call the `approve` function with a value of `0`.

To store approvals in the ERC-20 contract, you need to use a slightly more complex `Mapping` key.

Since each account can have a different amount approved for any other accounts to use, you need to use a tuple as the
key that maps to a balance value.

For example:

```rust
pub struct Erc20 {
 // -- snip --

 /// Balances that can be transferred by non-owners: (owner, spender) -> allowed
 allowances: Mapping<(AccountId, AccountId), Balance>,
}
```

The tuple uses `(owner, spender)` to identify the `spender` account that is allowed to access tokens on behalf of the
`owner` up to a specified `allowance`.

To add the approval logic to the smart contract:

1. Open the `lib.rs` file in a text editor.

1. Declare the `Approval` event using the `#[ink(event)]` attribute macro.

   ```rust
   #[ink(event)]
   pub struct Approval {
       #[ink(topic)]
       owner: AccountId,
       #[ink(topic)]
       spender: AccountId,
       value: Balance,
   }
   ```

1. Add an `Error` varient to indicate an error if the transfer request exceeds the account allowance.

   ```rust
   #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
   #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
   pub enum Error {
       InsufficientBalance,
       InsufficientAllowance,
   }
   ```

1. Add an `allowances` `Mapping` to the storage declaration for an owner and non-owner combination to an account
   balance.

   ```rust
   allowances: Mapping<(AccountId, AccountId), Balance>,
   ```

1. Instantiate and add the `allowances` `Mapping` in the new() constructor.

   ```rust
   #[ink(constructor)]
   pub fn new(total_supply: Balance) -> Self {
       // -- snip --

       let allowances = Mapping::default();

       Self {
           total_supply,
           balances,
           allowances
      }
   }
   ```

1. Add the `approve()` function to authorize a `spender` account to withdraw tokens from the caller's account up to a
   maximum `value`.

   ```rust
   #[ink(message)]
   pub fn approve(&mut self, spender: AccountId, value: Balance) -> Result<()> {
       let owner = self.env().caller();
       self.allowances.insert((owner, spender), &value);

       self.env().emit_event(Approval {
         owner,
         spender,
         value,
       });

       Ok(())
   }
   ```

1. Add an `allowance()` function to return the number of tokens a `spender` is allowed to withdraw from the `owner`
   account.

   ```rust
   #[ink(message)]
   pub fn allowance(&self, owner: AccountId, spender: AccountId) -> Balance {
       self.allowances.get((owner, spender)).unwrap_or_default()
   }
   ```

### Add the transfer from logic

Now that you have set up an approval for one account to transfer tokens on behalf of another, you need to create a
`transfer_from` function to enable an approved user to transfer the tokens.

The `transfer_from` function calls the private `transfer_from_to` function to do most of the transfer logic.

There are a few requirements to authorize a non-owner to transfer tokens:

- The `self.env().caller()` contract caller must be allocated tokens that are available in the `from` account.

- The allocation stored as an `allowance` must be more than the value to be transferred.

If these requirements are met, the contract inserts the updated allowance into the `allowance` variable and calls the
`transfer_from_to()` function using the specified `from` and `to` accounts.

Remember when calling `transfer_from`, the `self.env().caller()` and the `from` account are used to look up the current
allowance, but the `transfer_from` function is called between the `from` and `to` accounts specified.

There are three account variables in play whenever `transfer_from` is called, and you need to make sure to use them
correctly.

To add the `transfer_from` logic to the smart contract:

1. Open the `lib.rs` file in a text editor.

1. Add the `transfer_from()` function to transfer the `value` number of tokens on behalf to the `from` account to the
   `to` account.

   ```rust
   /// Transfers tokens on the behalf of the `from` account to the `to account
   #[ink(message)]
   pub fn transfer_from(
       &mut self,
       from: AccountId,
       to: AccountId,
       value: Balance,
   ) -> Result<()> {
       let caller = self.env().caller();
       let allowance = self.allowance(from, caller);
       if allowance < value {
           return Err(Error::InsufficientAllowance);
       }

       self.transfer_from_to(&from, &to, value)?;

       self.allowances.insert((from, caller), &(allowance - value));

       Ok(())
      }
   ```

1. Add a test for the `transfer_from()` function.

   ```rust
   #[ink::test]
   fn transfer_from_works() {
       let mut contract = Erc20::new(100);
       assert_eq!(contract.balance_of(alice()), 100);
       let _ = contract.approve(alice(), 20);
       let _ = contract.transfer_from(alice(), bob(), 10);
       assert_eq!(contract.balance_of(bob()), 10);
   }
   ```

1. Add a test for the `allowance()` function.

   ```rust
   #[ink::test]
   fn allowances_works() {
       let mut contract = Erc20::new(100);
       assert_eq!(contract.balance_of(alice()), 100);
       let _ = contract.approve(alice(), 200);
       assert_eq!(contract.allowance(alice(), alice()), 200);

       assert!(contract.transfer_from(alice(), bob(), 50).is_ok());
       assert_eq!(contract.balance_of(bob()), 50);
       assert_eq!(contract.allowance(alice(), alice()), 150);

       assert!(contract.transfer_from(alice(), bob(), 100).is_err());
       assert_eq!(contract.balance_of(bob()), 50);
       assert_eq!(contract.allowance(alice(), alice()), 150);
   }
   ```

1. Verify that the program compiles and passes all tests by running the following command:

   ```bash
   cargo test
   ```

   The command should display output similar to the following to indicate successful test completion:

   ```text
   running 5 tests
   test erc20::tests::new_works ... ok
   test erc20::tests::balance_works ... ok
   test erc20::tests::transfer_works ... ok
   test erc20::tests::transfer_from_works ... ok
   test erc20::tests::allowances_works ... ok

   test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   ```

1. Verify that you can build the WebAssembly for the contract by running the following command

   ```bash
   cargo contract build
   ```

   After you build the WebAssembly for the contract, you can upload and instantiate it using `cargo-contract`
   described in [Upload and instantiate the contract](#upload-and-instantiate-the-contract).

## Write test cases

In this tutorial, you added simple unit tests to the `lib.rs` file.

The basic test cases illustrate that functions work as expected by giving specifying input values and verifying the
result returned.

You could improve the quality of the code by writing additional test cases.

For example, you might add tests that exercise error handling for invalid input, empty values, or values that are out of
expected bounds.

## Next steps

In this tutorial, you learned how to write a simple ERC-20 token smart contract using ink! to run on a Substrate
blockchain.

For example, this tutorial illustrated:

- How to create a contract with a fixed number of tokens.

- How to transfer tokens from the contract owner to other accounts.

- How to add tests to a smart contract.

- How to enable third-party transfers.

You can find an example of the code for this tutorial in the assets for
[smart contracts](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/smart-contracts/erc20-final.rs).

You can learn more about smart contract development in the following topics:

- [Use maps for storing values](/tutorials/smart-contracts/use-maps-for-storing-values/)

- [Troubleshoot smart contracts](/tutorials/smart-contracts/troubleshoot-smart-contracts/)

- [ink! documentation](https://paritytech.github.io/ink-docs/)
