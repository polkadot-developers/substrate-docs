# My block length is too small to do forkless runtime upgrades, what do I do?

As you may be aware at this point, runtime upgrades must always abide by the block time requirements -- regardless of running it as SUDO or not. For example, if your block length is 100KB and your runtime WASM is 120KB, then you will not be able to perform a chain upgrade as it is too large. 

At Bittensor, we have run into an extreme version of this problem: we accidentally shrunk our block length to 65KB! This effectively made it impossible to perform chain upgrades as our WASM files were at least 300KB in size. 

## Use cases

This is particularly important if you've accidentally shrunk your block length too much and need to bring your chain back to an upgrade-able state. 

## Before you begin 

Before you begin, you should have some knowledge of Forkless Runtime upgrades, you can find a guide on this here: https://docs.substrate.io/tutorials/v3/forkless-upgrades/.


## How do I recover my chain?

We will use our experience at Bittensor as an example for this how-to guide. What we had done was accidentally shrink our block length to 65KB in an effort to over-optimize. This made it impossible to run forkless chain upgrades as the WASM files we were uploading were far too large for the blocks at 300KB. As a result, we had to "thread the needle". That is, we created a very small runtime (64.8KB) that consisted of only the ability to perform a chain upgrade with a larger block length, then followed it with another upgrade that restored the code back to its working state. 

It's important to prepare both runtimes and push them consecutively. First prepare the normal runtime you are trying to upgrade with and save it aside for use in step 10. Now, let's create this minimalistic runtime. It must be smaller than your present block length. In our case, the block length was 65KB. All of the following changes occur in `runtime/src/lib.rs`.


1. Remove any and all custom code you added to your runtime. This means removing the implementation from `construct_runtime!`, all associated `parameter_types!`, and all implementations for runtime.

2. Comment out some unneeded configs and functions. Things like `native_version()`, `frame_benchmarking`, and `pallet_transaction_payment_rpc_runtime_api` can all be removed. 

   ```rust
   // #[cfg(feature = "std")]
   // pub fn native_version() -> NativeVersion {
   // 	NativeVersion {
   // 		runtime_version: VERSION,
   // 		can_author_with: Default::default(),
   // 	}
   // }

3. Remove all unneeded `parameter_types!`. 

4. This is the hard part, remove all unneeded runtime pallet traits! This is what our `construct_runtime!` looked like when we were finished with it:
```rust
construct_runtime!(
	pub enum Runtime where
		Block = Block,
		NodeBlock = opaque::Block,
		UncheckedExtrinsic = UncheckedExtrinsic
	{
		System: frame_system::{Call, Event<T>},
		RandomnessCollectiveFlip: pallet_randomness_collective_flip::{Pallet},
		Timestamp: pallet_timestamp::{Call, Inherent},
		Aura: pallet_aura::{Pallet},
		Grandpa: pallet_grandpa::{Call, Event},
		Balances: pallet_balances::{Event<T>},
		TransactionPayment: pallet_transaction_payment::{Pallet},
		Sudo: pallet_sudo::{Call, Event<T>}
	}
);
```
  This is the bare minimum needed for our blockchain to work, note how we removed all `Config<T>` and `Event<T>` where they weren't being used. 

5. Remove all unnecessary `signedExtensions`. 
  ```rust
  pub type SignedExtra = (
    frame_system::CheckSpecVersion<Runtime>,
    //frame_system::CheckTxVersion<Runtime>,
    // frame_system::CheckGenesis<Runtime>,
    // frame_system::CheckEra<Runtime>,
    // frame_system::CheckNonce<Runtime>,
    // frame_system::CheckWeight<Runtime>,
    // pallet_transaction_payment::ChargeTransactionPayment<Runtime>
    // pallet_subtensor::ChargeTransactionPayment<Runtime>
  );
  ```
6. This step is optional, but if you need to go even smaller in runtime size, `ChargeTransactionPayment` is pretty massive and is a good candidate for removal. However, if you remove all `ChargeTransactionPayment` signed extensions, this will break your upgrades as transactions must be tagged appropriately. So we're going to cheat a little bit here and emulate a valid transaction every time `validate_transaction` is called. So it should look like this:
  ```rust
  	impl sp_transaction_pool::runtime_api::TaggedTransactionQueue<Block> for Runtime {
		fn validate_transaction(
			_source: TransactionSource,
			_tx: <Block as BlockT>::Extrinsic,
		) -> TransactionValidity {
			let provides: Vec<Vec<u8>> = vec![vec![1;10]];
			
			Ok(ValidTransaction {
				provides: provides,
				..Default::default()
			})
		}
	}
  ```
  
7. Update your spec_version, this is important so that the runtime update will go through. Assuming our initial spec_version is 101, let's push it to 102. 
  
   ```rust
   spec_version: 102
   ```
8. Most importantly, update your block length to an appropriate size. 
  ```rust
  pub BlockLength: frame_system::limits::BlockLength = frame_system::limits::BlockLength
		::max_with_normal_ratio(1 * 1024 * 64, NORMAL_DISPATCH_RATIO);
  ```  
9. Finally, when you've got this compiled and ready for upgrade, you can upgrade using the `node_template_runtime.compact.compressed.wasm`, which is smaller and more optimized for size.

10. Once you've pushed this runtime upgrade, you should push the original code back in as a follow-up upgrade immediately. 

And that's it!



## Complete code
Here is our slim runtime code that we created for solving this issue, it should help clarify the steps above. I'm including commented bits so you understand what bits needed to be taken out.
```rust
  #![cfg_attr(not(feature = "std"), no_std)]
