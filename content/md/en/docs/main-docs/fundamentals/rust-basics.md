---
title: Rust for Substrate
description: Highlights the Rust programming conventions that are of particular importance when developing a Substrate blockchain.
featured_image:
--- 

[Rust](https://www.rust-lang.org/) is a highly performant, memory safe and efficient programming language and a first choice for Substrate for the following reasons:

- Rust is friendly: it's compiled, meaning that the compiler won’t ever let you write unsafe code that could crash your program at runtime.

- Rust is fast: it's statically typed at compile time, making it possible for the compiler to optimize the code for speed and for developers to optimize for a specific compilation target.

- Rust is portable: it's designed to run on embedded devices with support for any type of operating system.

- Rust is memory safe: it has no garage collector and employs a robust ownership paradigm to avoid any memory leaks.

- Rust is Wasm first: it has first class support for compiling to WebAssembly.

Much of what makes Substrate a flexible and extensible framework for creating mission-critical software is owed to Rust.

Although general familiarity with Rust is essential before diving into Substrate—and there are many resources available for learning Rust, including the [Rust Language Programming Book](https://doc.rust-lang.org/book/) and [Rust by Example](https://doc.rust-lang.org/rust-by-example/)—this section highlights ways Substrate uses some of Rust's core features for developers getting started with runtime engineering.
## Compilation target

When building a Substrate node, we use the `wasm32-unknown-unknown` compilation target which means that Substrate runtime engineers are constrained to writing runtimes that must compile to Wasm. 
This implies that you can't rely on some typical standard library types and functions and must only use `no_std` compatible crates for the majority of runtime code. 
Substrate has a lot of its of own primitive types and associated traits that make it possible to work around the `no_std` requirement. 
## Macros 

When you learn about writing FRAME pallets, you will quickly come across a variety of different types of macros designed to abstract and enforce any runtime specific requirements.
With them, you're able to focus on writing idiomatic Rust, minimizing the overhead of writing extra code that you would otherwise need to write code that correctly interacts with a runtime.

Rust macros are a powerful tool to help ensure certain requirements are met (without re-writing code) such as the logic to be formatted in a specific way, specific checks are made, or some logic consists of specific data structures.
This is especially useful to help developers write code that can integrate with the complexity of a Substrate runtime.
For example, the `#[frame_system::pallet]` macro is required in all FRAME pallets to prevent you from compiling pallets that don't correctly implement certain required attributes, such as storage items or externally callable functions.

The reality is that developing Substrate runtimes involves heavy use of Rust's attribute macros, which come in two flavors: derive attributes and custom attributes.
When you're getting started with Substrate, it isn't so important to know exactly how they work, but rather to know that they exist that they empower you to write correct runtime code.

Derive attributes are useful for custom runtime types that need to satisfy a number of traits. 
For instance, any type of this sort needs to be encodable and decodable so that a node can interact with it during runtime execution.

Substrate provides its own set of traits to help declare the intended behaviour of a custom type for the runtime and uses the `#[derive]` macro to do this.

These include:

* `Encode`: Enables the runtime to serialize a custom type into bytes.
* `Decode`: Enables any application to be able to deserialize bytes into the specific custom type.
* `TypeInfo`: Provides useful information to the Runtime Metadata about the type.
* `MaxEncodedLen`: Ensures that the type is bounded in size.
* `RuntimeDebug`: Allow a type to be printed to the console; useful for tests.

In Substrate, the Rust compiler will likely give you errors if you don't correctly implement these traits for your runtime types.
So to enforce any requirements a type may need, you must tell the compiler what to expect. 
For example:

```rust
#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, RuntimeDebug, Eq, PartialEq, Clone, Copy)]
pub struct RuntimeType {
    pub field1: [u8; 16],
    pub field2: Option<u32>,
}
```

Other traits from Rust's standard library are useful too in some cases, such as:

* `Eq` and `PartialEq`: To check that two structs are equal.
* `Clone` and `Copy`: To allow an struct to be duplicated.

Other attribute like macros are also common throughout Substrate's codebase for:
* Telling the compiler if code snippets are meant to compile to `no_std` or may access the `std` library or not.
* Custom FRAME support macros for writing pallets.
* Specifying the way the runtime in built.

## Configuration traits

Often compared to interfaces in languages like Java, traits in Rust provide ways to give advanced functionality to a type.

If you've read about pallets, you've probably noticed that every pallet has a `Config` trait which allows you to define the types and interfaces a pallet depends on. 

This trait itself inherits a number of core runtime types from the `frame_system::pallet::Config` trait, making it easy to access common types when writing runtime logic.
In addition, in any FRAME pallet the `Config` trait is generic over `T` (more on generics in the next section).
Some common examples of these core runtime types could be `T::AccountId`, the common type for identifying user accounts in the runtime or `T::BlockNumber`, the block number type used by the runtime.

For more information about generic types and traits in Rust, see the sections on [Generic Types](https://doc.rust-lang.org/book/ch10-01-syntax.html), [Traits](https://doc.rust-lang.org/book/ch10-02-traits.html) and [Advanced traits](https://doc.rust-lang.org/book/ch19-03-advanced-traits.html) from the Rust book.

## Generics

With Rust generics, Substrate runtime developers can write pallets that are completely agnostic to specific implementation details and therefore make full use of Substrate's flexibility, extensibility and modularity. 

All types in the `Config` trait are defined generically using trait bounds and made concrete in the runtime implementation. 
This not only means that you can write pallets that support different specifications for the same type (e.g. addresses for both Substrate and Ethereum chains), but you can also customize generic implementations to your needs with minimal overhead (e.g. change block number to `u32`).

This gives developers the flexibility of writing code that makes no assumptions about the core blockchain architecture decisions you have made.

Substrate maximizes the use of generic types to provide maximum flexibility.
You define how the generic types are resolved to suit your purpose.

For more information about generic types and traits in Rust, see the sections on [Generic Types](https://doc.rust-lang.org/book/ch10-01-syntax.html) from the Rust book.

## Common traits

In many cases, multiple pallets need to use a common set of traits and types.
For example, an account balance should have the same set of traits and types—the same meaning—in any pallet that needs access to this information.
Instead of defining the same implementation of balances in each pallet that requires it, you can add any pallet that implements a `Currency` trait to convert generic types into specific types in the runtime implementation.

If the associated type adheres to the trait bounds of a [`Currency`](https://docs.substrate.io/rustdocs/latest/frame_support/traits/tokens/currency/index.html) trait, it can simply pass in the runtime's instance of [`pallet_balances`](https://docs.substrate.io/rustdocs/latest/pallet_balances/index.html) across all pallets that rely on the same notion for currency.

For example, [`pallet_staking`](https://docs.substrate.io/rustdocs/latest/pallet_staking/trait.Config.html) has an associated type `Currency` whose trait bound is [`LockableCurrency`](https://docs.substrate.io/rustdocs/latest/frame_support/traits/tokens/currency/trait.LockableCurrency.html).
Given that [`pallet_balances`](https://docs.substrate.io/rustdocs/latest/pallet_balances/index.html) implements this trait, any runtime that includes the balances pallet can make the generic associated type concrete assigning it the balances pallets' runtime instance.
## Where to go next

Now that you know how Substrate relies on a few key Rust features—like traits, generic types, and macros—you can explore the following resources to learn more.

* [Rust book](https://doc.rust-lang.org/book/)
* [Why Rust?](https://www.parity.io/blog/why-rust)
* [Cargo and crates.io](https://doc.rust-lang.org/book/ch14-00-more-about-cargo.html)
* [Why Rust for smart contracts?](https://paritytech.github.io/ink-docs/why-rust-for-smart-contracts)


## Rewrite

Learning objectives:

- For Rust developers: recognize things that Substrate leverages in Rust, which libraries etc. (no_std, error catching)

- Justify and identify Substrate's use of macros

- For non-Rust devs: understand the key features of Rust (borrow checker, generics, and traits) and which are most important for becoming a runtime engineer (skip async alltogether)


Keith:

- we write a piece of code that depends on language features that aren't stabilized or doesn't even exist yet
- about what is necessary for how we use Rust in Substrate, the one important thing that we often don't use quite as often is the concept of borrowing and lifetimes
- we sometimes avoid it altogether because we know most people aren't expert Rust developers, and so most of the runtime code doesn't require users to fiddle around with lifetime issues until some code finally compiles


Macros:
- the unique things about what we do with Rust in Substrate is the amount of macros that we use to create Rust-like syntax for runtime development 
- construct_runtime for example doesn't contain proper Rust code, yet it feels Rustic because we try very hard not to veer off too far from what feels like proper Rust syntax when the situation calls for it
- however it's good to keep in mind that at the end of the day, it's all Rust code, so even the macro magic that we have created for the pallets interoperates with other Rust constructs seamlessly

Crates / no_std compatibility:
- if there are some Rust crates that you want to include to your runtime and utilize exported functions thereof, they would just work out of the box (literally and figuratively), because it's all Rust code

- but do remember that pallets run in no_std, so the crates that you include must also be no_std compatible
- the other thing is that most code in Substrate is no_std, meaning we can't rely on some standard library types and functions, such as BTreeMap, but we do have the basic one such as Vec

Sam:
- for what devs need to know about substrate, id say understanding how to use Cargo,building, running locally, how pallets are added and referenced, benchmarking framework and tests!












