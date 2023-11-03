---
title: Select collators
description:
keywords:
  - collator
  - parachain
  - cumulus
  - design
  - selection
  - economic
  - game theory
---

This guide is useful for teams getting ready for their parachain launch in production, exploring the different options in collator selection.

It is important for a parachain networks' collators are set to ensure that there exist _some_ neutral collators to prevent censorship &mdash; but not necessarily a majority.
It is also important to avoid having too many collators as they may slow down the network.
This guide steps through the considerations to take into account when designing a parachain network.

## Collator selection

You are free to choose your method of collator selection.
Common methods include stake voting or directly assigning collators via committee or other origins such as democracy.
In both cases, create a pallet to implement the logic that best fits your needs.

### Stake voting

The Cumulus [`collator-selection` pallet](https://github.com/paritytech/polkadot-sdk/blob/master/cumulus/pallets/collator-selection/src/lib.rs) is a practical example on implementing stake voting to select collators.

### Using on-chain governance

Implement a special origin that allows members of that origin to become a collator. Use the
democracy pallet to elect these members and define them in your pallet dedicated to handling
collator selection:

```rust
    /// Configuration trait of this pallet.
	#[pallet::config]
	pub trait Config: frame_system::Config {
        // --snip-- //
        type MySpecialOrigin: EnsureOrigin<Self::RuntimeOrigin>;
    }
    // --snip-- //
    #[pallet::call]
	impl<T: Config> Pallet<T> {
		/// Some set-collator dispatchable.
		#[pallet::weight(some_weight)]
		pub fn set_collator( origin: OriginFor<T>) -> DispatchResultWithPostInfo {
            T::MySpecialOrigin::ensure_origin(origin)?;
            // --snip-- //
        }
```

There are also different ways to implement incentives for collators.
Take a look at [this example](https://github.com/PureStake/moonbeam/blob/master/pallets/parachain-staking/src/lib.rs) to explore how.

## Examples

- [Cumulus implementation](https://github.com/paritytech/polkadot-sdk/blob/master/cumulus/pallets/collator-selection/src/lib.rs)
  of collator selection with incentives using transaction fees.
- [Moonbeam implementation](https://github.com/PureStake/moonbeam/blob/master/pallets/parachain-staking/src/lib.rs)
  of collator selection using an inflationary monetary policy staking scheme.

## Resources

- [Parachain DevOps best practices](https://gist.github.com/lovelaced/cddc1c7234b883ee37e71cf4a1d63cac)