// `construct_runtime!` does a lot of recursion and requires us to increase the limit to 256.
#![recursion_limit="256"]

// Make the WASM binary available.
#[cfg(feature = "std")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

use sp_std::prelude::*;
use sp_core::{crypto::KeyTypeId, OpaqueMetadata};
use sp_runtime::{
	ApplyExtrinsicResult, generic, create_runtime_str, impl_opaque_keys, MultiSignature,
	transaction_validity::{TransactionValidity, TransactionSource},
};
use sp_runtime::traits::{
	BlakeTwo256, Block as BlockT, AccountIdLookup, Verify, IdentifyAccount, NumberFor,
};
use sp_api::impl_runtime_apis;
use sp_consensus_aura::sr25519::AuthorityId as AuraId;
use pallet_grandpa::{AuthorityId as GrandpaId, AuthorityList as GrandpaAuthorityList};
use pallet_grandpa::fg_primitives;
use sp_version::RuntimeVersion;
#[cfg(feature = "std")]
use sp_version::NativeVersion;
use frame_support::sp_runtime::transaction_validity::ValidTransaction;

// A few exports that help ease life for downstream crates.
#[cfg(any(feature = "std", test))]
pub use sp_runtime::BuildStorage;
pub use sp_runtime::{Permill, Perbill};
pub use frame_support::{
	construct_runtime, parameter_types, StorageValue,
	traits::{KeyOwnerProofSystem, Randomness},
	weights::{
		Weight, IdentityFee,
		constants::{BlockExecutionWeight, ExtrinsicBaseWeight, RocksDbWeight, WEIGHT_PER_SECOND},
	},
};
use pallet_transaction_payment::CurrencyAdapter;

//pub use pallet_subtensor;

/// An index to a block.
pub type BlockNumber = u32;

/// Alias to 512-bit hash when used in the context of a transaction signature on the chain.
pub type Signature = MultiSignature;

/// Some way of identifying an account on the chain. We intentionally make it equivalent
/// to the public key of our transaction signing scheme.
pub type AccountId = <<Signature as Verify>::Signer as IdentifyAccount>::AccountId;

/// Balance of an account.
pub type Balance = u64;

/// Index of a transaction in the chain.
pub type Index = u32;

/// A hash of some data used by the chain.
pub type Hash = sp_core::H256;

/// Opaque types. These are used by the CLI to instantiate machinery that don't need to know
/// the specifics of the runtime. They can then be made to be agnostic over specific formats
/// of data like extrinsics, allowing for them to continue syncing the network through upgrades
/// to even the core data structures.
pub mod opaque {
	use super::*;

	pub use sp_runtime::OpaqueExtrinsic as UncheckedExtrinsic;

	/// Opaque block header type.
	pub type Header = generic::Header<BlockNumber, BlakeTwo256>;
	/// Opaque block type.
	pub type Block = generic::Block<Header, UncheckedExtrinsic>;
	/// Opaque block identifier type.
	pub type BlockId = generic::BlockId<Block>;

	impl_opaque_keys! {
		pub struct SessionKeys {
			pub aura: Aura,
			pub grandpa: Grandpa,
		}
	}
}

