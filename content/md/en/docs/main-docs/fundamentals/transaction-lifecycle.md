---
title: Transaction lifecycle
slug: /v3/concepts/tx-pool
version: '3.0'
section: docs
category: concepts
keywords: transaction, pool, order, ordering, sorting, validity
---

In Substrate, any information that originates outside of the blockchain but is an inbound request to be included in a block is referred to as **extrinsic data** or **extrinsics**.
Most of these inbound requests are **transactions** and a transaction can be either a **signed transaction** or an **unsigned transaction**:

* Signed transactions contain the signature of an account sending the inbound request.
  With a signed transaction, the account used to send the request pays a transaction fee as an economic incentive to reduce the risk of users overloading the network with requests.

* Unsigned transactions do not contain an account signature or identify who is sending the inbound request.
  With an unsigned transaction, there's no economic incentive to prevent spam or replay attacks, so custom logic is required to protect the network from misuse.

Although signed and unsigned transactions are the most common types of extrinsic data, there is a third type of extrinsic data—called **inherent data**—to describe information that is inserted into a block by the block author. 
Because inherent data is handled differently than transactions, see [Inherent data]() for more information about how data is added to a block by the block author.

## Where transactions are defined

As discussed in [Runtime development](), the Substrate runtime contains the business logic that defines transaction properties, including:

* What constitutes a valid transaction.
* Whether the transactions are sent as signed or unsigned.
* How transactions change the state of the chain.

Typically, you use pallets to compose the runtime functions and to implement the transactions that you want your chain to support.
After you compile the runtime, users interact with the blockchain to submit requests that are processed as transactions.
For example, a user might submit a request to transfer funds from one account to another.
The request becomes a signed transaction that contains the signature for that user account and if there are sufficient funds in the user's account to pay for the transaction, the transaction executes successfully, and the transfer is made.

## Validating and queuing transactions

As discussed in [Consensus](), a majority of nodes in the network must agree on the order of transactions in a block to agree on the state of the blockchain and to continue securely adding blocks.
To reach consensus, two-thirds of the nodes must agree on the order of the transactions executed and the resulting state change. 
To prepare for consensus, transactions are first validated and queued on the local node in a **transaction pool**.

### Validating transactions in the transaction pool

The transaction pool contains all of the signed and unsigned transactions that are waiting to be broadcast to the peer-to-peer network.

Using the rules that describe valid transactions that are defined in the runtime, the local node transaction pool checks that the transactions received meet specific conditions.
For example, the transaction pool might perform the following checks to determine whether a transaction is valid:

* Is the transaction index—also referred to as the transaction nonce—correct?
* Does the account used to sign the transaction have enough funds to pay the associated fees?
* Is the signature used to sign the transaction valid?

After the initial validity check, the transaction pool periodically checks whether existing transactions in the pool are still valid.
If a transaction is found to be invalid or has expired, it is dropped from the pool.

