---
title: Front-end development
description: Examines how Substrate metadata and RPC libraries are used in building application interfaces.
keywords:
---

Most applications that run on a Substrate blockchain require some form of front-end or user-facing interface—such as a browser, desktop, mobile, or hardware client—that enables users or other programs to access and modify the data that the blockchain stores.
For example, you might develop a browser-based application for interactive gaming or a hardware-specific application to implement a hardware wallet.
Different libraries exist to build these types of applications, depending on your needs.
This article explains the process of querying a Substrate node and using the metadata it exposes to help you understand how you can use the metadata when creating front-end client applications and using client-specific libraries.

## Metadata system

Substrate nodes provide an RPC call, `state_getMetadata`, that returns a complete description of all the types in the current runtime.
Client applications use the metadata to interact with the node, to parse responses, and to format message payloads sent to the node.
This metadata includes information about a pallet's storage items, transactions, events, errors, and constants.
The current metadata version (V14) differs significantly from its predecessors as it contains much richer type information.
If a runtime includes a pallet with a custom type, the type information is included as part of the metadata returned.
Polkadot uses V14 metadata starting from [runtime spec version 9110](https://polkascan.io/polkadot/runtime/9110) at [block number 7229126](https://polkadot.subscan.io/block/7229126) and Kusama from [runtime spec version 9111](https://polkascan.io/kusama/runtime/9111), at [block number 9625129](https://kusama.subscan.io/block/9625129).
This is useful to know for developers who intend to interact with runtimes that use older metadata versions.
Refer to [this document](https://gist.github.com/ascjones/0d81a4c44e84cacd9f714cd34a6de823) for a migration guide from V13 to V14.

The current metadata schema uses the [`scale-info`](https://docs.rs/scale-info/latest/scale_info/) crate to get type information for the pallets in the runtime when you compile a node.

The current implementation of the metadata requires front-end APIs to use the [SCALE codec library](./libraries#SCALE-Codec) to encode and decode RPC payloads to send and receive transactions.
The following steps summarize how metadata is generated, exposed, and used to make and receive calls from the runtime:

- Callable pallet functions, as well as types, parameters and documentation are exposed by the runtime.
- The `frame-metadata` crate describes the structure in which the information about how to communicate with the runtime will be provided.
  The information takes the form of a type registry provided by `scale-info`, as well as information about things like which pallets exist (and what the relevant types in the registry are for each pallet).
- The `scale-info` crate is used to annotate types across the runtime, and makes it possible to build a registry of runtime types. This type information is detailed enough that we can use it to find out how to correctly SCALE encode or decode some value for a given type.
- The structure described in `frame-metadata` is populated with information from the runtime, and this is then SCALE encoded and made available via the `state_getMetadata` RPC call.
- Custom RPC APIs use the metadata interface and provide methods to make calls into the runtime.
  A SCALE codec library is required to encode and decode calls and data to and from the API.

Every Substrate chain stores the version number of the metadata system they are using, which makes it useful for applications to know how to handle the metadata exposes by a certain block.
As previously mentioned, the latest metadata version (V14) provides a major enhancement to the metadata that a chain is able to generate.
But what if an application wants to interact with blocks that were created with an earlier version than V14?
Well, it would require setting up a front-end interface that follows the older metadata system, whereby custom types would need to be identified and manually included as part of the front-end's code.
Learn how to use the [`desub`](https://github.com/paritytech/desub) tool to accomplish this if you needed.

Type information bundled in the metadata gives applications the ability to communicate with nodes across different chains, each of which may each expose different calls, events, types and storage.
It also allows libraries to generate almost all of the code needed to communicate with a given Substrate node, giving the possibility for libraries like `subxt` to generate front-end interfaces that are specific to a target chain.

With this system, any runtime can be queried for its available runtime calls, types and parameters.  
The metadata also exposes how a type is expected to be decoded, making it easier for an external application to retrieve and process this information.

## Metadata format

Querying the `state_getMetadata` RPC function will return a vector of SCALE-encoded bytes which is decoded using the [`frame-metadata`](/rustdocs/latest/frame_metadata/index.html) and [`parity-scale-codec`](/rustdocs/latest/parity_scale_codec/index.html) libraries.

The hex blob returned by the `state_getMetadata` RPC depends on the metadata version, however will generally have the following structure:

- a hard-coded magic number, `0x6d657461`, which represents "meta" in plain text.
- a 32 bit integer representing the version of the metadata format in use, for example `14` or `0x0e` in hex.
- hex encdoded type and metadata information.
  In V14, this part would contain a registry of type information (generated by the `scale-info` crate).
  In previous versions, this part contained the number of pallets followed by the metadata each pallet exposes.

Here is a condensed version of decoded metadata for a runtime using the V14 metadata system (generated using [`subxt-cli`](./reference/command-line-tools/subxt-cli.md)):

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
Different extrinsic versions may have different formats, especially when considering [signed extrinsics](/v3/concepts/extrinsics).

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

- [Storage metadata](https://docs.substrate.io/rustdocs/latest/frame_metadata/v14/struct.PalletStorageMetadata.html): provides blockchain clients with the information that is required to query [the storage RPC](/rustdocs/latest/sc_rpc/state/struct.StateClient.html#method.storage) to get information for a specific storage item.
- [Call metadata](https://docs.substrate.io/rustdocs/latest/frame_metadata/v14/struct.PalletCallMetadata.html): includes information about the runtime calls are defined by the `#[pallet]` macro including call names, arguments and documentation.
- [Event metadata](https://docs.substrate.io/rustdocs/latest/frame_metadata/v14/struct.PalletEventMetadata.html): provdes the metadata generated by the `#[pallet::event]` macro, including the name, arguments and documentation for a pallet's events
- Constants metadata provides metadata generated by the `#[pallet::constant]` macro, including the name, type and hex encoded value of the constant.
- [Error metadata](https://docs.substrate.io/rustdocs/latest/frame_metadata/v14/struct.PalletErrorMetadata.html): provides metadata generated by the `#[pallet::error]` macro, including the name and documentation for each error type in that pallet.

Note that the IDs used aren't stable over time: they will likely change from one version jump to the next, meaning that developers should avoid relying on fixed type IDs to future proof their applications.

### Extrinsic

[Exrinsic metadata](https://docs.substrate.io/rustdocs/latest/frame_metadata/v14/struct.ExtrinsicMetadata.html) is generated by the runtime and provides useful information on how a transaction is formatted.
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

- [`AuthorApi`](https://paritytech.github.io/substrate/master/sc_rpc/author/trait.AuthorApi.html): An API to make calls into a full node, incuding authoring extrinsics and verifying session keys.
- [`ChainApi`](https://paritytech.github.io/substrate/master/sc_rpc/chain/trait.ChainApi.html): An API to retrieve block header and finality information.
- [`OffchainApi`](https://paritytech.github.io/substrate/master/sc_rpc/offchain/trait.OffchainApi.html): An API for making RPC calls for off-chain workers.
- [`StateApi`](https://paritytech.github.io/substrate/master/sc_rpc/state/trait.StateApi.html): An API to query information about on-chain state such as runtime version, storage items and proofs.
- [`SystemApi`](https://paritytech.github.io/substrate/master/sc_rpc/system/trait.SystemApi.html): An API to retrieve information about network state, such as connected peers and node roles.

## Connecting to a node

Querying a Substrate node can either be done by using a Hypertext Transfer Protocol (HTTP) or WebSocket (WS) based JSON-RPC client.
The main advantage of WS (used in most applications) is that a single connection can be reused for many messages to and from a node, whereas a typical HTTP connection allows only for a single message from, and then response to the client at a time.
For this reason, if you want to subscribe to some RPC endpoint that could lead to multiple messages being returned to the client, you must use a websocket connection and not an HTTP one.
Connecting via HTTP is commonly used for fetching data in off-chain workers-learn more about that [here]().

An alternative (and still experimental) way to connect to a Substrate node is by using `Substrate Connect`, which allows applications to spawn their own light clients and connect directly to the exposed JSON-RPC end-point.
These applications would rely on in-browser local memory to establish a connection with the light client.

## Start building

Parity maintains the following libraries built on top of the [JSON-RPC API](https://github.com/paritytech/jsonrpc) for interacting with a Substrate node:

- [subxt](./libraries#subxt): provides a way to create an interface for static front-ends built for specific chains.
- [Polkadot JS API](./libraries#polkadot-js): provides a library to build dynamic interfaces for any Substrate built blockchain.
- [Substrate Connect](./libraries#substrate-connect): provides a library and a browser extension to build applications that connect directly with an in-browser light client created for its target chain.
  As a library that uses the Polkadot JS API, Connect is useful for applications that need to connect to multiple chains, providing end users with a single experience when interacting with multiple chains for the same app.

## Learn more

- Learn how a transaction is formatted in Susbtrate
- Launch a front-end app using Substrate's front-end template
- Use a [QR code metadata generation tool](https://github.com/paritytech/metadata-portal) for offline signing devices
- Decode a Substrate node with backwards-compatible metadata with [desub](https://github.com/paritytech/desub)
