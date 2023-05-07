---
title: Address formats
description: Provide technical specifications about the default SS58 address format for accounts in Substrate-based chains.
keywords:
  - address format
  - account format
  - network-specific accounts
  - SS58
---

The default Substrate address format is SS58.
The SS58 encoded address format is based on the Bitcoin Base-58-check format, but with a few modification specifically designed to suite Substrate-based chains.
You can use other address formats for Substrate-based chains.
However, the SS58 address format provides a base-58 encoded value that can identify a specific account on any Substrate chain.
Because different chains can have different ways of identifying accounts, the SS58 address is designed to be extensible.

## Basic format

You can find the implementation for the SS58 address format in [Ss58Codec](https://paritytech.github.io/substrate/master/sp_core/crypto/trait.Ss58Codec.html).

The basic format of the address can be described as:

```text
base58encode ( concat ( <address-type>, <address>, <checksum> ) )
```

The address is the concatenated byte series consisting of an address type, the encoded address, and a checksum that is passed into a base-58 encoder.
The `base58encode` function is implemented exactly as defined in Bitcoin and IPFS specifications, using the same alphabet as both of those implementations.
The Base-58 alphabet eliminates characters that might look ambiguous when printed, for example:

- non-alphanumerical characters (+ and /)
- zero (0)
- capital i (I)
- capital o (O)
- lower-case L (l)

## Address type

The `address-type` in the SS58 address format is one or more bytes that describe the precise format of the address bytes that follow it.

Currently, the valid values are:

- `00000000b..=00111111b` (0 to 63 inclusive)

  Simple account/address/network identifier.
  The byte can be interpreted directly as such an identifier.

- `01000000b..=01111111b` (64 to 127 inclusive)

  Full address/address/network identifier.
  The lower 6 bits of this byte should be treated as the upper 6 bits of a 14 bit identifier value, with the lower 8 bits defined by the following byte.
  This works for all identifiers up to 2\*\*14 (16,383).

- `10000000b..=11111111b` (128 to 255 inclusive)

  Reserved for future address format extensions.
  The latter (42) address that is intended to be valid on all Substrate networks that support fixed-length addresses.
  For production networks, however, a network-specific version might be desirable to help avoid the key-reuse between networks and some of the problems that re-use can cause. By default, Substrate nodes print keys in address type 42
  However, Substrate-based chains with alternative node implementations—for example, nodes in the Polkadot ecosystem—can default to some other address type.

## Address length in bytes

There are 16 different address formats, identified by the length in bytes of the total payload including the checksum.

| Total | Type | Raw account | Checksum |
| ----- | ---- | ----------- | -------- |
| 3     | 1    | 1           | 1        |
| 4     | 1    | 2           | 1        |
| 5     | 1    | 2           | 2        |
| 6     | 1    | 4           | 1        |
| 7     | 1    | 4           | 2        |
| 8     | 1    | 4           | 3        |
| 9     | 1    | 4           | 4        |
| 10    | 1    | 8           | 1        |
| 11    | 1    | 8           | 2        |
| 12    | 1    | 8           | 3        |
| 13    | 1    | 8           | 4        |
| 14    | 1    | 8           | 5        |
| 15    | 1    | 8           | 6        |
| 16    | 1    | 8           | 7        |
| 17    | 1    | 8           | 8        |
| 35    | 1    | 32          | 2        |

## Checksum types

Several potential checksum strategies exist within Substrate, giving different length and longevity guarantees.
There are two types of checksum preimages (known as SS58 and AccountID) and many different checksum lengths (1 to 8 bytes).

In all cases for Substrate, the Blake2b-512 (Spec, Wiki) hash function is used (OID 1.3.6.1.4.1.1722.12.2.1.16).
The variants simply select the preimage used as the input to the hash function and the number of bytes taken from its output.

The bytes used are always the left-most bytes.
The input to be used is the non-checksum portion of the SS58 byte series used as input to the base-58 function, for example `concat( <address-type>, <address> )`.
A context prefix of 0x53533538505245, (the string SS58PRE) is prepended to the input to give the final hashing preimage.

The advantage of using more checksum bytes is simply that more bytes provide a greater degree of protection against input errors and index alteration at the cost of widening the textual address by an extra few characters.
For the account ID format, this is insignificant and therefore no 1-byte alternative is provided.
For the shorter account-index formats, the extra byte represents a far greater portion of the final address, so it is left for further up the stack (though not necessarily the user themselves) to determine the best tradeoff for their purposes.

## Address types and the network registry

The [SS58 registry](https://github.com/paritytech/ss58-registry) is the canonical listing of all address type identifiers and how they map to Substrate-based networks.

## Encoding address and network identifiers

Identifiers up to value 64 can be expressed using a simple address format.
For the simple address format, the least significant byte of the network identifier value is expressed as the first byte of the encoded address.

For identifiers between 64 and 16,383, the full address format must be used.

The full address encoding requires special handling because SCALE encoding as little endian requires the first two bits to be used for the 01 prefix.
To encode the network identifier, the full address format treats the first two bytes as a 16-bit sequence, and disregards the first two bits of that sequence to account for the 01 prefix.
The remaining 14 bits encode the network identifier value as little endian, with the assumption that the two missing higher order bits are zero.
This effectively spreads the low-order byte across the boundary between the two bytes.

For example, the 14-bit identifier `0b00HHHHHH_MMLLLLLL` is expressed in two bytes as:

```text
0b01LLLLLL
0bHHHHHHMM
```

Identifiers of 16384 and beyond are not currently supported.

## Validating addresses

You can verify that a value is a valid SS58 address by using the `subkey inspect` command or though the Polkadot-JS API.

### Using subkey

The basic syntax for the `subkey inspect` command is:

```text
subkey inspect [flags] [options] uri
```

For the `uri` command-line argument, you can specify the secret seed phrase, a hex-encoded private key, or an SS58 address.
If the input is a valid address, the `subkey` program displays the corresponding hex-encoded public key, account identifier, and SS58 addresses.
For example, to inspect the public keys derived from a secret seed phrase, you can run a command similar to the following::

```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very"
```

The command displays output similar to the following:

```text
Secret phrase `caution juice atom organ advance problem want pledge someone senior holiday very` is account:
  Secret seed:       0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
  Public key (hex):  0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  Public key (SS58): 5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
  Account ID:        0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  SS58 Address:      5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
```

The `subkey` program assumes that an address is based on a public/private key pair.
If you inspect an address, the command returns the 32-byte account identifier.
However, not all addresses in Substrate-based networks are based on keys.

Depending on the command-line options you specify and the input you provided, the command output might also display the network for which the address has been encoded.
For example:

```bash
subkey inspect "12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU"
```

The command displays output similar to the following:

```text
Public Key URI `12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU` is account:
  Network ID/Version: polkadot
  Public key (hex):   0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a
  Account ID:         0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a
  Public key (SS58):  12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU
  SS58 Address:       12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU
```

### Using Polkadot-JS API

To verify an address in JavaScript or TypeScript projects, you can use the functions built into the Polkadot-JS API.
For example:

```bash
// Import Polkadot.js API dependencies.
const { decodeAddress, encodeAddress } = require('@polkadot/keyring')
const { hexToU8a, isHex } = require('@polkadot/util')

// Specify an address to test.
const address = '<addressToTest>'

// Check address.
const isValidSubstrateAddress = () => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))

    return true
  } catch (error) {
    return false
  }
}

// Query result.
const isValid = isValidSubstrateAddress()
console.log(isValid)
```

If the function returns `true`, the address you specified is a valid address.

### Other SS58 implementations

Support for encoding and decoding Substrate SS58 addresses has been implemented in several other languages and libraries.

- Crystal: [`wyhaines/base58.cr`](https://github.com/wyhaines/base58.cr)
- Go: [`itering/subscan`](https://github.com/subscan-explorer/subscan-essentials/blob/master/util/ss58/ss58.go)
- Python: [`polkascan/py-scale-codec`](https://github.com/polkascan/py-scale-codec/blob/master/scalecodec/utils/ss58.py)
- Typescript: [`subsquid/squid-sdk`](https://github.com/subsquid/squid-sdk/tree/master/substrate/ss58-codec)
