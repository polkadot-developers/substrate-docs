---
title: Executor
description:
keywords: []
---

The [executor](/v3/getting-started/glossary#executor) is responsible for dispatching and executing
calls into the Substrate runtime.

## Runtime execution

The Substrate runtime is compiled into a native executable and a WebAssembly (Wasm) binary.

The native runtime is included as part of the node executable, while the Wasm binary is stored on
the blockchain under a well known storage key.

These two representations of the runtime may not be the same. For example, after the runtime is
upgraded. The executor determines which version of the runtime to use when dispatching calls.

### Execution strategy

Before runtime execution begins, the Substrate client proposes which runtime execution environment
should be used. This is controlled by the execution strategy, which can be configured for the
different parts of the blockchain execution process. The strategies are listed in the
[`ExecutionStrategy` enum](/rustdocs/latest/sp_state_machine/enum.ExecutionStrategy.html):

- `NativeWhenPossible`: Execute with native build (if available, WebAssembly otherwise).
- `AlwaysWasm`: Only execute with the WebAssembly build.
- `Both`: Execute with both native (where available) and WebAssembly builds.
- `NativeElseWasm`: Execute with the native build if possible; if it fails, then execute with WebAssembly.

All strategies respect the runtime version, meaning if the native and wasm runtime versions differ
(which the wasm runtime is more updated then the native one), the wasm runtime is chosen to run.

The default execution strategies for the different parts of the blockchain execution process are:

- Syncing: `NativeElseWasm`
- Block Import (for non-validator): `NativeElseWasm`
- Block Import (for validator): `AlwaysWasm`
- Block Construction: `AlwaysWasm`
- Off-Chain Worker: `NativeWhenPossible`
- Other: `NativeWhenPossible`

Source: [[1]](#footnotes), [[2]](#footnotes)

They can be overridden via the command line argument `--execution-{block-construction, import-block, offchain-worker, other, syncing} <strategy>`, or `--execution <strategy>` to apply the specified strategy to all five aspects. Details can be seen at `substrate --help`. When specifying on cli, the following shorthand strategy names are used:

- `Native` mapping to the `NativeWhenPossible` strategy
- `Wasm` mapping to the `AlwaysWasm` strategy
- `Both` mapping to the `Both` strategy
- `NativeElseWasm` mapping to `NativeElsmWasm` strategy

### Wasm execution

The Wasm representation of the Substrate runtime is considered the canonical runtime. Because this
Wasm runtime is placed in the blockchain storage, the network must come to consensus about this
binary. Thus it can be verified to be consistent across all syncing nodes.

The Wasm execution environment can be more restrictive than the native execution environment. For
example, the Wasm runtime always executes in a 32-bit environment with a configurable memory limit
(up to 4 GB).

For these reasons, the blockchain prefers to do block construction with the Wasm runtime. Some logic
executed in Wasm will always work in the native execution environment, but the same cannot be said
the other way around. Wasm execution can help to ensure that block producers create valid blocks.

### Native execution

The native runtime will only be used by the executor when it is chosen as the execution strategy and it is compatible with the requested runtime version (see [runtime versioning](/main-docs/maintain/upgrade#runtime-versioning)).
For all other execution processes other than block construction, the native runtime is preferred since it is more performant. 
In any situation where the native executable should not be run, the canonical Wasm runtime is executed instead.

## Where to go next

- [Upgrade](/main-docs/maintain/upgrade).
- [Execution strategies](/rustdocs/latest/sc_client_api/execution_extensions/struct.ExecutionStrategies.html)
- [Execution strategy primitive](/rustdocs/latest/sp_state_machine/enum.ExecutionStrategy.html)
- [Runtime version primitive](/rustdocs/latest/sp_version/struct.RuntimeVersion.html).

## Footnotes

1. Substrate codebase [`client/cli/src/params/import_params.rs`](https://github.com/paritytech/substrate/blob/9b08105b8c/client/cli/src/params/import_params.rs#L115-L124)
2. Substrate codebase [`client/cli/src/arg_enums.rs`](https://github.com/paritytech/substrate/blob/9b08105b8c/client/cli/src/arg_enums.rs#L193-L203)
