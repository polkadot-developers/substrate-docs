---
title: Generate and inspect keys
description:
keywords:
---

In [Accounts, addresses, and keys](/fundamentals/accounts-addresses-keys/), the use of public and private keys focused on identifying accounts and addresses associated with users interacting with different networks. 
However, keys and different key signatures are also fundamental to deploying Substrate nodes and performing specific node operations.
This section recaps the encryption schemes and where they are used by different node components.

## Encryption schemes

ed25519	The vanilla ed25519 implementation using Schnorr signatures.
sr25519	The Schnorrkel/Ristretto sr25519 variant using Schnorr signatures. (default)
ecdsa	ECDSA signatures on secp256k1

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