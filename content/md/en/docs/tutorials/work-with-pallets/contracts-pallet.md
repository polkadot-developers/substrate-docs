---
title: Configure the contracts pallet
description: Add the contracts pallet to the Substrate node template runtime to prepare for writing smart contracts.
keywords:
---

If you completed the [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) tutorial, you already know that the Substrate [node template](https://github.com/substrate-developer-hub/substrate-node-template) provides a working runtime that includes some **pallets** to get you started.
In [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet/), you learned the basic common steps for adding a new pallet to the runtime.
However, each pallet requires you to configure specific parameters and types.
To see what that entails, this tutorial demonstrates adding a more complex pallet to the runtime.
In this tutorial, you'll add the [Contracts pallet](https://paritytech.github.io/substrate/master/pallet_contracts/) so that you can support smart contract development for your blockchain.

If you completed the [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet/) tutorial, you'll notice some familiar patterns when adding the Contracts pallet.
This tutorial focuses less on those common patterns and more on the the settings that are specifically required to add the Contracts pallet.

## Before you begin

Before starting this tutorial, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have downloaded and compiled the 
  [Substrate node template](https://github.com/substrate-developer-hub/substrate-node-template as described in
  [Build a local blockchain](/tutorials/get-started/build-local-blockchain/).

- You have downloaded and installed the
  [Substrate front-end template](https://github.com/substrate-developer-hub/substrate-front-end-template) as described in
  [Build a local blockchain](/tutorials/get-started/build-local-blockchain/).

## Add the pallet dependencies

Any time you add a pallet to the runtime, you need to import the appropriate crate and update the dependencies for the runtime.
For the Contracts pallet, you need to import the `pallet-contracts` crate.

To import the `pallet-contracts` crate:

1. Open a terminal shell and change to the root directory for the node template.

1. Open the `runtime/Cargo.toml` configuration file in a text editor.

1. Locate the `[dependencies]` section and note how other pallets are imported.

1. Copy an existing pallet dependency description and replace the pallet name with `pallet-contracts` to make the pallet available to the node template runtime.

   For example, add a line similar to the following:

   ```toml
   pallet-contracts = { version = "4.0.0-dev", default-features = false, git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.28" }
   ```

1. Import the `pallet-contracts-primitives` crate to make it available to the node template runtime by adding it to the list of dependencies.

   In most cases, you specify the same information for every pallet in any given version of the node template.
   However, if the compiler indicates a different version than the one you have specified is found, you might need to modify the dependency to match the version the compiler identifies.
   For example, if the compiler found version 6.0.0 for the `pallet-contracts-primitives` crate:

   ```toml
   pallet-contracts-primitives = { version = "6.0.0", default-features = false, git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.28" }
   ```

1. Add the Contracts pallet to the list of `std` features so that its features are included when the runtime is built as a platform native binary.

   ```toml
   [features]
   default = ["std"]
   std = [
      "codec/std",
      "scale-info/std",
      "frame-executive/std",
      "frame-support/std",
      "frame-system-rpc-runtime-api/std",
      "frame-system/std",
      "pallet-aura/std",
      "pallet-balances/std",
      "pallet-contracts/std",
      "pallet-contracts-primitives/std",
   ]
   ```

1. Save your changes and close the `runtime/Cargo.toml` file.

1. Check that your runtime compiles correctly by running the following command:

   ```bash
   cargo check -p node-template-runtime
   ```

## Implement the Contracts configuration trait

Now that you have successfully imported the pallets for smart contracts, you are ready to implement the parameters and types in the runtime.
If you have explored other tutorials, you might already know that every pallet has a configuration trait—called `Config`—that the runtime must implement.

If you review the Rust API documentation for [`pallet_contracts::Config`](https://paritytech.github.io/substrate/master/pallet_contracts/pallet/trait.Config.html), you'll notice that—unlike the Nicks pallet—this pallet has many associated types, so the code in this tutorial is going to be more complex than previous tutorials.

To implement the `Config` trait for the Contracts pallet in the runtime:

1. Open the `runtime/src/lib.rs` file in a text editor.

1. Locate the `pub use frame_support` block and add `Nothing` to the list of traits.

   For example:

   ```rust
   pub use frame_support::{
    construct_runtime, parameter_types,
    traits::{
      ConstU128, ConstU32, ConstU64, ConstU8, KeyOwnerProofSystem, Randomness, StorageInfo,Nothing
    },
    weights::{
     constants::{BlockExecutionWeight, ExtrinsicBaseWeight, RocksDbWeight, WEIGHT_PER_SECOND},
     IdentityFee, Weight,
    },
    StorageValue,
   };
   ```

1. Add a line to import the default contract weight from the Contracts pallet.
   For example:

   ```rust
   pub use frame_system::Call as SystemCall;
   pub use pallet_balances::Call as BalancesCall;
   pub use pallet_timestamp::Call as TimestampCall;
   use pallet_transaction_payment::CurrencyAdapter;
   use pallet_contracts::DefaultContractAccessWeight; // Add this line
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
   const AVERAGE_ON_INITIALIZE_RATIO: Perbill = Perbill::from_percent(10);
   /*** End Added Block ***/
   ```

1. Add the parameter types and implement the `Config` trait for `pallet_contracts` in the runtime.

   For example:

   ```rust
   /*** Add a block similar to the following ***/
   parameter_types! {
      pub const DepositPerItem: Balance = deposit(1, 0);
      pub const DepositPerByte: Balance = deposit(0, 1);
      pub const DeletionQueueDepth: u32 = 128;
      pub DeletionWeightLimit: Weight = AVERAGE_ON_INITIALIZE_RATIO * BlockWeights::get().max_block;
      pub Schedule: pallet_contracts::Schedule<Runtime> = Default::default();
   }
   
   impl pallet_contracts::Config for Runtime {
      type Time = Timestamp;
      type Randomness = RandomnessCollectiveFlip;
      type Currency = Balances;
      type Event = Event;
      type Call = Call;
      type CallFilter = frame_support::traits::Nothing;
      type WeightPrice = pallet_transaction_payment::Pallet<Self>;
      type WeightInfo = pallet_contracts::weights::SubstrateWeight<Self>;
      type ChainExtension = ();
      type Schedule = Schedule;
      type CallStack = [pallet_contracts::Frame<Self>; 31];
      type DeletionQueueDepth = DeletionQueueDepth;
      type DeletionWeightLimit = DeletionWeightLimit;
      type DepositPerByte = DepositPerByte;
      type DepositPerItem = DepositPerItem;
      type AddressGenerator = pallet_contracts::DefaultAddressGenerator;
      type ContractAccessWeight = DefaultContractAccessWeight<BlockWeights>;
      type MaxCodeLen = ConstU32<{ 256 * 1024 }>;
      type RelaxedMaxCodeLen = ConstU32<{ 512 * 1024 }>;
      type MaxStorageKeyLen = ConstU32<{ 512 * 1024 }>;
   }
   /*** End added block ***/
   ```

   For more information about the configuration of the Contracts pallet and how the types and parameters are used, see the [Contracts pallet source code](https://github.com/paritytech/substrate/blob/master/frame/contracts/src/lib.rs).

1. Add `pallet_contracts` to the `construct_runtime!` macro.

   For example:

   ```rust
   // Create the runtime by composing the FRAME pallets that were previously configured
   construct_runtime!(
      pub enum Runtime where
        Block = Block,
        NodeBlock = opaque::Block,
        UncheckedExtrinsic = UncheckedExtrinsic
      {
         System: frame_system,
         RandomnessCollectiveFlip: pallet_randomness_collective_flip,
         Timestamp: pallet_timestamp,
         Aura: pallet_aura,
         Grandpa: pallet_grandpa,
         Balances: pallet_balances,
         TransactionPayment: pallet_transaction_payment,
         Sudo: pallet_sudo,
         Contracts: pallet_contracts,
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

1. Open the `runtime/Cargo.toml` file in a text editor.

1. Add the description for the `pallet-contracts-rpc-runtime-api` pallet to the `[dependencies]` section using the same version and branch information as other pallets.

   For example:

   ```toml
   pallet-contracts-rpc-runtime-api = { version = "4.0.0-dev", default-features = false, git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.28" }
   ```

1. Add `pallet-contracts-rpc-runtime-api` to the list of `std` features so that its features are included when the runtime is built as a native binary.

   ```toml
   [features]
   default = ["std"]
   std = [
      "codec/std",
      ...
      "pallet-contracts/std",
      "pallet-contracts-primitives/std",
      "pallet-contracts-rpc-runtime-api/std",
      ...
   ]
   ```

1. Save your changes and close the `runtime/Cargo.toml` file.

1. Open the `runtime/src/lib.rs` file in a text editor and enable debugging for contracts by adding the following constant:

   ```rust
   const CONTRACTS_DEBUG_OUTPUT: bool = true;
   ```

1. Open the `runtime/src/lib.rs` file and implement the contracts runtime API in the
   `impl_runtime_apis!` macro near the end of the runtime `lib.rs` file.

   For example within `impl_runtime_apis! { }` the section:

   ```rust
   /*** Add this block ***/
   impl pallet_contracts_rpc_runtime_api::ContractsApi<Block, AccountId, Balance, BlockNumber, Hash> for Runtime {
      fn call(
         origin: AccountId,
         dest: AccountId,
         value: Balance,
         gas_limit: u64,
         storage_deposit_limit: Option<Balance>,
         input_data: Vec<u8>,
      ) -> pallet_contracts_primitives::ContractExecResult<Balance> {
         Contracts::bare_call(origin, dest, value, gas_limit, storage_deposit_limit, input_data, CONTRACTS_DEBUG_OUTPUT)
      }
      
      fn instantiate(
         origin: AccountId,
         value: Balance,
         gas_limit: u64,
         storage_deposit_limit: Option<Balance>,
         code: pallet_contracts_primitives::Code<Hash>,
         data: Vec<u8>,
         salt: Vec<u8>,
      ) -> pallet_contracts_primitives::ContractInstantiateResult<AccountId, Balance> {
         Contracts::bare_instantiate(origin, value, gas_limit, storage_deposit_limit, code, data, salt, CONTRACTS_DEBUG_OUTPUT)
      }
         
      fn upload_code(
         origin: AccountId,
         code: Vec<u8>,
         storage_deposit_limit: Option<Balance>,
      ) -> pallet_contracts_primitives::CodeUploadResult<Hash, Balance> {
         Contracts::bare_upload_code(origin, code, storage_deposit_limit)
      }
      
      fn get_storage(
         address: AccountId,
         key: Vec<u8>,
      ) -> pallet_contracts_primitives::GetStorageResult {
         Contracts::get_storage(address, key)
      }
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
Substrate provides an RPC server to interact with the node.
However, the default RPC server does not provide access to the Contracts pallet.
To interact with the Contracts pallet, you must extend the existing RPC server to include the Contracts pallet and the Contracts RPC API.
For the Contracts pallet to take advantage of the RPC endpoint API, you need to add the custom RPC endpoint to the outer node configuration.

To add the RPC API extension to the outer node:

1. Open the `node/Cargo.toml` file in a text editor and add the Contracts and Contracts RPC crates to the `[dependencies]` sections.

   For example:

   ```toml
   pallet-contracts = { version = "4.0.0-dev", git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.28" }
   pallet-contracts-rpc = { version = "4.0.0-dev", git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.28" }
   ```

   Because you have exposed the runtime API and are now working in code for the outer node, you don't need to use `no_std` configuration, so you don't have to maintain a dedicated `std` list of features.

1. Save your changes and close the `node/Cargo.toml` file.

1. Open the `node/src/rpc.rs` file in a text editor and locate the following line.

   ```rust
   use node_template_runtime::{opaque::Block, AccountId, Balance, Index};
   ```

1. Add `BlockNumber` and `Hash` to the existing `use node_template_runtime` declaration.

   ```rust
   use node_template_runtime::{opaque::Block, AccountId, Balance, Index, BlockNumber, Hash}; 
   ```

1. Add `use pallet_contracts_rpc` to the file.

   ```rust
   use pallet_transaction_payment_rpc::{TransactionPayment, TransactionPaymentApiServer};
   use substrate_frame_rpc_system::{System, SystemApiServer};
   use pallet_contracts_rpc::{Contracts, ContractsApiServer}; // Add this line
   ```

1. Add the Contracts RPC pallet to the `create_full` function for RPC extensions.

   ```rust
   /// Instantiate all full RPC extensions.
   pub fn create_full<C, P>(
      deps: FullDeps<C, P>,
   ) -> Result<RpcModule<()>, Box<dyn std::error::Error + Send + Sync>>
   where
      C: ProvideRuntimeApi<Block>,
      C: HeaderBackend<Block> + HeaderMetadata<Block, Error = BlockChainError> + 'static,
      C: Send + Sync + 'static,
      C::Api: substrate_frame_rpc_system::AccountNonceApi<Block, AccountId, Index>,
      C::Api: pallet_transaction_payment_rpc::TransactionPaymentRuntimeApi<Block, Balance>,
      C::Api: pallet_contracts_rpc::ContractsRuntimeApi<Block, AccountId, Balance, BlockNumber, Hash>, // Add this line
      C::Api: BlockBuilder<Block>,
      P: TransactionPool + 'static,

1. Add the extension for the Contracts RPC API.

   ```rust
   module.merge(System::new(client.clone(), pool.clone(), deny_unsafe).into_rpc())?;
   module.merge(TransactionPayment::new(client.clone()).into_rpc())?;
   module.merge(Contracts::new(client.clone()).into_rpc())?; // Add this line
   ```

1. Save your changes and close the `node/src/rpc.rs` file.

1. Check that your runtime compiles correctly by running the following command:

   ```bash
   cargo check -p node-template
   ```
   
   If there are no errors, you are ready to compile by running the following command:

   ```bash
   cargo build --release
   ```

## Start the local Substrate node

After your node compiles, you are ready to start the Substrate node that has been enhanced with smart contract capabilities from the [Contracts pallet](https://paritytech.github.io/substrate/master/pallet_contracts/index.html) and interact with it using the front-end template.

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

1. Open `http://localhost:8000/` in a browser to view the front-end template.

1. In the Pallet Interactor component, verify that Extrinsic is selected.

1. Select `contracts` from the list of pallets available to call.

   ![View the contracts pallets](/media/images/docs/tutorials/add-a-pallet/contracts-pallet.png)

## Next steps

In this tutorial, you learned:

- How to import the Contracts pallet.
- How to expose the Contracts pallet RPC endpoints API.
- How to update the outer node.
- How to verify the Contracts pallet is available in the runtime using the front-end template.

To begin using the Contracts pallet, you'll need to start writing some smart contracts to deploy.
Explore the following topics and tutorials to learn more.

- [Custom RPCs](/build/custom-rpc/)
- [Prepare your first contract](/tutorials/smart-contracts/prepare-your-first-contract/)
- [Develop a smart contract](/tutorials/smart-contracts/develop-a-smart-contract/)
