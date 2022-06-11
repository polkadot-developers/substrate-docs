---
title: Cryptography
keywords: []
---

This document offers a conceptual overview of the cryptography used in Substrate.

## Hashing algorithms

Hash functions are used in Substrate to map arbitrary sized data to fixed-sized values.

Substrate provides two hash algorithms out of the box, but can support any hash algorithm which
implements the [`Hasher` trait](/rustdocs/latest/sp_core/trait.Hasher.html).

### xxHash

xxHash is a fast [non-cryptographic hash function](https://en.wikipedia.org/wiki/Hash_function),
working at speeds close to RAM limits. Because xxHash is not cryptographically secure, it is
possible that the output of the hash algorithm can be reasonably controlled by modifying the input.
This can allow a user to attack this algorithm by creating key collisions, hash collisions, and
imbalanced storage tries.

xxHash is used in places where outside parties cannot manipulate the input of the hash function. For
example, it is used to generate the key for runtime storage values, whose inputs are controlled by
the runtime developer.

Substrate uses the [`twox-hash`](https://github.com/shepmaster/twox-hash) implementation in Rust.

### Blake2

[Blake2](<https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE2>) is a cryptographic hash
function. It is considered to be very fast and is also used in
[Zcash](https://en.wikipedia.org/wiki/Zcash).

Substrate uses the [`blake2`](https://docs.rs/blake2/) implementation in Rust.

## Public-Key cryptography

Public-key cryptography is used in Substrate to provide a robust authentication system.

Substrate provides multiple different cryptographic schemes and is generic such that it can support
anything which implements the
[`Pair` trait](/rustdocs/latest/sp_core/crypto/trait.Pair.html).

### ECDSA

Substrate provides an
[ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) signature scheme
using the [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) curve. This is the same cryptographic
algorithm used to secure [Bitcoin](https://en.wikipedia.org/wiki/Bitcoin) and
[Ethereum](https://en.wikipedia.org/wiki/Ethereum).

### Ed25519

[Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519) is an EdDSA signature scheme using
[Curve25519](https://en.wikipedia.org/wiki/Curve25519). It is carefully engineered at several levels
of design and implementation to achieve very high speeds without compromising security.

### SR25519

[SR25519](https://research.web3.foundation/en/latest/polkadot/keys/1-accounts-more.html) is based on the
same underlying curve as [Ed25519](#ed25519). However, it uses Schnorr signatures instead of the
EdDSA scheme.

Schnorr signatures bring some noticeable features over the [ECDSA](#ecdsa)/EdDSA schemes:

- It is better for hierarchical deterministic key derivations.
- It allows for native multi-signature through
  [signature aggregation](https://bitcoincore.org/en/2017/03/23/schnorr-signature-aggregation/).
- It is generally more resistant to misuse.

One sacrifice that is made when using Schnorr signatures over ECDSA is that both require 64 bytes,
but only ECDSA signatures communicate their public key.

## Where to go next

- [Accounts, addresses, and keys](/main-docs/fundamentals/accounts-addresses-keys).
- [Web 3 research](https://research.web3.foundation).
- [Polkadot claims module](https://github.com/paritytech/polkadot/blob/master/runtime/common/src/claims.rs) to see how you can verify Ethereum signatures in the Substrate runtime.
- [`Hash`](/rustdocs/latest/sp_runtime/traits/trait.Hash.html) trait for implementing new hashing algorithms.
- [`Pair`](/rustdocs/latest/sp_core/crypto/trait.Pair.html) trait for implementing new cryptographic schemes.
