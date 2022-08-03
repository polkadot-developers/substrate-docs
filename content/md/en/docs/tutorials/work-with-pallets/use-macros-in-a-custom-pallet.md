---
title: Use macros in a custom pallet
description: Create a custom pallet for a Substrate runtime using a skeleton of FRAME macros.
keywords:
---

This tutorial illustrates how to create a custom pallet for a Substrate
runtime using **macros** that are part of the [FRAME](/reference/frame-macros/) development environment.

For this tutorial, you'll build a simple **proof of existence** application. Proof of existence is an approach to validating the authenticity and ownership of a digital object by using the object information stored on the blockchain.
Because the blockchain associates a timestamp and signature with the object, the blockchain record can be used to verify—to serve as proof—that a particular object existed at a specific date and time. It can also verify who the owner of a record was at that date and time.

## Digital objects and hashes

Instead of individual files, the blockchain stores digital records using a [cryptographic hash](https://en.wikipedia.org/wiki/Cryptographic_hash_function).
The hash enables the blockchain to store files of arbitrary size efficiently by using a small and unique hash value.
Because any change to a file would result in a different hash, users can prove the validity of a file by computing the hash and comparing that hash with the hash stored on chain.

![File Hash](/media/images/docs/tutorials/custom-pallet/file-hash.png)

## Digital objects and account signatures

Blockchains use [public keys](https://en.wikipedia.org/wiki/Public-key_cryptography) to map digital identities to accounts that have private keys.
The blockchain records the account you use to store the hash for a digital object as part of the transaction.
Because the account information is stored as part of the transaction, the controller of the account can later prove ownership as the person who initially uploaded the file.

## How much time do you need to complete this tutorial?

This tutorial requires compiling Rust code and takes approximately one to two hours to complete.

## Before you begin

For this tutorial, you download and use working code. Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/main-docs/install/).

- You have completed [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) and have the Substrate node template installed locally.

- You have used predefined accounts as described in [Simulate a network](/tutorials/get-started/simulate-network/) to start nodes on a single computer.

- You are generally familiar with software development and use command-line interfaces.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Learn the basic structure of a custom pallet.

- See examples of how Rust macros simplify the code you need to write.

- Start a blockchain node that contains a custom pallet.

- Add front-end code that exposes the proof-of-existence pallet.

## Design the application

The proof of existence application exposes the following callable functions:

- `create_claim()` allows a user to claim the existence of a file by uploading a hash.

- `revoke_claim()` allows the current owner of a claim to revoke ownership.

These functions only require you to store information about the proofs that have been claimed, and who made those claims.

## Build a custom pallet

The Substrate node template has a FRAME-based runtime.
As you learned in [Runtime development](/main-docs/fundamentals/runtime-intro), FRAME is a library of code that allows you to build a Substrate runtime by composing modules called pallets.
You can think of the pallets as individual pieces of logic that define what your blockchain can do.
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
   	use sp_std::vec::Vec; // Step 3.1 will include this in `Cargo.toml`

   	#[pallet::config]  // <-- Step 2. code block will replace this.
   	#[pallet::event]   // <-- Step 3. code block will replace this.
   	#[pallet::error]   // <-- Step 4. code block will replace this.
   	#[pallet::pallet]
   	#[pallet::generate_store(pub(super) trait Store)]
   	pub struct Pallet<T>(_);

   	#[pallet::storage] // <-- Step 5. code block will replace this.
   	#[pallet::hooks]
   	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {}
   	#[pallet::call]   // <-- Step 6. code block will replace this.
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
   	type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
   }
   ```

1. Save your changes.

## Implement pallet events

Now that you've configured the pallet to emit events, you are ready to define those events.
As described in [Design the application](#design-the-application), the proof-of-existence pallet emits an event under the following conditions:

- When a new proof is added to the blockchain.
- When a proof is revoked.

Each event also displays an `AccountId` to identify who triggered the
event and the proof-of-existence data (as `Vec<u8>`) that is being stored or removed.
By convention, each event includes an array with descriptive names for its parameters.

To implement the pallet events:

1. Open the `pallets/template/src/lib.rs` file in a text editor.

1. Replace the `#[pallet::event]` line with the following code block:

   ```rust
   // Pallets use events to inform users when important changes are made.
   // Event documentation should end with an array that provides descriptive names for parameters.
   #[pallet::event]
   #[pallet::generate_deposit(pub(super) fn deposit_event)]
   pub enum Event<T: Config> {
   	/// Event emitted when a proof has been claimed. [who, claim]
   	ClaimCreated(T::AccountId, Vec<u8>),
   	/// Event emitted when a claim is revoked by the owner. [who, claim]
   	ClaimRevoked(T::AccountId, Vec<u8>),
   }
   ```

