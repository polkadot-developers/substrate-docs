---
title: Conditional weighting
description:
keywords:
  - weights
  - benchmarking
  - runtime
---

Substrate provides a mechanism known as [transaction weighting](/main-docs/build/tx-weights-fees) to quantify the resources consumed while executing a transaction. 
Typically, we use the weight functions returned from our benchmarking for this.
But Substrate also allow us to apply a totally different weight function based on certain condition.
We will walk through an example in this guide.
Once defined, it can be used directly in your pallet, written as such:

#[pallet::weight(Conditional(\<your condition\>)

## Objectives

- Create and use custom weighting in your pallet.

- Apply different weight functions based on certain condition on computing extrinsic's weight value.

Here are the different traits we'll be implementing:
  - [\`WeighData\`](/rustdocs/latest/frame_support/weights/trait.WeighData.html#impl-WeighData<T>-for-(Weight%2C%20DispatchClass%2C%20Pays)): Weigh the data in a function. 
    \`pallet::weight\` expects whatever implements \`WeighData<T>\` to replace \`T\` with a tuple of the dispatch arguments.
  - [\`PaysFee\`](rustdocs/latest/frame_support/weights/trait.PaysFee.html): Designate whether the dispatch pays a fee or not.
  - [\`ClassifyDispatch\`](/rustdocs//latest/frame_support/weights/trait.ClassifyDispatch.html): A way to tell the runtime about the type of dispatch being made.`,
    },
  ]}
/>

## Steps

### 1. Write the `WeighData` struct

Import `DispatchClass`, `WeighData` and `PaysFee` by declaring `use frame_support::dispatch::{DispatchClass, PaysFee, WeighData}`
at the top of your pallet.

In your pallet's `lib.rs` file, declare a struct called `Conditional` and write an implementation
of `WeighData` for `Conditional`, where the first parameter is the condition that evaluate to
a boolean value. In the following example, if the condition is true, the weight will be linear to
the input. Otherwise the weight will be a constant.

`pallets/example/src/lib.rs`

```rust
use frame_support::dispatch::{DispatchClass, PaysFee, WeighData};

// -- snip --

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

### 2. Classify dispatch calls

Add `weights::{ClassifyDispatch, DispatchClass, Pays, Weight}` to your pallet's `frame_support` imports.
Since this implementation of `WeighData` requires a [`DispatchClass`](/rustdocs/latest/frame_support/weights/enum.DispatchClass.html), use `default`
to classify all calls as normal:

`pallets/example/src/lib.rs`

```rust
use frame_support::weights::{ClassifyDispatch, DispatchClass, Pays, Weight};

// -- snip --

// Implement ClassifyDispatch
impl<T> ClassifyDispatch<T> for Conditional {
  fn classify_dispatch(&self, _: T) -> DispatchClass {
    Default::default()
  }
}
```

### 3. Implement `PaysFee`

Specify how `PaysFee` is used for the custom `WeighData` struct. Setting this to `true` will require the
caller of this dispatch to pay a fee:

`pallets/example/src/lib.rs`

```rust
use frame_support::weights::PaysFee

// -- snip --

// Implement PaysFee
impl PaysFee for Conditional {
    fn pays_fee(&self) -> bool {
      true
    }
}
```

### 4. Use the weighting struct for an extrinsic

Use the conditional weighting struct on your pallet's extrinsics like this:

`pallets/example/src/lib.rs`

```rust
  #[pallet::weight(Conditional(200))]
  fn example(origin: OriginFor<T>, add_flag: bool, val: u32>) -> DispatchResult {
      //...
  }
```

## Examples

- [Custom `WeightForSetDummy` struct in the Example pallet](https://github.com/paritytech/substrate/blob/master/frame/examples/basic/src/lib.rs)

## Related material

#### Docs

- [Benchmarking](/v3/runtime/benchmarking)
- [Calculate custom fees](/how-to-guides/v3/weights/calculate-fees)
