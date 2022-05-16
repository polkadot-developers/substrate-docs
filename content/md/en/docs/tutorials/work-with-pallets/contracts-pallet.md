---
title: Configure the contracts pallet
description: Configure the Substrate runtime to prepare for writing smart contracts.
---

If you completed the [Build a local blockchain](/tutorials/get-started/build-local-chain) tutorial, you already know that the Substrate [node template](https://github.com/substrate-developer-hub/substrate-node-template) provides a working runtime that includes some **pallets** to get you started.
In [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet/), you learned the basic common steps for adding a new pallet to the runtime.
However, each pallet requires you to configure specific parameters and types.
To see what that entails, this tutorial demonstrates adding a more complex pallet to the runtime.
In this tutorial, you'll add the [Contracts pallet](/rustdocs/latest/pallet_contracts/) so that you can support smart contract development for your blockchain.

If you completed the [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet/) tutorial, you'll notice some familiar patterns when adding the Contracts pallet.
This tutorial focuses less on those common patterns and more on the the settings that are specifically required to add the Contracts pallet.

## Before you begin

Before starting this tutorial, verify the following:

- You have downloaded and compiled the `latest` version of the
  [Substrate node template](https://github.com/substrate-developer-hub/substrate-node-template/tree/latest).

- You have downloaded and installed the
  [Substrate front-end template](https://github.com/substrate-developer-hub/substrate-node-template/tree/latest) as described in 
  [Buiild a local blockchain](../../tutorials/create-your-first-substrate-chain/).

## Add the pallet dependencies

Any time you add a pallet to the runtime, you need to import the appropriate crate and update the dependencies for the runtime. 
For the Contracts pallet, you need to import the `pallet-contracts` crate.

To import the `pallet-contracts` crate:

1. Open a terminal shell and change to the root directory for the node template.

1. Open the `runtime/Cargo.toml` configuration file in a text editor.

1. Import the `pallet-contracts` crate to make it available to the node template runtime by adding it to the list of dependencies.

   ```toml
   [dependencies.pallet-contracts]
   default-features = false
   git = 'https://github.com/paritytech/substrate.git'
   tag = 'latest'
   version = '4.0.0-dev'

   [dependencies.pallet-contracts-primitives]
   default-features = false
   git = 'https://github.com/paritytech/substrate.git'
   tag = 'latest'
   version = '4.0.0-dev'
   ```

1. Add the Contracts pallet to the list of `std` features so that its features are included when the runtime is built as a native Rust binary.

   ```toml
   [features]
   default = ['std']
   std = [
   	#--snip--
   	'pallet-contracts/std',
   	'pallet-contracts-primitives/std',
   	#--snip--
    ]
   ```

1. Save your changes and close the `runtime/Cargo.toml` file.

## Implement the Contracts configuration trait

Now that you have successfully imported the Contracts pallet crate, you are ready to add it to the runtime.
If you have explored other tutorials, you might already know that every pallet has a configuration trait—called `Config`—that the runtime must implement.

To see what you need to implement for the Contracts pallet, you can refer to the Rust API documentation for [`pallet_contracts::Config`](https://substrate.dev/rustdocs/latest/pallet_contracts/pallet/trait.Config.html).

To implement the `Config` trait for the Contracts pallet in the runtime:

1. Open the `runtime/src/lib.rs` file in a text editor.

1. Locate the `pub use frame_support` block and add `Nothing` to the list of traits.

   For example:

   ```rust
   pub use frame_support::{
   	construct_runtime, parameter_types,
   	traits::{KeyOwnerProofSystem, Randomness, StorageInfo, Nothing},
   	weights::{
   	constants::{BlockExecutionWeight, ExtrinsicBaseWeight, RocksDbWeight, WEIGHT_PER_SECOND},
   	IdentityFee, Weight,
   },
   StorageValue,
   };
   ```

1. Add the `WeightInfo` property to the runtime.

   For example:

   ```rust
   /* After this line */
   use pallet_transaction_payment::CurrencyAdapter;
   /*** Add this line ***/
   use pallet_contracts::weights::WeightInfo;
   ```

1. Add the constants required by the Contracts pallet to the runtime.

   For example:

   ```rust
   /* After this block */
   // Time is measured by number of blocks.
   pub const MINUTES: BlockNumber = 60_000 / (MILLISECS_PER_BLOCK as BlockNumber);
   pub const HOURS: BlockNumber = MINUTES * 60;
   pub const DAYS: BlockNumber = HOURS * 24;

   /* Add this block */
   // Contracts price units.
   pub const MILLICENTS: Balance = 1_000_000_000;
   pub const CENTS: Balance = 1_000 * MILLICENTS;
   pub const DOLLARS: Balance = 100 * CENTS;

   const fn deposit(items: u32, bytes: u32) -> Balance {
   	items as Balance * 15 * CENTS + (bytes as Balance) * 6 * CENTS
   }

   /// Assume ~10% of the block weight is consumed by `on_initialize` handlers.
   /// This is used to limit the maximal weight of a single extrinsic.
   const AVERAGE_ON_INITIALIZE_RATIO: Perbill = Perbill::from_percent(10);
   /*** End Added Block ***/
   ```

1. Add the parameter types and implementation for the Config trait to the runtime.

   For example:

   ```rust
   impl pallet_timestamp::Config for Runtime {
   /* --snip-- */
   }

   /*** Add this block ***/
   parameter_types! {
   	pub TombstoneDeposit: Balance = deposit(
   		1,
   		<pallet_contracts::Pallet<Runtime>>::contract_info_size()
   	);
   	pub DepositPerContract: Balance = TombstoneDeposit::get();
   	pub const DepositPerStorageByte: Balance = deposit(0, 1);
   	pub const DepositPerStorageItem: Balance = deposit(1, 0);
   	pub RentFraction: Perbill = Perbill::from_rational(1u32, 30 * DAYS);
   	pub const SurchargeReward: Balance = 150 * MILLICENTS;
   	pub const SignedClaimHandicap: u32 = 2;
   	pub const MaxValueSize: u32 = 16 * 1024;
   	// The lazy deletion runs inside on_initialize.
   	pub DeletionWeightLimit: Weight = AVERAGE_ON_INITIALIZE_RATIO *
   	 BlockWeights::get().max_block;
   	// The weight needed for decoding the queue should be less or equal than a fifth
   	// of the overall weight dedicated to the lazy deletion.
   	pub DeletionQueueDepth: u32 = ((DeletionWeightLimit::get() / (
   		<Runtime as pallet_contracts::Config>::WeightInfo::on_initialize_per_queue_item(1) -
   		<Runtime as pallet_contracts::Config>::WeightInfo::on_initialize_per_queue_item(0)
   	 )) / 5) as u32;

   	pub Schedule: pallet_contracts::Schedule<Runtime> = Default::default();
   }

   impl pallet_contracts::Config for Runtime {
   	type Time = Timestamp;
   	type Randomness = RandomnessCollectiveFlip;
   	type Currency = Balances;
   	type Event = Event;
   	type RentPayment = ();
   	type SignedClaimHandicap = SignedClaimHandicap;
   	type TombstoneDeposit = TombstoneDeposit;
   	type DepositPerContract = DepositPerContract;
   	type DepositPerStorageByte = DepositPerStorageByte;
   	type DepositPerStorageItem = DepositPerStorageItem;
   	type RentFraction = RentFraction;
   	type SurchargeReward = SurchargeReward;
   	type WeightPrice = pallet_transaction_payment::Module<Self>;
   	type WeightInfo = pallet_contracts::weights::SubstrateWeight<Self>;
   	type ChainExtension = ();
   	type DeletionQueueDepth = DeletionQueueDepth;
   	type DeletionWeightLimit = DeletionWeightLimit;
   	type Call = Call;
   	/// The safest default is to allow no calls at all.
   	///
   	/// Runtimes should whitelist dispatchables that are allowed to be called from contracts
   	/// and make sure they are stable. Dispatchables exposed to contracts are not allowed to
   	/// change because that would break already deployed contracts. The `Call` structure itself
   	/// is not allowed to change the indices of existing pallets, too.
   	type CallFilter = Nothing;
   	type Schedule = Schedule;
   	type CallStack = [pallet_contracts::Frame<Self>; 31];
   }
   /*** End added block ***/
   ```

   For more information about the configuration of the Contracts pallet and how the types and parameters are use, see the [Contracts pallet source code](https://github.com/paritytech/substrate/blob/master/frame/contracts/src/lib.rs).

1. Add the types exposed in the Contracts pallet to the `construct_runtime!` macro.

   For example:

   ```rust
   construct_runtime!(
   	pub enum Runtime where
   	 Block = Block,
   	 NodeBlock = opaque::Block,
   	 UncheckedExtrinsic = UncheckedExtrinsic
   	{
   	 /* --snip-- */
   	 /*** Add this ine ***/
   	 Contracts: pallet_contracts::{Pallet, Call, Storage, Event<T>},
   	}
   );
   ```

1. Save your changes and close the `runtime/src/lib.rs` file.

1. Check that your runtime compiles correctly by running the following command:

   ```bash
   cargo check -p node-template-runtime
   ```

   Although the runtime should compile, you cannot yet compile the entire node.

## Expose the Contracts API

Some pallets, including the Contracts pallet, expose custom runtime APIs and RPC endpoints.
You are not required to enable the RPC calls on the Contracts pallet to use it on chain.
However, it is useful to expose the APIs and endpoints for the Contracts pallet because doing so enables you to perform the following tasks:

- Read contract state from off chain.

- Make calls to node storage without making a transaction.

To expose the Contracts RPC API:

1. Open the `runtime/Cargo.toml` file in a text editor and add a dependencies section to import the Contracts RPC endpoints runtime API.

   For example:

   ```toml
   [dependencies.pallet-contracts-rpc-runtime-api]
   default-features = false
   git = 'https://github.com/paritytech/substrate.git'
   tag = 'latest'
   version = '4.0.0-dev'
   ```

1. Add the Contracts RPC API to the list of `std` features so that its features are included when the runtime is built as a native Rust binary.

   ```toml
   [features]
   default = ['std']
   std = [
   	#--snip--
   	'pallet-contracts-rpc-runtime-api/std',
   ]
   ```

1. Save your changes and close the `runtime/Cargo.toml` file.

1. Open the `runtime/src/lib.rs` file and implement the contracts runtime API in the
   `impl_runtime_apis!` macro near the end of the runtime `lib.rs` file.

   For example:

   ```rust
   impl_runtime_apis! {
   	/* --snip-- */
   	/*** Add this block ***/
   	impl pallet_contracts_rpc_runtime_api::ContractsApi<Block, AccountId, Balance, BlockNumber, Hash>
   	for Runtime {
   	 fn call(
   			origin: AccountId,
   			dest: AccountId,
   			value: Balance,
   			gas_limit: u64,
   			input_data: Vec<u8>,
   	 ) -> pallet_contracts_primitives::ContractExecResult {
   			let debug = true;
   			Contracts::bare_call(origin, dest, value, gas_limit, input_data, debug)
   	}

   		fn instantiate(
   			origin: AccountId,
   			endowment: Balance,
   			gas_limit: u64,
   			code: pallet_contracts_primitives::Code<Hash>,
   			data: Vec<u8>,
   			salt: Vec<u8>,
   	 ) -> pallet_contracts_primitives::ContractInstantiateResult<AccountId, BlockNumber> {
   			let compute_rent_projection = true;
   			let debug = true;
   			Contracts::bare_instantiate(origin, endowment, gas_limit, code, data, salt, compute_rent_projection, debug)
   	 }

   	 fn get_storage(
   			address: AccountId,
   			key: [u8; 32],
   	 ) -> pallet_contracts_primitives::GetStorageResult {
   			Contracts::get_storage(address, key)
   	 }

   	 fn rent_projection(
   			address: AccountId,
   	 ) -> pallet_contracts_primitives::RentProjectionResult<BlockNumber> {
   			Contracts::rent_projection(address)
   	 }
   	}
   	/*** End added block ***/
   }
   ```

1. Save your changes and close the `runtime/src/lib.rs` file.

1. Check that your runtime compiles correctly by running the following command:

   ```bash
   cargo check -p node-template-runtime
   ```

## Update the outer node

At this point, you have finished adding the Contracts pallet to the runtime. 
Now, you need to consider whether the outer node requires any corresponding updates.
For the Contracts pallet to take advantage of the RPC endpoint API, you need to add the custom RPC endpoint to the node configuration.

To add the RPC API extension to the outer node:

1. Open the `node/Cargo.toml` file and add the dependencies sections to import the Contracts and Contracts RPC crates.

   For example:

   ```toml
   [dependencies]
   jsonrpc-core = '15.1.0'
   structopt = '0.3.8'
   #--snip--
   # *** Add the following lines ***

   [dependencies.pallet-contracts]
   git = 'https://github.com/paritytech/substrate.git'
   tag = 'latest'
   version = '4.0.0-dev'

   [dependencies.pallet-contracts-rpc]
   git = 'https://github.com/paritytech/substrate.git'
   tag = 'latest'
   version = '4.0.0-dev'
   ```

   Because you have exposed the runtime API and are now working in code for the outer node, you don't need to use `no_std` configuration, so you don't have to maintain a dedicated `std` list of features.

1. Save your changes and close the `node/Cargo.toml` file.

1. Open the `node/src/rpc.rs` file in a text editor.

   Substrate provides an RPC to interact with the node. 
   However, it does not contain access to the Contracts pallet by default. 
   To interact with the Contracts pallet, you must extend the existing RPC and add the Contracts pallet and its API.

   ```rust
   use node_template_runtime::{opaque::Block, AccountId, Balance, Index, BlockNumber, Hash}; // NOTE THIS IS AN ADJUSTMENT TO AN EXISTING LINE
   use pallet_contracts_rpc::{Contracts, ContractsApi};
      /* --snip-- */

   /// Instantiate all full RPC extensions.
   pub fn create_full<C, P>(
      deps: FullDeps<C, P>,
   ) -> jsonrpc_core::IoHandler<sc_rpc::Metadata> where
      /* --snip-- */
      C: Send + Sync + 'static,
      C::Api: substrate_frame_rpc_system::AccountNonceApi<Block, AccountId, Index>,
      /*** Add This Line ***/
      C::Api: pallet_contracts_rpc::ContractsRuntimeApi<Block, AccountId, Balance, BlockNumber, Hash>,
      /* --snip-- */
   {
      /* --snip-- */
      io.extend_with(
   		TransactionPaymentApi::to_delegate(TransactionPayment::new(client.clone()))
      );
      /*** Add this block ***/
      // Contracts RPC API extension
      io.extend_with(
   		ContractsApi::to_delegate(Contracts::new(client.clone()))
      );
      /*** End added block ***/
      io
   }
   ```

1. Save your changes and close the `node/src/rpc.rs` file.

1. Check that your runtime compiles correctly by running the following command:

   ```bash
   cargo check -p node-template-runtime
   ```

If there are no errors, you are ready to compile.

1. Compile the node in release mode by running the following command:

   ```bash
   cargo build --release
   ```

## Start the local Substrate node

After your node compiles, you are ready to start the Substrate node that has been enhanced with smart contract capabilities from the [Contracts pallet](https://substrate.dev/rustdocs/latest/pallet_contracts/index.html) and interact with it using the front-end template.

To start the local node:

1. Open a terminal shell, if necessary.

1. Change to the root directory of the Substrate node template.

1. Start the node in development mode by running the following command:

   ```shell
   ./target/release/node-template --dev 
   ```

1. Verify your node is up and running successfully by reviewing the output displayed in the terminal.

   If the number after `finalized` is increasing in the console output, your blockchain is producing new blocks and reaching consensus about the state they describe.

1. Open a new terminal shell on your computer.

1. In the new terminal, change to the root directory where you installed the front-end template.

1. Start the web server for the front-end template by running the following command:

   ```bash
   yarn start
   ```

1. Open http://localhost:8000/ in a browser to view the front-end template.

1. In the Pallet Interactor component, verify that Extrinsic is selected.

1. Select `contracts` from the list of pallets available to call.

   ![View the contracts pallets](assets/tutorials/contracts-pallet.png)

## Next steps

In this tutorial, you learned:

- How to import the Contracts pallet.
- How to expose the Contracts pallet RPC endpoints API.
- How to update the outer node.
- How to verify the Contracts pallet is available in the runtime using the front-end template.

To begin using the Contracts pallet, you'll need to start writing some smart contracts to deploy. 
Explore the following topics and tutorials to learn more.

- [Custom RPCs](/main-docs/build/custom-rpc/)
- [Prepare your first contract](/tutorials/smart-contracts/first-smart-contract/)
- [Develop a smart contract](/tutorials/smart-contracts/develop-contract/)
