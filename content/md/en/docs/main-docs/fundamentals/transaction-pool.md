_This article provides details explaining how transactions are ordered, verified and then broadcasted to the network before being added to the canonical chain of blocks._
_This is useful for parachain builders seeking to acquire a mental model of the lifecycle of a transaction in Substrate, useful for understanding why transactions are constructed the way they are and how transaction pools work._

A Substrate node can process two types of inbound transactions: either signed (submitted by some external account) or unsigned (submitted by some pallet or priviledged account).
The diagram below shows the lifecycle of a transaction that's submitted to a network and processed by an authoring node.
Any signed or unsigned transaction that's sent to a [non-authoring node]() will just be gossiped to other nodes in the network and enter their transaction pool until it is received by an authoring node.

[ maybe diagram here ? ]

When an authoring node receives a request to include a transaction in the chain, it will check if the transaction is valid and place it in order of transaction priority to include it in the block it broadcasts to the rest of the network.
The other nodes receiving this block will then verify that it's properly constructed and once a majority reach consensus, the block is executed and state transitions are applied in the runtime.


As discussed in [Consensus](), a majority of nodes in the network must agree on the state of the blockchain to continue securely adding blocks.
To reach consensus, two-thirds of the nodes must agree on the order of the transactions executed and the resulting state change. 
To prepare for consensus, transactions are first validated and queued on the local node in a **transaction pool**.
This is where all signed and unsigned transactions that have been received by a local node are placed before they get broadcast to the rest of the network.
Before including a transaction in a block, nodes must first determine which transactions are valid and in what order of priority it should be included.

## Transactions waiting to be verified

A set of rules defined in the runtime helps the transaction pool check whether a transaction is valid or not.
Using these checks, a node's transaction pool verifies that the transactions it receives meets specific conditions to know whether or not to include it in the block.

For example, the transaction pool might perform the following checks to determine whether a transaction meets certain requirements:

* Is the transaction index—also referred to as the transaction nonce—correct?
* Does the account used to sign the transaction have enough funds to pay the associated fees?
* Is the signature used to sign the transaction valid?

After the initial validity check, the transaction pool periodically checks whether existing transactions in the pool are still valid.
If a transaction is found to be invalid or has expired, it is dropped from the pool.

