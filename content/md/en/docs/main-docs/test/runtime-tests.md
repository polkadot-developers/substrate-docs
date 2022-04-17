---
title: Runtime unit testing
description: /v3/runtime/testing
version: '3.0'
section: docs
category: runtime
keywords: []
---

Runtime tests allow you to verify the logic in your runtime module by mocking a Substrate runtime
environment.

## Unit testing

Substrate uses the existing
[unit testing](https://doc.rust-lang.org/rust-by-example/testing/unit_testing.html) framework
provided by Rust. To run tests, the command is

```bash
cargo test <optional: test_name>
```

## Mock runtime environment

To test a Substrate runtime, construct a mock runtime environment. The configuration type `Test`
is defined as a Rust enum with implementations for each of the pallet configuration trait that are
used in the mock runtime.

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

```rust
impl pallet_balances::Config for Test {
	// -- snip --
	type Balance = u64;
}
```

By assigning `pallet_balances::Balance` and `frame_system::AccountId` to `u64`, mock runtimes ease
the mental overhead of comprehensive, conscientious testers. Reasoning about accounts and balances
only requires tracking a `(AccountId: u64, Balance: u64)` mapping.

### Mock runtime storage

The [`sp-io`](/rustdocs/latest/sp_io/index.html) crate exposes a
[`TestExternalities`](/rustdocs/latest/sp_io/type.TestExternalities.html)
implementation frequently used for mocking storage in tests. It is the type alias for an in-memory,
hashmap-based externalities implementation in
[`substrate_state_machine`](/rustdocs/latest/sp_state_machine/index.html) referred to as
[`TestExternalities`](/rustdocs/latest/sp_state_machine/struct.TestExternalities.html).

This example demonstrates defining a struct called `ExtBuilder` to build an instance of
`TestExternalities`, and setting the block number to 1.

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

To create the test environment in unit tests, the build method is called to generate a
`TestExternalities` using the default genesis configuration.

```rust
#[test]
fn fake_test_example() {
	ExtBuilder::default().build_and_execute(|| {
		// ...test logics...
	});
}
```

Custom implementations of [Externalities](/rustdocs/latest/sp_externalities/index.html) allow developers
to construct runtime environments that provide access to features of the outer node. Another example
of this can be found in [`offchain`](/rustdocs/latest/sp_core/offchain/index.html), which maintains its own
[Externalities](/rustdocs/latest/sp_core/offchain/trait.Externalities.html) implementation.

#### Genesis config

The previously shown `ExtBuilder::build()` method used the default genesis configuration for
building the mock runtime environment. In many cases, it is convenient to set storage before
testing.

An example might involve pre-seeding account balances before testing.

In the implementation of `frame_system::Config`, `AccountId` is set to `u64` just like `Balance` shown
above. Place `(u64, u64)` pairs in the `balances` vec to seed `(AccountId, Balance)` pairs as the
account balances.

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

Account 1 has balance 10, account 2 has balance 20, and so on.

The exact struct of how to define the genesis config of a certain pallet depends on the pallet
`GenesisConfig` struct definition. For Balances Pallet, as shown
[in the rustdocs](/rustdocs/latest/pallet_balances/pallet/struct.GenesisConfig.html), it is defined
as:

```rust
pub struct GenesisConfig<T: Config<I>, I: 'static = ()> {
	pub balances: Vec<(T::AccountId, T::Balance)>,
}
```

### Block production

It will be useful to simulate block production to verify that expected behavior holds across block
production.

A simple way of doing this is by incrementing the System module's block number between `on_initialize` and
`on_finalize` calls from all modules with `System::block_number()` as the sole input. While it is
important for runtime code to cache calls to storage or
the system module, the test environment scaffolding should prioritize readability to facilitate
future maintenance.

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

`on_finalize` and `on_initialize` are only called from `ExamplePallet` if the pallet trait
implements the `frame_support::traits::{OnInitialize, OnFinalize}` traits to execute the logic
encoded in the runtime methods before and after each block respectively.

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

### Testing Events

It can be useful to test that the emitted events conforms to some expectations.

We can access events emitted from the `frame_system` pallet using the [`events()` method](https://docs.substrate.io/rustdocs/latest/frame_system/pallet/struct.Pallet.html#method.events):

```rust
#[test]
fn subtract_extrinsic_works() {
	new_test_ext().execute_with(|| {
		assert_ok!(<test_pallet::Pallet<Test>>::subtract(Origin::signed(1), 42, 12));
		let event = <frame_system::Pallet<Test>>::events().pop()
			.expect("Expected at least one EventRecord to be found").event;
		assert_eq!(event, mock::Event::from(test_pallet::Event::Result(42 - 12)));
	});
}
```

## Learn more

- Learn how to set up tests for your pallet with [this guide](/how-to-guides/v3/testing/basics/)
