_For most topics presented in the Fundamentals section, we intentionally gloss over details on how things are implemented in Substrate clients and FRAME runtimes._
_This page is a dump of information for that type of material, intended for curious parachain builders to dig a little deeper on these topics if they wanted to._

## Session keys

Session keys are used by validators to sign consensus-related messages. 
[`SessionKeys`](https://paritytech.github.io/substrate/master/sp_session/trait.SessionKeys.html) is a generic, indexable type that is made concrete in the runtime.

You can declare any number of session keys. 
For example, the default Substrate node uses four. 
Other chains could have more or fewer depending on what operations the chain expects its validators to perform.

In practice, validators amalgamate all of the session public keys into a single object, sign the set of public keys with a controller account, and submit a transaction to register the keys on chain.
This on-chain registration links a validator _node_ with an _account_ that holds funds. 
As such, that account can be credited with rewards or slashed based on the node's behavior.

The runtime declares what session keys will be implemented with the help of a macro. 
An [example](https://paritytech.github.io/substrate/master/src/node_runtime/lib.rs.html#435-442):

```rust
impl_opaque_keys! {
    pub struct SessionKeys {
        pub grandpa: Grandpa,
        pub babe: Babe,
        pub im_online: ImOnline,
        pub authority_discovery: AuthorityDiscovery,
    }
}
```

The actual cryptographic curve that each key uses gets defined in `primitives`. 
For example, [BABE's key uses sr25519](https://paritytech.github.io/substrate/master/src/sp_consensus_babe/lib.rs.html#44-47):

```rust
mod app {
	  use sp_application_crypto::{app_crypto, key_types::BABE, sr25519};
	  app_crypto!(sr25519, BABE);
}
```

Typically, these keys are also initially configured in the genesis state to launch your
chain with pre-established validators. You can see this demonstrated in the
[trusted network tutorial](/tutorials/get-started/trusted-network/).

The Session keys from a Substrate node could use the same cryptography, but serve _very_ different purposes in your runtime logic. 
To prevent the wrong key being used for the wrong operation, strong Rust types wrap these keys, keeping them incompatible with one another and ensuring they are only used for their intended purpose.

## SS58 

The SS58 format is used to identify addresses and accounts in different Substrate chains.
This section provides more details on the composition of SS58 addresses and how they're encoded.

The basic format of any SS58 address has 3 fields:

`<address-type> ++ <address> ++ <checksum>`

### Address type and addresses

The `<address-type>` is a bit field that describes the precise format of the following bytes.

Currently, there exist several valid values:

- 00000000b..=00111111b (0..=63 inclusive): Simple account/address/network identifier.
  The byte can be interpreted directly as such an identifier.
- 01000000b..=01111111b (64..=127 inclusive): Full address/address/network identifier.
  The lower 6 bits of this byte should be treated as the upper 6 bits of a 14 bit identifier value, with the lower 8 bits defined by the following byte.
  This works for all identifiers up to 2\*\*14 (16,383).
- 10000000b..=11111111b (128..=255 inclusive): Reserved for future address format extensions.

The latter (42) is a "wildcard" address that is meant to be equally valid on all Substrate networks that support fixed-length addresses.
For production networks, however, a network-specific version may be desirable to help avoid the key-reuse between networks and some of the problems that it can cause.
Substrate nodes will default to printing keys in address type 42, though alternative Substrate-based node implementations (e.g. Polkadot) may elect to default to some other type.

### Checksum types

Checksums exist to give different length and longevity guarantees.
There are two types of checksum preimages (known as SS58 and AccountID) and many different checksum lengths (1 to 8 bytes).

In all cases for Substrate, the [Blake2-256](https://en.wikipedia.org/wiki/BLAKE_(hash_function)) hash function is used.
The variants simply select the preimage used as the input to the hash function and the number of bytes taken from its output.

The bytes used are always the left most bytes.
The input to be used is the non-checksum portion of the SS58 byte series used as input to the base-58 function, i.e. `concat( <address-type>, <address> )`.
A context prefix of `0x53533538505245`, (the string `SS58PRE`) is prepended to the input to give the final hashing preimage.

The advantage of using more checksum bytes is simply that more bytes provide a greater degree of protection against input errors and index alteration at the cost of widening the textual address by an extra few characters.
For the account ID format, this is insignificant and therefore no 1-byte alternative is provided.
For the shorter account-index formats, the extra byte represents a far greater portion of the final address, so it is left for further up the stack (though not necessarily the user themselves) to determine the best tradeoff for their purposes.

### Identifiers

[The registry](https://github.com/paritytech/ss58-registry) expresses the status of the account, address and network **identifiers**.

**Identifiers** up to value 64 may be expressed in a **simple** format address, in which the least significant byte (LSB) of the identifier value is expressed as the first byte of the encoded address.

For identifiers between 64 and 16,383, the **full** format address must be used.

This encoding is slightly fiddly since we encode as little endian (LE), yet the first two bits (which should encode 64s and 128s) are already used up with the necessary `01` prefix.
We treat the first two bytes as a 16 bit sequence, and we disregard the first two bits of that (since they're already fixed to be `01`).
With the remaining 14 bits, we encode our identifier value as LE, with the assumption that the two missing higher order bits are zero.
This effectively spreads the low-order byte across the boundary between the two bytes.

Thus the 14-bit identifier `0b00HHHHHH_MMLLLLLL` is expressed in the two bytes as:

- `0b01LLLLLL`
- `0bHHHHHHMM`

Identifiers of 16384 and beyond are not currently supported.

Refer to the [`Ss58Codec` API](https://paritytech.github.io/substrate/master/sp_core/crypto/trait.Ss58Codec.html) for more information about how it's implemented in Substrate.

## Hybrid consensus

See: https://github.com/paritytech/substrate/issues/1304
Describes considerations for swappable consenus.
A good starting point for designing hybrid consesnus systems.

Note: block authoring engines must be made aware of blocks that are finalized so that they don't waste time building on top of blocks that will never be in the canonical chain.