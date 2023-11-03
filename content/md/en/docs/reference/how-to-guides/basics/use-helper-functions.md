---
title: Use helper functions
description:
keywords:
  - basics
  - runtime
---

This short guide steps through an example of creating and re-using helper functions to perform common "verify" checks within a pallet's code.

Sometimes a dispatchable function inside a pallet reuses logic that is common to other dispatchables.
In this case, it's useful to refactor this logic into its own private function.
At other times, dispatchable functions get increasingly difficult to read as the amount of code increases to perform various checks within the dispatchable.
In both instances, using helper functions that cannot be accessed from outside the pallet are a useful tool to optimize for code readability and reusability.
In this guide, we'll see how to create an adder helper that checks for arithmetic overflow and can be reused in any dispatchable.

### Create your helper function

The helper we'll refer to is called `fn _adder`.
It checks that there is no overflow when adding two integers of type `u32`.

It takes two `u32` integers, uses `checked_add` and `ok_or` to check that there is no overflow.
If there is, it returns an error; otherwise it returns the result.

Here's what it looks like as a helper function.
This would go at the bottom of your pallet:

```rust
impl<T: Config> Pallet<T> {
    fn _adder(num1: u32, num2: u32) -> Result<u32, &'static str> {
        num1.checked_add(num2).ok_or("Overflow when adding")
    }
}
```

## Use it in your dispatchables

Identify the places where you need to check for overflow when performing an addition.
Use the helper function instead of rewriting the same code.
Below is a simple example of a dispatchable that allows a signed extrinsic to add a value to the existing storage value:

```rust
// Extrinsics callable from outside the runtime.
#[pallet::call]
impl<T: Config> Pallet<T> {
  #[pallet::weight(0)]
  fn add_value(
    origin: OriginFor<T>,
    val_to_add: u32
    ) -> DispatchResultWithPostInfo {
      let _ = ensure_signed(origin)?;

      ensure!(val_to_add <= T::MaxAddend::get(), "value must be <= maximum add amount constant");

      // previous value got
      let c_val = SingleValue::<T>::get();

      // checks for overflow when new value added
      let result = _adder(c_val, val_to_add);

      <SingleValue<T>>::put(result);
      Self::deposit_event(Event::Added(c_val, val_to_add, result));
      Ok(().into())
  }
}
```

## Examples

- [example-offchain-worker](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/examples/offchain-worker/src/lib.rs): the `add_price` helper function used in this pallet's dispatchable.

## Resources

- [`checked_add` in `num` crate](https://docs.rs/num/0.4.0/num/traits/trait.CheckedAdd.html)
- [`ok_or` in `Option` crate](https://doc.rust-lang.org/std/option/enum.Option.html#method.ok_or)
