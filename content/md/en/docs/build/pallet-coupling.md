---
title: Pallet coupling
description:
keywords:
  - coupling
  - pallet design
---

<div class="warning">
	 Please refer to the <a href="https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/reference_docs/frame_pallet_coupling/index.html">Rust Docs</a> for the most up-to-date documentation on this topic.
</div>

The term **coupling** is often used to describe the degree to which two software modules depend on each other.
For example, in object-oriented programming tight coupling and loose coupling are used to describe the relationship between objects classes:

- Tight coupling is when two groups of classes are dependent on each other.
- Loose coupling is when a class uses an interface that another class exposes.

In Substrate, **tight pallet coupling** and **loose pallet coupling** are used to describe how a pallet can call functions in another pallet.
Both techniques achieve the same thing in different ways, each having certain trade-offs.

## Tightly coupled pallets

Because tight coupling makes working with pallets less flexible and extensible, you would only use tight pallet coupling if a pallet requires inheriting its coupled counterpart _as a whole_ rather than specific types or methods.

When writing a pallet that requires tight coupling, you explicitly specify the pallet's `Config` trait to be bound by the `Config` trait of the pallet to couple with.

All FRAME pallets are tightly coupled to the `frame_system` pallet.
The following example illustrates how to use the `Config` trait of a pallet called `some_pallet` to be tightly coupled with the `frame_system` pallet:

```rust
pub trait Config: frame_system::Config + some_pallet::Config {
    // --snip--
}
```

This is very similar to using class inheritance in object-oriented programming.
Supplying this trait bound implies that this pallet can only be installed in a runtime that also has `some_pallet` pallet installed.
Similar to `frame_system`, the tight coupling in this example would require you to specify `some_pallet` in the coupled pallet's **Cargo.toml** file.

Tight coupling has several disadvantages developers should take into account:

- **Maintainability**: changes in one pallet will often result in needing to modify the other pallet.
- **Reusability**: both modules must be included for one to be used, making it more difficult to
  integrate a tightly coupled pallet.

## Loosely coupled pallets

In loose pallet coupling, you can specify the traits and function interfaces that
certain types need to be bound by.

The actual implementation of such types happens **outside of the pallet** during the runtime configuration—typically as code defined in the `/runtime/src/lib.rs` file. With loose coupling, you can use types and interfaces from another pallet that has implemented the traits, or you can declare a totally new struct,
implement those traits, and assign it when implementing the pallet in runtime.

As an example, assume you have a pallet that can access account balances and
make transfers to another account.
This pallet defines a `Currency` trait, which has an **abstract function interface** that will implement the actual transfer logic later.

```rust
pub trait Currency<AccountId> {
    // -- snip --
    fn transfer(
        source: &AccountId,
        dest: &AccountId,
        value: Self::Balance,
        // don't worry about the last parameter for now
        existence_requirement: ExistenceRequirement,
    ) -> DispatchResult;
}
```

In a second pallet, you define the `MyCurrency` associated type and bind it by
`Currency<Self::AccountId>` trait so that you can use the balance transfer logic by calling `T::MyCurrency::transfer(...)`.

```rust
pub trait Config: frame_system::Config {
    type MyCurrency: Currency<Self::AccountId>;
}

impl<T: Config> Pallet<T> {
    pub fn my_function() {
        T::MyCurrency::transfer(&buyer, &seller, price, ExistenceRequirement::KeepAlive)?;
    }
}
```

Notice that, at this point, you have not specified how the `Currency::transfer()` logic will be implemented.
It is only agreed upon that it will be implemented somewhere.

Now, you can use the runtime configuration—`runtime/src/lib.rs`—to implement the
pallet and specify the type to be `Balances`.

```rust
impl my_pallet::Config for Runtime {
    type MyCurrency = Balances;
}
```

The `Balances` type is specified in `construct_runtime!` macro as part of the [`pallet_balances`](https://paritytech.github.io/substrate/master/pallet_balances/index.html) that implements the [`Currency` trait](https://paritytech.github.io/substrate/master/pallet_balances/index.html#implementations-1).

With the implementation provided by the runtime, you can make use of `Currency<AccountId>` trait in your loosely coupled pallet.

Many FRAME pallets are coupled to this [Currency trait](https://paritytech.github.io/substrate/master/frame_support/traits/tokens/currency/trait.Currency.html) in this way.

## Choosing a pallet coupling strategy

In general, loose coupling provides more flexibility than tight coupling and is considered a better practice from a system design perspective.
It guarantees better maintainability, reusability, and extensibility of your code.
However, tight coupling can be useful for pallets that are less complex or that have more overlap in methods and types than differences.

In FRAME, there are two pallets that are tightly coupled to [`pallet_treasury`](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/treasury):

- [Bounties pallet](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/bounties)
- [Tipping pallet](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/tips)

As a general rule, the more complex a pallet is, the less desirable it is to tightly couple it.
This evokes a concept in computer science called [cohesion](<https://en.wikipedia.org/wiki/Cohesion_(computer_science)>), a metric used to examine the overall quality of a software system.

## Where to go next

- [How-to: Use loose coupling](/reference/how-to-guides/pallet-design/use-loose-coupling/)
- [How-to: Use tight coupling](/reference/how-to-guides/pallet-design/use-tight-coupling/)
