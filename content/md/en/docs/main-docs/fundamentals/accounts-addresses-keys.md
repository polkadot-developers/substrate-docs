---
title: Accounts, addresses, and keys
description:
keywords:
---

An account represents an identity—usually of a person or an organization—that is capable of making transactions or holding funds.
Although accounts are most often used to represent a person, that doesn't have to be the case.
An account can be used to perform operations on behalf of a user or another entity, or to perform operations autonomously.
In addition, any single person or entity could have multiple accounts for different purposes. 
For example, Polkadot is a Substrate=based blockchain that has specialized accounts for holding funds that are separate from accounts used for making transactions.
How you implement and use accounts is entirely up to you as a blockchain or parachain developer.

## Public and private keys

In general, every account has an owner who possesses a public and private key pair.
The **private key** is a cryptographically-secure sequence of randomly-generated numbers. For human readability, the private key generates a random sequence of words called a **secret seed phrase** or **mnemonic**.
This secret seed phrase can be used an account owner to recover access to an account if the private key is lost.

For most networks, the **public key** associated with an account is how that account is identified on the network and is used as the destination address for transactions.
However, Substrate-based chains use the underlying public key to derive one or more **public addresses**.
Instead of using the public key directly, Substrate allows you generate multiple addresses and address formats for an account.

## Address encoding and chain-specific addresses

Substrate enables you to use a single public key to derive multiple addresses so you can interact with multiple chains without creating separate public and private key pairs for each network.
By default, the addresses associated with the public key for an account use the Substrate **SS58 address format**.
This address format is based on [base-58 encoding](https://tools.ietf.org/id/draft-msporny-base58-01.html).
TIn addition to allowing you to derive multiple addresses from the same public key, base-58 encoding has the following benefits:

* Encoded addresses consist of 58 alphanumeric characters.
* The alphanumeric string omits characters—such as `0`, `O`, `I`, and `l`—that can be difficult to distinguish from each other in a string.
* Network information—for example, a network-specific prefix—can be encoded in the address.
* Input errors can be detected using a checksum to ensure the address is entered correctly.

Because a single public key can be used to derive addresses for different Substrate chains, a single account can multiple chain-specific addresses.
For example, if you inspect the addresses for the `alice` account public key `0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d` depends on the chain-specific address type.

| Chain address type | Address 
| ------------ | ------ 
| Polkadot (SS58)| 15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5
| Kusama (SS58) | HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F
| Generic Substrate chain (SS58)| 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY

Each Substrate blockchain can register a custom prefix to create a chain-specific address type.
For example, all Polkadot addresses start with `1` and all Kusama addresses start with a capital letter.
All unregistered Substrate chains start with `5`.

You can look the a chain-specific address for a public key using the `subkey inspect` commmand and `--network` option ot by using [Subscan](https://polkadot.subscan.io/tools/format_transform).

For information about generating public and private key pairs and inspecting addresses, see [subkey](/reference/command-line-tools/subkey).
For information about chain-specific address, see the instructios in the [SS58 repository](https://github.com/paritytech/ss58-registry).

## Keyless accounts for special cases

In some cases, you might want to create an account that is detached from any owner so that it can be used to perform anonymous transactions.
For example, you might create an account, then remove yourself from the account so that it is autonomous and can receive funds or be transferred to someone else.
After you relinquish control, the new account can be used to burn funds because no one has the keys to the account.
