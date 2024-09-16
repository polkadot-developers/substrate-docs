---
title: Modify the runtime
description: Make simple changes to the default node template to create a custom runtime.
keywords:
---

In [Explore the code](/quick-start/explore-the-code/), you learned about the manifest files and Rust modules that make up the default node template.
Now that you have a general idea of what the runtime source code looks like, let's look at how easy it is for you to make a few simple changes to customize the runtime.

For this simple demonstration, you are going to do the following:

- Add a pallet that has some functionality you want to use.
- Change some constant values.
- Update the runtime version.
- Recompile the runtime to include your changes.
- Submit a transaction to update the runtime stored on-chain.

You'll also see another application that uses the Polkadot-JS API and how you can use the hosted version of that application to view the chain state and submit transactions.

## Before you begin

When you run a node in development mode using the `--dev` command-line option, it starts in a clean state with the first block.
To best illustrate how to modify and update the runtime, you should restart the default node template with its default runtime so that it starts producing blocks.

To restart the node with the default runtime:

1. Open a terminal shell on your computer.

2. Change to the root directory where you compiled the Substrate node template.
3. Start the local node in development mode by running the following command:

   ```bash
   cargo run --release -- --dev
   ```

After you start the node, you can connect to it using a browser-based application built using the Polkadot-JS API.

To connect to the running node:

1. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/explorer) in a Chrome or a Chromium-based browser.

   If you use a more restrictive browser—such as Firefox—you might find that connections between the Polkadot/Substrate Portal and the node are blocked.

2. Connect to the Development network and the default local node endpoint `127.0.0.1:9944`, if necessary.

   In most cases, the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/explorer) initializes the connection to the running local node automatically.
   If required, click **Unknown** to display the network selection menu, then select **Development** and **Local Node**, then click **Switch**.

3. Notice that under Development, the node template version is the default version 100.

   ![Node template default version](/media/images/docs/quickstart-100.png)

## Add a pallet

The most common way to start building with Substrate and FRAME involves adding pallets, either by importing one from the existing library or by creating your own.
Creating your own pallet from scratch isn't difficult, but it requires more work designing the application logic, storage requirements, error handling, and so on.
To keep things simple, let's add a pallet by importing one from the existing library.

By default, the node template doesn't include the [Utility pallet](https://paritytech.github.io/substrate/master/pallet_utility/index.html).
If this pallet contains functions you want to use, you can add it to the default runtime.

To add the Utility pallet:

1. Open a second terminal shell on your computer and change to the node template root directory.
2. Open the runtime manifest—`runtime/Cargo.toml` in your code editor.

3. Locate the `[dependencies]` section and add the Utility pallet as a dependency.

   For example, you should add a single line similar to the following.

   ```toml
   pallet-utility = { version = "4.0.0-dev", default-features = false, git = "https://github.com/paritytech/substrate.git", branch = "polkadot-vX.Y.Z" }
   ```
   Be sure to replace `branch = "polkadot-vX.Y.Z"` with the Polkadot branch used for other pallets.

   You can copy any existing pallet dependency as a model to ensure that the branch setting for the `pallet-utility` dependency is the same as the branch setting for all other pallets. This walkthrough uses `branch = "polkadot-v0.9.42`.

4. Locate the `[features]` section and add the Utility pallet to the list of default features for the standard binary.

   For example:

   ```toml
   [features]
   default = ["std"]
   std = [
      ...
      "pallet-utility/std",
      ...
   ]
   ```

   You'll learn more about building features for the standard and WebAssembly binaries in [Rust and WebAssembly](/build/build-process).

5. Save your changes and close the `Cargo.toml` file.

6. Open the `runtime/src/lib.rs` file in your code editor.

