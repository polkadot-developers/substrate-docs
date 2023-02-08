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

For more information about offchain operations, see [Offchain operations](/fundamentals/offchain-operations/).
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

Documentation: State transitions and storage, Runtime storage
How to guide and tutorials: Use maps for storing values

#5. Iterations
Using lists and storage maps both incur storage costs so you should be conscious about how you use them. The greater their size the greater their affect on the performance when iterating over them in the runtime.
Storage maps often store unbounded sets of data, and as accessing the elements of a map requires more database reads than accessing the elements of a list, iterating on maps can be significantly more costly.
This is problematic for parachains because in case iterating over the storage exceeds the block production time, the blockchain will stop producing blocks and thus stop working.
Although it is not necessarily wrong to iterate over storage maps as a general principle it is best to either avoid it or do it very consciously.
Benchmarks can help you identify cases when it is best to enforce boundaries by limiting the number of elements in a list or the number of iterations in a loop.
To understand this, you need to ensure that these benchmarks consider all specific conditions of the functions, including triggering a high number of iterations as well.
Documentation: Iterating over storage maps

#6. Events
Events are emitted to send notifications about changes or conditions in the runtime to external entities like users, chain explorers or dApps.
In custom pallets you can define:
the type of the event,
the information contained within the event and
the conditions for emitting the event.
Generally the events should inform that a change has occured, but should not inform about all differences in state and should not contain huge amount of data. Adding more data to an event may look like a simplification but it also causes each event to incur more storage overhead and computational overhead during cleanup. In case some data is needed, it should be queried from the chain state.
As events are a vector temporarily stored in the state of the chain, there should not be much difference between having fewer larger events versus more smaller events.
Documentation: Events
How to guide and tutorials: Declaring an event

II. Security related issues
#1. Error handling
Runtime code should explicitly and gracefully handle all error cases. As a general rule panicking should not be used for error handling except in tests and benchmarks.
Functions in the runtime should never cause panics and must be non-throwing. Panics should only signal bugs in the program.
The common way of writing non-throwing functions is to use Result types which possesses an Err variant that allows the function to indicate failed execution without panicking.
It is best to have many individual error messages, as the more specific these messages are, the easier it is to diagnose any problem.
Using unwrap() in the runtime with Result types should be done very carefully as it can generate undefined behavior. Using ok_or, unwrap_or, ensure or returning Err in a matching pattern is recommended.
Code example
let a = TryInto::<u128>::try_into(id.fee).ok().unwrap();
let b = a.checked_mul(8).ok_or(Error::<T>::Overflow)?
         .checked_div(10).ok_or(Error::<T>::Overflow)?;

let b = id.fee
    .checked_mul(&8u32.saturated_into()).ok_or(Error::<T>::Overflow)?
    .checked_div(&10u32.saturated_into()).ok_or(Error::<T>::Overflow)?;

Documentation: Error enum
How to guide and tutorials: Errors

#2. Unsafe math: Floating point numbers
Floating point numbers can lead to non-deterministic result, which is not fitting for bloackchains where many independent nodes have to reach consensus reliably.
The solution is fixed point arithmetic, which is critical for determinism in the runtime. Substrate provides tools for this in the crate sp_arithmetic.
You can use specific Per* methods to represent a part of a whole depending on the precision you need, e.g.:
Percent: Parts per hundred - represents [0, 1] from [0, 100]
Permill: Parts per million - represents [0, 1] from [0, 1_000_000]
Perbill: Parts per billion - represents [0, 1] from [0, 1_000_000_000]
Using higher resolution means more information which needs data types of higher sizes, so having more precision comes with a cost.
Documentation: Fixed point arithmetic
#3. Unsafe math: Overflows
Overflows (and underflows) happen if the value of a certain data after computation exceeds the limits of its type.
To deal with overflows you can either make use of saturating methods or handle the case of an invalid value using checked arithmetic operations.
saturating_* methods: when saturating if the result of an operation would be too large for the type, saturation yields the max value of the type (e.g. 2^(n) -1 for unsigned or 2^(n-1) -1 for unsigned types), and if the result would be too small, saturation yields the min value of the type (e.g. 0 for unsigned or -2^(n-1) for signed types).
checked_* methods: these methods perform the calculations in an isolated environment and based on the output results it will return Some or None .
Documentation: Saturating_*, Checked_*

