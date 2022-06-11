---
title: Benchmark
keywords:
---

Substrate and FRAME provide a flexible framework for developing custom logic for your blockchain. However, this flexibility can also introduce complexity that can make your blockchain vulnerable to denial of service (DoS) attacks by malicious actors.

To mitigate the risk of DoS attacks, it is important to know the computational resources required to execute different functions in the runtime.
The Substrate benchmarking framework provides tools that help you model how long it takes to execute each function in the runtime.
By benchmarking how long it takes to execute each function, you can estimate the resources required and enable the runtime to include or exclude transactions based on available resources.

## Why benchmark a pallet

To prevent malicious users from attempting to disrupt network service by repeatedly executing a function call that requires intensive computation type of activity, the cost associated with a function call should reflect the computation and storage required to perform the operation.
However, you don't want to discourage users from using the blockchain, so you want the estimated cost to be relatively accurate and aligned with the resources that actually consumed.

Benchmarking helps you to determine transaction fees for calls that more accurately represent the resources consumed by executing a transaction on the blockchain.
Setting a weight that accurately reflects the underlying computation and storage is also an important security safeguard in Substrate.

## Developing a linear model

At a high level, benchmarking requires you to perform the following steps:

* Write custom benchmarking logic that executes a specific code path for a function.
* Execute the benchmark logic in the Wasm execution environment on a specific set of hardware and with a specific runtime configuration.
* Execute the benchmark logic across a controlled range of possible values that might affect the result of the benchmark.
* Execute the benchmark multiple times at each point in order to isolate and remove outliers.
* Use the results of the benchmark to create a linear model of the function across its components.

This linear model enables you to estimate how long it takes to execute a specific code path and to make informed decisions without actually spending any significant resources at runtime.
Benchmarking assumes all transactions have linear complexity because higher complexity functions are considered to be dangerous to the runtime as the weight of these functions may explode as the
runtime state or input becomes too complex.

## Benchmarking and weight

As discussed in [Transactions, weights, and fees](/main-docs/fundamentals/tx-weight.fees/), Substrate-based chains use the concept of **weight** to represent the time it takes to execute the transactions in a block.
The time required to execute any particular call in a transaction depends on a several factors, including the following:

* Computational complexity.
* Storage complexity.
* Database read and write operations required.
* Hardware used.

To calculate an appropriate weight for a transaction, you can use benchmark parameters to measure the time it takes to execute the function calls on different hardware, using different variable values, and repeated multiple times.
You can then use the results of the benchmarking tests to establish an approximate worst case weight to represent the resources required to execute each function call and each code path.
Fees are then based on the worst case weight.
If the actual call performs better than the worst case, the weight is adjusted and any excess fees can be returned.

Because weight is a generic unit of measurement based on computation time for a specific physical machine, the weight of any function can change based on the specific hardware used for benchmarking.

By modeling the expected weight of each runtime function, the blockchain is able to calculate how many transactions or system level calls it can execute within a certain period of time.

Within FRAME, each function call that can be dispatched must have a `#[weight]` annotation that can return the expected weight for the worst case scenario execution of that function given its inputs.
The benchmarking framework automatically generates a file with those formulas for you.

## Benchmarking tools

The [FRAME benchmarking framework](/rustdocs/latest/frame_benchmarking/benchmarking/index.html) includes the following tools to help you determine the time it takes to execute function calls:

