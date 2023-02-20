---
title: Get oriented
description:
tutorial: 1
code: |

answer: |
---

If you completed the checklist in [Prepare a working environment](/tutorials/collectibles-workshop/01-prepare/), you have successfully compiled a Substrate node.
This particular node—the substrate-node-template—is preconfigured with a few common modules to provide a simple working environment to get you started.

## About the node template

The node template includes some default blockchain essentials, like peer-to-peer networking, block authoring, consensus, and block import for finalized blocks.
The node template also includes some basic functionality for working with accounts and transactions and performing administrative actions.
This core set of functionality is provided through several predefined modules—called pallets—that implement specific features.

The following core modules are predefined in the node template:

- `pallet_balances` for managing account assets and transfers between accounts.
- `pallet_transaction_payment` for managing transaction fees for the transactions performed.
- `pallet_sudo` for performing operations that require administrative permissions.

The node template also provides a starter `pallet_template` that illustrates how to implement features in custom pallets.
A lot of what you'll be doing in this workshop is similar to what you see in the `pallet_template` except that you'll implement logic that's specific to the application you're building.

## Rename your workspace

To differentiate between the default Substrate node template and the workspace you'll be using to customize the node, you can rename the working directory and create a separate branch for your changes.

To prepare a custom workspace:

1. Open a terminal on your local computer and navigate to the directory that contains the `substrate-node-template` root directory.

2. Rename the `substrate-node-template` root directory by running the following command:
   
   ```bash
   mv substrate-node-template workshop-node-template
   ```

   In subsequent steps, the `workshop-node-template` directory is used to refer to the root directory for the node.

3. Change to the root directory for the node by running the following command:
   
   ```bash
   cd workshop-node-template
   ```

4. Create a custom branch for your workspace by running a command similar to the following:
   
   ```bash
   git switch -c build-substrate-workshop
   ```

   Because you're only changing the name of your workspace folder and repository branch, you don't have to recompile the node.
   If you want to verify the build by recompiling, run the following command:

   ```bash
   cargo build --release
   ```

## Start the node in development mode

After you've renamed your workspace, you can start your node in development mode and let it run in the background.
In development mode, the node uses some default settings that are predefined for a development environment. 
A few of the default settings for the development environment include:

- Several predefined accounts, including Alice, Bob, Charlie, and Dave.
- Initial account balances for the Alice and Bob accounts.
- Root-level permissions for the Alice account.
- Predefined authority to produce and validate blocks using the Alice account.
  
By default, development mode also stores chain data in a temporary database and deletes that data when you stop the node. 

To start the local Substrate node:

1. Open a terminal shell, if needed.

2. Change to the `workshop-node-template` root directory.

3. Start the node in development mode by running the following command:
   
   ```bash
   ./target/release/node-template --dev
   ```
   
   In development mode, the chain doesn't require any peer computers to finalize blocks. 
   After some initialization messages, you should see that blocks are being proposed, sealed,  and finalized.
   For example:

   ```text
   2022-10-12 13:07:18 Substrate Node    
   2022-10-12 13:07:18 ✌️  version 4.0.0-dev-6c701fa6109    
   2022-10-12 13:07:18 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2022    
   2022-10-12 13:07:18 📋 Chain specification: Development    
   2022-10-12 13:07:18 🏷  Node name: cooperative-clocks-6375    
   2022-10-12 13:07:18 👤 Role: AUTHORITY    
   ...
   2022-10-12 13:07:24 🙌 Starting consensus session on top of parent 0x72d1778c51e4c624e39d20bd3fac5d2c800a424fbd3bde08f4863bdf90966bf9    
   2022-10-12 13:07:24 🎁 Prepared block for proposing at 1 (1 ms) [hash: 0xdc23986196af67f6b07a78c50cd7b42c24b2e8da2d9f8ebf81c2540c358ada06; parent_hash: 0x72d1…6bf9; extrinsics (1): [0xd047…45da]]    
   2022-10-12 13:07:24 🔖 Pre-sealed block for proposal at 1. Hash now 0x0e2c8238d12d4babc83881384f6f178aa2996df5083387070c3d726bb7b10aec, previously 0xdc23986196af67f6b07a78c50cd7b42c24b2e8da2d9f8ebf81c2540c358ada06.    
   2022-10-12 13:07:24 ✨ Imported #1 (0x0e2c…0aec)
   ```

   You now have a running blockchain that's producing blocks.
   You can leave it running in the background or stop and restart it whenever you like.
   
   - To stop the node, press Control-c.
   - To restart the node, run `./target/release/node-template --dev`.

   The next step is to start customizing what this blockchain does.
   As you learned in [Prepare a working environment](/tutorials/collectibles-workshop/01-prepare/), Substrate is built using the Rust programming language.
   So, customizing what the blockchain does means working in Rust.
   
   If you're familiar with Rust, you can go right to [Create a new pallet](/tutorials/collectibles-workshop/03-create-pallet/) and start building.
   If you're new to Rust, you might want to review the brief introduction that follows before you start writing code.

## A brief introduction to Rust

This workshop isn’t about learning Rust, but there are a few basic concepts that are unique to Rust and that you should be familiar with to ensure you’ll be successful in completing this workshop.

### Ownership and borrowing

Most languages use either garbage collection or manually encoded operations to allocate and free up memory. In Rust, ownership is what controls how programs manage memory. 
At a high level, ownership consists of three simple rules that the compiler checks:

Each value has an owner that’s identified by the variable that holds the value.
A value can only have one owner at a time.
If the owner goes out of scope, the value is dropped.

To prevent a value from being dropped when you want to reuse it, you can borrow it.
In Rust, you can add an ampersand (&) in front of a variable identifier to indicate that you want to borrow its value. By adding the ampersand, you can reuse the value multiple times throughout a function.

### Traits

Traits are similar to interfaces in Java and classes in C++.
Traits enable you to define behavior for a type that can be shared with other types. 
In Substrate, traits provide a flexible abstraction for defining shared behavior that types can have in common.

### Functions that return errors

In Rust, functions must return the Result type to handle errors. The returned Result is either Ok() for success or Err() for a failure.
For example:

match my_function() {
    Ok(value) => value,
    Err(msg) => return Err(msg),
}

### Macros

Macros—code that writes code—aren’t unique to Rust, but they simplify code by abstracting code that would otherwise be duplicated.
Substrate uses a lot of macros in both the core runtime logic and in the creation of the individual pallets.
Macros simplify lots of common tasks like creating storage items and defining events and errors.
You'll use a lot of them in the workshop.

### Rust compiler errors

One of the many advantages of using a strongly typed programming language like Rust is that the compiler can catch and describe many common programming errors and coding issues.
In most cases, the warning and error messages even suggest how to fix the errors in your code. 
For example, the compiler will identify mismatched types, unused variables, problems with the number or the type of arguments specified for a function.
In many cases, the Rust compiler also suggests where you can find more information about the problems it has identified. 
If, at any point, your program doesn’t compile, review the compiler messages carefully.
You’ll learn a lot from these messages and often you’ll be able to resolve the issue without digging further.
