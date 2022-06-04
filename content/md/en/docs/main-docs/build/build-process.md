---
title: Build process
description: Describes how a Substrate node is compiled into Rust and WebAssembly binaries and how the binaries are used to execute calls into the Substrate runtime.
keywords:
---

In [Architecture](/main-docs/fundamentals/architecture), you learned that a Substrate node consists of two main environments—an outer node host environment and a runtime execution environment—and that these environments communicate with each other through runtime API calls and host function calls.
In this section, you'll learn more about how the Substrate runtime is compiled into a standard Rust executable that is included as part of the node executable and into a WebAssembly (Wasm) binary that is stored on the blockchain.
After you see the inner-working of how the binaries are compiled, you'll learn more about why there are two binaries, when they are used, and how you can change the execution strategies, if you need to.

## Rust runtime

The Rust version of the runtime is used as a regular Rust crate dependency to the Substrate node executable.
You can see this by displaying the package dependencies for the `node-template-runtime` package.
For example:

1. Open a terminal on a computer where you have the node template installed.

1. Change to the root of the node template directory.

1. Display an inverted dependency graph by running the following command:

    ```bash
    cargo tree -i node-template-runtime
    ```

    The command displays output similar to the following:

    ```bash
    node-template-runtime devhub/latest
    └── node-template devhub/latest
    ```

## Wasm runtime

You probably already know that you can compile a Substrate node by running the `cargo build --release` command in the root directory for a Substrate node project.
This command builds both the Rust and Wasm binaries for the project in the local directory and produces an **optimized** executable artifact.
Producing the optimized executable artifact includes some post-compilation processing to result in a program that enables you to launch a blockchain that includes both runtime binaries.

As part of the optimization process, the Wasm runtime binary is compiled, compressed, and placed on-chain through a series of internal steps.
To give you a better understanding of the process, the following diagram summarizes the steps.

![WebAssembly compiled and compressed before placed on-chain](/media/images/docs/main-docs/node-executable.png)

The following sections describe the build process in more detail.

### Build the initial Wasm binary

- Cargo builds a dependency graph from all of the Cargo.toml in the project.
- The runtime `build.rs` module uses the `substrate-wasm-builder` crate to compile the runtime Rust code into a Wasm binary, creating the initial binary artifact.

### Compact the initial binary

