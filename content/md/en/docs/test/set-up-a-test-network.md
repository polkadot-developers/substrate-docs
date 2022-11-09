---
title: Set up a parachain test network
description:
keywords:
---

You can use the `zombienet` command-line tool to set up a local test network to simulate a relay chain with validators and parachain collator nodes. 
You can configure the test network to include multiple validators and parachains with multiple collators.

To see the full list of features Zombienet offers, see the [README]([:](https://github.com/paritytech/zombienet)).

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

2. Clone the Polkadot repository by running the following command:
   
   ```bash
   git clone --depth 1 https://github.com/paritytech/polkadot.git
   ```

3. Change to the root of the `polkadot` directory by running the following command:
   
   ```bash
   cd polkadot
   ```

4. Check out the latest release of Polkadot by running a command similar to the following:
   
   ```bash
   git checkout release-v0.9.30
   ```
   
   Release branches use the naming convention `release-v<n..n.n>`.
   For example, the release branch used in this tutorial is `release-v0.9.30`.
   You can check out a more recent release branch instead of using `release-v0.9.30`.
   You can find information about recent releases and what's included in each release on the [Releases](https://github.com/paritytech/polkadot/releases) tab.
   
3. Compile the relay chain node by running the following command:
   
   ```bash
   cargo build --release
   ```
   
   Compiling the node can take 15 to 60 minuets to complete.

5. Copy the Polkadot binary into your working `bin` folder by running a command similar to the following:
   
   ```bash
   cp ./target/release/polkadot ../bin/polkadot-v0.9.30
   ```
   
   As this example illustrates, it's generally a good practice to append the version of `polkadot` to the binary name to keep the files in the `bin` folder organized.

6. Change to your home directory.

### Add the first parachain binary

Your working folder now has the binary for the relay chain, but you also need the binaries for the parachain collator nodes.
You can add this binary to your working folder by cloning the  `substrate-parachain-template` repository.
By default, compiling the substrate-parachain-template creates a parachain collator binary that is configured with paraId 1000.
You can use this paraId for the fist parachain in the test network.

To add the first parachain binary to the working folder:

1. Clone the  `substrate-parachain-template` repository by running the following command:
   
   ```bash
   git clone https://github.com/substrate-developer-hub/substrate-parachain-template
   ```

1. Change to the root of the parachain template directory by running the following command:

   ```bash
   cd substrate-parachain-template
   ```

2. Check out the release branch that matches the release branch you used to configure the relay chain.
   
   For example:
   
   ```bash
   git checkout polkadot-v0.9.30
   ```

3. Compile the parachain template collator by running the following command:

   ```bash
   cargo build --release
   ```
   
   You now have a parachain collator binary for paraId 1000.

4. Copy the parachain binary into your working `bin` folder by running a command similar to the following:
   
   ```bash
   cp ./target/release/parachain-template-node ../bin/parachain-template-node-v0.9.30-1000
   ```
   
   As this example illustrates, it's generally a good practice to append the version and paraId to the binary name to keep the files in the `bin` folder organized.

### Add the second parachain binary

Each parachain must have a unique identifier, so to create a second parachain for the test network you need to edit the default chain specification to specify a different paraId.

To add the second parachain binary to the working folder:

1. Open the `substrate-parachain-template/node/src/chain_spec.rs` file in a text editor.
   
2. Modify the Local Testnet to use paraId `1001` instead of the default paraId `1000`:
   
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

1. Compile the node with the modified chain specification by running the following command:
   
   ```bash
   cargo build -release
   ```

2. Copy the new parachain collator binary into the working `bin` folder by running a command similar to the following:
   
   ```bash:
   cp ./target/release/parachain-template-node ../bin/parachain-template-node-v0.9.30-1001
   ```

## Configure the test network settings

Now that you have all of teh binaries you need in a working folder, you are ready to configure the settings for the test network that Zombienet will use.

To configure Zombienet:

1. Download the appropriate [Zombienet executable](https://github.com/paritytech/zombienet/releases) for the Linux or macOS operating system.
   
   Depending on your security settings, you might need to explicitly allow access to the executable.
Tip: If you want the executable to be available system-wide then you can follow these steps (otherwise just download the executable to your working directory):

wget https://github.com/paritytech/zombienet/releases/download/v1.2.61/zombienet-macos
chmod +x zombienet-macos 
cp zombienet-macos /usr/local/bin
Let’s make sure Zombienet CLI is installed correctly:

./zombienet-macos --help
You should see some similar output:

Usage: zombienet [options] [command]

Options:
  -c, --spawn-concurrency <concurrency>  Number of concurrent spawning process to launch, default is 1
  -p, --provider <provider>              Override provider to use (choices: "podman", "kubernetes", "native")
  -m, --monitor                          Start as monitor, do not auto cleanup network
  -h, --help                             display help for command

Commands:
  spawn <networkConfig> [creds]          Spawn the network defined in the config
  test <testFile> [runningNetworkSpec]   Run tests on the network defined
  setup <binaries...>                    Setup is meant for downloading and making dev environment of Zombienet ready
  version                                Prints zombienet version
  help [command]                         display help for command
Setting up our config
Zombienet works with a config. The config is where you specify your test network’s configuration. The config is also where we specify our binaries.

Create a config file:

touch config.toml
So we want to specify in our config that we want a Rococo relay chain with four validators and two parachains each with one collator:

[relaychain]
default_command = "./bin/polkadot-v0.9.30"
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
  command = "./bin/parachain-template-node-v0.9.30-1000"

[[parachains]]
id = 1001
cumulus_based = true

  [parachains.collator]
  name = "parachain-B-1001-collator-01"
  command = "../bin/parachain-template-node-v0.9.30-1001"
Save the file and run the Zombienet CLI using this config:

./zombienet-macos spawn config.toml -p native
You should see some nicely formatted output stating that the nodes are up and ready.

You can now interact with your nodes on polkadotJS apps!

Opening HRMP Channels
Background on HRMP (XCMP-Lite)

While XCMP is still being implemented, a stop-gap
protocol (see definition below) known as Horizontal Relay-routed
Message Passing (HRMP) exists in its place. HRMP has the same
interface and functionality as XCMP but is much more demanding on
resources since it stores all messages in the Relay Chain storage.
When XCMP has been implemented, HRMP is planned to be deprecated and
phased out in favor of it.

https://wiki.polkadot.network/docs/learn-xcm#hrmp-xcmp-lite
This post will show how to open HRMP channels between two parachains: Parachain A and Parachain B.

Channels are unidirectional

The parachain that wants to open an HRMP channel must make a request to the parachain it wishes to have an open channel with. Once that is done, the other parachain needs to accept this request. This is what we mean by unidirectional flow. For bidirectional communication we need to open another channel in the opposite way.

A channel can be opened only after the recipient confirms it and only on a session change.

Initiate an open channel request from Parachain A to Parachain B
We will have Parachain A initiate a request to open an HRMP channel with Parachain B.

This is done on the relay chain.

Open the relay chain’s polkadotJS apps and create the following extrinsic:

hrmp.hrmpInitOpenChannel(
    recipient: 2000                    // the other parachain you want to open the channel with
    proposedMaxCapacity: 1000          // specifies how many messages can be in the channel at once
    proposed_max_message_size: 102400  // specifies the maximum size of the messages
)


We will not submit this transaction. Instead, after setting the desired parameters, copy the encoded call data. We will need this later to craft our XCM message.

Here is a past example of an encoded call data in Rococo: 0x1700b80b0000e803000000900100

Note that proposedMaxCapacity and proposed_max_message_size numbers are subject to the relay chain’s configuration limits. The relay chain’s configuration can be found in configuration.activeConfig():



The image above is an example of Rococo’s active configuration at the time of writing this article.

The next step is done on parachain A.

Connect to Parachain A on polkadotJS apps.

Create a polkadotXcm extrinsic to notify the relay chain that we want to open a channel with parachain B (using the encoded call data from the previous step):

polkadotXcm.send(
    dest: V1
        parents: 1
        interior: Here
    message: V2
        XcmV2Instruction: WithdrawAsset
            id: Concrete
                parents: 0
                interior: Here
            fun: Fungible
                Fungible: 1_000_000_000_000
        XcmV2Instruction: BuyExecution
            id: Concrete
                parents: 0
                interior: Here
            fun: Fungible
                Fungible: 1_000_000_000_000
            weightLimit: Unlimited
        XcmV2Instruction: Transact
            originType: Native
            requireWeightAtMost: 4_000_000_000
                encoded: 0x1700b80b0000e803000000900100 // our hrmpInitOpenChannel encoded call data

)
Note: you should compose your message taking into account the active XCM configuration, this is just an example.

Accept Parachain A’s open channel request on Parachain B
So far Parachain A has done its part: it has requested to open an HRMP channel to Parachain B.

Now this request has to be accepted by Parachain B.

On the relay chain, create the following extrinsic:

hrmp.hrmpAcceptOpenChannel(
    sender: 2000
)
There is no need to submit the transaction. Instead copy the encoded call data.

Here is an example of an encoded call data in Rococo: 0x1701d0070000

Now on Parachain B we use polkadotXcm.send extrinsic to craft an XCM message (using the encoded call data from the previous step).

polkadotXcm.send(
    dest: V1
        parents: 1
        interior: Here
    message: V2
        XcmV2Instruction: WithdrawAsset
            id: Concrete
                parents: 0
                interior: Here
            fun: Fungible
                Fungible: 1_000_000_000_000
        XcmV2Instruction: BuyExecution
            id: Concrete
                parents: 0
                interior: Here
            fun: Fungible
                Fungible: 1_000_000_000_000
            weightLimit: Unlimited
        XcmV2Instruction: Transact
            originType: Native
            requireWeightAtMost: 4_000_000_000
                encoded: 0x1701d0070000 // our hrmpAcceptOpenChannel encoded call data

)
Note: you should compose your message taking into account the active XCM configuration, this is just an example.

And that’s it — the channel has been accepted and it will remain open, such that communication from Parachain A to Parachain B can now flow.

For making this a bidirectional channel you’ll need to open another channel, from Parachain B to Parachain A. You can do this by repeating the steps above (inversely).

More info here:

https://docs.substrate.io/reference/how-to-guides/parachains/add-hrmp-channels
Zombienet HRMP Configuration
Zombienet also has an HRMP configuration to quickly open HRMP channels.

For testing purposes this can be useful.

Simply add the following to your config:

[[hrmpChannels]]
sender = 1000
recipient = 1001
maxCapacity = 1000
maxMessageSize = 102400

[[hrmpChannels]]
sender = 1001
recipient = 1000
maxCapacity = 1000
maxMessageSize = 102400
Restart Zombienet and you now have a bidirectional HRMP channel open between the two parachains!

