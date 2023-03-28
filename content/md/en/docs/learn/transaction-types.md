---
title: Transactions and block basics
description: Describes the transaction types used to create blocks and the basic components of a block.
keywords:
---

In this article, you'll learn about the different types of transactions that you can create and how you can use them in a runtime.
Broadly-speaking, transactions determine the data that makes its way into the blocks in your blockchain.
By learning how different transaction types are used, you'll be better prepared to select the appropriate type for your needs.

## What is a transaction?

In general, transactions provide a mechanism for making changes to state that can be included in a block.
There are three distinct transaction types in Substrate:

- [Signed transactions](#signed-transactions)
- [Unsigned transactions](#unsigned-transactions)
- [Inherent transactions](#inherent-transactions)

In Substrate, all three transaction types are often more broadly referred to as **extrinsics**.
The term extrinsic is generally used to mean any information that originates outside of the runtime.

However, for practical purposes, it is more useful to consider each transaction type independently and identify scenarios where each type would be most applicable.

### Signed transactions

Signed transactions must include the signature of an account sending an inbound request to execute some runtime call.
Typically, the request is signed using the private key for the account that is submitting the request.
In most cases, the account submitting the request also pays a transaction fee. However, transaction fees and other elements of transaction processing depend on how the runtime logic is defined.

Signed transactions are the most common type of transaction.
As an example, assume you have an account with some number of tokens.
If you want to transfer tokens to Alice, you can call the `pallet_balances::Call::transfer` function in the Balances pallet.
Because your account is used to make this call, your account key is used to sign the transaction.
As the requester, you would typically be responsible for paying a fee to have your request processed.
Optionally, you could also tip the block author to give your transaction higher priority.

### Unsigned transactions

Unsigned transactions don't require a signature and don't include any information about who submitted the transaction.

With an unsigned transaction, there's no economic deterrent to prevent spam or replay attacks.
You must define the conditions for validating unsigned transactions and the logic required to protect the network from misuse and attacks.
Because unsigned transactions require custom validation, this transaction type consumes more resources than a signed transaction.

The `pallet_im_online::Call::heartbeat` function uses unsigned transactions to enable validator nodes to send a signal to the network to indicate that the node is online.
This function can only be called by a node that's registered as a validator in the network.
The function includes internal logic to verify that the node is a validator, allowing the node to call the function using an unsigned transaction to avoid paying any fees.

### Inherent transactions

Inherent transactions—sometimes referred to as inherents—are a special type of unsigned transaction.
With this type of transaction, block authoring nodes can add information directly to a block.
Inherent transactions can only be inserted into a block by the block authoring node that calls them.
Typically, this type of transaction is not gossiped to other nodes or stored in the transaction queue.
The data inserted using an inherent transaction is assumed to be valid without requiring specific validation.

For example, if a block authoring node inserts a timestamp into a block, there is no way to prove that a timestamp is accurate.
Instead, validators might accept or reject the block based on whether the timestamp it is within some acceptable range of their own system clocks.

As an example, the `pallet_timestamp::Call::now` function enables a block authoring node to insert a current timestamp in each block the node produces.
Similarly, the `paras_inherent::Call::enter` function enables a parachain collator node to send its relay chain the validation data the relay chain expects.

## What is a block?

In Substrate, a block consists of a header and an array of transactions.
The header contains the following properties:

- Block height
- Parent hash
- Transaction root
- State root
- Digest

All of the transactions are bundled together as a series to be executed as defined in the runtime.
You'll learn more about transaction ordering in [Transaction lifecycle](/learn/transaction-lifecycle/).
The transaction root is a cryptographic digest of this series.
This cryptographic digest serves two purposes:

- It prevents any alterations to the series of transactions after the header has been built and distributed.
- It enables light clients to succinctly verify that any given transaction exists in a block given only knowledge of the header.

## Where to go next

Now that you are familiar with transaction types and the information that constitutes a block, explore the following topics to learn more.

- [Transaction lifecycle](/learn/transaction-lifecycle/)
- [State transitions and storage](/learn/state-transitions-and-storage/)
- [Transactions, weights, and fees](/build/tx-weights-fees/)
- [Transaction format](/reference/transaction-format/)
- [Block reference](https://paritytech.github.io/substrate/master/sp_runtime/traits/trait.Block.html)
