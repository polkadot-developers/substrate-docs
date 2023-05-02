---
title: Incorporate pseudo-randomness (not secure)
description: On-chain randomness techniques and tools detailed.
keywords:
  - pallet design
  - intermediate
  - runtime
  - randomness
---

Randomness is used in computer programs for many applications. For example, gaming applications, NFT creation, and selecting block authors all require a degree of randomness.

True randomness is hard to come by in deterministic computers.
This is particularly true in the context of a blockchain, when all the nodes in the network must agree on the state of the chain.
FRAME provides runtime engineers with a source of [on-chain randomness](/build/randomness/), using the [Randomness trait](https://paritytech.github.io/substrate/master/frame_support/traits/trait.Randomness.html).

This guide explains how to make use of FRAME's Randomness trait by using the `random` method and a nonce as a subject.
The guide also illustrates how to add some entropy to the randomness value by assigning the `InsecureRandomCollectiveFlip` pallet to the configuration trait of a pallet that exposes a "random" type.

**Note that the `InsecureRandomCollectiveFlip` is not a secure source of randomness, this guide is intended for educational purposes only.**

## Import `Randomness`

1. In the pallet you want to use, import the [`Randomness`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.Randomness.html) trait from `frame_support`:

   ```rust
   use frame_support::traits::Randomness;
   ```

1. Include it in your pallet's configuration trait:

   ```rust
   #[pallet::config]
   pub trait frame_system::Config {
   	type MyRandomness: Randomness<Self::Hash, Self::BlockNumber>;
   }
   ```

   Note that the `Randomness` trait specifies a generic return of type `Output` and `BlockNumber`.
   Use [`BlockNumber`](https://paritytech.github.io/substrate/master/frame_system/pallet/trait.Config.html#associatedtype.BlockNumber)
   and [`Hash`](https://paritytech.github.io/substrate/master/frame_system/pallet/trait.Config.html#associatedtype.Hash) from `frame_system` in your pallet to satisfy that trait requirement.

   As stated in [this trait's documentation](https://paritytech.github.io/substrate/master/frame_support/traits/trait.Randomness.html), at best, this trait can give you randomness which was hard to predict a long time ago but that has become easy to predict recently.
   Keep this in mind when you evaluate your use of it.

## Create a nonce and use it in your randomness implementation

Use a nonce to serve as a subject for the `frame_support::traits::Randomness::random(subject: &[u8])` method.

1. There are two steps to including a nonce in your pallet:

   - **Create a `Nonce` storage item.** The storage item can be type `u32` or `u64`.

   - **Create a private nonce function.** This function increments the nonce each time it's used.

   The `increment_nonce()` private function can be implemented in such a way that it both returns and updates the nonce.
   For example:

   ```rust
   fn get_and_increment_nonce() -> Vec<u8> {
   	let nonce = Nonce::<T>::get();
   	Nonce::<T>::put(nonce.wrapping_add(1));
   	nonce.encode()
   }
   ```

   To learn more about the wrapping and encoding methods, see [`wrapping_add`](https://doc.rust-lang.org/std/intrinsics/fn.wrapping_add.html) and [`encode`](https://paritytech.github.io/substrate/master/frame_support/dispatch/trait.Encode.html#method.encode) in the Rust documentation.

1. Use Randomness in a dispatchable.

   Using the nonce, you can call the `random()` method that `Randomness` exposes.
   The code snippet below is a mock example that assumes relevant events and storage items have been implemented:

   ```rust
   #[pallet::weight(100)]
   pub fn create_unique(
   	origin: OriginFor<T>)
   	-> DispatchResultWithPostInfo {
   	// Account calling this dispatchable.
   	let sender = ensure_signed(origin)?;
   		// Random value.
   		let nonce = Self::get_and_increment_nonce();
   		let (randomValue, _) = T::MyRandomness::random(&nonce);
   	// Write the random value to storage.
   	<MyStorageItem<T>>::put(randomValue);
   	Self::deposit_event(Event::UniqueCreated(randomValue));
   }
   ```

1. Update your pallet's runtime implementation.

   Because you have added a type to your pallet's configuration trait, `Config` opens up the opportunity to further enhance the randomness derived by the `Randomness` trait.
   This is accomplished by using the [Insecure Randomness Collective Flip pallet](https://paritytech.github.io/substrate/master/pallet_insecure_randomness_collective_flip/index.html).

   Using this pallet alongside the `Randomness` trait will significantly improve the entropy being processed by `random()`.

   In `runtime/src/lib.rs`, assuming `pallet_insecure_randomness_collective_flip` is instantiated in `construct_runtime` as `RandomCollectiveFlip`, specify your exposed type in the following way:

   ```rust
   impl my_pallet::Config for Runtime{
   	type Event;
   	type MyRandomness = RandomCollectiveFlip;
   }
   ```

## Examples

- [Randomness used in BABE](https://github.com/paritytech/substrate/blob/master/frame/babe/src/randomness.rs)
- [FRAME's Lottery pallet](https://github.com/paritytech/substrate/blob/master/frame/lottery/src/lib.rs#L471)

## Related material

- [Verifiable Random Functions](https://en.wikipedia.org/wiki/Verifiable_random_function)