// To learn more about runtime versioning and what each of the following value means:
//   https://substrate.dev/docs/en/knowledgebase/runtime/upgrades#runtime-versioning
#[sp_version::runtime_version]
pub const VERSION: RuntimeVersion = RuntimeVersion {
	spec_name: create_runtime_str!("node-subtensor"),
	impl_name: create_runtime_str!("node-subtensor"),
	authoring_version: 1,
	// The version of the runtime specification. A full node will not attempt to use its native
	//   runtime in substitute for the on-chain Wasm runtime unless all of `spec_name`,
	//   `spec_version`, and `authoring_version` are the same between Wasm and native.
	// This value is set to 100 to notify Polkadot-JS App (https://polkadot.js.org/apps) to use
	//   the compatible custom types.
	spec_version: 108,
	impl_version: 1,
	apis: RUNTIME_API_VERSIONS,
	transaction_version: 1,
};

/// This determines the average expected block time that we are targeting.
/// Blocks will be produced at a minimum duration defined by `SLOT_DURATION`.
/// `SLOT_DURATION` is picked up by `pallet_timestamp` which is in turn picked
/// up by `pallet_aura` to implement `fn slot_duration()`.
///
/// Change this to adjust the block time.
pub const MILLISECS_PER_BLOCK: u64 = 12000;

// NOTE: Currently it is not possible to change the slot duration after the chain has started.
//       Attempting to do so will brick block production.
pub const SLOT_DURATION: u64 = MILLISECS_PER_BLOCK;

// Time is measured by number of blocks.
//pub const MINUTES: BlockNumber = 60_000 / (MILLISECS_PER_BLOCK as BlockNumber);
//: BlockNumber = MINUTES * 60;
//: BlockNumber = HOURS * 24;

/// The version information used to identify this runtime when compiled natively.
// #[cfg(feature = "std")]
// pub fn native_version() -> NativeVersion {
// 	NativeVersion {
// 		runtime_version: VERSION,
// 		can_author_with: Default::default(),
// 	}
// }

const NORMAL_DISPATCH_RATIO: Perbill = Perbill::from_percent(75);

parameter_types! {
	pub const Version: RuntimeVersion = VERSION;
	pub const BlockHashCount: BlockNumber = 2400;
	/// We allow for 2 seconds of compute with a 6 second average block time.
	pub BlockWeights: frame_system::limits::BlockWeights = frame_system::limits::BlockWeights
		::with_sensible_defaults(5 * WEIGHT_PER_SECOND, NORMAL_DISPATCH_RATIO);
	pub BlockLength: frame_system::limits::BlockLength = frame_system::limits::BlockLength
		::max_with_normal_ratio(1 * 1024 * 64, NORMAL_DISPATCH_RATIO);
	pub const SS58Prefix: u8 = 42;
}

// Configure FRAME pallets to include in runtime.
impl frame_system::Config for Runtime {
	/// The basic call filter to use in dispatchable.
	type BaseCallFilter = ();
	/// Block & extrinsics weights: base values and limits.
	type BlockWeights = BlockWeights;
	/// The maximum length of a block (in bytes).
	type BlockLength = BlockLength;
	/// The identifier used to distinguish between accounts.
	type AccountId = AccountId;
	/// The aggregated dispatch type that is available for extrinsics.
	type Call = Call;
	/// The lookup mechanism to get account ID from whatever is passed in dispatchers.
	type Lookup = AccountIdLookup<AccountId, ()>;
	/// The index type for storing how many extrinsics an account has signed.
	type Index = Index;
	/// The index type for blocks.
	type BlockNumber = BlockNumber;
	/// The type for hashing blocks and tries.
	type Hash = Hash;
	/// The hashing algorithm used.
	type Hashing = BlakeTwo256;
	/// The header type.
	type Header = generic::Header<BlockNumber, BlakeTwo256>;
	/// The ubiquitous event type.
	type Event = Event;
	/// The ubiquitous origin type.
	type Origin = Origin;
	/// Maximum number of block number to block hash mappings to keep (oldest pruned first).
	type BlockHashCount = BlockHashCount;
	/// The weight of database operations that the runtime can invoke.
	type DbWeight = RocksDbWeight;
	/// Version of the runtime.
	type Version = Version;
	/// Converts a module to the index of the module in `construct_runtime!`.
	///
	/// This type is being generated by `construct_runtime!`.
	type PalletInfo = PalletInfo;
	/// What to do if a new account is created.
	type OnNewAccount = ();
	/// What to do if an account is fully reaped from the system.
	type OnKilledAccount = ();
	/// The data to be stored in an account.
	type AccountData = pallet_balances::AccountData<Balance>;
	/// Weight information for the extrinsics of this pallet.
	type SystemWeightInfo = ();
	/// This is used as an identifier of the chain. 42 is the generic substrate prefix.
	type SS58Prefix = SS58Prefix;
	/// The set code logic, just the default since we're not a parachain.
	type OnSetCode = ();
}

