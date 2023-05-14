---
title: Build process
description: Describes how a Substrate node is compiled into platform-native and WebAssembly binaries and how the binaries are used to execute calls into the Substrate runtime.
keywords:
---

In [Architecture](/learn/architecture), you learned that a Substrate node consists of an outer node host and a runtime execution environment.
These node components communicate with each other through runtime API calls and host function calls.
In this section, you'll learn more about how the Substrate runtime is compiled into a platform-native executable and into a WebAssembly (Wasm) binary that is stored on the blockchain.
After you see the inner-working of how the binaries are compiled, you'll learn more about why there are two binaries, when they are used, and how you can change the execution strategies, if you need to.

## Compiling an optimized artifact

You probably already know that you can compile a Substrate node by running the `cargo build --release` command in the root directory for a Substrate node project.
This command builds both the platform-specific executable and WebAssembly binaries for the project and produces an **optimized** executable artifact.
Producing the optimized executable artifact includes some post-compilation processing.

As part of the optimization process, the WebAssembly runtime binary is compiled and compressed through a series of internal steps before it's included in the genesis state for a chain.
To give you a better understanding of the process, the following diagram summarizes the steps.

![WebAssembly compiled and compressed before included on-chain](/media/images/docs/node-executable.png)

The following sections describe the build process in more detail.

### Build the WebAssembly binary

The `wasm-builder` is a tool that integrates the process of building the WebAssembly binary for your project into the main `cargo` build process.
This tool is published in the `substrate-wasm-builder` crate.

When you start the build process, `cargo` builds a dependency graph from all of the `Cargo.toml` in the project.
The runtime `build.rs` module then uses the `substrate-wasm-builder` crate to compile the Rust code for the runtime into a WebAssembly binary, creating the initial binary artifact.

#### Features included in WebAssembly

By default, the `wasm-builder` enables all of the features defined for the project in both the WebAssembly binary and platform-native executable except for the `default` and `std` features that are only enabled for the native build.

#### Environment variables to customize the build process

You can use the following environment variables to customize how the WebAssembly binaries are built:

