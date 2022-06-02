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

### Create the initial runtime Wasm binary

- Cargo builds the entire graph of dependencies in all project TOML files.
- The runtime `build.rs` module uses the `substrate-wasm-builder` crate.
- The `build.rs` module executes to compile the runtime into a Wasm binary, creating the initial `wasm_binary.rs` binary. 

### Post-processing

- The `substrate-wasm-builder` wasm linker invokes [wasm-opt](https://www.npmjs.com/package/wasm-opt) to create a compact wasm binary.
- The [wasm-opt](https://www.npmjs.com/package/wasm-opt) tools optimizes some instruction sequences and removes any unnecessary sections—such as the ones for debugging.
- The runtime crate is a dependency of the node.

### Compression

- A [zstd lossless compression](https://en.wikipedia.org/wiki/Zstandard) algorithm is applied to minimize the size of the final Wasm binary.
- All users should use this Wasm binary. 

### Runtime result

- The runtime crate requires the Wasm blob from the first step and embeds it into its compilation result (notice `include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));` at the top of a node's `runtime/src/lib.rs` file).
- The final executable binary is `node-template`.
- The `./target/release/node-template --dev` command initializes a new chain, i.e. generates a new chainspec.
- The Wasm runtime is put as an item in storage (with the magic key named “:code”).
- The chain spec has the genesis state and includes the Wasm binary, which was fetched from the node-runtime crate.

At each stage, the Wasm binary is compressed to a smaller and smaller size.
See the sizes of each Wasm binary in Polkadot for example:

```bash
.rw-r--r-- 1.2M pep  1 Dec 16:13 │  ├── polkadot_runtime.compact.compressed.wasm
.rw-r--r-- 5.1M pep  1 Dec 16:13 │  ├── polkadot_runtime.compact.wasm
.rwxr-xr-x 5.5M pep  1 Dec 16:13 │  └── polkadot_runtime.wasm
```

It's important to always use the compressed version especially for maintaining a chain in production.
There really is no need for using any other of the Wasm artifacts.

## Execution

Once a runtime is built and a chain is launched, the Substrate client proposes which runtime execution environment should be used.
This is controlled by the execution strategy, which can be configured for the different parts of the blockchain execution process.
The strategies are listed in the [`ExecutionStrategy`](/rustdocs/latest/sp_state_machine/enum.ExecutionStrategy.html) enum:

- `NativeWhenPossible`: Execute with native build (if available, WebAssembly otherwise).
- `AlwaysWasm`: Only execute with the WebAssembly build.
- `Both`: Execute with both native (where available) and WebAssembly builds.
- `NativeElseWasm`: Execute with the native build if possible; if it fails, then execute with WebAssembly.

All strategies respect the runtime version, meaning if the native and Wasm runtime versions differ, the Wasm runtime is chosen.
These are configurable using Substrate's [node template CLI](/reference/command-line-tools/node-template).

The Wasm representation of the Substrate runtime is considered the canonical runtime and will always be preferred by block authoring nodes.
Because this Wasm runtime is placed in the blockchain's storage, the network must come to consensus about this binary which can easily be verified for consistency across all syncing nodes.

The native runtime will only be used by the executor when it is chosen as the execution strategy and it is compatible with the requested [runtime version](/main-docs/build/upgrade/#runtime-versioning).

## Build options

It can make sense to compile the Wasm binary only, if for example you are just trying to provide an upgraded Wasm to perform a forkless upgrade. 
Usually when performing a runtime upgrade, you want to provide both a native and Wasm binary.

When starting a new chain the initial Wasm binary is a requirement. 
In production the Wasm runtime comes from the [chain specification](/main-docs/build/chain-spec) of a chain.
However, when starting a chain in developer mode at block 0, it uses the embedded Wasm from the native runtime.

There are several ways to configure a chain to meet your specific requirements:

- `SKIP_WASM_BUILD` - Skips building any Wasm binary. This is useful when only native should be recompiled.
    If this is the first run and there doesn't exist a Wasm binary, this will set both variables to `None`.

- Use [this script](https://github.com/paritytech/substrate/blob/master/.maintain/build-only-wasm.sh) to build the `no_std` Wasm binary only. 

- Use the `wasm-runtime-overrides` CLI flag to load the Wasm from the filesystem.

## Learn more

- Have a look at the [README for Wasm builder](https://github.com/paritytech/substrate/blob/master/utils/wasm-builder/README.md)
- Rust compilation options from the [Cargo Book](https://doc.rust-lang.org/cargo/commands/cargo-build.html#compilation-options)
- Read the open discussions about [removing the native runtime](https://github.com/paritytech/substrate/issues/10579)