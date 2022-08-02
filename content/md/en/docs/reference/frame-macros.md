---
title: FRAME macros
description:
keywords:
---

Substrate uses customized [Rust macros](https://doc.rust-lang.org/book/ch19-06-macros.html) to generate code and aggregate the logic from the pallets you implement for a runtime.
These runtime macros allow you to focus on your runtime logic rather than spending time on encoding and decoding on-chain variables or duplicating the code required for [basic blockchain development](/main-docs/fundamentals/runtime-intro#core-primitives).

This section provides a basic overview of the types of macros available in Rust and highlights how the specific FRAME macros are used in runtime development.

## Macro basics

In computer programming, macros are lines of code that encapsulate a preset sequence of instructions to execute. 
As code that writes code, macros enable you to abstract repetitive operations and simply the code you need to write.
With macros, you can declare complex data structures implicitly.

In Rust, macros can be **declarative macros** or **procedural macros**.

[Declarative macros](https://doc.rust-lang.org/book/ch19-06-macros.html#declarative-macros-with-macro_rules-for-general-metaprogramming) enable you to declare a pattern and compare the result of an expression to the pattern, then execute any additional lines code based on whether the pattern was matched..
Declarative macros are widely-used in Rust programming.

[Procedural macros](https://doc.rust-lang.org/book/ch19-06-macros.html#procedural-macros-for-generating-code-from-attributes) are similar to functions.
Unlike the pattern-matching done in declarative macros, procedural macros take code as input, perform some set of instructions on the input, and produce code as output.
There are three types of procedural macros: 

- [Custom `derive` macros](https://doc.rust-lang.org/book/ch19-06-macros.html#how-to-write-a-custom-derive-macro) enable you to define and reuse the implementation of a trait for a given type.
  The `derive` macro is particularly useful for defining the implementation for custom runtime types that must satisfy specific traits.
  
- [Attribute-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#attribute-like-macros) enable you to create new attributes to generate code.

- [Function-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#function-like-macros) enable you to define macros that operate like function calls to generate code.

Because macros are expanded before the compiler interprets the lines of code they contain, they can define complex data structures and operations.
FRAME macros take advantage of the different types of macros to provide shortcut abstractions to what is often complex blocks of code.
However, the abstraction that macros provide can make the runtime code somewhat difficult to follow.

To learn more about the FRAME macros used in the Substrate runtime, you can install and use [cargo-expand](https://docs.rs/crate/cargo-expand).
After you install cargo-expand, you can use the `cargo expand` command to display the results of the code contained in the macros the runtime uses.

## Substrate runtime macros

Substrate primitives and FRAME both rely on a collection of various types of macros.
This section provides an overview of the macros provided in the FRAME support and FRAME system libraries.
In most cases, these macros provide the framework that other pallets depend on and you should be familiar with how and where they are used in the runtime logic.
After the overview, this section describes the macros you are most likely to use as a runtime developer. 

### FRAME support macros

The `frame_support` crate provides many of the most important declarative, derive, attribute-like, and function-like macros used in the runtime.
A few of the important macros that you should be familiar with from the `frame_support` crate include the following:

- `construct_runtime`	used to construct runtime from the list of pallets you have implemented.
- `decl_error` used to declare an error type for a pallet in the runtime.
- `decl_event`	used to implement event for a pallet in the runtime.
- `decl_module`	used to declare a Module data structure and a Call enumeration for a dispatch.
- `decl_storage` used to declare strongly-typed wrappers around codec-compatible types in storage.
- `match_types`	used to create a type that implements the `Contains` trait with syntax similar to `matches!`.
- `parameter_types`	used to create new implementations of the `Get` trait.	

For additional information about the macros in the `frame_support` crate, see the Rust documentation for [Macros](https://paritytech.github.io/substrate/master/frame_support/index.html#macros) macros, [Derive macros](https://paritytech.github.io/substrate/master/frame_support/index.html#derives), and [Attribute macros](https://paritytech.github.io/substrate/master/frame_support/index.html#attributes).

### FRAME system macros

The `frame_system` crate uses macros to define primitives that provide access to core data types and shared utilities. 
These primitives and associated macros form the foundation for many node operations both in the outer node and in the runtime and act as the base layer for other pallets to interact with the Substrate framework.

A few of the important primitives and macros that you should be familiar with from the `frame_system` crate include the following:

- [`sp_core`](https://paritytech.github.io/substrate/master/sp_core/index.html)
  
  - `map`	used to initialize a key-value collection from array.
  - `RuntimeDebug` used to debug the runtime.
  
  For more information about `sp_core` function-like macros, see [Macros](https://paritytech.github.io/substrate/master/sp_core/index.html#macros).

- [`sp_runtime`](https://paritytech.github.io/substrate/master/sp_runtime/index.html)

  - `bounded_btree_map`	Bused to build a bounded `btree-map` from given literals.
  - `bounded_vec`	used to build a bounded `vec` from given literals.
  - `impl_opaque_keys` used to tmplement `OpaqueKeys` for a described data structure.
  - `parameter_types` used to create new implementations of the `Get` trait.

  For more information about `sp_runtime` function-like macros, see [Macros](https://paritytech.github.io/substrate/master/sp_runtime/index.html#macros).
  For information about `sp_runtime` derive macros, see [Derive macros](https://paritytech.github.io/substrate/master/sp_runtime/index.html#derives).

- [`sp_api`](https://paritytech.github.io/substrate/master/sp_api/index.html)
  
  - `decl_runtime_apis`	used to declare specified traits as runtime APIs.
  - `impl_runtime_apis`	used to tag specified trait implementations as runtime APIs.
  
  For more information about `sp_api` function-like macros, see [Macros](https://paritytech.github.io/substrate/master/sp_api/index.html#macros).

- [`sp_std`](https://paritytech.github.io/substrate/master/sp_std/index.html)
  
  - `if_std`	used to indicate code that should only be run when the `std` feature set is enabled.
  - `map`	used to initialize a key-value collection from array.
  - `vec`	used to create a vector containing the arguments.
  
  For more information about `sp_std` function-like macros, see [Macros](https://paritytech.github.io/substrate/master/sp_std/index.html#macros).

- [`sp_version`](https://paritytech.github.io/substrate/master/sp_version/index.html)
  
  - `create_apis_vec`	used to create a vector of API declarations.
  - `create_runtime_str` used to create a RuntimeString constant.
  - `runtime_version`	used as an attribute that accepts the version declaration of a runtime and generates a custom WebAssembly section with the equivalent contents.

You'll see these many of these crates listed as dependencies in the runtime and node `Cargo.toml` file for the node template.

## Macros for composing pallets

As discussed in [Building custom pallets](/main-docs/fundamentals/runtime-intro#building-custom-pallets), most FRAME pallets are composed using a common set of sections.
Macros make building each of those sections more modular and extensible.
This section describes the macros available and how to use them to build your custom runtime.

### #[pallet]

The `#[pallet]` macro is required to declare a pallet.
This [attribute macro](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html) describes the attributes used to identify the specific items the pallet requires.
For example, a pallet typically includes a set of types, functions, and trait implementations that are aggregated by the `construct_runtime!` macro to build to runtime.

The `#[pallet]` attribute macro is define by a module item:

```rust
#[pallet]
pub mod pallet {
...
}
```

Inside the module, the macro parses item with the attribute `#[pallet::*]`.
Some `#[pallet::*]` attributes are mandatory and some are optional.

You can import system-level types from the `frame_support` and `frame_system` crates automatically by using the pallet_prelude from those crate.
For example:

```rust
#[pallet]
pub mod pallet {
		use frame_support::pallet_prelude::*;
		use frame_system::pallet_prelude::*;
		...
}
```

This macro is similar to a derive macro in that it expands the pallet types and trait implementations by reading the input.
In most cases, the macro doesn't modify any input. 
However, there are a few specific scenarios where—unlike a derive macro—this macro modifies its input.

The macro will modify the input in the following circumstances:

- If a **generic** is replaced with a **type**
  
  For example, this can occur if the inner type of an item in `pub struct Pallet<..>(_)` is replaced in the `pallet::storage` macro with a type that implements the `StorageInstance` trait.

- If a **function or data structure** is **changed** 
  
  For example, this can occur if `pallet::type_value` changes a function item into a struct and trait implementation.

- If **docs** are **not provided** by the user
  
  For example, if no documentation is provided, the macro `pallet::pallet` modifies the input to add documentation above the `struct Pallet<T>(_);` item.

### #[pallet::config]

The [`#[pallet::config]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#config-trait-palletconfig-mandatory) macro is required to define the generic data types the pallet uses.

This macro provides the constants that are part of the system-level [`Config` trait](https://paritytech.github.io/substrate/master/frame_system/pallet/trait.Config.html) for the pallet and describes the external tools to use for the runtime.

The Config trait for this macro must be defined as a regular trait definition named `Config` that includes the system-level `frame_system::Config` trait.
The definition can include other traits and a where clause.
For example:

```rust
#[pallet::config]
pub trait Config: frame_system::Config + $optionally_some_other_supertraits
$optional_where_clause
{
...
}
```

To bypass the `frame_system::Config` requirement, you can use the attribute `#[pallet::disable_frame_system_supertrait_check]`.
For example:

```rust
#[pallet::config]
#[pallet::disable_frame_system_supertrait_check]
pub trait Config: pallet_timestamp::Config {}
```

### #[pallet::constant]

The `#[pallet::constant]` macro provides the `Config` trait—inside the `#[pallet::config]` macro—with the types and attributes it needs for the runtime and generates associated metadata.

This macro adds information about the constants used in a pallet to the runtime metadata, including: 

- the constant name
- the name of the associated types
- he constant value
- the value returned by `Get::get()` for the constant
  
For example, you can use `#[pallet::constant]` to add `type MyGetParam` to the metadata:

```rust
#[pallet::config]
pub trait Config: frame_system::Config {
	#[pallet::constant] // puts attributes in metadata
	type MyGetParam: Get<u32>;
}
```

### #[pallet::extra_constants]

The [`#[pallet::extra_constants]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#extra-constants-palletextra_constants-optional) macro enables you to add constants to the metadata.

For example, you can declare a function that returns a generated value. 
You can then use the  `#[pallet::extra_constants]` macro to add the information for the generated value to the metadata:

```rust
#[pallet::extra_constants]
impl<T: Config> Pallet<T> {
  //Example function using extra_constants
  fn example_extra_constants() -> u128 { 4u128 }
}
```

### #[pallet::pallet]

The [`#[pallet::pallet]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#pallet-struct-placeholder-palletpallet-mandatory) macro is required to declare the pallet data structure placeholder to be used by `construct_runtime!` macro.
This macro must be defined as a struct named Pallet with a generic type <T> and no where clause.

For example:

```rust
#[pallet::pallet]
pub struct Pallet<T>(_);
```

This macro can generate the `Store` trait to contain an associated type for each storage item, if you provide the  `#[pallet::generate_store($vis trait Store)]` attribute macro.

For example:

```rust
#[pallet::pallet]
#[pallet::generate_store(pub(super) trait Store)]
pub struct Pallet<T>(_);
```

For more information about working with storage within this macro, see the [macro expansion](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#macro-expansion-1) added to the `struct Pallet<T>` definition.

### #[pallet::generate_storage_info]

**When to use**

This attribute no longer exists. `generate_storage_info` is now assumed by default: all pallet storage items are expected to be bounded (i.e. have a fixed size).

**What it does**

All storage is now required to implement the trait `traits::StorageInfoTrait`, and thus all keys and value types must have the bound `pallet_prelude::MaxEncodedLen`.
Individual storage can opt-out from this constraint by using `#[pallet::unbounded]`, see `#[pallet::storage]` documentation.

In the unlikely event that the entire pallet's storage needs to be unbounded by default, one can add the `#[pallet::without_storage_info]` attribute to the pallet struct like so:

```rust
#[pallet::pallet]
#[pallet::generate_store(pub(super) trait Store)]
#[pallet::without_storage_info]
pub struct Pallet<T>(_);
```

(but as discussed it would be more typical to place `#[pallet::unbounded]` on specific storage items)

**Docs**

- See the [macro expansion](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#pallet-struct-placeholder-palletpallet-mandatory) added to the `struct Pallet<T>` definition

### #[pallet::hooks]

**When to use**

Required for declaring pallet hooks.

**What it does**

[`Hooks`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.Hooks.html#provided-methods) are made available by using the `Hooks` trait.

For example:

```rust
#[pallet::hooks]
impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
  // Hooks functions and logic goes here.
}
```

**Docs**

- See the [documentation](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#hooks-pallethooks-mandatory)
- See the [macro expansion](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#macro-expansion-2)

### #[pallet::call]

**When to use**

Required, to implement a pallet's dispatchables. Each dispatchable must:

- define a weight with the `#[pallet::weight($expr)]` attribute
- have its first argument as `origin: OriginFor<T>`,
- use compact encoding for argument using #[pallet::compact]
- return `DispatchResultWithPostInfo` or `DispatchResult`

**What it does**

Extrinsic requests coming into the runtime can use calls to trigger specific logic.
Calls can also be used in on-chain governance, demonstrated by the democracy pallet where calls can be voted on.
The `#[pallet::call]` aggregates all dispatchable function call logic using the [`Call` enum](https://paritytech.github.io/substrate/master/frame_system/pallet/enum.Call.html).
The [aggregation](/reference/glossary#aggregation) enables FRAME to batch functions of the same type into a single runtime call.
The runtime then generates the associated items from the implementation defined in the `impl` code blocks.

**Docs**

- See the [documentation](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#call-palletcall-mandatory)

### #[pallet::error]

**When to use**

Optionally, to define error types to be used in dispatchables.

**What it does**

Puts error variants documentation into metadata.

**Docs**

- See [documentation](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#error-palleterror-optional)

### #[pallet::event]

**When to use**

Optionally, to define a pallet's event types.

**What it does**

It is similar to errors but it can holds more information. They generate the metadata of the event and add_derive. It uses the `#[pallet::metadata(..)]` attribute to define what metadata to put from the events.

For example:

```rust
#[pallet::event]
#[pallet::metadata(u32 = "SpecialU32")]
pub enum Event<T: Config> {
	Proposed(u32, T::AccountId),
}
```

**Docs**

- See [documentation](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#event-palletevent-optional)

### #[pallet::storage]

**When to use**

Optionally, as it can be used multiple times.

**What it does**

To define some abstract storage inside runtime storage.

`[pallet::storage]` is using a Rust-like HashMap to do storage, except it takes a Key, Value,
Hasher, Prefix, QueryKind and an OnEmpty
parameter. The prefix generic defines the place where the
storage will store its `(key, value)` pairs (i.e. the trie) and defines the pallet and storage prefix like such:

`concat(twox_128(pallet_prefix), towx_128(storage_prefix))`, replacing `_` with the generated prefix implementations
of the pallet and storage names.

**Docs**

- See [macro documentation](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#storage-palletstorage-optional)
- [`StorageMap` implementation](https://paritytech.github.io/substrate/master/frame_support/pallet_prelude/struct.StorageMap.html#implementations)
- [Rust HashMap syntax](https://doc.rust-lang.org/book/ch08-03-hash-maps.html)

### Other attributes

Other FRAME macro attributes include:

- [#[pallet::genesis_config]](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#genesis-config-palletgenesis_config-optional)
- [#[pallet::type_value]](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#type-value-pallettype_value-optional)
- [#[pallet::genesis_build]](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#genesis-build-palletgenesis_build-optional)
- [#[pallet::inherent]](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#inherent-palletinherent-optional)
- [#[pallet::validate_unsigned]](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#validate-unsigned-palletvalidate_unsigned-optional)
- [#[pallet::origin]](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#origin-palletorigin-optional)

## Additional FRAME macros

### construct_runtime!

**When to use**

To construct Substrate runtime and integrating various pallets into the runtime.

**What it does**

The macro declares and implements various struct and enum, e.g.`Runtime`, `Event`, `Origin`, `Call`,
`GenesisConfig` etc, and implements various helper traits for these struct types. The macro also
adds logics of mapping different events and dispatchable calls from the overarching runtime back to
a particular pallet.

**Docs and notes**

- [API Documentation](https://paritytech.github.io/substrate/master/frame_support/macro.construct_runtime.html)
- `Runtime` struct type is defined to represent the Substrate runtime.
- `Event` enum type is defined with variants of all pallets that emit events, with helper traits and
  encoding/decoding traits implemented for the enum. Various conversion traits `Event` also
  implements `TryInto<pallets::Event<Runtime>>` trait to extract the event out from the enum type.
- `Origin` enum type is defined with helper traits, e.g. `PartialEq`, `Clone`, `Debug` implemented.
  This enum type defines who calls an extrinsic: `NONE`, `ROOT`, or signed by a particular account.
  These three primitive origins are defined by the FRAME System module, but optional FRAME pallets
  may also define origins.
- `Call` enum type is defined with all integrated pallets as variants. It contains the data and
  metadata of each of the integrated pallets, and redirects calls to the specific pallet via
  implementing `frame_support::traits::UnfilteredDispatchable` trait.
- `GenesisConfig` struct type is defined and implements `sp_runtime::BuildStorage` trait for
  building up the storage genesis config.
- The macro adopts the `frame_support::unsigned::ValidateUnsigned` trait implementation from each
  pallet. If no `ValidateUnsigned` trait is implemented in any included pallets, all unsigned
  transactions will be rejected.

### parameter_types!

**When to use**

To declare parameter types to be assigned to pallet configurable trait associated types during
runtime construction.

**What it does**

The macro replaces each parameter specified into a struct type with a `get()` function returning its
specified value. Each parameter struct type also implements a `frame_support::traits::Get<I>` trait
to convert the type to its specified value.

**Docs**

- [API Documentation](https://paritytech.github.io/substrate/master/frame_support/macro.parameter_types.html)

## Substrate system library macros

### impl_runtime_apis!

**When to use**

This macro generates the API implementations for the client side through the `RuntimeApi` and
`RuntimeApiImpl` struct type.

**What it does**

The macro defines the `RuntimeApi` and `RuntimeApiImpl` exposed to the Substrate node client. It
provides implementation details of the RuntimeApiImpl based on the setup and appended user specified
implementation in the `RuntimeApiImpl`.

**Docs and notes**

- [API Documentation](https://paritytech.github.io/substrate/master/sp_api/macro.impl_runtime_apis.html)
- `RuntimeApi` and `RuntimeApiImpl` structs are declared. The macro also implements various helper
  traits for `RuntimeApiImpl`.
- What developers define within `impl_runtime_apis!` macro are appended to the end of
  `RuntimeApiImpl` implementation.
- To expose version information about the runtime, a constant `RUNTIME_API_VERSIONS` is defined.
  containing the runtime core `ID`/`VERSION`, metadata `ID`/`VERSION`, SessionKeys `ID`/`VERSION`,
  etc.
- A public module `api` is defined with a `dispatch()` function implemented deciding how various
  strings are mapped to metadata or chain lifecycle calls.

### app_crypto!

**When to use**

To specify cryptographic key pairs and its signature algorithm that are to be managed by a pallet.

**What it does**

The macro declares three struct types, `Public`, `Signature`, and `Pair`. Aside from having various
helper traits implemented for these three types, the `Public` type is implemented for generating
keypairs, signing and verifying signatures; the `Signature` type is to hold the signature property given the chosen signature (e.g. SR25519, ED25519 etc); and the `Pair` type is to generate a
public-private key pair from a seed.

**Docs and notes**

- [API Documentation](https://paritytech.github.io/substrate/master/sp_application_crypto/macro.app_crypto.html)
- `Public` struct type is declared, and implements `sp_application_crypto::AppKey` trait defining
  the public key type, and `sp_application_crypto::RuntimeAppPublic` trait for generating keypairs,
  signing, and verifying signatures.
- `Signature` struct type is declared, and implements `core::hash::Hash` trait on how the data with
  this signature type is hashed.
- `Pair` struct type is declared to wrap over the crypto pair. This type implements
  `sp_application_crypto::Pair` and `sp_application_crypto::AppKey` traits determining how it
  generates public-private key pairs from a phrase or seed.

## References

- [The Rust Programming Language ch 19.5 Macros](https://doc.rust-lang.org/book/ch19-06-macros.html)
- [The Little Book of Rust Macros](https://danielkeep.github.io/tlborm/book)

<!--
As of January 2021, FRAME based pallets have upgraded their use of macros. 
Refer to [this guide](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#upgrade-guidelines) to learn about migrating a v1 pallet to v2 and [this resource](https://hackmd.io/@fscJ0GEvRb2rqALLZB1kfA/SkSerkamt) to learn more about FRAME's version changes.

cargo expand 
1. Open a terminal shell and change to the `runtime` directory for the Substrate node template.

2. Install cargo-expand by running the following command:

   ```bash
   cargo install cargo-expand
   ```

-->
