---
title: Storage migration
description: Provides an overview of the circumstances where storage migration is required and how to upgrade storage in combination with a runtime upgrade.
keywords:
  - storage migration
  - runtime
  - upgrades
  - data layout
---

In [Runtime upgrades](/maintain/runtime-upgrades), you learned the basic relationship between performing runtime upgrades and handling storage migration as part of the upgrade process.
This section provides examples to help you understand when a runtime upgrade will require storage migration, how you can prepare for and perform a runtime upgrade that includes data migration, and how to test runtime upgrades before executing on a network using the try-runtime and remote-externalities tools.

## Common migration scenarios

In a typical runtime upgrade, you only replace the WebAssembly binary under the `:code:` key. 
However, if the changes to the WebAssembly binary include any changes to the storage layout, then the upgrade also will require both a runtime migration and a runtime upgrade.

The following examples illustrate some common migration scenarios.

### Changing a data type

If you change the data type for a stored value, the change requires migration from the old data type to the new data type.

```rust
#[pallet::storage]
pub type FooValue = StorageValue<_, Foo>;
// old
pub struct Foo(u32)
// new
pub struct Foo(u64)

#[pallet::storage]
pub type FooValue = StorageValue<_, Foo>;
// old
pub struct Foo(u32)
// new
pub struct Foo(i32)
// or
pub struct Foo(u16, u16)
```

In the following example, the data type and size remain the same for the variable `Foo`, but because the interpretation is different, a migration would be required.

```rust 
#[pallet::storage]
pub type FooValue = StorageValue<_, Foo>;
// old
pub struct Foo(u32)
// new
pub struct Foo(u16, u16)
```

### Changing the encoding or decoding

The following example requires a migration because the decoding for `Foo` has changed.

```rust
#[pallet::storage]
pub type FooValue = StorageValue<_, Foo>;
// old
pub struct Foo { a: u32, b: u32 }
// new
pub struct Foo { a: u32, b: u32, c: u32 }
```

If for whatever reason c has a type that its encoding is like (), then this would work.

```rust
#[pallet::storage]
pub type FooValue = StorageValue<_, Foo>;
// old
pub struct Foo { a: u32, b: u32 }
// new
pub struct Foo { a: u32, b: u32, c: PhantomData<_> }
```

When is a Migration Required?

```rust
#[pallet::storage]
pub type FooValue = StorageValue<_, Foo>;
  // old
  pub enum Foo { A(u32), B(u32) }
  // new
  pub enum Foo { A(u32), B(u32), C(u128) }
```

Extending an enum is even more interesting, because if you add the variant to the end, no migration is needed.
Assuming that no value is initialized with C, this is not a migration.
---v

When is a Migration Required?
#[pallet::storage]
pub type FooValue = StorageValue<_, Foo>;
// old
pub enum Foo { A(u32), B(u32) }
// new
pub enum Foo { A(u32), C(u128), B(u32) }
You probably never want to do this, but it is a migration.
---v

🦀 Rust Recall 🦀
Enums are encoded as the variant enum, followed by the inner data:

The order matters! Both in struct and enum.
Enums that implement Encode cannot have more than 255 variants.
---v

When is a Migration Required?
#[pallet::storage]
pub type FooValue = StorageValue<_, u32>;
// new
#[pallet::storage]
pub type BarValue = StorageValue<_, u32>;
So far everything is changing the value format.
The key changing is also a migration!
---v

When is a Migration Required?
#[pallet::storage]
pub type FooValue = StorageValue<_, u32>;
// new
#[pallet::storage_prefix = "FooValue"]
#[pallet::storage]
pub type I_can_NOW_BE_renamEd_hahAA = StorageValue<_, u32>;
Handy macro if you must rename a storage type.
This does not require a migration.
Writing Runtime Migrations
Now that we know how to detect if a storage change is a migration, let's see how we write one.
---v

Writing Runtime Migrations
Once you upgrade a runtime, the code is expecting the data to be in a new format.
Any on_initialize or transaction might fail decoding data, and potentially panic!
---v

