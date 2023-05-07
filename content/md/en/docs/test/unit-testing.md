---
title: Unit test
description: Illustrates basic unit testing for runtime logic.
keywords:
---

As you build the logic for your runtime, you'll want to routinely test that the logic works as expected.
You can create unit tests for the runtime using the [unit testing framework](https://doc.rust-lang.org/rust-by-example/testing/unit_testing.html) provided by Rust.
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

## Test events in a mock runtime

It can also be important to test the events that are emitted from your chain, in addition to the storage.
Assuming you use the default generation of `deposit_event` with the `generate_deposit` macro, all pallet events are stored under the `system` / `events` key with some extra information as an [`EventRecord`](https://paritytech.github.io/substrate/master/frame_system/struct.EventRecord.html).

These event records can be directly accessed and iterated over with `System::events()`, but there are also some helper methods defined in the system pallet to be used in tests, [`assert_last_event`](https://paritytech.github.io/substrate/master/frame_system/pallet/struct.Pallet.html#method.assert_last_event) and [`assert_has_event`](https://paritytech.github.io/substrate/master/frame_system/pallet/struct.Pallet.html#method.assert_has_event).

```rust
fn fake_test_example() {
 ExtBuilder::default().build_and_execute(|| {
  System::set_block_number(1);
  // ... test logic that emits FakeEvent1 and then FakeEvent2 ...
  System::assert_has_event(Event::FakeEvent1{}.into())
  System::assert_last_event(Event::FakeEvent2 { data: 7 }.into())
  assert_eq!(System::events().len(), 2);
 });
}
```

Some things to note are:

- Events are not emitted on the genesis block, and so the block number should be set in order for this test to pass.
- You need to have a `.into()` after instantiating your pallet event, which turns it into a generic event.

### Advanced event testing

When testing events in a pallet, often you are only interested in the events that are emitted from your own pallet.
The following helper function filters events to include only events emitted by your pallet and converts them into a custom event type.
A helper function like this is usually placed in the `mock.rs` file for testing in a mock runtime.

```rust
fn only_example_events() -> Vec<super::Event<Runtime>> {
 System::events()
  .into_iter()
  .map(|r| r.event)
  .filter_map(|e| if let RuntimeEvent::TemplateModule(inner) = e { Some(inner) } else { None })
  .collect::<Vec<_>>();
}
```

Additionally, if your test performs operations that emit events in a sequence, you might want to only see the events that have happened since the last check.
The following example leverages the preceding helper function.

```rust
parameter_types! {
 static ExamplePalletEvents: u32 = 0;
}

fn example_events_since_last_call() -> Vec<super::Event<Runtime>> {
 let events = only_example_events();
 let already_seen = ExamplePalletEvents::get();
 ExamplePalletEvents::set(events.len() as u32);
 events.into_iter().skip(already_seen as usize).collect()
}
```

You can find examples of this type of event testing in the tests for the [nomination pool](https://github.com/paritytech/substrate/blob/master/frame/nomination-pools/src/mock.rs) or [staking](https://github.com/paritytech/substrate/blob/master/frame/staking/src/mock.rs).
If you rewrite the previous event test with this new function, the resulting code looks like this:

```rust
fn fake_test_example() {
 ExtBuilder::default().build_and_execute(|| {
  System::set_block_number(1);
  // ... test logic that emits FakeEvent1 ...
  assert_eq!(
   example_events_since_last_call(),
   vec![Event::FakeEvent1{}]
  );
  // ... test logic that emits FakeEvent2 ...
  assert_eq!(
   example_events_since_last_call(),
   vec![Event::FakeEvent2{}]
  );
 });
}
```

## Genesis config

In the previous examples, the `ExtBuilder::build()` method used the default genesis configuration for building the mock runtime environment.
In many cases, it is convenient to set storage before testing.
For example, you might want to pre-seed account balances before testing.

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

In this example, account 1 has a balance of 10, account 2 has a balance of 20, and so on.

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
  if System::block_number() > 0 {
   ExamplePallet::on_finalize(System::block_number());
   System::on_finalize(System::block_number());
  }
  System::reset_events();
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

<!-- TODO NAV.YAML -->
<!-- add these back -->
<!-- - [Set up tests for your pallet](/reference/how-to-guides/testing/) -->
