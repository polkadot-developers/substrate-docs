---
title: Events and errors
description: Explains how to emit events and errors from the runtime.
keywords: []
---

A pallet can emit events when it wants to notify external entities about changes
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

<br />
<Message
  type={`gray`}
  title={`Note`}
  text={`You may or may not need the \`<T>\` parameter depending on whether your events use generic
  types. In our example it does, and is included above.`}
/>

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

The default behavior of this function is to call
[`deposit_event`](/rustdocs/latest/frame_system/pallet/struct.Pallet.html#method.deposit_event)
from the FRAME system, which writes the event to storage.

This function places the event in the System pallet's runtime storage for that block. At the
beginning of a new block, the System pallet automatically removes all events that were stored from
the previous block.

Events deposited using the default implementation will be directly supported by downstream libraries
like the [Polkadot-JS API](/v3/integration/polkadot-js), however you can implement your own
`deposit_event` function if you want to handle events differently.

## Supported types

Events can emit any type which supports the [Parity SCALE codec](/v3/advanced/scale-codec).

In the case where you want to use Runtime generic types like `AccountId` or `Balances`, you need to
include a [`where` clause](https://doc.rust-lang.org/rust-by-example/generics/where.html) to define
those types as shown in the example above.

## Listening to events

The Substrate RPC does not directly expose an endpoint for querying events. If you used the default
implementation, you can see the list of events for the current block by querying the storage of the
System pallet. Otherwise, the [Polkadot-JS API](/v3/integration/polkadot-js) supports a WebSocket
subscription on runtime events.

## Errors

Runtime code should explicitly and gracefully handle all error cases, which is to say that runtime
code **must** be "non-throwing", or must never
"[panic](https://doc.rust-lang.org/book/ch09-03-to-panic-or-not-to-panic.html)" to use Rust
terminology. A common idiom for writing non-throwing Rust code is to write functions that return
[`Result` types](/rustdocs/latest/frame_support/dispatch/result/enum.Result.html).
The `Result` enum type possesses an `Err` variant that allows a function to indicate that it failed
to execute successfully without needing to panic. Dispatchable calls in the FRAME system for runtime
development _must_ return a
[`DispatchResult` type](/rustdocs/latest/frame_support/dispatch/type.DispatchResult.html)
that _could_ be a
[`DispatchError` variant](/rustdocs/latest/frame_support/dispatch/enum.DispatchError.html)
if the dispatchable function encountered an error.

Each FRAME pallet may define a custom `DispatchError` by using the [`#[pallet::error]` macro](../macros#palleterror).
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

The
[Substrate node template](https://github.com/substrate-developer-hub/substrate-node-template/blob/master/pallets/template/src/lib.rs#L85-L103)
demonstrates some ways to correctly handle errors in dispatchable functions. The FRAME Support
module also includes a helpful
[`ensure!` macro](/rustdocs/latest/frame_support/macro.ensure.html) that can be
used to check pre-conditions and emit an errors if they are not met.

```rust
frame_support::ensure!(param < T::MaxVal::get(), Error::<T>::InvalidParameter);
```

## Next steps

### Learn more

- Learn more about the [macros](/v3/runtime/macros) used in Substrate runtime development.
- Learn more about using the [Polkadot-JS API](/v3/integration/polkadot-js).

### Examples

- Learn about Events and Errors by completing the [Substrate Kitties tutorial](/tutorials/v3/kitties/pt1#dispatchables-events-and-errors)

### References

- [`construct_runtime!` macro](/rustdocs/latest/frame_support/macro.construct_runtime.html)
- [`#[frame_support::pallet]` macro](/rustdocs/latest/frame_support/attr.pallet.html)
- [`[pallet::error]` macro](/rustdocs/latest/frame_support/attr.pallet.html#error-palleterror-optional)