Writing Runtime Migrations
We need a hook that is executed ONCE as a part of the new runtime...
But before ANY other code (on_initialize, any transaction) with the new runtime is migrated.
This is OnRuntimeUpgrade.

---v

Writing Runtime Migrations
Optional activity: Go into executive and system, and find out how OnRuntimeUpgrade is called only when the code changes!
Pallet Internal Migrations
---v

Pallet Internal Migrations
One way to write a migration is to write it inside the pallet.

#[pallet::hooks]
impl<T: Config> Hooks<T::BlockNumber> for Pallet<T> {
  fn on_runtime_upgrade() -> Weight {
    migrate_stuff_and_things_here_and_there<T>();
  }
}
This approach is likely to be deprecated and is no longer practiced within Parity either.

---v

Pallet Internal Migrations
#[pallet::hooks]
impl<T: Config> Hooks<T::BlockNumber> for Pallet<T> {
  fn on_runtime_upgrade() -> Weight {
    if guard_that_stuff_has_not_been_migrated() {
      migrate_stuff_and_things_here_and_there<T>();
    } else {
      // nada
    }
  }
}
If you execute migrate_stuff_and_things_here_and_there twice as well, then you are doomed 😫.
---v

Pallet Internal Migrations
Historically, something like this was used:

#[derive(Encode, Decode, ...)]
enum StorageVersion {
  V1, V2, V3, // add a new variant with each version
}

#[pallet::storage]
pub type Version = StorageValue<_, StorageVersion>;

#[pallet::hooks]
impl<T: Config> Hooks<T::BlockNumber> for Pallet<T> {
  fn on_runtime_upgrade() -> Weight {
    if let StorageVersion::V2 = Version::<T>::get() {
      // do migration
      Version::<T>::put(StorageVersion::V3);
    } else {
      // nada
    }
  }
}
---v

Pallet Internal Migrations
FRAME introduced macros to manage migrations: #[pallet::storage_version].
// your current storage version.
const STORAGE_VERSION: StorageVersion = StorageVersion::new(2);

#[pallet::pallet]
#[pallet::storage_version(STORAGE_VERSION)]
pub struct Pallet<T>(_);
This adds two function to the Pallet<_> struct:
// read the current version, encoded in the code.
let current = Pallet::<T>::current_storage_version();
// read the version encoded onchain.
Pallet::<T>::on_chain_storage_version();
// synchronize the two.
current.put::<Pallet<T>>();
---v

Pallet Internal Migrations
#[pallet::hooks]
impl<T: Config> Hooks<T::BlockNumber> for Pallet<T> {
  fn on_runtime_upgrade() -> Weight {
    let current = Pallet::<T>::current_storage_version();
    let onchain = Pallet::<T>::on_chain_storage_version();

    if current == 1 && onchain == 0 {
      // do stuff
      current.put::<Pallet<T>>();
    } else {
    }
  }
}
Stores the version as u16 in twox(pallet_name) ++ twox(:__STORAGE_VERSION__:).

External Migrations
---v

External Migrations
Managing migrations within a pallet could be hard.
Especially for those that want to use external pallets.
Alternative:

Every runtime can explicitly pass anything that implements OnRuntimeUpgrade to Executive.
End of the day, Executive does:
<(COnRuntimeUpgrade, AllPalletsWithSystem) as OnRuntimeUpgrade>::on_runtime_upgrade().
---v

External Migrations
The main point of external migrations is making it more clear:
"What migrations did exactly execute on upgrade to spec_version xxx"
---v

External Migrations
Expose your migration as a standalone function or struct implementing OnRuntimeUpgrade inside a pub mod v<version_number>.
pub mod v3 {
  pub struct Migration;
  impl OnRuntimeUpgrade for Migration {
    fn on_runtime_upgrade() -> Weight {
      // do stuff
    }
  }
}
---v

External Migrations
Guard the code of the migration with pallet::storage_version
Don't forget to write the new version!
pub mod v3 {
  pub struct Migration;
  impl OnRuntimeUpgrade for Migration {
    fn on_runtime_upgrade() -> Weight {
      let current = Pallet::<T>::current_storage_version();
      let onchain = Pallet::<T>::on_chain_storage_version();

      if current == 1 && onchain == 0 {
        // do stuff
        current.put::<Pallet<T>>();
      } else {
      }
    }
  }
}
---v

