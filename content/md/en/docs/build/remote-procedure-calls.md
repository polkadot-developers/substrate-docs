---
title: Remote procedure calls
description: Describes the use of remote procedure calls and RPC methods to interact with a Substrate node.
keywords:
  - rpc
  - frontend
---

<div class="warning">
  <strong>⚠️ WARNING:</strong> This page may contain outdated information. Please refer to the <a href="https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/reference_docs/custom_runtime_api_rpc/index.html">Rust docs</a> for the most up-to-date documentation on this topic.
</div>

Remote procedure calls, or RPC methods, are a way for an external program—for example, a browser or front-end application—to communicate with a Substrate node.
In general, these methods enable an RPC client to connect to an RPC server endpoint to request some type of service.
For example, you might use an RPC method to read a stored value, submit a transaction, or request information about the chain a node is connected to.

The most convenient way to access the default [JSON-RPC methods](https://polkadot.js.org/docs/substrate/rpc/) for a Substrate node is through the [Polkadot-JS API](https://polkadot.js.org/docs/api/).

## Safe and unsafe RPC methods

It's important to be aware that RPC methods can provide access to core node operations, including consensus and storage, and can also be exposed as public interfaces to allow external users to submit transactions to or retrieve information from the blockchain.
Therefore, for the security of the blockchain, it's important to consider what different RPC methods expose and whether they should be restricted to running on a local node or made publicly available.

### Public RPC interfaces

Substrate nodes provide the following command-line options that allow you to expose the RPC interfaces publicly:

```bash
--ws-external
--rpc-external
--unsafe-ws-external
--unsafe-rpc-external
```

By default, the node will refuse to start if you try to expose an RPC interface and run a validator node at the same time.
The `--unsafe-*` flags allow you to suppress this security measure.
Exposing RPC interfaces can open up a huge surface of attacks and has to be carefully reviewed.

There are quite a few RPC methods that you can use to control the node's behavior, but you should avoid exposing.
For example, you should not expose the following RPC methods:

- [`submit_extrinsic`](https://paritytech.github.io/substrate/master/sc_rpc_api/author/trait.AuthorApiClient.html) - allows submitting transactions to local pool.
- [`insert_key`](https://paritytech.github.io/substrate/master/sc_rpc_api/author/trait.AuthorApiClient.html) - allows inserting private keys to local keystore.
- [`rotate_keys`](https://paritytech.github.io/substrate/master/sc_rpc_api/author/trait.AuthorApiClient.html) - session keys rotation.
- [`remove_extrinsic`](https://paritytech.github.io/substrate/master/substrate_rpc_client/trait.AuthorApi.html#method.remove_extrinsic) - remove and ban extrinsic from the pool.
- [`add_reserved_peer`](https://paritytech.github.io/substrate/master/sc_rpc_api/system/trait.SystemApiClient.html) - add reserved node.
- [`remove_reserved_peer`](https://paritytech.github.io/substrate/master/sc_rpc_api/system/trait.SystemApiClient.html) - removed reserved node.

You should also avoid exposing RPC methods that can take a long time to execute, potentially blocking the client from syncing.
For example, you should avoid using the following RPC methods:

- [`storage_keys_paged`](https://paritytech.github.io/substrate/master/sc_rpc_api/state/trait.StateApiClient.html) - get all the keys in the state with a particular prefix and pagination support.
- [`storage_pairs`](https://paritytech.github.io/substrate/master/sc_rpc_api/state/trait.StateApiClient.html) - get all the keys in the state with a particular prefix together with their values.

These RPCs are declared by using the `#[rpc(name = "rpc_method")]` macro, where `rpc_method` is be the name of the function, for example, `submit_extrinsic`.

It's critical to filter out these kind of calls if the requests are coming from untrusted users.
The way to do it is through a [JSON-RPC](/reference/glossary#json-rpc) proxy that is able to inspect calls and only pass an allowed set of API calls.

## RPCs for remote_externalities

Substrate also provides some specialized RPC methods to call [`remote_externalities`](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/utils/frame/remote-externalities/src/lib.rs#L347-#L746) for a node.
These specialized methods for remote externalities enable you to make one-off RPC calls to a Substrate node to get information about blocks and headers.
The information returned by these calls can be useful for testing purposes with tools like [`try-runtime`](/reference/command-line-tools/try-runtime/).

## Endpoints

When you start a Substrate node locally, there is one endpoint available by default:

- HTTP & WebSocket endpoint: `ws://localhost:9944/`

Most of the Substrate front-end libraries and tools use the endpoint to interact with the blockchain.
For example, if you use the Polkadot-JS application to connect to a local node or a public chain, your are typically connecting to the HTTP & WebSocket endpoint.
WebSocket connections allow for bidirectional communication between the front-end application and the backend node responding to requests.
However, you can also call RPC methods individually without keeping an open communication channel by connecting to the endpoint using `curl` commands.
For example, you can use curl commands to get system information or subscribe to a chain to receive notification when there are specific types of changes to the block state.

To call RPC methods using the endpoint:

1. Open a terminal shell and change to the root directory for the Substrate node template.

2. Start the node locally in development mode by running the following command:

   ```bash
   ./target/release/node-template --dev
   ```

3. Connect to the local node and call the `rpc_methods` endpoint by running the following command:

   ```bash
   curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "rpc_methods"}' http://localhost:9944/
   ```

   This command returns a list of the JSON-RPC methods exposed for the local node.

4. Call additional methods using the appropriate method name.

   For example, you can run the following command to get version information about the local node:

   ```bash
   curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "system_version"}' http://localhost:9944/
   ```

   In most cases, connecting to the RPC endpoint directly returns JSON-formatted results.
   For example:

   ```bash
   {"jsonrpc":"2.0","result":"4.0.0-dev-de262935ede","id":1}
   ```

For the return value to be human-readable, you can decode it using SCALE codec.
For more information about encoding and decoding information, see [Type encoding (SCALE)](/reference/scale-codec/).

Each storage item has a relative storage key associated to it which is used to [query storage](/main-docs/build/runtime-storage#querying-storage).
This is how RPC endpoints know where to look.

## Examples

### state_getMetadata

To get metadata for a local node, you can run the following command:

```bash
curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "state_getMetadata"}' http://localhost:9944/
```

This command returns the metadata in hex-encoded bytes rather than a human-readable format.
The JavaScript for this RPC request looks like this:

```javascript
function get_metadata_request(endpoint) {
  let request = new Request(endpoint, {
    method: "POST",
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "state_getMetadata",
    }),
    headers: { "Content-Type": "application/json" },
  });
  return request;
}
```

Naive text decoding:

```javascript
function decode_metadata(metadata) {
  return new TextDecoder().decode(util.hexToU8a(metadata));
}
```

### `state_getStorage`

RPC request:

```json
Request:   {"id":1,"jsonrpc":"2.0","method":"state_getStorage",["{storage_key}"]}
```

Where `storage_key` is a parameter generated by the name of a pallet, function and key (optionally):

```javascript
function get_runtime_storage_parameter_with_key(module_name, function_name, key) {
  // We use xxhash 128 for strings the runtime developer can control
  let module_hash = util_crypto.xxhashAsU8a(module_name, 128);
  let function_hash = util_crypto.xxhashAsU8a(function_name, 128);

  // We use blake2 256 for strings the end user can control
  let key_hash = util_crypto.blake2AsU8a(keyToBytes(key));

  // Special syntax to concatenate Uint8Array
  let final_key = new Uint8Array([...module_hash, ...function_hash, ...key_hash]);

  // Return a hex string
  return util.u8aToHex(final_key);
}
```

## Where to go next

- [Rust implementation of JSON-RPC](https://github.com/paritytech/jsonrpc)
- [Type encoding (SCALE)](/reference/scale-codec)
- [Runtime storage](/main-docs/build/runtime-storage/)