impl pallet_randomness_collective_flip::Config for Runtime {}

impl pallet_aura::Config for Runtime {
	type AuthorityId = AuraId;
}

impl pallet_grandpa::Config for Runtime {
	type Event = Event;
	type Call = Call;

	type KeyOwnerProofSystem = ();

	type KeyOwnerProof =
		<Self::KeyOwnerProofSystem as KeyOwnerProofSystem<(KeyTypeId, GrandpaId)>>::Proof;

	type KeyOwnerIdentification = <Self::KeyOwnerProofSystem as KeyOwnerProofSystem<(
		KeyTypeId,
		GrandpaId,
	)>>::IdentificationTuple;

	type HandleEquivocation = ();

	type WeightInfo = ();
}

parameter_types! {
	pub const MinimumPeriod: u64 = SLOT_DURATION / 2;
}

impl pallet_timestamp::Config for Runtime {
	/// A timestamp: milliseconds since the unix epoch.
	type Moment = u64;
	type OnTimestampSet = Aura;
	type MinimumPeriod = MinimumPeriod;
	type WeightInfo = ();
}

parameter_types! {
	pub const ExistentialDeposit: u64 = 500;
	pub const MaxLocks: u32 = 50;
}

impl pallet_balances::Config for Runtime {
	type MaxLocks = MaxLocks;
	type MaxReserves = ();
	type ReserveIdentifier = [u8; 8];
	/// The type for recording an account's balance.
	type Balance = Balance;
	/// The ubiquitous event type.
	type Event = Event;
	type DustRemoval = ();
	type ExistentialDeposit = ExistentialDeposit;
	type AccountStore = System;
	type WeightInfo = pallet_balances::weights::SubstrateWeight<Runtime>;
}

parameter_types! {
	pub const TransactionByteFee: Balance = 1;
}

impl pallet_transaction_payment::Config for Runtime {
	type OnChargeTransaction = CurrencyAdapter<Balances, ()>;
	type TransactionByteFee = TransactionByteFee;
	type WeightToFee = IdentityFee<Balance>;
	type FeeMultiplierUpdate = ();
}

impl pallet_sudo::Config for Runtime {
	type Event = Event;
	type Call = Call;
}

// Configure the pallet-subtensor in pallets/subtensor.
// parameter_types! {
// 	pub const SDebug:u64 = 0;
// 	pub const StepRho: u64 = 10;
// 	pub const StepKappa: u64 = 2;
// 	pub const SelfOwnership: u64 = 2;
// 	pub const InitialIssuance: u64 = 548833985028256;
// 	pub const InitialDifficulty: u64 = 10000;
// 	pub const MinimumDifficulty: u64 = 10000;
// 	pub const InitialActivityCutoff: u64 = 5000;
// 	pub const MaximumDifficulty: u64 = u64::MAX/4;
// 	pub const InitialAdjustmentInterval: u64 = 100;
// 	pub const InitialMaxRegistrationsPerBlock: u64 = 2;
// 	pub const InitialTargetRegistrationsPerInterval: u64 = 2;
// }
// impl pallet_subtensor::Config for Runtime {
// 	type Currency = Balances;
// 	type Event = Event;
// 	type TransactionByteFee = ();
// 	type SDebug = SDebug;
// 	type StepRho = StepRho;
// 	type StepKappa = StepKappa;
// 	type SelfOwnership = SelfOwnership;
// 	type InitialIssuance = InitialIssuance;
// 	type InitialDifficulty = InitialDifficulty;
// 	type MinimumDifficulty = MinimumDifficulty;
// 	type MaximumDifficulty = MaximumDifficulty;
// 	type InitialActivityCutoff = InitialActivityCutoff;
// 	type InitialAdjustmentInterval = InitialAdjustmentInterval;
// 	type InitialMaxRegistrationsPerBlock = InitialMaxRegistrationsPerBlock;
// 	type InitialTargetRegistrationsPerInterval = InitialTargetRegistrationsPerInterval;
// }

