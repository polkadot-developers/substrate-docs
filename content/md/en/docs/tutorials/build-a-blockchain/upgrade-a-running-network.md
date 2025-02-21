---
title: Upgrade a running network
description: Illustrates ways you can update a running node.
keywords:
  - forkless upgrade
  - runtime upgrade
---

Unlike many blockchains, the Substrate development framework supports **forkless upgrades** to the runtime that is the core of the blockchain.
Most blockchain projects require a [hard fork](/reference/glossary/#fork) of the code base to support ongoing development of new features or enhancements to existing features.
With Substrate, you can deploy enhanced runtime capabilities—including breaking changes—without a hard fork.
Because the definition of the runtime is itself an element in the state of a Substrate-based chain, network participants can update this value by calling the [`set_code`](https://paritytech.github.io/substrate/master/frame_system/pallet/enum.Call.html#variant.set_code) function in a transaction.
Because updates to the runtime state are validated using the blockchain's consensus mechanisms and cryptographic guarantees, network participants can use the blockchain itself to distribute updated or extended runtime logic without needing to fork the chain or release a new blockchain client.

This tutorial illustrates how to upgrade the runtime without creating a fork of the code base or stopping the progress of the chain.
In this tutorial, you'll make the following changes to a Substrate runtime on a running network node:

<!--

- Add the Scheduler pallet to the runtime.
- Submit a transaction to upload the modified runtime onto a running node.
- Use the Scheduler pallet to increase the minimum balance for network accounts.

-->

- Increase the `spec_version` of the runtime.
- Add the Utility pallet to the runtime.
- Increase the minimum balance for network accounts.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have completed [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/) and have the Substrate node template installed locally.

* You have reviewed [Add a pallet to the runtime](/tutorials/build-application-logic/add-a-pallet) for an introduction to adding a new pallet to the runtime.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Use the Sudo pallet to simulate governance for a chain upgrade.

- Upgrade the runtime for a running node to include a new pallet.

- Submit a transaction to upload the modified runtime onto a running node.

<!--

- Use the Scheduler pallet to schedule an upgrade for a runtime.

-->

## Authorize an upgrade with Sudo

Typically, runtime upgrades are managed through governance with community members voting to approve or reject upgrade proposals.
In place of governance, this tutorial uses the Sudo pallet and the `Root` origin to identify the runtime administrator with permission to upgrade the runtime.
Only this root-level administrator can update the runtime by calling the `set_code` function.
The Sudo pallet enables you to invoke the `set_code` function using the `Root` origin by specifying the account that has root-level administrative permissions.

By default, the chain specification file for the node template specifies that the `alice` development account is the owner of the Sudo administrative account.
Therefore, this tutorial uses the `alice` account to perform runtime upgrades.

### Resource accounting for runtime upgrades

Function calls that are dispatched to the Substrate runtime are always associated with a [weight](/reference/glossary/#weight) to account for resource usage.
The FRAME System module sets boundaries on the block length and block weight that these transactions can use.
However, the `set_code` function is intentionally designed to consume the maximum weight that can fit in a block.
Forcing a runtime upgrade to consume an entire block prevents transactions in the same block from executing on different versions of a runtime.

The weight annotation for the `set_code` function also specifies that the function is in the `Operational` class because it provides network capabilities.
Function calls that are identified as operational:

- Can consume the entire weight limit of a block.
- Are given maximum priority.
- Are exempt from paying transaction fees.

### Managing resource accounting

In this tutorial, the [`sudo_unchecked_weight`](https://paritytech.github.io/substrate/master/pallet_sudo/pallet/enum.Call.html#variant.sudo_unchecked_weight) function is used to invoke the `set_code` function for the runtime upgrade.
The `sudo_unchecked_weight` function is the same as the `sudo` function except that it supports an additional parameter to specify the weight to use for the call.
This parameter enables you to work around resource accounting safeguards to specify a weight of zero for the call that dispatches the `set_code` function.
This setting allows for a block to take _an indefinite time to compute_ to ensure that the runtime upgrade does not fail, no matter how complex the operation is.
It can take all the time it needs to succeed or fail.

## Add the Utility pallet to the runtime

<!--

By default, the node template doesn't include the [Scheduler pallet](https://paritytech.github.io/substrate/master/pallet_scheduler/index.html) in its runtime.
To illustrate a runtime upgrade, you can add the Scheduler pallet to a running node.

-->

By default, the node template doesn't include the [Utility pallet](https://paritytech.github.io/substrate/master/pallet_utility/index.html) in its runtime.
To illustrate a runtime upgrade, you can add the Utility pallet to a running node.

### Start the local node

This tutorial illustrates how to update a running node, so the first step is to start the local node with the current runtime.

To start the node with the current runtime:

1. Open a terminal shell on your computer.

1. Change to the root directory where you compiled the Substrate node template.
   
1. Start the previously-compiled local node in development mode by running the following command:

   ```bash
   cargo run --release -- --dev
   ```

   Leave this node running.
   You can edit and re-compile to upgrade the runtime without stopping or restarting the running node.

1. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/explorer) in a browser and connect to the local node.

1. Click the left-most dropdown menu to select the network.

   ![Select network](/media/images/docs/tutorials/forkless-upgrade/polkadot-js-select-network.png)

1. Under **Development**, select **Local Node**, then click **Switch**.

   ![Select network](/media/images/docs/tutorials/forkless-upgrade/select-local-node.png)
   
   In the upper left, notice the node template version is the default version 100.

   ![Node template version](/media/images/docs/tutorials/forkless-upgrade/default-version.png)

### Add the Utility pallet to the runtime dependencies

To update the dependencies for the runtime to include the Utility pallet:

1. Open a second terminal shell window or tab.

1. Change to the root directory where you compiled the Substrate node template.

1.  Open the `runtime/Cargo.toml` file in a text editor.

1. Locate the `[dependencies]` section.
   
   For example:

   ```rust
   [dependencies]
   codec = { package = "parity-scale-codec", version = "3.6.1", default-features = false, features = ["derive"] }
   scale-info = { version = "2.10.0", default-features = false, features = ["derive"] }
   
   pallet-aura = { git = "https://github.com/paritytech/polkadot-sdk.git", tag = "polkadot-v1.9.0", default-features = false }
   ```

1. Add the Utility pallet as a dependency.
   
   For example, add a single line with the following fields:
   
   ```rust
   pallet-utility = { git = "https://github.com/paritytech/polkadot-sdk.git", tag = "polkadot-v1.9.0", default-features = false }
   ```

1. Locate the `[features]` section and the list of the default features for the standard binary.
   
   For example:

   ```rust
   [features]
   default = ["std"]
   std = [
      "frame-try-runtime?/std",
      "frame-system-benchmarking?/std",
      "frame-benchmarking?/std",
      "codec/std",
      "scale-info/std",
   ```

1. Add the Utility pallet to the list.
   
   ```rust
   "pallet-utility/std",
   ```

1. Save your changes and close the `Cargo.toml` file.


<!--

*** When the Scheduler pallet is added back to this tutorial, slot these sections in above in place of the Utility pallet sections. ***

1. Add the Scheduler pallet to the list.
   
   ```toml
   "pallet-scheduler/std",
   ```

1. Add the Scheduler pallet as a dependency.
   
   For example, add a single line with the following fields:
   
   ```toml
   pallet-scheduler = { 
      version = "4.0.0-dev", 
      default-features = false, 
      git = "https://github.com/paritytech/polkadot-sdk.git", 
      branch = "polkadot-v1.0.0" 
   }
   ```

   Be sure to use the same **version** and **branch** information for the Scheduler pallet as you see used for the other pallets included in the runtime.
   In this example, all of the pallets in the node template runtime use `version = "4.0.0-dev"` and `branch = "polkadot-v1.0.0"`.
-->

### Add the Utility pallet configuration

<!--

To add the Scheduler types and configuration trait:



1. Open the `runtime/src/lib.rs` file in a text editor.

2. Add the following trait dependency near the top of the file:

   ```rust
   pub use frame_support::traits::EqualPrivilegeOnly;
   ```

3. Add the types required by the Scheduler pallet.

   ```rust
   parameter_types! {
      pub MaximumSchedulerWeight: Weight = Perbill::from_percent(10) * BlockWeights::get().max_block;
      pub const MaxScheduledPerBlock: u32 = 50;
   }
   ```

   Note that this definition for `MaximumSchedulerWeight` is only an example that uses a ratio to specify the weight.
   You could define the weight using specific values for execution time and storage.
   For example:
   
   ```rust
   pub MaximumSchedulerWeight: Weight = Weight::zero().set_ref_time(10).set_proof_size(10);
   ```

   or

   ```rust
   pub MaximumSchedulerWeight: Weight = Weight::from_parts(10, 10);
   ```
   
   Alternatively, you could define only one dimension for weight, for example  using a specific value for execution time:
   
   ```rust
   pub MaximumSchedulerWeight: Weight = Weight::from_ref_time(10_000_000);
   ```

-->

To add the Utility types and configuration trait:

1. Open the `runtime/src/lib.rs` file in a text editor.

1. Add the implementation for the Config trait for the Utility pallet.

   ```rust
   impl pallet_utility::Config for Runtime {
      type RuntimeEvent = RuntimeEvent;
      type RuntimeCall = RuntimeCall;
      type PalletsOrigin = OriginCaller;
      type WeightInfo = pallet_utility::weights::SubstrateWeight<Runtime>;
   }
   ```

1. Locate the `construct_runtime!` macro.

   ```rust
     #[frame_support::runtime]
     mod runtime {
         #[runtime::runtime]
         #[runtime::derive(
             RuntimeCall,
             RuntimeEvent,
             RuntimeError,
             RuntimeOrigin,
             RuntimeFreezeReason,
             RuntimeHoldReason,
             RuntimeSlashReason,
             RuntimeLockId,
             RuntimeTask
         )]
         pub struct Runtime;
   
         #[runtime::pallet_index(0)]
         pub type System = frame_system;
   ```

1. Add the Utility pallet inside the `construct_runtime!` macro.

   ```rust
        #[runtime::pallet_index(x)] //*** Change Pallet Index ***//
        pub type Utility = pallet_utility;
   ```

1. Locate the `runtime_version` macro.

   ```text
   #[sp_version::runtime_version]
   pub const VERSION: RuntimeVersion = RuntimeVersion {
        spec_name: create_runtime_str!("node-template"),
        impl_name: create_runtime_str!("node-template"),
        authoring_version: 1,
        spec_version: 100,
        impl_version: 1,
        apis: RUNTIME_API_VERSIONS,
        transaction_version: 1,
        state_version: 1,
   };
   ```

1. Update the value for the EXISTENTIAL_DEPOSIT for the Balances pallet.
   
   ```rust
   pub const EXISTENTIAL_DEPOSIT: u128 = 1000; // Update this value.
   ```
   
   This change increases the minimum balance an account is required to have on deposit to be viewed as a valid active account.
   This change doesn't remove any accounts with balances between 500 and 1000.
   Removing accounts would require a storage migration.
   For information about upgrading data storage, see [storage migration](/maintain/runtime-upgrades/#storage-migrations)

1. Increment the [`spec_version`](https://paritytech.github.io/substrate/master/sp_version/struct.RuntimeVersion.html#structfield.spec_version) to specify the new runtime version.

   ```rust
   spec_version: 101,  // Change the spec_version from 100 to 101
   ```

   The fields for the `runtime_version` specify the following information:

   - `spec_name` specifies the name of the runtime.
   - `impl_name` specifies the name of the outer node client.
   - `authoring_version` specifies the version for [block authors](/reference/glossary#author).
   - `spec_version` specifies the version of the runtime.
   - `impl_version` specifies the version of the outer node client.
   - `apis` specifies the list of supported APIs.
   - `transaction_version` specifies the version of the [dispatchable function](/reference/glossary#dispatch) interface.
   - `state_version` specifies the version of the key-value trie data structure that the runtime uses.

   To upgrade the runtime, you must _increase_ the `spec_version`.
   For more information, see the [FRAME System](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/system/src/lib.rs) module and the `can_set_code` method.

1.  Save your changes and close the `runtime/src/lib.rs` file.

<!--

*** When the Scheduler pallet is added back into the tutorial, replace the relevant Utility pallet steps with the Scheduler pallet steps. ***

1. Add the implementation for the Config trait for the Scheduler pallet.

   ```rust
   impl pallet_scheduler::Config for Runtime {
      type RuntimeEvent = RuntimeEvent;
      type RuntimeOrigin = RuntimeOrigin;
      type PalletsOrigin = OriginCaller;
      type RuntimeCall = RuntimeCall;
      type MaximumWeight = MaximumSchedulerWeight;
      type ScheduleOrigin = frame_system::EnsureRoot<AccountId>;
      type MaxScheduledPerBlock = MaxScheduledPerBlock;
      type WeightInfo = ();
      type OriginPrivilegeCmp = EqualPrivilegeOnly;
      type Preimages = ();
   }
   ```

1. Add the Scheduler pallet inside the `construct_runtime!` macro.

   ```rust
   Scheduler: pallet_scheduler,
   ```

-->

### Recompile and connect to the local node

1. Verify that the local node continues to run in the first terminal.
   
1. In the second terminal where you updated the runtime `Cargo.toml` and `lib.rs` files, recompile the runtime by running the following command

   ```shell
   cargo build --release --package node-template-runtime
   ```

   The `--release` command-line option requires a longer compile time.
   However, it generates a smaller build artifact that is better suited for submitting to the blockchain network.
   Storage optimization is _critical_ for any blockchain.
   With this command, the build artifacts are output to the `target/release` directory.
   The WebAssembly build artifacts are in the `target/release/wbuild/node-template-runtime` directory.
   For example, you should see the following WebAssembly artifacts:

   ```text
   node_template_runtime.compact.compressed.wasm
   node_template_runtime.compact.wasm
   node_template_runtime.wasm
   ```

## Execute a runtime upgrade

You now have a WebAssembly artifact that describes the modified runtime logic.
However, the running node isn't using the upgraded runtime yet.
To complete the upgrade, you need to submit a transaction that updates the node to use the upgraded runtime.

To update the network with the upgraded runtime:

1. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/explorer) in a browser and connect to the local node.

1. Click **Developer** and select **Extrinsics** to submit a transaction for the runtime to use the new build artifact.

1. Select the administrative **Alice** account.

1. Select the **sudo** pallet and the **sudoUncheckedWeight(call, weight)** function.
   
1. Select **system** and **setCode(code)** as the call to make using the Alice account.

1. Click **file upload**, then select or drag and drop the compact and compressed WebAssembly file—`node_template_runtime.compact.compressed.wasm`—that you generated for the updated runtime.

   For example, navigate to the `target/release/wbuild/node-template-runtime` directory and select `node_template_runtime.compact.compressed.wasm` as the file to upload.

1. Leave both of the **weight** parameters set to the default value of `0`.

   ![Runtime upgrade settings](/media/images/docs/tutorials/forkless-upgrade/set-code-transaction.png)

1. Click **Submit Transaction**.

1. Review the authorization, then click **Sign and Submit**.

1. Click **Network** and select **Explorer** to see that there has been a successful `sudo.Sudid` event.
   
   ![Successful sudo event](/media/images/docs/tutorials/forkless-upgrade/set-code-sudo-event.png)   

   After the transaction is included in a block, the node template version number indicates that the runtime version is now `101`.
   For example:

   ![Updated runtime version is 101](/media/images/docs/tutorials/forkless-upgrade/runtime-version-101.png)

   If your local node is producing blocks in the terminal that match what is displayed in the browser, you have completed a successful runtime upgrade.

1. Click **Developer** and select **Extrinsics**. Click on *submit the following extrinsic* and scroll to the bottom of the list. You will see **utility** as an option.
   
<!--

## Schedule an upgrade

In the previous upgrade example, you used the `sudo_unchecked_weight` function to skip the accounting safeguards that limit block length and weight to allow the `set_code` function call to take as long as necessary to complete the runtime upgrade.
Now that you have updated the node template to include the Scheduler pallet, however, you can perform a **scheduled** runtime upgrade. 
A scheduled runtime upgrade ensures that the `set_code` function call is the only transaction included in a block.

NOTE: The Scheduler pallet has been recently modified to meter its own weight consumption. 
However, the `set_code` function as it is currently written is intended to consume a full block.
Because the Scheduler now deducts its own weight from the full block, attempting to execute the scheduled upgrade as described in this part of the tutorial will fail with an `Exhausted` dispatch error because the block weight would exceed the weight allowed.
Therefore, you can't currently upgrade the runtime as a scheduled task.

### Prepare an upgraded runtime

In the previous upgrade example, you added a whole new pallet to the runtime.
This upgrade example is more straightforward and only requires updating values that already exist
in the `runtime/src/lib.rs` file.
For this upgrade example, you are going to increase the minimum balance required for network accounts.
This minimum balance—called an [existential deposit](/reference/glossary#existential-deposit)—is a constant in the runtime and has a value of 500 in the node template by default.

To modify the value of the existential deposit for a runtime upgrade:

1. Verify that the local node continues to run in the first terminal.

1. Open a second terminal shell window or tab.

1. Change to the root directory where you compiled the Substrate node template.

3. Open the `runtime/src/lib.rs` file in a text editor.

1. Update the `spec_version` for the runtime to 102.
   
   ```rust
   pub const VERSION: RuntimeVersion = RuntimeVersion {
      spec_name: create_runtime_str!("node-template"),
      impl_name: create_runtime_str!("node-template"),
      authoring_version: 1,
      spec_version: 102,  // Increment this value.
      impl_version: 1,
      apis: RUNTIME_API_VERSIONS,
      transaction_version: 1,
      state_version: 1,
   };

1. Update the value for the EXISTENTIAL_DEPOSIT for the Balances pallet.
   
   ```rust
   pub const EXISTENTIAL_DEPOSIT: u128 = 1000 // Update this value.
   ```
   
   This change increases the minimum balance an account is required to have on deposit to be viewed as a valid active account.
   This change doesn't remove any accounts with balances between 500 and 1000.
   Removing accounts would require a storage migration.
   For information about upgrading data storage, see [storage migration](/maintain/runtime-upgrades/#storage-migrations)

1. Save your changes and close the `runtime/src/lib.rs` file.

1. Build the upgraded runtime by running the following command:
   
   ```bash
   cargo build --release --package node-template-runtime
   ```
   
   This command generates a new set of build artifacts, overwriting the previous set of build artifacts.
   If you want to save the previous set of artifacts, copy them to another location before compiling the node template.

1. Verify the WebAssembly build artifacts are in the `target/release/wbuild/node-template-runtime` directory.

### Submit a transaction to schedule the upgrade

You now have a WebAssembly artifact that describes the modified runtime logic.
The Scheduler pallet is configured with the `Root` origin as its [`ScheduleOrigin`](https://paritytech.github.io/substrate/master/pallet_scheduler/pallet/trait.Config.html#associatedtype.ScheduleOrigin).
With this configuration, you can use the `sudo` function—not_ `sudo_unchecked_weight`—to invoke the `schedule` function.

To schedule the runtime upgrade:

1. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/explorer) in a browser and connect to the local node.

2. Click **Developer** and select **Sudo**.

3. Select **scheduler** and **schedule(when, maybePeriodic, priority, call)**.

   - Notice that the **when** parameter specifies a block number for performing the scheduled operation.
   - The **maybePeriodic** parameter is optional, so you can use the default value (empty)
   - Use the default value (0) for the **priority**  parameter.
   - Select **system** and **setCode(code)** as the call.
   - Click **file upload** and select the compressed WebAssembly file you generated for the updated runtime.

4. Check the current block number and set the **when** parameter to a block number 10 to 20 blocks from the current block, then click **Submit Sudo**.
   
   ![Settings to schedule a runtime upgrade](/media/images/docs/tutorials/forkless-upgrade/sudo-scheduler-upgrade.png)

5. Review the authorization and click **Sign and Submit**.

6. Monitor block production in the terminal or the [Network Explorer](https://polkadot.js.org/apps/#/explorer?rpc=ws://127.0.0.1:9944) to watch as this scheduled call takes place.
   
   After the target block has been included in the chain, the node template version number indicates that the runtime version is now `102`.

-->

1. Verify the constant value by querying the chain state in the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/chainstate/constants?rpc=ws://127.0.0.1:9944).
   
   - Click **Developer** and select **Chain state**.
   - Click **Constants**.
   - Select the **balances** pallet.
   - Select **existentialDeposit** as the constant value as the value to query.

   ![Verify the constant value change](/media/images/docs/tutorials/forkless-upgrade/constant-value-lookup.png)
   
## Where to go next

- [Runtime version 101](/assets/tutorials/runtime-upgrade/lib-spec-version-101.rs)
- [Runtime version 102](/assets/tutorials/runtime-upgrade/lib-spec-version-102.rs)
- [Storage migrations](/maintain/runtime-upgrades/#storage-migration)

<!-- - [How-to: Storage migration](/reference/how-to-guides/basics/storage-migration/) -->
