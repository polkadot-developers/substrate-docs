---
title: The Block Import Pipeline
version: '3.0'
section: docs
category: advanced
keywords: []
---

The block import pipeline is an abstract worker queue present in every Substrate node. It is not part of the
runtime. The import pipeline is responsible for processing pieces of incoming information, verifying
them, and if they are valid, importing them into the node's state. The most fundamental piece of
information that the import pipeline processes is blocks themselves, but it is also responsible for
importing consensus-related messages such as justifications and, in light clients, finality proofs.

The import queue collects incoming elements from the network and stores them in a pool. The elements
are later checked for validity and discarded if they are not valid. Elements that are valid are then
imported into the node's local state.

The import queue is codified abstractly in Substrate by means of the
[`ImportQueue` trait](/rustdocs/latest/sc_consensus/import_queue/trait.ImportQueue.html).
The use of a trait allows each consensus engine to provide its own specialized implementation of the
import queue, which may take advantage of optimization opportunities such as verifying multiple
blocks in parallel as they come in across the network.

The import queue also provides some hooks via the
[`Link` trait](/rustdocs/latest/sc_consensus/import_queue/trait.Link.html) that can be used
to follow its progress.

## Basic queue

Substrate provides a default in-memory implementation of the `ImportQueue` known as the
[`BasicQueue`](/rustdocs/latest/sc_consensus/import_queue/struct.BasicQueue.html). The
`BasicQueue` does not do any kind of optimization, rather it performs the verification and import
steps sequentially. It does, however, abstract the notion of verification through the use of the
[`Verifier`](/rustdocs/latest/sc_consensus/import_queue/trait.Verifier.html) trait.

Any consensus engine that relies on the `BasicQueue` must implement the `Verifier` trait. The
`Verifier` is typically responsible for tasks such as checking
[inherent data](/v3/concepts/extrinsics#inherents), and ensuring that
the block is signed by the appropriate authority.

## Block import trait

When the import queue is ready to import a block, it passes the block in question to a method
provided by the
[`BlockImport` trait](/rustdocs/latest/sc_consensus/block_import/trait.BlockImport.html).
This `BlockImport` trait provides the behavior of importing a block into the node's local state
database.

One implementor of the `BlockImport` trait that is used in every Substrate node is the
[`Client`](/rustdocs/latest/sc_service/client/index.html), which contains the node's entire
block database. When a block is imported into the client, it is added to the main database of blocks
that the node knows about.

## Block import pipeline

In the simplest cases, blocks are imported directly into the client. But most consensus engines will
need to perform additional verification on incoming blocks, update their own local auxiliary
databases, or both. To allow consensus engines this opportunity, it is common to wrap the client in
another struct that also implements `BlockImport`. This nesting leads to the term "block import
pipeline".

An example of this wrapping is the
[`PowBlockImport`](/rustdocs/latest/sc_consensus_pow/struct.PowBlockImport.html), which
holds a reference to another type that also implements `BlockImport`. This allows the PoW consensus
engine to do its own import-related bookkeeping and then pass the block to the nested `BlockImport`,
probably the client. This pattern is also demonstrated in
[`AuraBlockImport`](/rustdocs/latest/sc_consensus_aura/struct.ImportQueueParams.html#structfield.block_import),
[`BabeBlockImport`](/rustdocs/latest/sc_consensus_babe/struct.BabeBlockImport.html), and
[`GrandpaBlockImport`](/rustdocs/latest/sc_finality_grandpa/struct.GrandpaBlockImport.html).

`BlockImport` nesting need not be limited to one level. In fact, it is common for nodes that use
both an authoring engine and a finality gadget to layer the nesting even more deeply. For example,
Polkadot's block import pipeline consists of a `BabeBlockImport`, which wraps a
`GrandpaBlockImport`, which wraps the `Client`.

## Learn more

Have a look at these guides that cover the block import pipeline:

- [Basic PoW](/how-to-guides/v3/consensus/pow) - the import pipeline includes
  PoW and the client
- [Hybrid Consensus](/how-to-guides/v3/consensus/hybrid-pos-pow) - the import
  pipeline is PoW, then Grandpa, then the client
