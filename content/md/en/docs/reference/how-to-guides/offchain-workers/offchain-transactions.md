---
title: Make offchain transactions
description:
keywords:
  - offchain worker
  - ocw
  - transactions
---

This guide will teach you how to save data that has been handled by an offchain worker using signed and unsigned transactions.

You cannot save data processed by offchain workers directly to on-chain storage.
To store any data from an offchain worker on-chain, you must create a transaction that sends the data from the offchain worker to the on-chain storage system.
You can create transactions that send data from offchain workers to on-chain storage as signed transactions or unsigned transactions depending on how you want the transaction calling account to be handled.
For example:

- Use **signed transactions** if you want to record the associated transaction caller and deduct the transaction fee from the caller account.
- Use **unsigned transactions** if you **DO NOT** want to record the associated transaction caller.
- Use **unsigned transactions with signed payload** if you want to record the associated transaction caller, but do not want the caller be responsible for the transaction fee payment.

## Sending signed transactions

1. In your pallet, call the hook for offchain workers as follows:

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

1. Add the [`CreateSignedTransaction` trait](https://paritytech.github.io/substrate/master/frame_system/offchain/trait.CreateSignedTransaction.html) to the Config trait for your pallet.
   For example, your pallet `Config` trait should look similar to this:

   ```rust
   /// This pallet's configuration trait
   #[pallet::config]
   pub trait Config: CreateSignedTransaction<Call<Self>> + frame_system::Config {
   	// ...
   }
   ```

1. Add a `crypto` module with an sr25519 signature key to ensure that your pallet owns an account that can be used for signing transactions.

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

   The [`app_crypto` macro](https://paritytech.github.io/substrate/master/sp_application_crypto/macro.app_crypto.html) declares an account with an sr25519 signature that is identified by `KEY_TYPE`.
   Note that this doesn't create a new account.
   The macro simply declares that a crypto account is available for this pallet.
   You will need to initialize this account in the next step.

1. Initialize a signing account for sending a signed transaction to on-chain storage.

   ```rust
   fn offchain_worker(block_number: T::BlockNumber) {
   	let signer = Signer::<T, T::AuthorityId>::all_accounts();

   	// ...
   }
   ```

   Call `Signer<T, C>::all_accounts()` to retrieve all signers this pallet owned. You will later (in step #9) inject one account into this pallet for this retrieval.

1. Use `send_signed_transaction()` to send an extrinsic call:

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
   		RuntimeCall::on_chain_call { key: val }
   	});

   	// ...
   }
   ```

1. Check if the transaction is successfully submitted on-chain and perform proper error handling by checking the returned `results`.

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

## Give you pallet the ability to make transactions

1. Implement the `CreateSignedTransaction` trait in the runtime.

   Because you configured the `Config` trait for this pallet to implement the `CreateSignedTransaction` trait, you also need to implement that trait for the runtime.

   By looking at [`CreateSignedTransaction` Rust docs](https://paritytech.github.io/substrate/master/frame_system/offchain/trait.CreateSignedTransaction.html), you can see that you only need to implement the function `create_transaction()` for the runtime.
   In `runtime/src/lib.rs`:

   ```rust
   impl<LocalCall> frame_system::offchain::CreateSignedTransaction<LocalCall> for Runtime
   where
   	Call: From<LocalCall>,
   {
   	fn create_transaction<C: frame_system::offchain::AppCrypto<Self::Public, Self::Signature>>(
   		call: RuntimeCall,
   		public: <Signature as sp_runtime::traits::Verify>::Signer,
   		account: AccountId,
   		index: Index,
   	) -> Option<(RuntimeCall, <UncheckedExtrinsic as sp_runtime::traits::Extrinsic>::SignaturePayload)> {
   		let period = BlockHashCount::get() as u64;
   		let current_block = System::block_number()
   			.saturated_into::<u64>()
   			.saturating_sub(1);
   		let tip = 0;
   		let extra: SignedExtra = (
   			frame_system::CheckSpecVersion::<Runtime>::new(),
   			frame_system::CheckTxVersion::<Runtime>::new(),
   			frame_system::CheckGenesis::<Runtime>::new(),
   			frame_system::CheckEra::<Runtime>::from(generic::Era::mortal(period, current_block)),
   			frame_system::CheckNonce::<Runtime>::from(index),
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
   		Some((call, (sp_runtime::MultiAddress::Id(address), signature.into(), extra)))
   	}
   }
   ```

   The above code seems long, but what it tries to do is really:

   - Create and prepare `extra` of `SignedExtra` type, and put various checkers in-place.
   - Create a raw payload based on the passed in `call` and `extra`.
   - Sign the raw payload with the account public key.
   - Finally, bundle all data up and return a tuple of the call, the caller, its signature, and any signed extension data.

   You can see a full example of the code in the [**Substrate** code base](https://github.com/paritytech/substrate/blob/polkadot-v0.9.28/bin/node/runtime/src/lib.rs).

1. Implement `SigningTypes` and `SendTransactionTypes` in the runtime to support submitting transactions, whether they are signed or unsigned.

   ```rust
   impl frame_system::offchain::SigningTypes for Runtime {
   	type Public = <Signature as sp_runtime::traits::Verify>::Signer;
   	type Signature = Signature;
   }

   impl<C> frame_system::offchain::SendTransactionTypes<C> for Runtime
   where
   	Call: From<C>,
   {
   	type OverarchingCall = Call;
   	type Extrinsic = UncheckedExtrinsic;
   }
   ```

   You can see an example of this implementation in the [**Substrate** code base](https://github.com/paritytech/substrate/blob/polkadot-v0.9.28/bin/node/runtime/src/lib.rs#L1103-L1114).

1. Inject an account for this pallet to own.
   In a development environment (node running with `--dev` flag), this account key is inserted in the `node/src/service.rs` file as follows:

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

   Refer to [this file](https://github.com/jimmychu0807/substrate-offchain-worker-demo/blob/v2.0.0/node/src/service.rs#L87-L105) for a working example.
   This example adds the key for the `Alice` account to the key store identified by the pallet-defined `KEY_TYPE`.
   In production, one or more accounts are injected via chain spec configuration.

Now, your pallet is ready to send signed transactions on-chain from offchain workers.

## Sending unsigned transactions

By default, all unsigned transactions are rejected in Substrate.
To enable Substrate to accept certain unsigned transactions, you must implement the `ValidateUnsigned` trait for the pallet.

1. Open the `src/lib.rs` file for your pallet in a text editor.

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

   Call the [`validate_unsigned` pallet macro](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#validate-unsigned-palletvalidate_unsigned-optional), then implement the trait as follows:

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

   Next, check the calling extrinsics to determine if the call is allowed.
   Return `ValidTransaction` if the call is allowed or return `TransactionValidityError` if the call is not allowed.

   ```rust
   fn validate_unsigned(source: TransactionSource, call: &Self::Call) -> TransactionValidity {
   	// ...
   	match call {
   		RuntimeCall::extrinsic1 { key: value } => valid_tx(b"extrinsic1".to_vec()),
   		_ => InvalidTransaction::Call.into(),
   	}
   }
   ```

   In this example, users can call the on-chain `extrinsic1` function without a signature, but not any other extrinsics.

   To see a full example of how `ValidateUnsigned` is implemented in a pallet, refer to [`pallet-example-offchain-worker` in **Substrate**](https://github.com/paritytech/substrate/blob/polkadot-v0.9.28/frame/examples/offchain-worker/src/lib.rs#L301-L329).

1. In the offchain worker function, you can send unsigned transactions as follows:

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
   		OcwPallet: pallet_ocw::{Pallet, RuntimeCall, Storage, Event<T>, ValidateUnsigned},
   	}
   );
   ```

1. Implement the `SendTransactionTypes` trait for the runtime as described in [sending signed transactions](#sending-signed-transactions).

   You can see a full example in [`pallet-example-offchain-worker` in **Substrate** code base](https://github.com/paritytech/substrate/blob/polkadot-v0.9.28/frame/examples/offchain-worker).

## Sending unsigned transactions with signed payloads

Sending unsigned transactions with signed payloads is similar to sending unsigned transactions.
You need to:

- Implement the `ValidateUnsigned` trait for the pallet.
- Add the `ValidateUnsigned` type to the runtime when using this pallet.
- Prepare the data structure to be signed—the signed payload—by implementing the [`SignedPayload` trait](https://paritytech.github.io/substrate/master/frame_system/offchain/trait.SignedPayload.html).
- Send the transaction with the signed payload.

You can refer to the section on [sending unsigned transactions](#sending-unsigned-transactions) for more information about implementing the `ValidateUnsigned` trait and adding the `ValidateUnsigned` type to the runtime.
The differences between sending unsigned transactions and sending unsigned transactions with signed payload are illustrated in the following code examples.

1. To make your data structure signable, implement the [`SignedPayload` trait](https://paritytech.github.io/substrate/master/frame_system/offchain/trait.SignedPayload.html).

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

   You can also see an example [here](https://github.com/paritytech/substrate/blob/polkadot-v0.9.28/frame/examples/offchain-worker/src/lib.rs#L348-L361).

1. In your pallet's `offchain_worker` function, call the signer, then the function to send the transaction:

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

1. For a more complex implementation of `ValidateUnsigned`, check whether a provided signature matches the public key used to sign the payload:

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

Refer to the [offchain function call](https://github.com/paritytech/substrate/blob/polkadot-v0.9.28/frame/examples/offchain-worker/src/lib.rs#L508-L536) and [the implementation of `ValidateUnsigned`](https://github.com/paritytech/substrate/blob/polkadot-v0.9.28/frame/examples/offchain-worker/src/lib.rs#L305-L329) for a working example of the above.

You have now seen how you can use offchain workers to send data for on-chain storage using:

- Signed transactions
- Unsigned transactions
- Unsigned transactions with signed payload

## Examples

- [Substrate Offchain Worker Example Pallet](https://github.com/paritytech/substrate/tree/polkadot-v0.9.28/frame/examples/offchain-worker)
- [OCW Pallet in Substrate Offchain Worker Demo](https://github.com/jimmychu0807/substrate-offchain-worker-demo/tree/v2.0.0/pallets/ocw)

## Related material

- [Off-chain features](/fundamentals/offchain-operations/)
