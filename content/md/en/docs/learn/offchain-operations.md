---
title: Offchain operations
description: Highlights how you can integrate data from offchain sources into the on-chain state.
keywords:
---

<div class="warning">
	<p>
	<strong>⚠️ WARNING:</strong> This page contains potentially outdated information. Reading it might still be useful, yet we suggest taking it with a grain of salt.
	</p>
	<p>
	 Please refer to the <a href="https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/reference_docs/frame_offchain_workers/index.html">`polkadot-sdk-docs` crate</a> for the most up-to-date documentation on this topic.
	</p>
</div>

There are many use cases where you might want to query data from an offchain source or process data without using on-chain resources before updating the on-chain state.
The conventional way of incorporating offchain data involves connecting to [oracles](/reference/glossary#oracle) to supply the data from some traditional source.
Although using oracles is one approach to working with offchain data sources, there are limitations to the security, scalability, and infrastructure efficiency that oracles can provide.

To make the offchain data integration more secure and efficient, Substrate supports offchain operations through the following features:

- **Offchain workers** are a subsystem of components that enable the execution of long-running and possibly non-deterministic tasks, such as:

  - website service requests
  - encryption, decryption, and signing of data
  - random number generation
  - CPU-intensive computations
  - enumeration or aggregation of on-chain data

  Offchain workers enable you to move tasks that might require more time to execute than allowed out of the block processing pipeline.
  Any task that might take longer than the maximum block execution time allowed is a reasonable candidate for offchain processing.

- **Offchain storage** is storage that is local to a Substrate node and can be accessed by both offchain workers and on-chain logic:

  - Offchain workers have both read and write access to offchain storage.
  - On-chain logic has write access through offchain indexing but doesn't have read access.
    The offchain storage allows different worker threads to communicate with each other and to store user-specific or node-specific data that does not require consensus over the whole network.

- **Offchain indexing** is an optional service that allows the runtime to write directly to the offchain storage independently from offchain workers.
  The offchain index provides temporary storage for on-chain logic and complements the on-chain state.

## Off-chain workers

Offchain workers run in their own Wasm execution environment outside of the Substrate runtime.
This separation of concerns makes sure that block production is not impacted by long-running offchain tasks.
However, because offchain workers are declared in the same code as the runtime, they can easily access on-chain state for their computations.

![Offchain workers](/media/images/docs/off-chain-workers-v2.png)

Offchain workers have access to extended APIs for communicating with the external world:

- Ability to [submit transactions](https://paritytech.github.io/substrate/master/sp_runtime/offchain/trait.TransactionPool.html)—either signed or unsigned—to the chain to publish computation results.
- A fully-featured HTTP client allowing the worker to access and fetch data from external services.
- Access to the local keystore to sign and verify statements or transactions.
- An additional, local [key-value database](https://paritytech.github.io/substrate/master/sp_runtime/offchain/trait.OffchainStorage.html) shared between all offchain workers.
- A secure, local entropy source for random number generation.
- Access to the node's precise [local time](https://paritytech.github.io/substrate/master/sp_runtime/offchain/struct.Timestamp.html).
- The ability to sleep and resume work.

Note that the results from offchain workers are not subject to regular transaction verification.
Therefore, you should ensure the offchain operation includes a verification method to determine what information gets into the chain.
For example, you might verify offchain transactions by implementing a mechanism for voting, averaging, or checking sender signatures.

You should also note that offchain workers don't have any specific privileges or permissions by default and, therefore, represent a potential attack vector that a malicious user could exploit.
In most cases, checking whether a transaction was submitted by an offchain worker before writing to storage isn't sufficient to protect the network.
Instead of assuming that the offchain worker can be trusted without safeguards, you should intentionally set restrictive permissions that limit access to the process and what it can do.

Offchain workers are spawned during each block import.
However, they aren't executed during initial blockchain synchronization.

## Offchain storage

Offchain storage is always local to a Substrate node and is not shared on-chain with any other blockchain nodes or subject to consensus.
You can access the data stored in the offchain storage using offchain worker threads that have read and write access or through the on-chain logic using offchain indexing.

Because an offchain worker thread is spawned during each block import, there can be multiple offchain worker threads running at any given time.
As with any multi-threaded programming environment, there are utilities to [mutex lock](<https://en.wikipedia.org/wiki/Lock_(computer_science)>) the offchain storage when offchain worker threads access it to ensure data consistency.

Offchain storage serves as a bridge for offchain worker threads to communicate to each other and for communication between offchain and on-chain logic.
It can also be read using remote procedure calls (RPC) so it fits the use case of storing indefinitely growing data without over-consuming the on-chain storage.

## Offchain indexing

In the context of a blockchain, storage is most often concerned with the on-chain state.
However, on-chain state is expensive because it must be agreed upon and populated to multiple nodes in the network.
Therefore, you shouldn't store historical or user-generated data—which grow indefinitely over time—using on-chain storage.

To address the need to access historical or user-generated data, Substrate provides access to the offchain storage using offchain indexing.
Offchain indexing allows the runtime to write directly to the offchain storage without using offchain worker threads.
You can enable this functionality to persist data by starting a Substrate node with the `--enable-offchain-indexing` command-line option.

Unlike offchain workers, offchain indexing populates the offchain storage every time a block is processed.
By populating the data at every block, offchain indexing ensures that the data is always consistent and is exactly the same for every node running with indexing enabled.

## Where to go next

Now that you are familiar with how offchain workers, offchain storage, and offchain indexing enable you to work with data not stored on-chain, you might want to explore the following examples of offchain workers and how to use them in runtime development:

- [Example: Offchain worker](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/examples/offchain-worker)
- [Example: Submit transactions](https://github.com/JoshOrndorff/recipes/blob/master/text/off-chain-workers/transactions.md)
- [Example: Use HTTP requests to fetch data](https://github.com/JoshOrndorff/recipes/blob/master/text/off-chain-workers/http-json.md)
- [Example: Offchain storage](https://github.com/JoshOrndorff/recipes/blob/master/text/off-chain-workers/storage.md)
- [Example: Offchain indexing](https://github.com/JoshOrndorff/recipes/blob/master/text/off-chain-workers/indexing.md)