| Use this variable       | If you want to do this                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SKIP_WASM_BUILD`       | Skip building the WebAssembly binary. This is useful when you only need to recompile the native binary. However, if the WebAssembly binary doesn't exist, no binaries are compiled. You can skip WebAssembly builds for individual projects by including the PROJECT_NAME in the environment variable. For example, to skip build the WebAssembly binary for the cargo project node-runtime, you can use the environment variable SKIP_NODE_RUNTIME_WASM_BUILD. |
| `WASM_BUILD_TYPE`       | Specify whether the WebAssembly binary is a `release` build or a `debug` build. By default, the build type you specify for the `cargo` command is used.                                                                                                                                                                                                                                                                                                         |
| `FORCE_WASM_BUILD`      | Force a WebAssembly build. This environment variable is rarely required because the `wasm-builder` instructs `cargo` to check for file changes.                                                                                                                                                                                                                                                                                                                 |
| `WASM_BUILD_RUSTFLAGS`  | Extend the `RUSTFLAGS` passed to the `cargo build` command while building the WebAssembly binary.                                                                                                                                                                                                                                                                                                                                                               |
| `WASM_BUILD_NO_COLOR`   | Disable color output of the WebAssembly build.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `WASM_TARGET_DIRECTORY` | Copy the WebAssembly binary to the specified directory. The path needs to be absolute.                                                                                                                                                                                                                                                                                                                                                                          |
| `WASM_BUILD_TOOLCHAIN`  | Specify the toolchain to use to build the WebAssembly binaries. The format needs to be the same as used by `cargo`, for example, `nightly-2020-02-20`.                                                                                                                                                                                                                                                                                                          |
| `CARGO_NET_OFFLINE`     | Prevent network access for some or all processes launched to support offline environments.                                                                                                                                                                                                                                                                                                                                                                      |

#### Compact and compress the WebAssembly binary

The `substrate-wasm-builder` crate uses lower-level processes to optimize instruction sequences and remove any unnecessary code—such as the code used for debugging—to create a compact WebAssembly binary.
The binary is then further compressed to minimize the size of the final WebAssembly binary.
When the compiler processes the `runtime/src/lib.rs` file for the node, it sees the requirement to include the generated WebAssembly binary:

```rust
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));
```

This code includes the compact WebAssembly binary (`WASM_BINARY`) and the uncompressed WebAssembly binary generated by the compiler (`WASM_BINARY_BLOATY`) in its compilation result, and the final executable binary for the project is generated.

At each stage of the build process, the WebAssembly binary is compressed to a smaller and smaller size.
For example, you can compare the sizes of each WebAssembly binary artifact for Polkadot:

```bash
.rw-r--r-- 1.2M pep  1 Dec 16:13 │  ├── polkadot_runtime.compact.compressed.wasm
.rw-r--r-- 5.1M pep  1 Dec 16:13 │  ├── polkadot_runtime.compact.wasm
.rwxr-xr-x 5.5M pep  1 Dec 16:13 │  └── polkadot_runtime.wasm
```

You should always use the fully compressed runtime (`*_runtime.compact.compressed.wasm`) WebAssembly binaries for on-chain upgrades and relay chain validation.
In most cases, there's no need to use the initial WebAssembly binary or interim compact artifacts.

## Execution strategies

After you have compiled the node with the native and WebAssembly runtime, you use command-line options to specify how the node should operate.
For details about the command-line options you can use to start the node, see the [node-template](/reference/command-line-tools/node-template) command-line reference.

When you start the node, the node executable uses the command-line options you specify to initialize the chain and generate the genesis block.
As part of this process, the node adds the WebAssembly runtime as a storage item value and a corresponding `:code` key.

After you start the node, the running node selects the runtime to use.
By default, the node always uses the WebAssembly runtime for all operations, including:

- Synchronization
- Authoring new block
- Importing blocks
- Interacting with offchain workers

### Selection of the WebAssembly runtime

Using the WebAssembly runtime is important because the WebAssembly and native runtimes can diverge.
For example, if you make changes to the runtime, you must generate a new WebAssembly blob and update the chain to use the new version of the WebAssembly runtime.
After the update, the WebAssembly runtime differs from the native runtime.
To account for this difference, all of the execution strategies treat the WebAssembly representation of the runtime as the canonical runtime.
If the native runtime and the WebAssembly runtime versions are different, the WebAssembly runtime is always selected.

Because the WebAssembly runtime is stored as part of the blockchain state, the network must come to consensus about the representation of this binary.
To reach consensus about the binary, the blob that represents the WebAssembly runtime must be exactly the same across all synchronizing nodes.

### WebAssembly execution environment

The WebAssembly execution environment can be more restrictive than the Rust execution environment.
For example, the WebAssembly execution environment is a 32-bit architecture with a maximum 4GB of memory.
Logic that can be executed in the WebAssembly runtime can always be executed in the Rust execution environment.
However, not all logic that can be executed in the Rust runtime can be executed in the WebAssembly runtime.
Block authoring nodes typically use the WebAssembly execution environment to help ensure that they produce valid blocks.

### Native runtime

Although the WebAssembly runtime is selected by default, it is possible for you to override the runtime selected for all or specific operations by specifying an **execution strategy** as a command-line option.

If the native runtime and the WebAssembly runtime share the same [version](/maintain/runtime-upgrades/#runtime-versioning), you can selectively use the native runtime instead of the WebAssembly runtime, in addition to the WebAssembly runtime, or as a fallback if using the WebAssembly runtime fails.
In general, you would only choose to use the native runtime for performance reasons or because it's a less restrictive environment than the WebAssembly runtime.
For example, you might want to use the native runtime for initial synchronization.
To use the native runtime for synchronizing blocks, you can start the node using the `--execution-syncing native` or `--execution-syncing native-else-wasm` command-line option.

For information about using the command-line options to specify an execution strategy for all or specific operations, see [node-template](/reference/command-line-tools/node-template).
For information about the execution strategy variant, see [ExecutionStrategy](https://paritytech.github.io/substrate/master/sp_state_machine/enum.ExecutionStrategy.html)

## Building WebAssembly without a native runtime

A WebAssembly runtime is required to start a new chain.
After an initial WebAssembly runtime is provided, the blob that represents the WebAssembly runtime can be passed to other nodes as part of a [chain specification](/build/chain-spec).
In some rare cases, you might want to compile the WebAssembly target without the native runtime.
For example, if you're testing a WebAssembly runtime to prepare for a forkless upgrade, you might want to compile just the new WebAssembly binary.

Although it's a rare use case, you can use the [build-only-wasm.sh](https://github.com/paritytech/substrate/blob/master/.maintain/build-only-wasm.sh) script to build the `no_std` WebAssembly binary without compiling the native runtime.

You can also use the `wasm-runtime-overrides` command-line option to load the WebAssembly from the file system.

## Compiling Rust without WebAssembly

If you want to compile the Rust code for a node without building a new WebAssembly runtime, you can use the `SKIP_WASM_BUILD` as a build option.
This option is primarily used for faster compile time when you don't need to update the WebAssembly.

## Where to go next

- [Wasm-builder README](https://github.com/paritytech/substrate/blob/master/utils/wasm-builder/README.md)
- [Rust compilation options](https://doc.rust-lang.org/cargo/commands/cargo-build.html#compilation-options)
- [Discussion: Removing the native runtime](https://github.com/paritytech/substrate/issues/10579)
