---
title: Execution strategies
description:
keywords:
---

The default execution strategies for the different parts of the blockchain execution process are:

- Syncing: `NativeElseWasm`
- Block Import (for non-validator): `NativeElseWasm`
- Block Import (for validator): `AlwaysWasm`
- Block Construction: `AlwaysWasm`
- Off-Chain Worker: `NativeWhenPossible`
- Other: `NativeWhenPossible`

Source: [[1]](#footnotes), [[2]](#footnotes)

They can be overridden via the command line argument `--execution-{block-construction, import-block, offchain-worker, other, syncing} <strategy>`, or `--execution <strategy>` to apply the specified strategy to all five aspects. 
Details can be seen at `substrate --help`. 
When specifying on cli, the following shorthand strategy names are used:

- `Native` mapping to the `NativeWhenPossible` strategy
- `Wasm` mapping to the `AlwaysWasm` strategy
- `Both` mapping to the `Both` strategy
- `NativeElseWasm` mapping to `NativeElsmWasm` strategy

## Footnotes

1. Substrate codebase [`client/cli/src/params/import_params.rs`](https://github.com/paritytech/substrate/blob/9b08105b8c/client/cli/src/params/import_params.rs#L115-L124)
2. Substrate codebase [`client/cli/src/arg_enums.rs`](https://github.com/paritytech/substrate/blob/9b08105b8c/client/cli/src/arg_enums.rs#L193-L203)

### References

- Check out the different
  [Execution Strategies](https://paritytech.github.io/substrate/master/sc_client_api/execution_extensions/struct.ExecutionStrategies.html).

- Take a look at the different
  [Execution Strategy Options](https://paritytech.github.io/substrate/master/sp_state_machine/enum.ExecutionStrategy.html)

- Review the
  [Runtime Version definition](https://paritytech.github.io/substrate/master/sp_version/struct.RuntimeVersion.html).
  