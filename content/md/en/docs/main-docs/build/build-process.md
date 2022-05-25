---
title: Build process
description: This article describes what happens under the hood when building and executing a Substrate node.
keywords:
---

This article describes what happens under the hood when building and executing a Substrate node.

Relevant context:

- Runtimes should always be compressed Wasm binaries for on-chain upgrades and relay chain validation capabilities to function correctly.
- Read about Substrate's [Architecture](../fundamentals/architecture.md) in order to understand how the client interacts with the runtime.

## Compilation

Substrate runtimes are compiled to both native and Wasm.
The native runtime is used as a regular Rust crate dependency to the Substrate client.
You can see this when running `cargo tree -i node-template-runtime` from the terminal of a standard Substrate node template:

```bash
# Displays all packages that depend on the node-template-runtime package.
node-template-runtime devhub/latest (...)
└── node-template devhub/latest (...)
```

But how is the Wasm runtime created?
What really happens when `cargo build --release` is executed in the directory of a Substrate node project?

At a very high level, this command builds the project in it's local directory &mdash; including both native and Wasm binaries &mdash; with optimized artifacts, meaning that the output executable goes through some post-processing.
These artifacts then result in the final executable program that enables launching a chain with the following command:
`./target/release/node-template --dev`.

During the build process, the Wasm runtime binary goes through 3 different stages, each containing the various steps.
In the first stage of the build cycle, the initial Wasm runtime is built and embedded into the client.
Once the node is compiled, the compressed Wasm binary is placed on-chain at the [`:code`](https://docs.substrate.io/rustdocs/latest/sp_storage/well_known_keys/constant.CODE.html) storage key and executed by the client.

The following steps describes the entire build process:

**A. Create the initial runtime Wasm binary**

- Cargo builds the entire graph of dependencies in all project TOML files.
- The runtime's `build.rs` module uses the `substrate-wasm-builder` crate.
- This `build.rs` module executes and compiles the runtime into a Wasm binary, creating `wasm_binary.rs`, i.e. the initial wasm (largest size). 

**B. Post-processing**

- Then the `substrate-wasm-builder` wasm linker invokes the optimizations to create a Compact wasm binary.
- It optimizes some instruction sequences and removes any unnecessary sections, such as the ones for debugging, using a tool called [wasm-opt](https://www.npmjs.com/package/wasm-opt).
- The runtime crate is a dependency of the node.

**C. Compression**

- A [zstd lossless compression](https://en.wikipedia.org/wiki/Zstandard) algorithm is applied to minimize the size of the final Wasm binary. 
- All users should use this Wasm binary. 

**D. Result**

- The runtime crate requires the Wasm blob from the first step and [embeds it](https://github.com/paritytech/substrate/blob/0e6cc5668d9ee8d852a3aa3f85a2ab5fcb4c75a1/bin/node-template/runtime/src/lib.rs#L7) into its compilation result.
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
The strategies are listed in the [`ExecutionStrategy` enum](/rustdocs/latest/sp_state_machine/enum.ExecutionStrategy.html):

- `NativeWhenPossible`: Execute with native build (if available, WebAssembly otherwise).
- `AlwaysWasm`: Only execute with the WebAssembly build.
- `Both`: Execute with both native (where available) and WebAssembly builds.
- `NativeElseWasm`: Execute with the native build if possible; if it fails, then execute with WebAssembly.

All strategies respect the runtime version, meaning if the native and Wasm runtime versions differ, the Wasm runtime is chosen.
These are configurable using Substrate's [node template CLI](/content/md/en/docs/reference/command-line-tools/node-template.md).

The Wasm representation of the Substrate runtime is considered the canonical runtime and will always be preferred by block authoring nodes.
Because this Wasm runtime is placed in the blockchain's storage, the network must come to consensus about this binary which can easily be verified for consistency across all syncing nodes.

The native runtime will only be used by the executor when it is chosen as the execution strategy and it is compatible with the requested [runtime version](/main-docs/build/upgrade#runtime-versioning).

## Build options

It can make sense to compile the Wasm binary only, if for example you are just trying to provide an upgraded Wasm to perform a forkless upgrade. 
Usually when performing a runtime upgrade, you want to provide both a native and Wasm binary.

When starting a new chain the initial Wasm binary is a requirement. 
In production the Wasm runtime comes from the [chain specification](/content/md/en/docs/main-docs/build/chain-spec.md)) of a chain.
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