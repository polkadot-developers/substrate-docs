---
title: Quick start
description: Get started with Substrate.
keywords:
---

All of the Substrate tutorials and how-to guides require you to build and run a Substrate node in your development environment.
To help you set up a working environment quickly, the [Substrate Developer Hub](https://github.com/substrate-developer-hub/) maintains several _templates_ for you to use.

The Developer Hub snapshot of the [substrate-node-template](https://github.com/substrate-developer-hub/substrate-node-template/releases/tag/latest) includes everything you need to get started with a core set of features.

This _Quick start_ assumes that you are setting up a development environment for the first time and want to try out running a single blockchain node on your local computer.

To keep things simple, you'll connect to the local node using a web browser and look up a balance for a predefined sample account.

## Before you begin

Before you begin, verify the following:

- You have an internet connection and access to an interactive shell terminal on your local computer.

- You are generally familiar with software development and using command-line interfaces.

- You have the Rust compiler and toolchain installed.

  You can check whether you have Rust installed by running the `rustup show` command.
  If Rust is installed, this command displays version information for the toolchain and compiler.
  If Rust is not installed, the command doesn't return any output.
  For information about installing Rust, see [Install](/main-docs/install).

## Build the node template

1. Clone the node template repository using the `latest` tag by running the following command:

   ```sh
   git clone --branch latest --depth 1 https://github.com/substrate-developer-hub/substrate-node-template
   ```

1. Change to the root of the cloned directory:

   ```sh
   cd substrate-node-template
   ```

1. Compile the node template:

   ```sh
   cargo build --package node-template --release
   ```

   Because of the number of packages involved, compiling the node can take several minutes.

## Start the node

1. Verify that your node is ready to use and see information about the command-line options available by running the following command:

   ```sh
   ./target/release/node-template --help
   ```

   The usage information displays the command-line options you can use to:

   - start the node
   - work with accounts
   - modify node operations

1. View account information for the predefined `Alice` development account by running the following command:

   ```sh
   ./target/release/node-template key inspect //Alice
   ```

   The command displays the following account information:

   ```sh
   Secret Key URI `//Alice` is account:
   Network ID:        substrate 
   Secret seed:       0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a
   Public key (hex):  0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
   Account ID:        0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
   Public key (SS58): 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
   SS58 Address:      5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
   ```

1. Start the node in development mode by running the following command:

   ```sh
   ./target/release/node-template --dev
   ```

   In development mode, the chain doesn't require any peer computers to finalize blocks.
   As the node starts, the terminal displays output about the operations performed.
   If you see messages that blocks are being proposed and finalized, you have a running node.

   ```text
   ... Idle (0 peers), best: #3 (0xcc78…5cb1), finalized #1 ...
   ... Starting consensus session on top of parent ...
   ... Prepared block for proposing at 4 (0 ms) ...
   ```

## Connect to the node

1. Create a simple HTML file with JavaScript and the [Polkadot-JS API](https://polkadot.js.org/docs/) to interact with the blockchain.
   
   For example, create an `index.html` file that uses JavaScript and HTML to:

   - take an account address as input
   - look up the account balance using an onClick event
   - display the balance for the account as output

   <!--This sample [index.html](/examples/quickstart/index.html) provides a simple example of how to use JavaScript, the Polkadot-JS API, and HTML to get an account balance. -->
   
   This following `index.html` is a simple example of how to use JavaScript, the Polkadot-JS API, and HTML to get an account balance.



   <iframe id="someframe" width="100%" height="400px" src="../examples/index.html"></iframe>



   ```html
   <!DOCTYPE html>
   <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>Quick start: Get Balance</title>
        <!-- Bootstrap core CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"  integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
        <style>
          body {
            margin: 60px;
          }
          .container {
            width: auto;
            max-width: 680px;
            padding: 20px 15px;
          }
          .output {
            margin-top: 20px;
          }
        </style>
      </head>

      <body>
         <main role="main" class="container">
            <h1 style="font-family: sans-serif; font-weight: 500;">Display an account balance</h1>
            <p style="font-family: sans-serif;">Enter a development account address, then click <b>Get Balance</b>.</p>
            
            <input type="text" size="58" id="account_address"/>
            <input type="button" onclick="GetBalance()" value="Get Balance">
            <p class="output">Balance: <span id="polkadot-balance">Not Connected</span></p>
         </main>
         
         <script src="https://unpkg.com/@polkadot/util/bundle-polkadot-util.js"></script>
         <script src="https://unpkg.com/@polkadot/util-crypto/bundle-polkadot-util-crypto.js"></script>
         <script src="https://unpkg.com/@polkadot/types/bundle-polkadot-types.js"></script>
         <script src="https://unpkg.com/@polkadot/api/bundle-polkadot-api.js"></script>
         
         <script>
           async function GetBalance() {
             const ADDR = '5Gb6Zfe8K8NSKrkFLCgqs8LUdk7wKweXM5pN296jVqDpdziR';
             
             const { WsProvider, ApiPromise } = polkadotApi;
             const wsProvider = new WsProvider('ws://127.0.0.1:9944');
             const polkadot = await ApiPromise.create({ provider: wsProvider });
             
             let polkadotBalance = document.getElementById("polkadot-balance");
               const x = document.getElementById("account_address").value;
               const { data: balance } = await polkadot.query.system.account(x);
            
              polkadotBalance.innerText = balance.free;
            }  
         </script>
      </body>
   </html>
   ```

1. Open the <a className="noTrailingSlash" href="/examples/index.html">index.html</a> file in a web browser.

1. Copy and paste the SS58 Address for the `Alice` account in the input field, then click **Get Balance**.

## Stop the node

1. Go to the terminal that displays blockchain operations.

1. Stop the local blockchain and clear all state by pressing `ctrl-c`.

## Where to go next

In this _Quick start_, you learned how to compile and run a single blockchain node on your local computer.
To start learning how to customize its features, explore the following resources:

- [Architecture](/main-docs/fundamentals/architecture/)
- [Runtime development](/main-docs/fundamentals/runtime-intro/)
- [Rust for Substrate](/main-docs/fundamentals/rust-basics/)
