---
title: Events and errors
description: Explains how to emit events and errors from the runtime.
keywords:
---

A pallet can emit events when it wants to notify about changes
or conditions in the runtime to external entities like users, chain explorers, or dApps.

You can define what events your pallet emits, what information is contained within those events, and
when those events are emitted.

## Declaring an event

Runtime events are created with the `#[pallet::event]` macro.

```rust
#[pallet::event]
#[pallet::metadata(u32 = "Metadata")]
pub enum Event<T: Config> {
	/// Set a value.
	ValueSet(u32, T::AccountId),
}
```

The `Event` enum needs to be declared in your runtime's configuration trait.

```rust
#[pallet::config]
	pub trait Config: frame_system::Config {
		/// The overarching event type.
		type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
	}
```

## Exposing events to your runtime

Your pallet's events need to be exposed to your node's runtime (`/runtime/src/lib.rs`).

First, you need to implement the `Event` type in your pallet's configuration trait:

```rust
// runtime/src/lib.rs
impl template::Config for Runtime {
	type Event = Event;
}
```

Then you need to add the `Event` type to your `construct_runtime!` macro:

```rust
// runtime/src/lib.rs
construct_runtime!(
	pub enum Runtime where
		Block = Block,
		NodeBlock = opaque::Block,
		UncheckedExtrinsic = UncheckedExtrinsic
	{
		// --snip--
		TemplateModule: template::{Pallet, Call, Storage, Event<T>},
		//--add-this------------------------------------->^^^^^^^^
	}
);
```

In this example, the event is a generic type and requires the `<T>` parameter.
The `<T>` parameter isn't needed if your events don't use generic types.

## Depositing an event

Substrate provides a default implementation of how to deposit an event using macros.
Depositing an event has the following structure:

```rust
// 1. Use the `generate_deposit` attribute when declaring the Events enum.
#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)] // <------ here ----
	#[pallet::metadata(...)]
	pub enum Event<T: Config> {
		// --snip--
	}

// 2. Use `deposit_event` inside the dispatchable function
#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::weight(1_000)]
		pub(super) fn set_value(
			origin: OriginFor<T>,
			value: u64,
		) -> DispatchResultWithPostInfo {
			let sender = ensure_signed(origin)?;
			// --snip--
			Self::deposit_event(RawEvent::ValueSet(value, sender));
		}
	}
```

The default behavior of this function is to call [`deposit_event`](https://paritytech.github.io/substrate/master/frame_system/pallet/struct.Pallet.html#method.deposit_event) from the FRAME system, which writes the event to storage.

This function places the event in the System pallet's runtime storage for that block.
At the beginning of a new block, the System pallet automatically removes all events that were stored from the previous block.

Events deposited using the default implementation are directly supported by downstream libraries like the [Polkadot-JS API](https://github.com/polkadot-js/api).
However, you can implement your own `deposit_event` function if you want to handle events differently.

## Supported types

Events can emit any type which supports type encoding using [SCALE codec](/reference/scale-codec).

In the case where you want to use Runtime generic types like `AccountId` or `Balances`, you need to
include a [`where` clause](https://doc.rust-lang.org/rust-by-example/generics/where.html) to define
those types as shown in the example above.

## Listening to events

The Substrate RPC does not directly expose an endpoint for querying events.
If you used the default implementation, you can see the list of events for the current block by querying the storage of the System pallet.
Otherwise, the [Polkadot-JS API](https://github.com/polkadot-js/api) supports a WebSocket subscription on runtime events.

## Errors

Runtime code should explicitly and gracefully handle all error cases, which is to say that runtime code **must** be "non-throwing", or must never
"[panic](https://doc.rust-lang.org/book/ch09-03-to-panic-or-not-to-panic.html)" to use Rust
terminology.
A common idiom for writing non-throwing Rust code is to write functions that return [`Result` types](https://paritytech.github.io/substrate/master/frame_support/dispatch/result/enum.Result.html).
The `Result` enum type possesses an `Err` variant that allows a function to indicate that it failed to execute successfully without needing to panic. Dispatchable calls in the FRAME system for runtime development _must_ return a [`DispatchResult` type](https://paritytech.github.io/substrate/master/frame_support/dispatch/type.DispatchResult.html) that _could_ be a [`DispatchError` variant](https://paritytech.github.io/substrate/master/frame_support/dispatch/enum.DispatchError.html) if the dispatchable function encountered an error.

Each FRAME pallet may define a custom `DispatchError` by using the `#[pallet::error]` macro.
For example:

```rust
#[pallet::error]
pub enum Error<T> {
		/// Error names should be descriptive.
		InvalidParameter,
		/// Errors should have helpful documentation associated with them.
		OutOfSpace,
	}
```

The FRAME Support module also includes a helpful [`ensure!` macro](https://paritytech.github.io/substrate/master/frame_support/macro.ensure.html) that can be used to check pre-conditions and emit an error if they are not met.

```rust
frame_support::ensure!(param < T::MaxVal::get(), Error::<T>::InvalidParameter);
```

## Where to go next

- [Frame macros](/reference/frame-macros)
- [Polkadot-JS API](https://github.com/polkadot-js/api).
- [`construct_runtime!` macro](https://paritytech.github.io/substrate/master/frame_support/macro.construct_runtime.html)
- [`#[frame_support::pallet]` macro](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html)
- [`[pallet::error]` macro](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#error-palleterror-optional)