Note that the transaction pool only deals with the validity of the transaction and the ordering of valid transaction that are placed in a transaction queue.
All other transaction details—including handling for fees, accounts, or signatures—are defined by the runtime using the `validate_transaction` function.
For more detailed information about validating transactions, see the [`validate_transaction`](/rustdocs/latest/sp_transaction_pool/runtime_api/trait.TaggedTransactionQueue.html#method.validate_transaction) function description.

### Adding valid transactions to a transaction queue

If a transaction is identified as valid, the transaction pool moves the transaction into a transaction queue. 
There are two transaction queues for valid transactions

* The **Ready Queue** contains transactions that can be included in a new pending block.
  If the runtime is built with FRAME, transactions must be executed in the exact order that they are placed in the ready queue.
  
  It's possible to design a custom runtime to remove the transaction ordering requirements.
  However, a runtime without strict transaction ordering would allow full nodes to implement different strategies for propagating transactions and including them in blocks.

* The **Future Queue** contains transactions that might become valid in the future.
  For example, if a transaction has a `nonce` that is too high for its account, it can wait in the future queue until the appropriate number of transactions for the account have been included in the chain.

## Transaction dependency and priority

The [`ValidTransaction` struct](/rustdocs/latest/sp_runtime/transaction_validity/struct.ValidTransaction.html) defines the `requires` and `provides` parameters to build a dependency graph of transactions.
Together with `priority`, this dependency graph allows the transaction pool to produce a valid linear ordering of transactions.

### Account-based transaction ordering

If your runtime is built with FRAME, the nodes order transactions with an account-based system.
Every signed transaction contains a nonce that is incremented every time a new transaction is made by a specific account.
For example, the first transaction from a new account has `nonce = 0` and the second transaction for the same account has `nonce = 1`.

At minimum, FRAME transactions have a `provides` tag of `encode(sender ++ nonce)` and a `requires` tag of `encode(sender ++ (nonce -1)) if nonce > 1`.
Transactions do not require anything if `nonce=0`.
As a result, all transactions coming from a single sender form the sequence in which they should be included.

Substrate supports multiple `provides` and `requires` tags, so you can create a custom runtime to support other transaction ordering methods.

### Using priority to order transactions

In addition to transaction ordering based on the signing account nonce, the `ValidTransaction` struct uses the transaction `priority` to determine the ordering of transactions that are in the ready queue.
If a node is the next block author, that node places transactions from high to low priority in the next block until it reaches the weight or length limit of the block.

The transaction `priority` defines the linear ordering of a graph in the case of one transaction unlocking multiple dependent transactions.
For example, if there are two transactions that have their dependencies satisfied, then the node uses `priority` to choose the order for them.

If your runtime is built with FRAME, `priority` is defined as the `fee` that the transaction is going to pay.
For example:

* If the node receives two transactions from _different_ senders (with `nonce=0`), the node uses `priority` to determine which transaction is more important and included in the block first.

* If the node receive two transactions from the _same_ sender with an identical `nonce`, only one transaction can be included on-chain. 
  The node uses the `priority` to choose the transaction with a higher `fee` to store in the transaction pool.

## Executing transactions and producing blocks

After valid transactions are placed in the transaction queue, a separate **executive module** orchestrates how transactions are executed to produce a block.
The executive module is not a typical pallet that provides specific functionality to the runtime.
Instead, the executive module acts as the orchestration layer that calls functions in the runtime modules and handles the execution of those functions in the proper order as defined in the runtime business logic.

The executive module provides functions to:

* Check transaction validity.
* Initialize a block.
* Apply extrinsics.
* Execute a block.
* Finalize a block.
* Start an off-chain worker.

As a runtime developer, it's important to understand how the executive module interacts with the system pallet and other pallets you use to compose the business logic for your blockchain.
In particular, you should be familiar with how the executive module performs the following operations:

* Initialize a block
* Execute the inherent and transaction extrinsics in a block
* Finalize a block

### Initialize a block

To initialize a block, the executive module calls the `on_initialize` function in the System pallet and all other runtime pallets to execute any business logic defined to take
place before transactions are executed. 
The System pallet `on_initialize` function is always executed first.
The remaining pallets are called in the order they are defined in the `construct_runtime!` macro.

After all of the pallet `on_initialize` functions have been executed, the executive module checks the parent hash in the block header and the extrinsics trie root to verify that the information is correct.

### Executing extrinsics

After the block has been initialized, each valid extrinsic is executed in order of transaction priority. 
Extrinsics must not cause a panic in the runtime logic or the system would be vulnerable to attacks where users could trigger computational execution without any punishment.

When an extrinsic executes, the state is not cached prior to execution.
Instead, state changes are written directly to storage during execution. 
If an extrinsic were to fail mid-execution, any state changes that took place before the failure would not be reverted, leaving the block in an unrecoverable state.
Before committing any state changes to storage, the runtime logic should perform all necessary checks to ensure the extrinsic will succeed. 

Note that [events](/v3/runtime/events-and-errors) are also written to storage. 
Therefore, the runtime logic should not emit an event before performing the complementary actions. 
If an extrinsic fails after an event is emitted, the event is not be reverted.

### Finalizing a block

After all queued extrinsics have been executed, the executive module calls into each pallet's `on_idle` and `on_finalize` functions to perform any final business logic that should take place at the end of the block. 
The modules are again executed in the order that they are defined in the `construct_runtime!` macro, but in this case, the `on_finalize` function in the system pallet is executed last.

After all of the `on_finalize` functions have been executed, the executive modulate checks that the digest and storage root in the block header match what was calculated when the block was initialized.

The `on_idle` function also passes through the remaining weight of the block to allow for execution based on the usage of the blockchain.

#---
## Transactions in a block produced locally

If a transaction is included in a block produced by the local node, the transaction lifecycle follows a path like this:

1. The local node listens for transactions on the network.
1. Each transaction is verified.
1. Valid transactions are placed in the transaction pool.
1. The transaction pool orders the valid transactions in the appropriate transaction queue and returns ones that are ready to be included in the block.
   Transactions in the ready queue are used to construct a block and propagated—gossiped—to peers over the network.
1. Transactions are executed and state changes are stored in local memory.
1. The constructed block is published to the network.
1. All other nodes on the network receive and execute the block.

Notice that transactions are not removed from the ready queue when blocks are authored, but removed _only_ on block import.
This is due to the possibility that a recently-authored block might not make it into the canonical chain.

## Transactions in a block received from network

1. The node receives notification of the new block.
1. The new block is executed.
1. The entire block either succeeds or fails.

## Signed extensions

The [`SignedExtension`](/rustdocs/latest/sp_runtime/traits/trait.SignedExtension.html) trait enables you to extend a transaction with additional data or logic.
You can use signed extensions anywhere you want some information about a transaction prior to execution.

For example, the runtime uses signed extension data to calculate transaction fees when a `Call` function is dispatched.
Signed extensions also include an `AdditionalSigned` type that can hold any encoded data.
The `AdditionalSigned` type enables you to perform any custom logic prior to including or dispatching a transaction.
The transaction queue regularly calls functions from `SignedExtension` to validate transactions prior to block construction to avoid including transactions that will fail to be included in blocks.

Despite the name, `SignedExtension` can also be used to verify [unsigned transactions](/v3/concepts/extrinsics#unsigned-transactions).
The `*_unsigned` set of methods can be implemented to encapsulate validation, spam, and replay protection logic that is needed by the transaction pool.

For more information about using signed extensions, see [Signed Extension API](/rustdocs/latest/sp_runtime/traits/trait.SignedExtension.html).

# Next steps

### Learn more

- Learn how you can simulate the orchestration of the Executive module in your
  [runtime tests](/v3/runtime/testing).

## Related resources

- [Extrinsics](/v3/concepts/extrinsics)
- [Weights and fees](/v3/runtime/weights-and-fees)


- [FRAME executive](/rustdocs/latest/frame_executive/index.html)
- [`#[pallet::event]` macro](/rustdocs/latest/frame_support/attr.pallet.html#event-palletevent-optional)
- [`#[pallet::storage]` macro](/rustdocs/latest/frame_support/attr.pallet.html#storage-palletstorage-optional)
- [`construct_runtime!` macro](/rustdocs/latest/frame_support/macro.construct_runtime.html)
- [`OnInitialize` trait](/rustdocs/latest/frame_support/traits/trait.OnInitialize.html)

