---
title: Configure runtime constants
description:
keywords:
  - basics
  - runtime
  - configurable constants
---

Declaring a constant value in a runtime is a useful tool to either define fixed values or define values that change dynamically according to some factor.
This guide shows you how to create pallet constants that are used to reset a `u32` value in storage.
This value, we'll call `SingleValue`, can also be modified using a method called `add_value`.

## Configure your pallet's types, events and errors

1. Define the constants in your pallet.

   - `MaxAddend` will be the value displayed in metadata.
   - `ClearFrequency` keeps track of the block numbers and will be used to reset `SingleValue`.

   ```rust
   #[pallet::config]
   pub trait Config: frame_system::Config {
   	type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

   	#[pallet::constant] // put the constant in metadata
   	/// Maximum amount added per invocation.
   	type MaxAddend: Get<u32>;

   	/// Frequency with which the stored value is deleted.
   	type ClearFrequency: Get<Self::BlockNumber>;
   }
   ```

1. Declare your storage items and events.

   Using the storage attribute macro, declare `SingleValue`, the value that gets modified every block cycle.

   ```rust
   #[pallet::storage]
   #[pallet::getter(fn single_value)]
   pub(super) type SingleValue<T: Config> = StorageValue<_, u32, ValueQuery>;
   ```

1. Define your pallet's events.

   ```rust
   #[pallet::event]
   #[pallet::generate_deposit(pub(super) fn deposit_event)]
   pub enum Event<T: Config> {
   	/// The value has been added to. The parameters are
   	/// (initial amount, amount added, final amount).
   	Added(u32, u32, u32),
   	/// The value has been cleared. The parameter is the value before clearing.
   	Cleared(u32)
   }
   ```

1. Add an error that handles operation overflow:

   ```rust
   #[pallet::error]
   pub enum Error<T> {
   	/// An operation would lead to an overflow.
   	Overflow
   }
   ```

## Create pallet methods and runtime constants

1. Configure `on_finalize`.

   `SingleValue` is set to 0 every `ClearFrequency` number of blocks in the `on_finalize` function that
   runs at the end of block execution. Specify this logic under the `#[pallet::hooks]` attribute:

   ```rust
   #[pallet::hooks]
   impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
   	fn on_finalize(n: T::BlockNumber) {
   		if (n % T::ClearFrequency::get()).is_zero() {
   			let current_value = <SingleValue<T>>::get();
   			<SingleValue<T>>::put(0u32);
   			Self::deposit_event(Event::Cleared(current_value));
   		}
   	}
   }
   ```

1. Create a method that allows users to specify the value.

   The `add_value` method increases `SingleValue` so long as each call adds to less than the `MaxAddend` value.

   For this method you must:

   - Include checks.
   - Keep track of the previous value.
   - Check for overflow.
   - Update `SingleValue`.

   ```rust
   // Extrinsics callable from outside the runtime.
   #[pallet::call]
   impl<T: Config> Pallet<T> {
   	#[pallet::weight(1_000)]
   	fn add_value(
   		origin: OriginFor<T>,
   		val_to_add: u32
   	) -> DispatchResultWithPostInfo {
   		let _ = ensure_signed(origin)?;
   		ensure!(val_to_add <= T::MaxAddend::get(), "value must be <= maximum add amount constant");
   		// previous value got
   		let c_val = SingleValue::<T>::get();
   		// checks for overflow when new value added
   		let result = c_val.checked_add(val_to_add).ok_or(Error::<T>::Overflow)?;
   		<SingleValue<T>>::put(result);
   		Self::deposit_event(Event::Added(c_val, val_to_add, result));
   		Ok(().into())
   	}
   }
   ```

1. Supply the constant value for your runtime.

   In `runtime/src/lib.rs`, declare the values for your pallet's runtime implementation of `MaxAddend` and `ClearFrequency`:

   ```rust
   parameter_types! {
   	pub const MaxAddend: u32 = 1738;
   	pub const ClearFrequency: u32 = 10;
   }

   impl constant_config::Config for Runtime {
   	type RuntimeEvent = RuntimeEvent;
   	type MaxAddend = MaxAddend;
   	type ClearFrequency = ClearFrequency;
   }
   ```

## Examples

- [`constant-config` example pallet](https://github.com/substrate-developer-hub/substrate-how-to-guides/blob/main/example-code/template-node/pallets/configurable-constant/src/lib.rs)

## Resources

- [Upgrade a running network](/tutorials/build-a-blockchain/upgrade-a-running-network/)
- [Get trait](https://paritytech.github.io/substrate/master/frame_support/traits/trait.Get.html)
- [Extra_constants](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#extra-constants-palletextra_constants-optional)
