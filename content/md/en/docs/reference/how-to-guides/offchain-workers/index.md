---
title: Offchain workers
description: Quick reference guides that illustrate how to use offchain workers.
keywords:
---

The _How-to_ guides in the _Offchain workers_ category illustrate common use cases for offchain operations.

- [Make offchain HTTP requests](/reference/how-to-guides/offchain-workers/offchain-http-requests/)
- [Offchain local storage](/reference/how-to-guides/offchain-workers/offchain-local-storage/)
- [Offchain indexing](/reference/how-to-guides/offchain-workers/offchain-indexing/)

It is important to note that offchain storage is separate from on-chain storage. 
You can't send data collected or processed by an offchain worker directly to on-chain storage.
To store any data collected or processed by offchain workers—that is, to modify the state of the chain state—you must enable the offchain worker to send transactions that modify the on-chain storage system.
For examples of how to prepare an offchain worker to send transactions, see [Add offchain workers](/tutorials/work-with-pallets/add-offchain-workers/).