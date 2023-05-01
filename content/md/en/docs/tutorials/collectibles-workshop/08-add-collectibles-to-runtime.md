---
title: Add collectibles to the runtime
description:
tutorial:
---

You now have a custom pallet with the basic functions for trading digital collectibles.
The next step is to add this pallet to the runtime to expose its functionality on the blockchain.
Before you do that, however, take a moment to verify that you included the Collectibles pallet in the manifest for the node as instructed in [Add the pallet to the workspace](/tutorials/collectibles-workshop/03-create-pallet/#add-the-pallet-to-the-workspace).

To check the manifest for the workspace:

1. Open a new terminal, if needed.
   
2. Change to the `workshop-node-template` directory in your workspace.

3. View the contents of the Cargo.toml file for your node workspace.
   
   ```bash
   more Cargo.toml
   ```

   You should see the Collectibles pallet listed as a member of the workspace.
   For example:

   ```toml
   [workspace]
   members = [
        "node",
        "pallets/collectibles",
        "pallets/template",
        "runtime",
   ]
   [profile.release]
   panic = "unwind"
   ```

   If the Collectibles pallet is included, you're ready to update the runtime.

## Update runtime files

To add the collectibles pallet to the runtime:

1. Open the `runtime/Cargo.toml` file in your code editor and add the Collectibles pallet to the local dependencies and standard features for the runtime.
   
   For example:

   ```toml
   # Local Dependencies
   pallet-template = { version = "4.0.0-dev", default-features = false, path = "../pallets/template" }
   collectibles = { default-features = false, path = "../pallets/collectibles" }

   [features]
   default = ["std"]
   std = [
   ...
        "collectibles/std",
   ...
   ```

1. Save your changes.
   
1. Open `runtime/src/lib.rs`.

1. Import the Collectibles pallet into the runtime.

   ```rust
   /// Import the Collectibles pallet.
   pub use collectibles;
   ```

1. Implement the configuration trait for the collectibles pallet.
   
   ```rust
   impl collectibles::Config for Runtime {
        type RuntimeEvent = RuntimeEvent;
        type Currency = Balances;
        type CollectionRandomness = RandomnessCollectiveFlip;
        type MaximumOwned = frame_support::pallet_prelude::ConstU32<100>;
   }
   ```

1. Add the pallet to the `construct_runtime!` macro.
   
   ```rust
   construct_runtime!(
        pub struct Runtime
        where
            Block = Block,
            NodeBlock = opaque::Block,
            UncheckedExtrinsic = UncheckedExtrinsic,
        {
            System: frame_system,
            RandomnessCollectiveFlip: pallet_randomness_collective_flip,
            Timestamp: pallet_timestamp,
            Aura: pallet_aura,
            Grandpa: pallet_grandpa,
            Balances: pallet_balances,
            TransactionPayment: pallet_transaction_payment,
            Sudo: pallet_sudo,
            TemplateModule: pallet_template,
            Collectibles: collectibles,
        }
   );
   ```

1. Compile the blockchain node with the updated runtime by running the following command:
   
   ```bash
   cargo build --release
   ```

   After the node compiles, your custom pallet is ready for action.

## Access the Collectibles pallet

Now that you have a freshly compiled node, you can restart the blockchain and use your new pallet.

1. Start the blockchain node by running the following command:
   
   ```bash
   ./target/release/node-template --dev
   ```

2. Open the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/explorer) and connect to your local **Development** node.
   
   ![Connect to the local node](/media/images/docs/tutorials/collectibles-workshop/connect-to-local-endpoint.png)

1. Click **Developer** and select **Extrinsics**.

2. Select the **Collectibles** pallet and view the list of callable functions.
   
   ![Callable functions in the Collectibles pallet](/media/images/docs/tutorials/collectibles-workshop/collectibles-pallet.png)

3. Select the **createCollectible** function, click **Submit Transaction**, then click **Sign and Submit**.

4. Click **Network** and select **Explorer** to see the event emitted for creating a new collectible.
   
   ![CollectibleCreated event](/media/images/docs/tutorials/collectibles-workshop/create-collectible-event.png)

   You can use the Polkadot/Substrate Portal to test that functions, events, and errors work as expected.
   However, for your application to draw users, you'll want to develop a custom interface that lets users browse and bid on collectibles that other users create and put up for sale. 
   Building an inviting interface is an art unto itself, so for this workshop we'll keep things simple and not delve into what the application should look like or the user experience it should provide.
   In most cases. you'll want to use TypeScript and a web development framework such as React, Vue, or Angular to build the front-end for the application that runs on your blockchain.
