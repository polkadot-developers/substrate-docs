---
title: Substrate SS58 address format
keywords: []
---

As discussed in [Accounts, addresses, and keys](/main-docs/fundamentals/accounts-addresses-keys/), SS58 is the default address format for Substrate-based chains.
The SS58 address format provides a base-58 encoded value that can be used to identify a specific account on a Substrate-based chain.
This format enables a single public/private key pair to derive multiple public addresses that are specific to different network chains.

## Basic format

The basic format is a concatenation of bytes representing the address type, address, and checksum that is passed into a base-58 encoder:

```text
base58encode ( concat ( <address-type>, <address>, <checksum> ) )
```

The `base58encode` function is implemented exactly as defined in the [Base58 encoding standard](https://en.wikipedia.org/wiki/Base58).

## Address types

The `<address-type>` is one or more bytes that describe the precise format of the following bytes.

Currently, there exist several valid values:

* 00000000b..=00111111b (0..=63 inclusive): Simple account/address/network identifier.
  The byte can be interpreted directly as an identifier.
* 01000000b..=01111111b (64..=127 inclusive): Full address/address/network identifier.
  The lower 6 bits of this byte should be treated as the upper 6 bits of a 14 bit identifier value, with the lower 8 bits defined by the following byte.
  This works for all identifiers up to 2\*\*14 (16,383).
* 10000000b..=11111111b (128..=255 inclusive): Reserved for future address format extensions.

The latter (42) is a "wildcard" address that is meant to be equally valid on all Substrate networks that support fixed-length addresses.
For production networks, however, a network-specific version is desirable to help avoid the key re-use between networks and some of the problems that re-use can cause.
Substrate nodes default to printing keys in address type 42.
However, specific Substrate-based implementations—such as, Polkadot—can default to some other type.

## Address formats

There are 16 different address formats, identified by the length **in bytes** of the total payload, including the checksum.

| Total | Type | Raw Account | Checksum |
| :---: | :--: | :---------: | :------: |
|   3   |  1   |      1      |    1     |
|   4   |  1   |      2      |    1     |
|   5   |  1   |      2      |    2     |
|   6   |  1   |      4      |    1     |
|   7   |  1   |      4      |    2     |
|   8   |  1   |      4      |    3     |
|   9   |  1   |      4      |    4     |
|  10   |  1   |      8      |    1     |
|  11   |  1   |      8      |    2     |
|  12   |  1   |      8      |    3     |
|  13   |  1   |      8      |    4     |
|  14   |  1   |      8      |    5     |
|  15   |  1   |      8      |    6     |
|  16   |  1   |      8      |    7     |
|  17   |  1   |      8      |    8     |
|  35   |  1   |     32      |    2     |

## Checksum types

Several potential checksum strategies exist within Substrate, giving different length and longevity guarantees.
There are two types of checksum pre-images—known as SS58 and AccountID—and many different checksum lengths (1 to 8 bytes).

In Substrate, the Blake2b-512 hash function is used.
The variants simply select the pre-image used as the input to the hash function and the number of bytes taken from its output.

The bytes used are always the left most bytes.
The input to be used is the non-checksum portion of the SS58 byte series used as input to the base-58 function, i.e. `concat( <address-type>, <address> )`.
A context prefix of `0x53533538505245`, (the string `SS58PRE`) is prepended to the input to give the final hashing preimage.

The advantage of using more checksum bytes is simply that more bytes provide a greater degree of protection against input errors and index alteration at the cost of widening the textual address by an extra few characters.
For the account ID format, this is insignificant and therefore no 1-byte alternative is provided.
For the shorter account-index formats, the extra byte represents a far greater portion of the final address, so it is left for further up the stack to determine the best tradeoff for their purposes.

## Simple and full address type identifiers

[The registry](https://github.com/paritytech/ss58-registry) expresses the status of the account/address/network **identifiers**.

**Identifiers** up to value 64 may be expressed in a **simple** format address, in which the least significant byte (LSB) of the identifier value is expressed as the first byte of the encoded address.

For identifiers of between 64 and 16,383, the **full** format address must be used.

This encoding is slightly fiddly since we encode as little endian (LE), yet the first two bits (which should encode 64s and 128s) are already used up with the necessary `01` prefix.
We treat the first two bytes as a 16 bit sequence, and we disregard the first two bits of that (since they're already fixed to be `01`).
With the remaining 14 bits, we encode our identifier value as LE, with the assumption that the two missing higher order bits are zero.
This effectively spreads the low-order byte across the boundary between the two bytes.

Thus the 14-bit identifier `0b00HHHHHH_MMLLLLLL` is expressed in the two bytes as:

- `0b01LLLLLL`
- `0bHHHHHHMM`

Identifiers of 16384 and beyond are not currently supported.

## Validating addresses

There are several ways to verify that a value is a valid SS58 address.
For example, you can use the `subkey` program or the Polkadot-JS API to check whether an address is valid.

If you use the [subkey inspect](/reference/command-line-tools/subkey#subkey-inspect) command, you can specify a secret seed phrase, hex-encoded private key, or SS58 address as the `uri` to validate.
If the input is a valid address, the command returns the corresponding hex-encoded public key, account ID, SS58 address, and the network identifier that indicates the network where the address is valid.
For example:

```shell
subkey inspect "12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU"
Public Key URI `12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU` is account:
  Network ID/version: polkadot
  Public key (hex):   0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a
  Account ID:         0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a
  SS58 Address:       12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU
```

Note that `subkey` assumes addresses are based on a public/private key pair and inspecting an address returns the 32-byte account ID.
However, not all addresses in Substrate-based networks are based on keys.

## Learn more

* [`Ss58Codec` in Substrate](https://paritytech.github.io/substrate/master/sp_core/crypto/trait.Ss58Codec.html)
* [SS58 registry](https://github.com/paritytech/ss58-registry)
* [Polkadot-js API](https://github.com/polkadot-js/api)
* [Subkey](/reference/command-line-tools/subkey)
* [Client libs](https://substrate.io/ecosystem/resources/awesome-substrate/#client-libraries) and [tools](https://substrate.io/ecosystem/resources/awesome-substrate/#tools)
* [Blake2b-512 specification](https://datatracker.ietf.org/doc/html/rfc7693)
* [Blake2b-512 wiki](<https://en.wikipedia.org/wiki/BLAKE_(hash_function)>))