7. Add the implementation for the `Config` trait for the Utility pallet.

   For example:

   ```rust
   impl pallet_utility::Config for Runtime {
      type RuntimeEvent = RuntimeEvent;
      type RuntimeCall = RuntimeCall;
      type PalletsOrigin = OriginCaller;
      type WeightInfo = pallet_utility::weights::SubstrateWeight<Runtime>;
   }
   ```

   Every pallet has a `Config` trait for the specific parameters and types it requires.
   You can always look at the Rust documentation for a pallet to learn more about its configuration requirements.
   For example, you can view the Rust documentation for the [pallet-utility](https://paritytech.github.io/substrate/master/pallet_utility/index.html).

8. Add the Utility pallet inside the `construct_runtime!` macro.

   For example:

   ```rust
   construct_runtime!(
     pub struct Runtime
     where
        Block = Block,
        NodeBlock = opaque::Block,
        UncheckedExtrinsic = UncheckedExtrinsic
     {
            System: frame_system,
            RandomnessCollectiveFlip: pallet_randomness_collective_flip,
            Timestamp: pallet_timestamp,
            Aura: pallet_aura,
            ...
            Utility: pallet_utility, // Add this line
            ...
     }
   ```

   You can learn more about how the `construct_runtime` macro works in [FRAME macros](/reference/frame-macros/) and [Runtime construction macros](/reference/frame-macros/#runtime-construction-macros).

## Change constant values

By default, the Balances pallet in the node template defines an `EXISTENTIAL_DEPOSIT` constant.
The `EXISTENTIAL_DEPOSIT` represents the minimum balance that an account must have to be considered a valid active account.
By default, the constant is defined as a 128-bit unsigned integer type with a value of 500.
To keep things simple, you're going to change the value of this constant from 500 to 1000.

To update a constant value:

1. Open the `runtime/src/lib.rs` file in your code editor.

2. Locate the `EXISTENTIAL_DEPOSIT` for the Balances pallet.

   ```text
   /// Existential deposit.
   pub const EXISTENTIAL_DEPOSIT: u128 = 500;
   ```

3. Update the value for the EXISTENTIAL_DEPOSIT.

   ```rust
   pub const EXISTENTIAL_DEPOSIT: u128 = 1000 // Update this value.
   ```

## Update the runtime version

By default, the node template identifies the default runtime version in the `VERSION` constant using the `spec_version` and a value of 100.
To indicate that you've made changes to the default runtime, you're going to change the `spec_version` from 100 to 101.

Note that updating the `spec_version` isn't strictly required for the changes you've made to the default runtime in the _Quick start_.
However, by updating the version you can see the basic steps involved in performing a forkless upgrade.

To update the runtime version:

1. Open the `runtime/src/lib.rs` file in your code editor.
2. Locate the `runtime_version` macro.

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

3. Update the `spec_version` to specify the new runtime version.

   ```rust
   spec_version: 101,  // Change the spec_version from 100 to 101
   ```

4. Save your changes and close the `runtime/src/lib.rs` file.

At this point, you've modified the runtime code and changed the version information.
However, the running node is still using the previously-compiled version of the runtime.
If you are still connected to the running node using the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/explorer), you can see the node template version is still the default version 100 and the [chain state](https://polkadot.js.org/apps/#/chainstate/constants) for the balances constant existentialDeposit is still 500.

![Chain state](/media/images/docs/quickstart-org-chainstate.png)

## Recompile the runtime

Before you can update the node template to use your modified runtime, you must recompile the runtime.

To recompile the runtime package:

1. Open a second terminal shell and change to the root directory where you compiled the node template.
2. Recompile the runtime by running the following command:

   ```shell
   cargo build --release --package node-template-runtime
   ```

   The `--release` command-line option requires a longer compile time.
   However, it generates a smaller build artifact that is better suited for submitting to the blockchain network.
   Storage optimization is _critical_ for any blockchain.
   With this command, the build artifacts are output to the `target/release` directory.
   The WebAssembly build artifacts are in the `target/release/wbuild/node-template-runtime` directory.
   For example, if you list the contents of the `target/release/wbuild/node-template-runtime` directory, you should see the following WebAssembly artifacts:

   ```text
   node_template_runtime.compact.compressed.wasm
   node_template_runtime.compact.wasm
   node_template_runtime.wasm
   ```

## Submit a transaction

You now have an updated WebAssembly object that describes the modified runtime.
However, the running node isn't using the upgraded runtime yet.
To update the runtime stored on-chain, you must submit a transaction that changes the WebAssembly object to use.

To update the runtime:

1. In the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/explorer), click **Developer** and select **Extrinsics**.

2. Select the administrative **Alice** account.

3. Select the **sudo** pallet and the **sudoUncheckedWeight(call, weight)** function.
4. Select **system** and **setCode(code)** as the call to make using the Alice account.

5. Click **file upload**, then select or drag and drop the compact and compressed WebAssembly file—`node_template_runtime.compact.compressed.wasm`—that you generated for the updated runtime.

   For example, navigate to the `target/release/wbuild/node-template-runtime` directory and select `node_template_runtime.compact.compressed.wasm` as the file to upload.

6. Leave both of the **weight** parameters set to the default value of `0`.

   ![Runtime upgrade settings](/media/images/docs/tutorials/forkless-upgrade/set-code-transaction.png)

7. Click **Submit Transaction**.

8. Review the authorization, then click **Sign and Submit**.

## Verify the modified runtime

After the transaction is included in a block, you can verify that you're using the modified runtime.

To verify your changes:

1. In the [Polkadot/Substrate Portal](https://polkadot.js.org/apps), click **Network** and select **Explorer** to see that there has been a successful `sudo.Sudid` event.

   ![Successful sudo event](/media/images/docs/tutorials/forkless-upgrade/set-code-sudo-event.png)

2. Check that the node template version is now `101`.

   For example:

   ![Updated runtime version is 101](/media/images/docs/quickstart-101.png)

3. Click **Developer** and select **Extrinsics**.
4. Click **submit the following extrinsic** and scroll to the bottom of the list to verify that the **utility** pallet is available as an option.

   ![Utility pallet](/media/images/docs/quickstart-utility-pallet.png)

5. Click **Developer** , select **Chain state**, then click [Constants](https://polkadot.js.org/apps/#/chainstate/constants?rpc=ws://127.0.0.1:9944).
6. Select the **balances** pallet, select **existentialDeposit**, then click **+** to query the constant value.

   ![Verify the constant value change](/media/images/docs/quickstart-chain-state.png)

## Where to go next

After verifying the changes, you know that you have a customized version of the node template running and have successfully upgraded your local node to use your modified runtime.

That's quite an achievement, but there's a lot more you can do.
To dig deeper into concepts and core components, review topics in the [Learn](/learn/) section or start building on what you've learned so far by exploring topics in the [Build](/build/) section.
