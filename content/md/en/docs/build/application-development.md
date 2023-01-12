---
title: Application development
description: Examines how Substrate metadata and RPC libraries are used in building application interfaces.
keywords:
  - frontend
  - application
  - dApp
---

Most applications that run on a Substrate blockchain require some form of front-end or user-facing client to enable users or other programs to access and modify the data that the blockchain stores.
For example, you might develop a browser-based, mobile, or desktop application that allows users to submit transactions, post articles, or view their previous activity.
The backend for that application is configured in the runtime logic for your blockchain, but it's the front-end client that makes the runtime features accessible to your users.

## Exposing runtime information as metadata

To interact with a Substrate node or the information stored in the blockchain, you need to know something about the features the runtime exposes to the outside world.
As an application developer, you need to know a lot more about the runtime logic, including the following details:

- The version of the runtime that the application is connecting to.
- The pallets that are implemented for that specific runtime version.
- All of the functions and their type signatures that are defined in the pallets implemented for that specific runtime.
- All of the custom types that are defined in the pallets implemented for that specific runtime.
- The documentation that describes the parameters users can set.

To capture all of this information, every Substrate runtime has a metadata schema.
The metadata for a runtime describes all of the pallets and types that are defined for a specific version of the runtime.
For every pallet, the metadata includes information about its storage items, functions, events, errors, and constants.
The metadata also includes type definitions for custom types included in the runtime.

Because it provides a complete inventory of the runtime, the metadata is the key to enabling client applications to interact with the node, parse responses, and format message payloads.

## Generating metadata

