---
title: Cryptography
description: Summarizes information about the hashing algorithms and encryption signature schemes used in Substrate.
keywords:
  - cryptography
  - hashing
  - signatures
  - ECDSA
  - Ed25519
  - SR25519
  - hierarchical deterministic keys
  - key derivations
---

Cryptography is what provides the mathematical verifiableness behind consensus systems, data integrity, and user security. While understanding the fundamental overarching applications of cryptography as they relate to blockchain is essential for the average developer, the underlying mathematical processes themselves are not necessarily relevant. This page provides the base context for the various implementations of cryptography across Parity and the ecosystem more broadly.

## Hash functions

**Hashing** is a mathematical process that creates a one-to-one mapping between any piece of data and a 32 byte reference, using 2 random and unique numerical inputs between zero and the 255 power. Using hash functions, any data, including simple text, images, or any other form of file is given a distinct and entirely unique identifier. Hashing is used for verifying data integrity, creating digital signatures, and providing a secure way to store passwords. This form of mapping is known as the 'pigeonhole principle', and it is primarily implemented to efficiently and verifiably identify data from large sets.

These functions are **deterministic**, meaning that the same input will always produce the same output. This is important for ensuring that two different computers can agree on the same data. They can be designed to be fast or slow, depending on the purpose. Fast hash functions are used when speed is important, while slow hash functions are used when security is the priority. Slow hash functions are also used to mitigate the success of brute force attacks by increasing the amount of work required to find the data.

### Collision resistance

In blockchain, hash functions are also used to provide **collision resistance**. These are performed by an attacker that calculates or controls both numerical inputs, attempting to find two identical values in order to gain access to an encrypted object. With partial collisions, a similar method is applied, but is only attempting to find two values that share the first few bits instead of the entirety.

While only implementing partial collision resistance is computationally lighter weight and provides fairly strong protections against the possibility of collisions, it is a less-secure option when facing well resourced adversaries such as nation-states, as it is significantly easier to brute-force past the first few digits with a significant amount of computational power. That said, it is acceptable with an average attack vector (i.e, rogue actors).

### Blake2

When engineering a new blockchain protocol or ecosystem, it is important to consider the computational costs of the cryptography method being used. Prioritising efficiency and processor loads, Substrate utilises Blake2.

Blake2 is a relatively recent hashing method that provides equal or greater security than SHA2, while also being significantly faster than other comparable algorithms. While determining the exact benchmark of it's speed improvements over other hashing methods is highly dependent on hardware specifications, the biggest positive implication for Substrate is how it heavily reduces the amount of time and resources a new node will need in order to sync with the chain, and to a lesser extent, lower required time for validating.

For a comprehensive view of Blake2, see their [official document](https://www.blake2.net/blake2.pdf).

## Types of cryptography

There are two different ways that cryptographic algorithms are implemented: **symmetric cryptography**, and **asymmetric cryptography**.

### Symmetric cryptography

**Symmetric encryption** is a branch of cryptography that is not based on one-way functions, unlike asymmetric cryptography. It uses the same cryptographic key for both the encryption of plain text and the decryption of the resulting ciphertext.

Symmetric cryptography is the type of encryption that has been used throughout history, such as the Enigma Cipher and the Caesar Cipher. It is still widely used today, and can be found in web2 and web3 applications alike. There is only one single key, and requires a recipient to also have access to it in order to access the contained information.

### Asymmetric cryptography

**Asymmetric encryption** is a type of cryptography which uses two different keys, known as a keypair: a public key, used to encrypt plain text, and a private counterpart, used to decrypt the cipher text.

The public key is used to encrypt a fixed length message that can only be decrypted with the recipient's private key and, at times, a set password. The public key can be used to cryptographically verify that the corresponding private key was used to create a piece of data without compromising the private key itself, such as with **digital signatures**. This has obvious implications for identity, ownership and properties, and is used in many different protocols across both web2 and web3.

### Trade-offs and compromises

Symmetric cryptography is faster and requires fewer bits in the key to achieve the same level of security that asymmetric cryptography provides. However, it requires a shared secret before communication can take place, which poses issues to it's integrity and a potential compromise point. Asymmetric cryptography, on the other hand, does not require the secret to be shared ahead of time, allowing for far better end-user security.

Hybrid symmetric and asymmetric cryptography is often used to overcome the engineering issues of asymmetric cryptography, as it is slower and requires more bits in the key to achieve the same level of security. It is used to encrypt a key, and then use the comparatively lightweight symmetric cipher to do the 'heavy lifting' with the message.

## Digital signatures

Digital signatures are a way of verifying the authenticity of a document or message using asymmetric keypairs. They are used to ensure that a sender or signer's document or message has not been tampered with in transit, and for recipients to verify said data is accurate and from the expected sender.

Signing digital signatures only requires a low level understanding of mathematics and cryptography. For a conceptual example -- when signing a check, it is expected that the check cannot be cashed multiple times. This is not a feature of the signature system, but rather the check serialization system. The bank will check that the serial number on the check has not already been used. Digital signatures essentially combines these two concepts, allowing the _signature itself_ to provide the serialization via a unique cryptographic fingerprint that cannot be reproduced.

Unlike with a pen and paper signatures, knowledge of the digital signature cannot be used to create other signatures. Digital signatures are often used in bureaucratic processes, as they are more secure than simply scanning in a signature and pasting it onto a document.

Substrate provides multiple different cryptographic schemes and is generic such that it can support anything which implements the [`Pair` trait](https://paritytech.github.io/substrate/master/sp_core/crypto/trait.Pair.html).

## Elliptic Curve

Blockchain technology requires the ability to have multiple keys creating a signature for block proposal and validation. To this end, Elliptic Curve Digital Signature Algorithm (ECDSA) and Schnorr signatures are two of the most commonly used methods. While ECDSA are a far simpler implementation, Schnorr signatures are more efficient when it comes to multi-signatures.

Schnorr signatures bring some noticeable features over the [ECDSA](#ecdsa)/EdDSA schemes:

- It is better for hierarchical deterministic key derivations.
- It allows for native multi-signature through [signature aggregation](https://bitcoincore.org/en/2017/03/23/schnorr-signature-aggregation/).
- It is generally more resistant to misuse.

One sacrifice that is made when using Schnorr signatures over ECDSA is that both require 64 bytes, but only ECDSA signatures communicate their public key.

### Various implementations

#### ECDSA

Substrate provides an [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) signature scheme using the [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) curve.
This is the same cryptographic algorithm used to secure [Bitcoin](https://en.wikipedia.org/wiki/Bitcoin) and [Ethereum](https://en.wikipedia.org/wiki/Ethereum).

#### Ed25519

[Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519) is an EdDSA signature scheme using [Curve25519](https://en.wikipedia.org/wiki/Curve25519).
It is carefully engineered at several levels of design and implementation to achieve very high speeds without compromising security.

#### SR25519

[SR25519](https://research.web3.foundation/en/latest/polkadot/keys/1-accounts-more.html) is based on the same underlying curve as [Ed25519](#ed25519).
However, it uses Schnorr signatures instead of the EdDSA scheme.

## Where to go next

- [Cryptography on Polkadot](https://wiki.polkadot.network/docs/en/learn-cryptography).
- [Research at W3F: Cryptography](https://research.web3.foundation/en/latest/crypto.html).
- [`Hash`](https://paritytech.github.io/substrate/master/sp_runtime/traits/trait.Hash.html) trait for implementing new hashing algorithms.
- [`Pair`](https://paritytech.github.io/substrate/master/sp_core/crypto/trait.Pair.html) trait for implementing new cryptographic schemes.
