---
title: Unit test
description: Illustrates basic unit testing for runtime logic.
keywords:
---

As you build the logic for your runtime, you'll want to routinely test that the logic works as expected.
You can create unit test for the runtime using the [unit testing framework](https://doc.rust-lang.org/rust-by-example/testing/unit_testing.html) provided by Rust.
After you create one or more unit tests, you can use the `cargo test` command to execute the test.
For example, you can run all of the tests you have created for a runtime by running the following command:

```shell
cargo test
```

For more information about using the Rust cargo test command and testing framework, run the following command:

```shell
cargo help test
```

## Test pallet log in a mock runtime

In addition to the unit testing you can do with the Rust testing framework, you can verify the logic in your runtime by constructing a mock runtime environment.
The configuration type `Test` is defined as a Rust enum with implementations for each of the pallet configuration traits that are used in the mock runtime.

```rust
frame_support::construct_runtime!(
 pub enum Test where
  Block = Block,
  NodeBlock = Block,
  UncheckedExtrinsic = UncheckedExtrinsic,
 {
  System: frame_system::{Pallet, Call, Config, Storage, Event<T>},
  TemplateModule: pallet_template::{Pallet, Call, Storage, Event<T>},
 }
);

impl frame_system::Config for Test {
 // -- snip --
 type AccountId = u64;
}
```

If `Test` implements `pallet_balances::Config`, the assignment might use `u64` for the `Balance` type.
For example:

```rust
impl pallet_balances::Config for Test {
 // -- snip --
 type Balance = u64;
}
```

By assigning `pallet_balances::Balance` and `frame_system::AccountId` to `u64`, testing accounts and balances only requires tracking a `(AccountId: u64, Balance: u64)` mapping in the mock runtime.

## Test storage in a mock runtime

The [`sp-io`](https://paritytech.github.io/substrate/master/sp_io/index.html) crate exposes a [`TestExternalities`](https://paritytech.github.io/substrate/master/sp_io/type.TestExternalities.html) implementation that you can use to test storage in a mock environment.
It is the type alias for an in-memory, hashmap-based externalities implementation in [`substrate_state_machine`](https://paritytech.github.io/substrate/master/sp_state_machine/index.html) referred to as [`TestExternalities`](https://paritytech.github.io/substrate/master/sp_state_machine/struct.TestExternalities.html).

The following example demonstrates defining a struct called `ExtBuilder` to build an instance of `TestExternalities`, and setting the block number to 1.

```rust
pub struct ExtBuilder;

impl ExtBuilder {
 pub fn build(self) -> sp_io::TestExternalities {
  let mut t = system::GenesisConfig::default().build_storage::<TestRuntime>().unwrap();
  let mut ext = sp_io::TestExternalities::new(t);
  ext.execute_with(|| System::set_block_number(1));
  ext
 }
}
```

To create the test environment in unit tests, the build method is called to generate a `TestExternalities` using the default genesis configuration.

```rust
#[test]
fn fake_test_example() {
 ExtBuilder::default().build_and_execute(|| {
  // ...test logics...
 });
}
```

Custom implementations of [Externalities](https://paritytech.github.io/substrate/master/sp_externalities/index.html) allow you to construct runtime environments that provide access to features of the outer node.
Another example of this can be found in the [`offchain`](https://paritytech.github.io/substrate/master/sp_core/offchain/index.html) module.
The `offchain` module maintains its own [Externalities](https://paritytech.github.io/substrate/master/sp_core/offchain/trait.Externalities.html) implementation.

## Genesis config

In the previous example, the `ExtBuilder::build()` method used the default genesis configuration for building the mock runtime environment.
In many cases, it is convenient to set storage before testing.
For example, you might want to pre-seeding account balances before testing.

In the implementation of `frame_system::Config`, `AccountId` and `Balance` are both set to `u64`.
You can put `(u64, u64)` pairs in the `balances` vec to seed `(AccountId, Balance)` pairs as the account balances.
For example:

```rust
impl ExtBuilder {
 pub fn build(self) -> sp_io::TestExternalities {
  let mut t = frame_system::GenesisConfig::default().build_storage::<Test>().unwrap();
  pallet_balances::GenesisConfig::<Test> {
   balances: vec![
    (1, 10),
    (2, 20),
    (3, 30),
    (4, 40),
    (5, 50),
    (6, 60)
   ],
  }
   .assimilate_storage(&mut t)
   .unwrap();

  let mut ext = sp_io::TestExternalities::new(t);
  ext.execute_with(|| System::set_block_number(1));
  ext
 }
}
```

AIn this example, acount 1 has balance 10, account 2 has balance 20, and so on.

The exact structure used to define the genesis configuration of a pallet depends on the pallet `GenesisConfig` struct definition.
For example, in the Balances pallet, it is defined as:

```rust
pub struct GenesisConfig<T: Config<I>, I: 'static = ()> {
 pub balances: Vec<(T::AccountId, T::Balance)>,
}
```

## Block production

It is useful to simulate block production to verify that expected behavior holds across block production.

A simple way of doing this is by incrementing the System module's block number between `on_initialize` and `on_finalize` calls from all modules with `System::block_number()` as the sole input.
Although it is important for runtime code to cache calls to storage or the system module, the test environment scaffolding should prioritize readability to facilitate future maintenance.

```rust
fn run_to_block(n: u64) {
 while System::block_number() < n {
  if System::block_number() > 1 {
   ExamplePallet::on_finalize(System::block_number());
   System::on_finalize(System::block_number());
  }
  System::set_block_number(System::block_number() + 1);
  System::on_initialize(System::block_number());
  ExamplePallet::on_initialize(System::block_number());
 }
}
```

The `on_finalize` and `on_initialize` methods are only called from `ExamplePallet` if the pallet trait implements the `frame_support::traits::{OnInitialize, OnFinalize}` traits to execute the logic encoded in the runtime methods before and after each block respectively.

Then call this function in the following fashion.

```rust
#[test]
fn my_runtime_test() {
 with_externalities(&mut new_test_ext(), || {
  assert_ok!(ExamplePallet::start_auction());
  run_to_block(10);
  assert_ok!(ExamplePallet::end_auction());
 });
}
```

## Where to go next

- [Set up tests for your pallet](/reference/how-to-guides/testing/)
