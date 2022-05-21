---
title: Remote procedure calls
description: Describes the use of remote procedure calls and RPC methods to interact with a Substrate node.
keywords:
  - rpc
  - frontend
---

Remote Procedure Calls, or RPCs, are a way for an external program—for example, a browser or front-end application—to communicate with a Substrate node.
They are used for checking storage values, submitting transactions, and querying the
current consensus authorities. 
Substrate comes with several [default RPCs](https://polkadot.js.org/docs/substrate/rpc/).
In many cases, it is useful to add custom RPCs to your node.

## RPC extension builder

To connect a custom RPC client to a Substrate node, you must provide a function known as an RPC extension builder.
This function takes a parameter for whether the node should accept or deny unsafe RPC calls, and returns an [`IoHandler`](/rustdocs/latest/node_rpc/type.IoHandler.html) that the node needs to create a JSON RPC. 
For more context, read more by looking at the [`RpcExtensionBuilder` trait API](/rustdocs/latest/sc_service/trait.RpcExtensionBuilder.html) documentation.

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

- [`author_submitExtrinsic`](/rustdocs/latest/sc_rpc/author/trait.AuthorApi.html#tymethod.submit_extrinsic) - allows submitting transactions to local pool.
- [`author_insertKey`](/rustdocs/latest/sc_rpc_api/author/trait.AuthorApi.html#tymethod.insert_key) - allows inserting private keys to local keystore.
- [`author_rotateKeys`](/rustdocs/latest/sc_rpc_api/author/trait.AuthorApi.html#tymethod.rotate_keys) - session keys rotation.
- [`author_removeExtrinsic`](/rustdocs/latest/sc_rpc_api/author/trait.AuthorApi.html#tymethod.remove_extrinsic) - remove and ban extrinsic from the pool.
- [`system_addReservedPeer`](/rustdocs/latest/sc_rpc_api/system/trait.SystemApi.html#tymethod.system_add_reserved_peer) - add reserved node.
- [`system_removeReservedPeer`](/rustdocs/latest/sc_rpc_api/system/trait.SystemApi.html#tymethod.system_remove_reserved_peer) - removed reserved node.

You should also avoid exposing RPC methods that can take a long time to execute, potentially blocking the client from syncing. 
For example, you should avoid using the following RPC methods:

- [`storage_keys_paged`](/rustdocs/latest/sc_rpc_api/state/trait.StateApi.html#tymethod.storage_keys_paged) - get all the keys in the state with a particular prefix and pagination support.
- [`state_getPairs`](/rustdocs/latest/sc_rpc_api/state/trait.StateApi.html#tymethod.storage_pairs) - get all the keys in the state with a particular prefix together with their values.

These RPCs are declared by using the `#[rpc(name = "rpc_method")]` macro, where `rpc_method` is be the name of the function—for example `author_submitExtrinsic` corresponding to [`submit_extrinsic`](/rustdocs/latest/sc_rpc/author/trait.AuthorApi.html#tymethod.submit_extrinsic).

It's critical to filter out these kind of calls if the requests are coming from untrusted users.
The way to do it is through a [JSON-RPC](/reference/glossary#json-rpc) proxy that is able to inspect calls and only pass allowed-set of APIs.

## RPCs for remote_externalities

There exists a special type of using RPCs in the context of `remote_externalities`.
The [`rpc_api`](/rustdocs/latest/remote_externalities/rpc_api/index.html) allows you to make one-off RPC calls to a Substrate node, useful for testing purposes with tools like [`try-runtime`](/reference/command-line-tools/try-runtime/) for example.

## Endpoints

When starting any Substrate node, these two endpoints are available to you:

- HTTP endpoint: http://localhost:9933/
- Websocket endpoint: ws://localhost:9944/

Most of the Substrate front-end libraries and tools use the more powerful WebSocket endpoint to interact with the blockchain. 
Through WebSockets, you can subscribe to the chain states, such as events, and receive push notifications whenever changes in your blockchain occur.

To call the `Metadata` endpoint, run this command alongside a running node:

```bash
curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "state_getMetadata"}' http://localhost:9933/
```

The return value of this command is not in human-readable format. For that, it needs to use [Type encoding (SCALE)](/reference/scale-codec/).

Each storage item has a relative storage key associated to it which is used to
[query storage](/main-docs/build/runtime-storage#querying-storage). This is how RPC endpoints know where to look.

## Examples

### `state_getMetadata`

RPC request:

```javascript
function get_metadata_request(endpoint) {
  let request = new Request(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'state_getMetadata',
    }),
    headers: { 'Content-Type': 'application/json' },
  })
  return request
}
```

Naive text decoding:

```javascript
function decode_metadata(metadata) {
  return new TextDecoder().decode(util.hexToU8a(metadata))
}
```

### `state_getStorage`

RPC request:

```json
Request:   {"id":1,"jsonrpc":"2.0","method":"state_getStorage",["{storage_key}"]}
```

Where `storage_key` is a parameter generated by the name of a pallet, function and key (optionally):

```javascript
function get_runtime_storage_parameter_with_key(
  module_name,
  function_name,
  key
) {
  // We use xxhash 128 for strings the runtime developer can control
  let module_hash = util_crypto.xxhashAsU8a(module_name, 128)
  let function_hash = util_crypto.xxhashAsU8a(function_name, 128)

  // We use blake2 256 for strings the end user can control
  let key_hash = util_crypto.blake2AsU8a(keyToBytes(key))

  // Special syntax to concatenate Uint8Array
  let final_key = new Uint8Array([
    ...module_hash,
    ...function_hash,
    ...key_hash,
  ])

  // Return a hex string
  return util.u8aToHex(final_key)
}
```

## Where to go next

- [Rust implementation of JSON-RPC](https://github.com/paritytech/jsonrpc)
- [Type encoding (SCALE)](/reference/scale-codec)
- [Runtime storage](/main-docs/build/runtime-storage/)
