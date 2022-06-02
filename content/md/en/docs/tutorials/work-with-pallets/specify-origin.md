---
title: Specify the origin for a call
description: 
keywords: FRAME, runtime, custom pallet

---

In [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet), you added functions from the `frame_nicks` pallet to the [Substrate node template](https://github.com/substrate-developer-hub/substrate-node-template) runtime.

The Nicks pallet allows blockchain users to pay a deposit to reserve a nickname for an account they control. It implements the following functions:

* The `set_name` function to collect a deposit and set the name of an account if the name is not already taken.
* The `clear_name`  function to remove the name associated with an account and return the deposit.
* The `kill_name` function to forcibly remove an account name without returning the deposit.

This tutorial illustrateS why calling these functions using different originating accounts matters and how the call and write operations can lead to failed or successful results. 

## Before you begin

Before you begin, verify the following:

* You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/main-docs/install/).

* You have the Substrate node template installed locally.

* You have the Substrate front-end template installed locally.

* You have completed the [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet) tutorial and successfully compiled the runtime that includes the `nicks` pallet.

* You are generally familiar with software development and using command-line interfaces.

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

* Call the `clear_name`  function using an account that isn't allowed to execute the call.
* Call the `clear_name`  function using an account that has permission to execute the call.
* Call the `kill_name` function using an origin that doesn't have administrative privileges.
* Call the `kill_name` function using the `Root` origin account.

## Review the configuration trait for the pallet

The `Config` trait in the `nicks` pallet declares several types.
For this tutorial, the focus is on the `ForceOrigin` type that specifies the account that can forcibly set or remove a name.
For example, the owner of an account or the Root account can set or remove a reserved nickname.
In the implementation (`impl`) block for the `Config` trait, you added code to configure the FRAME System `Root` origin as the `nicks` pallet administrator.
For example:

```rust
// https://docs.substrate.io/rustdocs/latest/frame_system/enum.RawOrigin.html#variant.Root
type ForceOrigin = frame_system::EnsureRoot<AccountId>;
```

If you previously configured the `nicks` pallet as described in [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet), you were able compile the runtime in release mode by running the following command:

```bash
cargo build --release
```

## Start the blockchain node and front-end template

After you compile the runtime, you are ready to start the node and interact with it using the front-end template.

To start the local Substrate node:

1. Open a terminal shell, if necessary.

1. Change to the root directory of the Substrate node template.

1. Start the node in development mode by running the following command:

   ```bash
   ./target/release/node-template --dev
   ```

1. Keep the terminal that displays the node output open to continue.

1. Open a second terminal shell on your computer.

1. In the new terminal, change to the root directory where you installed the front-end template.

1. Start the web server for the front-end template by running the following command:

   ```bash
   yarn start
   ```

1. Open http://localhost:8000/ in a browser to view the front-end template.

## Remove a nickname

In [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet), you set a nickname for the Alice account.
The `nicks` pallet also provides two additional functions—the `clear_name`  function and the `kill_name` function—that enable an account owner to remove the reserved name or a root-level user to forcibly remove an account name.

To remove a nickname:

You can learn about additional features—such as the use of the Sudo pallet and origin accounts—by exploring how these functions work.
However, those features are beyond the scope of this tutorial.
If you want to explore additional features exposed through the Nicks and Sudo pallets, see [Next steps]() and select [Specify the origin for a call]().

For example, if you select the `killName`function and specify the account for Bob as the function's argument, you must be the `Root` origin account to submit the call.
The `killName` function must be called by the `ForceOrigin` that was configured with the Nicks pallet's `Config` interface in the previous section.
You may recall that we configured this to be the FRAME system's .
By default, the node template is configured with the predefined Alice account as the system `Root` origin account using the [Sudo pallet](/rustdocs/latest/pallet_sudo/index.html).

The front-end template exposes access the `Root` origin through the Sudo pallet by providing a clickable **SUDO** button.
If you invoke the `killName` function by clicking **Signed**, the call is dispatched by the Signed origin associated with Alice's account. 
Because the call requires the `Root` origin, an error is returned.

![`BadOrigin` Error](/media/images/docs/tutorials/specify-origin/kill-name-bad-origin.png)

Even though the function call was successfully dispatched, the `BadOrigin` error is emitted and displayed in the Events pane.
Alice's account is charged a fee for the dispatch, but there aren't any state changes because the Nicks pallet follows the important [verify-first-write-last](/v3/runtime/storage#verify-first-write-last) pattern.

If you invoke the `killName` function by clicking **SUDO**, the call is dispatched by the `Root` origin.

![Nicks Pallet Error](/media/images/docs/tutorials/specify-origin/clear-name-error.png)

The Sudo pallet emits a [`Sudid` event](/rustdocs/latest/pallet_sudo/enum.RawEvent.html#variant.Sudid) to inform network participants that the `Root` origin dispatched a call. 
However, the inner dispatch failed with a [`DispatchError`](/rustdocs/latest/sp_runtime/enum.DispatchError.html) (the Sudo pallet's [`sudo` function](/rustdocs/latest/pallet_sudo/pallet/enum.Call.html#variant.sudo) is the "outer" dispatch).
In particular, this was an instance of [the `DispatchError::Module` variant](/rustdocs/latest/frame_support/dispatch/enum.DispatchError.html#variant.Module), which reports two pieces of metadata: an `index` number and an `error` number.
The `index` number relates to the pallet from which the error originated; it corresponds with the _index_ (position) of the pallet within the `construct_runtime!` macro.
The `error` number corresponds with the index of the relevant variant from that pallet's `Error` enum.
When using these numbers to find pallet errors, remember that the _first_ position corresponds with index _zero_.
In the screenshot above, the `index` is `9` (the _tenth_ pallet) and the `error` is `2` (the _third_ error).
Depending on the position of the Nicks pallet in your `construct_runtime!` macro, you may see a different number for `index`.
Regardless of the value of `index`, you should see that the `error` value is `2`, which corresponds to the _third_ variant of the Nick's pallet's `Error` enum, [the `Unnamed` variant](/rustdocs/latest/pallet_nicks/enum.Error.html#variant.Unnamed).
This shouldn't be a surprise since Bob has not yet reserved a nickname, thus it cannot be cleared!

You should confirm that Alice can use the `SUDO` button to invoke the `killName` dispatchable and forcibly clear the nickname associated with any account (including her own) that actually has a nickname associated with it.
Here are some other things you may want to try:

- Add a nickname that is shorter than the `MinNickLength` or longer than the `MaxNickLength` that you configured with the Nick's pallet's `Config` configuration trait.
- Add a nickname for Bob then use Alice's account and the `SUDO` button to forcibly kill Bob's nickname.
  Switch back to Bob's account and dispatch the `clearName` function.

## Next steps

- We have [plenty of tutorials](/tutorials) to showcase Substrate development concepts and techniques.
- For more information about runtime development tips and patterns, refer to our [How-to Guides](/how-to-guides).
- For a bare FRAME pallet with detailed comments about what you can access within FRAME, see [this example in `substrate`](https://github.com/paritytech/substrate/tree/master/frame/examples/basic).

### References

- [The Cargo book](https://doc.rust-lang.org/stable/cargo/)
- [Rust and WebAssembly](https://rustwasm.github.io/)
