---
title: Add a pallet to the runtime
description: Demonstrates the basic steps for adding a simple pallet to the runtime for the Substrate node template.
keywords:
  - runtime
  - FRAME
  - pallets
  - dependencies
  - Nicks
  - configuration
---

As you saw in [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/), the [Substrate node template](https://github.com/substrate-developer-hub/substrate-node-template) provides a working **runtime** that includes some default FRAME development modules—**pallets**—to get you started building a custom blockchain.

This tutorial introduces the basic steps for adding a new pallet to the runtime for the node template.
The steps are similar any time you want to add a new FRAME pallet to the runtime.
However, each pallet requires specific configuration settings—for example, the specific parameters and types required to perform the functions that the pallet implements.
For this tutorial, you'll add the [Lottery pallet](https://paritytech.github.io/polkadot-sdk/master/pallet_lottery/) to the runtime for the node template, so you'll see how to configure the settings that are specific to the Lottery pallet.
The Lottery pallet allows blockchain users, just like a normal lottery system, to "buy a ticket", which is used to fund the pot. Then, is reallocated to a single user. 

Note that this tutorial is a stepping stone to more advanced tutorials that illustrate how to add pallets with more complex configuration settings, how to create custom pallets, and how to publish pallets.

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have completed the [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/) tutorial and have the Substrate node template from the Developer Hub installed locally.

- You are generally familiar with software development and using command-line interfaces.

- You are generally familiar with blockchains and smart contract platforms.

## Tutorial objectives

By completing this tutorial, you will use the Nicks pallet to accomplish the following objectives:

- Learn how to update runtime dependencies to include a new pallet.

- Learn how to configure a pallet-specific Rust trait.

- See changes to the runtime by interacting with the new pallet using the front-end template.

## Add the Lottery pallet dependencies

Before you can use a new pallet, you must add some information about it to the configuration file that the compiler uses to build the runtime binary.

For Rust programs, you use the `Cargo.toml` file to define the configuration settings and dependencies that determine what gets compiled in the resulting binary.
Because the Substrate runtime compiles to both a native platform binary that includes standard library Rust functions and a [WebAssembly (Wasm)](https://webassembly.org/) binary that does not include the standard Rust library, the `Cargo.toml` file controls two important pieces of information:

- The pallets to be imported as dependencies for the runtime, including the location and version of the pallets to import.
- The features in each pallet that should be enabled when compiling the native Rust binary. By enabling the standard (`std`) feature set from each pallet, you can compile the runtime to include functions, types, and primitives that would otherwise be missing when you build the WebAssembly binary.

For information about adding dependencies in `Cargo.toml` files, see [Dependencies](https://doc.rust-lang.org/cargo/guide/dependencies.html) in the Cargo documentation.
For information about enabling and managing features from dependent packages, see [Features](https://doc.rust-lang.org/cargo/reference/features.html) in the Cargo documentation.

To add the dependencies for the Lottery pallet to the runtime:

1. Open a terminal shell and change to the root directory for the node template.

1. Open the `runtime/Cargo.toml` configuration file in a text editor.

1. Locate the [dependencies] section and note how other pallets are imported.

1. Copy an existing pallet dependency description and replace the pallet name with `pallet-lottery` to make the pallet available to the node template runtime.

   For example, add a line similar to the following:

   ```toml
   pallet-lottery = { git = "https://github.com/paritytech/polkadot-sdk.git", tag = "polkadot-v1.9.0", default-features = false }
   ```

   This line imports the `pallet-lottery` crate as a dependency and specifies the following:

   - Version to identify which version of the crate you want to import.
   - The default behavior for including pallet features when compiling the runtime with the standard Rust libraries.
   - Repository location for retrieving the `pallet-lottery` crate.
   - Tag to use for retrieving the crate. Be sure to use the same **version** and **tag** information for the Nicks pallet as you see used for the other pallets included in the runtime.

   These details should be the same for every pallet in any given version of the node template.

1. Add the `pallet-lottery/std` features to the list of `features` to enable when compiling the runtime.

   ```toml
   [features]
   default = ["std"]
   std = [
      ...
      "pallet-aura/std",
      "pallet-balances/std",
      "pallet-lottery/std",
      ...
   ]
   ```

   This section specifies the default feature set to compile for this runtime is the `std` features set.
   When the runtime is compiled using the `std` feature set, the `std` features from all of the pallets listed as dependencies are enabled.
   For more detailed information about how the runtime is compiled as a platform-native binary with the standard Rust library and as a WebAssembly binary using the `no_std` attribute, see [Build process](/build/build-process/).

   If you forget to update the `features` section in the `Cargo.toml` file, you might see `cannot find function` errors when you compile the runtime binary.

2. Check that the new dependencies resolve correctly by running the following command:

   ```bash
   cargo check -p node-template-runtime --release
   ```

## Review the configuration for Balances

Every pallet has a [Rust **trait**](https://doc.rust-lang.org/book/ch10-02-traits.html) called `Config`.
The `Config` trait is used to identify the parameters and types that the pallet needs to carry out its functions.

Most of the pallet-specific code required to add a pallet is implemented using the `Config` trait.
You can review what you to need to implement for any pallet by referring to its Rust documentation or the source code for the pallet.
For example, to see what you need to implement for the `Lottery` pallet, you can refer to the trait definition in the [Lottery pallet source code](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/lottery/src/lib.rs).

For this tutorial, you can see that the `Config` trait in the `lottery` pallet declares the following types:

```rust
pub trait Config: frame_system::Config {
   type PalletId: Get<PalletId>;
   type RuntimeCall: Parameter
      + Dispatchable<RuntimeOrigin = Self::RuntimeOrigin>
      + GetDispatchInfo
      + From<frame_system::Call<Self>>;
   type Currency: ReservableCurrency<Self::AccountId>;
   type Randomness: Randomness<Self::Hash, BlockNumberFor<Self>>;
   type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
   type ManagerOrigin: EnsureOrigin<Self::RuntimeOrigin>;
   type MaxCalls: Get<u32>;
   type ValidateCall: ValidateCall<Self>;
   type MaxGenerateRandom: Get<u32>;
   type WeightInfo: WeightInfo;
}
```

After you identify the types your pallet requires, you need to add code to the runtime to implement the `Config` trait.
To see how to implement the `Config` trait for a pallet, let's use the **Balances** pallet as an example.

To review the `Config` trait for the Balances pallet:

1. Open the `runtime/src/lib.rs` file in a text editor.

1. Locate the `Balances` pallet and note that it consists of the following implementation (`impl`)code block:

   ```text
   pub type Balance = u128;

   // ...

   /// Existential deposit.
   pub const EXISTENTIAL_DEPOSIT: u128 = 500;

   impl pallet_balances::Config for Runtime {
      type MaxLocks = ConstU32<50>;
      type MaxReserves = ();
      type ReserveIdentifier = [u8; 8];
      /// The type for recording an account's balance.
      type Balance = Balance;
      /// The ubiquitous event type.
      type RuntimeEvent = RuntimeEvent;
      /// The empty value, (), is used to specify a no-op callback function.
      type DustRemoval = ();
      /// Set the minimum balanced required for an account to exist on-chain
      type ExistentialDeposit = ConstU128<EXISTENTIAL_DEPOSIT>;
      /// The FRAME runtime system is used to track the accounts that hold balances.
      type AccountStore = System;
      /// Weight information is supplied to the Balances pallet by the node template runtime.
      type WeightInfo = pallet_balances::weights::SubstrateWeight<Runtime>;
   }
   ```

   As you can see in this example, the `impl pallet_balances::Config` block allows you to configure the types and parameters that are specified by the Balances pallet `Config` trait.
   For example, this `impl` block configures the Balances pallet to use the `u128` type to track balances.

## Implement the configuration for Lottery

Now that you have seen an example of how the `Config` trait is implemented for the Balances pallet, you're ready to implement the `Config` trait for the Nicks pallet.

To implement the `lottery` pallet in your runtime:

1. Open the `runtime/src/lib.rs` file in a text editor.

1. Locate the last line of the Balances code block.

1. Before adding Lottery pallet's config, `pallet_random_collective_flip` is instantiated as `RandomnessCollectiveFlip`. For more information, you can see [Incorporate randomness](https://docs.substrate.io/reference/how-to-guides/pallet-design/incorporate-randomness/). Note that add `pallet_random_collective_flip` in `runtime/Cargo.toml` as above.

   ```rust
   impl pallet_insecure_randomness_collective_flip::Config for Runtime {}
   ```

1. Add the following code block for the Lottery pallet:

   ```rust
   parameter_types! {
      pub const LotteryPalletId: PalletId = PalletId(*b"py/lotto");
      pub const MaxCalls: u32 = 10;
      pub const MaxGenerateRandom: u32 = 10;
   }

   impl pallet_lottery::Config for Runtime {
      type PalletId = LotteryPalletId;
      type RuntimeCall = RuntimeCall;
      type Currency = Balances;
      type Randomness = RandomnessCollectiveFlip;
      type RuntimeEvent = RuntimeEvent;
      type ManagerOrigin = EnsureRoot<AccountId>;
      type MaxCalls = MaxCalls;
      type ValidateCall = Lottery;
      type MaxGenerateRandom = MaxGenerateRandom;
      type WeightInfo = pallet_lottery::weights::SubstrateWeight<Runtime>;
   }
   ```

1. Add Lottery to the `runtime` module.

   For example:

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
      ...

      #[runtime::pallet_index(8)]
      pub type Lottery = pallet_lottery;

      #[runtime::pallet_index(9)]
      pub type RandomnessCollectiveFlip = pallet_insecure_randomness_collective_flip;
   }
   ```

1. Save your changes and close the file.

2. Check that the new dependencies resolve correctly by running the following command:

   ```bash
   cargo check -p node-template-runtime --release
   ```

   If there are no errors, you are ready to compile.

3. Compile the node in release mode by running the following command:

   ```bash
   cargo build --release
   ```

## Start the blockchain node

After your node compiles, you are ready to start the node that has been enhanced with lanch a lottery from the [Lottery pallet](https://paritytech.github.io/polkadot-sdk/master/pallet_lottery/) and interact with it using the front-end template.

To start the local Substrate node:

1. Open a terminal shell, if necessary.

1. Change to the root directory of the Substrate node template.

1. Start the node in development mode by running the following command:

   ```bash
   ./target/release/node-template --dev
   ```

   In this case, the `--dev` option specifies that the node runs in developer mode using the predefined `development` chain specification.
   By default, this option also deletes all active data—such as keys, the blockchain database, and networking information—when you stop the node by pressing Control-c.
   Using the `--dev` option ensures that you have a clean working state any time you stop and restart the node.

1. Verify your node is up and running successfully by reviewing the output displayed in the terminal.

   If the number after `finalized` is increasing in the console output, your blockchain is producing new blocks and reaching consensus about the state they describe.

1. Keep the terminal that displays the node output open to continue.

## Start the front-end template

Now that you have added a new pallet to your runtime, you can use the [Substrate front-end template](/tutorials/build-a-blockchain/build-local-blockchain/#install-the-front-end-template) or [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944) (used in this tutorial) to interact with the node template and access the Lottery pallet.

To start the front-end template:

1. Open a new terminal shell on your computer.

1. In the new terminal, change to the root directory where you installed the front-end template.

1. Start the web server for the front-end template by running the following command:

   ```bash
   yarn start
   ```

1. Open `http://localhost:8000/` in a browser to view the front-end template.

## Launch a lottery using the Lottery pallet

After you start the front-end template, you can use it to interact with the Lottery pallet you just added to the runtime.

To set startLottery's parameters:

1. According to our configuration, we need to have administrative privileges. In the `Developer` menu, verify that **Sudo** is selected.

2. Select **lottery** from the list of pallets available to call.

3. Select **startLottery** as the function to call from the lottery pallet.

4. Set up a new lottery by filling up the 4 parameters:

   - `price`: The cost of a single ticket.
   - `length`: How long the lottery should run for starting at the current block.
   - `delay`: How long after the lottery end we should wait before picking a winner.
   - `repeat`: If the lottery should repeat when completed.

   ![Select the pallet and the function to call](/media/images/docs/tutorials/add-a-pallet/start-lottery-function.png)

5. Click **Submit Sudo** to execute the function.

6. Observe the status of the call change from Ready to InBlock to Finalized and the note the events emitted by the Lottery pallet.

   ![Successfully select winner](/media/images/docs/tutorials/add-a-pallet/start-lottery-result.png)

## Explore additional functions

This tutorial illustrates how to add a simple pallet to the runtime and demonstrates how to interact with the new pallet using the predefined front-end template.
In this case, you added the `lottery` pallet to the runtime and called the `start_lottery` functions using the front-end template.
The `lottery` pallet also provides other functions like the `stop_repeat` function. 
You can learn about additional features—such as giving Alice account the Sudo privileges.
However, these features are beyond the intended scope of this tutorial.
If you want to explore additional features exposed through the Lottery and Sudo pallets, see [Next steps](#next-steps) and select [Specify the origin for a call](/tutorials/build-application-logic/specify-the-origin-for-a-call).

## Next steps

There are several [tutorials](/tutorials/) that can serve as next steps for learning more about Substrate development.

- [Specify the origin for a call](/tutorials/build-application-logic/specify-the-origin-for-a-call) explores calling functions using different originating accounts.
- [Develop smart contracts](/tutorials/smart-contracts/) guide you through using ink! to build smart contracts.
- [Use macros in a custom pallet](/tutorials/build-application-logic/use-macros-in-a-custom-pallet) illustrates how you can use macros to create your own pallets.
