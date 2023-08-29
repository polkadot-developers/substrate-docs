---
title: Use conditional weights
description:
keywords:
  - weights
  - benchmarking
  - runtime
---

Substrate provides a mechanism known as [transaction weighting](/build/tx-weights-fees) to quantify the resources consumed while executing a transaction.
Typically, we use the weight functions returned from our benchmarking for this.
But Substrate also allow us to apply a totally different weight function based on certain condition.
We will walk through an example in this guide.
Once defined, it can be used directly in your pallet, written as such:

`#[pallet::weight(Conditional(\<your condition\>)`

## Objectives

- Create and use custom weighting in your pallet.

- Apply different weight functions based on certain condition on computing extrinsic's weight value.

Here are the different traits we'll be implementing:

- [\`WeighData\`](https://paritytech.github.io/substrate/master/frame_support/weights/trait.WeighData.html#): Weigh the data in a function.
  \`pallet::weight\` expects whatever implements \`WeighData<T>\` to replace \`T\` with a tuple of the dispatch arguments.
- [\`PaysFee\`](https://paritytech.github.io/substrate/master/frame_support/weights/trait.PaysFee.html): Designate whether the dispatch pays a fee or not.
- [\`ClassifyDispatch\`](https://paritytech.github.io/substrate/master/frame_support/weights/trait.ClassifyDispatch.html): A way to tell the runtime about the type of dispatch being made.

## Write the Weight struct

1. Open `lib.rs` file for your pallet in a text editor.

1. Import `DispatchClass` and `Pays` by declaring `use frame_support::dispatch::{DispatchClass, Pays}`.

1. Import `weights` primitives into the pallet.
   
   ```rust
   use frame_support:: {
    dispatch::{DispatchClass, Pays},
   },
   weights::Weight,

1. Declare a struct called `Conditional` and write an implementation of `WeighData` for `Conditional` where the first parameter is the condition that evaluates to a boolean value. 
   
   In the following example, if the condition is true, the weight will be linear to the input.
   Otherwise the weight will be a constant.

   ```rust
   pub struct Conditional(u32);
   impl WeighData<(&bool, &u32)> for Conditional {
      fn weigh_data(&self, (switch, val): (&bool, &u32)) -> Weight {
        
      // If the first parameter is true, then the weight is linear in the second parameter.
         if *switch {
            val.saturating_mul(self.0)
         }
      // Otherwise the weight is constant.
         else {
            self.0
         }
      }
   }
   ```

## Classify dispatch calls

Add `dispatch::{ClassifyDispatch, DispatchClass, Pays}` to your pallet's `frame_support` imports.
Since this implementation requires a [`DispatchClass`](https://paritytech.github.io/substrate/master/frame_support/dispatch/enum.DispatchClass.html), use `default` to classify all calls as normal:

1. Open `lib.rs` file for your pallet in a text editor.

1. Import `DispatchClass` and `Pays` by declaring `use frame_support::dispatch::{DispatchClass, Pays}`.
   
   ```rust
   use frame_support::dispatch::{ClassifyDispatch, DispatchClass, Pays};
   // -- snip --
   
   // Implement ClassifyDispatch
   impl<T> ClassifyDispatch<T> for Conditional {
      fn classify_dispatch(&self, _: T) -> DispatchClass {
         Default::default()
      }
  }
  ```

## Implement Pays

Specify how `Pays` is used for the custom `WeighData` struct. 
Setting this to `true` require the caller of this dispatch to pay a fee:

1. Open `lib.rs` file for your pallet in a text editor.

1. Implement `Pays` for the Conditional structure.
   
   ```rust
   impl Pays for Conditional {
      fn pays_fee(&self) -> bool {
         true
      }
   }
   ```

## Use the weighting struct for an extrinsic

Use the conditional weighting struct on your pallet's extrinsics like this:

```rust
#[pallet::weight(Conditional(200))]
   fn example(origin: OriginFor<T>, add_flag: bool, val: u32>) -> DispatchResult {
   //...
   }
```

## Examples

- [Custom `WeightForSetDummy` struct in the Example pallet](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/examples/basic/src/lib.rs)

## Related material

- [Benchmarking](/test/benchmark)
- [Calculate fees](/reference/how-to-guides/weights/calculate-fees)
- [Use custom weights](/reference/how-to-guides/weights/use-custom-weights)
