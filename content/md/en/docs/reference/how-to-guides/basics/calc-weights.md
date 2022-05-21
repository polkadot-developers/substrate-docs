---
title: Calculate transaction weights
description:
keywords:
  - basics
  - weights
  - runtime
  - FRAME v1
---

As discussed in [Transactions, weights, and fees](/main-docs/build/tx-weights-fees/), calculating weight plays an important part in protecting a Substrate network from misuse. Weight also plays a key role in runtime development because it provides a means for evaluating the relative cost of executing the functions that can go into a block.

Not only do they help add security checks around the functions we create, but they also force us to think about the computational resources consumed by a transaction.
From that, we can figure out what fees to charge users.
This guide demonstrates how to do the following:

- Calculate the maximum weight for a dispatch call.
- Calculate the actual weight after execution.
- Reimburse the difference.

Here's an overview of the traits we'll be implementing:

- [`PaysFee`](/rustdocs/latest/frame_support/weights/trait.PaysFee.html): to specify whether or not a dispatch pays the fee.
- [`GetDispatchInfo`](/rustdocs/latest/frame_support/weights/trait.GetDispatchInfo.html): carries weight information using the \`#[weight]\` attribute.
- [`DispatchResultWithPostInfo`](/rustdocs/latest/frame_support/dispatch/type.DispatchResultWithPostInfo.html): provides new weight info once the extrinsic function has been executed.

This guide shows a basic procedure for configuring weights.
There are more advanced methods that suit different use cases.
For simple functions with fixed amounts of storage reads, this method works well.
For other use cases, see the section [on weights](/reference/how-to-guides/weights/calculate-fees).

Understand how to calculate transaction weights for a basic dispatch function.

- Assign the correct weight before a function call to storage.
- Calculate transaction fees.

## Steps

### 1. Import weight configuration tools

Make sure you have the right dependencies:

```rust
use frame_support::Parameter;
use frame_support::weights::{GetDispatchInfo, Pays};
use sp_runtime::traits::Dispatchable;
use frame_support::pallet_prelude::{DispatchResultWithPostInfo};
use frame_support::dispatch::DispatchResult;
```

### 2. Calculate maximum weight before a function

Using `call.get_dispatch_info()`, calculate the maximum possible weight before the function is declared:

```rust
#[weight = {
  let dispatch_info = call.get_dispatch_info();
  (dispatch_info.weight, dispatch_info.class, Pays::Yes)
  }]
    // Define a function header that returns DispatchResultWithPostInfo.
    fn do_three_reads(origin, call: Box<<T as Config>::Call>) -> DispatchResultWithPostInfo {
    // Function logic.
    }
```

`GetDispatchInfo` provides the `get_dispatch_info()` method we need to retrieve information about the function's weight.

### 3. Calculate the actual weight linked to function's logic

The actual weight of a function call depends on the logic of the extrinsic.
After execution, we can give back fees once the actual weight has been calculated.
Handle this using the [`Pays` Enum][pays-rustdocs] and [`DbWeight`][dbweight-rustdocs].

For a function whose logic does three storage reads, calculate it using `DbWeight` and return it at the end of the function:

```rust
// Function returns a calculation corresponding to 3 DB reads
let check_logic_weight = T::DbWeight::get().reads(3);
return Ok(Some(check_logic_weight).into())

//Remove fee associated to weight
Ok(Pays::Yes.into())
```

## Examples

- [Feeless transaction use case](https://github.com/shawntabrizi/substrate-feeless-token-factory#user-story)
- [Transactions, weights, and fees](/main-docs/build/tx-weight-fees)
- [`ClassifyDispatch`](/rustdocs/latest/frame_support/weights/trait.ClassifyDispatch.html)
- [`WeightData`](/rustdocs/latest/frame_support/weights/trait.WeighData.html)
- [Polkadot transaction fees](https://wiki.polkadot.network/docs/en/learn-transaction-fees)
- [`pays-rustdocs`](/rustdocs/latest/frame_support/weights/enum.Pays.html)
- [`dbweight-rustdocs`](/rustdocs/latest/frame_system/pallet/trait.Config.html#associatedtype.DbWeight)
