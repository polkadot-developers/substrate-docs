---
title: Rust for Substrate
description: Highlights the Rust programming conventions that are of particular importance when developing a Substrate blockchain.
keywords:
---

Much of what makes Substrate a flexible and extensible framework for creating mission-critical software is owed to [Rust](https://www.rust-lang.org/).
Being the language of choice for Substrate, Rust is a highly performant programming language and a first choice for the following reasons:

- Rust is fast: it's statically typed at compile time, making it possible for the compiler to optimize the code for speed and for developers to optimize for a specific compilation target.

- Rust is portable: it's designed to run on embedded devices with support for any type of operating system.

- Rust is memory safe: it has no garbage collector and it checks each and every variable you use and every memory address you reference to avoid any memory leaks.

- Rust is Wasm first: it has first class support for compiling to WebAssembly.

## Rust in Substrate

In the [Architecture](/learn/architecture/) section, you will learn that Substrate is made of two distinct architectural components: the outer node and the runtime.
While more complex features in Rust such as multithreading and asynchronous Rust are used in the outer node code, they aren't directly exposed to runtime engineers, making it easier for runtime engineers to focus on the business logic of their node.

Generally, depending on their focus, developers should expect to know:

- Basic [Rust idioms](https://rust-unofficial.github.io/patterns/idioms/index.html), [working with `no_std`](https://docs.rust-embedded.org/book/intro/no-std.html) and what macros are used and why (for runtime engineering).
- [Asynchronous Rust](https://rust-lang.github.io/async-book/01_getting_started/01_chapter.html) (for more advanced developers working with outer node (client) code).

Although general familiarity with Rust is essential before diving into Substrate—and there are many resources available for learning Rust, including the [Rust Language Programming Book](https://doc.rust-lang.org/book/) and [Rust by Example](https://doc.rust-lang.org/rust-by-example/)—the remainder of this section highlights ways Substrate uses some of Rust's core features for developers getting started with runtime engineering.

## Compilation target

When building a Substrate node, we use the `wasm32-unknown-unknown` compilation target which means that Substrate runtime engineers are constrained to writing runtimes that must compile to Wasm.
This implies that you can't rely on some typical standard library types and functions and must only use `no_std` compatible crates for the majority of runtime code.
Substrate has a lot of its of own primitive types and associated traits that make it possible to work around the `no_std` requirement.

## Macros

As you learn how to use and write FRAME pallets, you'll see there are many macros available as reusable code to abstract common tasks or enforce runtime-specific requirements.
These macros allow you to focus on writing idiomatic Rust and application-specific logic instead of the common code required to interact with a runtime.

Rust macros are a powerful tool to help ensure certain requirements are met (without re-writing code) such as the logic to be formatted in a specific way, specific checks are made, or some logic consists of specific data structures.
This is especially useful to help developers write code that can integrate with the complexity of a Substrate runtime.
For example, the `#[frame_support::pallet]` macro is required in all FRAME pallets to help you correctly implement certain required attributes-such as storage items or externally callable functions-and make it compatible with the build process in `construct_runtime`.

Developing Substrate runtimes involves heavy use of Rust's attribute macros, which come in two flavors: derive attributes and custom attributes.
When you're getting started with Substrate, it isn't so important to know exactly how they work, but rather to know that they exist that they empower you to write correct runtime code.

Derive attributes are useful for custom runtime types that need to satisfy certain traits, for instance, to have types be decodable by a node during runtime execution.

Other attribute like macros are also common throughout Substrate's codebase for:

- Specifying whether a code snippet only compiles to `no_std` or can use the `std` library.
- Building custom FRAME pallets.
- Specifying the way the runtime is built.

## Generics and configuration traits

Often compared to interfaces in languages like Java, traits in Rust provide ways to give advanced functionality to a type.

If you've read about pallets, you've probably noticed that every pallet has a `Config` trait which allows you to define the types and interfaces a pallet depends on.

This trait itself inherits a number of core runtime types from the `frame_system::pallet::Config` trait, making it easy to access common types when writing runtime logic.
In addition, in any FRAME pallet the `Config` trait is generic over `T` (more on generics in the next section).
Some common examples of these core runtime types could be `T::AccountId`, the common type for identifying user accounts in the runtime or `T::BlockNumber`, the block number type used by the runtime.

For more information about generic types and traits in Rust, see the sections on [Generic Types](https://doc.rust-lang.org/book/ch10-01-syntax.html), [Traits](https://doc.rust-lang.org/book/ch10-02-traits.html) and [Advanced traits](https://doc.rust-lang.org/book/ch19-03-advanced-traits.html) from the Rust book.

With Rust generics, Substrate runtime developers can write pallets that are completely agnostic to specific implementation details and therefore make full use of Substrate's flexibility, extensibility and modularity.

All types in the `Config` trait are defined generically using trait bounds and made concrete in the runtime implementation.
This not only means that you can write pallets that support different specifications for the same type (e.g. addresses for both Substrate and Ethereum chains), but you can also customize generic implementations to your needs with minimal overhead (e.g. change block number to `u32`).

This gives developers the flexibility of writing code that makes no assumptions about the core blockchain architecture decisions you have made.

Substrate maximizes the use of generic types to provide maximum flexibility.
You define how the generic types are resolved to suit your purpose.

For more information about generic types and traits in Rust, see the sections on [Generic Types](https://doc.rust-lang.org/book/ch10-01-syntax.html) from the Rust book.

## Where to go next

Now that you know how Substrate relies on a few key Rust features—like traits, generic types, and macros—you can explore the following resources to learn more.

- [Rust book](https://doc.rust-lang.org/book/)
- [Why Rust?](https://www.parity.io/blog/why-rust) (blog by Parity)
- [Cargo and crates.io](https://doc.rust-lang.org/book/ch14-00-more-about-cargo.html)
- [Why Rust for smart contracts?](https://paritytech.github.io/ink-docs/why-rust-for-smart-contracts) (ink! documentation)
