---
title: Key signatures and network operations
description:
keywords:
---

In [Accounts, addresses, and keys](/learn/accounts-addresses-keys/), the discussion of public and private keys focused on identifying accounts and addresses associated with users interacting with different networks.
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

| Scheme  | Description                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ed25519 | The Ed25519 signature scheme is based on the Edwards-curve Digital Signature Algorithm (EdDSA) signature scheme—a variant of Schnorr signatures—that uses SHA-512 and Curve25519. This signature scheme produces more secure signatures and is significantly faster at signing messages than the ECDSA signature scheme.                                                                                                             |
| sr25519 | The Sr25519 signature scheme is the default signature scheme for Substrate. This signature scheme is based on the Schnorrkel variant that uses Schnorr signatures with Ristretto point compression. The Sr25519 signature scheme supports additional features—such as hierarchical deterministic key derivation, multi-signature signing, and a verifiable random function—that are particularly useful in a blockchain environment. |
| ecdsa   | The Elliptic Curve Digital Signature Algorithm (ECDSA) is a variant of the Digital Signature Algorithm (DSA) that uses the Secp256k1 elliptic curve cryptography. This signature scheme was used initially in Bitcoin and Ethereum because of the patent protecting Schnorr signatures. Using the ECDSA signature scheme complicates some advanced cryptographic techniques, such as threshold signatures.                           |

## Session keys and types

Session keys are private online keys that are used by validators to sign consensus-related messages.
Session keys must be available online to enable the validator to perform certain network operations.

These keys aren't used to control funds and they should only be used for their intended purpose.
They can be changed regularly
To create session keys, a validator node operator must use a controller account too generate a certificate signed with the session's public key.
The certificate attests that the key acts on behalf of the validator's staking account and nominators.
After creating the session key, the validator node operator informs the chain that this key represents the controller key by
publishing the session certificate in a transaction on the chain.
In most cases, node operators use the [Session](https://paritytech.github.io/substrate/master/pallet_session/index.html)) pallet to manage their session keys.

The [`SessionKeys`](https://paritytech.github.io/substrate/master/sp_session/index.html)
trait is a generic, indexable type and you can declare any number of session keys in the runtime.
The default Substrate node template uses four session keys.
Other chains can have more or fewer depending on what operations the chain expects its validators to
perform.

In practice, validators combine all of the session public keys into a single object, sign the set
of public keys with a controller account, and submit a transaction to register the keys on chain.
This on-chain registration links a validator _node_ with an _account_ that holds funds.
As such, the account associated with the session keys object can be credited with rewards or slashed based on the node's behavior.

The runtime declares what session keys implemented with the help of the `impl_opaque_keys!` macro:

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

Polkadot uses the following session keys:

| Name                 | Type    |
| :------------------- | :------ |
| Authority discovery  | sr25519 |
| GRANDPA              | ed25519 |
| BABE                 | sr25519 |
| I'm online           | sr25519 |
| Parachain assignment | sr25519 |
| Parachain validator  | ed25519 |

BABE requires keys suitable for use in a Verifiable Random Function as well as for digital signatures.
Sr25519 keys have both capabilities and so are used for BABE.

## Commands-line interface

You can use `polkadot keys` or the `subkey` command to generate and inspect keys.

Two important subcommands are:

- `generate` to create a new random account and print the private key to standard output or save the key to a file.
- `inspect` to view the account and address information for an account by passing a secret phrase or seed.

Some important options are:

- `--network` to specify the network the keys will be used on (default is `substrate`).
- `--scheme` to specify the signature scheme for the keys (default is `sr25519`).

For example, you can **generate** a Polkadot random key by running the following command:

```bash
polkadot key generate -n polkadot
```

The command displays output similar to the following:

```text
Secret phrase:       settle whisper usual blast device source region pumpkin ugly beyond promote cluster
  Network ID:        polkadot
  Secret seed:       0x2e6371e04b45f16cd5c2d66fc47c8ad7f2881215287c374abfa0e07fd003cb01
  Public key (hex):  0x9e65e97bd8ba80095440a68d1be71adff107c73627c8b85d29669721e02e2b24
  Account ID:        0x9e65e97bd8ba80095440a68d1be71adff107c73627c8b85d29669721e02e2b24
  Public key (SS58): 14agqii5GAiM5z4yzGhJdyWQ3a6HeY2oXvLdCrdhFXRnQ77D
  SS58 Address:      14agqii5GAiM5z4yzGhJdyWQ3a6HeY2oXvLdCrdhFXRnQ77D
```

You can **inspect** account and address information for a key by running a command similar to the following with a secret phrase:

```bash
./polkadot key inspect -n polkadot "settle whisper usual blast device source region pumpkin ugly beyond promote cluster"
```

The command displays output similar to the following:

```text
Secret phrase:       settle whisper usual blast device source region pumpkin ugly beyond promote cluster
  Network ID:        polkadot
  Secret seed:       0x2e6371e04b45f16cd5c2d66fc47c8ad7f2881215287c374abfa0e07fd003cb01
  Public key (hex):  0x9e65e97bd8ba80095440a68d1be71adff107c73627c8b85d29669721e02e2b24
  Account ID:        0x9e65e97bd8ba80095440a68d1be71adff107c73627c8b85d29669721e02e2b24
  Public key (SS58): 14agqii5GAiM5z4yzGhJdyWQ3a6HeY2oXvLdCrdhFXRnQ77D
  SS58 Address:      14agqii5GAiM5z4yzGhJdyWQ3a6HeY2oXvLdCrdhFXRnQ77D
```

To inspect a key created with the hard derivation `//Stash//0`, you would run a command similar to the following:

```bash
polkadot key inspect -n polkadot "settle whisper usual blast device source region pumpkin ugly beyond promote cluster//Stash//0"
```

The command displays output similar to the following:

```text
Secret Key URI `settle whisper usual blast device source region pumpkin ugly beyond promote cluster//Stash//0` is account:
  Network ID:        polkadot
 Secret seed:       0xe9437b365161e8228e8abd53d64e6b31058dcddcd0b96f895045ecc41579ee3e
  Public key (hex):  0xd8ed7b942f6e590b06e99951ac10e3312f65f01df5b3f250b70374fc2da1046d
  Account ID:        0xd8ed7b942f6e590b06e99951ac10e3312f65f01df5b3f250b70374fc2da1046d
  Public key (SS58): 15uRtdeE4MyMHV9LP1UHKqTx4f8Qa8uVZUpxWWw8VKSroucK
  SS58 Address:      15uRtdeE4MyMHV9LP1UHKqTx4f8Qa8uVZUpxWWw8VKSroucK
```

For more information about using subkey comands and command-line options, see [subkey](/reference/command-line-tools/subkey/).
