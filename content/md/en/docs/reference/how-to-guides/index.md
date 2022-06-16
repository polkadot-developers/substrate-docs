---
title: How-to quick reference guides
description:
keywords:
---

Substrate _How-to_ quick reference guides provide instructions for achieving specific goals.
Each guide explains how to perform a specific task with the assumption that you are already familiar with Substrate and programming in Rust.

## Basics
  
See the following guides to learn common patterns in runtime development.

- [Import a pallet](/reference/how-to-guides/basics/import-a-pallet/)
- [Configure runtime constants](/reference/how-to-guides/basics/configure-runtime-constants/)
- [Configure genesis](/reference/how-to-guides/basics/configure-genesis-state)
- [Customize a chain specification](/reference/how-to-guides/basics/customize-a-chain-specification)
- [Use helper functions](/reference/how-to-guides/basics/use-helper-functions)
- [Mint primitive tokens](/reference/how-to-guides/basics/mint-basic-tokens/)

<!--- [Calculate weight](/reference/how-to-guides/basics/calc-weights/)-->

## Pallet design
  
See the following guides for best practices on building pallets using FRAME.

- [Integrate the contracts pallet](/reference/how-to-guides/pallet-design/add-contracts-pallet/)
- [Implement lockable currency](/reference/how-to-guides/pallet-design/lock-currency/)
- [Implement randomness](/reference/how-to-guides/pallet-design/randomness/)
- [Configure crowdfunding](/reference/how-to-guides/pallet-design/crowdfund/)
- [Create a storage structure (struct)](/reference/how-to-guides/pallet-design/storage-value/)
- [Use tight pallet coupling](/reference/how-to-guides/pallet-design/tight-coupling/)
- [Use loose pallet coupling](/reference/how-to-guides/pallet-design/loose-coupling/)

## Weights

See the following guides for help with benchmarking and weight configurations.

- [Calculate fees](/reference/how-to-guides/weights/calculate-fees/)
- [Add benchmarks](/reference/how-to-guides/weights/add-benchmarks/)
- [Use custom weights in benchmarks](/reference/how-to-guides/weights/custom-weights/)
- [Create conditional weights](/reference/how-to-guides/weights/conditional-weights/)

## Testing

See the following guides for help with testing pallets and runtime logic.

- [Set up basic tests](/reference/how-to-guides/testing/basic-tests/)
- [Test a transfer function](reference/how-to-guides/testing/test-transfer/)

## Consensus

See the following guides to implement consensus mechanisms in your runtimes.

- [Create a hybrid node](/reference/how-to-guides/consensus/hybrid-node/)
- [Configure a chain to use proof-of-work](/reference/how-to-guides/consensus/proof-of-work/)

## Parachains

See the following guides for help working with Substrate parachains.

- [Convert a solo chain](/reference/how-to-guides/parachains/solo-to-parachain/)
- [Connect to a relay chain](/reference/how-to-guides/parachains/connect-relay/)
- [Select collators](/reference/how-to-guides/parachains/collator-selection/)
- [Prepare for launch](/reference/how-to-guides/parachains/prelaunch/)
- [Runtime upgrades](/reference/how-to-guides/parachains/runtime-upgrade/)
- [Auctions and crowdloans](/reference/how-to-guides/parachains/auctions-loans/)
- [Open HRMP channels between parachains](/reference/how-to-guides/parachains/add-hrmp-channel/)

## Tools

See the following guides for add-on tools that help you manage Substrate chains in production.

- [Integrate try-runtime](/reference/how-to-guides/tools/try-runtime/)
- [Create a txwrapper for a chain](/reference/how-to-guides/tools/txwrapper/)
- [Use REST endpoints to get chain data](/reference/how-to-guides/tools/sidecar/)
- [Verify a runtime Wasm binary](/reference/how-to-guides/tools/subwasm/)

## Offchain workers

See the following guides for help working with offchain data.

- [Making transactions](/reference/how-to-guides/ocw/ocw-transactions/)
- [Making HTTP requests](/reference/how-to-guides/ocw/ocw-http-requests/)
- [Local storage](/reference/how-to-guides/ocw/ocw-local-storage/)
- [Offchain indexing](/reference/how-to-guides/ocw/ocw-indexing/)
