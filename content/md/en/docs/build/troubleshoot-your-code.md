---
title: Troubleshoot your code
description: Highlights general and Substrate-specific coding techniques for troubleshooting issues and following best practices.
keywords:
  - coding practices
  - software development principles
  - readability
  - debugging
  - security issues
---

Because Substrate and FRAME provide a flexible and modular framework for building blockchain applications, it’s important to follow common best practices and basic coding principles to avoid introducing errors or making code difficult to debug.

## General coding practices

The following general principles aren’t unique to Substrate or to using FRAME but they are particularly important when building complex software with stringent security requirements and constrained resources like a blockchain application:

- [Formatting and readability](https://code.tutsplus.com/tutorials/top-15-best-practices-for-writing-super-readable-code--net-8118). Use consistent formatting and follow best practices for writing readable code to make your programs easy for you and others to understand and maintain.
- [Comments](https://stackoverflow.blog/2021/12/23/best-practices-for-writing-code-comments/). Add clear and concise comments to your code to explain what the code does, and, where applicable, why the code is written the way it is.
- [ Style and naming conventions](https://doc.rust-lang.org/1.0.0/style/style/naming/README.html). Follow the Rust style guidelines and naming conventions to make your code consistent with other Rust programs and make it easier for other Rust programmers to read and debug your code.
- [Licencing](https://opensource.guide/legal/#which-open-source-license-is-appropriate-for-my-project). Ensure your repository includes the appropriate open source license and any licenses, copyright notices, and attributions required for code you're using that you didn't write. In most cases, if you are using code you didn't write, you should retain the original licenses and mention the authors.
- [Refactoring](https://en.wikipedia.org/wiki/Code_refactoring). Improve the design, structure, or implementation of your code code to create simpler, cleaner, more performant, or more expressive programs. In general, refactoring simplifies code logic with changing the code functionality and results in code that is more readable, maintainable, and extensible.
- [Don’t repeat yourself (DRY)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Follow the DRY principle of software development and use data abstractions or data normalization to avoid redundancy.
- [Testing](https://en.wikipedia.org/wiki/Unit_testing). Write and execute unit tests to ensure all individual software components work as intended. For more information about unit testing and testing modules in the runtime, see [Test](/test/).
- [Errors and warnings](https://rustc-dev-guide.rust-lang.org/diagnostics.html). Address all errors and warnings reported by the compiler to ensure you understand the cause of the error or warning and how to resolve it.
- [Dependencies](https://developerexperience.io/articles/updating-the-dependencies). Update dependencies regularly to ensure your code doesn't fall too far behind new releases and become out of date. You should periodically update the Rust compiler and toolchain and check for changes where there are new releases of Polkadot.
- [Hard coding](https://en.wikipedia.org/wiki/Hard_coding). Avoid embedding data directly in the source code.

## Common Substrate issues

There are a few common aspects of Substrate that can introduce errors or cause performance issues if not handled correctly.
As you are writing the logic for your chain, you should pay particular attention to the following potential trouble spots:

- [Benchmarks](#benchmarks)
- [Pallet coupling](#pallet-coupling)
- [Offchain workers](#offchain-workers)
- [Storage](#storage)
- [Events](#events)

### Benchmarks

The Substrate benchmarking system is designed to help you determine the appropriate weight to assign to the functions in your pallets.
Setting an appropriate weight is a critical step to ensure that your blockchain is reliable and secure.
Although you can skip benchmarking and setting weights for transactions in the early phases of development, you should be aware that using a weight of zero makes your code vulnerable to attack.
If there are no transaction fees associated with the execution of a function, a malicious actor could call the function repeatedly—essentially spamming the network with transactions—to halt the chain in a denial of service (DoS) attack.

In general, you should ensure that all functions that can be executed in the runtime have a weight defined and subtract a corresponding fee from a calling account.
Transaction fees are typically an important economic incentive to prevent denial of service (DoS) attacks and create a sustainable economic model for the chain.

For more information about the benchmarking system, see [Benchmark](/test/benchmark/).
For a simple example of how to write and run benchmarks, see [Add benchmarks](/reference/how-to-guides/weights/add-benchmarks/).

### Pallet coupling

In Substrate, there are two ways that one pallet can call the functions in another palletPallet coupling is about how a pallet can call functions in another pallet.

- **Tight pallet coupling** is more restrictive and most often used when one pallet depends on all or a substantial number of the types and methods in the other pallet.
- **Loose pallet coupling** is more flexible and most often used when one pallets depends on specific traits or function interfaces an interface that another pallet exposes.

Tight pallet coupling requires both pallets to be installed in the runtime and the pallets can't be used independently.
In addition, tightly-coupled pallets can be harder to maintain because changes in one pallet often require changes in the other pallet.
In most cases, loose coupling is more flexible solution because you can reuse types and interfaces from another pallet without including that pallet in the runtime.

For more information about tight and loose pallet coupling, see [Pallet coupling](/build/pallet-coupling/) and this [code example](https://substrate.stackexchange.com/questions/922/pallet-loose-couplingtight-coupling-and-missing-traits?rq=1).
For simple examples of pallet coupling see [Use tight pallet coupling](/reference/how-to-guides/pallet-design/use-tight-coupling/) and [Use loose pallet coupling](/reference/how-to-guides/pallet-design/use-loose-coupling/).

### Offchain workers

You can use offchain operations to query data from offchain sources or to process data offchain.
For example, offchain workers enable you to offload the execution of tasks that might take longer than the maximum block execution time allows.
However, some characteristics of offchain operations can have unintended consequences.
If you plan to use offchain workers, you should consider the following:

- By default, offchain workers run on validator nodes when those nodes are performing their block authoring.
- If you want to run an offchain worker on a node that is not a validator, you must use the `--offchain-worker always` command-line option.
- To prevent any node—validator or not—from running an offchain work, you can use the `--offchain-worker never` command-line option.
- If you have offchain workers running as parallel processes on he network, you might need to implement concurrent programming techniques to avoid race conditions.
- By default, offchain workers are triggered for every block import even if the block isn't finalized.
- Because offchain worker have full access to state, you can create conditions that trigger them to run only in some specific cases.

For more information about offchain operations, see [Offchain operations](/learn/offchain-operations/).
For examples of how to use offchain components, see [Offchain workers](/reference/how-to-guides/offchain-workers/).

### Storage

As discussed in [Runtime storage](/build/runtime-storage/), the fundamental principle for blockchain storage is to minimize both the number and size of the data items you store.
Storing data unnecessarily can lead to slow network performance and resources running out.

In planning and reviewing your code for potential issues, keep the following guidelines in mind:

- Only store critical information.
- Don’t store intermediate or transient information.
- Don’t store data that won’t be needed if the operation fails.
- If possible, don’t store information that is already stored in another structure
- Store limited length hashed data where possible.

As a general rule, it is better to have one larger data structure than many smaller data structures to reduce complexity and the number of read and write operations.
However, this isn't always the case and you should use benchmarking to measure and optimize how you store data on a case-by-case basis.

Both lists and storage maps incur storage costs, so you should be conscious about how you use them. The more items you have in a list or a map, the more iterating over the items affects the performance in the runtime.
Storage maps often store unbounded sets of data, and—because accessing the elements of a map requires more database reads than accessing the elements of a list—iterating when using storage maps can be significantly more costly.

Being conscious of the time required to iterate over items in a storage map is particularly important if your project is a parachain.
If the time required to iterate over storage exceeds the maximum time allowed for block production, the blockchain will stop producing blocks and thus stop working.

In general, you should avoid having unbounded data in storage maps and avoid iterating over storage maps that store a large data set.
You should use benchmarks to test the performance of all functions in the runtime under different conditions, including iterating over a large number of items in a list or storage map.
By testing for specific conditions—for example, triggering a function to execute over a large data set with many iteractions—benchmarks can help you identify when it's best to enforce boundaries by limiting the number of elements in a list or the number of iterations in a loop.

For more guidelines about storage and storage structures, see [State transitions and storage](/learn/state-transitions-and-storage) and [Runtime storage](/build/runtime-storage/).
For more information about iterating over storage, see [Iterating over storage maps](/build/runtime-storage/#iterating-over-storage-maps).

### Events

Pallets typically emit events to send notifications about changes to data or conditions in the runtime to receiving entities—like users or applications—that are outside of the runtime.

In custom pallets, you can define the following event-related information:

- The type of the event.
- The information contained within the event.
- The conditions for emitting the event.

In general, events inform users or applications such as a block explorer that a change occurred.
Events aren't intended to describe differences in state or to contain detailed information.
You should use caution in adding more information to an event than is needed because additional information increases storage and computational overhead involved in producing events.
If additional information about a change is needed, users can query the chain state.

For information about adding events to a custom pallet, see [Declaring an event](/build/events-and-errors/#declaring-an-event).

## Unsafe or insecure patterns

Secure operations and coding principles are critical for ensuring data integrity and the viability of a blockchain.
There are several common unsafe or insecure coding practices that can introduce errors or make you chain vulnerable to attack if not handled correctly.
As you are writing the logic for your chain, you should pay particular attention to the following potential trouble spots:

- [Error handling](#error-handling)
- [Unsafe math: floating point numbers](#unsafe-math-floating-point-numbers)
- [Unsafe math: overflows](#unsafe-math-overflows)
- [Unbounded Vec data types](#unbounded-vec-data-types)

### Error handling

Runtime code should explicitly and gracefully handle all error cases.
In general, you shouldn't use the `panic!` macro for error handling except in tests and benchmarks.
Functions in the runtime should never generate a panic and must not throw errors.
Only bugs detected by the compiler should generate unrecoverable panic errors.

In Rust, you should write functions that use the `Result` type to return errors with the `Err` variant. The `Result` type with the `Err` variant allows the function to indicate failed execution without panicking.
As a best practice, you should have many individual and specific error messages to make it easier it to diagnose problems.

You should also be aware that using `unwrap()` in the runtime with the `Result` type can generate undefined behavior.
Instead of using `unwrap()`, try using `ok_or`, `unwrap_or`, `ensure` or returning `Err` in a matching pattern.
For example:

```text
let a = TryInto::<u128>::try_into(id.fee).ok().unwrap();
let b = a.checked_mul(8).ok_or(Error::<T>::Overflow)?
         .checked_div(10).ok_or(Error::<T>::Overflow)?;

let b = id.fee
    .checked_mul(&8u32.saturated_into()).ok_or(Error::<T>::Overflow)?
    .checked_div(&10u32.saturated_into()).ok_or(Error::<T>::Overflow)?;
```

For more information about error handling in pallets, see [Error pallet attribute](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#error-palleterror-optional) and [Errors](/build/events-and-errors/#errors).

### Unsafe math: Floating point numbers

Blockchains require deterministic operations to ensure that independent nodes can reach consensus reliably.
Because floating point numbers can lead to non-deterministic results, you should avoid operations involving floating point numbers and always use fixed point arithmetic in the runtime.
Substrate provides primitives for use fixed point arithmetic in the [`sp_arithmetic`](https://paritytech.github.io/substrate/master/sp_arithmetic/index.html) crate.

You can use specific **Per** methods to represent a part of a whole depending on the precision you need.
For example:

- Percent: Parts per hundred represents [0, 1] from [0, 100].
- Permill: Parts per million represents [0, 1] from [0, 1_000_000].
- Perbill: Parts per billion represents [0, 1] from [0, 1_000_000_000].

Note that using higher resolution requires data types with higher sizes, so having more precision comes with a cost.

### Unsafe math: Overflows

Overflows happen if the computed value of data to be returned exceeds the limits of its defined data type.
There are two ways you can handle data overflows: use of saturating methods or handle the case of an invalid value using checked arithmetic operations.

- Use `saturating` methods.
  If the result of an operation would be too large for the type, `saturating` methods return the maximum value of the type.
  If the result would be too small, `saturating` methods return the minimum value of the type.
  For more information, see [Saturating](https://doc.rust-lang.org/std/num/struct.Saturating.html).

- Use `checked_*` methods.
  These methods perform the calculations in an isolated environment and, based on the result, return Some or None.
  For more information, see [checked_add](https://doc.rust-lang.org/std/primitive.u32.html#method.checked_add).

### Unbounded Vec data types

As noted in [Runtime storage](/build/runtime-storage/) and [Storage](#storage), it's important to minimize the number and size of the data items you store to ensure the chain is performant and secure.
Using Vec data types without setting bounds for size makes your chain vulnerable to both intentional and unintentional misuse of the limited resources available.
For example, a malicious actor or an end-user acting without restrictions could add unlmited data and overwhelm your storage capacity, leading to undefined behavior in the runtime.
In general, any storage item with its size determined by user action should have a bound on it.

The following code illustrates an unbounded `Vec` data type:

```rust
type Proposal<T: Config> = StorageMap<_, Blake2_128Concat, T::Hash, Vec<T::Hash>, ValueQuery>;
```

For safer code, replace the `Vec` data type with the `BoundedVec` data type:

```rust
type Proposal<T: Config> = StorageMap<_, Blake2_128Concat, T::Hash, BoundedVec<T::Hash, ValueQuery>;
```

By default, all pallet storage items are limited by the bound defined in the `pallet_prelude::MaxEncodedLen` attribute.
The `#[pallet::without_storage_info]` attribute macro allows you to override this default behavior if you require unbounded storage for an entire pallet.
For example:

```text
#[pallet::pallet]
#[pallet::without_storage_info]
pub struct Pallet<T>(_);
```

This macro applies to all storage items in your pallet, so you should only use it in a test or development environment.
You should never use the `#[pallet::without_storage_info]` macro in production.
By removing this macro after testing, you can ensure that your pallet follows the default behavior.
If necessary, you can use the `#[pallet::unbounded]` attribute macro to declare a specific storage item as unbounded.

For more information about limiting storage using `BoundedVec` data types, see [Create bounds](/build/runtime-storage/#create-bounds) and [BoundedVec](https://crates.parity.io/frame_support/storage/bounded_vec/struct.BoundedVec.html).
For more information about pallet macros, see [FRAME macros](/reference/frame-macros/).

### Secure hashing algorithms

Substrate provides the following hashing algorithms by default:

- `xxHash` is a fast hashing function, but it is not cryptographically secure.
  With this hashing algorithm, hash collisions—in which different inputs hash to the same output—are possible.
  You should only use this hashing algorithm in functions that aren't available to outside entities that could try to manipulate the input and attack the system.
- `Blake2` is a relatively fast cryptographic hashing function.
  In most cases, you can use the Blake2 hashing algorithm in any situations where security matters. However, Substrate can support any hash algorithm that implements the `Hasher` trait.

For more information about hashing algorithms, see [Hashing algorithms](/learn/cryptography//#hashing-algorithms).

### Inaccurate weight

Weight is a Substrate construct that represents the resources consumed to execute a transaction in a block.
The appropriate weight for executing a transaction depends on a number of factors, including the hardware, the computational complexity, the storage requirements, and the database operation performed.
Every executable transaction should be assigned an appropriate weight.

If you have multiple transactions assigned the same weights, it's likely that the weight assignment doesn't accurately reflect the actual time of execution.
Benchmarking helps you evaluate and estimate the resources that each function in the runtime is likely to consume under different circumstances.
Modeling the expected weight of each runtime function enables the blockchain to calculate how many transactions or system-level calls it can execute within a certain period of time.

If you set the weight for a transaction too low, an attacker or an unsuspecting user can create blocks that are overweight and cause block production timeouts.
You should run appropriate benchmark tests for all functions under different conditions to ensure that that all transaction have appropriate weights that take into account the factors that affect the resources consumed.

For more information about using benchmarks and calculating weight, see [Benchmarking and weight](/test/benchmark/#benchmarking-and-weight) and [Weights](/reference/how-to-guides/weights/).

### Insecure randomness

Randomness is used in many different applications on blockchains.
Substrate provides two default implementations of randomness.

- The [insecure randomness collective flip](https://paritytech.github.io/substrate/master/pallet_insecure_randomness_collective_flip/index.html) pallet generates random values based on the block hashes from the previous 81 blocks.
  This pallet can be useful when defending against weak adversaries or in low-security situations like testing.
  For example, you can use this pallet when testing randomness-consuming pallets.
  You should never use this pallet in production as a true source of randomness.

- The [BABE](https://paritytech.github.io/substrate/master/pallet_babe/index.html) pallet uses verifiable random functions (VRF) to implement a more secure version of randomness.
  This pallet provides production-grade randomness.
  However, it isn't suite for every purpose.
  For example, the randomness provided by the BABE pallet isn't suitable for gambling applications.

As alternative to these pallets, you can use an oracle as a secure source of randomness.

For more information about using randomness, see [Randomness](/build/randomness/) and [Incorporate randomness](/reference/how-to-guides/pallet-design/incorporate-randomness/).

## Anti-patterns

Anti-patterns are solutions meant to perform common tasks that introduce more problems than they solve.
There are several coding patterns that you might be inclined to follow that fall into the category of anti-patterns you should avoid.

### Don't dispatch a function to read from storage

In Substrate, you shouldn't use a dispatchable function call to read an item from storage.
Instead, you should either define a `getter` macro for the storage item or to use an RPC method.
For example, assume you have the following storage map:

```rust
#[pallet::storage]
#[pallet::getter(fn product_information)]
pub type ProductInformation<T: Config> = StorageMap<_, Blake2_128Concat, T::Hash, Product<T::AccountId, T::Hash>>;
```

You can read the item by calling `Self::product_information(id)` instead of writing a separate dispatchable function like this:

```rust
// !!! Don't create a dispatchable function to read storage state !!!
~~~~#[pallet::weight(T::WeightInfo::get_product())]
pub fn get_product(
origin: OriginFor<T>,
id: T::Hash
) -> DispatchResult {

let sender = ensure_signed(origin)?;
let product = if <ProductInformation<T>>::contains_key(&id) {
                Some(Self::product_information(&id))
            } else { None };

match product {
            Some(value) => {
                Self::deposit_event(Event::ItemFetched(value));
            }
            None => return Err(Error::<T>::NotFound.into()),
        }
   Ok(())
}
```

For more information about declaring storage and the `getter` macro, see [Declare storage items](/build/runtime-storage/#declaring-storage-items).

If a storage `getter` macro is not flexible enough for your requirements, you can create a custom RPC method.
For information about creating a custom RPC method, see [Add custom RPC to the node](https://hackmd.io/@d9WGfolYQmSRBmnxyOQmAg/BkEANECJs).
