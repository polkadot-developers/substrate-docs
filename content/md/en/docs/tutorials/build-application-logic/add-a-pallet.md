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
For this tutorial, you'll add the [Nicks pallet](https://paritytech.github.io/substrate/master/pallet_nicks/index.html) to the runtime for the node template, so you'll see how to configure the settings that are specific to the Nicks pallet.
The Nicks pallet allows blockchain users to pay a deposit to reserve a nickname for an account they control. It implements the following functions:

- The `set_name` function to collect a deposit and set the name of an account if the name is not already taken.
- The `clear_name` function to remove the name associated with an account and return the deposit.
- The `kill_name` function to forcibly remove an account name without returning the deposit.

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

## Add the Nicks pallet dependencies

Before you can use a new pallet, you must add some information about it to the configuration file that the compiler uses to build the runtime binary.

For Rust programs, you use the `Cargo.toml` file to define the configuration settings and dependencies that determine what gets compiled in the resulting binary.
Because the Substrate runtime compiles to both a native platform binary that includes standard library Rust functions and a [WebAssembly (Wasm)](https://webassembly.org/) binary that does not include the standard Rust library, the `Cargo.toml` file controls two important pieces of information:

- The pallets to be imported as dependencies for the runtime, including the location and version of the pallets to import.
- The features in each pallet that should be enabled when compiling the native Rust binary. By enabling the standard (`std`) feature set from each pallet, you can compile the runtime to include functions, types, and primitives that would otherwise be missing when you build the WebAssembly binary.

For information about adding dependencies in `Cargo.toml` files, see [Dependencies](https://doc.rust-lang.org/cargo/guide/dependencies.html) in the Cargo documentation.
For information about enabling and managing features from dependent packages, see [Features](https://doc.rust-lang.org/cargo/reference/features.html) in the Cargo documentation.

To add the dependencies for the Nicks pallet to the runtime:

1. Open a terminal shell and change to the root directory for the node template.

1. Open the `runtime/Cargo.toml` configuration file in a text editor.

1. Locate the [dependencies] section and note how other pallets are imported.

1. Copy an existing pallet dependency description and replace the pallet name with `pallet-nicks` to make the pallet available to the node template runtime.

   For example, add a line similar to the following:

   ```toml
   pallet-nicks = { version = "4.0.0-dev", default-features = false, git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v1.0.0" }
   ```

   This line imports the `pallet-nicks` crate as a dependency and specifies the following:

   - Version to identify which version of the crate you want to import.
   - The default behavior for including pallet features when compiling the runtime with the standard Rust libraries.
   - Repository location for retrieving the `pallet-nicks` crate.
   - Branch to use for retrieving the crate. Be sure to use the same **version** and **branch** information for the Nicks pallet as you see used for the other pallets included in the runtime.

   These details should be the same for every pallet in any given version of the node template.

1. Add the `pallet-nicks/std` features to the list of `features` to enable when compiling the runtime.

   ```toml
   [features]
   default = ["std"]
   std = [
      ...
      "pallet-aura/std",
      "pallet-balances/std",
      "pallet-nicks/std",
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
For example, to see what you need to implement for the `nicks` pallet, you can refer to the Rust documentation for [`pallet_nicks::Config`](https://paritytech.github.io/substrate/master/pallet_nicks/pallet/trait.Config.html) or the trait definition in the [Nicks pallet source code](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/nicks/src/lib.rs).

For this tutorial, you can see that the `Config` trait in the `nicks` pallet declares the following types:

```rust
pub trait Config: Config {
    type RuntimeEvent: From<Event<Self>> + IsType<<Self as Config>::RuntimeEvent>;
    type Currency: ReservableCurrency<Self::AccountId>;
    type ReservationFee: Get<<<Self as Config>::Currency as Currency<<Self as Config>::AccountId>>::Balance>;
    type Slashed: OnUnbalanced<<<Self as Config>::Currency as Currency<<Self as Config>::AccountId>>::NegativeImbalance>;
    type ForceOrigin: EnsureOrigin<Self::RuntimeOrigin>;
    type MinLength: Get<u32>;
    type MaxLength: Get<u32>;
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

## Implement the configuration for Nicks

Now that you have seen an example of how the `Config` trait is implemented for the Balances pallet, you're ready to implement the `Config` trait for the Nicks pallet.

To implement the `nicks` pallet in your runtime:

1. Open the `runtime/src/lib.rs` file in a text editor.

1. Locate the last line of the Balances code block.

1. Add the following code block for the Nicks pallet:

   ```rust
   impl pallet_nicks::Config for Runtime {
    // The Balances pallet implements the ReservableCurrency trait.
    // `Balances` is defined in `construct_runtime!` macro.
    type Currency = Balances;

    // Set ReservationFee to a value.
    type ReservationFee = ConstU128<100>;

    // No action is taken when deposits are forfeited.
    type Slashed = ();

    // Configure the FRAME System Root origin as the Nick pallet admin.
    // https://paritytech.github.io/substrate/master/frame_system/enum.RawOrigin.html#variant.Root
    type ForceOrigin = frame_system::EnsureRoot<AccountId>;

    // Set MinLength of nick name to a desired value.
    type MinLength = ConstU32<8>;

    // Set MaxLength of nick name to a desired value.
    type MaxLength = ConstU32<32>;

    // The ubiquitous event type.
    type RuntimeEvent = RuntimeEvent;
   }

1. Add Nicks to the `construct_runtime!` macro.

   For example:

   ```rust
   construct_runtime!(
   pub enum Runtime where
       Block = Block,
       NodeBlock = opaque::Block,
       UncheckedExtrinsic = UncheckedExtrinsic
     {
       /* --snip-- */
       Balances: pallet_balances,

       /*** Add This Line ***/
       Nicks: pallet_nicks,
     }
   );
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

After your node compiles, you are ready to start the node that has been enhanced with nickname capabilities from the [Nicks pallet](https://paritytech.github.io/substrate/master/pallet_nicks/index.html) and interact with it using the front-end template.

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

Now that you have added a new pallet to your runtime, you can use the [Substrate front-end template](/tutorials/build-a-blockchain/build-local-blockchain/#install-the-front-end-template) to interact with the node template and access the Nicks pallet.

To start the front-end template:

1. Open a new terminal shell on your computer.

1. In the new terminal, change to the root directory where you installed the front-end template.

1. Start the web server for the front-end template by running the following command:

   ```bash
   yarn start
   ```

1. Open `http://localhost:8000/` in a browser to view the front-end template.

## Set a nickname using the Nicks pallet

After you start the front-end template, you can use it to interact with the Nicks pallet you just added to the runtime.

To set a nickname for an account:

1. Check the account selection list to verify that the Alice account is currently selected.

1. In the Pallet Interactor component, verify that **Extrinsic** is selected.

2. Select **nicks** from the list of pallets available to call.

3. Select [**setName**](https://paritytech.github.io/substrate/master/pallet_nicks/pallet/enum.Call.html#variant.set_name) as the function to call from the nicks pallet.

4. Type a **name** that is longer than the `MinNickLength` (8 characters) and no longer than the `MaxNickLength` (32 characters).

   ![Select the pallet and the function to call](/media/images/docs/tutorials/add-a-pallet/set-name-function.png)

5. Click **Signed** to execute the function.

6. Observe the status of the call change from Ready to InBlock to Finalized and the note the [events](https://paritytech.github.io/substrate/master/pallet_nicks/pallet/enum.Event.html) emitted by the Nicks pallet.

   ![Successful update to the nickname for Alice](/media/images/docs/tutorials/add-a-pallet/set-name-result.png)

## Query information for an account using the Nicks pallet

Next, you can use Query capability to read the value of Alice's nickname from the runtime storage for the Nicks pallet.

To return the information stored for Alice:

1. In the Pallet Interactor component, select **Query** as the Interaction Type.

1. Select **nicks** from the list of pallets available to query.

1. Select [**nameOf**](https://paritytech.github.io/substrate/master/pallet_nicks/pallet/enum.Call.html#variant.set_name) as the function to call.

1. Copy and paste the address for the **alice** account in the AccountId field, then click **Query**.

   ![Read a name](/media/images/docs/tutorials/add-a-pallet/Alice-query-result.png)

   The return type is a tuple that contains two values:

   - The hex-encoded nickname for the Alice account `53756273747261746520737570657273746172202d20416c696365`.
    If you convert the hex-encoded value to a string, you'll see the name you specified for the `setName` function.
   - The amount that was reserved from Alice's account to secure the nickname (`100`).

   If you were to query the Nicks pallet for the `nameOf` for Bob's account, you would see the value `None` returned because Bob has not invoked the `setName` function to reserve a nickname.

## Explore additional functions

This tutorial illustrates how to add a simple pallet to the runtime and demonstrates how to interact with the new pallet using the predefined front-end template.
In this case, you added the `nicks` pallet to the runtime and called the `set_name` and `nameOf` functions using the front-end template.
The `nicks` pallet also provides two additional functions—the `clear_name` function and the `kill_name` function—that enable an account owner to remove the reserved name or a root-level user to forcibly remove an account name.
You can learn about additional features—such as the use of the Sudo pallet and origin accounts—by exploring how these functions work.
However, these features are beyond the intended scope of this tutorial.
If you want to explore additional features exposed through the Nicks and Sudo pallets, see [Next steps](#next-steps) and select [Specify the origin for a call](/tutorials/build-application-logic/specify-the-origin-for-a-call).

## Next steps

There are several [tutorials](/tutorials/) that can serve as next steps for learning more about Substrate development.

- [Specify the origin for a call](/tutorials/build-application-logic/specify-the-origin-for-a-call) explores calling functions using different originating accounts.
- [Develop smart contracts](/tutorials/smart-contracts/) guide you through using ink! to build smart contracts.
- [Use macros in a custom pallet](/tutorials/build-application-logic/use-macros-in-a-custom-pallet) illustrates how you can use macros to create your own pallets.
