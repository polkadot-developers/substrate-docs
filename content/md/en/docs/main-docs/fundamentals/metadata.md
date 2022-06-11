---
title: Metadata
description:
keywords: []
---

Blockchains you build on Substrate expose metadata in order to make it easier to interact with them. This metadata is separated by the different [pallets](/fundamentals/runtime-intro) that inform your blockchain.

For each pallet, the metadata provides information about the [storage items](/build/runtime-storage), [extrinsic calls](/fundamentals/transaction-types), [events](/build/events-and-errors), constants, and errors that are exposed by that pallet. Substrate automatically generates this metadata for you and makes it available through RPC calls.

Since the runtime of a Substrate blockchain is an evolving part of the blockchain's state,
blockchain metadata is stored on a per-block basis. 
Be aware that querying the metadata for an older block (with an archive node, for example) could result in acquiring out-of-date metadata that is not compatible with a blockchain's current state. 
As described in [Forkless upgrades](/build/upgrade), metadata for a chain should only change when the chain's [runtime `spec_version`](/rustdocs/latest/sp_version/struct.RuntimeVersion.html#structfield.spec_version) changes.

All examples in this document were taken from block 1,768,321 on Kusama. You can look at the
[full metadata](https://gist.github.com/insipx/db5e49c0160b1f1bd421a3c34fefdf48) before reading the rest of this document and continue to refer to it as you proceed.

## Get the metadata

There are a number of language-specific libraries that you can use to fetch metadata from a
Substrate node, as well as language-agnostic HTTP and WebSocket APIs.

### Rust

The easiest way to get the metadata is by querying the automatically-generated JSON-RPC function `state_getMetadata`. This will return a vector of SCALE-encoded bytes. You can decode this using the [`frame-metadata`](/rustdocs/latest/frame_metadata/index.html) and
[`parity-scale-codec`](/rustdocs/latest/parity_scale_codec/index.html) libraries.

Some helpful libraries like [`substrate-subxt`](https://github.com/paritytech/substrate-subxt) fetch the metadata and decode them for you. Once decoded, the structure may be serialized into JSON with [`serde`](https://serde.rs/). If you'd prefer to use the RPC more directly, you can use the [JSONRPC](https://github.com/paritytech/jsonrpc) and [jsonrpsee](https://github.com/paritytech/jsonrpsee) Rust libraries.

### JavaScript

If you are using JavaScript, [`polkadot-js/api`](https://polkadot.js.org/api/) provides APIs
to interact with a Substrate blockchain, including the [`getMetadata`](https://polkadot.js.org/docs/substrate/rpc#getmetadataat-blockhash-metadata) function.

You can use the following code snippets to fetch the metadata in this
[Polkadot-JS App - JavaScript page](https://polkadot.js.org/apps/#/js):

```javascript
const metadata = await api.rpc.state.getMetadata()
console.log('version: ' + metadata.version)
console.log('Magic number: ' + metadata.magicNumber)
console.log('Metadata: ' + JSON.stringify(metadata.asLatest.toHuman(), null, 2))
```

### HTTP & websocket APIs

Substrate nodes expose [a JSON-RPC API](/rustdocs/latest/sc_rpc/index.html) that you can
access by way of **HTTP** or **WebSocket** requests. The message to
[request metadata](/rustdocs/latest/sc_rpc/state/struct.StateClient.html#method.metadata)
from a node looks like this:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "state_getMetadata",
  "params": []
}
```

You can leave `params` empty, or if you want to fetch the metadata for a specific block, provide the
block's hash:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "state_getMetadata",
  "params": [
    "0xca15c2f1e1540517697b6b5f2cc6bc0c60876a1a1af604269b7215970798bbed"
  ]
}
```

In the example above, `0xca15c2f1e1540517697b6b5f2cc6bc0c60876a1a1af604269b7215970798bbed` is the
hash of block 1,768,321.

The response has the following format:

```json
{
  "jsonrpc": "2.0",
  "result": "0x6d6574610b7c1853797374656d011853797374656d3c1c4163636f756e7401010230543a3a4163636f756e744964944163...",
  "id": 1
}
```

The `result` field contains the blockchain metadata as a [SCALE-encoded](/reference/scale-codec) hexadecimal string.
The example above represents the actual value that is returned for block
1,768,321.
You can check for yourself by using a WebSocket client to query a node. 
Continue reading to learn more about the format of this encoded blob as well as
[its decoded format](https://gist.githubusercontent.com/insipx/db5e49c0160b1f1bd421a3c34fefdf48/raw/2c33ff080bec84f0627610124c732deb30a0adc7/meta_block_1768321.json).

## Metadata formats

This section will briefly review the SCALE-encoded metadata that is represented as a hexadecimal
string before taking a more detailed look at the metadata's decoded format.

### Encoded metadata format

The hex blob that is returned by the JSON-RPCs `state_getMetadata` method starts with a hard-coded
magic number, `0x6d657461`, which represents "meta" in plain text. The next piece of data (`0x0b` in
the example above) represents the metadata version; decoding the hexadecimal value `0x0b` yields the
decimal value 11, which is
[the version of the Substrate metadata format](/rustdocs/latest/frame_metadata/enum.RuntimeMetadata.html)
that the result encodes. After the metadata version, the next piece of information encoded in the
result field is the number of pallets that inform the blockchain's runtime; in the example above,
the hexadecimal value `0x7c` represents the decimal number 31, which is SCALE-encoded by taking its
binary representation (`11111` or `0x1F` in hex), shifting it two bits to the left (`1111100`) and
encoding that as hex.

The remaining blob encodes
[the metadata of each pallet](/rustdocs/latest/frame_metadata/struct.ModuleMetadata.html),
which will be reviewed below as well as some
[extrinsic metadata](/rustdocs/latest/frame_metadata/struct.ExtrinsicMetadata.html), which
is mostly out of the scope of this document.

### Decoded metadata format

Here is a condensed version of decoded metadata:

```json
{
  "magicNumber": 1635018093,
  "metadata": {
    "V12": {
      "modules": [
        {
          // ...
        },
        {
          // ...
        }
      ],
      "extrinsic": {
        "version": 4,
        "signedExtensions": [
          "CheckSpecVersion",
          "CheckTxVersion",
          "CheckGenesis",
          "CheckMortality",
          "CheckNonce",
          "CheckWeight",
          "ChargeTransactionPayment"
        ]
      }
    }
  }
}
```

As described above, the integer `1635018093` is a "magic number" that represents "meta" in plain
text. The rest of the metadata has two sections: `modules` and `extrinsic`. The `modules` section
contains information about the runtime's pallets, while the extrinsic section describes the version
of extrinsics that the runtime is using. Different extrinsic versions may have different formats,
especially when considering [signed transactions](/fundamentals/transaction-types).

#### Modules

Here is a condensed example of a single element in the `modules` array:

```json
{
  "name": "System",
  "storage": {
    // ..
  },
  "calls": [
    // ..
  ],
  "events": [
    // ..
  ],
  "constants": [
    // ..
  ],
  "errors": [
    // ..
  ],
  "index": 0
}
```

Every element contains the name of the pallet that it represents, as well as a `storage` object,
`calls` array, `events` array, and `errors` array.

If `calls` or `events` are empty, they are represented as `null`.
If `constants` or `errors` are empty, they are represented as an empty array.

##### Storage

Here is a condensed example of a single element in the `modules` array that highlights metadata
about the module's storage:

```json
{
  "name": "System",
  "storage": {
    "prefix": "System",
    "items": [
      {
        "name": "Account",
        "modifier": "Default",
        "type": {
          "Map": {
            "hasher": "Blake2_128Concat",
            "key": "AccountId",
            "value": "AccountInfo",
            "linked": false
          }
        },
        "fallback": "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "documentation": [
          " The full account information for a particular account ID."
        ]
      },
      {
        "name": "ExtrinsicCount"
        // ..
      },
      {
        "name": "AllExtrinsicsLen"
        // ..
      }
    ]
  },
  "calls": [
    /*...*/
  ],
  "events": [
    /*...*/
  ],
  "constants": [
    /*...*/
  ],
  "errors": [
    /*...*/
  ],
  "index": 0
}
```

Every storage item that is defined in a pallet will have a corresponding metadata entry.
Metadata entries like these are generated from [macros](/reference/frame-macros) using associated types from the [`frame-system`](/rustdocs/latest/frame_system/pallet/trait.Config.html) crate. For example:

```rust
#[pallet::config]
pub trait Config: frame_system::Config {
	#[pallet::constant]
	type Foo: Get<u32>;
}
```

[Storage metadata](/rustdocs/latest/frame_metadata/struct.StorageMetadata.html) provides blockchain clients with the information that is required to query
[the JSON-RPC's storage function](/rustdocs/latest/sc_rpc/state/struct.StateClient.html#method.storage)
to get information for a specific storage item.

##### Dispatchable calls

Metadata for dispatchable calls includes information about the runtime calls are defined by the
`#[pallet]` macro. For each call, the metadata includes:

- `name`: Name of the function in the pallet.
- `args`: Arguments in function definition. Includes the name and type of each argument.
- `documentation`: Documentation of the function.

For example:

```rust
#[pallet::call]
impl<T: Config> Pallet<T> {

  /// This function does some thing.
  ///
  /// All documentation details go here.
  pub(super) fn do_something(
    origin: OriginFor<T>,
    #[pallet::compact] thing: T::Something
  ) -> DispatchResultWithPostInfo {
    // ... snip
  }
}
```

This materializes in the metadata as follows:

```json
"calls": [
  {
    "name": "do_something",
    "args": [
      {
        "name": "thing",
        "ty": "Compact<T::Something>"
      }
    ],
    "documentation": [
      " This function does some thing.",
      "",
      " All documentation details go here."
    ]
  }
],
```

##### Events

This metadata snippet is generated from this declaration in `frame-system`:

```rust
#[pallet::event]
#[pallet::metadata(T::AccountId = "AccountId")]
pub enum Event<T: Config> {
  /// An extrinsic completed successfully.
  ExtrinsicSuccess(DispatchInfo, T::AccountId),
  /// An extrinsic failed.
  ExtrinsicFailed(DispatchError, DispatchInfo),
  // ... snip
}

```

Substrate's metadata would describe these events as follows:

```json
"events": [
  {
    "name": "ExtrinsicSuccess",
    "args": [
      "DispatchInfo",
      "AccountId"
    ],
    "documentation": [
      " An extrinsic completed successfully."
    ]
  },
  {
    "name": "ExtrinsicFailed",
    "args": [
      "DispatchError",
      "DispatchInfo"
    ],
    "documentation": [
      " An extrinsic failed."
    ]
  },
],
```

##### Constants

The metadata will include any module constants. For example in [`pallet-babe`](https://github.com/paritytech/substrate/blob/master/frame/babe/):

```rust
#[pallet::config]
	#[pallet::disable_frame_system_supertrait_check]
	pub trait Config: pallet_timestamp::Config {
		/// The amount of time, in slots, that each epoch should last.
		/// NOTE: Currently it is not possible to change the epoch duration after
		/// the chain has started. Attempting to do so will brick block production.
		#[pallet::constant]
		type EpochDuration: Get<u64>;
```

The metadata for this constant looks like this:

```json
"constants": [
  {
    "name": "EpochDuration",
    "type": "u64",
    "value": "0x6009000000000000",
    "documentation": [
      " The amount of time, in slots, that each epoch should last.",
      " NOTE: Currently it is not possible to change the epoch duration after",
      "the chain has started. Attempting to do so will brick block production."
    ]
  },
]
```

The metadata also includes constants defined in the runtime's `lib.rs`. For example, from Kusama:

```rust
parameter_types! {
    pub const EpochDuration: u64 = EPOCH_DURATION_IN_BLOCKS as u64;
}
```

Where `EPOCH_DURATION_IN_BLOCKS` is a constant defined in `runtime/src/constants.rs`.

##### Errors

Metadata will pull all the possible runtime errors from `#[pallet::error]`. For example, from
`frame-system`:

```rust
#[pallet::error]
pub enum Error<T> {
        /// The name of specification does not match between the current runtime
        /// and the new runtime.
        InvalidSpecName,
        // ... snip
    }
```

This will expose the following metadata:

```json
"errors": [
  {
    "name": "InvalidSpecName",
    "documentation": [
      " The name of specification does not match between the current runtime",
      " and the new runtime."
    ]
  },
  // ...
]
```

These are errors that could occur during the submission or execution of an extrinsic. In this case,
the FRAME System pallet is declaring that it may raise the
the [`InvalidSpecName` error](/rustdocs/latest/frame_system/pallet/enum.Error.html#variant.InvalidSpecName).

## Where to go next

- [Storage](/build/runtime-storage)
- [SCALE](/reference/scale-codec)
- [Macros](/reference/frame-macros)
- [Events](/build/events-and-errors)
- [Metadata](/rustdocs/latest/frame_metadata/index.html)
- [FRAME v2 macro documentation](/rustdocs/latest/frame_support/attr.pallet.html)
