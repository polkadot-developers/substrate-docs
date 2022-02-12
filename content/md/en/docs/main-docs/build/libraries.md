---
title: Libraries
description: 
keywords:
---

This article goes over the different libraries available for building blockchains with Substrate. 

## Core libraries

At a high level, Substrate's core libraries consists of libraries to build: clients, runtimes and the communication layer between the two. 



                                ┌────────────────────────┐
                                │ Client                 │
                                │                        │
                                │                        │
                                │                        │
                                │     ┌──────────────────┤
                                │     │ Primitives       │
                                │     │                  │
                                │     │     ┌────────────┤
                                │     │     │            │
                                │     │     │            │
                                │     │     │   Runtime  │
                                └─────┴─────┴────────────┘

> _TODO: Diagram is a rough sketch. Each part is not meant to be interpreted as nested, rather that "primitives" enable communication between the Clients and Runtimes. Need to annotate diagram with below:_

> - **Client**: Libraries that enable the client and networking layer, including consensus and block execution. 
> - **Primitives**: Libraries responsible for communicating between the client and the runtime, creating the transaction pool and building blocks for the block executor.
> - **FRAME**: Libraries to facilitate building runtime logic and encoding and decoding information passing to and from the runtime.

Each of these components are built from Rust libraries that fall under four categories:

