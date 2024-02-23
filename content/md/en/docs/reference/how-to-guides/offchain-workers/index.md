---
title: Offchain workers
description: Quick reference guides that illustrate how to use offchain workers.
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

The _How-to_ guides in the _Offchain workers_ category illustrate common use cases for offchain operations.

- [Make offchain HTTP requests](/reference/how-to-guides/offchain-workers/offchain-http-requests/)
- [Offchain local storage](/reference/how-to-guides/offchain-workers/offchain-local-storage/)
- [Offchain indexing](/reference/how-to-guides/offchain-workers/offchain-indexing/)

It is important to note that offchain storage is separate from on-chain storage.
You can't send data collected or processed by an offchain worker directly to on-chain storage.
To store any data collected or processed by an offchain worker—that is, to modify the state of the chain—you must enable the offchain worker to send transactions that modify the on-chain storage system.
For examples of how to prepare an offchain worker to send transactions, see [Add offchain workers](/tutorials/build-application-logic/add-offchain-workers/).
