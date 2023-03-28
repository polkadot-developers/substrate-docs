---
title: Simulate parachains in a test network
description: Explains how you can set up a local test network to simulate a relay chain with validators and parachain collator nodes.
keywords:
  - parachain
  - Polkadot
  - testnet
  - collator nodes
  - validator nodes
  - relay chain
  - zombienet
  - ephemeral network
  - XCM
  - HRMP
---

You can use the `zombienet` command-line tool to set up a local test network to simulate a relay chain with validators and parachain collator nodes. 
You can configure the test network to include multiple validators and parachains with multiple collators.

This tutorial illustrates how to set up a basic test network with the following configuration:

- Four validators
- Two parachains
- One collator per parachain
- One message passing channel that enables the parachains to exchange messages

## Prepare a working folder with the binaries

The `zombienet` command-line interface relies on a configuration file to specify the characteristics of the test network, including the name and location of the binaries, Docker image, or Kubernetes deployment to use.

This tutorial illustrates how to configure a test network that uses the native relay chain and collator binaries, so the first step in setting up your test network is to prepare a working folder with the binaries you'll need.

To prepare a working folder with the binaries for the test network:

1. Open a new terminal shell on your computer, if needed.

1. Change to your home directory and create a new folder to hold the binaries required to generate a test network.
   
   For example:
   
   ```bash
   mkdir binaries
   ```

   If you’re setting up the test network on Linux, you can download the Polkadot binary from [Releases](https://github.com/paritytech/polkadot/releases) into your working folder.
   If you’re setting up the test network on macOS or want to compile the binary yourself, continue to the next step.

2. Clone the Polkadot repository by running a command similar to the following:
   
   ```bash
   git clone https://github.com/paritytech/polkadot
   ```

3. Change to the root of the `polkadot` directory by running the following command:
   
   ```bash
   cd polkadot
   ```
   
4. Checkout the latest release of Polkadot.
   
   Release branches use the naming convention `release-v<n.n.n>`.
   For example, the release branch used in this tutorial is `release-v0.9.37`.
   You can check out a more recent release branch instead of using `release-v0.9.37`.
   You can find information about recent releases and what's included in each release on the [Releases](https://github.com/paritytech/polkadot/releases) tab.
   
   For example:
   
   ```bash
   git checkout release-v0.9.37
   ```
   
1. Compile the relay chain node by running the following command:
   
   ```bash
   cargo build --release
   ```
   
2. Copy the Polkadot binary into your working `binaries` folder by running a command similar to the following:
   
   ```bash
   cp ./target/release/polkadot ../binaries/polkadot-v0.9.37
   ```
   
   As this example illustrates, it's generally a good practice to append the version of `polkadot` to the binary name to keep the files in the `binaries` folder organized.

3. Change to your home directory.

### Add the parachain binary

Your working folder now has the binary for the relay chain, but you also need the binary for the parachain collator nodes.
You can add the parachain collator binary to your working folder by cloning the  `substrate-parachain-template` repository.
By default, compiling the `substrate-parachain-template` creates a parachain collator binary that is configured with the `paraId` 1000.
You can use this `paraId` for the first parachain in the test network.

To add the parachain collator binary to the working folder:

1. Clone the  `substrate-parachain-template` repository by running the following command:
   
   ```bash
   git clone https://github.com/substrate-developer-hub/substrate-parachain-template
   ```

2. Change to the root of the parachain template directory by running the following command:

   ```bash
   cd substrate-parachain-template
   ```

3. Check out the release branch that matches the release branch you used to configure the relay chain.
   
   For example:
   
   ```bash
   git checkout polkadot-v0.9.37
   ```

4. Compile the parachain template collator by running the following command:

   ```bash
   cargo build --release
   ```
   
   You now have a parachain collator binary for paraId 1000.

5. Copy the parachain binary into your working `binaries` folder by running a command similar to the following:
   
   ```bash
   cp ./target/release/parachain-template-node ../binaries/parachain-template-node-v0.9.37
   ```

   In this example, your working directory is` $HOME/binaries` or `~/binaries` so you must navigate up a directory level from your current `substrate-parachain-template` root directory.
   As this example illustrates, it's generally a good practice to append the version to the binary name to keep the files in the `binaries` folder organized.

## Configure the test network settings

Now that you have the binaries you need in a working folder, you are ready to configure the settings for the test network that Zombienet will use.

To download and configure Zombienet:

1. Download the appropriate [Zombienet executable](https://github.com/paritytech/zombienet/releases) for the Linux or macOS operating system.
   
   Depending on your security settings, you might need to explicitly allow access to the executable.
   
   If you want the executable to be available system-wide, run commands similar to the following after downloading the executable:
   
   ```bash
   chmod +x zombienet-macos
   cp zombienet-macos /usr/local/bin
   ```

2. Verify that Zombienet is installed correctly by running the following command:
   
   ```bash
   ./zombienet-macos --help
   ```

   If command-line help is displayed, the Zombienet is ready to configure.

3. Create a configuration file for Zombienet by running the following command:
   
   ```bash
   touch config.toml
   ```

   You are going to use the configuration file to specify the following information:
   
   - Location of the binaries for the test network.
   - The relay chain specification—`rococo-local`—to use.
   - Information about the four relay chain validators.
   - Identifiers for parachains included in the test network.
   - Information about the collators for each parachains.
   - WebSocket endpoint ports to use to connect to each node.

   For example:
   
   ```toml
   [relaychain]

   default_command = "../binaries/polkadot-v0.9.37"
   default_args = [ "-lparachain=debug" ]
   
   chain = "rococo-local"
      
      [[relaychain.nodes]]
      name = "alice"
      
      [[relaychain.nodes]]
      name = "bob"
      
      [[relaychain.nodes]]
      name = "charlie"
      
      [[relaychain.nodes]]
      name = "dave"
    
   [[parachains]]
   id = 1000
   cumulus_based = true
      
      [parachains.collator]
      name = "parachain-A-1000-collator01"
      command = "../binaries/parachain-template-node-v0.9.37"

   [[parachains]]
   id = 1001
   cumulus_based = true
      
      [parachains.collator]
      name = "parachain-B-1001-collator01"
      command = "../binaries/parachain-template-node-v0.9.37"
   ```

4. Save your changes and close the file.
   
5. Start the test network using this configuration file by running a command similar to the following:
   
   ```bash
   ./zombienet-macos spawn config.toml -p native
   ```

   The command displays information about the test network nodes being started.

   Take note of the relay chain and parachain node endpoints.
   For example, the direct link to the relay chain endpoints should look similar to the following:

   - alice: https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:52190#/explorer 
   - bob: https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:52194#/explorer
   - charlie: https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:52198#/explorer
   - dave: https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:52202#/explorer
   
   The direct link to the parachain collator endpoints should look similar to the following:
   
   - parachain-1000-collator: https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:52206#/explorer
   - parachain-1001-collator: https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:52210#/explorer

   After all of the nodes are running, you can interact with your nodes by opening the [Polkadot/Substrate Portal](https://polkadot.js.org/apps) and connecting to any of the node endpoints.

## Open a message passing channel

Now that you have your test network up, you can open horizontal relay message passing channels to enable communication between parachain A (1000) and parachain B (1001).
Because channels are unidirectional, you need to 

- Send a request to open channel from parachain A (1000) to parachain B (1001).
- Accept the request on parachain B (1001).
- Send a request to open channel from parachain B (1001) to parachain A (1000).
- Accept the request on parachain A (1000).

Zombienet simplifies opening these channels by enabling you to include basic channel settings in the configuration file for testing purposes.

To set up communication between the parachains in the test network:

1. Open the `config.toml` file in a text editor.

2. Add channel information similar to the following to the configuration file:
   
   ```toml
   [[hrmp_channels]]
   sender = 1000
   recipient = 1001
   max_capacity = 8
   max_message_size = 8000
   
   [[hrmp_channels]]
   sender = 1001
   recipient = 1000
   max_capacity = 8
   max_message_size = 8000
   ```

   Note that the values you set for **max_capacity** and **max_message_size** shouldn't exceed the values defined for the `hrmpChannelMaxCapacity` and `hrmpChannelMaxMessageSize` parameters for the relay chain.

   To check the configuration settings for the current relay chain using the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/):

   - Click **Developer** and select **Chain State**.
   - Select **configuration**, then select **activeConfig()**.
   - Check the following parameter values:
     
      ```text
      hrmpChannelMaxCapacity: 8
      hrmpChannelMaxTotalSize: 8,192
      hrmlChannelMaxMessageSize: 1,048,576
      ```

3. Save your changes and close the file.
   
4. Restart Zombienet by running the following command:
   
   ```bash
   ./zombienet-macos spawn config.toml -p native
   ```
   
   You now have a test network with a bidirectional HRMP channel open between the parachains A (1000) and parachain B (1001).

   You can use the [Polkadot/Substrate Portal](https://polkadot.js.org/apps) to connect to the parachains and send messages.

5. Click **Developer** and select **Extrinsics**.

6. Select **polkadotXcm** or **xcmPallet**, then select **sent(dest, message)** to craft the XCM messages you want to send.
   
   You should note that XCM messages are like other transactions and require the sender to pay for the execution of the operation.
   All of the information required must be included in the message itself.
   For information about how to craft messages using XCM after you've opened HRMP channels, see [Cross-consensus communication](/learn/xcm-communication/) and [Transfer assets with XCM](/tutorials/build-a-parachain/transfer-assets-with-xcm/).
   
## Where to go next

For a more complex preconfigured environment that uses Zombienet, download and explore the [Trappist playground](https://github.com/paritytech/trappist).
For more information about the properties you can set in the configuration file, see the [Network definition specification](https://paritytech.github.io/zombienet/network-definition-spec.html).
