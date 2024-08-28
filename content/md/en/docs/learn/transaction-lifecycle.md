---
title: Transaction lifecycle
description: Explains how transactions are received, queued, and executed to eventually be included in a block.
keywords:
  - transaction
  - pool
  - order
  - ordering
  - sorting
  - validity
---

In Substrate, transactions contain data to be included in a block.
Because the data in transactions originates outside of the runtime, transactions are sometimes more broadly referred to as extrinsic data or as **extrinsics**.
However, the most common extrinsics are **signed transactions**.
Therefore, this discussion of the transaction lifecycle focuses on how signed transactions are validated and executed.

You've already learned that signed transactions include the signature of the account sending the request to execute some runtime call.
Typically, the request is signed using the private key for the account that is submitting the request.
In most cases, the account submitting the request also pays a transaction fee.
However, transaction fees and other elements of transaction processing depend on how the runtime logic is defined.

## Where transactions are defined

As discussed in [Runtime development](/learn/runtime-development/), the Substrate runtime contains the business logic that defines transaction properties, including:

- What constitutes a valid transaction.
- Whether the transactions are sent as signed or unsigned.
- How transactions change the state of the chain.

Typically, you use pallets to compose the runtime functions and to implement the transactions that you want your chain to support.
After you compile the runtime, users interact with the blockchain to submit requests that are processed as transactions.
For example, a user might submit a request to transfer funds from one account to another.
The request becomes a signed transaction that contains the signature for that user account and if there are sufficient funds in the user's account to pay for the transaction, the transaction executes successfully, and the transfer is made.

## How transactions are processed on a block authoring node

Depending on the configuration of your network, you might have a combination of nodes that are authorized to author blocks and nodes that are not authorized for block authoring.
If a Substrate node is authorized to produce blocks, it can process the signed and unsigned transactions it receives.
The following diagram illustrates the lifecycle of a transaction that's submitted to a network and processed by an authoring node.

![Transaction lifecycle overview](/media/images/docs/transaction-lifecycle.png)

Any signed or unsigned transaction that's sent to a [non-authoring node]() is gossiped to other nodes in the network and enter their transaction pool until it is received by an authoring node.

## Validating and queuing transactions

As discussed in [Consensus](/learn/consensus/), a majority of nodes in the network must agree on the order of transactions in a block to agree on the state of the blockchain and to continue securely adding blocks.
To reach consensus, two-thirds of the nodes must agree on the order of the transactions executed and the resulting state change.
To prepare for consensus, transactions are first validated and queued on the local node in a **transaction pool**.

### Validating transactions in the transaction pool

Using rules that are defined in the runtime, the transaction pool checks the validity of each transaction.
The checks ensure that only valid transactions that meet specific conditions are queued to be included in a block.
For example, the transaction pool might perform the following checks to determine whether a transaction is valid:

- Is the transaction index—also referred to as the transaction nonce—correct?
- Does the account used to sign the transaction have enough funds to pay the associated fees?
- Is the signature used to sign the transaction valid?

After the initial validity check, the transaction pool periodically checks whether existing transactions in the pool are still valid.
If a transaction is found to be invalid or has expired, it is dropped from the pool.

