---
title: Rust for Substrate
description: Highlights the Rust programming conventions that are of particular importance when developing a Substrate blockchain.
featured_image:
--- 

[Rust](https://www.rust-lang.org/) is a highly performant, type sound, and memory efficient programming language.
When you write programs in Rust, the Rust compiler checks your code before producing an executable, reducing the likelihood that your code will introduce memory leaks or other errors.

Substrate takes advantage of some key features of the Rust programming language to provide a flexible framework for creating mission-critical software with fewer errors.
Substrate abstracts some elements of the Rust programming language to make it easier to build the software to suit your needs without requiring you to become an expert in Rust.
Although some familiarity with Rust in essential—and there are many resources available for learning Rust, including the [Rust Language Programming Book](https://doc.rust-lang.org/book/) and [Rust by Example](https://doc.rust-lang.org/rust-by-example/)—this section focuses on the core components of Rust that are most important for building a Substrate blockchain and developing the runtime logic.

## Traits and generics

One of the powerful features of Rust that Substrate takes full advantage of is the Rust **trait** system.
In Rust, traits define what can be done by different types and how different types can interact with each other.
Traits enable you to define shared behavior in an abstract way.
You can then use **trait bounds** to specify that a **generic type** can be any type that has certain behavior.

The trait system enables different types to call the same set of methods to return different results.
Substrate uses the trait system to specify the set of operations that can be performed on a generic type.
Because the behaviors are defined on a generic type, you can reuse and adapt domain-specific logic by modifying the type bounds to suit a specific context.
Substrate maximizes the use of generic types to provide maximum flexibility.
You define how the generic types are resolved to suit your purpose.

For more information about generic types and traits in Rust, see [Generic Types, Traits, and Lifetimesr](hhttps://doc.rust-lang.org/book/ch10-00-generics.html) and [Advanced traitx](https://doc.rust-lang.org/book/ch19-03-advanced-traits.html).

## Configuration traits

One of the most common ways Susbtrate uses the trait abstraction is in the `frame_system` pallet.
The [`Config`](https://docs.substrate.io/rustdocs/latest/frame_system/pallet/trait.Config.html) declares the set of types that are most commonly used when developing a Substrate runtime.
The `Config` trait eliminates the need to repeat code to declare types that are used in several places, such as `AccountId`.
Instead, any pallet can refer to an `AccountId` type by using the generic `T`:

```rust
T::AccountId;
```

The generic type is only assigned a specific type in the context of the runtime implementation.
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

As in most programming languages, Rust macros encapsulate code that writes other code.
In Rust, there are declarative macros and three kinds of procedural macros:

* Custom macros that specify code added with the derive attribute that you can use on structs and enums.
* Attribute macros that define custom attributes that you can use on any item.
* Function macros that look like function calls but operate on the tokens specified as their argument.

Substrate uses [metaprogramming](https://doc.rust-lang.org/book/ch19-06-macros.html) in how macros are used throughout its libraries.
FRAME uses macros to alleviate the need to write the heavy lifting code that is required for a pallet to integrate into a runtime.
Similarly, ink! uses macros to handle common type creations and functions.

Macros allow developers building with Substrate to "write code that writes code", avoiding the need to write duplicate code and enforcing checks on how code is written.
Using macros, we can annotate code to ensure compilation checks are performed for the logic to be formatted in a specific way, either by including certain checks or data structures.
For example, the `#[frame_system::pallet]` macro required in all FRAME pallets, prevents developers from compiling pallets that don't correctly implement certain required attributes.

## Webassembly

Rust compiles to executable [Wasm (Webassembly)](https://webassembly.org/) byte code, enabling Substrate runtimes to also compile to Wasm.
This enables Substrate nodes to run from any Wasm compatible web browser or Wasm execution environment.
Beyond being a powerful "next-generation web" technology, for Substrate, having Wasm at the core of its design means a few very specific things:

- **Upgradability**. First and foremost, Wasm is a key piece of technology enabling [forkless runtime upgrades](https://docs.substrate.io/v3/runtime/upgrades/).
- **Portability**. Relay chain validators use Wasm to execute new parachain blocks and verify that they can get the same results.
- **Smart contract compatibility**. Any Smart Contract that compiles to Wasm can be executed by a compatible Substrate node.
See a [list of key advantages of having Wasm smart contracts](https://paritytech.github.io/ink-docs/why-webassembly-for-smart-contracts).
- **Light-client ready**. Wasm is also a key piece in how all Substrate chains are [light-client ready out of the box](https://paritytech.github.io/substrate-connect/#wasm-light-clients).

## Tools, cargo and crates.io

[**Cargo**](https://doc.rust-lang.org/cargo/guide/why-cargo-exists.html) is Rust's package management tool.
It comes with a [number of different types of commands](https://doc.rust-lang.org/cargo/commands/index.html) for running tests, building documentation, benchmarks and more.

Some useful patterns for using `cargo` when developing with Substrate include:

- Generating source code documentation using [`cargo doc`](https://doc.rust-lang.org/cargo/commands/cargo-doc.html) for any pallet or runtime.
- Running unit tests using [`cargo test`](https://doc.rust-lang.org/cargo/commands/cargo-test.html) for any runtime logic.
- Managing project dependencies using [`cargo update`](https://doc.rust-lang.org/cargo/commands/cargo-update.html) and [`cargo edit`](https://crates.io/crates/cargo-edit).
- Using [`cargo tree`](https://doc.rust-lang.org/cargo/commands/cargo-tree.html) for resolving dependency issues.
- Using [`cargo remote`](https://crates.io/crates/cargo-remote) to speed up compile times by using a remote machine.
- Using [`cargo fmt`](https://github.com/rust-lang/rustfmt) to format your code.
- Using [`cargo clippy`](https://github.com/rust-lang/rust-clippy) to improve your code using a collection of lints.

You might have noticed that `cargo remote` and `cargo edit` are not built-in to cargo, and you need to `cargo install` them manually.
The complete list of such cargo plugins can be found [here](https://crates.io/categories/development-tools::cargo-plugins).

[**Crates.io**](https://crates.io/) is Rust's community managed package registry.
Any Rust developer can publish their crates there for others to use in their projects.
This is useful to make Substrate components accessible to developers and for developers to easily reuse existing modules in their projects.

## Build environments

Rust is an embedded programming language.
This means it is designed for writing programs that don't need to rely on the standards of existing operating systems to run.
There are two classes of embedded programming environments: hosted environments and bare metal environments.

Hosted environments assume basic system integration primitives such as a file and memory management system (e.g. [POSIX](https://en.wikipedia.org/wiki/POSIX)) and rely on the [Rust standard library](https://doc.rust-lang.org/std/#the-rust-standard-library).
In bare metal environments, the compiled program makes no assumption about its target environment.
This requires such programs to exclusively use the [Rust core library](https://doc.rust-lang.org/core/) and telling the compiler to ignore the standard library entirely.

For Substrate, having a bare metal environment option is a major contribution to enabling platform agnostic runtimes.

### Compiling to `no_std` vs. `std`

Since a Substrate runtime is designed for Wasm execution, all runtime specific code is required to build with `no_std`.
This is done by including a default crate feature, `std` and using the [`cfg_attr` and `cfg` attributes](http://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/first-edition/conditional-compilation.html) as a switch to disable `std` in favor of `no_std` where needed.

Notice that in the Substrate node template, any file that's part of the node's runtime logic (such as `runtime/src/lib.rs` and `pallets/template/src/lib.rs`) will include:

```rust
#![cfg_attr(not(feature = "std"), no_std)]
```

This means that the code that follows this line will be treated as `no_std` except for code that is identified as _feature = "std"_.
This prevents the `std` crate from being automatically added into scope.
For code that requires the `std` crate, we simply trigger the conditional switch:

```rust
// in runtime/src/lib.rs
#[cfg(feature = "std")]
use sp_version::NativeVersion;
```

### Wasm target

<!-- List of `no_std` known issues: https://github.com/rust-embedded/wg/issues/64 -->

By design, a Substrate node is [cross-compiled](#build-process) to embed the Wasm runtime in the client at genesis.
To achieve this we need to specifiy a Wasm target for the compiler.
A [target](https://rust-lang.github.io/rustup/concepts/index.html) is simply information for the compiler to know what platform the code should be generated for.

Rust can support a multitude of [target platforms](https://doc.rust-lang.org/nightly/rustc/platform-support.html).
Each target is identified as a triple which informs the compiler what kind of output a program expects.
A target triple takes the form of:

`<architecture-type>-<vendor>-<os-type>`

When [setting up your Rust environment](#installation), the compiler will default to using the host toolchain's platform as the target.
For example:

`x86_64-unknown-linux-gnu`

In order to compile to Wasm, you need to add the [`wasm32-unknown-unknown` target](https://doc.rust-lang.org/nightly/nightly-rustc/rustc_target/spec/wasm32_unknown_unknown/index.html).
This triple translates to: "_compile to a Wasm target of 32-bit address space and make no assumptions about the host and target environments_".
The result is that it can run on any type of 32-bit CPU.

[Other Wasm targets](https://docs.wasmtime.dev/wasm-rust.html) for Rust do exist.
However, the "unknown" parts of this Wasm target enforces the notion of making zero assumptions about the target environment, which is a key design decision in Substrate.

It is also worth mentioning that there is `std` support for Substrate's Wasm target.
But this is not something that Wasm runtimes in Substrate support as it could open up unwanted errors such as leaking `std` code into Wasm environments, which will cause the system to panic.
In addition, the `wasm32-unknown-unknown` target architecture and `no_std` have the same fundamental assumptions, making `no_std` a natural fit.

Rust `std` features are generally not compatible with the intended constraints of a Wasm runtime.
For example, developers who attempt operations that are not allowed in the runtime, such as printing some text using `std`, could at worst cause the runtime to panic and terminate immediately.

In general, relying only on the `no_std` implementation of `wasm32-unknown-unknown` ensures that:

- A Substrate runtime is deterministic.
- A Substrate runtime is platform agnostic.
- A Substrate runtime is safe from unhandled errors.

## Toolchains

Wasm runtime compilation uses [Wasm builder](https://docs.substrate.io/rustdocs/latest/substrate_wasm_builder/index.html) which requires having a nightly toolchain installed.
This is because the `wasm32-unknown-unknown` relies on [experimental features of Rust](https://doc.rust-lang.org/unstable-book/the-unstable-book.html).
Over time, features will likely be promoted to stable.
Subscribe to [this tracking issue](https://github.com/paritytech/substrate/issues/1252) for updates and read more about the [build process](./build-process) to understand how a Substrate node is cross-compiled.

## Learn more

- [Rust book](https://doc.rust-lang.org/book/)
- [How rustup works](https://rust-lang.github.io/rustup/concepts/index.html)
- [Why Rust?](https://www.parity.io/blog/why-rust)
- [Cargo and crates.io](https://doc.rust-lang.org/book/ch14-00-more-about-cargo.html)
- [Rust blog post](https://thenewstack.io/rust-by-the-numbers-the-rust-programming-language-in-2021/)
- [Why Rust for smart contracts?](https://paritytech.github.io/ink-docs/why-rust-for-smart-contracts)
