---
title: FRAME macros
description:
keywords:
---
<div class="warning">
  <strong>⚠️ WARNING:</strong> This section contains outdated information. Please refer to the <a href="https://paritytech.github.io/polkadot-sdk/master/frame_support/attr.pallet.html">Rust docs</a> for the most up-to-date documentation on this topic.
</div>

Substrate uses customized [Rust macros](https://doc.rust-lang.org/book/ch19-06-macros.html) to generate code and aggregate the logic from the pallets you implement for a runtime.
These runtime macros allow you to focus on your runtime logic rather than spending time on encoding and decoding on-chain variables or duplicating the code required for [basic blockchain development](/learn/runtime-development#core-primitives).

This section provides an overview of the types of macros available in Rust and highlights how the specific FRAME macros are used in runtime development.

## Macro basics

In computer programming, macros are lines of code that encapsulate a preset sequence of instructions to execute.
As code that writes code, macros enable you to abstract repetitive operations and simplify the code you need to write.
With macros, you can declare complex data structures implicitly.

In Rust, macros can be **declarative macros** or **procedural macros**.

[Declarative macros](https://doc.rust-lang.org/book/ch19-06-macros.html#declarative-macros-with-macro_rules-for-general-metaprogramming) enable you to declare a pattern and compare the result of an expression to the pattern, then execute any additional lines of code based on whether the pattern was matched.
Declarative macros are widely-used in Rust programming.

[Procedural macros](https://doc.rust-lang.org/book/ch19-06-macros.html#procedural-macros-for-generating-code-from-attributes) are similar to functions.
Unlike the pattern-matching done in declarative macros, procedural macros take code as input, perform some set of instructions on the input, and produce code as output.
There are three types of procedural macros:

- [Custom derive macros](https://doc.rust-lang.org/book/ch19-06-macros.html#how-to-write-a-custom-derive-macro) enable you to define and reuse the implementation of a trait for a given type.
  The `derive` macro is particularly useful for defining the implementation for custom runtime types that must satisfy specific traits.
- [Attribute-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#attribute-like-macros) enable you to create new attributes to generate code.

- [Function-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#function-like-macros) enable you to define macros that operate like function calls to generate code.

Because macros are expanded before the compiler interprets the lines of code they contain, they can define complex data structures and operations.
FRAME macros take advantage of the different types of macros to provide shortcut abstractions to what is often complex blocks of code.
However, the abstraction that macros provide can make the runtime code somewhat difficult to follow.

To learn more about the FRAME macros used in the Substrate runtime, you can install and use [cargo-expand](https://docs.rs/crate/cargo-expand).
After you install cargo-expand, you can use the `cargo expand` command to display the results of the code contained in the macros the runtime uses.

## FRAME support and system macros

Substrate primitives and FRAME both rely on a collection of different macros.
This section provides an overview of the macros provided in the FRAME support and FRAME system libraries.
In most cases, these macros provide the framework that other pallets depend on and you should be familiar with how and where they are used in the runtime logic.
After the overview, this section describes the specific macros that you are most likely to use as a runtime developer.

### FRAME support macros

The `frame_support` crate provides many of the most important declarative, derive, attribute-like, and function-like macros used in the runtime.
A few of the important macros that you should be familiar with from the `frame_support` crate include the following:

- `construct_runtime` used to construct runtime from the list of pallets you have implemented.
- `match_types` used to create a type that implements the `Contains` trait with syntax similar to `matches!`.
- `parameter_types` used to create new implementations of the `Get` trait.

For additional information about the macros in the `frame_support` crate, see the Rust documentation for [Macros](https://paritytech.github.io/substrate/master/frame_support/index.html#macros), [Derive macros](https://paritytech.github.io/substrate/master/frame_support/index.html#derives), and [Attribute macros](https://paritytech.github.io/substrate/master/frame_support/index.html#attributes).

### FRAME system macros

The `frame_system` crate uses macros to define primitives that provide access to core data types and shared utilities.
These primitives and associated macros form the foundation for many node operations both in the outer node and in the runtime and act as the base layer for other pallets to interact with the Substrate framework.

A few of the important primitives and macros that you should be familiar with from the `frame_system` crate include the following:

- [`sp_core`](https://paritytech.github.io/substrate/master/sp_core/index.html)

  - `map` used to initialize a key-value collection from array.
  - `RuntimeDebug` used to debug the runtime.

  For more information about `sp_core` function-like macros, see [Macros](https://paritytech.github.io/substrate/master/sp_core/index.html#macros).

- [`sp_runtime`](https://paritytech.github.io/substrate/master/sp_runtime/index.html)

  - `bounded_btree_map` used to build a bounded `btree-map` from given literals.
  - `bounded_vec` used to build a bounded `vec` from given literals.
  - `impl_opaque_keys` used to implement `OpaqueKeys` for a described data structure.
  - `parameter_types` used to create new implementations of the `Get` trait.

  For more information about `sp_runtime` function-like macros, see [Macros](https://paritytech.github.io/substrate/master/sp_runtime/index.html#macros).
  For information about `sp_runtime` derive macros, see [Derive macros](https://paritytech.github.io/substrate/master/sp_runtime/index.html#derives).

- [`sp_api`](https://paritytech.github.io/substrate/master/sp_api/index.html)

  - `decl_runtime_apis` used to declare specified traits as runtime APIs.
  - `impl_runtime_apis` used to tag specified trait implementations as runtime APIs.

  For more information about `sp_api` function-like macros, see [Macros](https://paritytech.github.io/substrate/master/sp_api/index.html#macros).

- [`sp_std`](https://paritytech.github.io/substrate/master/sp_std/index.html)

  - `if_std` used to indicate code that should only be run when the `std` feature set is enabled.
  - `map` used to initialize a key-value collection from array.
  - `vec` used to create a vector containing the arguments.

  For more information about `sp_std` function-like macros, see [Macros](https://paritytech.github.io/substrate/master/sp_std/index.html#macros).

- [`sp_version`](https://paritytech.github.io/substrate/master/sp_version/index.html)

  - `create_apis_vec` used to create a vector of API declarations.
  - `create_runtime_str` used to create a `RuntimeString` constant.
  - `runtime_version` used as an attribute that accepts the version declaration of a runtime and generates a custom WebAssembly section with the equivalent contents.

You'll see these many of these crates listed as dependencies in the runtime and node `Cargo.toml` file for the node template.

## Macros for composing pallets

As discussed in [Building custom pallets](/learn/runtime-development#building-custom-pallets), most FRAME pallets are composed using a common set of sections.

Macros make building each of those sections more modular and extensible.
This section describes the macros available and how to use them to build your custom runtime.

### #[pallet]

The `#[pallet]` macro is required to declare a pallet.
This [attribute macro](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html) is an attribute of the pallet module (`mod pallet`).
Within the `pallet` module, the `#[pallet]` macro serves as an entry point for additional `#[pallet::*]` macros that describe the attributes used to identify the specific items the pallet requires.
For example, a pallet typically includes a set of types, functions, and trait implementations that are aggregated by the `construct_runtime!` macro to build the runtime.

```rust
#[pallet]
pub mod pallet {
...
}
```

#### Development mode

You can specify `dev_mode` as an argument on the `#[pallet]` or `#[frame_support::pallet]` attribute macro to enable development mode for a pallet.
For example, replace `#[pallet]` with `#[pallet(dev_mode)]` or `#[frame_support::pallet]` with `#[frame_support::pallet(dev_mode)]` to enable development mode for the pallet you're working on.

Development mode loosens some of the restrictions and requirements placed on production pallets to make it easier to iterate on your code during development and testing cycles.
For example, if you enable development mode for a pallet:

- You don't need to specify a weight on every `#[pallet::call]` declaration.
  By default, development mode assigns a weight of zero (`0`) to calls that don't have a weight explicitly specified.

- You don't need to implement `MaxEncodedLen` on storage types.
  By default, development mode marks all storage items as unbounded.

Note that you can only add the `dev_mode` argument to the `#[pallet]` or `#[frame_support::pallet]` attribute macro that encloses your pallet module.
You can't specify this argument for any of the `#[pallet::*]` attribute macros.

You should never deploy pallets with development mode enabled in a production network. Before deploying a pallet in a production runtime, be sure to remove the `dev_mode` argument from the `#[pallet]` declaration, fix any compiler errors, and complete testing with the development mode disabled.

#### Using the pallet module

Inside the module, the macro parses items with the attribute `#[pallet::*]`.
Some `#[pallet::*]` attributes are mandatory and some are optional.

You can import system-level types from the `frame_support` and `frame_system` crates automatically by using the `pallet_prelude` from those crates.
For example:

```rust
#[pallet]
pub mod pallet {
		use frame_support::pallet_prelude::*;
		use frame_system::pallet_prelude::*;
		...
}
```

The `#[pallet]` macro is similar to a derive macro in that it expands the pallet types and trait implementations by reading the input.
In most cases, the macro doesn't modify any input.
However, there are a few specific scenarios where—unlike a derive macro—this macro modifies its input.

The macro will modify the input in the following circumstances:

- If a **generic** is replaced with a **type**

  For example, this can occur if the inner type of an item in `pub struct Pallet<..>(_)` is replaced in the `pallet::storage` macro with a type that implements the `StorageInstance` trait.

- If a **function or data structure** is **changed**

  For example, this can occur if the `pallet::type_value` macro changes a function item into a struct and trait implementation.

- If **docs** are **not provided** by the user

  For example, if no documentation is provided, the macro `pallet::pallet` modifies the input to add documentation above the `struct Pallet<T>(_);` item.

### #[pallet::config]

The [`#[pallet::config]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#config-trait-palletconfig-mandatory) macro is required to define the generic data types that the pallet uses.

This macro provides the constants that are part of the system-level [`Config` trait](https://paritytech.github.io/substrate/master/frame_system/pallet/trait.Config.html) for the pallet.

The Config trait for this macro must be defined as a regular trait definition named `Config` that includes the system-level `frame_system::Config` trait.
The definition can include other top-level traits and a where clause.
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

The `#[pallet::constant]` macro provides the `Config` trait—inside the [`#[pallet::config]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#config-trait-palletconfig-mandatory) macro—with the types and attributes it needs for the runtime and generates associated metadata.

This macro adds information about the constants used in a pallet to the runtime metadata, including:

- the constant name
- the name of the associated types
- the constant value
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
You can then use the `#[pallet::extra_constants]` macro to add the information for the generated value to the metadata:

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

For more information about working with storage and this macro, see the [macro expansion](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#macro-expansion-1) added to the `struct Pallet<T>` definition.

### #[pallet::without\_storage\_info]

The `#[pallet::without_storage_info]` macro enables you to define pallet storage items that don't have a fixed size.

By default, all pallet storage items are required to implement `traits::StorageInfoTrait`, so that all key and value types have a fixed size based on the bound defined in the `pallet_prelude::MaxEncodedLen` attribute.
This size limitation is required for parachain development to estimate the size of the Proof of Validity (PoV) blob.

The `#[pallet::without_storage_info]` attribute macro allows you to override the default behavior if you require unbounded storage for an entire pallet.
To use it, add the `#[pallet::without_storage_info]` attribute to the pallet struct like so:

```rust
#[pallet::pallet]
#[pallet::without_storage_info]
pub struct Pallet<T>(_);
```

Note that you should only use the `#[pallet::without_storage_info]` macro if you need to make all of the storage items in your pallet unbounded.
If you only need undefined storage for a specific storage item, you can use the `#[pallet::unbounded]` attribute macro to override the fixed size constraint.

Because the `#[pallet::without_storage_info]` macro applies to all storage items in your pallet, you should only use it in a test or development environment.
You should never use the `#[pallet::without_storage_info]` attribute macro in a production environment.

For more information about working with storage and this macro, see the [macro expansion](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#pallet-struct-placeholder-palletpallet-mandatory) added to the `struct Pallet<T>` definition.

### #[pallet::unbounded]

The `#[pallet::unbounded]` attribute macro enables you to declare a specific storage item as unbounded.
By default, all pallet storage items are required to have a fixed size.
You can use this attribute macro to override the default requirement on a specific storage item.
If you are a parachain developer, you can use this macro for storage items that will never go into the Proof of Validity (PoV) blob.

### #[pallet::hooks]

The [`#[pallet::hooks]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#hooks-pallethooks-optional) macro allows you to declare optional pallet hooks to implement pallet-specific logic at specific points in the block making process.
Within the `#[pallet::hooks]` macro, you can implement the [`Hooks`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.Hooks.html#provided-methods) trait to execute logic when a block is being initialized or finalized, before a runtime is upgraded, or after a runtime upgrade has been completed.

For example:

```rust
#[pallet::hooks]
impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
  // Hooks functions and logic goes here.
}
```

For more information about using hooks, see the Rust documentation for [pallet::hooks](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html##hooks-pallethooks-optional) and [macro expansion](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#macro-expansion-2).

### #[pallet::call]

The [`#[pallet::call]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet#call-palletcall-optional) is required to implement the functions that can be dispatched to the runtime for a pallet. Each function must:

- define a weight with the `#[pallet::weight($expr)]` attribute
- have its first argument as `origin: OriginFor<T>`
- use compact encoding for arguments using #[pallet::compact]
- return `DispatchResultWithPostInfo` or `DispatchResult`

Extrinsic requests coming into the runtime can use calls to trigger specific logic.
Calls can also be used in on-chain governance, demonstrated by the democracy pallet where calls can be voted on.
The `#[pallet::call]` aggregates all of the function call logic using the [`Call` enum](https://paritytech.github.io/substrate/master/frame_system/pallet/enum.Call.html).
The [aggregation](/reference/glossary#aggregation) enables FRAME to batch functions of the same type into a single runtime call.
The runtime then generates the associated items from the implementation defined in the `impl` code blocks.

For more information. see the Rust documentation for [pallet::call](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#call-palletcall-optional).

### #[pallet::error]

The [`#[pallet::error]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet#error-palleterror-optional) macro allows you to define the error types that can be returned from the function calls dispatched to the runtime.
The error information is included in the runtime metadata.

The macro must be defined as an enumeration named Error with a generic type <T> and variants with or without fields.

For example:

```rust
#[pallet::error]
pub enum Error<T> {
	/// $some_optional_doc
	$SomeFieldLessVariant,
	/// $some_more_optional_doc
	$SomeVariantWithOneField(FieldType),
	...
}
```

Any field type you specify for an enumeration variant must implement the `scale_info::TypeInfo` trait and its encoded size should be as small as possible.
Field types in enum variants must also implement the [PalletError](https://paritytech.github.io/substrate/master/frame_support/traits/trait.PalletError.html) trait to compile.

For more information, see the Rust documentation for [pallet::error](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#error-palleterror-optional).

### #[pallet::event]

The [`#[pallet::event]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#event-palletevent-optional) macro allows you to define event types for a pallet.

This macro is similar to the `pallet::error` macro but it can hold more information.
The macro is defined as an enumeration named Event.

For example:

```rust
#[pallet::event]
#[pallet::generate_deposit($visibility fn deposit_event)] // Optional
pub enum Event<$some_generic> $optional_where_clause {
	/// Some doc
	$SomeName($SomeType, $YetanotherType, ...),
	...
}
```

For more information, see the Rust documentation for [pallet::event](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#event-palletevent-optional).

### #[pallet::storage]

The [`#[pallet::storage]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#storage-palletstorage-optional) macro enables you to define abstract storage inside runtime storage and to set metadata for that storage.
This attribute macro can be used multiple times.

The `[pallet::storage]` macro can be defined using named or unnamed generics with a type alias of StorageValue, StorageMap or StorageDoubleMap.

```rust
#[pallet::storage]
#[pallet::getter(fn $getter_name)] // optional
$vis type $StorageName<$some_generic> $optional_where_clause
	= $StorageType<$generic_name = $some_generics, $other_name = $some_other, ...>;
```

For more information, see the Rust documentation for [pallet::storage](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#storage-palletstorage-optional) and the following storage data structures:

- [StorageDoubleMap](https://paritytech.github.io/polkadot-sdk/master/frame_support/storage/types/struct.StorageDoubleMap.html)
- [StorageMap](https://paritytech.github.io/polkadot-sdk/master/frame_support/storage/types/struct.StorageMap.html)
- [StorageValue](https://paritytech.github.io/polkadot-sdk/master/frame_support/storage/types/struct.StorageValue.html)

### #[pallet::type_value]

The `#[pallet::type_value]` macro enables you to define a struct that implements a `Get` trait for storage types. This attribute macro can be used multiple times in combination with the #[pallet::storage] macro to define default values in storage.

```rust
#[pallet::type_value]
fn MyDefault<T: Config>() -> T::Balance { 3.into() }
```

For more information about using this macro, see the Rust documentation for [pallet::type_value](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#type-value-pallettype_value-optional).

### #[pallet::genesis_build]

The [`#[pallet::genesis_build]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#genesis-build-palletgenesis_build-optional) macro allows you to define how a genesis configuration is built.

The macro is defined as a Rust trait implementation with a generic type <T: Config> of trait GenesisBuild<T> on type GenesisConfig.

For example:

```rust
#[pallet::genesis_build]
impl<T: Config> GenesisBuild<T> for GenesisConfig {
	fn build(&self) {}
}
```

For more information, see the Rust documentation for [pallet::genesis_build](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#genesis-build-palletgenesis_build-optional).

### #[pallet::genesis_config]

The [`#[pallet::genesis_config]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#genesis-config-palletgenesis_config-optional) macro allows you to define the genesis configuration of the pallet.

The macro can be defined as an enumeration or a struct, but must be public and implement trait the GenesisBuild with the #[pallet::genesis_build] macro.

For example:

```rust
#[pallet::genesis_config]
pub struct GenesisConfig<T: Config> {
	_myfield: BalanceOf<T>,
}
```

For more information, see the Rust documentation for [pallet::genesis_config](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#genesis-config-palletgenesis_config-optional).

### #[pallet::inherent]

The [`#[pallet::inherent]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#inherent-palletinherent-optional) macro allows the pallet to provide data in an unsigned inherent transaction.

The macro is defined as a trait implementation with bound <T: Config,> of trait ProvideInherent for type Pallet<T>.

For example:

```rust
#[pallet::inherent]
impl<T: Config> ProvideInherent for Pallet<T> {
	// ... regular trait implementation
}
```

For more information, see the Rust documentation for [pallet::inherent](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#inherent-palletinherent-optional).

### #[pallet::origin]

The [`#[pallet::origin]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#origin-palletorigin-optional) macro allows you to define an origin for the pallet.

The macro must be defined as a type alias, enumeration, or struct.
The macro must be public.

For example:

```rust
#[pallet::origin]
pub struct Origin<T>(PhantomData<(T)>);
```

For more information, see the Rust documentation for [pallet::origin](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#origin-palletorigin-optional).

### #[pallet::validate_unsigned]

The [`#[pallet::validate_unsigned]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#validate-unsigned-palletvalidate_unsigned-optional) macro allows the pallet to validate unsigned transactions.

The macro is defined as a trait implementation with bound <T: Config> of trait ValidateUnsigned for type Pallet<T>.

For example:

```rust
#[pallet::validate_unsigned]
impl<T: Config> ValidateUnsigned for Pallet<T> {
	// ... regular trait implementation
}
```

For more information, see the Rust documentation for [pallet::validate_unsigned](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#validate-unsigned-palletvalidate_unsigned-optional).

## Runtime construction macros

As an introduction to the use of macros, [Substrate runtime macros](#substrate-runtime-macros) highlighted several of the macros that are provided in the `frame_support` and `frame_system` crates.
However, a few of those macros introduced in Substrate runtime macros warrant additional attention because of the role they play in constructing the runtime logic.

### construct_runtime!

The `construct_runtime!` macro generates all of the data structures that have been declared and implemented for the pallets to be included in the runtime.

For example, the `construct_runtime!` macro extrapolates information from the pallet attribute macros to generate details such as:

- Runtime struct to represent the Substrate runtime.
- Call enumeration variants and metadata for each pallet included in the runtime that has callable functions.
- Event enumeration variants for each pallet included in the runtime that emits events.
- Genesis configuration struct for building storage for each pallet included in the runtime that defines storage items.
- Inherent data for pallets that support inherent transactions.
- Origin enumeration variants for pallets that identify the function caller using the default origin definition or pallet-specific custom origins.
- Validation for unsigned transactions for pallets that support unsigned transactions.

The `construct_runtime!` macro also implements helper traits for the data structures and types exposed, generates an index of the pallets listed in the runtime, and maps events, errors, and callable functions from the runtime back to the pallet they originate from.

By default, the `construct_runtime!` macro includes all pallet attributes for all pallets listed in the macro definition.
You can override the default behavior to exclude specific parts or to only include specific parts.
For example, if you don't want the runtime to expose the function calls defined in specific pallet, you can explicitly exclude them in the `construct_runtime!` macro with an entry similar to the following:

```rust
MyCustomPallet: pallet_my_custom_pallet exclude_parts { Call }
```

In this example, `MyCustomPallet` is the name that uniquely identifies the pallet that requires special handling and `pallet_my_custom_pallet` represents the path to the pallet.
The `exclude_parts` keyword specifies that you only want to exclude certain attributes for the specified pallet.
In this case, only callable functions for MyCustomPallet are excluded.

Similarly, you can override the default to explicitly include certain parts in the runtime with the `use_parts` keyword.
For example, if you only want the runtime to expose a subset of attributes for a specific pallet, you can explicitly include them in the `construct_runtime!` macro with an entry similar to the following:

```rust
MyCustomPallet: pallet_my_custom_pallet use_parts { Pallet, Call, Storage, RuntimeEvent, RuntimeOrigin, Config }
```

You should note the the order in which pallets are listed in the `construct_runtime!` macro is significant.
By default, the pallet index starts at zero for the first pallet and is incremented for each pallet thereafter.
You can manually adjust the indexing in the `construct_runtime!` macro by adding an index number for a pallet.
For example, you can generate all pallet attributes for the `MyCustomPallet` and set the index to eight with syntax like this:

```rust
MyCustomPallet: pallet_my_custom_pallet use_parts = 8,
```

However, you should also note that the order used for defining pallets in the construct_runtime! macro affects the genesis storage configuration.
If you have one pallet that depends on another pallet, be sure the pallet that is depended upon comes before—that is, is listed before or has a lower index value—than the pallet that depends on it.

For more information, see the Rust documentation for [construct_runtime](https://paritytech.github.io/substrate/master/frame_support/macro.construct_runtime.html)

### parameter_types!

The `parameter_types!` macro declares the parameter types that are to be assigned to the configuration trait for each pallet during runtime construction.

This macro converts each parameter specified into a struct type with a `get()` function that returns the specified type.
Each parameter struct type also implements a `frame_support::traits::Get<I>` trait to convert the type to its specified value.

For more information, see the Rust documentation for [parameter_types](https://paritytech.github.io/substrate/master/frame_support/macro.parameter_types.html).

### impl_runtime_apis!

The `impl_runtime_apis!` macro generates the runtime API for all of the traits that are implemented by the macro.
The traits implemented in this macro must first be declared in the `decl_runtime_apis` macro.
The macro generates the `RuntimeApi` and `RuntimeApiImpl` structs to expose these traits as [runtime APIs](/reference/runtime-apis/).
The traits exposed by the macro enable outer node components to communicate with the runtime through the `RuntimeApi` type.

The macro declares the `RuntimeApi` and `RuntimeApiImpl` structs and implements various helper traits for the `RuntimeApiImpl` struct.
If you define additional interfaces for the runtime to expose in the `impl_runtime_apis!` macro, they are appended to the default `RuntimeApiImpl` implementation.

The macro also generates the `RUNTIME_API_VERSIONS` constant to expose version information about all of the implemented `api` traits.
This constant is used to instantiate the `apis` field of [`RuntimeVersion`](https://paritytech.github.io/substrate/master/sp_version/struct.RuntimeVersion.html).

For more information, see the Rust documentation for [impl_runtime_apis](https://paritytech.github.io/substrate/master/sp_api/macro.impl_runtime_apis.html).

### app_crypto!

The `app_crypto!` macro generates application-specific cryptographic key pairs using the specified signature algorithm.

The macro declares the following struct types:

- `Public`

  For the `Public` type, the macro implements the `sp_application_crypto::AppKey` trait to define the public key type and the `sp_application_crypto::RuntimeAppPublic` trait enable generating key pairs, signing transactions, and verifying signatures.

- `Signature`

  For the `Signature` type, the macro implements the `core::hash::Hash` trait to specify the signature algorithm—for example, SR25519 or ED25519—used to hash the signature.

- `Pair`

  For the `Pair` type, the macro implements the
  `sp_application_crypto::Pair` and `sp_application_crypto::AppKey` traits to
  generate public-private key pairs from a secret phrase or seed.

In addition to the traits for these structs, the macro implements helper traits.

For more information, see the Rust documentation for [app_crypto](https://paritytech.github.io/substrate/master/sp_application_crypto/macro.app_crypto.html).

## Benchmarking macros

The FRAME benchmarking framework defines several macros for benchmarking pallets.
The following macros are used for benchmarking:

- `add_benchmark` to add pallet benchmarks to a `Vec<BenchmarkBatch>` object using the pallet crate name and generated module struct.
- `benchmarks` to construct the benchmark logic for testing the execution time for function calls.
- `benchmarks_instance` to provide the same functionality as the `benchmarks` macro for instantiable modules.
- `benchmarks_instance_pallet` to provide the same functionality as the `benchmarks` macro for instantiable pallets that are declared with the [`frame_support::pallet`] macro.
- `cb_add_benchmarks` to call `add_benchmark` as a callback for the `define_benchmarks` macro.
- `cb_list_benchmarks` to call `list_benchmark` as a callback for the `define_benchmarks` macro.

- `define_benchmarks` to define all of the benchmarked pallets for the runtime.

- `impl_benchmark_test_suite` to create a test suite that runs the benchmarks defined in the benchmarking module.

- `list_benchmark` to generate a list of benchmarks for the pallets configured in the runtime.

- `whitelist` to add accounts to an allow list for testing purposes.

## References

- [The Rust Programming Language](https://doc.rust-lang.org/book/ch19-06-macros.html)
- [The Little Book of Rust Macros](https://danielkeep.github.io/tlborm/book)