- The `substrate-wasm-builder` wasm linker invokes [wasm-opt](https://www.npmjs.com/package/wasm-opt).
- The [wasm-opt](https://www.npmjs.com/package/wasm-opt) tools optimizes some instruction sequences and removes any unnecessary sections—such as the ones for debugging—to create a compact wasm binary.
- The runtime crate is added as a dependency of the node.

### Compress and embed the optimized binary

- A [zstd lossless compression](https://en.wikipedia.org/wiki/Zstandard) algorithm is applied to minimize the size of the final Wasm binary.
- The `runtime/src/lib.rs` file for the node requires the Wasm blob from the first step and embeds it into its compilation result.
- The final executable binary is generated for the project.

At each stage of the build process, the Wasm binary is compressed to a smaller and smaller size.
For example, you can compare the sizes of each Wasm binary artifact for Polkadot:

```bash
.rw-r--r-- 1.2M pep  1 Dec 16:13 │  ├── polkadot_runtime.compact.compressed.wasm
.rw-r--r-- 5.1M pep  1 Dec 16:13 │  ├── polkadot_runtime.compact.wasm
.rwxr-xr-x 5.5M pep  1 Dec 16:13 │  └── polkadot_runtime.wasm
```

You should always use the fully compressed runtime (`*_runtime.compact.compressed.wasm`) Wasm binaries for on-chain upgrades and relay chain validation.
The initial Wasm binary and compact artifacts.

## Execution strategies

After you have compiled the node with the Rust and Wasm runtime, you use command-line options to specify how the node should operate.
For details about the command-line options you can use to start the node, see the [node-template](/reference/command-line-tools/node-template) command-line reference.

When you start the node, the node executable uses the command-line options you specify to initialize the chain and generate the genesis block.
As part of this process, the node adds the Wasm runtime as a storage item value and a corresponding `:code` key.

After you start the node, the running node selects the runtime execution environment to use.
The execution environment selected is controlled by a configurable **execution strategy**.
These strategies are defined in the [`ExecutionStrategy`](/rustdocs/latest/sp_state_machine/enum.ExecutionStrategy.html) enum and specify the following execution rules:

- `NativeWhenPossible`: Execute with the Rust runtime if it's available, or WebAssembly if it's not.
- `AlwaysWasm`: Only execute with the WebAssembly runtime.
- `Both`: Execute with both the Rust runtime (where available) and WebAssembly runtime.
- `NativeElseWasm`: Only execute with the WebAssembly runtime if execution with the Rust runtime fails.

### Default execution strategies

By default, different parts of the blockchain execution process use the following execution strategies:

| Operation | Default strategy
| --------- | ----------------
| Syncing | NativeElseWasm
| Block import for non-validator nodes | NativeElseWasm
| Block import for validator nodes | AlwaysWasm
| Block authoring | AlwaysWasm
| Offchain and other operations | NativeWhenPossible

### Selection of the WebAssembly runtime

The execution strategy is important because the two representations of the runtime can be different.
For example, if you make changes to the runtime, you must generate a new WebAssembly blob and update the chain to use the new version of the WebAssembly runtime.
After the update, the WebAssembly runtime differs from the Rust runtime.
To account for this difference, all of the execution strategies treat the WebAssembly representation of the runtime as the canonical runtime.
If the Rust runtime and the WebAssembly runtime versions are different, the WebAssembly runtime is always selected.

Because the WebAssembly runtime is stored as part of the blockchain state, the network must come to consensus about the representation of this binary.
To reach consensus about the binary, the blob that represents the WebAssembly runtime must be exactly the same across all synchronizing nodes.

### WebAssembly execution environment

The WebAssembly execution environment can be more restrictive than the Rust execution environment.
For example, the WebAssembly execution environment is a 32-bit architecture with a maximum 4GB of memory.
Logic that can be executed in the WebAssembly runtime can always be executed in the Rust execution environment.
However, not all logic that can be executed in the Rust runtime can be executed in the WebAssembly runtime.
Block authoring nodes typically use the WebAssembly execution environment to help ensure that they produce valid blocks.

### Rust execution environment

As noted in [Default execution strategies](#default-execution-strategies), the Rust execution environment is used in some parts of the block handling process.
However, this is only true if the Rust execution environment is compatible with the WebAssembly [runtime version](/main-docs/build/upgrade/#runtime-versioning).

For most execution processes—except block authoring—the Rust execution environment is preferred because it provides better performance and has fewer restriction.
However, you can override the default execution strategy for ny part of the block handling process by specifying command-line options.
For example, if you want to use the Rust execution environment for block authoring, you can specify add `--execution-block-construction Native` to the command you use to start a node.

## Building WebAssembly without a Rust runtime

A WebAssembly runtime is required to start a new chain.
After an initial WebAssembly runtime is provided, the blob that represents the WebAssembly runtime can be passed to other nodes as part of a [chain specification](/main-docs/build/chain-spec).
In some rare cases, you might want to compile the WebAssembly target without the Rust runtime.
For example, if you're testing a WebAssembly runtime to prepare for a forkless upgrade, you might want to compile just the new WebAssembly binary.

Although it's a rare use case, you can use the [build-only-wasm.sh](https://github.com/paritytech/substrate/blob/master/.maintain/build-only-wasm.sh) script to build the `no_std` WebAssembly binary without compiling the Rust runtime.

You can also use the `wasm-runtime-overrides` command-line option to load the WebAssembly from the filesystem.

Usually when performing a runtime upgrade, you want to provide both a native and Wasm binary.

## Compiling Rust without a WebAssembly runtime

If you want to compile the Rust code for a node without building the WebAssembly runtime, you can use the `SKIP_WASM_BUILD` as a build option.
If this is the first run and there doesn't exist a Wasm binary, this will set both variables to `None`.

## Where to go next

- [Wasm-builder README](https://github.com/paritytech/substrate/blob/master/utils/wasm-builder/README.md)
- [Rust compilation options](https://doc.rust-lang.org/cargo/commands/cargo-build.html#compilation-options)
- [Discussion: Removing the Rust runtime](https://github.com/paritytech/substrate/issues/10579)