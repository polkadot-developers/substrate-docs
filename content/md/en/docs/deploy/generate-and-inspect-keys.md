---
title: Generate and inspect keys
description:
keywords:
---

In [Accounts, addresses, and keys](/fundamentals/accounts-addresses-keys/), the discussion of public and private keys focused on identifying accounts and addresses associated with users interacting with different networks. 
However, keys and different key signatures are also fundamental to deploying Substrate nodes and performing specific node operations.
This section recaps the encryption schemes and where they are used by different node components.

## Digital signature schemes

Most digital signature schemes provide the following features:

- **Key generation**. The signature scheme must provide a method for generating a random private key from the set of all possible private keys and a corresponding public key that can be used to verify the authenticity of the private key.
- **Message signing**. The signature scheme must provide a method that produces a signature for a given message and private key.
- **Signature verification**. The signature scheme must provide a method to accept or reject the authenticity of a message based on the message, public key, and signature being evaluated.

Different signature schemes use different algorithms to perform these operations.
Regardless of the mathematics used, all signature schemes are designed to achieve two main outcomes:

- Authenticity of the signature generated for a given message and private key is verified by using the corresponding public key. 
- Integrity of the message can be reasonably assumed because generating a valid signature without the private key isn't computationally feasible.

The following signature schemes are supported in Substrate-based chains:

| Scheme | Description
|:----- |:-----------
| ed25519	| The Ed25519 signature scheme is based on the Edwards-curve Digital Signature Algorithm (EdDSA) signature scheme—a variant of Schnorr signatures—that uses SHA-512 and Curve25519. This signature scheme produces more secure signatures and is significantly faster at signing messages than the ECDSA signature scheme.
| sr25519	| The Sr25519 signature scheme is the default signature scheme for Substrate. This signature scheme is based on the Schnorrkel variant that uses Schnorr signatures with Ristretto point compression. The Sr25519 signature scheme supports additional features—such as hierarchical deterministic key derivation, multi-signature signing, and a verifiable random function—that are particularly useful in a blockchain environment.
| ecdsa	| The Elliptic Curve Digital Signature Algorithm (ECDSA) is a variant of the Digital Signature Algorithm (DSA) that uses the Secp256k1 elliptic curve cryptography. This signature scheme was used initially in Bitcoin and Ethereum because of the patent protecting Schnorr signatures. Using the ECDSA signature scheme complicates some advanced cryptographic techniques, such as threshold signatures.

## Session key types

Name	Type
grandpa	ed25519
babe	sr25519
im_online	sr25519
para_validator	sr25519
para_assignment	sr25519
authority_discovery	sr25519
beefy	ecdsa

## Generate keys for a node

You can use polkadot keys or the subkey command to generate and inspect keys.

Two important subcommands are:

generate Create a new random account and print the private key data or save to a file.
inspect View the account data for an account by passing a secret phrase or seed.
Some important options are:

--network specify the network the keys will be used on, default is substrate.
--scheme the scheme for the keys, default is sr25519.

Generate

Create Polkadot Random Key:


$ polkadot key generate -n polkadot
Secret phrase:       settle whisper usual blast device source region pumpkin ugly beyond promote cluster
  Network ID:        polkadot
  Secret seed:       0x2e6371e04b45f16cd5c2d66fc47c8ad7f2881215287c374abfa0e07fd003cb01
  Public key (hex):  0x9e65e97bd8ba80095440a68d1be71adff107c73627c8b85d29669721e02e2b24
  Account ID:        0x9e65e97bd8ba80095440a68d1be71adff107c73627c8b85d29669721e02e2b24
  Public key (SS58): 14agqii5GAiM5z4yzGhJdyWQ3a6HeY2oXvLdCrdhFXRnQ77D
  SS58 Address:      14agqii5GAiM5z4yzGhJdyWQ3a6HeY2oXvLdCrdhFXRnQ77D

Inspection

Inspect Created Key:

$ ./polkadot key inspect -n polkadot "settle whisper usual blast device source region pumpkin ugly beyond promote cluster" 
Secret phrase:       settle whisper usual blast device source region pumpkin ugly beyond promote cluster
  Network ID:        polkadot
  Secret seed:       0x2e6371e04b45f16cd5c2d66fc47c8ad7f2881215287c374abfa0e07fd003cb01
  Public key (hex):  0x9e65e97bd8ba80095440a68d1be71adff107c73627c8b85d29669721e02e2b24
  Account ID:        0x9e65e97bd8ba80095440a68d1be71adff107c73627c8b85d29669721e02e2b24
  Public key (SS58): 14agqii5GAiM5z4yzGhJdyWQ3a6HeY2oXvLdCrdhFXRnQ77D
  SS58 Address:      14agqii5GAiM5z4yzGhJdyWQ3a6HeY2oXvLdCrdhFXRnQ77D

Inspect Created Key With Hard Derivation //Stash//0:

$ polkadot key inspect -n polkadot "settle whisper usual blast device source region pumpkin ugly beyond promote cluster//Stash//0" 
Secret Key URI `settle whisper usual blast device source region pumpkin ugly beyond promote cluster//Stash//0` is account:
  Network ID:        polkadot 
 Secret seed:       0xe9437b365161e8228e8abd53d64e6b31058dcddcd0b96f895045ecc41579ee3e
  Public key (hex):  0xd8ed7b942f6e590b06e99951ac10e3312f65f01df5b3f250b70374fc2da1046d
  Account ID:        0xd8ed7b942f6e590b06e99951ac10e3312f65f01df5b3f250b70374fc2da1046d
  Public key (SS58): 15uRtdeE4MyMHV9LP1UHKqTx4f8Qa8uVZUpxWWw8VKSroucK
  SS58 Address:      15uRtdeE4MyMHV9LP1UHKqTx4f8Qa8uVZUpxWWw8VKSroucK