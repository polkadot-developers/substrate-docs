---
title: Remote procedure calls
description: Describes the use of remote procedure calls and RPC methods to interact with a Substrate node.
keywords:
  - rpc
  - frontend
---

Remote procedure calls, or RPC methods, are a way for an external program—for example, a browser or front-end application—to communicate with a Substrate node.
In general, these methods enable an RPC client to connect to an RPC server to request some type of service, such as reading a stored value, submitting a transaction, or querying the current consensus authorities.
You can access many of the [default RPC methods](https://polkadot.js.org/docs/substrate/rpc/) that Substrate exposes directly through the [Polkadot-JS API](https://polkadot.js.org/docs/api/).
However, you can also add custom RPC methods to your node.

## RPC extension builder

To connect a custom RPC client to a Substrate node, you must provide a function known as an RPC extension builder.
This function takes a parameter for whether the node should accept or deny unsafe RPC calls, and returns an [`IoHandler`](https://paritytech.github.io/substrate/master/node_rpc/type.IoHandler.html) that the node needs to create a JSON RPC.
For more context, read more by looking at the [`RpcExtensionBuilder` trait API](https://paritytech.github.io/substrate/master/sc_service/trait.RpcExtensionBuilder.html) documentation.

## RPC types

RPCs can be interfaces to a node's consensus mechanisms, or interfaces with any outside user to submit transactions to the blockchain.
In all cases, it's important to consider what endpoints RPCs expose.

Launch a node and run this command to see a full list of your node's RPC APIs:

```bash
curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "rpc_methods"}' http://localhost:9933/
```

### Public RPCs

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
- [`remove_extrinsic`](https://paritytech.github.io/substrate/master/sc_rpc_api/author/trait.AuthorApi.html#tymethod.remove_extrinsic) - remove and ban extrinsic from the pool.
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

Substrate also provides some specialized RPC methods to call [`remote_externalities`](https://paritytech.github.io/substrate/master/remote_externalities/rpc_api/index.html) for a node.
These specialized methods for remote externalities enable you to make one-off RPC calls to a Substrate node to get information about blocks and headers.
The information returned by these calls can be useful for testing purposes with tools like [`try-runtime`](/reference/command-line-tools/try-runtime/).

## Endpoints

When starting any Substrate node, these two endpoints are available to you:

- HTTP endpoint: `http://localhost:9933/`
- WebSocket endpoint: `ws://localhost:9944/`

Most of the Substrate front-end libraries and tools use the WebSocket endpoint to interact with the blockchain.
Through the WebSocket endpoint, you can subscribe to the chain states, such as events, and receive push notifications whenever changes in your blockchain occur.

To call the `Metadata` endpoint:

1. Open a terminal shell and change to the root directory for the Substrate node template.

1. Start the node locally in development mode by running the following command:
   
   ```bash
   ./target/release/node-template --dev
   ```

2. Connect to the local node and call the state_getMetadata endpoint by running the following command:
   
   ```bash
   curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "state_getMetadata"}' http://localhost:9933/
   ```
   
   This command returns the metadata in raw bytes rather than a human-readable format. 
For the return value to be human-readable, you can decode it using SCALE codec.
For more information about encoding and decoding information, see [Type encoding (SCALE)](/reference/scale-codec/).

Each storage item has a relative storage key associated to it which is used to [query storage](/main-docs/build/runtime-storage#querying-storage).
This is how RPC endpoints know where to look.

## Examples

### `state_getMetadata`

RPC request:

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
