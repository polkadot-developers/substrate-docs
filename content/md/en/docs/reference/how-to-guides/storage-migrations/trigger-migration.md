---
title: Trigger migration
desciption: Trigger a storage migration using Polkadot-JS Apps
keywords:
  - storage migration
  - runtime
  - advanced
---

This simple guide presents the steps for triggering a runtime migration using [Polkadot-JS Apps](https://polkadot.js.org/apps/). It assumes that migration code is already written and that the new runtime has already been compiled.


## Add custom types

Put the new storage types in a `types.json` which you will need to trigger the migration using a UI. Our new types in JSON are:

```rust
{
  "Nickname": {
    "first": "BoundedVec<u8>",
    "last": "Option<BoundedVec<u8>>"
  }
}
```
In the Polkadot-js apps UI, go to Settings > Developer to add your custom types from types.json. You can either upload the file directly or paste the types right into the UI. Save it to add them.

## Increment the spec_version

Increment the `spec_version` to specify the new runtime version.
In the runtime/src/lib.rs locate the `runtime_version` macro.
```rust
 #[sp_version::runtime_version]
 pub const VERSION: RuntimeVersion = RuntimeVersion {
    //--snip
    spec_version: 100,
    //--snip
 }
```
Increment the spec_version to specify the new runtime version.
```rust
    spec_version: 101,
```

## Upload the runtime

Recompile your runtime with `cargo build --release` this generates a smaller build artifact that is better suited for submitting to the blockchain network.
The WebAssembly build artifacts are in the target/release/wbuild/node-template-runtime directory. For example, you should see the following WebAssembly artifacts:
```
    node_template_runtime.compact.compressed.wasm
    node_template_runtime.compact.wasm
    node_template_runtime.wasm
```
You now have a WebAssembly artifact that describes the modified runtime logic. To complete the upgrade, you need to submit a transaction that updates the node to use the upgraded runtime:

Go to `Developer > Extrinsic`, using the administrative account, select the `sudo` pallet and the `sudoUncheckedWeight(call, weight)` function.
Select `system` and `setCode(code)` as the call to make 
Click file upload, then select or drag and drop the compact and compressed WebAssembly file—`node_template_runtime.compact.compressed.wasm`—that you generated for the updated runtime (for example, `./target/release/wbuild/node-template-runtime/node_template_runtime.compact.wasm`).

Submit the transaction and after the transaction is included in a block, you will be able to see that the node template version number indicates that the runtime version is now 101.

If you have created a Nickname using the old storage you will be able now to query the chain state and see that this storage has been updated to the new structure, and you will be able to create now a Nickname with a first and last name.