The transaction pool only deals with the validity of the transaction and the ordering of valid transactions placed in a transaction queue.
Specific details on how the validation mechanism works—including handling for fees, accounts, or signatures—can be found in the [`validate_transaction`](https://paritytech.github.io/substrate/master/sp_transaction_pool/runtime_api/trait.TaggedTransactionQueue.html#method.validate_transaction) method.

### Adding valid transactions to a transaction queue

If a transaction is identified as valid, the transaction pool moves the transaction into a transaction queue.
There are two transaction queues for valid transactions:

- The **ready queue** contains transactions that can be included in a new pending block.
  If the runtime is built with FRAME, transactions must follow the exact order that they are placed in the ready queue.
- The **future queue** contains transactions that might become valid in the future.
  For example, if a transaction has a `nonce` that is too high for its account, it can wait in the future queue until the appropriate number of transactions for the account have been included in the chain.

### Invalid transaction handling

If a transaction is invalid—for example, because it is too large or doesn't contain a valid signature—it is rejected and won't be added to a block.
A transaction might be rejected for any of the following reasons:

- The transaction has already been included in a block so it is dropped from the verifying queue.
- The transaction's signature is invalid, so it is immediately rejected.
- The transaction is too large to fit in the current block, so it is put back in a queue for a new verification round.

## Transactions ordered by priority

If a node is the next block author, the node uses a priority system to order the transactions for the next block.
The transactions are ordered from high to low priority until the block reaches the maximum weight or length.

Transaction priority is calculated in the runtime and provided to the outer node as a tag on the transaction.
In a FRAME runtime, a special pallet is used to calculate priority based on the weights and fees associated with the transaction.
This priority calculation applies to all types of transactions with the exception of inherents.
Inherents are always placed first using the [`EnsureInherentsAreFirst`](https://paritytech.github.io/substrate/master/frame_support/traits/trait.EnsureInherentsAreFirst.html) trait.

### Account-based transaction ordering

If your runtime is built with FRAME, every signed transaction contains a nonce that is incremented every time a new transaction is made by a specific account.
For example, the first transaction from a new account has `nonce = 0` and the second transaction for the same account has `nonce = 1`.
The block authoring node can use the nonce when ordering the transactions to include in a block.

For transactions that have dependencies, the ordering takes into account the fees that the transaction pays and any dependency on other transactions it contains.
For example:

- If there is an unsigned transaction with `TransactionPriority::max_value()` and another signed transaction, the unsigned transaction is placed first in the queue.
- If there are two transactions from _different_ senders, the `priority` determines which transaction is more important and should be included in the block first.
- If there are two transactions from the _same_ sender with an identical `nonce`: only one transaction can be included in the block, so only the transaction with the higher fee is included in the queue.

## Executing transactions and producing blocks

After valid transactions are placed in the transaction queue, a separate **executive module** orchestrates how transactions are executed to produce a block.
The executive module calls functions in the runtime modules and executes those functions in specific order.

As a runtime developer, it's important to understand how the executive module interacts with the system pallet and the other pallets that compose the business logic for your blockchain because you can insert logic for the executive module to perform as part of the following operations:

- Initializing a block
- Executing the transactions to be included in a block
- Finalizing block building

### Initialize a block

To initialize a block, the executive module first calls the `on_initialize` function in the system pallet and then in all other runtime pallets. The `on_initialize` function enables you to define business logic that should be completed before transactions are executed.
The system pallet `on_initialize` function is always executed first.
The remaining pallets are called in the order they are defined in the `construct_runtime!` macro.

After all of `on_initialize` functions have been executed, the executive module checks the parent hash in the block header and the trie root to verify that the information is correct.

### Executing transactions

After the block has been initialized, each valid transaction is executed in order of transaction priority.
It is important to remember that the state is not cached prior to execution.
Instead, state changes are written directly to storage during execution.
If a transaction were to fail mid-execution, any state changes that took place before the failure would not be reverted, leaving the block in an unrecoverable state.
Before committing any state changes to storage, the runtime logic should perform all necessary checks to ensure the extrinsic will succeed.

Note that [events](/build/events-and-errors/) are also written to storage.
Therefore, the runtime logic should not emit an event before performing the complementary actions.
If a transaction fails after an event is emitted, the event is not reverted.

### Finalizing a block

After all queued transactions have been executed, the executive module calls into each pallet's `on_idle` and `on_finalize` functions to perform any final business logic that should take place at the end of the block.
The modules are again executed in the order that they are defined in the `construct_runtime!` macro, but in this case, the `on_finalize` function in the system pallet is executed last.

After all of the `on_finalize` functions have been executed, the executive module checks that the digest and storage root in the block header match what was calculated when the block was initialized.

The `on_idle` function also passes through the remaining weight of the block to allow for execution based on the usage of the blockchain.

## Block authoring and block imports

So far, you have seen how transactions are included in a block produced by the local node.
If the local node is authorized to produce blocks, the transaction lifecycle follows a path like this:

1. The local node listens for transactions on the network.
1. Each transaction is verified.
1. Valid transactions are placed in the transaction pool.
1. The transaction pool orders the valid transactions in the appropriate transaction queue and the executive module calls into the runtime to begin the next block.
1. Transactions are executed and state changes are stored in local memory.
1. The constructed block is published to the network.

After the block is published to the network, it is available for other nodes to import.
The block import queue is part of the outer node in every Substrate node.
The block import queue listens for incoming blocks and consensus-related messages and adds them to a pool.
In the pool, incoming information is checked for validity and discarded if it isn't valid.
After verifying that a block or message is valid, the block import queue imports the incoming information into the local node's state and adds it to the database of blocks
that the node knows about.

In most cases, you don't need to know details about how transactions are gossiped or how blocks are imported by other nodes on the network.
However, if you plan to write any custom consensus logic or want to know more about the implementation of the block import queue, you can find details in the Rust API documentation.

- [`ImportQueue`](https://paritytech.github.io/substrate/master/sc_consensus/import_queue/trait.ImportQueue.html)
- [`Link`](https://paritytech.github.io/substrate/master/sc_consensus/import_queue/trait.Link.html)
- [`BasicQueue`](https://paritytech.github.io/substrate/master/sc_consensus/import_queue/struct.BasicQueue.html)
- [`Verifier`](https://paritytech.github.io/substrate/master/sc_consensus/import_queue/trait.Verifier.html)
- [`BlockImport`](https://paritytech.github.io/substrate/master/sc_consensus/block_import/trait.BlockImport.html)

## Where to go next

<!-- TODO NAV.YAML -->
<!-- add these back -->

- [Seminar: Lifecycle of a transaction](https://www.youtube.com/watch?v=3pfM0GOp02c)
- [Accounts, addresses, and keys](/learn/accounts-addresses-keys/)
<!-- * [Transaction formats](/learn/transaction-format/
) -->
