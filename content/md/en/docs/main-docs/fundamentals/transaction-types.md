---
title: Extrinsics
description: 
featured_image:
--- 

_This article teaches you about "extrinsics" in Substrate as well as the different types that exist and examples of how they can be used in a runtime._
_Understanding these naming conventions and the purpose of each type is important for blockchain builders to identify what type to use appropriately._ 
 
Transactions in Substrate can be considered as any piece of data to be included in a block.
They can be one of 3 distinct types, all of which fall under a broader category called  "extrinsics"-i.e. any information that originates from _outside_ a runtime.
These are:

* **Signed transactions**: must contain the signature of an account sending an inbound request to execute some runtime call.
  With a signed transaction, the account used to submit the request typically pays a transaction fee and must sign it using the account's private key.
* **Unsigned transactions**: don't carry any information about who submitted the transaction, since the format of this type of transaction doesn't require a signature.
Developers can define what conditions must be met for these transactions to be validated.
For this reason, this transaction type consumes more resources than a signed transaction because some custom validation mechanisms must be checked to validate the request.
  With an unsigned transaction, there's no economic deterrent to prevent spam or replay attacks, so custom logic is required to protect the network from these types of transactions being misused.
* **Inherents**: are a special type of unsigned transaction made by block authors which carry information required to build a block such as timestamps, storage proofs and uncle blocks.

Here are some examples of each type of extrinsic being used in different scenarios:

| Scenario | Function call example | Type | Reason |
| -------- | ---- | -------------- | ----------- 
| Bob wants to send some tokens to Alice and tip the block author to give this transaction more priority, using the Balances pallet. | `pallet_balances::Call::transfer` in [Polkadot](https://polkadot.subscan.io/extrinsic/8749664-2) | Signed transaction | This function can be called by any account, so we must ensure that the caller signs the transaction and pays a fee for it to be processed.
| Charlie proposes a tip to reward Dave using the Tipping pallet. | `pallet_tips::Call::report_awesome` in [Polkadot](https://polkadot.subscan.io/extrinsic/8818237-2) | Signed transaction | This function is designed so that any account can call it, by depositing some amount and giving a reason for the tip which will be stored on-chain.
| The on-chain council passes some motion that includes submitting a batch of valid transactions to be executed. | `pallet_utility::Call::batch` in [Polkadot](https://polkadot.subscan.io/council/131) | Unsigned transaction | This type of extrinsic can only be submitted if a majority of the council approves it and cannot be executed by any single account.
| A validator node sends a signal to the network to indicate it's online. | `pallet_im_online::Call::heartbeat` in [Kusama](https://kusama.subscan.io/extrinsic/11232100-5) | Unsigned transaction | This can only be called by a node that's registered as a validator in the network, which is verified as part of an internal check of the function's logic and allows the node to call it without paying any fees. 
| The network wants block authoring nodes to include the current timestamp into the blocks they produce. | `pallet_timestamp::Call::now` in [Kusama](https://kusama.subscan.io/extrinsic/11232115-0) | Inherent | This is a special extrinsic that can only be included in a block by an authoring node. 
| A parachain needs to send its relay chain the validation data the relay chain expects. | `paras_inherent::Call::enter` in [Kusama](https://kusama.subscan.io/extrinsic/11232398-1) | Inherent | This is a special type of extrinsic that can only be sent by a collator node. 

The way signed and unsigned transactions are formatted, validated and executed provides an important foundation for understanding the design of different types of extrinsics and their intended behaviors available in Substrate.
Learn about how this works by reading the [Transaction lifecycle]() article.