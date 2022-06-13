---
title: Upgrade a running node
description: Perform a forkless runtime upgrade on a running Substrate network.
---

Unlike many blockchains, the Substrate development framework supports **forkless upgrades** to the runtime that is the core of the blockchain.
Most blockchain projects require a [hard fork](/reference/glossary/#fork) of the code base to support ongoing development of new features or enhancements to existing features.
With Substrate, you can deploy enhanced runtime capabilities—including breaking changes—without a hard fork.
Because the definition of the runtime is itself an element in a Substrate chain's state, network participants can update this value by calling the [`set_code` function](/rustdocs/latest/frame_system/pallet/enum.Call.html#variant.set_code) in a transaction.
Because updates to the runtime state are validates using the blockchain's consensus mechanisms and cryptographic guarantees, network participants can use the blockchain itself to distribute updated or extended runtime logic without needing to fork the chain or release a new blockchain client.

This tutorial illustrates how to perform forkless upgrades by deploying the following changes to an existing Substrate runtime:

- Add the Scheduler pallet to the runtime.
- Use the Scheduler pallet to increase the minimum balance for network accounts.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/main-docs/install/).

- You have completed [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) and have the Substrate node template installed locally.

* You have reviewed [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet) for an introduction to adding a new pallet to the runtime.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Use the Sudo pallet to simulate governance for a chain upgrade.

- Upgrade the runtime for a running node to include a new pallet.

- Schedule an upgrade for a runtime.

## Authorize an upgrade using the Sudo pallet

In FRAME, the `Root` origin identifies the runtime administrator.
Only this administrator can update the runtime by calling the `set_code` function.
To invoke this function using the `Root` origin, you can use the the `sudo` function in the Sudo pallet to specify the account that has superuser administrative permissions.

By default, the chain specification file for the node template specifies that the `alice` development account is the owner of the Sudo administrative account.
Therefore, this tutorial uses the `alice` account to perform runtime upgrades.

### Resource accounting for runtime upgrades

