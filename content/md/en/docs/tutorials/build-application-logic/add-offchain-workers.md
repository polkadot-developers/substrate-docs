---
title: Add offchain workers
description: Illustrates how to modify a pallet to include an offchain worker and how to submit transactions from an offchain worker to update the on-chain state.
keywords:
  - offchain worker
  - ocw
  - transactions
  - offchain data
  - signed transaction
  - unsigned transactions
  - signed payload
---

<div class="warning">
	<p>
	<strong>⚠️ WARNING:</strong> This page contains potentially outdated information. Reading it might still be useful, yet we suggest taking it with a grain of salt.
	</p>
	<p>
	 Please refer to the <a href="https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/reference_docs/frame_offchain_workers/index.html">`polkadot-sdk-docs` crate</a> for the most up-to-date documentation on this topic.
	</p>
</div>

This tutorial illustrates how to modify a pallet to include an offchain worker and configure the pallet and runtime to enable the offchain worker to submit transactions that update the on-chain state.

## Using offchain workers

If you use offchain workers to perform long-running computations or fetch data from offline sources, it's likely that you'll want to store the results of those operations on-chain.
However, offchain storage is separate from on-chain resources and you can't save data processed by offchain workers directly to on-chain storage.
To store any data processed by offchain workers as part of the on-chain state, you must create transactions to send the data from the offchain worker storage to the on-chain storage system.

This tutorial illustrates how to create offchain workers with the ability to send signed or unsigned transactions to store offchain data on-chain.
In general, signed transactions are more secure, but require the calling account to handle transaction fees.
For example:

- Use **signed transactions** if you want to record the associated transaction caller account and deduct the transaction fee from the caller account.
- Use **unsigned transactions with signed payload** if you want to record the associated transaction caller, but do not want the caller be responsible for the transaction fee payment.

## Working with unsigned transactions

