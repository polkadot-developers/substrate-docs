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

## Set a unique protocol identifier

Network collisions can cause major headaches.
_All_ chains should use a **unique** `protocolId` that no other network of any type—whether a test network, relay chain, or parachain—uses.
Having a unique protocol identifier ensures your nodes connect with the correct peer
nodes and not with nodes from other libp2p networks.
You want to isolate them to a distinct peer group with this ID.
Protocol ID collisions will cause _many_ issues for your nodes.

In order to set a unique protocol ID, change make sure you use some nonce or salt value. This is set
(for the [parachain node template](https://github.com/substrate-developer-hub/substrate-parachain-template/))
as a CLI item in `/client/network/src/command.rs`, and passed to extend the `/client/network/src/chain_spec.rs`

All [chain specification](/build/chain-spec/) files include this item as a field.
For example, the primary [relay chain runtime](https://github.com/paritytech/polkadot-sdk/tree/master/polkadot/node/service/chain-specs) chain specs have unique protocol IDs.
For Polkadot:

```json
// raw chain spec file in polkadot repo `/node/service/chain-specs/polkadot.json`
{
  //--snip--
  "protocolId": "dot"
  //--snip--
}
```

Monitor [this issue](https://github.com/paritytech/substrate/issues/7746) for updates about a better way to safely configure this constant in the future.

## Memory profiling

Collator [memory profiling](/reference/command-line-tools/memory-profiler) should be done to analyze memory leaks, identify where memory consumption is happening, define temporary allocations, and investigate excessive memory fragmentation within applications.

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

## Critical parachain constraints

You can check the maximum sizes [in the Polkadot repo](https://github.com/paritytech/polkadot/blob/f0e1ed0bab6d5cb542b84fa0ad464609198dd255/primitives/src/v2/mod.rs#L322-L348) for all relay chains (these are common constants).
Make note of:

- The runtime version of the relay chain you are targeting (these _may_ change)
- `MAX_CODE_SIZE`
- `MAX_HEAD_DATA_SIZE`
- `MAX_POV_SIZE`

You **must** have your parachain fit comfortably within these maxima.
You can also use the the Polkadot-JS Apps UI connected to a relay node to see these
constants: _Developers_ -> _ParachainsConfiguration_ -> _ActiveConfiguration_

## Use proper weights

Use [runtime benchmarking](/test/benchmark) to ensure that your runtime weights are
actually indicative of the resources used by your runtime.

### Custom weights

If you need to diverge from benchmarks, make sure that each pallet in your runtime employs the
correct weighting system. Default and "guessed at" weights **are not** to be used in production, as
a general rule.

### Set block weight limit

It is recommended to have a block weight limit (block production time) of 0.5 seconds in the
beginning due to uncertainties in block execution time. As the execution time of the network
stabilizes the weight limit can be increased to 2 seconds.

## Setup call filters

Especially when launching a parachain, you might need to highly constrict what is enabled for
_specific classes_ of users. This can be accomplished with **call filters**.

Here you can see an example of how to [limit](https://github.com/paritytech/cumulus/blob/59cdbb6a56b1c49009413d66ba2232494563b57c/polkadot-parachains/statemine/src/lib.rs#L148) and [enable](https://github.com/paritytech/cumulus/pull/476/files#diff-09b95657e9aa1b646722afa7944a00ddc2541e8753254a86180b338d3376f93eL151) functionality with filters as implemented in the [Statemine runtime deployment](https://github.com/paritytech/cumulus/pull/476).

## Incremental runtime deployments

If you are approaching limits outline above before launch (like a too-large large runtime) it is
highly advisable to prune down functionality as much as practical and **incrementally upgrade**.
In these cases, you can:

1. Generate the genesis state of your chain with full runtime functionality (including all the pallets)

2. Remove all pallets that you will not need upon parachain launch from your runtime

3. Re-build the WASM blob (validation logic) and the runtime of the chain

4. Register your parachain with the updated genesis and the WASM blob generated in (3)

5. After your parachain is live you can upgrade your runtime on-chain to include the missing pallets
   (ensure that pallet indices and names match those used to generate the genesis state in step (1)
   without having to do storage migrations. For more information on on-chain runtime upgrades refer to
   the next section.

**See the [parachain runtime upgrade guide](/reference/how-to-guides/parachains/upgrade-a-parachain)** for how
to go about actually performing these incremental runtime upgrades.

## Launch simulation

Before you try anything on a production testnet or mainnet, you should launch your chain on a network that simulates the behavior of a real network as closely as possible.
Testing in a confined network will help you prepare for potential failures in a real network with many collators and validators and constraints like bandwidth and latency.
The more closely you can simulate a real network for testing, the more sure you can be that your runtime upgrades will succeeds.

See the [Prepare a local relay chain](/tutorials/build-a-parachain/prepare-a-local-relay-chain/) to for a selection of tools for automation of such testing.

## Examples

- [Statemine runtime deployment](https://github.com/paritytech/cumulus/pull/476)

## Resources

- [Reference documentation for runtime upgrades](/maintain/runtime-upgrades)
- [A how-to guide to use benchmarked weights](/reference/how-to-guides/weights/add-benchmarks)
- [Reference for `try-runtime` documentation](/reference/command-line-tools/try-runtime)
  - [`try-runtime` video workshop](https://www.crowdcast.io/e/substrate-seminar/41)
- [Fork Off Substrate tool](https://github.com/maxsam4/fork-off-substrate)