Function calls that are dispatched to the Substrate runtime are always associated with a [weight](/reference/glossary/#weight) to account for resource usage.
The FRAME System module sets boundaries on the block length and block weight that these transactions can use.
However, the `set_code` function is intentionally designed to consume the maximum weight that can fit in a block.
Forcing a runtime upgrade to consume an entire block prevents transactions in the same block from executing on different versions of a runtime.

The weight annotation for the `set_code` function also specifies that the function is in the `Operational` class because it provides network capabilities.
Functions calls that are identified as operational:

- Can consume the entire weight limit of a block.
- Are given maximum priority.
- Are exempt from paying the transaction fees.

### Managing resource accounting

In this tutorial, the [`sudo_unchecked_weight`](/rustdocs/latest/pallet_sudo/pallet/enum.Call.html#variant.sudo_unchecked_weight) function is used to invoke the `set_code` function for the runtime upgrade.
The `sudo_unchecked_weight` function is the same as the `sudo` function except that it supports an additional parameter to specify the weight to use for the call.
This parameter enables you to work around resource accounting safeguards to specify a weight of zero for the call that dispatches the `set_code` function.
This setting allows for a block to take _an indefinite time to compute_ to ensure
that the runtime upgrade does not fail, no matter how complex the operation is.
It can take all the time it needs to succeed or fail.

## Upgrade the runtime to add the Scheduler pallet

The node template doesn't include the [Scheduler pallet](/rustdocs/latest/pallet_scheduler/index.html) in its runtime.
To illustrate a runtime upgrade, let's add the Scheduler pallet to a running node.

To upgrade the runtime:

1. Open a terminal shell.

1. Start the local node in development mode by running the following command:

   ```bash
   cargo run --release -- --dev
   ```

   Leave this node running.
   You can edit and re-compile to upgrade the runtime without stopping or restarting the running node.

1. Open a second terminal shell window or tab.

1. Open the `substrate-node-template/runtime/Cargo.toml` file in a text editor.

1. Add the Scheduler pallet as a dependency.

   ```toml
   [dependencies]
   ...
   pallet-scheduler = { version = "4.0.0-dev", default-features = false, git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.18" }
   ...
   ```

1. Add the Scheduler pallet to the `features` list.

   ```toml
   [features]
   default = ["std"]
   std = [
     ...
     "pallet-scheduler/std",
     ...
   ```

1. Open the `substrate-node-template/runtime/src/lib.rs` file in a text editor.

1. Add the types required by the Scheduler pallet.

   ```rust
   parameter_types! {
     pub MaximumSchedulerWeight: Weight = 10_000_000;
     pub const MaxScheduledPerBlock: u32 = 50;
   }
   ```

1. Add the implementation for the Config trait for the Scheduler pallet.

   ```rust
   impl pallet_scheduler::Config for Runtime {
     type Event = Event;
     type Origin = Origin;
     type PalletsOrigin = OriginCaller;
     type Call = Call;
     type MaximumWeight = MaximumSchedulerWeight;
     type ScheduleOrigin = frame_system::EnsureRoot<AccountId>;
     type MaxScheduledPerBlock = MaxScheduledPerBlock;
     type WeightInfo = ();
     type OriginPrivilegeCmp = EqualPrivilegeOnly;
   }
   ```

1. Add the Scheduler pallet inside the `construct_runtime!` macro.

   ```rust
   construct_runtime!(
     pub enum Runtime where
     Block = Block,
     NodeBlock = opaque::Block,
     UncheckedExtrinsic = UncheckedExtrinsic
     {
       /*** snip ***/
       Scheduler: pallet_scheduler,
     }
   );
   ```

1. Add the following trait dependency at the top of the file:

   ```rust
   pub use frame_support::traits::EqualPrivilegeOnly;
   ```

1. Increment the [`spec_version`](/rustdocs/latest/sp_version/struct.RuntimeVersion.html#structfield.spec_version) in the `RuntimeVersion` struct](/rustdocs/latest/sp_version/struct.RuntimeVersion.html) to upgrade runtime version.

   ```rust
   pub const VERSION: RuntimeVersion = RuntimeVersion {
     spec_name: create_runtime_str!("node-template"),
     impl_name: create_runtime_str!("node-template"),
     authoring_version: 1,
     spec_version: 101,  // *Increment* this value, the template uses 100 as a base
     impl_version: 1,
     apis: RUNTIME_API_VERSIONS,
     transaction_version: 1,
   };
   ```

   Review the components of the `RuntimeVersion` struct:

   - `spec_name` specifies the name of the runtime.
   - `impl_name` specifies the name of the client.
   - `authoring_version` specifies the version for [block authors](/reference/glossary#author).
   - `spec_version` specifies the version of the runtime.
   - `impl_version` specifies the version of the client.
   - `apis` specifies the list of supported APIs.
   - `transaction_version` specfies the version of the [dispatchable function](/reference/glossary#dispatch) interface.

   To upgrade the runtime, you must _increase_ the `spec_version`.
   For more information, see the [FRAME System](https://github.com/paritytech/substrate/blob/v3.0.0/frame/system/src/lib.rs) module and `can_set_code` function.

1. Save your changes and close the `substrate-node-template/runtime/src/lib.rs` file.

1. Build the updated runtime in the second terminal window or tab without stopping the running node.

   ```shell
   cargo build --release -p node-template-runtime
   ```

   The `--release` command-line option requires a longer compile time.
   However, it generates a smaller build artifact that is better suited for submitting to the blockchain network.
   Storage optimization is _critical_ for any blockchain.
   With this command, the build artifacts are output to the `target/release` directory.

1. Connect to the local node to upgrade the runtime to use the new build artifact.

   You can use the [Polkadot-JS application](https://polkadot.js.org/apps/#/extrinsics?rpc=ws://127.0.0.1:9944) to connect to the local node.

1. Select the Alice account to submit a call to the `sudoUncheckedWeight` function and call the `setCode` function from the `system` pallet as its parameter.

   ![Select the account and functions to call](/media/images/docs/tutorials/forkless-upgrade/select-account-calls.png)

1. Select `file upload`, then select or drag and drop the WebAssembly file that you generated for the runtime.

   For example, navigate to select the `target/release/wbuild/node-template-runtime/node_template_runtime.compact.wasm` file.

   Leave the `_weight` parameter with the default of `0`.

   ![Sudo upgrade settings](/media/images/docs/tutorials/forkless-upgrade/sudo-upgrade.png)

1. Click **Submit Transaction**.

1. Review the authorization, then click **Sign and Submit**.

   After the transaction is included in a block, the version number displayed in the Polkadot-JS application indicates that the runtime version is now `101`.

   ![Update runtime version 101](/media/images/docs/tutorials/forkless-upgrade/version-101.png)

   If your local node is producing blocks in the terminal that match what is displayed in the browser, you have complete a successful runtime upgrade.

Next up, we will:

1. Upgrade your runtime version
2. Use the Scheduler pallet to schedule your runtime upgrade on your running chain

## Schedule an Upgrade

Now that the node template has been upgraded to include the Scheduler pallet,
[the `schedule` function](/rustdocs/latest/pallet_scheduler/pallet/enum.Call.html#variant.schedule)
can be used to perform the next runtime upgrade. In the previous part, the
`sudo_unchecked_weight` function was used to override the weight associated with the `set_code`
function; in this section, the runtime upgrade will be _scheduled_ so that it can be processed as
the only [extrinsic](/main-docs/fundamentals/transaction-types) in a block.

### Prepare an Upgraded Runtime

This upgrade is more straightforward than the previous one and only requires updating a single value
in `runtime/src/lib.rs` aside from the runtime's `spec_version`.

```rust
pub const VERSION: RuntimeVersion = RuntimeVersion {
 spec_name: create_runtime_str!("node-template"),
 impl_name: create_runtime_str!("node-template"),
 authoring_version: 1,
 spec_version: 102,  // *Increment* this value.
 impl_version: 1,
 apis: RUNTIME_API_VERSIONS,
 transaction_version: 1,
};

/*** snip ***/

parameter_types! {
 pub const ExistentialDeposit: u128 = 1000;  // Update this value.
 pub const MaxLocks: u32 = 50;
}

/*** snip ***/

```

This change increases the value of the Balances pallet's
[`ExistentialDeposit`](/reference/glossary#existential-deposit) - the
minimum balance needed to keep an account alive from the point-of-view of the Balances pallet.

Keep in mind that this change will _not_ cause all accounts with balances between 500 and 1000 to be reaped - that would require a [storage migration](/main-docs/build/upgrade#storage-migration/), which is out of scope for this tutorial.

### Build the upgraded runtime

```bash
cargo build --release -p node-template-runtime
```

This will _override_ any previous build artifacts! So if you want to have a copy on hand of your last runtime Wasm build files, be sure to copy them somewhere else."

### Upgrade the Runtime

In the previous section, the Scheduler pallet was configured with the `Root` origin as its
[`ScheduleOrigin`](/rustdocs/latest/pallet_scheduler/pallet/trait.Config.html#associatedtype.ScheduleOrigin),
which means that the `sudo` function (_not_ `sudo_unchecked_weight`) can be used to invoke the
`schedule` function. Use this link to open the Polkadot JS Apps UI's Sudo tab:
<https://polkadot.js.org/apps/#/sudo?rpc=ws://127.0.0.1:9944>.

Wait until all the other fields have
been filled in before providing the `when` parameter. Leave the `maybe_periodic` parameter empty and
the `priority` parameter at its default value of `0`. Select the System pallet's `set_code` function
as the `call` parameter and provide the Wasm binary as before. Leave the "with weight override"
option deactivated. Once all the other fields have been filled in, use a block number about 10
blocks (1 minute) in the future to fill in the `when` parameter and quickly submit the transaction.

![Scheduled Upgrade Panel](../../../src/images/tutorials/04-forkless-upgrade/scheduled-upgrade.png)

You can use the template node's command line output or the
[Polkadot JS Apps UI block explorer](https://polkadot.js.org/apps/#/explorer?rpc=ws://127.0.0.1:9944)
to watch as this scheduled call takes place.

![Scheduled Success Runtime Upgrade Version 102](../../../src/images/tutorials/04-forkless-upgrade/scheduled-upgrade-success.png)

After the target block has been included in the chain, the version number in the upper-left-hand
corner of Polkadot JS Apps UI should reflect that the runtime version is now `102`.

You can then observe the specific changes that were made in the upgrade by using the
[Polkadot JS Apps UI Chain State](https://polkadot.js.org/apps/#/chainstate/constants?rpc=ws://127.0.0.1:9944)
app to query the `existentialDeposit` constant value from the Balances pallet.

## Where to go next

- [Storage migrations](//main-docs/build/upgrade#storage-migrations)
<!--
- [How-to: Storage migration](/reference/how-to-guides/storage-migrations/basic-migration)
-->