It's also possible to submit **unsigned transactions** without a signed payload—for example, because you don't want to record the associated transaction caller at all.
However, there's significant risk in allowing unsigned transactions to modify the chain state.
Unsigned transactions represent a potential attack vector that a malicious user could exploit.
If you are going to allow offchain workers to send unsigned transactions, you should include logic that ensures the transaction is authorized.
For an example of how unsigned transactions can be verified using on-chain state, see the `ValidateUnsigned` implementation in the [`enact_authorized_upgrade`](https://github.com/paritytech/polkadot-sdk/blob/master/cumulus/pallets/parachain-system/src/lib.rs) call.
In that example, the call validates the unsigned transaction by verifying that the given code hash was previously authorized.

It is also important to consider that even an unsigned transaction with a signed payload could be exploited because offchain workers can't be assumed to be a reliable source unless you implement strict logic to check the validity of the transaction.
In most cases, checking whether a transaction was submitted by an offchain worker before writing to storage isn't sufficient to protect the network.
Instead of assuming that the offchain worker can be trusted without safeguards, you should intentionally set restrictive permissions that limit access to the process and what it can do.

Remember that unsigned transactions are essentially an **open door** into your runtime.
You should only use them after careful consideration of the conditions under which they should be allowed to execute.
Without safeguards, malicious actors could impersonate offchain workers and access runtime storage.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have completed the [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/) tutorial and have the Substrate node template from the Developer Hub installed locally.

- You are familiar with how to use FRAME macros and edit the logic for a pallet.

- You are familiar with how to modify the configuration trait for a pallet in the runtime.

## Tutorial objectives

By completing this tutorial, you will be able to:

- Identify the risks involved in using unsigned transactions.
- Add an offchain worker function to a pallet.
- Configure the pallet and the runtime to enable the offchain worker to submit signed transactions.
- Configure the pallet and the runtime to enable the offchain worker to submit unsigned transactions.
- Configure the pallet and the runtime to enable the offchain worker to submit unsigned transactions with a signed payload.

## Signed transactions

To submit signed transactions, you must configure your pallet and the runtime to enable at least one account for offchain workers to use.
At a high level, configuring a pallet to use an office chain worker and submit signed transactions involves the following steps:

- [Configure the offchain worker in the pallet](#configure-the-offchain-worker-in-the-pallet).
- [Implement the pallet and required traits in the runtime](#implement-the-pallet-in-the-runtime).
- [Add an account for signing transactions](#add-an-account-for-signing-transactions).

### Configure the offchain worker in the pallet

To enable offchain workers to send signed transactions:

1. Open the `src/lib.rs` file for your pallet in a text editor.
2. Add the `#[pallet::hooks]` macro and the entry point for offchain workers to the code.

   For example:

   ```rust
   #[pallet::hooks]
   impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
   	/// Offchain worker entry point.
   	///
   	/// By implementing `fn offchain_worker` you declare a new offchain worker.
   	/// This function will be called when the node is fully synced and a new best block is
   	/// successfully imported.
   	/// Note that it's not guaranteed for offchain workers to run on EVERY block, there might
   	/// be cases where some blocks are skipped, or for some the worker runs twice (re-orgs),
   	/// so the code should be able to handle that.
   	fn offchain_worker(block_number: T::BlockNumber) {
   		log::info!("Hello from pallet-ocw.");
   		// The entry point of your code called by offchain worker
   	}
   	// ...
   }
   ```

3. Add the logic for the `offchain_worker` function.
4. Add [`CreateSignedTransaction`](https://paritytech.github.io/substrate/master/frame_system/offchain/trait.CreateSignedTransaction.html) to the `Config` trait for your pallet.
   For example, your pallet `Config` trait should look similar to this:

   ```rust
   /// This pallet's configuration trait
   #[pallet::config]
   pub trait Config: CreateSignedTransaction<Call<Self>> + frame_system::Config {
   	// ...
   }
   ```

5. Add an `AuthorityId` type to the pallet `Config` trait:

   ```rust
   #[pallet::config]
   pub trait Config: CreateSignedTransaction<Call<Self>> + frame_system::Config {
   	// ...
   type AuthorityId: AppCrypto<Self::Public, Self::Signature>;
   }
   ```

6. Add a `crypto` module with an `sr25519` signature key to ensure that your pallet owns an account that can be used for signing transactions.

   ```rust
   use sp_core::{crypto::KeyTypeId};

   // ...

   pub const KEY_TYPE: KeyTypeId = KeyTypeId(*b"demo");

   // ...

   pub mod crypto {
   	use super::KEY_TYPE;
   	use sp_core::sr25519::Signature as Sr25519Signature;
   	use sp_runtime::{
   		app_crypto::{app_crypto, sr25519},
   		traits::Verify, MultiSignature, MultiSigner
   	};
   	app_crypto!(sr25519, KEY_TYPE);

   	pub struct TestAuthId;

   	// implemented for runtime
   	impl frame_system::offchain::AppCrypto<MultiSigner, MultiSignature> for TestAuthId {
   	type RuntimeAppPublic = Public;
   	type GenericSignature = sp_core::sr25519::Signature;
   	type GenericPublic = sp_core::sr25519::Public;
   	}
   }
   ```

   The [`app_crypto` macro](https://paritytech.github.io/substrate/master/sp_application_crypto/macro.app_crypto.html) declares an account with an `sr25519` signature that is identified by `KEY_TYPE`.
	 In this example, the `KEY_TYPE` is `demo`.
   Note that this macro doesn't create a new account.
   The macro simply declares that a `crypto` account is available for this pallet to use.

7. Initialize an account for the offchain worker to use to send a signed transaction to on-chain storage.

   ```rust
   fn offchain_worker(block_number: T::BlockNumber) {
   	let signer = Signer::<T, T::AuthorityId>::all_accounts();

   	// ...
   }
   ```

   This code enables you to retrieve all signers that this pallet owns.

8. Use `send_signed_transaction()` to create a signed transaction call:

   ```rust
   fn offchain_worker(block_number: T::BlockNumber) {
   	let signer = Signer::<T, T::AuthorityId>::all_accounts();

   	// Using `send_signed_transaction` associated type we create and submit a transaction
   	// representing the call we've just created.
   	// `send_signed_transaction()` return type is `Option<(Account<T>, Result<(), ()>)>`. It is:
   	//	 - `None`: no account is available for sending transaction
   	//	 - `Some((account, Ok(())))`: transaction is successfully sent
   	//	 - `Some((account, Err(())))`: error occurred when sending the transaction
   	let results = signer.send_signed_transaction(|_account| {
   		Call::on_chain_call { key: val }
   	});

   	// ...
   }
   ```

9. Check if the transaction is successfully submitted on-chain and perform proper error handling by checking the returned `results`.

   ```rust
   fn offchain_worker(block_number: T::BlockNumber) {
   	// ...

   	for (acc, res) in &results {
   		match res {
   			Ok(()) => log::info!("[{:?}]: submit transaction success.", acc.id),
   			Err(e) => log::error!("[{:?}]: submit transaction failure. Reason: {:?}", acc.id, e),
   		}
   	}

   	Ok(())
   }
   ```

### Implement the pallet in the runtime

1. Open the `runtime/src/lib.rs` file for the node template in a text editor.

1. Add the `AuthorityId` to the configuration for your pallet and make sure it uses the `TestAuthId` from the `crypto` module:

	 ```rust
   impl pallet_your_ocw_pallet::Config for Runtime {
	   // ...
	   type AuthorityId = pallet_your_ocw_pallet::crypto::TestAuthId;
   }
   ```

1. Implement the `CreateSignedTransaction` trait in the runtime.

   Because you configured your pallet to implement the `CreateSignedTransaction` trait, you also need to implement that trait for the runtime.

   By looking at [`CreateSignedTransaction`](https://paritytech.github.io/substrate/master/frame_system/offchain/trait.CreateSignedTransaction.html), you can see that you only need to implement the function `create_transaction()` for the runtime.
   For example:

   ```rust
   use codec::Encode;
   use sp_runtime::{generic::Era, SaturatedConversion};

   // ...

   impl<LocalCall> frame_system::offchain::CreateSignedTransaction<LocalCall> for Runtime
   where
	    RuntimeCall: From<LocalCall>,
   {
	    fn create_transaction<C: frame_system::offchain::AppCrypto<Self::Public, Self::Signature>>(
   		   call: RuntimeCall,
	       public: <Signature as Verify>::Signer,
		     account: AccountId,
		     nonce: Nonce,
	     ) -> Option<(RuntimeCall, <UncheckedExtrinsic as traits::Extrinsic>::SignaturePayload)> {
		     let tip = 0;
		     // take the biggest period possible.
		     let period =
			      BlockHashCount::get().checked_next_power_of_two().map(|c| c / 2).unwrap_or(2) as u64;
		     let current_block = System::block_number()
			      .saturated_into::<u64>()
			      // The `System::block_number` is initialized with `n+1`,
			      // so the actual block number is `n`.
			      .saturating_sub(1);
		     let era = Era::mortal(period, current_block);
		     let extra = (
			      frame_system::CheckNonZeroSender::<Runtime>::new(),
			      frame_system::CheckSpecVersion::<Runtime>::new(),
			      frame_system::CheckTxVersion::<Runtime>::new(),
			      frame_system::CheckGenesis::<Runtime>::new(),
			      frame_system::CheckEra::<Runtime>::from(era),
			      frame_system::CheckNonce::<Runtime>::from(nonce),
			      frame_system::CheckWeight::<Runtime>::new(),
			      pallet_transaction_payment::ChargeTransactionPayment::<Runtime>::from(tip),
		     );
		     let raw_payload = SignedPayload::new(call, extra)
			      .map_err(|e| {
				       log::warn!("Unable to create signed payload: {:?}", e);
			      })
			      .ok()?;
		     let signature = raw_payload.using_encoded(|payload| C::sign(payload, public))?;
		     let address = account;
		     let (call, extra, _) = raw_payload.deconstruct();
		     Some((call, (sp_runtime::MultiAddress::Id(address), signature, extra)))
	   }
   }
   ```

   This code snippet is long, but, in essence, it illustrates the following main steps:

   - Create and prepare `extra` of `SignedExtra` type, and put various checkers in place.
   - Create a raw payload based on the passed in `call` and `extra`.
   - Sign the raw payload with the account public key.
   - Bundle all data up and return a tuple of the call, the caller, its signature, and any signed extension data.

   You can see an example of this code in the [Substrate code base](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/bin/node/runtime/src/lib.rs#L1239-L1279).

2. Implement `SigningTypes` and `SendTransactionTypes` in the runtime to support submitting transactions, whether they are signed or unsigned.

   ```rust
   impl frame_system::offchain::SigningTypes for Runtime {
        type Public = <Signature as traits::Verify>::Signer;
        type Signature = Signature;
   }

   impl<C> frame_system::offchain::SendTransactionTypes<C> for Runtime
   where
        RuntimeCall: From<C>,
   {
        type Extrinsic = UncheckedExtrinsic;
        type OverarchingCall = RuntimeCall;
   }
   ```

   You can see an example of this implementation in the [Substrate code base](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/bin/node/runtime/src/lib.rs#L1280-L1292).

### Add an account for signing transactions

At this point, you have prepared your pallet to use offchain workers.
Preparing the pallet involved the following steps:

- Adding the `offchain_worker` function and related logic for sending signed transactions.
- Adding `CreateSignedTransaction` and `AuthorityId` to the `Config` trait for your pallet.
- Adding the `crypto` module to describe the account the pallet will use to sign transaction.

You have also updated the runtime with the code to support offchain workers and sending signed transactions.
Updating the runtime involved the following steps:

- Adding the `AuthorityId` to the runtime configuration for your pallet.
- Implementing the `CreateSignedTransaction` trait and `create_transaction()` function.
- Implementing `SigningTypes` and `SendTransactionTypes` for offchain workers from the `frame_system` pallet.

However, before your pallet offchain workers can submit signed transactions, you must specify at least one account for the offchain worker to use.
To enable the offchain worker to sign transactions, you must generate the account key for the pallet to own and add that key to the node keystore.

There are several ways to accomplish this final step and the method you choose might vary depending on whether you are running a node in development mode for testing, using a custom chain specification, or deploying into a production environment.

### Using a development account

If you are running a node in development mode—with `--dev` command-line option—you can manually generate and insert the account key for a development account by modifying the `node/src/service.rs` file as follows:

```rust
pub fn new_partial(config: &Configuration) -> Result <SomeStruct, SomeError> {

//...

  if config.offchain_worker.enabled {
  // Initialize seed for signing transaction using offchain workers. This is a convenience
  // so learners can see the transactions submitted simply running the node.
  // Typically these keys should be inserted with RPC calls to `author_insertKey`.
   	sp_keystore::SyncCryptoStore::sr25519_generate_new(
   		&*keystore,
   		node_template_runtime::pallet_your_ocw_pallet::KEY_TYPE,
   		Some("//Alice"),
   	).expect("Creating key with account Alice should succeed.");
   	}
}
```

This example manually adds the key for the `Alice` account to the keystore identified by the `KEY_TYPE` defined in your pallet.
For a working example, see this sample [service.rs](https://github.com/jimmychu0807/substrate-offchain-worker-demo/blob/v2.0.0/node/src/service.rs#L87-L105) file.

### Using other accounts

In a production environment, you can use other tools—such as `subkey`—to generate keys that are specifically for offchain workers to use.
After you generate one or more keys for offchain workers to own, you can add them to the node keystore by:

- Modifying the configuration of your chain specification file.
- Passing parameters using the `author_insertKey` RPC method.

For example, you can use the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/rpc), Polkadot-JS API, or a `curl` command to select the `author_insertKey` method and specify the key type, secret phrase, and public key parameters for the account to use:

![Use the `author_insertKey` method to insert an account](/media/images/docs/author_insertKey.png)

Note that the keyType parameter `demo` in this example matches the `KEY_TYPE` declared in the offchain worker pallet.

Now, your pallet is ready to send signed transactions on-chain from offchain workers.

## Unsigned transactions

By default, all unsigned transactions are rejected in Substrate.
To enable Substrate to accept certain unsigned transactions, you must implement the `ValidateUnsigned` trait for the pallet.

Although you must implement the `ValidateUnsigned` trait to send unsigned transactions, this check doesn't guarantee that **only** offchain workers are able to send the transaction.
You should always consider the consequences of malicious actors sending these transactions as an attempt to tamper with the state of your chain.
Unsigned transactions always represent a potential attack vector that a malicious user could exploit and offchain workers can't be assumed to be a reliable source without additional safeguards.

You should never assume that unsigned transactions can only be submitted by an offchain worker.
By definition, **anyone** can submit them.

### Configure the pallet

To enable offchain workers to send unsigned transactions:

1. Open the `src/lib.rs` file for your pallet in a text editor.
2. Add the [`validate_unsigned`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#validate-unsigned-palletvalidate_unsigned-optional) macro.

	 For example:

   ```rust
   #[pallet::validate_unsigned]
   impl<T: Config> ValidateUnsigned for Pallet<T> {
   	type Call = Call<T>;

   		/// Validate unsigned call to this module.
   		///
   		/// By default unsigned transactions are disallowed, but implementing the validator
   		/// here we make sure that some particular calls (the ones produced by offchain worker)
   		/// are being whitelisted and marked as valid.
   		fn validate_unsigned(source: TransactionSource, call: &Self::Call) -> TransactionValidity {
   		//...
   		}
   }
   ```

1. Implement the trait as follows:

   ```rust
   fn validate_unsigned(source: TransactionSource, call: &Self::Call) -> TransactionValidity {
   	let valid_tx = |provide| ValidTransaction::with_tag_prefix("my-pallet")
   		.priority(UNSIGNED_TXS_PRIORITY) // please define `UNSIGNED_TXS_PRIORITY` before this line
   		.and_provides([&provide])
   		.longevity(3)
   		.propagate(true)
   		.build();
   	// ...
   }
   ```

2. Check the calling extrinsics to determine if the call is allowed and return `ValidTransaction` if the call is allowed or `TransactionValidityError` if the call is not allowed.

	 For example:

   ```rust
   fn validate_unsigned(source: TransactionSource, call: &Self::Call) -> TransactionValidity {
   	// ...
   	match call {
   		RuntimeCall::my_unsigned_tx { key: value } => valid_tx(b"my_unsigned_tx".to_vec()),
   		_ => InvalidTransaction::Call.into(),
   	}
   }
   ```

   In this example, users can only call the specific `my_unsigned_tx` function without a signature.
	 If there are other functions, calling them would require a signed transaction.

	 For an example of how `ValidateUnsigned` is implemented in a pallet, see the code for the [offchain-worker](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/examples/offchain-worker/src/lib.rs#L301-L329).

3. Add the `#[pallet::hooks]` macro and the `offchain_worker` function to send unsigned transactions as follows:

   ```rust
   #[pallet::hooks]
   impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
   	/// Offchain worker entry point.
   	fn offchain_worker(block_number: T::BlockNumber) {
   		let value: u64 = 10;
   		// This is your call to on-chain extrinsic together with any necessary parameters.
   		let call = RuntimeCall::unsigned_extrinsic1 { key: value };

   		// `submit_unsigned_transaction` returns a type of `Result<(), ()>`
   		//	 ref: https://paritytech.github.io/substrate/master/frame_system/offchain/struct.SubmitTransaction.html
   		SubmitTransaction::<T, Call<T>>::submit_unsigned_transaction(call.into())
   			.map_err(|_| {
   			log::error!("Failed in offchain_unsigned_tx");
   		});
   	}
   }
   ```

   This code prepares the call in the `let call = ...` line, submits the transaction using [`SubmitTransaction::submit_unsigned_transaction`](https://paritytech.github.io/substrate/master/frame_system/offchain/struct.SubmitTransaction.html), and performs any necessary error handling in the callback function passed in.

### Configure the runtime

1. Enable the `ValidateUnsigned` trait for the pallet in the runtime by adding the `ValidateUnsigned` type to the `construct_runtime` macro.

   For example:

   ```rust
   construct_runtime!(
   	pub enum Runtime where
   		Block = Block,
   		NodeBlock = opaque::Block,
   		UncheckedExtrinsic = UncheckedExtrinsic
   	{
   		// ...
   		OcwPallet: pallet_ocw::{Pallet, Call, Storage, Event<T>, ValidateUnsigned},
   	}
   );
   ```

1. Implement the `SendTransactionTypes` trait for the runtime as described in [sending signed transactions](#sending-signed-transactions).

   For a full example, see the [offchain-worker](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/examples/offchain-worker examples pallet.

## Signed payloads

Sending unsigned transactions with signed payloads is similar to sending unsigned transactions.
You need to:

- Implement the `ValidateUnsigned` trait for the pallet.
- Add the `ValidateUnsigned` type to the runtime when using this pallet.
- Prepare the data structure to be signed—the signed payload—by implementing the [`SignedPayload`](https://paritytech.github.io/substrate/master/frame_system/offchain/trait.SignedPayload.html) trait.
- Send the transaction with the signed payload.

You can refer to the section on [sending unsigned transactions](#sending-unsigned-transactions) for more information about implementing the `ValidateUnsigned` trait and adding the `ValidateUnsigned` type to the runtime.

Keep in mind that unsigned transactions always represent a potential attack vector and that offchain workers can't be assumed to be a reliable source without additional safeguards.
In most cases, you should implement restrictive permissions or additional logic to verify the transaction submitted by an offchain worker is valid.

The differences between sending unsigned transactions and sending unsigned transactions with signed payload are illustrated in the following code examples.

To make your data structure signable:

1. Implement [`SignedPayload`](https://paritytech.github.io/substrate/master/frame_system/offchain/trait.SignedPayload.html).

   For example:

   ```rust
   #[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug, scale_info::TypeInfo)]
   pub struct Payload<Public> {
   	number: u64,
   	public: Public,
   }

   impl<T: SigningTypes> SignedPayload<T> for Payload<T::Public> {
   	fn public(&self) -> T::Public {
   	self.public.clone()
   }
   }
   ```

  For an example of a signed payload, see the code for the [offchain-worker](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/examples/offchain-worker/src/lib.rs#L348-L361).

1. In the `offchain_worker` function, call the signer, then the function to send the transaction:

   ```rust
   #[pallet::hooks]
   impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
   	/// Offchain worker entry point.
   	fn offchain_worker(block_number: T::BlockNumber) {
   		let value: u64 = 10;

   		// Retrieve the signer to sign the payload
   		let signer = Signer::<T, T::AuthorityId>::any_account();

   		// `send_unsigned_transaction` is returning a type of `Option<(Account<T>, Result<(), ()>)>`.
   		//	 The returned result means:
   		//	 - `None`: no account is available for sending transaction
   		//	 - `Some((account, Ok(())))`: transaction is successfully sent
   		//	 - `Some((account, Err(())))`: error occurred when sending the transaction
   		if let Some((_, res)) = signer.send_unsigned_transaction(
   			// this line is to prepare and return payload
   			|acct| Payload { number, public: acct.public.clone() },
   			|payload, signature| RuntimeCall::some_extrinsics { payload, signature },
   		) {
   			match res {
   				Ok(()) => log::info!("unsigned tx with signed payload successfully sent.");
   				Err(()) => log::error!("sending unsigned tx with signed payload failed.");
   			};
   		} else {
   			// The case of `None`: no account is available for sending
   			log::error!("No local account available");
   		}
   	}
   }
   ```

   This code retrieves the `signer` then calls `send_unsigned_transaction()` with two function closures.
   The first function closure returns the payload to be used.
   The second function closure returns the on-chain call with payload and signature passed in.
   This call returns an `Option<(Account<T>, Result<(), ()>)>` result type to allow for the following results:

   - `None` if no account is available for sending the transaction.
   - `Some((account, Ok(())))` if the transaction is successfully sent.
   - `Some((account, Err(())))` if an error occurs when sending the transaction.

2. Check whether a provided signature matches the public key used to sign the payload:

   ```rust
   #[pallet::validate_unsigned]
   impl<T: Config> ValidateUnsigned for Pallet<T> {
   	type Call = Call<T>;

   	fn validate_unsigned(_source: TransactionSource, call: &Self::Call) -> TransactionValidity {
   		let valid_tx = |provide| ValidTransaction::with_tag_prefix("ocw-demo")
   			.priority(UNSIGNED_TXS_PRIORITY)
   			.and_provides([&provide])
   			.longevity(3)
   			.propagate(true)
   			.build();

   		match call {
   			RuntimeCall::unsigned_extrinsic_with_signed_payload {
   			ref payload,
   			ref signature
   			} => {
   			if !SignedPayload::<T>::verify::<T::AuthorityId>(payload, signature.clone()) {
   				return InvalidTransaction::BadProof.into();
   			}
   			valid_tx(b"unsigned_extrinsic_with_signed_payload".to_vec())
   			},
   			_ => InvalidTransaction::Call.into(),
   		}
   	}
   }
   ```

   This example uses [`SignedPayload`](https://paritytech.github.io/substrate/master/frame_system/offchain/trait.SignedPayload.html) to verify that the public key in the payload has the same signature as the one provided.
	 However, you should note that the code in the example only checks whether the provided `signature` is valid for the `public` key contained inside `payload`.
	 This check doesn't validate whether the signer is an offchain worker or authorized to call the specified function.
	 This simple check wouldn't prevent an unauthorized actor from using the signed payload to modify state.

	 For working examples of this code, see the [offchain function call](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/examples/offchain-worker/src/lib.rs#L508-L536) and the implementation of [`ValidateUnsigned`](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/examples/offchain-worker/src/lib.rs#L305-L329).

## Where to go next

This tutorial provides simple examples of how you can use offchain workers to send transactions for on-chain storage.
To learn more, explore the following resources:

- [Offchain operations](/learn/offchain-operations/)
- [Offchain worker example](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/examples/offchain-worker)
- [Offchain worker demo](https://github.com/jimmychu0807/substrate-offchain-worker-demo/tree/v2.0.0/pallets/ocw)
