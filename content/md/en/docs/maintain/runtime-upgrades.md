---
title: Runtime upgrades
description: Explains how runtime versioning and storage migration support forkless upgrades for Substrate-based networks.
keywords:
---

Forkless runtime upgrades are a defining feature of the Substrate framework for blockchain development.
The ability to update the runtime logic without forking the code base enables your blockchain to evolve and improve over time.
This capability is made possible by including the definition of the runtime execution environment—the runtime WebAssembly blob—as an element in the blockchain's runtime state.

Because the runtime is part of the blockchain state, network maintainers can leverage the blockchain's capabilities for trustless, decentralized consensus to securely make enhancements to the runtime.

In the FRAME system for runtime development, the system library defines [the `set_code` call](https://paritytech.github.io/substrate/master/frame_system/pallet/enum.Call.html#variant.set_code) that is used to update the definition of the runtime.
The tutorial [Upgrade a running network](/tutorials/build-a-blockchain/upgrade-a-running-network/) demonstrates two ways that you can upgrade a runtime without shutting down a node or interrupting operations.
However, both of the upgrades in the tutorial illustrate adding functionality to the runtime as opposed to _updating_ the existing runtime state.
If a runtime upgrade requires changes to the existing state, it is likely to require storage migration.

## Runtime versioning

In [Build process](/main-docs/build/build-process/), you learned that compiling a node generated both a platform-native binary and a WebAssembly binary and that selecting which binary to use at different points in the block production process can be controlled by execution strategy command-line options.
The component that selects the runtime execution environment to communicate with is called the **executor**.
Although you can override the default execution strategies for custom scenarios, in most cases, or the executor select the appropriate binary to use by evaluating the following information for both the native and WebAssembly runtime binaries:

- `spec_name`
- `spec_version`
- `authoring_version`

To provide this information to the executor process, the runtime includes a [runtime version struct](https://paritytech.github.io/substrate/master/sp_version/struct.RuntimeVersion.html) similar to the following:

```rust
pub const VERSION: RuntimeVersion = RuntimeVersion {
  spec_name: create_runtime_str!("node-template"),
  impl_name: create_runtime_str!("node-template"),
  authoring_version: 1,
  spec_version: 1,
  impl_version: 1,
  apis: RUNTIME_API_VERSIONS,
  transaction_version: 1,
};
```

The parameters in the struct provide the following information:

| This parameter | Provides this |
| -------------- | ------------- |
| `spec_name` | The identifier for the different Substrate runtimes. |
| `impl_name` | The name of the implementation of the spec. This is of little consequence for the node and serves only to differentiate code of different implementation teams. |
| `authoring_version` | The version of the authorship interface. An authoring node will not attempt to author blocks unless this is equal to its native runtime. |
| `spec_version` | The version of the runtime specification. A full node will not attempt to use its native runtime in substitute for the on-chain Wasm runtime unless all of `spec_name`, `spec_version`, and `authoring_version` are the same between the Wasm and native binaries. Updates to the `spec_version` can be automated as a CI process, as is done for the [Polkadot network](https://gitlab.parity.io/parity/mirrors/polkadot/-/blob/master/scripts/ci/gitlab/check_extrinsics_ordering.sh). This paramenter is typically incremented when there's an update to the `transaction_version`.                                 |
| `impl_version` | The version of the implementation of the specification. Nodes can ignore this. It is only used to indicate that the code is different. As long as the `authoring_version` and the `spec_version` are the same, the code itself might have changed, but the native and Wasm binaries do the same thing. In general, only non-logic-breaking optimizations would result in a change of the `impl_version`. |
| `transaction_version` | The version of the interface for handling transactions. This parameter can be useful to synchronize firmware updates for hardware wallets or other signing devices to verify that runtime transactions are valid. The parameter allows hardware wallets to know which transactions they can safely sign. This number must be bumped if there is a change in the index of the pallets in the `construct_runtime!` macro or if there are any changes to dispatchable functions, such as the number of parameters or parameter types. If this number is updated, then the `spec_version` must also be updated. |
| `apis` | A list of supported [runtime APIs](https://paritytech.github.io/substrate/master/sp_api/macro.impl_runtime_apis.html) along with their versions. |

The orchestration engine—sometimes referred to as the executor—verifies that the native runtime has the same consensus-driven logic as the WebAssembly before it chooses to execute it.
However, because the runtime versioning is set manually, the orchestration engine can still make inappropriate decisions if the runtime version is misrepresented.

## Accessing the runtime version

The FRAME system exposes the runtime version information through the `state.getRuntimeVersion` RPC endpoint.
The endpoint accepts an optional block identifier.
However, in most cases, you use the runtime [metadata](/main-docs/build/application-development/#exposing-runtime-information-as-metadata) to understand the APIs the runtime exposes
and how to interact with these APIs.
The runtime metadata should _only_ change when the chain's [runtime `spec_version`](https://paritytech.github.io/substrate/master/sp_version/struct.RuntimeVersion.html#structfield.spec_version) changes.

## Forkless runtime upgrades

Traditional blockchains require a [hard fork](<https://en.wikipedia.org/wiki/Fork_(blockchain)>) when upgrading the state transition function of their chain.
A hard fork requires all node operators to stop their nodes and manually upgrade to the latest executable.
For distributed production networks, coordination of hard fork upgrades can be a complex process.

The runtime versioning properties enable Substrate-based blockchains to upgrade the runtime logic in real time without causing a fork in the network.

To perform a forkless runtime upgrade, Substrate uses existing runtime logic to update the Wasm runtime stored on the blockchain to a new consensus-breaking version with new logic. This upgrade gets pushed out to all full nodes on the network as a part of the consensus process.
After the Wasm runtime is upgraded, the orchestration engine sees that the native runtime `spec_name`, `spec_version`, or `authoring_version` no longer matches the new Wasm runtime.
As a result, the orchestration engine executes the canonical Wasm runtime instead of using the native runtime in any of the execution processes.

## Storage migration

Storage migrations are custom, one-time functions that allow you to update storage to adapt to changes in the runtime.
For example, if a runtime upgrade changes the data type used to represent user balances from an _unsigned_ integer to a _signed_ integer, the storage migration would read the existing value as an unsigned integer and write back an updated value that has been converted to a signed integer.
If you don't make these kinds of changes to how data is stored when needed, the runtime can't properly interpret the storage values to include in the runtime state and is likely to lead to undefined behavior.

### Storage migrations with FRAME

FRAME storage migrations are implemented using the [`OnRuntimeUpgrade`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.OnRuntimeUpgrade.html) trait.
The `OnRuntimeUpgrade` trait specifies a single function—`on_runtime_upgrade`—that allows
you to specify logic to run immediately _after_ a runtime upgrade but _before_ any [`on_initialize`](/main-docs/learn/transaction-lifecycle#initialize-a-block) functions or transactions are executed.

### Preparing for storage migration

Preparing for a storage migration means understanding the changes that are defined by a runtime upgrade.
The Substrate repository uses the [`E1-runtimemigration`](https://github.com/paritytech/substrate/pulls?q=is%3Apr+label%3AE1-runtimemigration) label to designate such changes.

### Writing a migration

Every storage migration is different, with different requirements and different levels of complexity.
However, you can use the following recommended practices to guide you when you need to perform storage migration:

- Extract migrations into reusable functions and write tests for them.
- Include logging in migrations to assist in debugging.
- Remember that migrations are executed within the context of the _upgraded_ runtime.
  The migration code might need to include deprecated types, as in [this example](https://github.com/hicommonwealth/substrate/blob/5f3933f5735a75d2d438341ec6842f269b886aaa/frame/indices/src/migration.rs#L5-L22).
- Use storage versions to make migrations safer by making them more declarative, as in [this example](https://github.com/paritytech/substrate/blob/c79b522a11bbc7b3cf2f4a9c0a6627797993cb79/frame/elections-phragmen/src/lib.rs#L119-L157).

### Ordering migrations

By default, FRAME orders the execution of `on_runtime_upgrade` functions based on the order in which the pallets appear in the `construct_runtime!` macro.
For upgrades, the functions run in _reverse_ order, starting with the last pallet executed first.
You can impose a custom order, if needed (see an [example here](https://github.com/hicommonwealth/edgeware-node/blob/7b66f4f0a9ec184fdebcccd41533acc728ebe9dc/node/runtime/src/lib.rs#L845-L866)).

FRAME storage migrations run in this order:

1. Custom `on_runtime_upgrade` functions if using a custom order.
1. System `frame_system::on_runtime_upgrade` functions.
1. All `on_runtime_upgrade` functions defined in the runtime starting with the last pallet in the `construct_runtime!` macro.

### Testing migrations

It is important to test storage migrations.
A few of the tools available for you to test storage migration include the following:

- The [Substrate debug kit](https://github.com/paritytech/substrate-debug-kit) includes a [remote externalities](https://github.com/paritytech/substrate-debug-kit/tree/master/remote-externalities) tool that allows storage migration unit testing to be safely performed on live chain data.
- The [fork-off-substrate](https://github.com/maxsam4/fork-off-substrate) script makes it easy to create a chain specification to bootstrap a local test chain for testing runtime upgrades and storage migrations.

## Where to go next

- [Upgrade a running network](/tutorials/build-a-blockchain/upgrade-a-running-network/)
- [Substrate migrations](https://github.com/apopiak/substrate-migrations)
