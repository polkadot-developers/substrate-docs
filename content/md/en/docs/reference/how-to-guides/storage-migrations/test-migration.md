---
title: Test migration
description:
keywords:
  - storage migration
  - testing
  - runtime
---

When writing a runtime migration module it is important to test it to avoid any critical issues caused by mangling storage items. 
This guide provides a walk through of the tests to include for a simple storage migration of a single pallet, using the Nicks pallet migration from the [basic storage migration guide](/reference/how-to-guides/storage-migrations/basic-migration) as a reference.

## Goal
Write tests for a simple storage migration.

## Use cases

Testing a migration module inside a pallet.

## Steps

### 1. Write mock runtime

Refer to [Set up basic tests](/reference/how-to-guides/testing/basic-tests/) to learn how to set up the dependencies for your test environment.

### 2. Specify unit tests

Derive the different tests that need to be included based on your pallet's functions.

For the Nicks pallet migration we need the following tests:

- `fn kill_name_should_work()`
- `fn force_name_should_work()`
- `fn normal_operation_should_work()`
- `fn error_catching_should_work()`

Using `asset_noop!(...)`, `assert_ok!(...)` and `assert_eq!(...)`, constructing one of these tests looks like this:

```rust
#[test]
fn normal_operation_should_work() {
  new_test_ext().execute_with(|| {
    assert_ok!(Nicks::set_name(Origin::signed(1), b"Gav".to_vec(), None));
		assert_eq!(Balances::reserved_balance(1), 2);
		assert_eq!(Balances::free_balance(1), 8);
		assert_eq!(<NameOf<Test>>::get(1).unwrap().0.first, b"Gav".to_vec());

		assert_ok!(Nicks::set_name(Origin::signed(1), b"Gavin".to_vec(), None));
		assert_eq!(Balances::reserved_balance(1), 2);
		assert_eq!(Balances::free_balance(1), 8);
		assert_eq!(<NameOf<Test>>::get(1).unwrap().0.first, b"Gavin".to_vec());

		assert_ok!(Nicks::clear_name(Origin::signed(1)));
		assert_eq!(Balances::reserved_balance(1), 0);
		assert_eq!(Balances::free_balance(1), 10);
	});
}
```

## Examples

- [Migrating the Nicks pallet](https://github.com/substrate-developer-hub/migration-example/pull/2/files) example

## Resources

#### Other

- [Fork-off Substrate](https://github.com/maxsam4/fork-off-substrate) tool
