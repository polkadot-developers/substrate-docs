---
title: Transactions, weights, and fees
description: Describes how the resources required to execute transactions are accounted for through the Substrate weight system and the calculation of transaction fees.
keywords:
---

When transactions are executed or data is stored on-chain, the activity changes the state of the chain and consumes blockchain resources.
Because the resources available to a blockchain are limited, it’s important to manage how operations on-chain consume them.
In addition to being limited in practical terms—such as storage capacity—blockchain resources represent a potential attack vector for malicious users.
For example, a malicious user might attempt to overload the network with messages to stop the network from producing new blocks.
To protect blockchain resources from being drained or overloaded, you need to manage how they are made available and how they are consumed.
The resources to be aware of include:

- Memory usage
- Storage input and output
- Computation
- Transaction and block size
- State database size

Substrate provides block authors with several ways to manage access to resources and to prevent individual components of the chain from consuming too much of any single resource.
Two of the most important mechanisms available to block authors are **weights** and **transaction fees**.

[Weights](/reference/glossary/#weight) are used to manage the time it takes to validate a block.
In general, weights are used to characterize the time it takes to execute the calls in the body of a block.
By controlling the execution time that a block can consume, weights set limits on storage input and output and computation.

Some of the weight allowed for a block is consumed as part of the block's initialization and finalization.
The weight might also be used to execute mandatory inherent extrinsic calls.
To help ensure blocks don’t consume too much execution time—and prevent malicious users from overloading the system with unnecessary calls—weights are used in combination with **transaction fees**.

Transaction fees provide an economic incentive to limit execution time, computation, and the number of calls required to perform operations.
Transaction fees are also used to make the blockchain economically sustainable because they are typically applied to transactions initiated by users and deducted before a transaction request is executed.

## How fees are calculated

The final fee for a transaction is calculated using the following parameters:

- _base fee_: This is the minimum amount a user pays for a transaction. It is declared as a **base weight** in the runtime and converted to a fee using `WeightToFee`.

- _weight fee_: A fee proportional to the execution time (input and output and computation) that a transaction consumes.

- _length fee_: A fee proportional to the encoded length of the transaction.

- _tip_: An optional tip to increase the priority of the transaction, giving it a higher chance to be included by the transaction queue.

The base fee and proportional weight and length fees constitute the **inclusion fee**.
The inclusion fee is the minimum fee that must be available for a transaction to be included in a block.

## Using the transaction payment pallet

The [Transaction Payment pallet](https://paritytech.github.io/substrate/master/pallet_transaction_payment/index.html) provides the basic logic for calculating the inclusion fee.

You can also use the Transaction Payment pallet to:

- Convert a weight value into a deductible fee based on a currency type using `Config::WeightToFee`.

- Update the fee for the next block by defining a multiplier, based on the final state of the chain at the end of the previous block using `Config::FeeMultiplierUpdate`.

- Manage the withdrawal, refund, and deposit of transaction fees using `Config::OnChargeTransaction`.

You can learn more about these configuration traits in the [Transaction Payment](https://paritytech.github.io/substrate/master/pallet_transaction_payment/index.html) documentation.

You should note that transaction fees are withdrawn before the transaction is executed.
After the transaction is executed, the transaction weight can be adjusted to reflect the actual resources the transaction used.
If a transaction uses fewer resources than expected, the transaction fee is corrected and the adjusted transaction fee is deposited.

### A closer look at the inclusion fee

The formula for calculating the final fee looks like this:

```
inclusion_fee = base_fee + length_fee + [targeted_fee_adjustment * weight_fee];
final_fee = inclusion_fee + tip;
```

In this formula, the `targeted_fee_adjustment` is a multiplier that can tune the final fee based on the congestion of the network.

- The `base_fee` derived from the base weight covers inclusion overhead like signature verification.

- The `length_fee` is a per-byte fee that is multiplied by the length of the encoded extrinsic.

- The `weight_fee` fee is calculated using two parameters:

  The `ExtrinsicBaseWeight` that is declared in the runtime and applies to all extrinsics.

  The `#[pallet::weight]` annotation that accounts for an extrinsic's complexity.

To convert the weight to Currency, the runtime must define a `WeightToFee` struct that implements a conversion function, `Convert<Weight,Balance>`.

Note that the extrinsic sender is charged the inclusion
fee before the extrinsic is invoked. The fee is deducted from the sender's balance even if the transaction fails upon execution.

### Accounts with an insufficient balance

If an account does not have a sufficient balance to pay the inclusion fee and remain alive—that is, enough to pay the inclusion fee and maintain the minimum **existential deposit**—then you should ensure the transaction is cancelled so that no fee is deducted and the transaction does not begin execution.

Substrate does not enforce this rollback behavior.
However, this scenario would be a rare occurrence because the transaction queue and block-making logic perform checks to prevent it before adding an extrinsic to a block.

### Fee multiplier

The inclusion fee formula always results in the same fee for the same input.
However, weight can be dynamic and—based on how [`WeightToFee`](https://paritytech.github.io/substrate/master/pallet_transaction_payment/pallet/trait.Config.html#associatedtype.WeightToFee) is defined—the final fee can include some degree of variability.

To account for this variability, the Transaction Payment pallet provides the [`FeeMultiplierUpdate`](https://paritytech.github.io/substrate/master/pallet_transaction_payment/pallet/trait.Config.html#associatedtype.FeeMultiplierUpdate) configurable parameter.

The default update function is inspired by the Polkadot network and implements a targeted adjustment in which a target saturation level of block weight is defined.
If the previous block is more saturated, then the fees are slightly increased.
Similarly, if the previous block has fewer transactions than the target, fees are decreased by a small amount.
For more information about fee multiplier adjustments, see the [Web3 research page](https://research.web3.foundation/Polkadot/overview/token-economics#relay-chain-transaction-fees-and-per-block-transaction-limits).

## Transactions with special requirements

Inclusion fees must be computable prior to execution, and therefore can only represent fixed logic.
Some transactions warrant limiting resources with other strategies.
For example:

- Bonds are a type of fee that might be returned or slashed after some on-chain event.

  For example, you might want to require users to place a bond to participate in a vote. The bond might then be returned at the end of the referendum or slashed if the voter attempted malicious behavior.

- Deposits are fees that might be returned later.

  For example, you might require users to pay a deposit to execute an operation that uses storage. If a subsequent operation frees up storage, the user's deposit could be returned.

* Burn operations are used to pay for a transaction based on its internal logic.

  For example, a transaction might burn funds from the sender if the transaction creates new storage items to pay for the increased the state size.

- Limits enable you to enforce constant or configurable limits on certain operations.

  For example, the default Staking pallet only allows nominators to nominate 16 validators to limit the complexity of the validator election process.

It is important to note that if you query the chain for a transaction fee, it only returns the inclusion fee.

## Default weight annotations

All dispatchable functions in Substrate must specify a weight. The way of doing that is using the
annotation-based system that lets you combine fixed values for database read/write weight and/or
fixed values based on benchmarks. The most basic example would look like this:

```rust
#[pallet::weight(100_000)]
fn my_dispatchable() {
    // ...
}
```

Note that the `ExtrinsicBaseWeight` is automatically added to the declared weight to account for the costs of simply including an empty extrinsic into a block.

### Weights and database read/write operations

To make weight annotations independent of the deployed database backend, they are defined
as a constant and then used in the annotations when expressing database accesses performed by the dispatchable:

```rust
#[pallet::weight(T::DbWeight::get().reads_writes(1, 2) + 20_000)]
fn my_dispatchable() {
    // ...
}
```

This dispatchable does one database read and two database writes in addition to other things that add the additional 20,000.
A database access is generally every time a value that is declared inside the `#[pallet::storage]` block is accessed.
However, only unique accesses are counted because after a value is accessed it is cached and accessing it again does not result in a database operation.
That is:

- Multiple reads of the same value count as one read.
- Multiple writes of the same value count as one write.
- Multiple reads of the same value, followed by a write to that value, count as one read and one write.
- A write followed by a read only counts as one write.

### Dispatch classes

Dispatches are broken into three classes:

- `Normal`
- `Operational`
- `Mandatory`

If a dispatch is not defined as `Operational` or `Mandatory` in the weight annotation, the dispatch is identified as `Normal` by default.
You can specify that the dispatchable uses another class like this:

```rust
#[pallet::dispatch((DispatchClass::Operational))]fn my_dispatchable() {
    // ...
}
```

This tuple notation also allows you to specify a final argument that determines whether or not the user is charged based on the annotated weight.
If you don't specify otherwise, `Pays::Yes` is assumed:

```rust
#[pallet::dispatch(DispatchClass::Normal, Pays::No)]
fn my_dispatchable() {
    // ...
}
```

#### Normal dispatches

Dispatches in this class represent normal user-triggered transactions.
These types of dispatches only consume a portion of a block's total weight limit.
For information about the maximum portion of a block that can be consumed for normal dispatches, see [`AvailableBlockRatio`](https://paritytech.github.io/substrate/master/frame_system/limits/struct.BlockLength.html#method.max_with_normal_ratio).
Normal dispatches are sent to the [transaction pool](/reference/glossary/#transaction-pool).

#### Operational dispatches

Unlike normal dispatches, which represent _usage_ of network capabilities, operational dispatches are those that _provide_ network capabilities.
Operational dispatches can consume the entire weight limit of a block.
They are not bound by the [`AvailableBlockRatio`](https://paritytech.github.io/substrate/master/frame_system/limits/struct.BlockLength.html#method.max_with_normal_ratio).
Dispatches in this class are given maximum priority and are exempt from paying the `length_fee`.

#### Mandatory dispatches

Mandatory dispatches are included in a block even if they cause the block to surpass its weight limit.
You can only use the mandatory dispatch class for [inherent transactions](/reference/glossary/#inherent-transactions) that are submitted by the block author.
This dispatch class is intended to represent functions that are part of the block validation process.
Because these dispatches are always included in a block regardless of the function weight, it is critical that the validation process prevents malicious nodes from abusing the function to craft blocks that are valid but impossibly heavy.
You can typically accomplish this by ensuring that:

- The operation performed is always light.
- The operation can only be included in a block once.

To make it more difficult for malicious nodes to abuse mandatory dispatches, they cannot be included in blocks that return errors.
This dispatch class exists to serve the assumption that it is better to allow an overweight block to be created than to not allow any block to be created at all.

### Dynamic weights

In addition to purely fixed weights and constants, the weight calculation can consider the input arguments of a dispatchable.
The weight should be trivially computable from the input arguments with some basic arithmetic:

```rust
use frame_support:: {
    dispatch:: {
        DispatchClass::Normal,
        Pays::Yes,
    },
   weights::Weight,

#[pallet::weight(FunctionOf(
  |args: (&Vec<User>,)| args.0.len().saturating_mul(10_000),
  )
]

fn handle_users(origin, calls: Vec<User>) {
    // Do something per user
}
```

## Post dispatch weight correction

Depending on the execution logic, a dispatchable function might consume less weight than was prescribed pre-dispatch.
To correct weight, the function declares a different return type and returns its actual weight:

```rust
#[pallet::weight(10_000 + 500_000_000)]
fn expensive_or_cheap(input: u64) -> DispatchResultWithPostInfo {
    let was_heavy = do_calculation(input);

    if (was_heavy) {
        // None means "no correction" from the weight annotation.
        Ok(None.into())
    } else {
        // Return the actual weight consumed.
        Ok(Some(10_000).into())
    }
}
```

## Custom fees

You can also define custom fee systems through custom weight functions or inclusion fee functions.

### Custom weights

Instead of using the default weight annotations, you can create a custom weight calculation type using the [weights](https://paritytech.github.io/substrate/master/frame_support/weights/index.html) module.
The custom weight calculation type must implement the following traits:

- `WeighData<T>` to determine the weight of the dispatch.
- `ClassifyDispatch<T>` to determine the class of the dispatch.
- `Pays<T>` to determine whether the sender of the dispatch pays fees.

Substrate then bundles the output information of the three traits into the `DispatchInfo` struct and provides it by implementing the `GetDispatchInfo` for all `Call` variants and opaque extrinsic types.
This is used internally by the System and Executive modules.

`ClassifyDispatch`, `WeighData`, and `PaysFee` are generic over `T`, which gets resolved into the tuple of all dispatch arguments except for the origin.
The following example illustrates a `struct` that calculates the weight as `m * len(args)` where `m` is a given multiplier and `args` is the concatenated tuple of all dispatch arguments.
In this example, the dispatch class is `Operational` if the transaction has more than 100 bytes of length in arguments and will pay fees if the encoded length is greater than 10 bytes.

```rust
struct LenWeight(u32);
impl<T> WeighData<T> for LenWeight {
    fn weigh_data(&self, target: T) -> Weight {
        let multiplier = self.0;
        let encoded_len = target.encode().len() as u32;
        multiplier * encoded_len
    }
}

impl<T> ClassifyDispatch<T> for LenWeight {
    fn classify_dispatch(&self, target: T) -> DispatchClass {
        let encoded_len = target.encode().len() as u32;
        if encoded_len > 100 {
            DispatchClass::Operational
        } else {
            DispatchClass::Normal
        }
    }
}

impl<T> PaysFee<T> {
    fn pays_fee(&self, target: T) -> Pays {
        let encoded_len = target.encode().len() as u32;
        if encoded_len > 10 {
            Pays::Yes
        } else {
            Pays::No
        }
    }
}
```

A weight calculator function can also be coerced to the final type of the argument, instead of defining it as a vague type that can be encoded.
The code would roughly look like this:

```rust
struct CustomWeight;
impl WeighData<(&u32, &u64)> for CustomWeight {
    fn weigh_data(&self, target: (&u32, &u64)) -> Weight {
        ...
    }
}

// given a dispatch:
#[pallet::call]
impl<T: Config<I>, I: 'static> Pallet<T, I> {
    #[pallet::weight(CustomWeight)]
    fn foo(a: u32, b: u64) { ... }
}
```

In this example, the `CustomWeight` can only be used in conjunction with a dispatch with a particular signature `(u32, u64)`, as opposed to `LenWeight`, which can be used with anything because there aren't any assumptions about `<T>`.

### Custom inclusion fee

The following example illustrates how to customize your inclusion fee.
You must configure the appropriate associated types in the respective module.

```rust
// Assume this is the balance type
type Balance = u64;

// Assume we want all the weights to have a `100 + 2 * w` conversion to fees
struct CustomWeightToFee;
impl WeightToFee<Weight, Balance> for CustomWeightToFee {
    fn convert(w: Weight) -> Balance {
        let a = Balance::from(100);
        let b = Balance::from(2);
        let w = Balance::from(w);
        a + b * w
    }
}

parameter_types! {
    pub const ExtrinsicBaseWeight: Weight = 10_000_000;
}

impl frame_system::Config for Runtime {
    type ExtrinsicBaseWeight = ExtrinsicBaseWeight;
}

parameter_types! {
    pub const TransactionByteFee: Balance = 10;
}

impl transaction_payment::Config {
    type TransactionByteFee = TransactionByteFee;
    type WeightToFee = CustomWeightToFee;
    type FeeMultiplierUpdate = TargetedFeeAdjustment<TargetBlockFullness>;
}

struct TargetedFeeAdjustment<T>(sp_std::marker::PhantomData<T>);
impl<T: Get<Perquintill>> WeightToFee<Fixed128, Fixed128> for TargetedFeeAdjustment<T> {
    fn convert(multiplier: Fixed128) -> Fixed128 {
        // Don't change anything. Put any fee update info here.
        multiplier
    }
}
```

## Where to go next

You now know what the weight system is, how it affects transaction fee computation, and how to specify weights for your dispatchable calls.
The next step is determining the correct weight to account for the operations your dispatchable performs.
You can use Substrate **benchmarking functions** and `frame-benchmarking` calls to test your functions with different parameters and empirically determine the correct weight in their worst case scenarios.

- [Benchmark](/test/benchmark/)
- [SignedExtension](https://paritytech.github.io/substrate/master/sp_runtime/traits/trait.SignedExtension.html)
- [Custom weights for the Example pallet](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/examples/basic/src/weights.rs)
- [Web3 Foundation Research](https://research.web3.foundation/Polkadot/overview/token-economics#relay-chain-transaction-fees-and-per-block-transaction-limits)

<!-- - [Calculate weight](/reference/how-to-guides/weights/) -->