// Create the runtime by composing the FRAME pallets that were previously configured.
construct_runtime!(
	pub enum Runtime where
		Block = Block,
		NodeBlock = opaque::Block,
		UncheckedExtrinsic = UncheckedExtrinsic
	{
		System: frame_system::{Call, Event<T>},
		RandomnessCollectiveFlip: pallet_randomness_collective_flip::{Pallet},
		Timestamp: pallet_timestamp::{Call, Inherent},
		Aura: pallet_aura::{Pallet},
		Grandpa: pallet_grandpa::{Call, Event},
		Balances: pallet_balances::{Event<T>},
		TransactionPayment: pallet_transaction_payment::{Pallet},
		Sudo: pallet_sudo::{Call, Event<T>},
		//SubtensorModule: pallet_subtensor::{Pallet, Call, Storage, Event<T>}
	}
);

/// The address format for describing accounts.
pub type Address = sp_runtime::MultiAddress<AccountId, ()>;
/// Block header type as expected by this runtime.
pub type Header = generic::Header<BlockNumber, BlakeTwo256>;
/// Block type as expected by this runtime.
pub type Block = generic::Block<Header, UncheckedExtrinsic>;
/// The SignedExtension to the basic transaction logic.
pub type SignedExtra = (
	frame_system::CheckSpecVersion<Runtime>,
	//frame_system::CheckTxVersion<Runtime>,
	// frame_system::CheckGenesis<Runtime>,
	// frame_system::CheckEra<Runtime>,
	// frame_system::CheckNonce<Runtime>,
	// frame_system::CheckWeight<Runtime>,
	//pallet_transaction_payment::ChargeTransactionPayment<Runtime>
	// pallet_subtensor::ChargeTransactionPayment<Runtime>
);
/// Unchecked extrinsic type as expected by this runtime.
pub type UncheckedExtrinsic = generic::UncheckedExtrinsic<Address, Call, Signature, SignedExtra>;
/// Executive: handles dispatch to the various modules.
pub type Executive = frame_executive::Executive<
	Runtime,
	Block,
	frame_system::ChainContext<Runtime>,
	Runtime,
	AllPallets,
>;

