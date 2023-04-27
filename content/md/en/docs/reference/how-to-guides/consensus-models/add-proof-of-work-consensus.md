---
title: Configure a chain to use proof-of-work
description:
keywords:
  - node
  - client
  - consensus
  - proof-of-work
---

The `basic-pow` node demonstrates how to add a custom consensus engine to a Substrate-based blockchain.
In this example, the node uses a minimal proof-of-work consensus engine to reach agreement over the blockchain.
This guide introduces a few core principles for working with consensus engines.

## Use cases

- Launch a chain that uses a proof-of-work consensus engine.
- Upgrade a chain from an authority-based consensus engine to a proof-of-work consensus engine.

## Steps preview

1. Define a full node that uses proof-of-work consensus.
1. Create an import queue for data providers.
1. Define the `proposer` and `worker` functions.
1. Define a light client service.

## Define a full node using sc_consensus_pow and sc_service

In `src/service.rs`, make a function called `new_full` that defines [`PartialComponents`](https://paritytech.github.io/substrate/master/sc_service/struct.PartialComponents.html) and [`PowBlockImport`](https://paritytech.github.io/substrate/master/sc_consensus_pow/struct.PowBlockImport.html):

```rust
let pow_block_import = sc_consensus_pow::PowBlockImport::new(
  client.clone(),
  client.clone(),
  sha3pow::MinimalSha3Algorithm,
  0,                              // check inherents starting at block 0
  select_chain.clone(),
  inherent_data_providers.clone(),
  can_author_with,
);

let import_queue = sc_consensus_pow::import_queue(
  Box::new(pow_block_import.clone()),
  None,
  sha3pow::MinimalSha3Algorithm,  // provide it with references to our client
  inherent_data_providers.clone(),
  &task_manager.spawn_handle(),
  config.prometheus_registry(),
)?;
```

## Create an import queue

Define your node's inherents by using [`InherentDataProviders`](https://paritytech.github.io/substrate/master/sc_consensus_aura/struct.InherentDataProvider.html) in a function that defines the providers of your POW system:

```rust
pub fn build_inherent_data_providers() -> Result<InherentDataProviders, ServiceError> {
  let providers = InherentDataProviders::new();

  providers
    .register_provider(sp_timestamp::InherentDataProvider)
    .map_err(Into::into)
    .map_err(sp_consensus::error::Error::InherentData)?;

    Ok(providers)
}
```

## Define the proposer and worker

In the `new_full` function, define `proposer`:

```rust
let proposer = sc_basic_authorship::ProposerFactory::new(
    task_manager.spawn_handle(),
    client.clone(),
    transaction_pool,
    prometheus_registry.as_ref(),
);

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
```

Let the task manager spawn it:

```rust
task_manager
    .spawn_essential_handle()
    .spawn_blocking("pow", worker_task);
```

## Examples

- [Basic POW example node](https://github.com/substrate-developer-hub/substrate-how-to-guides/tree/main/example-code/consensus-nodes/POW)

## Resources

- [Partial components](https://paritytech.github.io/substrate/master/sc_service/struct.PartialComponents.html)
- [Pow block import](https://paritytech.github.io/substrate/master/sc_consensus_pow/struct.PowBlockImport.html)
- [Create inherent data providers](https://paritytech.github.io/substrate/master/sp_inherents/trait.CreateInherentDataProviders.html)
- [Pow algorithm](https://paritytech.github.io/substrate/master/sc_consensus_pow/trait.PowAlgorithm.html)