- `sc_*`: Substrate client libraries encapsulate the numerous crates for node and client facing infrastructure, including consensus critical infrastructure, P2P networking, RPC APIs and block execution.
For example, [`sc_service`](https://docs.substrate.io/rustdocs/latest/sc_service/index.html) is responsible for building the networking layer for Substrate blockchains, managing the communication between the network, client and transaction pool. 

- `sp_*`: Substrate primitives are libraries to facilitate communication between the client and the runtime. 
For example, [`sp_std`](https://docs.substrate.io/rustdocs/latest/sp_std/index.html) takes useful primitives from Rust's standard library and makes them usable with any code that depends on the runtime.

- `frame_*`: runtime SDK libraries for building use case specific runtime logic and calling to and from a runtime.
For example, [`frame_support`](https://docs.substrate.io/rustdocs/latest/frame_support/index.html) enables developers to easily declare runtime storage items, errors and events and [`frame_system`](https://docs.substrate.io/rustdocs/latest/frame_system/index.html) acts as the base layer for other pallets to interact with other Substrate components.

- `pallet_*`: a single FRAME module, of which exists an [existing collection](/frame-pallets) created for Polkadot and Kusama. 
Other pallet libraries exist such as the [Open Runtime Module Library (ORML)](https://github.com/open-web3-stack/open-runtime-module-library).

Although it is possible to build an alternative to [FRAME](./link-to-frame) using the primitives exposed by Substrate's core libraries, there has not yet been any significant community efforts to do so yet and FRAME remains the easiest and most reliable way to compose Substrate runtimes.

## SCALE codec

SCALE (Simple Concatenated Aggregate Little-Endian) Codec is a lightweight, efficient, binary serialization and deserialization [codec](https://en.wikipedia.org/wiki/Codec).
This is key to how runtimes and clients can communicate to eachother.

It is designed for high-performance, copy-free encoding and decoding of data in resource-constrained execution contexts, like the [Substrate Wasm runtime](/v3/concepts/runtime). 
It is not self-describing in any way and assumes the decoding context has all type knowledge about the encoded data.
Front-end libraries maintained by Parity use the [`parity-scale-codec`](https://github.com/paritytech/parity-scale-codec) crate (a Rust implementation of the SCALE Codec) to encode and decode interactions between RPCs and the runtime.

SCALE codec is advantageous for Substrate and blockchain systems because:

- It is lightweight relative to generic serialization frameworks like [serde](https://serde.rs/), which add significant boilerplate that can bloat the size of the binary.
- It does not use Rust `libstd` making it compatible with `no_std` environments that compile to Wasm, such as the Substrate runtime.
- It is built to have great support in Rust for deriving codec logic for new types using: `#[derive(Encode, Decode)]`.

It's important to define the encoding scheme used in Substrate rather than reuse an existing Rust codec library because this codec needs to be re-implemented on other platforms and languages that want to support interoperability among Substrate blockchains.

The table below shows how the Rust implementation of Parity's SCALE codec encodes different types.

**SCALE codec examples of different types**

| Type   | Description  | Example SCALE encoded value  | SCALE decoded value  |   |
|---|---|---|---|---|
| Fixed-width integers  | Basic integers are encoded using a fixed-width little-endian (LE) format. | `signed 8-bit integer 69`  | `0x45` |   |
|   |   | `unsigned 16-bit integer 42`  | `0x2a00`  |   |
|   |   | `unsigned 32-bit integer 16777215`  | `0xffffff00` |   |
| Compact/general integers[^1] | A "compact" or general integer encoding is sufficient for encoding large integers (up to 2\*\*536) and is more efficient at encoding most values than the fixed-width version. (Though for single-byte values, the fixed-width integer is never worse.) | `unsigned integer 0` | `0x00` |   |
|   |   |   | `unsigned integer 1`  | `0x04` |
|   |   |   | `unsigned integer 42`  | `0xa8` |
|   |   |   | `unsigned integer 69`  | `0x1501` |
|   |   |   | `unsigned integer 65535`  | `0xfeff0300` |
|   |   |   | `BigInt(100000000000000)`  | `0x0b00407a10f35a` |
| Boolean  | Boolean values are encoded using the least significant bit of a single byte. | `false`  | `0x00`  |   |
|          |   | `true`  | `0x01`  |   |
| Results [^2] | Results are commonly used enumerations which indicate whether certain operations were successful or unsuccessful. | `Ok(42)`  | `0x002a`  |   |
|          |   | `Err(false)`  | `0x0100`  |   |
| Options [^3] | One or zero values of a particular type.   | `Some`  | `0x01` followed by the encoded value.  |   |
|           |          | `None`       | `0x00`   |    |
|           |          | `true`       |  `0x01`  |    |
|           |          | `false`      |  `0x02`  |    | 
| Vectors (lists, series, sets)          |  A collection of same-typed values is encoded, prefixed with a _compact_ encoding of the number of items, followed by each item's encoding concatenated in turn.     | Vector of unsigned 16-bit integers: `[4, 8, 15, 16, 23, 42]`    |  `0x18040008000f00100017002a00`  |    | 
| Strings       |  Strings are Vectors of bytes (`Vec<u8>`) containing a valid UTF8 sequence.   |     |      |    | 
| Tuples        | A fixed-size series of values, each with a possibly different but predetermined and fixed type. This is simply the concatenation of each encoded value. | Tuple of compact unsigned integer and boolean: `(3, false)` | `0x0c00`  |    | 
| Structs       | For structures, the values are named, but that is irrelevant for the encoding (names are ignored - only order matters). All containers store elements consecutively. The order of the elements is not fixed, depends on the container, and cannot be relied on at decoding. This implicitly means that decoding some byte-array into a specified structure that enforces an order and then re-encoding it could result in a different byte array than the original that was decoded. | A `SortedVecAsc<u8>` structure that always has byte-elements in ascending order: `SortedVecAsc::from([3, 5, 2, 8])`  | `[3, 2, 5, 8]` |    | 
| Enumerations (tagged-unions)    | A fixed number of variants, each mutually exclusive and potentially implying a further value or series of values. Encoded as the first byte identifying the index of the variant that the value is. Any further bytes are used to encode any data that the variant implies. Thus, no more than 256 variants are supported. | `Int(42)` and `Bool(true)` where `enum IntOrBool { Int(u8), Bool(bool),}` | `0x002a` and `0x0101` |    | 

Footnotes:

[^1]: Compact/general integers are encoded with the two least significant bits denoting the mode:

- `0b00`: single-byte mode; upper six bits are the LE encoding of the value (valid only for values
of 0-63).
- `0b01`: two-byte mode: upper six bits and the following byte is the LE encoding of the value
(valid only for values `64-(2**14-1)`).
- `0b10`: four-byte mode: upper six bits and the following three bytes are the LE encoding of the
value (valid only for values `(2**14)-(2**30-1)`).
- `0b11`: Big-integer mode: The upper six bits are the number of bytes following, plus four. The
value is contained, LE encoded, in the bytes following. The final (most significant) byte must be
non-zero. Valid only for values `(2**30)-(2**536-1)`.

[^2]: Results are encoded as:

- `0x00` if the operation was successful, followed by the encoded value.
- `0x01` if the operation was unsuccessful, followed by the encoded error.

[^3]: Options are encoded as:

- `0x00` if it is `None` ("empty" or "null").
- `0x01` followed by the encoded value if it is `Some`.
- Exception: in the case that the type is a boolean, then it is always one byte.

SCALE Codec has been implemented in other languages, including:

- Python: [`polkascan/py-scale-codec`](https://github.com/polkascan/py-scale-codec)
- Golang: [`itering/scale.go`](https://github.com/itering/scale.go)
- C: [`MatthewDarnell/cScale`](https://github.com/MatthewDarnell/cScale)
- C++: [`soramitsu/scale-codec-cpp`](https://github.com/soramitsu/scale-codec-cpp)
- JavaScript: [`polkadot-js/api`](https://github.com/polkadot-js/api)
- AssemblyScript: [`LimeChain/as-scale-codec`](https://github.com/LimeChain/as-scale-codec)
- Haskell: [`airalab/hs-web3`](https://github.com/airalab/hs-web3/tree/master/packages/scale)
- Java: [`emeraldpay/polkaj`](https://github.com/emeraldpay/polkaj)
- Ruby: [`itering/scale.rb`](https://github.com/itering/scale.rb)

## Front-end libraries

There are a number of client libraries that can be used to interact with [Substrate nodes](/link-to-architecture-page) to build application specific clients or front-ends.
In general, the capabilities that these libraries expose are implemented on top of [Substrate remote procedure call (RPC) APIs](./frontend#RPC-APIs).

### Parity maintained

| Name | Description  | Language  | Use case  |   
|---|---|---|---|
| [Polkadot JS API](https://polkadot.js.org/docs/api) | A Javascript library for interacting with a Substrate chain. | Javascript | Applications that need to dynamically adapt to changes in a node, such as for block explorers or chain-agnostic interfaces. 
| [Polkadot JS extension](https://polkadot.js.org/docs/extension/) | An API for interacting with a browser extension build with the Polkadot JS API. | Javascript | Browser extensions.
| [`Substrate Connect`](https://paritytech.github.io/substrate-connect/) | A library for developers to build applications that act as their own light client for their target chain. It also provides a browser extension designed to connect to multiple chains from a single application (web or desktop browser). | Javascript | Any browser application.
| [`subxt`](https://github.com/paritytech/subxt/) | Short for "submit extrinsics", `subxt` is a library that generates a statically typed Rust interface to interact with a node's RPC APIs based on a target chain's metadata. | Rust | Building lower level applications, such as non-browser graphic user interfaces, chain-specific CLIs or user facing applications that require type-safe communication between the node and the generated interface, preventing users from constructing transactions with bad inputs or submitting calls that don't exist. 
| [`txwrapper`](https://github.com/paritytech/txwrapper) | A Javascript library for offline generation of Substrate transactions. | Javascript | Write scripts to generate signed transactions to a node, useful for testing and decoding transactions.

### Community maintained

| Name | Description  | Maintainer |
|---|---|---|
| [Go Substrate RPC Client](https://github.com/centrifuge/go-substrate-rpc-client/) | A Go library that provides APIs and types around Polkadot and any Substrate-based chain RPC calls. | [Centrifuge](https://centrifuge.io/) 
| [Polkadot API DotNet](https://github.com/usetech-llc/polkadot_api_dotnet) | A Substrate RPC client library for .NET developers. |[Usetech](https://usetech.com/blockchain/)
| [Polkadot API CPP](https://github.com/usetech-llc/polkadot_api_cpp) | A C++ library for interacting with the Substrate RPC. | [Usetech](https://usetech.com/blockchain/)
| [Python Substrate Interface](https://github.com/polkascan/py-substrate-interface) | A Python library for interacting with the Substrate RPC interface. It supports a wide range of capabilities and powers the [Polkascan multi-chain block explorer](https://polkascan.io/). | [Polkascan Foundation](https://polkascan.org/)
| [Substrate API Client](https://github.com/scs/substrate-api-client) | A general-purpose Substrate client Rust library. | [Supercomputing Systems](https://www.scs.ch/en/) 
| [SubstrateNetApi](https://github.com/dotmog/SubstrateNetApi) | A .NET Standard API ([nuget](https://www.nuget.org/packages/SubstrateNetApi)) allowing full Substrate integration in Unity3D for game development. | [DOTMog](https://www.dotmog.com/)
