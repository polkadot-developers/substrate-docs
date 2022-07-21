---
title: Add the contracts pallet
description: How to add the pallets that enable you to use WebAssembly smart contracts on a Substrate-based chain.
keywords:
  - pallet design
  - intermediate
  - runtime
---

This guide illustrates how to add the [Contracts pallet](https://paritytech.github.io/substrate/master/pallet_contracts/index.html) to your runtime so that your blockchain can support Wasm smart contracts.
You can follow similar patterns to add additional FRAME pallets to your runtime.
However, each pallet requires specific configuration settings and type definitions for your runtime to compile correctly.

## What is the Contracts pallet for?

Broadly-speaking, there are two main reasons for adding the Contracts pallet to the runtime:

- You want to deploy smart contracts as first-class citizens.
  
  Adding the Contracts pallet to a Substrate runtime enables you to build a general-purpose blockchain that uses smart contracts to provide the core functionality you want to deliver.
  For example, if you have an innovative idea that focuses on the use of smart contracts, you can use the Contracts pallet to build the base layer of your chain, then complement the base layer with other pallets to achieve application-specific goals with minimal blockchain-specific customization.

- You want to build a blockchain with flexibility for how users interact with the chain.
  
  If you are building a chain that doesn't focus on smart contracts—with most of the logic is defined using other Substrate pallets—you still might want to use the Contracts pallet to expose parts of the chain logic for customization.
  
  For example, if you are building a decentralized exchange blockchain, you might want to enable users to upload their own trading algorithms.
  Smart contracts are ideal for that type of use case because they treat all user input as untrusted and potentially adversarial.
  With the gas fees associated with executing a smart contract, users have to pay for the execution time of their trading algorithms.
  
  The Contracts pallet provides the [Chain extension](https://ink.substrate.io/macros-attributes/chain-extension/) primitive for exactly that functionality and programming languages—like [ink!](https://paritytech.github.io/ink/)—can make use of the business logic primitives your chain exposes.

  Ror more information about use cases for the Contracts pallet, see the pallet [README][pallet-readme].

## Before you begin

Make sure you have the latest version (`polkadot-v0.9.26`) of the Substrate node template compiled on your computer.
If you haven't already done so, see [Build a local blockchain](/tutorials/get-started/build-local-blockchain/).

## Import the dependencies

1. Add Contracts to your runtime.

   To learn how to include Contracts in your runtime, see [Import a pallet](/reference/how-to-guides/basics/import-a-pallet).

1. Update `runtime/Cargo.toml` with the following entries:

   - `pallet-contracts`
   - `pallet-contracts-primitives`
   - `pallet-contracts-rpc-runtime-api`
   - `pallet-contracts-rpc`

1. Integrate the Contracts pallet into your runtime as described in [Import a pallet](/reference/how-to-guides/basics/import-a-pallet).

## Add the Contracts pallet to your runtime

1. Implement the Contracts pallet [configuration trait](https://paritytech.github.io/substrate/master/pallet_contracts/pallet/trait.Config.html) for your `runtime/src/lib.rs`.

   You should check that the version of the pallet you are configuring is the same version specified in the `Cargo.toml` dependencies for the Contracts pallet.

   To implement the trait, define the following trait types:

   ```rust
   impl pallet_contracts::Config for Runtime {
    type Time = Timestamp;
    type Randomness = RandomnessCollectiveFlip;
    type Currency = Balances;
    type Event = Event;
    /* --snip-- */
   ```

   For examples of how to configure specific parameters for the Contracts pallet, see the `runtime/src/lib.rs` for following template nodes:

   - [Substrate repository node](https://github.com/paritytech/substrate/blob/master/bin/node/runtime/src/lib.rs)
   - [`substrate-contracts-node`](https://github.com/paritytech/substrate-contracts-node) is a standalone node.
   - [`contracts-parachain`][contracts-parachain] is a parachain node.

   The [configuration trait documentation](https://paritytech.github.io/substrate/master/pallet_contracts/pallet/trait.Config.html) also has explanations for each type.

1. Add parameter types.

   Note that some of these types require `parameter_types`.
   To see an example of how they should be added, see [this example][bin-runtime-contracts-frame].

   Add the parameter types directly above `impl pallet_contracts::Config for Runtime`.
   For example, the following snippet shows how to add the `DeletionQueueDepth` parameter type:

   ```rust
   parameter_types! {
     /* --snip-- */
     pub DeletionQueueDepth: u32 = ((DeletionWeightLimit::get() / (
      <Runtime as pallet_contracts::Config>::WeightInfo::on_initialize_per_queue_item(1) -
      <Runtime as pallet_contracts::Config>::WeightInfo::on_initialize_per_queue_item(0)
      )) / 5) as u32;
     /* --snip-- */
   }
   ```

   Notice how the parameter type depends on `WeightInfo`.
   This requires you to add the following to the top of `runtime/src/lib.rs`:

   ```rust
   use pallet_contracts::weights::WeightInfo;
   ```

   Similarly, other parameter types use constants such as `DAYS`, `MILLICENTS` and `AVERAGE_ON_INITIALIZE_RATIO`.

   Define these towards the top of your `runtime/src/lib.rs` file where the other constants exist:

   ```rust
   // Contracts price units.
   // Unit = the base number of indivisible units for balances
   const UNIT: Balance = 1_000_000_000_000;
   const MILLIUNIT: Balance = 1_000_000_000;
   const EXISTENTIAL_DEPOSIT: Balance = MILLIUNIT;

   const fn deposit(items: u32, bytes: u32) -> Balance {
     (items as Balance * UNIT + (bytes as Balance) * (5 * MILLIUNIT / 100)) / 10
   }

   /// We assume that ~10% of the block weight is consumed by `on_initialize` handlers.
   /// This is used to limit the maximal weight of a single extrinsic.
   const AVERAGE_ON_INITIALIZE_RATIO: Perbill = Perbill::from_percent(10);
   ```

1. Add an instance of `pallet_contracts` in the runtime.

   Create an instance of the Contracts pallet in the `construct_macro!` inside `runtime/src/lib.rs`:

   ```rust
   /* --snip-- */
   Contracts: pallet_contracts,
   /* --snip-- */
   ```

## Add API dependencies

The Contracts pallet exposes custom runtime APIs and RPC endpoints.

As an example, there is a custom API and RPC endpoint that enables you to execute a contract call as a dry-run—that is, without actually modifying any storage.
This dry-run is often used by offchain tooling—such as a frontend—to display a contract's state.
For example, if your application deploys an ERC-20 contract and you want to display the balance of an account, you can configure the frontend to execute a dry-run of the balance function using this custom API and RPC endpoint.

To use the custom runtime APIs and RPC endpoints exposed in the Contracts pallet, you need to include two additional pallets in the runtime: [`pallet_contracts_rpc_runtime_api`](https://paritytech.github.io/substrate/master/pallet_contracts_rpc_runtime_api/index.html) and [`pallet_contracts_rpc`](https://paritytech.github.io/substrate/master/pallet_contracts_rpc/).

1. Import the dependencies.

   As in the first step of this guide, update the `runtime/Cargo.toml` file to add `pallet-contracts-rpc-runtime-api`.

1. Include `pallet-contracts` and `pallet-contracts-rpc` inside `node/Cargo.toml`.

   This way your runtime can interact with your node.

1. Implement the [`ContractsApi`](https://paritytech.github.io/substrate/master/pallet_contracts_rpc_runtime_api/trait.ContractsApi.html) trait.

   Navigate to the `impl_runtime_apis!` macro near the end of your runtime.

   Add the trait implementation inside the macro:

   ```rust
   impl pallet_contracts_rpc_runtime_api::ContractsApi<Block, AccountId, Balance, BlockNumber, Hash>
     for Runtime
   {
   // TODO: Implement the functions
   }
   ```

   For the implementation of the individual trait functions, it is very unlikely that you want a different implementation than the one used in the templates.
   These functions merely forward the calls to the pallet.
   You can copy the implementation straight from [Substrate][bin-runtime-contracts-rpc].
   Make sure that the version where you copy from is the same version as the one used in your `Cargo.toml` file.

1. Add the RPC API extension.

   The node's RPC does not contain access to the Contracts pallet by default.
   To interact with it, you must extend the existing RPC and add the Contracts pallet along with the API.

   In `node/src/rpc.rs`, search this function:

   ```rust
   /// Instantiate all full RPC extensions.
   pub fn create_full
   ```

   And add the following trait bound to it in the `where` clause:

   ```rust
   C::Api: pallet_contracts_rpc::ContractsRuntimeApi<Block, AccountId, Balance, BlockNumber, Hash>,
   ```

   In the function body, before the function returns, you need to add the contracts RPC API extension:

   ```rust
   // Contracts RPC API extension
   use pallet_contracts_rpc::{ContractsApiServer, ContractsRpc};
   module.merge(ContractsRpc::new(client.clone()).into_rpc())?;
   ```

1. Storage migrations

   The most naive way to account for storage migration is to include the following code in your `runtime/src/lib.rs`.

   ```rust
   use pallet_contracts::migration;

   pub struct Migrations;
   impl OnRuntimeUpgrade for Migrations {
    fn on_runtime_upgrade() -> Weight {
     migration::migrate::<Runtime>()
    }
   }
   ```

   You also need to modify your `Executive` type by adding `Migrations` as a type parameter:

   ```rust
   pub type Executive = frame_executive::Executive<
     Runtime,
     Block,
     frame_system::ChainContext<Runtime>,
     Runtime,
     AllPalletsWithSystem,
     Migrations,
   >;
   ```

   This is only the most simple solution of how to do storage migrations.
   If you have a lot of state in your chain, the migration might take longer than the time allowed for building a block.
   If a migration takes longer than the time allowed for building a block, the chain will stop progressing and be unable to resume building blocks.

   <!-- See the how-to guide on [Storage migrations][storage-migrations-tutorial] for more details on migrations. -->

## Start your upgraded chain

Your node template now includes the Contracts pallet and is ready to execute WebAssembly smart contracts.

Build and run it using the following commands:

```bash
# Build chain
cargo build --release

# Launch chain in development mode
./target/release/node-template --dev
```

## Examples

See the following repositories for examples of node configurations that include the Contracts pallet.

- [Default `node` configuration][bin-runtime-contracts-config] includes all pallets shipped with Substrate.
- [`substrate-contracts-node`][substrate-contracts-node] is a node template based on the - [`node-template`][substrate-node-template].
- [`contracts-rococo`][contracts-parachain] is a parachain node template for the Rococo testnet.

## Where to go next

- [Why Rust for smart contracts?](https://ink.substrate.io/why-rust-for-smart-contracts)
- [Why WebAssembly for smart contracts?](https://ink.substrate.io/why-webassembly-for-smart-contracts).
- [Develop smart contracts](/tutorials/smart-contracts/)
- [Smart contract code examples](https://github.com/paritytech/ink/tree/master/examples)

[contracts-frame-gh]: https://github.com/paritytech/substrate/blob/b75a253f148aa36fa17cf795b9f2fc2f22d0fcc5/frame/contracts/src/lib.rs
[bin-runtime-contracts-frame]: https://github.com/paritytech/substrate/blob/b75a253f148aa36fa17cf795b9f2fc2f22d0fcc5/bin/node/runtime/src/lib.rs#L1078-L1095
[bin-runtime-contracts-config]: https://github.com/paritytech/substrate/blob/b75a253f148aa36fa17cf795b9f2fc2f22d0fcc5/bin/node/runtime/src/lib.rs#L1097-L1123
[bin-runtime-contracts-rpc]: https://github.com/paritytech/substrate/blob/b75a253f148aa36fa17cf795b9f2fc2f22d0fcc5/bin/node/runtime/src/lib.rs#L1797-L1841
[substrate-contracts-node]: https://github.com/paritytech/substrate-contracts-node
[contracts-parachain]: https://github.com/paritytech/cumulus/tree/eb643b89b87fd818cbb78c08883b4bfded7a1f6c/parachains/runtimes/contracts/contracts-rococo
[ink]: https://ink.substrate.io/
[chain-extension]: https://ink.substrate.io/macros-attributes/chain-extension
[pallet-readme]: https://github.com/paritytech/substrate/blob/b75a253f148aa36fa17cf795b9f2fc2f22d0fcc5/frame/contracts/README.md
[substrate-node-template]: https://github.com/paritytech/substrate/tree/b75a253f148aa36fa17cf795b9f2fc2f22d0fcc5/bin/node-template
