---
title: Set up a parachain test network
description: Explains how you can set up a local test network to simulate a relay chain with validators and parachain collator nodes.
keywords:
  - parachain
  - Polkadot
  - testnet
  - collator nodes
  - validator nodes
  - relay chain
  - zombienet
---

You can use the `zombienet` command-line tool to set up a local test network to simulate a relay chain with validators and parachain collator nodes.
You can configure the test network to include multiple validators and parachains with multiple collators.

To see the full list of features Zombienet offers, see the [README](https://github.com/paritytech/zombienet).

This tutorial illustrates how to set up a test network with the following configuration:

- Four validators
- Two parachains
- One collator per parachain
- One HRMP channel that enables the parachains to exchange messages

## Prepare a working folder with the binaries

The `zombienet` command-line interface relies on a configuration file to specify the characteristics of the test network, including the name and location of the binaries, Docker image, or kubernetes deployment to use.

This tutorial illustrates how to configure a test network that uses the relay chain and collator binaries, so the first step in setting up your test network is to prepare a working folder with the binaries you'll need.

To prepare a working folder with the binaries for the test network:

1. Open a new terminal shell on your computer, if needed.

1. Change to your home directory and create a new folder to hold the binaries required to generate a test network.

   For example:

   ```bash
   mkdir bin
   ```

   If you’re setting up the test network on Linux, you can download the Polkadot binary from [Releases](https://github.com/paritytech/polkadot/releases) into your working folder.
   If you’re setting up the test network on macOS or want to compile the binary yourself, continue to the next step.

1. Clone the Polkadot repository by running a command similar to the following:

   ```bash
   git clone --depth 1 --branch release-v1.0.0 https://github.com/paritytech/polkadot.git
   ```

   Release branches use the naming convention `release-v<n.n.n>`.
   For example, the release branch used in this tutorial is `release-v1.0.0`.
   You can check out a more recent release branch instead of using `release-v1.0.0`.
   You can find information about recent releases and what's included in each release on the [Releases](https://github.com/paritytech/polkadot/releases) tab.

1. Change to the root of the `polkadot` directory by running the following command:

   ```bash
   cd polkadot
   ```

1. Compile the relay chain node by running the following command:

   ```bash
   cargo build --release
   ```

   Compiling the node can take 15 to 60 minuets to complete.

1. Copy the Polkadot binary into your working `bin` folder by running a command similar to the following:

   ```bash
   cp ./target/release/polkadot ../bin/polkadot-v1.0.0
   ```

   As this example illustrates, it's generally a good practice to append the version of `polkadot` to the binary name to keep the files in the `bin` folder organized.

1. Change to your home directory.

### Add the first parachain binary

Your working folder now has the binary for the relay chain, but you also need the binaries for the parachain collator nodes.
You can add the parachain collator binary to your working folder by cloning the `substrate-parachain-template` repository.
By default, compiling the `substrate-parachain-template` creates a parachain collator binary that is configured with the `paraId` 1000.
You can use this `paraId` for the first parachain in the test network.

To add the first parachain binary to the working folder:

1. Clone the `substrate-parachain-template` repository by running the following command:

   ```bash
   git clone https://github.com/substrate-developer-hub/substrate-parachain-template
   ```

1. Change to the root of the parachain template directory by running the following command:

   ```bash
   cd substrate-parachain-template
   ```

1. Check out the release branch that matches the release branch you used to configure the relay chain.

   For example:

   ```bash
   git checkout polkadot-v1.0.0
   ```

1. Compile the parachain template collator by running the following command:

   ```bash
   cargo build --release
   ```

   You now have a parachain collator binary for paraId 1000.

1. Copy the parachain binary into your working `bin` folder by running a command similar to the following:

   ```bash
   cp ./target/release/parachain-template-node ../bin/parachain-template-node-v1.0.0-1000
   ```

   As this example illustrates, it's generally a good practice to append the version and `paraId` to the binary name to keep the files in the `bin` folder organized.

### Add the second parachain binary

Each parachain must have a unique identifier, so to create a second parachain for the test network you need to edit the default chain specification to specify a different `paraId`.

To add the second parachain binary to the working folder:

1. Open the `substrate-parachain-template/node/src/chain_spec.rs` file in a text editor.
2. Modify the Local Testnet configuration to use the identifier `1001` instead of the default identifier `1000`.

   There are two instances to change in the `local_testnet_config` function:

   ```rust
   pub fn local_testnet_config() -> ChainSpec {
      // Give your base currency a unit name and decimal places
      let mut properties = sc_chain_spec::Properties::new();
      properties.insert("tokenSymbol".into(), "UNIT".into());
      properties.insert("tokenDecimals".into(), 12.into());
      properties.insert("ss58Format".into(), 42.into());

      ChainSpec::from_genesis(
        // Name
        "Local Testnet",
        // ID
        "local_testnet",
        ChainType::Local,
        move || {
            testnet_genesis(
              // initial collators.
              vec![
                (
                  get_account_id_from_seed::<sr25519::Public>("Alice"),get_collator_keys_from_seed("Alice"),
                ),
                (
                  get_account_id_from_seed::<sr25519::Public>("Bob"),
                  get_collator_keys_from_seed("Bob"),
                ),
              ],
              vec![
                  get_account_id_from_seed::<sr25519::Public>("Alice"),get_account_id_from_seed::<sr25519::Public>("Bob"),get_account_id_from_seed::<sr25519::Public>("Charlie"),get_account_id_from_seed::<sr25519::Public>("Dave"),get_account_id_from_seed::<sr25519::Public>("Eve"),get_account_id_from_seed::<sr25519::Public>("Ferdie"),get_account_id_from_seed::<sr25519::Public>("Alice//stash"),get_account_id_from_seed::<sr25519::Public>("Bob//stash"),get_account_id_from_seed::<sr25519::Public>("Charlie//stash"),get_account_id_from_seed::<sr25519::Public>("Dave//stash"),get_account_id_from_seed::<sr25519::Public>("Eve//stash"),get_account_id_from_seed::<sr25519::Public>("Ferdie//stash"),
              ],
            1001.into(),
          )
        },
        // Bootnodes
        Vec::new(),
        // Telemetry
        None,
        // Protocol ID
        Some("template-local"),
        // Fork ID
        None,
        // Properties
        Some(properties),
        // Extensions
        Extensions {
            relay_chain: "rococo-local".into(), // You MUST set this to the correct network!
            para_id: 1001,
      },
    )
   ```

3. Save your changes and close the chain specification file.

4. Compile the node with the modified chain specification by running the following command:

   ```bash
   cargo build -release
   ```

5. Copy the new parachain collator binary into the working `bin` folder by running a command similar to the following:

   ```bash:
   cp ./target/release/parachain-template-node ../bin/parachain-template-node-v1.0.0-1001
   ```

## Configure the test network settings

Now that you have all of the binaries you need in a working folder, you are ready to configure the settings for the test network that Zombienet will use.

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

   For example:

   ```toml
   [relaychain]
   default_command = "./bin/polkadot-v1.0.0"
   default_args = [ "-lparachain=debug" ]

   chain = "rococo-local"

      [[relaychain.nodes]]
      name = "alice"
      validator = true

      [[relaychain.nodes]]
      name = "bob"
      validator = true

      [[relaychain.nodes]]
      name = "charlie"
      validator = true

      [[relaychain.nodes]]
      name = "dave"
      validator = true

   [[parachains]]
   id = 1000
   cumulus_based = true

      [parachains.collator]
      name = "parachain-A-1000-collator-01"
      command = "./bin/parachain-template-node-v1.0.0-1000"

   [[parachains]]
   id = 1001
   cumulus_based = true

      [parachains.collator]
      name = "parachain-B-1001-collator-01"
      command = "../bin/parachain-template-node-v1.0.0-1001"
   ```

4. Save your changes and close the file.
5. Start the test network using this configuration file by running a command similar to the following:

   ```bash
   ./zombienet-macos spawn config.toml -p native
   ```

   The command displays information about the test network nodes being started.
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
   [[hrmpChannels]]
   sender = 1000
   recipient = 1001
   maxCapacity = 8
   maxMessageSize = 8000

   [[hrmpChannels]]
   sender = 1001
   recipient = 1000
   maxCapacity = 8
   maxMessageSize = 8000
   ```

   Note that the values you set for **maxCapacity** and **maxMessageSize** shouldn't exceed the values defined for the `hrmpChannelMaxCapacity` and `hrmpChannelMaxMessageSize` parameters for the relay chain.

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

6. Select **polkadotXcm**, then select **sent(dest, message)** to craft the XCM messages you want to send.

   You should note that XCM messages are like other transactions and require the sender to pay for the execution of the operation.
   All of the information required must be included in the message itself.
   For information about how to craft messages using XCM after you've opened HRMP channels, see [Constructing XCM messages](/learn/xcm-communication).
