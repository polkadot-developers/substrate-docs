---
title: Build process
description:
keywords:
---

This article describes what happens under the hood when building and executing a Substrate node.

Relevant context:

- Substrate runtimes are compiled to [both native and Wasm](#native-and-wasm-runtimes).
- Runtimes should be compressed Wasm binaries for on-chain upgrades and relay chain validation capabilities to function correctly.
- Read about the anatomy of a full Substrate node [here](/todo) in order to understand how the client interacts with the runtime. 

## Native Rust binary

The native runtime is used as a regular Rust crate dependency to the Substrate client.
You can see this when running `cargo tree -i node-template-runtime` from a standard Substrate node template:

```bash
# Displays all packages that depend on the node-template-runtime package.
node-template-runtime devhub/latest (...)
└── node-template devhub/latest (...)
```

So what happens when `cargo build --release` is executed in the directory of a Substrate node template?

At a very high level, this command builds the project in it's local directory with [optimized artifacts](https://doc.rust-lang.org/cargo/commands/cargo-build.html#compilation-options), meaning that the output executable has gone through some post-processing.
These artifacts then result in the final executable program that enables launching a chain with the following command:
`./target/release/node-template --dev`.

During the build process, the runtime Wasm binary goes through 3 different stages, each containing the various steps involved in the build process.
In the first stage of the build cycle, the initial Wasm runtime is built in and embedded into the client.
Once the program is compiled and executed, the compressed Wasm binary is placed in on-chain storage at the [`:code`](https://docs.substrate.io/rustdocs/latest/sp_storage/well_known_keys/constant.CODE.html) storage key. 
When a chain is launched, its genesis state is initialized by using the embedded Wasm in the chainspec from the native runtime by default.

[ _NOTE / TODO: turn A-D below into diagram_]

**A. Create the initial runtime Wasm binary**

- Cargo builds the entire graph of dependencies in all project TOML files.
- The runtime's build.rs module uses the `substrate-wasm-builder` crate.
- This build.rs module executes and compiles the runtime into a Wasm binary, creating `wasm_binary.rs`, i.e. the intial wasm (largest size). 

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
- The Wasm runtime is put as an item in storage (with the magic key named “:code”)
- Chain spec has the genesis state and includes the Wasm binary, which was fetched from the node-runtime crate.


See the sizes of each Wasm binary in Polkadot:

```bash
.rw-r--r-- 1.2M pep  1 Dec 16:13 │  ├── polkadot_runtime.compact.compressed.wasm
.rw-r--r-- 5.1M pep  1 Dec 16:13 │  ├── polkadot_runtime.compact.wasm
.rwxr-xr-x 5.5M pep  1 Dec 16:13 │  └── polkadot_runtime.wasm
```

It is important to always use the compressed version especially for maintaining a [chain in production](./todo).
There is no need for using any other of the Wasm artifacts.

See the [README for the Wasm builder](https://github.com/paritytech/substrate/blob/master/utils/wasm-builder/README.md).

## Execution 

Once a runtime is built and a chain is launched, the Substrate client proposes which runtime execution environment should be used. 
This is controlled by the execution strategy, which can be configured for the different parts of the blockchain execution process. 
The strategies are listed in the [`ExecutionStrategy` enum](/rustdocs/latest/sp_state_machine/enum.ExecutionStrategy.html):

- `NativeWhenPossible`: Execute with native build (if available, WebAssembly otherwise).
- `AlwaysWasm`: Only execute with the WebAssembly build.
- `Both`: Execute with both native (where available) and WebAssembly builds.
- `NativeElseWasm`: Execute with the native build if possible; if it fails, then execute with WebAssembly.

All strategies respect the runtime version, meaning if the native and Wasm runtime versions differ, the Wasm runtime is chosen.
These are configurable using Substrate's [CLI](./link-to-build-cli).

The Wasm representation of the Substrate runtime is considered the canonical runtime and will always be preferred by block authoring nodes.
Because this Wasm runtime is placed in the blockchain's storage, the network must come to consensus about this binary which can easily be verified for consistency across all syncing nodes.

The native runtime will only be used by the executor when it is chosen as the execution strategy and it is compatible with the requested [runtime version](/main-docs/build/upgrade#runtime-versioning)).

Note: a Wasm runtime always executes in a 32-bit environment with a configurable memory limit (up to 4 GB).

## Build options

It can make sense to compile the Wasm binary only, if for example you are just trying to provide an upgraded Wasm to perform a forkless upgrade. 
Usually when performing a runtime upgrade, you want to provide both a native and Wasm binary.
Doing only one usually is an incomplete release process and not considered [best practice](./todo-link).

In any case, when starting a new chain the initial Wasm binary is a requirement. 
In production the Wasm runtime comes from the [chain specification](./todo-chainspec) of a chain.
However, when starting a chain in developer mode at block 0, it uses the embedded Wasm from the native runtime.

There are several ways to configure a chain to meet the requirements of your needs:

- `SKIP_WASM_BUILD` - Skips building any Wasm binary. This is useful when only native should be recompiled.
    If this is the first run and there doesn't exist a Wasm binary, this will set both variables to `None`.

- Use [this script](https://github.com/paritytech/substrate/blob/master/.maintain/build-only-wasm.sh) to build the `no_std` Wasm binary only. 

- Use the [wasm-runtime-overrides]() CLI flag to load the Wasm from the filesystem.