impl_runtime_apis! {
	impl sp_api::Core<Block> for Runtime {
		fn version() -> RuntimeVersion {
			VERSION
		}

		fn execute_block(block: Block) {
			Executive::execute_block(block);
		}

		fn initialize_block(header: &<Block as BlockT>::Header) {
			Executive::initialize_block(header)
		}
	}

	impl sp_api::Metadata<Block> for Runtime {
		fn metadata() -> OpaqueMetadata {
			Runtime::metadata().into()
		}
	}

	impl sp_block_builder::BlockBuilder<Block> for Runtime {
		fn apply_extrinsic(extrinsic: <Block as BlockT>::Extrinsic) -> ApplyExtrinsicResult {
			Executive::apply_extrinsic(extrinsic)
		}

		fn finalize_block() -> <Block as BlockT>::Header {
			Executive::finalize_block()
		}

		fn inherent_extrinsics(data: sp_inherents::InherentData) -> Vec<<Block as BlockT>::Extrinsic> {
			data.create_extrinsics()
		}

		fn check_inherents(
			block: Block,
			data: sp_inherents::InherentData,
		) -> sp_inherents::CheckInherentsResult {
			data.check_extrinsics(&block)
		}
	}

	impl sp_transaction_pool::runtime_api::TaggedTransactionQueue<Block> for Runtime {
		fn validate_transaction(
			_source: TransactionSource,
			_tx: <Block as BlockT>::Extrinsic,
		) -> TransactionValidity {
			let provides: Vec<Vec<u8>> = vec![vec![1;10]];
			
			Ok(ValidTransaction {
				provides: provides,
				..Default::default()
			})
		}
	}

	impl sp_offchain::OffchainWorkerApi<Block> for Runtime {
		fn offchain_worker(header: &<Block as BlockT>::Header) {
			Executive::offchain_worker(header)
		}
	}

	impl sp_consensus_aura::AuraApi<Block, AuraId> for Runtime {
		fn slot_duration() -> sp_consensus_aura::SlotDuration {
			sp_consensus_aura::SlotDuration::from_millis(Aura::slot_duration())
		}

		fn authorities() -> Vec<AuraId> {
			Aura::authorities()
		}
	}

	impl sp_session::SessionKeys<Block> for Runtime {
		fn generate_session_keys(seed: Option<Vec<u8>>) -> Vec<u8> {
			opaque::SessionKeys::generate(seed)
		}

		fn decode_session_keys(
			encoded: Vec<u8>,
		) -> Option<Vec<(Vec<u8>, KeyTypeId)>> {
			opaque::SessionKeys::decode_into_raw_public_keys(&encoded)
		}
	}

	impl fg_primitives::GrandpaApi<Block> for Runtime {
		fn grandpa_authorities() -> GrandpaAuthorityList {
			Grandpa::grandpa_authorities()
		}

		fn submit_report_equivocation_unsigned_extrinsic(
			_equivocation_proof: fg_primitives::EquivocationProof<
				<Block as BlockT>::Hash,
				NumberFor<Block>,
			>,
			_key_owner_proof: fg_primitives::OpaqueKeyOwnershipProof,
		) -> Option<()> {
			None
		}

		fn generate_key_ownership_proof(
			_set_id: fg_primitives::SetId,
			_authority_id: GrandpaId,
		) -> Option<fg_primitives::OpaqueKeyOwnershipProof> {
			// NOTE: this is the only implementation possible since we've
			// defined our key owner proof type as a bottom type (i.e. a type
			// with no values).
			None
		}
	}

	impl frame_system_rpc_runtime_api::AccountNonceApi<Block, AccountId, Index> for Runtime {
		fn account_nonce(account: AccountId) -> Index {
			System::account_nonce(account)
		}
	}

	// impl pallet_transaction_payment_rpc_runtime_api::TransactionPaymentApi<Block, Balance> for Runtime {
	// 	fn query_info(
	// 		uxt: <Block as BlockT>::Extrinsic,
	// 		len: u32,
	// 	) -> pallet_transaction_payment_rpc_runtime_api::RuntimeDispatchInfo<Balance> {
	// 		TransactionPayment::query_info(uxt, len)
	// 	}
	// 	fn query_fee_details(
	// 		uxt: <Block as BlockT>::Extrinsic,
	// 		len: u32,
	// 	) -> pallet_transaction_payment::FeeDetails<Balance> {
	// 		TransactionPayment::query_fee_details(uxt, len)
	// 	}
	// }

	// #[cfg(feature = "runtime-benchmarks")]
	// impl frame_benchmarking::Benchmark<Block> for Runtime {
	// 	fn dispatch_benchmark(
	// 		config: frame_benchmarking::BenchmarkConfig
	// 	) -> Result<Vec<frame_benchmarking::BenchmarkBatch>, sp_runtime::RuntimeString> {
	// 		use frame_benchmarking::{Benchmarking, BenchmarkBatch, add_benchmark, TrackedStorageKey};

	// 		use frame_system_benchmarking::Pallet as SystemBench;
	// 		impl frame_system_benchmarking::Config for Runtime {}

	// 		let whitelist: Vec<TrackedStorageKey> = vec![
	// 			// Block Number
	// 			hex_literal::hex!("26aa394eea5630e07c48ae0c9558cef702a5c1b19ab7a04f536c519aca4983ac").to_vec().into(),
	// 			// Total Issuance
	// 			hex_literal::hex!("c2261276cc9d1f8598ea4b6a74b15c2f57c875e4cff74148e4628f264b974c80").to_vec().into(),
	// 			// Execution Phase
	// 			hex_literal::hex!("26aa394eea5630e07c48ae0c9558cef7ff553b5a9862a516939d82b3d3d8661a").to_vec().into(),
	// 			// Event Count
	// 			hex_literal::hex!("26aa394eea5630e07c48ae0c9558cef70a98fdbe9ce6c55837576c60c7af3850").to_vec().into(),
	// 			// System Events
	// 			hex_literal::hex!("26aa394eea5630e07c48ae0c9558cef780d41e5e16056765bc8461851072c9d7").to_vec().into(),
	// 		];

	// 		let mut batches = Vec::<BenchmarkBatch>::new();
	// 		let params = (&config, &whitelist);

	// 		add_benchmark!(params, batches, frame_system, SystemBench::<Runtime>);
	// 		add_benchmark!(params, batches, pallet_balances, Balances);
	// 		add_benchmark!(params, batches, pallet_timestamp, Timestamp);
	// 		add_benchmark!(params, batches, pallet_subtensor, SubtensorModule);
	// 		if batches.is_empty() { return Err("Benchmark not found for this pallet.".into()) }
	// 		Ok(batches)
	// 	}
	// }
}

```

