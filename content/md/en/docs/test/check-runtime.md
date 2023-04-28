---
title: Check runtime
description: Describes the try-runtime command-line tool for testing a specified runtime state against a production snapshot of chain state.
keywords:
  - testing
  - snapshot
  - integration testing
  - production
  - runtime upgrades
  - storage migration
---

The `try-runtime` command-line tool enables you to query a snapshot of runtime storage using an [in-memory-externalities](https://paritytech.github.io/substrate/master/sp_state_machine/struct.TestExternalities.html) data structure to store state.
By using the in-memory storage, you can write tests for a specified runtime state so that you can test against real chain state _before_ going to production.

In its simplest form, you can use `try-runtime` to test the runtime state by doing the following:

1. Connect to a remote node.
2. Call a specific runtime API.
3. Retrieve state from the node at a specific block.
4. Write tests for the data retrieved.

## Motivation

The initial motivation for `try-runtime` came from the need to test runtime changes against state from a real chain.
Prior [`TestExternalities`](https://paritytech.github.io/substrate/master/sp_state_machine/struct.TestExternalities.html) and [`BasicExternalities`](https://paritytech.github.io/substrate/master/sp_state_machine/struct.BasicExternalities.html) existed
for writing unit and integrated tests with mock data, but lacked the ability to test against a chain's actual state.
The `try-runtime` tool extends `TestExternalities` and `BasicExternalities` by retrieving state using the following RPC endpoints for the node:

- `rpc_get_storage`
- `rpc_get_keys_paged`

(see [`remote externalities lib`](https://paritytech.github.io/substrate/master/src/frame_remote_externalities/lib.rs.html) for more details;)

After using the key-value database to retrieve state, try-runtime inserts the data into `TestExternalities`.

## How it works

The `try-runtime` tool has its own implementation of externalities called [`remote_externalities`](https://github.com/paritytech/substrate/blob/master/utils/frame/remote-externalities/src/lib.rs) which is just a wrapper around `TestExternalities` that uses a generic [key-value store](/learn/state-transitions-and-storage) where data is [type encoded](/reference/scale-codec).

The diagram below illustrates the way externalities sits outside a compiled runtime as a means to capture the storage of that runtime.

![Storage externalities](/media/images/docs/reference/try-runtime-ext-1.png)

With `remote_externalities`, you can capture some chain state and run tests on it. Essentially, `RemoteExternalities` will populate a `TestExternalities` with a real chain's data.

![Testing with externalities](/media/images/docs/reference/try-runtime-ext-2.png)

To query state, `try-runtime` uses the RPC methods provided by [`StateApiClient`](https://paritytech.github.io/substrate/master/sc_rpc/state/trait.StateApiClient.html).
In particular:

- [`storage`](https://paritytech.github.io/substrate/master/sc_rpc/state/trait.StateApiClient.html#method.storage)
  This method returns the storage value for the key that represents the block you specify.

- [`storage_key_paged`](https://paritytech.github.io/substrate/master/sc_rpc/state/trait.StateApiClient.html#method.storage_keys_paged)
  This method returns the keys that match a prefix you specify with pagination support.

## Usage

The most common use case for `try-runtime` is to help you prepare for storage migration and runtime upgrades.

Because the RPC calls that query storage are computationally expensive, there are a number of command-line options you should set for a running node before you use the `try-runtime` command. To prepare a node for `try-runtime` testing, set the following options:

- Set `--rpc-max-payload 1000` to ensure large RPC queries can work.
- Set `--rpc-cors all` to ensure WebSocket connections can come through.

You can combine `try-runtime` with [`fork-off-substrate`](https://github.com/maxsam4/fork-off-substrate) to test your chain before production.
Use `try-runtime` to test your chain's migration and its pre and post states.
Then, use `fork-off-substrate` if you want to check that block production continues after the migration.

### Runtime upgrade hooks

By default, runtime upgrade hooks—which can be defined inside of the runtime or inside pallets—specify what should happen when there's been a runtime upgrade.
That is, the default `on_runtime_upgrade` method only describes runtime state _after_ the upgrade.
However, it is possible to use methods provided by `try-runtime` to inspect and compare the runtime state _before_ and _after_ a runtime upgrade for testing purposes.

If you enable the `try-runtime` feature for the runtime, you can define `pre-upgrade` and `post-upgrade` hooks for the runtime as follows:

```rust
#[cfg(feature = "try-runtime")]
fn pre_upgrade() -> Result<Vec<u8>, &'static str> {
		Ok(Vec::new())
}

#[cfg(feature = "try-runtime")]
fn post_upgrade(_state: Vec<u8>) -> Result<(), &'static str> {
		Ok(())
}
```

With these function, you can use the `pre_upgrade` hook to retrieve the runtime state and return it as a Vec<u8> result.
You can the pass the Vec<u8> as input parameter to the `post_upgrade` hook.

## Command-line examples

To use `try-runtime` from the command line, run your node with the `--features=try-runtime` flag.
For example:

```bash
cargo run --release --features=try-runtime try-runtime
```

You can use the following subcommands with `try-runtime`:

- `on-runtime-upgrade`: Executes `tryRuntime_on_runtime_upgrade` against the given runtime state.
- `offchain-worker`: Executes `offchainWorkerApi_offchain_worker` against the given runtime state.
- `execute-block`: Executes `core_execute_block` using the given block and the runtime state of the parent block.
- `follow-chain`: Follows a given chain's finalized blocks and applies to all its extrinsics.
  This allows the behavior of a new runtime to be inspected over a long period of time, with real transactions coming as input.

To view usage information for a specific `try-runtime` subcommand, specify the subcommand and the `--help` flag.
For example, to see usage information for `try-runtime on-runtime-upgrade`, you can run the following command:

```bash
cargo run --release --features=try-runtime try-runtime on-runtime-upgrade --help
```

For example, you can run `try-runtime` with the `on-runtime-upgrade` subcommand for a chain running locally with a command like this:

```bash
cargo run --release --features=try-runtime try-runtime on-runtime-upgrade live ws://localhost:9944
```

You can use `try-runtime` to re-execute code from the `ElectionProviderMultiPhase` offchain worker on `localhost:9944` with a command like this:

```bash
cargo run -- --release \
   --features=try-runtime \
   try-runtime \
   --execution Wasm \
   --wasm-execution Compiled \
   offchain-worker \
   --header-at 0x491d09f313c707b5096650d76600f063b09835fd820e2916d3f8b0f5b45bec30 \
   live \
   -b 0x491d09f313c707b5096650d76600f063b09835fd820e2916d3f8b0f5b45bec30 \
   -m ElectionProviderMultiPhase \
   --uri wss://localhost:9944
```

You can run the migrations of the local runtime on the state of SomeChain with a command like this:

```bash
RUST_LOG=runtime=trace,try-runtime::cli=trace,executor=trace \
   cargo run try-runtime \
   --execution Native \
   --chain somechain-dev \
   on-runtime-upgrade \
   live \
   --uri wss://rpc.polkadot.io
```

You can run try-runtime against the state for a specific block number with a command like this:

```bash
RUST_LOG=runtime=trace,try-runtime::cli=trace,executor=trace \
   cargo run try-runtime \
   --execution Native \
   --chain dev \
   --no-spec-name-check \
   on-runtime-upgrade \
   live \
   --uri wss://rpc.polkadot.io \
   --at <block-hash>
```

Notice that this command requires the `--no-spec-name-check` command-line option.

## Where to go next

- [Storage keys](/build/runtime-storage#storage-value-keys)
- [`OnRuntimeUpgrade`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.OnRuntimeUpgrade.html)
- [`try-runtime-upgrade`](https://paritytech.github.io/substrate/master/frame_executive/struct.Executive.html#method.try_runtime_upgrade)
- [Staking pallet](https://paritytech.github.io/substrate/master/pallet_staking/index.html)
