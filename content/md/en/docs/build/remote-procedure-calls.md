---
title: Remote procedure calls
description: Describes the use of remote procedure calls and RPC methods to interact with a Substrate node.
keywords:
  - rpc
  - frontend
---

Remote procedure calls, or RPC methods, are a way for an external program—for example, a browser or front-end application—to communicate with a Substrate node. Substrate utilises JSON-RPC over similar protocols, due to it's comparative simplicity.

Before implementing JSON-RPC functionality, it is important to understand security and integrity related fundamentals and the associated risks. These are discussed in the following sections and are followed up with usage instructions.

## Common use-cases

The most common application of the RPC interface is developers that administer front-end applications (such as wallets, oracles, bridges, dApps, etc.) that require data to be submitted to and retrieved from the blockchain. These applications perform JSON-RPC function calls either against a node run locally by the end-user, or against a trusted JSON-RPC server.

Node operators also utilise the JSON-RPC interface to ensure that their nodes are configured properly and operating as expected, as well as making and monitoring configuration changes while the node is running.

## Defining functions

All JSON-RPC functions in this interface are put into related 'groups'. As the JSON-RPC is intended to be implemented in different capacities (ie, full node servers vs. lightweight clients), developers will likely want to limit what functions are available, such as in the case of a light client which will not require administrative functions for the node. 

The group a particular JSON-RPC function belongs to is indicated by the ``prefix_`` in its name. This prefix now must also include a version number. For example, in ``foo_v1_bar``, the prefix is ``foo_v1``. 

A group name must always include a version number. This version number is part of the group name itself, and consequently, ``foo_v1`` and ``foo_v2`` are recognised as two completely separate, unrelated, groups. Depending on the node implementation, only certain versions may be available to connecting clients.

For a complete list of groups, their contained functions, as well as current version numbers, see the [API specification](https://paritytech.github.io/json-rpc-interface-spec/api.html).

## Safe and unsafe RPC methods

### Unsafe (public) RPC methods (TO BE REVISED / COMPLETED)

Substrate nodes provide the following command-line options that allow you to expose the RPC interfaces publicly:

```bash
--ws-external
--rpc-external
--unsafe-ws-external
--unsafe-rpc-external
```

By default, the node will refuse to start if you try to expose an RPC interface and run a validator node at the same time.
The ``--unsafe-*`` flags allow you to suppress this security measure.
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

### Secure (safe) RPC methods

[TBD]

### --- BELOW CONTENT IS YET TO BE TESTED AND EDITED --

## RPCs for remote_externalities

Substrate also provides some specialized RPC methods to call [`remote_externalities`](https://paritytech.github.io/substrate/master/remote_externalities/rpc_api/index.html) for a node.
These specialized methods for remote externalities enable you to make one-off RPC calls to a Substrate node to get information about blocks and headers.
The information returned by these calls can be useful for testing purposes with tools like [`try-runtime`](/reference/command-line-tools/try-runtime/).

## Endpoints

When you start a Substrate node locally, there are two endpoints available by default:

- HTTP endpoint: `http://localhost:9933/`
- WebSocket endpoint: `ws://localhost:9944/`

Most of the Substrate front-end libraries and tools use the WebSocket endpoint to interact with the blockchain. If you use the Polkadot-JS application to connect to a local node or a public chain, your are typically connecting to the WebSocket endpoint. Depending on your specific usecase however, HTTP may be a more secure option.

WebSocket connections allow for bidirectional communication between the front-end application and the backend node responding to requests.
However, you can also call RPC methods individually without keeping an open communication channel by connecting to the HTTP endpoint using ``curl`` commands. For example, you can use ``curl`` commands to get system information or subscribe to a chain to receive notification when there are specific types of changes to the block state.

### Connecting to a HTTP endpoint

In order to call RPC methods using the HTTP endpoint:

1. Open a terminal shell and change to the root directory for the Substrate node template.

2. Start the node locally in development mode by running the following command:
   
   ```bash
   ./target/release/node-template --dev
   ```

3. Connect to the local node and call the `rpc_methods` endpoint by running the following command:
   
   ```bash
   curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "rpc_methods"}' http://localhost:9933/
   ```

    This command returns a list of the JSON-RPC methods exposed for the local node.

4. Call additional methods using the appropriate method name.
   
   For example, you can run the following command to get version information about the local node:

   ```bash
   curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "system_version"}' http://localhost:9933/
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

### Connect to the WebSocket endpoint

[TBC]

## Extend RPC methods with a custom module
Do you need to write a custom RPC call or can you use state_call? 
(See https://forum.parity.io/t/remove-rpcs-that-can-be-replaced-by-state-call/1070?)
Use case examples for when to write a custom RPC method and when to use state_call?

## Examples

### state_getMetadata

To get metadata for a local node, you can run the following command:

```bash
curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "state_getMetadata"}' http://localhost:9933/
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