1. Save your changes.

## Include `sp-std` library

You might notice that the proof-of-existence pallet uses the `Vec<u8>` type.
This type is included in the `std` Rust library.
However, you _cannot_ use the `std` library for pallet development.
Instead, the proof-of-existence pallet uses the [sp-std crate](https://paritytech.github.io/substrate/master/sp_std/index.html) to declare the `Vec<u8>` type under the `mod pallet` section:

```rust
use sp_std::vec::Vec;
```

The `sp-std` crate provides many standard Rust library functions modified to be compatible with `no_std` configuration.
To use the `sp-std` crate, you must update the pallet dependencies in the `Cargo.toml` file.

To add the `sp-std` crate to the pallet:

1. Open the `pallets/template/Cargo.toml` file in a text editor.

1. Add the following `sp-std` dependencies section to the file:

   ```toml
   [dependencies.sp-std]
   default-features = false
   git = 'https://github.com/paritytech/substrate.git'
   branch = 'polkadot-v0.9.26'  # Must *match* the rest of your Substrate deps!
   ```

1. Add the `sp-std` crate to the list of features.

   ```toml
   [features]
   default = ['std']
   std = [
       # -- snip --
       'sp-std/std',
   ]
   ```

1. Save your changes and close the file.

## Include pallet errors

The events you defined indicate when calls to the pallet have completed successfully.
Errors indicate when a call has failed, and why it has failed.
For this tutorial, you define the following error conditions:

- An attempt to claim a proof that has already been claimed.

- An attempt to revoke a proof that does not exist.

- An attempt to revoke a proof that has been claimed by another account.

To implement the errors for the proof-of-existence pallet:

1. Open the `pallets/template/src/lib.rs` file in a text editor.

1. Replace the `#[pallet::error]` line with the following code block:

   ```rust
   #[pallet::error]
   pub enum Error<T> {
   	/// The proof has already been claimed.
   	ProofAlreadyClaimed,
   	/// The proof does not exist, so it cannot be revoked.
   	NoSuchProof,
   	/// The proof is claimed by another account, so caller can't revoke it.
   	NotProofOwner,
   }
   ```

1. Save your changes.

## Implement a storage map for stored items

To add a new proof to the blockchain, the proof-of-existence pallet requires a storage mechanism.
To address this requirement, you can create a [hash map](https://en.wikipedia.org/wiki/Hash_table) that maps each proof to its owner and records the block number when the proof was made.
To create this hash map, you can use the FRAME [`StorageMap`](https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageMap.html) trait.

To implement storage for the proof-of-existence pallet:

1. Open the `pallets/template/src/lib.rs` file in a text editor.

1. Replace the `#[pallet::storage]` line with the following code block:

   ```rust
   #[pallet::storage]
   pub(super) type Proofs<T: Config> = StorageMap<_, Blake2_128Concat, Vec<u8>, (T::AccountId, T::BlockNumber), ValueQuery>;
   ```

1. Save your changes.

## Implement callable functions

The proof-of-existence pallet exposes two callable functions to users:

- `create_claim()` allows a user to claim the existence of a file with a proof.

- `revoke_claim()` allows the owner of a claim to revoke the claim.

These functions use the `StorageMap` to implement the following logic:

- If a proof has an owner and a block number, then it has been claimed.
- If a proof does not have an owner and a block number, then it is available to be claimed and written to storage.

To implement this logic in the proof-of-existence pallet:

1. Open the `pallets/template/src/lib.rs` file in a text editor.

1. Replace the `#[pallet::call]` line with the following code block:

   ```rust
   // Dispatchable functions allow users to interact with the pallet and invoke state changes.
   // These functions materialize as "extrinsics", which are often compared to transactions.
   // Dispatchable functions must be annotated with a weight and must return a DispatchResult.
   #[pallet::call]
   impl<T: Config> Pallet<T> {
   	#[pallet::weight(1_000)]
   	pub fn create_claim(
   		origin: OriginFor<T>,
   		proof: Vec<u8>,
   	) -> DispatchResult {
   		// Check that the extrinsic was signed and get the signer.
   		// This function will return an error if the extrinsic is not signed.
   		let sender = ensure_signed(origin)?;

   		// Verify that the specified proof has not already been claimed.
   		ensure!(!Proofs::<T>::contains_key(&proof), Error::<T>::ProofAlreadyClaimed);

   		// Get the block number from the FRAME System pallet.
   		let current_block = <frame_system::Pallet<T>>::block_number();

   		// Store the proof with the sender and block number.
   		Proofs::<T>::insert(&proof, (&sender, current_block));

   		// Emit an event that the claim was created.
   		Self::deposit_event(Event::ClaimCreated(sender, proof));

   		Ok(())
   	}

   	#[pallet::weight(10_000)]
   	pub fn revoke_claim(
   		origin: OriginFor<T>,
   		proof: Vec<u8>,
   	) -> DispatchResult {
   		// Check that the extrinsic was signed and get the signer.
   		// This function will return an error if the extrinsic is not signed.
   		let sender = ensure_signed(origin)?;

   		// Verify that the specified proof has been claimed.
   		ensure!(Proofs::<T>::contains_key(&proof), Error::<T>::NoSuchProof);

   		// Get owner of the claim.
   		let (owner, _) = Proofs::<T>::get(&proof);

   		// Verify that sender of the current call is the claim owner.
   		ensure!(sender == owner, Error::<T>::NotProofOwner);

   		// Remove claim from storage.
   		Proofs::<T>::remove(&proof);

   		// Emit an event that the claim was erased.
   		Self::deposit_event(Event::ClaimRevoked(sender, proof));
   		Ok(())
   	}
   }
   ```

1. Save your changes and close the file.

1. Check that your code compiles by running the following command:

   ```bash
   cargo check -p node-template-runtime
   ```

You can refer to the node template [solution](https://github.com/substrate-developer-hub/substrate-node-template/tree/tutorials/solutions/proof-of-existence) if you get stuck.
You can also check the [commit diff](https://github.com/substrate-developer-hub/substrate-node-template/commit/773d72752f3598e5d405b48c6f716f4153c95070#diff-f191d0eb0afa874a64fb9be550a275f957e220b9076c87d4085c2797ca4e310c) to see the exact changes from the base template.

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

## Build a custom front-end component

Now that you have a new blockchain running with the custom proof-of-existence pallet, let's add a custom React component to the front-end template.
This React component enables you to expose the proof-of-existence capabilities and interact with the new pallet you created.

### Add your custom react component

1. Open a new terminal shell on your computer, then change to the root directory where you installed the front-end template.

1. Open the `src/TemplateModule.js` file in a text editor.

1. Delete the entire contents of that file.

1. Copy and paste the following code into the`src/TemplateModule.js` file:

    ```javascript
    import React, { useEffect, useState } from 'react'
    import { Form, Input, Grid, Message } from 'semantic-ui-react'

    // Pre-built Substrate front-end utilities for connecting to a node
    // and making a transaction.
    import { useSubstrateState } from './substrate-lib'
    import { TxButton } from './substrate-lib/components'

    // Polkadot-JS utilities for hashing data.
    import { blake2AsHex } from '@polkadot/util-crypto'

    // Main Proof Of Existence component is exported.
    function Main(props) {
      // Establish an API to talk to the Substrate node.
      const { api, currentAccount } = useSubstrateState()
      // React hooks for all the state variables we track.
      // Learn more at: https://reactjs.org/docs/hooks-intro.html
      const [status, setStatus] = useState('')
      const [digest, setDigest] = useState('')
      const [owner, setOwner] = useState('')
      const [block, setBlock] = useState(0)

      // Our `FileReader()` which is accessible from our functions below.
      let fileReader
      // Takes our file, and creates a digest using the Blake2 256 hash function
      const bufferToDigest = () => {
        // Turns the file content to a hexadecimal representation.
        const content = Array.from(new Uint8Array(fileReader.result))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
        const hash = blake2AsHex(content, 256)
        setDigest(hash)
      }

      // Callback function for when a new file is selected.
      const handleFileChosen = file => {
        fileReader = new FileReader()
        fileReader.onloadend = bufferToDigest
        fileReader.readAsArrayBuffer(file)
      }

      // React hook to update the owner and block number information for a file
      useEffect(() => {
        let unsubscribe
        // Polkadot-JS API query to the `proofs` storage item in our pallet.
        // This is a subscription, so it will always get the latest value,
        // even if it changes.
        api.query.templateModule
          .proofs(digest, result => {
            // Our storage item returns a tuple, which is represented as an array.
            if(result.value[0] && result.value[1]){
              setOwner(result.value[0].toString())
              setBlock(result.value[1].toNumber())
            }
          })
          .then(unsub => {
            unsubscribe = unsub
          })
        return () => unsubscribe && unsubscribe()
        // This tells the React hook to update whenever the file digest changes
        // (when a new file is chosen), or when the storage subscription says the
        // value of the storage item has updated.
      }, [digest, api.query.templateModule])

      // We can say a file digest is claimed if the stored block number is not 0
      function isClaimed() {
        return block !== 0
      }

      // The actual UI elements which are returned from our component.
      return (
        <Grid.Column>
          <h1>Proof of Existence</h1>
          {/* Show warning or success message if the file is or is not claimed. */}
          <Form success={!!digest && !isClaimed()} warning={isClaimed()}>
            <Form.Field>
              {/* File selector with a callback to `handleFileChosen`. */}
              <Input
                type="file"
                id="file"
                label="Your File"
                onChange={e => handleFileChosen(e.target.files[0])}
              />
              {/* Show this message if the file is available to be claimed */}
              <Message success header="File Digest Unclaimed" content={digest} />
              {/* Show this message if the file is already claimed. */}
              <Message
                warning
                header="File Digest Claimed"
                list={[digest, `Owner: ${owner}`, `Block: ${block}`]}
              />
            </Form.Field>
            {/* Buttons for interacting with the component. */}
            <Form.Field>
              {/* Button to create a claim. Only active if a file is selected, and not already claimed. Updates the `status`. */}
              <TxButton
                label="Create Claim"
                type="SIGNED-TX"
                setStatus={setStatus}
                disabled={isClaimed() || !digest}
                attrs={{
                  palletRpc: 'templateModule',
                  callable: 'createClaim',
                  inputParams: [digest],
                  paramFields: [true],
                }}
              />
              {/* Button to revoke a claim. Only active if a file is selected, and is already claimed. Updates the `status`. */}
              <TxButton
                label="Revoke Claim"
                type="SIGNED-TX"
                setStatus={setStatus}
                disabled={!isClaimed() || owner !== currentAccount.address}
                attrs={{
                  palletRpc: 'templateModule',
                  callable: 'revokeClaim',
                  inputParams: [digest],
                  paramFields: [true],
                }}
              />
            </Form.Field>
            {/* Status message about the transaction. */}
            <div style={{ overflowWrap: 'break-word' }}>{status}</div>
          </Form>
        </Grid.Column>
      )
    }

    export default function TemplateModule(props) {
      const { api } = useSubstrateState()
      return api.query.templateModule ? <Main {...props} /> : null
    }
    ```

1. Save your changes and close the file.

1. Install dependencies, if necessary, by running the following command:
   
   ```bash
    yarn install
    ```

2. Start the front-end template by running the following command:

   ```bash
   yarn start
   ```

This will open up a new tab with the front-end serving at `http://localhost:8000`.

### Submit a proof

To test the proof-of-existence pallet using the new front-end component:

1. Find the component at the bottom of the page.
1. Click **Choose file** and select any file on your computer.

   The proof-of-existence pallet generates the hash for the selected file and displays it in the File Digest field.

   Because the file does not have an owner or block number, it is available to claim.

1. Click **Create Claim** to take ownership of the file.

   ![Proof Of Existence Component](/media/images/docs/tutorials/custom-pallet/poe-component.png)

   Clicking **Create Claim** calls the `create_claim` function in the custom proof-of-existence pallet.
   The front-end component displays the file digest, account identifier, and block number for the completed transaction.

1. Verify the claim is successful and a new `claimCreated` event appears in the Events component.

   ![Claimed File](/media/images/docs/tutorials/custom-pallet/poe-claimed.png)

   The front-end component recognizes that the file is now claimed, and gives you the option to revoke the claim.

   Remember, only the owner can revoke the claim. If you select another user account, the revoke option is disabled.

## Next steps

In this tutorial, you learned the basics of how to create a new custom pallet, including:

- How to add events, errors, storage, and callable functions to a custom pallet.

- How to integrate the custom pallet into the runtime.

- How to compile and start a node that includes your custom pallet.

- How you can add a React front-end component to expose the custom pallet to users.

This tutorial covered the basics without diving too deeply into the code.
However, there's much more you can do as you work toward building your own fully-customized blockchain.
Custom pallets enable you to expose the features you want your blockchain to support.

To learn more about what's possible by creating custom pallets, explore the
FRAME documentation and the [how-to guides](/reference/how-to-guides).
