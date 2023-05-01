---
title: Create a hybrid node
description: How to create a Substrate-based node that employs hybrid consensus
keywords:
  - consensus
  - proof of work
  - PoW
---

This guide demonstrates how to create a Substrate-based node that employs hybrid consensus, using SHA3 proof of work to dictate block authoring and the [Grandpa](https://paritytech.github.io/substrate/master/sc_finality_grandpa/index.html) finality gadget to provide [deterministic finality](/learn/consensus#finality).
The minimal proof of work consensus lives entirely outside of the runtime.

The Grandpa finality relies on getting its authority sets from the runtime using the [Grandpa API](https://paritytech.github.io/substrate/master/sp_finality_grandpa/trait.GrandpaApi.html).
Therefore, you need a runtime that provides this API to successfully compile a node implementing this guide.

## Use cases

Customize the consensus mechanisms of a Substrate chain.

## Steps preview

1. Configure the block import pipeline.
1. Create an import queue.
1. Spawn the proof-of-work authorship task.
1. Spawn the Grandpa task.

## Configure the block import pipeline

We begin by creating the block import for Grandpa.
In addition to the block import itself, we get back a `grandpa_link`.
This link is a channel over which the block import can communicate with the background task that actually casts Grandpa votes.
The [details of the Grandpa protocol](https://research.web3.foundation/en/latest/polkadot/finality.html) are beyond the scope of this guide.

In `node/src/service.rs`, create the Grandpa block import:

```rust
let (grandpa_block_import, grandpa_link) = sc_finality_grandpa::block_import(
	client.clone(),
	&(client.clone() as std::sync::Arc<_>),
	select_chain.clone(),
)?;
```

With the grandpa block import created, we can now create the PoW block import.
The Pow block import is the outer-most layer of the block import onion and it wraps the grandpa block import.

```rust
let pow_block_import = sc_consensus_pow::PowBlockImport::new(
	grandpa_block_import,
	client.clone(),
	sha3pow::MinimalSha3Algorithm,
	0, // check inherents starting at block 0
	select_chain.clone(),
	inherent_data_providers.clone(),
	can_author_with,
);
```

## Create an import queue

With the block imports set up, we can proceed to create the import queue.
We make it using PoW's [`import_queue` helper function](https://paritytech.github.io/substrate/master/sc_consensus_pow/fn.import_queue.html).
Notice that it requires the entire block import pipeline which we refer to as `pow_block_import` because PoW is the outermost layer.

```rust
let import_queue = sc_consensus_pow::import_queue(
	Box::new(pow_block_import.clone()),
	None,
	sha3pow::MinimalSha3Algorithm,
	inherent_data_providers.clone(),
	&task_manager.spawn_handle(),
	config.prometheus_registry(),
)?;
```

## Spawn the PoW authorship task

Any node that is acting as an authority, typically called "miners" in the PoW context, must run a mining worker that is spawned by the task manager.

```rust
let (_worker, worker_task) = sc_consensus_pow::start_mining_worker(
	Box::new(pow_block_import),
	client,
	select_chain,
	MinimalSha3Algorithm,
	proposer,
	network.clone(),
	None,
	inherent_data_providers,
	// time to wait for a new block before starting to mine a new one
	Duration::from_secs(10),
	// how long to take to actually build the block (i.e. executing extrinsics)
	Duration::from_secs(10),
	can_author_with,
);

task_manager
	.spawn_essential_handle()
	.spawn_blocking("pow", worker_task);
```

## Spawn the Grandpa task

Grandpa is _not_ CPU intensive, so we use a standard `async` worker to listen to and cast Grandpa votes.
We begin by creating a Grandpa [`Config`](https://paritytech.github.io/substrate/master/sc_finality_grandpa/struct.Config.html):

```rust
let grandpa_config = sc_finality_grandpa::Config {
	gossip_duration: Duration::from_millis(333),
	justification_period: 512,
	name: None,
	observer_enabled: false,
	keystore: Some(keystore_container.sync_keystore()),
	is_authority,
};
```

We can then use this config to create an instance of [`GrandpaParams`](https://paritytech.github.io/substrate/master/sc_finality_grandpa/struct.GrandpaParams.html).

```rust
let grandpa_config = sc_finality_grandpa::GrandpaParams {
	config: grandpa_config,
	link: grandpa_link,
	network,
	telemetry_on_connect: telemetry_connection_notifier.map(|x| x.on_connect_stream()),
	voting_rule: sc_finality_grandpa::VotingRulesBuilder::default().build(),
	prometheus_registry,
	shared_voter_state: sc_finality_grandpa::SharedVoterState::empty(),
};
```

With the parameters established, we can now create and spawn the authorship future.

```rust
task_manager.spawn_essential_handle().spawn_blocking(
	"grandpa-voter",
	sc_finality_grandpa::run_grandpa_voter(grandpa_config)?
);
```

## Examples

- [Hybrid consensus](https://github.com/substrate-developer-hub/recipes/blob/master/nodes/hybrid-consensus/src/service.rs)

## Resources

- [POW Algorithm](https://paritytech.github.io/substrate/master/sc_consensus_pow/trait.PowAlgorithm.html) trait
- [`PowBlockimport`](https://paritytech.github.io/substrate/master/sc_consensus_pow/struct.PowBlockImport.html)
- [Inherents](https://paritytech.github.io/substrate/master/sp_inherents/index.html)
