---
title: Rust for Substrate
description: Highlights the Rust programming conventions that are of particular importance when developing a Substrate blockchain.
featured_image:
--- 

[Rust](https://www.rust-lang.org/) is a highly performant, type safe, and memory efficient programming language.
When you write programs in Rust, the Rust compiler checks your code before producing an executable, reducing the likelihood that your code will introduce memory leaks or other errors.

Substrate takes advantage of some key features of the Rust programming language to provide a flexible framework for creating mission-critical software.
Substrate abstracts some elements of the Rust programming language to make it easier to build the software to suit your needs without requiring you to become an expert in Rust.
Although some familiarity with Rust in essential—and there are many resources available for learning Rust, including the [Rust Language Programming Book](https://doc.rust-lang.org/book/) and [Rust by Example](https://doc.rust-lang.org/rust-by-example/)—this section focuses on the core components of Rust that are most important for building a Substrate blockchain and developing the runtime logic.

## Traits and generics

One of the powerful features of Rust that Substrate takes full advantage of is the Rust **trait** system.
In Rust, traits define what can be done by different types and how different types can interact with each other.
Traits enable you to define shared behavior in an abstract way.
You can then use **trait bounds** to specify that a **generic type** can be any type that has a certain behavior.

Rust's trait system enables different types to call the same set of methods to return different results.
Substrate uses the trait system to specify the set of operations that can be performed on a generic type.
Because the behaviors are defined on a generic type, you can reuse and adapt domain-specific logic by modifying the type bounds to suit a specific context.
Substrate maximizes the use of generic types to provide maximum flexibility.
You define how the generic types are resolved to suit your purpose.

For more information about generic types and traits in Rust, see [Generic Types, Traits, and Lifetimes](https://doc.rust-lang.org/book/ch10-00-generics.html) and [Advanced traits](https://doc.rust-lang.org/book/ch19-03-advanced-traits.html).

## Configuration traits

One of the most common ways Susbtrate uses the trait abstraction is in the `frame_system` pallet.
The [`Config`](https://docs.substrate.io/rustdocs/latest/frame_system/pallet/trait.Config.html) declares the set of types that are most commonly used when developing a Substrate runtime.
The `Config` trait eliminates the need to repeat code to declare types that are used in several places, such as `AccountId`.
Instead, any pallet can refer to an `AccountId` type by using the generic `T`:

```rust
T::AccountId;
```

The generic type is only assigned a concrete type for a specific runtime implementation.
For example, the `AccountId` type remains a generic type until the runtime implementation of `frame_system::Config` where `AccountId` is specified as:

```rust
// In the `runtime/src/lib.rs` file of the Substrate node template.
pub type AccountId = <<Signature as Verify>::Signer as IdentifyAccount>::AccountId;
```

The `frame_system::Config` trait is constrained by its associated types.
Further, each type is constrained by specific traits.
This makes it possible to use `AccountId` generically so long as it satisfies those constraints.
For example, [`AccountId`](https://docs.substrate.io/rustdocs/latest/frame_system/pallet/trait.Config.html#associatedtype.AccountId) is bound by the following traits:

```rust
/// The user account identifier type for the runtime.
type AccountId: Parameter
 + Member
 + MaybeSerializeDeserialize
 + Debug
 + MaybeDisplay
 + Ord
 + Default
 + MaxEncodedLen;
```

In addition to the `frame_system::Config`, every FRAME pallet has its own `Config` trait to define the additional associated types that are specific to that pallet.
In the same way that generic types from the `frame_system::Config` trait are resolved to specific types in the runtime implementation, each pallet has associated types that are declared in the pallet-specific `Config` trait and resolved in the runtime implementation.

## Function calls and arguments

In Rust, you can use the type system to enforce good coding practices.
For example, you can use the `Result` type to ensure that every function call includes an error case.
If you don't provide error handling, the Rust compiler issues a warning to remind you to add it.
Similarly, you can code function arguments to take the `Option` type, where the argument can be some value or `None` and both cases must be handled.

## Generic types and type constraints

You should note that Substrate pushes the boundaries of the Rust type system in its use of generic types.
In Substrate, a generic type can be used to represent any type.
The trait bounds you implement for the generic determine how the generic type is resolved.
This approach enables you to define a structure or enumerated list and its associated traits and types and pass it as a parameter.
For example, the enum `Runtime` is passed as a parameter to [`SubstrateWeight`](https://docs.substrate.io/rustdocs/latest/frame_system/weights/struct.SubstrateWeight.html):

```rust
SubstrateWeight<T> --> SubstrateWeight<Runtime>
```

If the constraints of the `SubstrateWeight<T>` trait are satisfied by the implementation of the `Runtime` traits, the generic `T` resolves to the appropriate type.
This example illustrates how generic types can be layered to implement different underlying behaviors of their associated traits.

## Common traits

In many cases, multiple pallets need to use a common set of traits and types.
For example, an account balance should have the same set of traits and types—the same meaning—in any pallet that needs access to this information.
Instead of defining the same implementation of balances in each pallet that requires it, you can add any pallet that implements a `Currency` trait to convert generic types into specific types in the runtime implementation.

If the associated type adheres to the trait bounds of a [`Currency`](https://docs.substrate.io/rustdocs/latest/frame_support/traits/tokens/currency/index.html) trait, it can simply pass in the runtime's instance of [`pallet_balances`](https://docs.substrate.io/rustdocs/latest/pallet_balances/index.html) across all pallets that rely on the same notion for currency.

For example, [`pallet_staking`](https://docs.substrate.io/rustdocs/latest/pallet_staking/trait.Config.html) has an associated type `Currency` whose trait bound is [`LockableCurrency`](https://docs.substrate.io/rustdocs/latest/frame_support/traits/tokens/currency/trait.LockableCurrency.html).
Given that [`pallet_balances`](https://docs.substrate.io/rustdocs/latest/pallet_balances/index.html) implements this trait, any runtime that includes the balances pallet can make the generic associated type concrete assigning it the balances pallets' runtime instance.

## Macros and metaprogramming

Put simply, Rust macros are single lines of code that writes other code.
In Rust, there are declarative macros and three kinds of procedural macros:

* Custom macros that specify code added with the derive attribute that you can use on structs and enums.
* Attribute macros that define custom attributes that you can use on any item.
* Function macros that look like function calls but operate on the tokens specified as their argument.

Substrate uses macros to reduce the code you need to write and simplify common tasks that you are most likely to need integrated into the runtime logic.
For example, FRAME incorporates macros for error and event handling that make it easier to include that functionality in a pallet.
Similarly, ink! smart contract language uses macros to handle common type creations and functions.

By using macros, you can avoid writing duplicate code and ensure logic checks are performed and passed before the code compiles.
Macros can require the logic to be formatted in a specific way, require specific checks, or consist of specific data structures.
For example, the `#[frame_system::pallet]` macro is required in all FRAME pallets to prevent you from compiling pallets that don't correctly implement certain required attributes, such as storage items or externally callable functions.

## Where to go next

Now that you know how Substrate relies on a few key Rust features—like traits, generic types, and macros—you can explore the following resources to learn more.

* [Rust book](https://doc.rust-lang.org/book/)
* [Why Rust?](https://www.parity.io/blog/why-rust)
* [Cargo and crates.io](https://doc.rust-lang.org/book/ch14-00-more-about-cargo.html)
* [Why Rust for smart contracts?](https://paritytech.github.io/ink-docs/why-rust-for-smart-contracts)
