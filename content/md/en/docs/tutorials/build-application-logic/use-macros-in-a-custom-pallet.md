---
title: Use macros in a custom pallet
description: Create a custom pallet for a Substrate runtime using a skeleton of FRAME macros.
keywords:
---

This tutorial illustrates how to create a custom pallet for a Substrate
runtime using **macros** that are part of the [FRAME](/reference/frame-macros/) development environment.

For this tutorial, you'll build a simple **proof-of-existence** application. Proof-of-existence is an approach to validating the authenticity and ownership of a digital object by storing information about the object on the blockchain.
Because the blockchain associates a timestamp and account with the object, the blockchain record can be used to "prove" that a particular object existed at a specific date and time.
It can also verify who the owner of a record was at that date and time.

## Digital objects and hashes

Instead of storing an entire file on the blockchain, it can be much more efficient to simply store a [cryptographic hash](https://en.wikipedia.org/wiki/Cryptographic_hash_function) of that file.
This is also known as a "digital fingerprint".
The hash enables the blockchain to store files of arbitrary size efficiently by using a small and unique hash value.
Because any change to a file would result in a different hash, users can prove the validity of a file by computing the hash and comparing that hash with the hash stored on chain.

![File Hash](/media/images/docs/tutorials/custom-pallet/file-hash.png)

## Digital objects and account signatures

Blockchains use [public key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) to map digital identities to accounts that have private keys.
The blockchain records the account you use to store the hash for a digital object as part of the transaction.
Because the account information is stored as part of the transaction, the controller of the private key for that account can later prove ownership as the person who initially uploaded the file.

## How much time do you need to complete this tutorial?

This tutorial requires compiling Rust code and takes approximately one to two hours to complete.

## Before you begin

For this tutorial, you download and use working code. Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have completed [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/) and have the Substrate node template installed locally.

- You have used predefined accounts as described in [Simulate a network](/tutorials/build-a-blockchain/simulate-network/) to start nodes on a single computer.

- You are generally familiar with software development and use command-line interfaces.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Learn the basic structure of a custom pallet.

- See examples of how Rust macros simplify the code you need to write.

- Start a blockchain node that contains a custom pallet.

- Add front-end code that exposes the proof-of-existence pallet.

## Design the application

The proof-of-existence application exposes the following callable functions:

- `create_claim()` allows a user to claim the existence of a file by uploading a hash.

- `revoke_claim()` allows the current owner of a claim to revoke ownership.

## Build a custom pallet

The Substrate node template has a FRAME-based runtime.
As you learned in [Runtime development](/learn/runtime-development), FRAME is a library of code that allows you to build a Substrate runtime by composing modules called pallets.
You can think of the pallets as specialized logical units that define what your blockchain can do.
Substrate provides you with a number of pre-built pallets for use in FRAME-based runtimes.

![Runtime composition](/media/images/docs/tutorials/custom-pallet/frame-runtime.png)

This tutorial demonstrates how to create your own FRAME pallet to be included in your custom blockchain.

### Set up scaffolding for your pallet

This tutorial demonstrates how to create a custom pallet from scratch.
Therefore, the first step is to remove some files and content from the files in the node template directory.

1. Open a terminal shell and navigate to the root directory for the node template.

1. Change to the `pallets/template/src` directory by running the following command:

   ```bash
   cd pallets/template/src
   ```

1. Remove the following files:

   ```bash
   benchmarking.rs
   mock.rs
   tests.rs
   ```

1. Open the `lib.rs` file in a text editor.

   This file contains code that you can use as a template for a new pallet.
   You won't be using the template code in this tutorial.
   However, you can review the template code to see what it provides before you delete it.

1. Delete all of the lines in the `lib.rs` file.

1. Add the macro required to build both the native Rust binary (`std`) and the WebAssembly (`no_std`) binary.

   ```rust
   #![cfg_attr(not(feature = "std"), no_std)]
   ```

   All of the pallets used in a runtime must be set to compile with the `no_std` features.

1. Add a skeleton set of pallet dependencies and [macros](/reference/frame-macros) that the custom pallet requires by copying the following code:

   ```rust
   // Re-export pallet items so that they can be accessed from the crate namespace.
   pub use pallet::*;

   #[frame_support::pallet]
   pub mod pallet {
     use frame_support::pallet_prelude::*;
     use frame_system::pallet_prelude::*;

     #[pallet::pallet]
     #[pallet::generate_store(pub(super) trait Store)]
     pub struct Pallet<T>(_);

     #[pallet::config]  // <-- Step 2. code block will replace this.
     #[pallet::event]   // <-- Step 3. code block will replace this.
     #[pallet::error]   // <-- Step 4. code block will replace this.
     #[pallet::storage] // <-- Step 5. code block will replace this.
     #[pallet::call]    // <-- Step 6. code block will replace this.
   }
   ```

   You now have a framework that includes placeholders for _events_, _errors_, _storage_, and _callable functions_.

1. Save your changes.

## Configure the pallet to emit events

Every pallet has a [Rust "trait"](https://doc.rust-lang.org/book/ch10-02-traits.html) called `Config`.
You use this trait to configure the settings that your specific pallet requires.
For this tutorial, the configuration setting enables the pallet to emit events.

To define the `Config` trait for the proof-of-existence pallet:

1. Open the `pallets/template/src/lib.rs` file in a text editor.

1. Replace the `#[pallet::config]` line with the following code block:

   ```rust
   /// Configure the pallet by specifying the parameters and types on which it depends.
   #[pallet::config]
   pub trait Config: frame_system::Config {
     /// Because this pallet emits events, it depends on the runtime's definition of an event.
     type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
   }
   ```

1. Save your changes.

## Implement pallet events

Now that you've configured the pallet to emit events, you are ready to define those events.
As described in [Design the application](#design-the-application), the proof-of-existence pallet emits an event under the following conditions:

- When a new claim is added to the blockchain.
- When a claim is revoked.

Each event also displays an `AccountId` to identify who triggered the
event and the proof-of-existence claim (as `Hash`) that is being stored or removed.

To implement the pallet events:

1. Open the `pallets/template/src/lib.rs` file in a text editor.

1. Replace the `#[pallet::event]` line with the following code block:

   ```rust
   // Pallets use events to inform users when important changes are made.
   // Event documentation should end with an array that provides descriptive names for parameters.
   #[pallet::event]
   #[pallet::generate_deposit(pub(super) fn deposit_event)]
   pub enum Event<T: Config> {
     /// Event emitted when a claim has been created.
     ClaimCreated { who: T::AccountId, claim: T::Hash },
     /// Event emitted when a claim is revoked by the owner.
     ClaimRevoked { who: T::AccountId, claim: T::Hash },
   }
   ```

1. Save your changes.

## Include pallet errors

The events you defined indicate when calls to the pallet have completed successfully.
Errors indicate that a call has failed, and why it has failed.
For this tutorial, you define the following error conditions:

- An attempt to make a claim when a claim already exists.

- An attempt to revoke a claim that doesn't exist.

- An attempt to revoke a claim that is owned by another account.

To implement the errors for the proof-of-existence pallet:

1. Open the `pallets/template/src/lib.rs` file in a text editor.

1. Replace the `#[pallet::error]` line with the following code block:

   ```rust
   #[pallet::error]
   pub enum Error<T> {
     /// The claim already exists.
     AlreadyClaimed,
     /// The claim does not exist, so it cannot be revoked.
     NoSuchClaim,
     /// The claim is owned by another account, so caller can't revoke it.
     NotClaimOwner,
   }
   ```

1. Save your changes.

## Implement a storage map for stored items

To add a new claim to the blockchain, the proof-of-existence pallet requires a storage mechanism.
To address this requirement, you can create a key-value map, where each claim points to the owner and the block number when the claim was made.
To create this key-value map, you can use the FRAME [`StorageMap`](https://paritytech.github.io/substrate/master/frame_support/pallet_prelude/struct.StorageMap.html).

To implement storage for the proof-of-existence pallet:

1. Open the `pallets/template/src/lib.rs` file in a text editor.

1. Replace the `#[pallet::storage]` line with the following code block:

   ```rust
   #[pallet::storage]
   pub(super) type Claims<T: Config> = StorageMap<_, Blake2_128Concat, T::Hash, (T::AccountId, BlockNumberFor<T>)>;
   ```

1. Save your changes.

## Implement callable functions

The proof-of-existence pallet exposes two callable functions to users:

- `create_claim()` allows a user to claim the existence of a file with a hash.

- `revoke_claim()` allows the owner of a claim to revoke the claim.

These functions use the `StorageMap` to implement the following logic:

- If a claim is already in storage, then it already has an owner and cannot be claimed again.
- If a claim doesn't exist in storage, then it is available to be claimed and written to storage.

To implement this logic in the proof-of-existence pallet:

1. Open the `pallets/template/src/lib.rs` file in a text editor.

1. Replace the `#[pallet::call]` line with the following code block. You might try to implement the `revoke_claim` function yourself. Just copy the function signature and not the content. The `Claims::<T>::get` and `Claims::<T>::remove` should be used to get or remove a claim.

   ```rust
   // Dispatchable functions allow users to interact with the pallet and invoke state changes.
   // These functions materialize as "extrinsics", which are often compared to transactions.
   // Dispatchable functions must be annotated with a weight and must return a DispatchResult.
   #[pallet::call]
   impl<T: Config> Pallet<T> {
     #[pallet::weight(0)]
     #[pallet::call_index(1)]
     pub fn create_claim(origin: OriginFor<T>, claim: T::Hash) -> DispatchResult {
       // Check that the extrinsic was signed and get the signer.
       // This function will return an error if the extrinsic is not signed.
       let sender = ensure_signed(origin)?;

       // Verify that the specified claim has not already been stored.
       ensure!(!Claims::<T>::contains_key(&claim), Error::<T>::AlreadyClaimed);

       // Get the block number from the FRAME System pallet.
       let current_block = <frame_system::Pallet<T>>::block_number();

       // Store the claim with the sender and block number.
       Claims::<T>::insert(&claim, (&sender, current_block));

       // Emit an event that the claim was created.
       Self::deposit_event(Event::ClaimCreated { who: sender, claim });

       Ok(())
     }

     #[pallet::weight(0)]
     #[pallet::call_index(2)]
     pub fn revoke_claim(origin: OriginFor<T>, claim: T::Hash) -> DispatchResult {
       // Check that the extrinsic was signed and get the signer.
       // This function will return an error if the extrinsic is not signed.
       let sender = ensure_signed(origin)?;

       // Get owner of the claim, if none return an error.
       let (owner, _) = Claims::<T>::get(&claim).ok_or(Error::<T>::NoSuchClaim)?;

       // Verify that sender of the current call is the claim owner.
       ensure!(sender == owner, Error::<T>::NotClaimOwner);

       // Remove claim from storage.
       Claims::<T>::remove(&claim);

       // Emit an event that the claim was erased.
       Self::deposit_event(Event::ClaimRevoked { who: sender, claim });
       Ok(())
     }
   }
   ```

1. Save your changes and close the file.

1. Check that your code compiles by running the following command:

   ```bash
   cargo check -p node-template-runtime --release
   ```

   The `[-p](https://doc.rust-lang.org/cargo/commands/cargo-check.html#options) node-template-runtime` directive tells cargo to only check the `node_template_runtime` package.

   You can refer to the node template [solution](https://github.com/substrate-developer-hub/substrate-node-template/blob/tutorials/solutions/proof-of-existence/pallets/template/src/lib.rs) if you get stuck.

## Build the runtime with your new pallet

After you've copied all of the parts of the proof-of-existence pallet into the `pallets/template/lib.rs`file, you are ready to compile and start the node.

To compile and start the updated Substrate node:

1. Open a terminal shell.

1. Change to the root directory for the node template.

1. Compile the node template by running the following command:

   ```bash
   cargo build --release
   ```

1. Start the node in development mode by running the following command:

   ```bash
   ./target/release/node-template --dev
   ```

   The `--dev` option starts the node using the predefined `development` chain specification.
   Using the `--dev` option ensures that you have a clean working state any time you stop and restart the node.

1. Verify the node produces blocks.

## Interact with your blockchain

Now that you have a new blockchain running with the custom proof-of-existence pallet, we can interact with the chain to make sure all the functionality works as expected!

To do this, we will use Polkadot JS Apps, which is a developer tool that can connect to and interact with any Substrate based blockchain.

By default, your blockchain should be running on `ws://127.0.0.1:9944`, so to connect to it we can use this link:

https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/

If your Substrate blockchain is running and Polkadot JS Apps is connected, you should see your block number increase in the top left corner:

![Polkadot JS Explorer](/media/images/docs/tutorials/custom-pallet/poe-explorer.png)

### Submit a claim

To test the proof-of-existence pallet using the front-end:

1. Navigate to the ["Developer > Extrinsics"](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/extrinsics) tab.

   ![Extrinsics Tab](/media/images/docs/tutorials/custom-pallet/poe-extrinsics-tab.png)

1. Adjust the extrinsics page to select "ALICE" as the account, and "templateModule > createClaim" as the extrinsic.

   ![Create Claim](/media/images/docs/tutorials/custom-pallet/poe-create-claim.png)

1. Then you can toggle "hash a file", which will allow you to select a file to hash and claim on the blockchain.

   ![Hash File](/media/images/docs/tutorials/custom-pallet/poe-hash-file.png)

1. Click "Submit Transaction" in the bottom right corner, then on the pop up click "Sign and Submit".

   ![Submit Extrinsic](/media/images/docs/tutorials/custom-pallet/poe-submit.png)

1. If everything was successful, you should see a green extrinsic success notification!

   ![Extrinsic Success](/media/images/docs/tutorials/custom-pallet/poe-success.png)

### Read a claim

The final step of this tutorial is to check what claims have been stored on your blockchain.

1. Navigate to the ["Developer > Chain State"](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/chainstate) tab.

   ![Chain State](/media/images/docs/tutorials/custom-pallet/poe-chain-state.png)

1. Adjust the state query to "templateModule > claims".

1. Toggle off the "include option" on the hash input to leave the input empty.

   This will allow us to see all the claims, rather than just one at a time.

   ![Query All Claims](/media/images/docs/tutorials/custom-pallet/poe-claims.png)

1. Press the "+" button to execute the query.

   ![Query Results](/media/images/docs/tutorials/custom-pallet/poe-query.png)

   Now you can see that the claim is stored in the blockchain with the data about the owners address and the block number when the claim was made!

## Next steps

In this tutorial, you learned the basics of how to create a new custom pallet, including:

- How to add events, errors, storage, and callable functions to a custom pallet.

- How to integrate the custom pallet into the runtime.

- How to compile and start a node that includes your custom pallet.

- How you can use the Polkadot JS Apps developer tool to interact with your custom blockchain.

This tutorial covered the basics without diving too deeply into the code.
However, there's much more you can do as you work toward building your own fully-customized blockchain.
Custom pallets enable you to expose the features you want your blockchain to support.

To complete your understanding of the proof-of-existence chain try:

- Claiming the same file again with "ALICE" or even the "BOB" account.
  - You should get an error!
- Claiming other files with the "ALICE" and/or "BOB" accounts.
- Revoking the claims with the appropriate claim owner account.
- Looking at the final list of claims from reading storage.

To learn more about what's possible by creating custom pallets, explore the
FRAME documentation and the [how-to guides](/reference/how-to-guides).
