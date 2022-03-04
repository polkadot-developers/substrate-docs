_This article gives theoretical background on how Substrate could be used to implement any type of protocol._
_It goes over the general runtime / client architecture, describing that it's possible do implement custom protocols and primitives without relying on FRAME._ 

In theory, any blockchain protocol could be implemented with Substrate by implementing the runtime APIs and host functions that the protocol requires.
For instance, Polkadot is a runtime implementation that defines specialized protocols for consenus mechanisms and multi-chain interoperability, all of which is possible by providing some interface that any node can use to interact with the capabilities it exposes.

[ _TODO: diagram to show how multiple protocols can be implemented with the same runtime api / host function interface_ ]

              |*some protocol*| *transport layer*|   *some client* 

                ├─────────────┤                      ├─────────────┤                         
                │             │                      │             │ 
                │   Runtime   │ <-- Runtime API --   │   Client    │
                │             │ -- Host functions--> │             │ 
                ├─────────────│                      ├─────────────│        

Low-level protocols are defined in the runtime and adapted by the client, using some primitives that enable host functions and runtime APIs to act as a way for a client to communicate with a given runtime.
This generic architecture makes it possiblle to implement any protocol without needing to alter the host functions and runtime APIs that come out of the box.

For example, a Substrate node template uses Aura for block production and GRANPDA for block finality: the way these are implemented in the runtime enforces how a client must adhere to the underlying protocol of the chain, which also implies implementing special types that both the client and runtime understands.
We can think of this as a sort of interface between the runtime and client, where the ability for a runtime to actually answer requests relies on the specific protocol primitive that the runtime and client need to commonly understand, which would correspond to some custom host function / runtime API interface. 

An important difference between changes in the runtime API versus the host function interface is that protocol primitives can be updated without having to update the node &mdash; as long as these changes don't require the node to modify behavior around consensus.
However, any change on the host interface requires upgrading the node.

## Primitives

The Substrate framework makes minimal assumptions about what your runtime must provide to the other layers of Substrate.  
As long as the runtime has primitives that are mutually understood by the client, it can execute its logic. 
These primitives can be broken down into two categories: 
1. Everything enabling the implementation of a protocol (core primitives)
1. The protocol itself.

**Core primitives** are the data types that need to be defined and must fulfill a particular interface in order to work within the Substrate framework.

These are:

- `Hash`: A type which encodes a cryptographic digest of some data. Typically just a 256-bit
  quantity.

- `DigestItem`: A type which must be able to encode one of a number of "hard-wired" alternatives
  relevant to consensus and change-tracking as well as any number of "soft-coded" variants, relevant
  to specific modules within the runtime.

- `Digest`: A series of DigestItems. This encodes all information that is relevant for a
  light-client to have on hand within the block.

- `Extrinsic`: A type to represent a single piece of data external to the blockchain that is
  recognized by the blockchain. This typically involves one or more signatures, and some sort of
  encoded instructions (e.g. for transferring ownership of funds or calling into a smart contract).

- `Header`: A type which is representative (cryptographically or otherwise) of all information
  relevant to a block. It includes the parent hash, the storage root and the extrinsics trie root,
  the digest and a block number.

- `Block`: Essentially just a combination of `Header` and a series of `Extrinsic`s, together with a
  specification of the hashing algorithm to be used.

- `BlockNumber`: A type which encodes the total number of ancestors any valid block has. Typically a
  32-bit quantity.

**Protocol primitives** are a more abstract class of primitives. 
They are typically informed by consensus critical components which define the relationship between a client and a runtime.
These relate to implementations of [runtime APIs and host functions](#runtime-apis-and-host-functions), whereby any consensus-breaking change on the host-function must be reflected in the runtime. 

Adhering to some set of protocol primitives is necessary for chains connecting to eachother such as in Polkadot's parachain model.
For example, [the Polkadot protocol](https://github.com/w3f/polkadot-spec/) specifies host functions and runtime APIs in its implementation for block authoring (BABE) and block finalization (GRANDPA).
Any parachain that uses the Polkadot protocol must also expose the same runtime APIs and host functions.
Similarly, any change in Polkadot's runtime APIs or host functions must be reflected in the parachain, otherwise there is no way for a relay chain and a parachain to reach consensus.

This architecture makes it possible to implement any Substrate runtime, using any language or libraries provided that it adheres to the protocol and primitives it shares with the client. 