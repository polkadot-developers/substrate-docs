---
title: Set up basic tests
description:
keywords:
  - basics
  - testing
  - runtime
---

Learn how to setup the scaffolding required to write tests for your pallet.

This guide steps through how to use `mock.rs` and `test.rs` as a basis for testing your pallet.
We'll be using the node template for the scaffolding of the `mock.rs` file and an arbitrary pallet &mdash; called `pallet-testing` &mdash; to give this guide some context.
This pallet will contain a single function called `add_value`, that takes an origin and a `u32` and returns `Ok(())` if the value is less than or equal to a constant called `MaxValue` that we specify in the mock runtime.

## Use the template node as boilerplate

Inside `pallet-testing/src`, the first thing we need to do is create two empty files: `mock.rs` and `tests.rs`.

Paste in the contents from [`template/src/mock.rs`](https://github.com/substrate-developer-hub/substrate-node-template/blob/main/pallets/template/src/mock.rs).
We'll use this as boilerplate which we'll customize for our `pallet-testing` pallet.

## Create a mock runtime to test your pallet

1. Start by modifying `pallet-testing/src/mock.rs` to include the `pallet-testing` pallet. This involves changes in the following code sections:

1. Replace the first line with the name of the pallet, in our case `pallet_testing`:

   ```rust
   use crate as pallet_testing;
   /*--snip--*/
   ```

## Configure the mock runtime

1. In `frame_support::construct_runtime!`, replace `pallet_template` with the name of your pallet, in our case `pallet_testing`:

   ```rust
   /*--snip--*/
   TestingPallet: pallet_testing::{Pallet, Call, Storage, Event<T>},
   /*--snip--*/
   ```

1. Implement your pallet for the mock runtime. Replace `impl pallet_template::Config for Test {...}` with your configuration types and any constant values your pallet requires:

   ```rust
   parameter_types! {
     pub const MaxValue: u32 = 50;
   }

   impl pallet_testing::Config for Test {
     type RuntimeEvent = RuntimeEvent;
     type MaxValue = MaxValue;
   }
   ```

To put the mock runtime to use, we need to set up our `tests.rs` file for the `pallet-testing` pallet.

## Setup and create tests

In `tests.rs`, start by importing the dependencies you'll need from `lib.rs` using `super`:

```rust
use super::*;
```

1. Test that errors work as intended:

   ```rust
   #[test]
   fn error_works(){
     new_test_ext().execute_with(|| {
       assert_err!(
         TestingPallet::add_value(RuntimeOrigin::signed(1), 51),
         "value must be <= maximum add amount constant"
       );
     })
   }
   ```

1. Create a test that should work:

   ```rust
   #[test]
   fn test_should_work() {
     new_test_ext().execute_with(|| {
       assert_ok!(
         TestingPallet::add_value(RuntimeOrigin::signed(1), 10)
       );
     })
   }
   ```

1. And another that should fail:

   ```rust
   #[test]
   fn test_should_fail() {
     new_test_ext().execute_with(|| {
       assert_ok!(
         TestingPallet::add_value(RuntimeOrigin::signed(1), 100)
       );
     })
   }
   ```

## Run your tests

Execute the following command from your pallet's directory:

```bash
cargo test
```

## Examples

- tests in [`pallet_template`](https://github.com/substrate-developer-hub/substrate-node-template/blob/master/pallets/template/src/tests.rs#L1-L23)
- tests in the [`reward-coin`](https://github.com/substrate-developer-hub/substrate-how-to-guides/blob/main/example-code/template-node/pallets/reward-coin/src/tests.rs) example pallet

## Related material

- [Unit testing](/test/unit-testing/)
- [Testing a transfer function](/reference/how-to-guides/testing/test-a-transfer-function)
- [`assert_ok!`](https://paritytech.github.io/substrate/master/frame_support/macro.assert_ok.html)
- [`assert_err!`](https://paritytech.github.io/substrate/master/frame_support/macro.assert_err.html)