#4. Unbounded Vec
The fundamental principle for runtime storage is to minimize the number and size of the data items you store to ensure the chain is both performant and secure.
Having vecs without a check for size opens up the possibility for anyone to DOS attack the chain or add garbage to it with no restriction, which can lead to undefined behaviour of the runtime. In general, any storage item whose size is determined by user action should have a bound on it.
Code example with Vec:
type Proposal<T: Config> = StorageMap<_, Blake2_128Concat, T::Hash, Vec<T::Hash>, ValueQuery>;

Code example with BoundedVec:
type Proposal<T: Config> = StorageMap<_, Blake2_128Concat, T::Hash, BoundedVec<T::Hash, ValueQuery>;

By default, all pallet storage items are limited by the bound defined in the pallet_prelude::MaxEncodedLen attribute. The #[pallet::without_storage_info] attribute macro allows you to override this default behavior if you require unbounded storage for an entire pallet.
#[pallet::pallet]
#[pallet::generate_store(pub(super) trait Store)]
#[pallet::without_storage_info]
pub struct Pallet<T>(_);

This macro applies to all storage items in your pallet, so you should only use it in a test or development environment but not in production. By removing this macro you can make sure your pallet follows the default behaviour. If necessary the #[pallet::unbounded] attribute macro enables you to declare only a specific storage item as unbounded.
Documentation: Create bounds, Bounded Vec, Macros

#5. Using the appropriate hashing function
Substrate provides two hash algorithms out of the box: xxHash & Blake2.
xxHash is a fast hash function but it is not cryptographicly secure, which means it is possible to create hash collision, finding an input that hashes to the same output. Such functions should only be used in places that are not available for outside parties that could try and manipulate its input to attack the system.
It is recommended to move away from using xxHash at least in the scenarios where security matters. The Blake2 hash function could be used in such situations but Substrate can support any hash algorithm which implements the Hasher trait.
Documentation: Hashing algorithms

#6. Extrinsics with the same weights
Every extrinsic must have a weight that represents the time it takes to execute the transaction in a block and thus it should depend on the hardware, the computational/storage complexity and the required database operation of the extrinsic.
If the extrinsics are assigned the same weights then there is good chance that the weight does not reflect the actual time of execution.
By modeling the expected weight of each runtime function, the blockchain is able to calculate how many transactions or system level calls it can execute within a certain period of time.
With “underweighted” extrinsics an attacker or an unsuspecting user can create “overweighted” blocks that cause block production timeouts.
Please make sure that all extrinsics have weights that are determined appropriately and proportional to the factors mentioned above.
Documentation: Benchmarking and weight
How to guide and tutorials: Weights

#7. Using insecure randomness
Randomness is used in many different applications on blockchains. Substrate provides two implementations of Randomness.
The Randomness Collective Flip Pallet is based on collective coin flipping and is very fast, but highly predictable and thus not very secure. This pallet should not be used in production as a true source of randomness, but only when testing randomness-consuming pallets.
A more secure implementation of Randomness is the BABE pallet, which uses verifiable random functions. This pallet provides production-grade randomness, but it has its own limits for security, and cannot be used for every purpose e.g. for gambling.
Another option to get a secure source of randomness is to use an oracle solution.
Documentation: Randomness
How to guide and tutorials: Incorporate randomness

III. Antipatterns
#1. Creating a dispatchable function to read item from storage
Creating a dispatchable function to read item from storage is not considered as good practice in Substrate ecosystem. The correct way is either to define a getter on a storage item, or to create a custom RPC method.
For example: If we have a storage map:
```rust
#[pallet::storage]
#[pallet::getter(fn product_information)]
pub type ProductInformation<T: Config> = StorageMap<_, Blake2_128Concat, T::Hash, Product<T::AccountId, T::Hash>>;
```

We can read the item by calling Self::product_information(id) instead of writing a separate dispatchable function like this 👇
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
~~~~
```

For more details, please go through below links :
How to declare storage items in Substrate
If a storage getter method is not flexible enough for your specific requirements, you can create a custom RPC method (see doc).
Remote procedure calls
Add custom RPC to the node