* [Benchmark macros](https://github.com/paritytech/substrate/blob/master/frame/benchmarking/src/lib.rs) to help you write, test, and add runtime benchmarks.
* [Linear regression analysis functions](https://github.com/paritytech/substrate/blob/master/frame/benchmarking/src/analysis.rs) for processing benchmark data.
* [Command-line interface (CLI)](https://github.com/paritytech/substrate/tree/master/utils/frame/benchmarking-cli) to enable you to execute benchmarks on your node.

The end-to-end benchmarking pipeline is disabled by default when compiling a node.
If you want to run benchmarks, you need to compile a node with the `runtime-benchmarks` Rust feature flag.

## Writing benchmarks

Writing a runtime benchmark is similar to writing a unit test for your pallet.
Like unit tests, benchmarks need to execute a specific logical paths in your code.
In unit tests, you check the code for specific success and failure results.
For benchmarks, you want to execute the **most computationally intensive** path.

In writing benchmarks, you should consider the specific conditions—such as storage or runtime state—that might affect the complexity of the function.
For example, if triggering more iterations in a `for` loop increases the number of database read and write operations, you should set up a benchmark that triggers this condition to get a more accurate representation of how the function would perform.

If a function executes different code paths depending on user input or other conditions, you might not know which path is the most computationally intensive.
To help you see where complexity in the code might become unmanageable, you should create a benchmark for each possible execution path.
The benchmarks can help you identify places in the code where you might want to enforce boundaries—for example, by limiting the number of elements in a vector or limiting the number of iterations in a `for` loop—to control how users interact with your pallet. 

You can find examples of end-to-end benchmarks in the prebuilt FRAME pallets.
You can find details about using the `benchmarks!` macro in the [source code](https://github.com/paritytech/substrate/blob/master/frame/benchmarking/src/lib.rs).

## Testing benchmarks

You can test your benchmarks using the same test runtime that you created for your pallet's unit
tests.
If you use the `benchmarks!` macro to create your benchmarks, the macro automatically generates test functions for you.
For example:

```rust
fn test_benchmark_[benchmark_name]<T>::() -> Result<(), &'static str>
```

You can add the benchmark functions to a unit test and ensure that the result of the function is `Ok(())`.

### Verify blocks

In general, you only need to check that a benchmark returned `Ok(())` because that result indicates that the function was executed successfully.
However, you can optionally include a `verify` block with your benchmarks if you want to verify any final conditions, such as the final state of your runtime.
The additional `verify` blocks don't affect the results of your final benchmarking process.

### Run the unit tests with benchmarks

To run the tests, you need to enable the `runtime-benchmarks` feature flag.
However, Substrate uses a virtual workspace that does not allow you to compile with feature flags.
If you see an error that `--features is not allowed in the root of a virtual workspace`, you can navigate to the folder of the node (`cd bin/node/cli`) or pallet (`cd frame/pallet`) and run the `cargo test` command in that directory.

For example, you can test the benchmarks for the Balances pallet by running the following command:

```bash
cargo test -p pallet-balances --features runtime-benchmarks
```

## Adding benchmarks

The benchmarks included with each pallet are not automatically added to your node.
To execute these benchmarks, you need to implement the `frame_benchmarking::Benchmark` trait.
You can see an example of how to do this in the [Substrate node](https://github.com/paritytech/substrate/blob/master/bin/node/runtime/src/lib.rs).

Assuming there are already some benchmarks set up on your node, you just need to add another
instance of the `add_benchmark!` macro:

```rust
///  configuration for running benchmarks
///               |    name of your pallet's crate (as imported)
///               v                   v
add_benchmark!(params, batches, pallet_balances, Balances);
///                       ^                          ^
///    where all benchmark results are saved         |
///            the `struct` created for your pallet by `construct_runtime!`
```

After you have added the implementation of the `Benchmark` trait for your pallet, compile your node binary with the `runtime-benchmarks` feature flag.
For example:

```bash
cd bin/node/cli
cargo build --profile=production --features runtime-benchmarks
```

The `production` profile applies various compiler optimizations.  
These optimizations slow down the compilation process *a lot*.  
If you are just testing things out and don't need final numbers, use `--release` instead.

## Running benchmarks

After you have compiled a node binary with benchmarks enabled, you need to execute the
benchmarks.
You can list the available benchmarks by running the following command if you used the `production` profile:

```bash
./target/production/substrate benchmark pallet --chain dev --pallet "*" --extrinsic "*" --repeat 0
```

To execute the benchmarks, you can start the node by running a command similar to the following:

```bash
./target/production/substrate benchmark pallet \
    --chain dev \                  # Configurable Chain Spec
    --execution=wasm \             # Always test with Wasm
    --wasm-execution=compiled \    # Always used `wasm-time`
    --pallet pallet_balances \     # Select the pallet
    --extrinsic transfer \         # Select the extrinsic
    --steps 50 \                   # Number of samples across component ranges
    --repeat 20 \                  # Number of times we repeat a benchmark
    --output <path> \              # Output benchmark results into a folder or file
```

This command creates an output file for the selected pallet—for example, `pallet_balance.rs`—that implements the `WeightInfo` trait for your pallet.
Each blockchain should generate its own benchmark file with their custom implementation of the `WeightInfo` trait.
This means that you will be able to use these modular Substrate pallets while still keeping your network safe for your specific configuration and requirements.

The benchmarking CLI uses a Handlebars template to format the final output file. 
You can optionally pass the `--template` command-line option to specify a custom template instead of the default.
Within the template, you have access to all the data provided by the `TemplateData` struct in the
benchmarking CLI writer.

There are some custom Handlebars helpers included with the output generation:

* `underscore`: Add an underscore to every 3rd character from the right of a string. Primarily to be used for delimiting large numbers.
* `join`: Join an array of strings into a space-separated string for the template. Primarily to be used for joining all the arguments passed to the CLI.

To get a full list of available options when running benchmarks, run:

```bash
./target/production/substrate benchmark --help
```

## Where to go next

- [`frame-benchmarking` README](https://github.com/paritytech/substrate/blob/master/frame/benchmarking/README.md)
- [Substrate Seminar: Benchmarking Your Substrate Pallet](https://www.youtube.com/watch?v=Qa6sTyUqgek)
- [How-to: Add benchmarks to your pallet](/reference/how-to-guides/weights/add-benchmarks)