The transaction pool only deals with the validity of the transaction and the ordering of valid transactions placed in a transaction queue.
Specific details on how the validation mechanism works—including handling for fees, accounts, or signatures—can be found in the [`validate_transaction`](/rustdocs/latest/sp_transaction_pool/runtime_api/trait.TaggedTransactionQueue.html#method.validate_transaction) method.

## Adding valid transactions to a transaction queue

If a transaction is identified as valid, the transaction pool moves the transaction into a queue. 
There are two separate transaction queues for valid transactions.

* The **ready queue**: contains transactions that can be included in a new pending block.
  For runtimes built with FRAME, the transactions must follow the exact order in the ready queue.

* The **future queue**: contains transactions that may become valid in the future.
  For example, a transaction may have a `nonce` that is too high for its account, in which case the transaction will wait in the future queue until the valid preceding transactions are included in the chain, after which it will be either dropped or reconsidered.
  
It's possible to design a custom runtime to remove the transaction ordering requirements.
Learn more on how to do this in the [design section]().
### Invalid transactions

In some cases, when a transaction is too large, or doesn't contain a valid signature for example, it get rejected and won't be added to the block.
This could happen for the following reasons:

- The transaction in the queue is stale, as it's already been included in a block so it will be dropped from the verifying queue.
- The transaction's signature is invalid, so it will immediately be rejected.
- The transaction is too large to fit in the current block, so it will be put back in a queue for a new verification round.

## Transactions ordered by priority

If a node is the next block author, it will order transactions from high to low priority for the next block until it reaches the block's weight or length limit.

Transaction priority is calculated in the runtime and provided to the client as a tag on the transaction.
In a FRAME runtime, a special pallet is used to calculate priority based on the weights and fees associated with the transaction.
This priority calculation applies to all types of transactions with the exception of inherents, which are always placed first using the [`EnsureInherentsAreFirst`](https://docs.substrate.io/rustdocs/latest/frame_support/traits/trait.EnsureInherentsAreFirst.html) trait.

For any two or more transactions that have their dependencies satisfied, the ordering is calculated by taking into account the fees that the transaction will pay and what dependency on other transactions it contains.

Some scenarios:

- 1 unsigned transaction with `TransactionPriority::max_value()` and some other signed transaction: the unsigned transaction will be at the top of the queue.
- 2 transactions from _different_ senders (with `nonce=0`): `priority` is needed to determine which transaction is more important and should be included in the block first. 
- 2 transactions from the _same_ sender with an identical `nonce`: only one transaction can be included in the block, so only the transaction with the higher fee will be put in the transaction pool.

## Block is imported and added to the chain

After valid transactions are placed in the transaction queue, a separate **executive module** orchestrates how transactions are executed to produce a block.
The executive module is not a typical pallet that provides specific functionality to the runtime.
Instead, the executive module acts as the orchestration layer that calls functions in the runtime modules and handles the execution of those functions in the proper order as defined in the runtime business logic.

The executive module provides functions to check transaction validity, build, finalize and execute blocks.
As a runtime developer, it's important to understand how the executive module interacts with the system pallet and other pallets you use to compose the business logic for your blockchain.
In particular, you should be familiar with how the executive module performs the following operations:

* Initialize a block
* Execute the inherent and transaction extrinsics in a block
* Finalize a block

For a block to be correctly built, the inherents need to be applied first followed by the rest of the valid extrinsics in the transaction pool.
Here's a test code snippet for a building and executing a valid block using the executive module:

```rust
fn test_build_and_execute_block_success() {
	// Create some inherents.
	let xt1 = TestXt::new(Call::CustomPallet(custom_pallet::Call::inherent_call {}), None);
	// Create some signed transaction.
	let xt2 = TestXt::new(call_transfer(33, 0), sign_extra(1, 0, 0));

	let header = new_test_ext(1).execute_with(|| {
		// Build the block header.
		Executive::initialize_block(&Header::new(
			1,
			H256::default(),
			H256::default(),
			[69u8; 32].into(),
			Digest::default(),
		));

		// Apply all extrinsics.
		Executive::apply_extrinsic(xt1.clone()).unwrap().unwrap();
		Executive::apply_extrinsic(xt2.clone()).unwrap().unwrap();

		// Finalize the block.
		Executive::finalize_block()
	});

	// Execute the block.
	new_test_ext(1).execute_with(|| {
		Executive::execute_block(Block::new(header, vec![xt1, xt2]));
	});
}
```

### Initialize a block

To initialize a block, the executive module calls the `on_initialize` function in the System pallet and all other runtime pallets to execute any business logic defined to take place before transactions are executed. 
The System pallet `on_initialize` function is always executed first.
The remaining pallets are called in the order they are defined in the `construct_runtime!` macro.

After all of the pallet `on_initialize` functions have been executed, the executive module checks the parent hash in the block header and the trie root of all extrinsics to verify that the information is correct.

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
The pallets are again executed in the order that they are defined in the `construct_runtime!` macro, but in this case, the `on_finalize` function in the system pallet is executed last.

After all of the `on_finalize` functions have been executed, the executive modulate checks that the digest and storage root in the block header match what was calculated when the block was initialized.
The `on_idle` function also passes through the remaining weight of the block to allow for execution based on the usage of the blockchain.

## Learn more

- Learn about the origin system for different extrinsic types
- Learn more about how transactions are encoded
- Learn about how block execution works
- Watch the Seminar about the [lifecycle of a transaction](https://www.youtube.com/watch?v=3pfM0GOp02c)