External Migrations
Pass it to the runtime per-release.
pub type Executive = Executive<
  _,
  _,
  _,
  _,
  _,
  (v3::Migration, ...)
>;
---v

External Migrations
Discussion: Can the runtime upgrade scripts live forever? Or should they be removed after a few releases?
Notes:

Short answer is, yes, but it is a LOT of work. See here: paritytech/substrate#10308

Utilities in frame-support.
translate methods:
For StorageValue, StorageMap, etc.
https://paritytech.github.io/substrate/master/frame_support/storage/migration/index.html
#[storage_alias] macro to create storage types for removed for those that are being removed.
Notes:

Imagine you want to remove a storage map and in a migration you want to iterate it and delete all items. You want to remove this storage item, but it would be handy to be able to access it one last time in the migration code. This is where #[storage_alias] comes into play.

Case Studies
The day we destroyed all balances in Polkadot.
First ever migration (pallet-elections-phragmen).
Fairly independent migrations in pallet-elections-phragmen.
Testing Upgrades
---v

Testing Upgrades
try-runtime + RemoteExternalities allow you to examine and test a runtime in detail with a high degree of control over the environment.

It is meant to try things out, and inspired by traits like TryFrom, the name TryRuntime was chosen.

---v

Testing Upgrades
Recall:

The runtime communicates with the client via host functions.
Moreover, the client communicates with the runtime via runtime APIs.
An environment that provides these host functions is called Externalities.
One example of which is TestExternalities, which you have already seen.
---v

Testing Upgrades: remote-externalities
remote-externalities ia a builder pattern that loads the state of a live chain inside TestExternalities.

let mut ext = Builder::<Block>::new()
  .mode(Mode::Online(OnlineConfig {
  	transport: "wss://rpc.polkadot.io",
  	pallets: vec!["PalletA", "PalletB", "PalletC", "RandomPrefix"],
  	..Default::default()
  }))
  .build()
  .await
  .unwrap();
Reading all this data over RPC can be slow!

---v

Testing Upgrades: remote-externalities
remote-externalities supports:

Custom prefixes -> Read a specific pallet
Injecting custom keys -> Read :code: as well.
Injecting custom key-values -> Overwrite :code: with 0x00!
Reading child-tree data -> Relevant for crowdloan pallet etc.
Caching everything in disk for repeated use.
---v

Testing Upgrades: remote-externalities
remote-externalities is in itself a very useful tool to:

Go back in time and re-running some code.
Write unit tests that work on the real-chain's state.
Testing Upgrades: try-runtime
try-runtime is a CLI and a set of custom runtime APIs integrated in substrate that allows you to do detailed testing..

.. including running OnRuntimeUpgrade code of a new runtime, on top of a real chain's data.

---v

Testing Upgrades: try-runtime
A lot can be said about it, the best resource is the rust-docs.
---v

Testing Upgrades: try-runtime
You might find some code in your runtime that is featured gated with #[cfg(feature = "try-runtime")]. These are always for testing.
pre_upgrade and post_upgrade: Hooks executed before and after on_runtime_upgrade.
try_state: called in various other places, used to check the invariants the pallet.
---v

Testing Upgrades: try-runtime: Live Demo.
Let's craft a migration on top of poor node-template 😈..
and migrate the balance type from u128 to u64.
Additional Resources 😋
Check speaker notes (click "s" 😉)

Notes:

additional work on automatic version upgrades: paritytech/substrate#13107
a Great talk about try-runtime and further testing of your runtime: https://www.youtube.com/watch?v=a_u3KMG-n-I
Reference material:
https://docs.google.com/presentation/d/1hr3fiqOI0JlXw0ISs8uV9BXiDQ5mGOQLc3b_yWK6cxU/edit#slide=id.g43d9ae013f_0_82 https://www.crowdcast.io/e/substrate-seminar/41

