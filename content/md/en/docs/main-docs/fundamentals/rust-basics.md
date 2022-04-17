---
title: Rust basics
description: An overview of Rust programming conventions and how they're used in Substrate.
featured_image:
--- 

_The goal of this article is to go over some of Rust's programming paradigms and how they're used in Substrate._
_In doing so, it explains how Substrate uses no_std and why and the role of generics in Substrate runtimes_.

The [Rust programming language](https://www.rust-lang.org/) enables writing software with a high degree of performance, type safety and memory efficiency.
It is a compiled language, meaning that the compiler checks the code before an executable is produced, helping developers gain confidence in the code they write and making it difficult to write code with memory or concurency bugs.

Among other characteristics this section will see, it's a language that gives Substrate a powerful edge for creating mission critical software with ease of mind.
Like Rust, Substrate is designed to be flexible and to provide you with tools to make decisions for your own use cases, to empower you, with FRAME as your guardrail for writing Substrate runtimes. 

## Programming paradigms

Rust has a sophisticated [trait system](https://doc.rust-lang.org/book/ch19-03-advanced-traits.html) that helps developers make use of Substrate’s many layers of abstractions.
The core features available to build these layers of abstraction are owed to Rust's system of traits and generics.

[Rust generics](https://doc.rust-lang.org/book/ch10-00-generics.html) allow Substrate to exist as a sort of template for writing runtimes, by using traits to encapsulate the set of operations that can be performed on a generic type. 
For developers, this system  makes it possible to extend domain specific logic by defining custom behavior using traits and type bounds.
The fact that Substrate is as generic as possible leaves maximum flexibility, where generics resolve into whatever the user defines them to resolve as.

### Configuration traits

A common use of abstractions in Susbtrate is the use of the [`Config` trait from `frame_system`](https://docs.substrate.io/rustdocs/latest/frame_system/pallet/trait.Config.html) when developing [pallets](./link-todo).
This is the trait responsible for declaring the types that are commonly used in developing Substrate runtimes.
With it there is no need to duplicate code that declares a type that's used in several places, such as `AccountId`.
Instead, any pallet-which is coupled to `frame_system::Config` by definition-can refer to an `AccountId` type by using the generic `T`:

```rust
T::AccountId;
```

Only where the types are made concrete will the generic `AccountId` resolve to a specific type.
This happens in the runtime implementation of `frame_system::Config` where `AccountId` is specified as:


```rust
// In the `runtime/src/lib.rs` file of the Substrate node template.
pub type AccountId = <<Signature as Verify>::Signer as IdentifyAccount>::AccountId;
```

A trait such as `frame_system::Config` is constrained by its associated types.
Further, each type is constrained by specific traits.
This makes it possible to use `AccountId` generically so long as it satifies those contraints.
For example, the [associated type for `AccountId`](https://docs.substrate.io/rustdocs/latest/frame_system/pallet/trait.Config.html#associatedtype.AccountId) is bound by a number of traits:

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

Every pallet also has its own `Config` or "configuration" trait which enables defining additional associated types that are specific to that pallet.
In the same way that `frame_system::Config` associated types are made concrete in the runtime implementation, a pallet's associated types are configured in the runtime as well.


### Generic types 

Rust's rich type system allows you to explicitly express your intent.
For instance, the `Result` type ensures that every function call has an error case &mdash; a core principle for writing runtimes with Substrate.
Similarly, function arguments can take the `Option` type, where the argument can be some value or `None` and both cases must be handled.

Substrate pushes the boundaries of using Rust's type system with generics.
Any type can be passed into a generic so long as the type implements the traits associated with that generic.
With this paradigm, we can define a struct or enum and its associated traits and types and pass it as a parameter.

For example, the enum `Runtime` is passed as a parameter to [`SubstrateWeight`](https://docs.substrate.io/rustdocs/latest/frame_system/weights/struct.SubstrateWeight.html):

```rust
SubstrateWeight<T> --> SubstrateWeight<Runtime>
```

So long as the constraints of that trait are satisfied, the generic `T` will resolve to fit the whatever it's targeting.
In this case, `Runtime` implements all the required traits required to satisfy `SubstrateWeight<T>`.
The purpose here is to present how generics are used in Substrate, giving a fundamental design example in FRAME. 
It's also possible to use generics to implement different underlying behaviors of their associated traits.
Refer to the [UTXO implementation with Substrate](https://www.parity.io/blog/utxo-on-substrate/) for an example of using these idioms to build a Bitcoin-like blockchain.

### Common traits

In many cases there is a need to use traits and types which are shared between multiple pallets.
One example is a runtime's understanding of account balance and how multiple pallets need to share the same notion of it.

Instead of defining the same implementation of balances in each pallet that requires it, we can pass in any pallet that implements some `Currency` trait to turn generic types into concrete ones in the runtime implementation.

When building with FRAME, so long as this associated type adheres to the trait bounds of a [some `Currency` trait](https://docs.substrate.io/rustdocs/latest/frame_support/traits/tokens/currency/index.html), it can simply pass in the runtime's instance of [`pallet_balances`](https://docs.substrate.io/rustdocs/latest/pallet_balances/index.html) across all pallets that rely on the same notion for currency.

For example, [`pallet_staking`](https://docs.substrate.io/rustdocs/latest/pallet_staking/trait.Config.html) has an associated type `Currency` whose trait bound is [`LockableCurrency`](https://docs.substrate.io/rustdocs/latest/frame_support/traits/tokens/currency/trait.LockableCurrency.html). 
Given that [`pallet_balances`](https://docs.substrate.io/rustdocs/latest/pallet_balances/index.html) implements this trait, any runtime that includes the balances pallet can make the generic associated type concrete assigning it the balances pallets' runtime instance.

### Metaprogramming 

Substrate uses [metaprogramming](https://doc.rust-lang.org/book/ch19-06-macros.html) in how macros are used throughout its libraries.
[FRAME uses macros](https://docs.substrate.io/v3/runtime/macros/) to alleviate the need to write the heavy lifting code that is required for a pallet to integrate into a runtime. 
Similarly, [ink!](https://paritytech.github.io/ink-docs/) uses macros to handle common type creations and functions.

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
There are two classes of embedded programming environemnts: hosted environments and bare metal environments.

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
