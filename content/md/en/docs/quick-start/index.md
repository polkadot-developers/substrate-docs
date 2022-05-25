---
title: Quick start
description: Get started with Substrate.
---

Example tabbed code block: for testing only

<figure class='tabbed'>

[[tabbedCode]]
|```sh
| git clone something

[[tabbedCode]]
| ```javascript
|onclick='document.getElementById("demo").innerHTML = "Hello JavaScript!"
|onclick='document.getElementById("demo").innerHTML = "Hello JavaScript!"

[[tabbedCode]]
|```text
| hello hello hello what

</figure>

All of the Substrate tutorials and how-to guides require you to run a Substrate node in your development environment.
To provide you with a working environment that includes the most common set of features to build a blockchain, the Substrate Developer Hub repository maintains its own snapshot of the Substrate **node template**.

The node template includes everything you need to get started without any of the extraneous modules or tools that you might want to add later.
Although you can also compile the node template by cloning files directly the Substrate repository, it isn't recommended because frequent code changes are likely to introduce stability and compatibility issues that cause tutorials or how-to examples to fail.

This _Quick start_ assumes that you are setting up a development environment for the first time and want to try out running a single blockchain client—called a node—on your local computer.

To keep things simple, you'll connect to the local node using a web browser and look up a balance for a predefined sample account.

## Before you begin

Before you begin, verify the following:

- You have good internet connection and access to a shell terminal on your local computer.

- You are generally familiar with software development and using command-line interfaces.

- You have the Rust compiler and toolchain installed.

  To check whether you have Rust installed, run the `rustup show` command.
  If Rust is installed, this command displays version information for the toolchain and compiler.

  If Rust is not installed, the command doesn't return any output.
  For information about installing Rust, see [Install Rust](https://www.rust-lang.org/tools/install) and [Rust compiler and toolchain](../03-install/rust-builds.md).

## Build the development environment node

1. Clone the node template repository using the `latest` branch by running the following command:

```bash
git clone https://github.com/substrate-developer-hub/substrate-node-template
```

1. Change to the root of the cloned directory by running the following command:

   ```bash
   cd substrate-node-template
   ```

1. Compile the node template using the nightly toolchain by running the following command:

   ```bash
   cargo +nightly build --package node-template --release
   ```

   Because of the number of packages involved, compiling the node can take several minutes.

## Verify and start the node

1. Verify that your node is ready to use and see information about the command-line options available by running the following command:

   ```bash
   ./target/release/node-template --help
   ```

   The usage information displays the command-line options you can use to:

   - start the node
   - work with accounts
   - modify node operations

1. View account information for the predefined `alice` account by running the following command:

   ```bash
   ./target/release/node-template key inspect //alice
   ```

   The command displays the following account information:

   ```bash
   Secret Key URI //alice is account:
   Secret seed:       0xc166b100911b1e9f780bb66d13badf2c1edbe94a1220f1a0584c09490158be31
   Public key (hex):  0xc81ebbec0559a6acf184535eb19da51ed3ed8c4ac65323999482aaf9b6696e27
   Account ID:        0xc81ebbec0559a6acf184535eb19da51ed3ed8c4ac65323999482aaf9b6696e27
   Public key (SS58): 5Gb6Zfe8K8NSKrkFLCgqs8LUdk7wKweXM5pN296jVqDpdziR
   SS58 Address:      5Gb6Zfe8K8NSKrkFLCgqs8LUdk7wKweXM5pN296jVqDpdziR
   ```

1. Start the node in development mode by running the following command:

   ```copy
   ./target/release/node-template --dev
   ```

   In development mode, the chain doesn't require any peer computers to finalize blocks.
   As the node starts, the terminal displays output about the operations performed.
   If you see messages that blocks are being proposed and finalized, you have a running node.

   ```
   ... Idle (0 peers), best: #3 (0xcc78…5cb1), finalized #1 ...
   ... Starting consensus session on top of parent ...
   ... Prepared block for proposing at 4 (0 ms) ...
   ```

## Connect to the node

1. Create a simple HTML file with JavaScript to interact with the blockchain.

   For example, create an `index.html` file that uses JavaScript and HTML to:

   - take an account address as input
   - look up the account balance using an onClick event
   - display the balance for the account as output.

   This sample [index.html](examples/quick-start/index.html) provides a simple example of how to use JavaScript and HTMLto get an account balance.

1. Open the [index.html](examples/quick-start/index.html) file in a web browser.

1. Copy and paste the SS58 Address for the `alice` account in the input field, then click **Get Balance**.

## Stop the node

1. Go to the terminal that displays blockchain operations.

1. Stop the local blockchain and clear all state by pressing Control-c.
