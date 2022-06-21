---
title: Prepare to launch
description:
keywords:
  - collator
  - parachain
  - launch
  - prereq
  - requirements
  - checklist
  - weight
  - migration
---

The aim of this guide is to step you through how to launch a parachain outside of a local testing environment.
You will learn how to make sure `protocolId` is set uniquely and that runtime weights are correct.

The runtime constraints on a parachain are much stricter than a solochain, as you must coordinate with the relay chain to finalize state transitions. When launching a parachain to production, it is critically important to make sure a chain's runtime is properly configured and tested.

## Set a unique `protocolId`

Network collisions can cause major headaches.
_All_ chains should use a **unique** `protocolId` that no other network of any type—whether a test network, relay chain, or parachain—uses.
Having a unique protocol identifier ensures your nodes connect with the correct peer
nodes and not with nodes from other libp2p networks.
You want to isolate them to a distinct peer group with this ID.
Protocol ID collisions will cause _many_ issues for your nodes.

> Protocol ID should not be confused with `ParaID`, described in the [Connect to a relay chain](/reference/how-to-guides/parachains/connect-to-a-relay-chain) guide).

In order to set a unique protocol ID, change make sure you use some nonce or salt value.
These are set for the [parachain node template](https://github.com/substrate-developer-hub/substrate-parachain-template/) for each network you define in `/node/src/chain_spec.rs`, for example:

```rust
pub fn local_testnet_config() -> ChainSpec {
  // --snip--
		// Protocol ID
		Some("template-local"),
  // --snip--
```

All [chain specification](/main-docs/build/chain-spec/) files include this item as a field.
For example, the primary [relay chain runtime](https://github.com/paritytech/polkadot/tree/master/node/service/chain-specs) chain specs have unique protocol IDs.
For Polkadot:

```json
// raw chain spec file in polkadot repo `/node/service/res/polkadot.json`
{
  //--snip--
  "protocolId": "dot"
  //--snip--
}
```

Subscribe to [this issue](https://github.com/paritytech/substrate/issues/7746) that will address a better method to automatically and safely configure this constant in the future.

## Memory profiling

[Profiling your collator](/reference/command-line-tools/memory-profiler) should be done to analyze memory leaks,
identify where memory consumption is happening, define temporary allocations, and investigate
excessive memory fragmentation within applications.

## Minimize your runtime size

When launching a parachain, it is critical to use the **compressed version of the runtime** to lower
the amount of resource consumption as much as possible for the relay chain.

- It is recommended to launch a parachain with limited functionality and gradually increase it with
  runtime upgrades. The reason behind that is that during a runtime upgrade both the previous runtime
  and the new runtime are included in the PoVBlock and therefore if the changes are large enough the
  block might be rejected by the Relay Chain due to PoVBlock size limits.

- If the runtime is included in the state proof, ensure the PoV block (i.e. the set of extrinsics,
  including the new runtime, the PoV state proof, potentially the old runtime) fits within the
  PoVBlock size limit. If the runtime is not included in the state proof, the size limit of the new
  runtime will be much higher.

## Gather critical parachain constraint information

You can check the present maximum sizes [in the Polkadot `primitives`](https://github.com/paritytech/polkadot/blob/master/primitives/) for the release of every  relay chain (these are common constants).
Make note of:

- The runtime version of the relay chain you are targeting (these _will_ change over time)
- `MAX_CODE_SIZE`
- `MAX_HEAD_DATA_SIZE`
- `MAX_POV_SIZE`

You **must** have your parachain fit comfortably within these maxima.
You can also use the the Polkadot-JS Apps UI connected to a relay node to see these
constants: _Developers_ -> _ParachainsConfiguration_ -> _ActiveConfiguration_.

Polkadot is an ever improving protocol, so do watch for changes over time, as your parachain can grow with the relay chain's capabilities.

## Use proper weights

Use [runtime benchmarking](/main-docs/test/benchmark) to ensure that your runtime weights are actually indicative of the resources used by your runtime.
Failure to set appropriate weights on your network will at least lead to end user pain with allocating resources to extrinsics as typically fees are coupled to weights. At worst, incorrect weights can lead to extrinsics _brick your chain_!

### Custom weights

If you need to diverge from benchmarks, make sure that each pallet in your runtime employs the correct weighting system.
Default and "guessed at" weights **are not** to be used in production, as a general rule.

### Set block weight limit

It is recommended to have a block weight limit (block production time) of 0.5 seconds in the beginning due to uncertainties in block execution time.
As the execution time of the network stabilizes the weight limit can be increased to 2 seconds.

## Setup call filters

Especially when launching a parachain, you likely need to *highly* constrict what is calls are enabled for specific classes of users.
This can be accomplished with **call filters**.

### `BaseCallFilter` for native `Origin`s

Here you can see an example of how [`BaseCallFilter`](https://paritytech.github.io/substrate/master/frame_system/pallet/trait.Config.html#associatedtype.BaseCallFilter) is implemented to [limit](https://github.com/paritytech/cumulus/blob/59cdbb6a56b1c49009413d66ba2232494563b57c/polkadot-parachains/statemine/src/lib.rs#L148) and [enable](https://github.com/paritytech/cumulus/pull/476/files#diff-09b95657e9aa1b646722afa7944a00ddc2541e8753254a86180b338d3376f93eL151) functionality with filters as implemented in the [Statemine runtime deployment](https://github.com/paritytech/cumulus/pull/476).
Note `Filter` has since been deprecated in favor of [`Contains`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.Contains.html)

### `Barrier` for XCM `Origin`s



## Incremental runtime deployments

If you are approaching the limits of the [critical constraints outline above](#gather-critical-parachain-constraint-information) before launch (like a too-large large runtime) it is highly advisable to cut down functionality as much as practical and **incrementally upgrade** a minimal runtime.
In these cases, you can:

1. Ensuring that your runtime's feature-complete set of pallet indices and names in `construct_runtime!` are final, as you must not change these before this process is complete

1. Export the genesis state of your chain with the `export-genesis-state` subcommand of your feature-complete runtime functionality (including all the pallets)

1. Remove all pallets that you will not need upon parachain launch from your runtime

1. Re-build the runtime Wasm blob (validation logic) of your chain and generate the **compact & compressed** Wasm with the `export-genesis-wasm` subcommand of your node

1. Register your parachain with the full genesis and the **compact & compressed** Wasm blob generated with the `export-genesis-wasm` subcommand of your node, using the minimal runtime in (3)

1. After your parachain is live you can upgrade your runtime to include the missing pallets, with the  [parachain runtime upgrade guide](/reference/how-to-guides/parachains/runtime-upgrade). 
   **Ensure that pallet indices and names match those used to generate the genesis state in step (1) so you do not have to do storage migrations as these are added.**

## Launch simulation

Before you try anything on a production testnet or mainnet, you should launch your chain on a network that simulates the behavior of a real network as closely as possible.
Testing in a confined network will help you prepare for potential failures in a real network with many collators and validators and constraints like bandwidth and latency.
The more closely you can simulate a real network for testing, the more sure you can be that your runtime upgrades will succeeds.

See the [Cumulus tutorial](/tutorials/connect-other-chains/relay-chain/) to learn how to use the `polkadot-launch` tool for such testing.

## Examples

- [Statemine runtime deployment](https://github.com/paritytech/cumulus/pull/476)

## Resources

- [Reference documentation for runtime upgrades](/main-docs/build/upgrade)
- [A how-to guide to use benchmarked weights](/reference/how-to-guides/weights/add-benchmarks)
- [Reference for `try-runtime` documentation](/reference/command-line-tools/try-runtime)
  - [`try-runtime` video workshop](https://www.crowdcast.io/e/substrate-seminar/41)
- [Fork Off Substrate tool](https://github.com/maxsam4/fork-off-substrate)
