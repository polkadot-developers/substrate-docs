---
title: Custom pallets
description:
keywords:
---

The most common approach to building a custom runtime is to start with [existing pallets](/reference/frame-pallets/).
For example, you might start building an application-specific staking pallet that uses the types exposed in existing Collective and Balances pallets, but includes custom runtime logic required by your application and its staking rules.

Although [FRAME pallets](/reference/frame-pallets) provides an overview of the most common pallets, the best place to find current information about existing pallets is the [Rust API](/reference/rust-api/) documentation for crates tht use the naming convention `pallet_*`.

If you don't find a pallet that meets your needs, you can use FRAME macros to build the scaffolding for a custom pallet.

## Pallet macros and attributes

FRAME makes extensive use of Rust macros to encapsulate complex blocks of code.
The most important macros for building custom pallets is the [`pallet`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html) macro.
The `pallet` macro defines the core set of attributes that a pallet must provide.
For example:

- `#[pallet::pallet]` is a mandatory pallet attribute that enables you to define a structure (struct) for the pallet so it can store data that can be easily retrieved.
- `#[pallet::config]` is a mandatory pallet attribute that enables you to define the configuration trait for the pallet.

The `pallet` macro also defines the core set of attributes that pallets typically provide.
For example:

- `#[pallet::call]` is the attribute that enables you to implement dispatchable function calls for the pallet.
- `#[pallet::error]` is the attribute that enables you to generate dispatchable errors.
- `#[pallet::event]` is the attribute that enables you to generate dispatchable events.
- `#[pallet::storage]` is the attribute that enables you to generate a storage instance in the runtime and its metadata.

These core attributes align with the decisions you need to make when writing a custom pallet.
For example, you need to consider:

- Storage. What data does your pallet store? Is the data stored on-chain or off-chain?
- Functions. What are the callable functions that your pallet exposes?
- Transactionality. Are your function calls designed to atomically modify storage?
- Hooks. Will your pallet be making calls to any runtime hooks?

Macros simplify the code you need to write to implement custom runtime logic.
However, some macros enforce particular requirements on function declarations.
For example, the `Config` trait must be bound by `frame_system::Config` and the `#[pallet::pallet]` struct must be declared as `pub struct Pallet<T>(_);`.
For an overview of the macros used in FRAME pallets, see [FRAME macros](/reference/frame-macros/).

<!-- ## Useful FRAME traits

- Pallet Origin
- Origins: EnsureOrigin, EnsureOneOf
  ...

## Runtime implementation

Writing a pallet and implementing it for a runtime go hand in hand.
Your pallet's `Config` trait is what get's implemented for `Runtime` which is a special struct used to compile all implemented pallets in the `construct_runtime` macro.

- [`parameter_types`](https://paritytech.github.io/substrate/master/frame_support/macro.parameter_types.html) and [`ord_parameter_types`](https://paritytech.github.io/substrate/master/frame_support/macro.ord_parameter_types.html) macros are useful for passing in values to configurable pallet constants.
- [ other considerations like no_std ]
- Minimilistic runtime references
- Side chain architecture references
- Api endpoints: on_initialize, off_chain workers ?

Write content that links to basic and intermediate how-to guides. -->