To minimize the bandwidth required to transmit data over the network, the metadata schema is encoded using the [SCALE codec library](/reference/scale-codec/).
This encoding is done automatically for you when you compile a node by using the [`scale-info`](https://docs.rs/scale-info/latest/scale_info/) crate.

At a high level, generating the metadata involves the following steps:

- The runtime logic exposes all of the callable functions, types, parameters, and documentation that need to be encoded in the metadata.
- The `scale-info` crate annotates types across the runtime to build a registry of runtime types.
- The `frame-metadata` crate describes the structure of the runtime based on the type registry provided by `scale-info`.

## Getting metadata for a runtime

There are several ways you can get the metadata for a runtime.
For example, you can do any of the following:

- Use [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/rpc) to connect to a blockchain or node and select the **state** endpoint and the **getMetadata** method to return the metadata in JSON format.
- Use the command-line `polkadot-js-api` to call the `state_getMetadata` RPC method to return the metadata as a hex-encoded vector of SCALE-encoded bytes.
- Use the `subxt metadata` command to download the metadata in JSON, hex, or raw bytes.
- Use the `sidecar` API and `/runtime/metadata` endpoint to connect to a node and retrieve the metadata in JSON format.

The type information provided by the metadata enables applications to communicate with nodes with different versions of the runtime and across chains that expose different calls, events, types, and storage items.
The metadata also allows libraries to generate almost all of the code needed to communicate with a given Substrate node, enabling libraries like `subxt` to generate front-end interfaces that are specific to a target chain.

With this system, any runtime can be queried for its available runtime calls, types, and parameters.  
The metadata also exposes how a type is expected to be decoded, making it easier for an external application to retrieve and process this information.

## Metadata format

Although the SCALE-encoded bytes can be decoded using the [`frame-metadata`](https://paritytech.github.io/substrate/master/frame_metadata/index.html) and [`parity-scale-codec`](https://github.com/paritytech/parity-scale-codec) libraries, there are other tools—such as `subxt` and the Polkadot-JS API—that can convert the raw data to human-readable JSON format.

The types and type definitions included in the metadata returned by the `state_getMetadata` RPC call depend on the metadata version of the runtime.
In general, the metadata includes the following information:

- A hex-encoded number—`0x6d657461`—that represents **meta** in plain text.
- A hex-encoded 32-bit integer representing the version of the metadata format in use.
  For example, if the metadata is version 15, the hex-encoded representation is `0x0f`.
- Hex-encoded type definitions for all types used in the runtime generated by the `scale-info` crate.

The following example illustrates a section of metadata decoded and converted to JSON using [`subxt`](/reference/command-line-tools/subxt/):

```json
[
  1635018093, // the magic number
  {
    "V14": {
      // the metadata version
      "types": {
        // type information
        "types": []
      },
      "pallets": [
        // metadata exposes by pallets
      ],
      "extrinsic": {
        // the format of an extrinsic  and its signed extensions
        "ty": 111,
        "version": 4, // the transaction version used to encode and decode an extrinsic
        "signed_extensions": []
      },
      "ty": 125 // the type ID for the system pallet
    }
  }
]
```

As described above, the integer `1635018093` is a "magic number" that represents "meta" in plain text.
The rest of the metadata has two sections: `pallets` and `extrinsic`.
The `pallets` section contains information about the runtime's pallets, while the `extrinsic` section describes the version of extrinsics that the runtime is using.
Different extrinsic versions may have different formats, especially when considering [signed transactions](/fundamentals/transaction-types).

### Pallets

Here is a condensed example of a single element in the `pallets` array:

```json
{
  "name": "System", // name of the pallet, the System pallet for example
  "storage": {
    // storage entries
  },
  "calls": [
    // index for this pallet's call types
  ],
  "event": [
    // index for this pallet's event types
  ],
  "constants": [
    // pallet constants
  ],
  "error": [
    // index for this pallet's error types
  ],
  "index": 0 // the index of the pallet in the runtime
}
```

Every element contains the name of the pallet that it represents, as well as a `storage` object, `calls` array, `event` array, and `error` array.
If `calls` or `events` are empty, they will be represented as `null` and if `constants` or `errors` are empty, they will be represented as an empty array.

Type indices for each item are just `u32` integers used to access the type information for that item.
For example, the type ID for the `calls` in the System pallet is 145.
Querying the type ID will give you information about the available calls of the system pallet including the documentation for each call.
For each field, you can access type information and metadata for:

- [Storage metadata](https://docs.rs/frame-metadata/latest/frame_metadata/v14/struct.PalletStorageMetadata.html): provides blockchain clients with the information that is required to query [the storage RPC](https://paritytech.github.io/substrate/master/sc_rpc/state/trait.StateApiServer.html#tymethod.storage) to get information for a specific storage item.
- [Call metadata](https://docs.rs/frame-metadata/latest/frame_metadata/v14/struct.PalletCallMetadata.html): includes information about the runtime calls defined by the `#[pallet]` macro including call names, arguments and documentation.
- [Event metadata](https://docs.rs/frame-metadata/latest/frame_metadata/v14/struct.PalletEventMetadata.html): provides the metadata generated by the `#[pallet::event]` macro, including the name, arguments and documentation for a pallet's events
- Constants metadata provides metadata generated by the `#[pallet::constant]` macro, including the name, type and hex encoded value of the constant.
- [Error metadata](https://docs.rs/frame-metadata/latest/frame_metadata/v14/struct.PalletErrorMetadata.html): provides metadata generated by the `#[pallet::error]` macro, including the name and documentation for each error type in that pallet.

Note that the IDs used aren't stable over time: they will likely change from one version jump to the next, meaning that developers should avoid relying on fixed type IDs to future proof their applications.

### Extrinsic

[Extrinsic metadata](https://docs.rs/frame-metadata/latest/frame_metadata/v14/struct.ExtrinsicMetadata.html) is generated by the runtime and provides useful information on how a transaction is formatted.
The returned decoded metadata contains the transaction version and signed extensions, which looks like this:

```json
      "extrinsic": {
        "ty": 111,
        "version": 4,
        "signed_extensions": [
          {
            "identifier": "CheckSpecVersion",
            "ty": 117,
            "additional_signed": 4
          },
          {
            "identifier": "CheckTxVersion",
            "ty": 118,
            "additional_signed": 4
          },
          {
            "identifier": "CheckGenesis",
            "ty": 119,
            "additional_signed": 9
          },
          {
            "identifier": "CheckMortality",
            "ty": 120,
            "additional_signed": 9
          },
          {
            "identifier": "CheckNonce",
            "ty": 122,
            "additional_signed": 34
          },
          {
            "identifier": "CheckWeight",
            "ty": 123,
            "additional_signed": 34
          },
          {
            "identifier": "ChargeTransactionPayment",
            "ty": 124,
            "additional_signed": 34
          }
        ]
      }
```

The type system is composite, which means that each type ID contains a reference to some type or to another type ID that gives access to the associated primitive types.
For example one type we can encode is a `BitVec<Order, Store>` type: to decode it properly we need to know what the `Order` and `Store` types used were, which can be accessed used the "path" in the decoded JSON for that type ID.

## RPC APIs

Substrate comes with the following APIs to interact with a node:

- [`AuthorApiServer`](https://paritytech.github.io/substrate/master/sc_rpc/author/trait.AuthorApiServer.html): An API to make calls into a full node, including authoring extrinsics and verifying session keys.
- [`ChainApiServer`](https://paritytech.github.io/substrate/master/sc_rpc/chain/trait.ChainApiServer.html): An API to retrieve block header and finality information.
- [`OffchainApiServer`](https://paritytech.github.io/substrate/master/sc_rpc/offchain/trait.OffchainApiServer.html): An API for making RPC calls for offchain workers.
- [`StateApiServer`](https://paritytech.github.io/substrate/master/sc_rpc/state/trait.StateApiServer.html): An API to query information about on-chain state such as runtime version, storage items and proofs.
- [`SystemApiServer`](https://paritytech.github.io/substrate/master/sc_rpc/system/trait.SystemApiServer.html): An API to retrieve information about network state, such as connected peers and node roles.

## Connecting to a node

Querying a Substrate node can either be done by using a Hypertext Transfer Protocol (HTTP) or WebSocket (WS) based JSON-RPC client.
The main advantage of WS (used in most applications) is that a single connection can be reused for many messages to and from a node, whereas a typical HTTP connection allows only for a single message from, and then response to the client at a time.
For this reason, if you want to subscribe to some RPC endpoint that could lead to multiple messages being returned to the client, you must use a websocket connection and not an HTTP one.
Connecting via HTTP is commonly used for fetching data in offchain workers-learn more about that in [Offchain operations](/fundamentals/offchain-operations).

An alternative (and still experimental) way to connect to a Substrate node is by using `Substrate Connect`, which allows applications to spawn their own light clients and connect directly to the exposed JSON-RPC end-point.
These applications would rely on in-browser local memory to establish a connection with the light client.

## Start building

Parity maintains the following libraries built on top of the [JSON-RPC API](https://github.com/paritytech/jsonrpc) for interacting with a Substrate node:

- [subxt](https://github.com/paritytech/subxt) provides a way to create an interface for static front-ends built for specific chains.
- [Polkadot JS API](https://polkadot.js.org/) provides a library to build dynamic interfaces for any Substrate built blockchain.
- [Substrate Connect](https://github.com/paritytech/substrate-connect) provides a library and a browser extension to build applications that connect directly with an in-browser light client created for its target chain.
  As a library that uses the Polkadot JS API, Connect is useful for applications that need to connect to multiple chains, providing end users with a single experience when interacting with multiple chains for the same app.

## Front-end use cases

| Name | Description | Language | Use case |
| ---- | ----------- | -------- | -------- |
| [Polkadot JS API](https://polkadot.js.org/docs/api) | A Javascript library for interacting with a Substrate chain. | Javascript | Applications that need to dynamically adapt to changes in a node, such as for block explorers or chain-agnostic interfaces. |
| [Polkadot JS extension](https://polkadot.js.org/docs/extension/) | An API for interacting with a browser extension build with the Polkadot JS API. | Javascript | Browser extensions. |
| [`Substrate Connect`](https://paritytech.github.io/substrate-connect/) | A library for developers to build applications that act as their own light client for their target chain. It also provides a browser extension designed to connect to multiple chains from a single application (web or desktop browser). | Javascript | Any browser application. |
| [`subxt`](https://github.com/paritytech/subxt/) | Short for "submit extrinsics", `subxt` is a library that generates a statically typed Rust interface to interact with a node's RPC APIs based on a target chain's metadata. | Rust | Building lower level applications, such as non-browser graphic user interfaces, chain-specific CLIs or user facing applications that require type-safe communication between the node and the generated interface, preventing users from constructing transactions with bad inputs or submitting calls that don't exist. |
| [`txwrapper`](https://github.com/paritytech/txwrapper) | A Javascript library for offline generation of Substrate transactions. | Javascript | Write scripts to generate signed transactions to a node, useful for testing and decoding transactions. |

## Where to go next

- [Substrate Connect](https://github.com/paritytech/substrate-connect)
- [Install the front-end template](/tutorials/get-started/build-local-blockchain/#install-the-front-end-template)
- [Generate a metadata QR code](https://github.com/paritytech/metadata-portal)
- [Get backwards-compatible metadata (desub)](https://github.com/paritytech/desub)
