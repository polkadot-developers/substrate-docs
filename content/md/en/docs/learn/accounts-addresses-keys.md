---
title: Accounts, addresses, and keys
description: Provides an overview of how public/private key pairs are used to generate addresses and identify accounts.
keywords:
---

An account represents an identity—usually of a person or an organization—that is capable of making transactions or holding funds.
Although accounts are most often used to represent a person, that doesn't have to be the case.
An account can be used to perform operations on behalf of a user or another entity, or to perform operations autonomously.
In addition, any single person or entity could have multiple accounts for different purposes.
For example, Polkadot is a Substrate-based blockchain that has specialized accounts for holding funds that are separate from accounts used for making transactions.
How you implement and use accounts is entirely up to you as a blockchain or parachain developer.

## Public and private keys

In general, every account has an owner who possesses a public and private key pair.
The **private key** is a cryptographically-secure sequence of randomly-generated numbers.
For human readability, the private key generates a random sequence of words called a **secret seed phrase** or **mnemonic**.
The secret seed phrase is important because it can be used to recover access to an account if the private key is lost.

For most networks, the **public key** associated with an account is how that account is identified on the network and some form of it is used as the destination address for transactions.
However, Substrate-based chains use the underlying public key to derive one or more **public addresses**.
Instead of using the public key directly, Substrate allows you generate multiple addresses and address formats for an account.

## Address encoding and chain-specific addresses

By deriving multiple addresses from a single public key, you can interact with multiple chains without creating separate public and private key pairs for each network.
By default, the addresses associated with the public key for an account use the Substrate [**SS58 address format**](/reference/glossary/#ss58-address-format).
The SS58 address format is an enhanced version of [base-58 encoding](https://datatracker.ietf.org/doc/html/draft-msporny-base58-01).
The important characteristics of the SS58 address format include:

- Encoded addresses consist of 58 alphanumeric characters, resulting in a shorter and more identifiable address than a hex-encoded address.
- Addresses don't use characters that can be difficult to distinguish from each other in a string.
  For example, the characters `0`, `O`, `I`, and `l` aren't used in SS58 addresses.
- Addresses can include a network-specific prefixes so you can use the same public key to derive addresses for different chains.
- Addresses can use derivation paths to create multiple addresses from the same public key so you can use different addresses for different purposes.
  For example, you can create sub-accounts for separating funds or executing specific types of transactions.
- Addresses can be verified using a checksum to prevent input errors.

### Inspecting network-specific addresses

Because a single public key can be used to derive addresses for different Substrate chains, a single account can have multiple chain-specific addresses.
For example, if you inspect the addresses for the `alice` account public key `0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d` depends on the chain-specific address type.

| Chain address type             | Address                                          |
| ------------------------------ | ------------------------------------------------ |
| Polkadot (SS58)                | 15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5 |
| Kusama (SS58)                  | HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F  |
| Generic Substrate chain (SS58) | 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY |

### Registering for a network-specific address

Each Substrate-based blockchain can register a custom prefix to create a network-specific address type.
For example, all Polkadot addresses start with `1`.
All Kusama addresses start with a capital letter.
All unregistered Substrate chains start with `5`.

You can look up the network-specific address for a public key using the `subkey inspect` command and `--network` command-line option or by using [Subscan](https://polkadot.subscan.io/tools/format_transform).

For information about generating public and private key pairs and inspecting addresses, see [subkey](/reference/command-line-tools/subkey).
For information about registering for a chain-specific address, see the instructions in the [SS58 repository](https://github.com/paritytech/ss58-registry).

## Account information in FRAME

Conceptually, accounts represent identities that have a public/private key pair with one or more public addresses.
However, in a runtime built with FRAME, an account is defined as a storage map with a 32-byte address identifier and corresponding account information, such as the number of transactions the account has made, the number of modules that depend on the account, and the account balance.

The account properties—such as the `AccountId`—can be defined generically in the `frame_system` module.
The generic type is then resolved as a specific type in the runtime implementation, and eventually assigned a specific value.
For example, the `Account` type in FRAME relies on an associated `AccountId` type. The `AccountId` type remains a generic type until it is assigned a type in the runtime implementation for a pallet that needs this information.

For more information about how accounts are defined in the `frame_system` pallet and the account properties in the `Account` storage map, see [Account data structures](/reference/account-data-structures/).
For more information about working with generic types, see [Rust for Substrate](/learn/rust-basics/#generic-types).

## Specialized accounts

As a flexible and module framework for blockchain development, Substrate itself doesn't require you define or use any specific type of accounts.
However, different chains can implement different rules for how accounts and the keys that control them are used.
For example, you might implement specialized accounts if your application requires:

- custom cryptographic schemes
- complex or multi-user signing rules
- restricted access to specific functions
- restricted access to specific pallets

In most cases, specialized accounts are implemented in the context of a specific FRAME pallet, either in a prebuilt pallet like [Staking](https://paritytech.github.io/substrate/master/pallet_staking/index.html) or [Multisig](https://paritytech.github.io/substrate/master/pallet_multisig/index.html) or in custom pallets that you design.

For example, the Staking pallet takes an originating FRAME system account that wants to put up a bond and generates the **stash** and **controller** account abstractions to identify the account required to perform specific operations.
You can see the implementation of these account abstractions in the Polkadot ecosystem. However, you can use the same framework to implement different account rules or account types or as inspiration for a custom pallet with its own account abstractions.

### Multi-signature accounts

Typically, an account has one and only one owner and that owner holds the private key for signing transactions.
The Multisig pallet enables you to configure a specialized account for executing transactions that multiple account owners must approve.
The multisig account is an address that has a public key, but no private key.
The public address for the multisig account is derived from a deterministic list of the authorized account signatories and an associated transaction request block height and extrinsic index identifier.

The Multisig pallet enables multiple parties to share responsibility for executing certain transactions.
Any account holder can specify the accounts that are allowed to approve a multi-signature transaction and the minimum number of approvals required for a call to be dispatched to the runtime.

### Proxy and keyless accounts

The Proxy pallet provides another way you can configure specialized accounts for a Substrate-based chain using FRAME.
With proxy accounts, primary account owners can designate one or more other accounts to act on their behalf.
Proxy accounts can be used to add a layer of security by isolating primary account funds from accounts assigned to specific roles that can complete tasks on behalf of the primary account.

By configuring one or more proxy account, an account owner can do the following:

- Specify up to a maximum number of proxy accounts that are allowed to submit transactions on behalf of a primary account owner.
- Configure time delays for transactions to be executed by each proxy.
- Set restrictions on the types of transactions that each proxy can issue.
- Announce transactions that are to be executed by a proxy before the transactions are executed.
- Cancel or reject announced transactions that are to be executed by a proxy.
- Create anonymous—pure proxy—accounts that have no private key and can act without account ownership through their own configured proxies.

#### Runtime implementation

Although the Proxy pallet provides this framework for configuring proxy accounts, the implementation details are up to you as a runtime developer.
For example, the default Proxy pallet filters the calls a proxy account can dispatch based on the proxy type.
However, the runtime implementation defines the proxy types and the transactions that each proxy type is allowed to execute.
Polkadot enables you to restrict transactions for a proxy account using the following proxy types:

- Any
- NonTransfer
- Governance
- Staking
- IdentityJudgement
- CancelProxy
- Auction

The enumerated list of proxy types and the logic for matching proxy types to transaction is defined in the [Polkadot runtime](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/src/lib.rs).

#### Anonymous proxy account

The anonymous or pure proxy account is a special type of proxy account with a randomly-generated address and no corresponding private key.
Typically, you create this type of proxy account if you want to delegate permissions to an account that can dispatch function calls without your intervention and without access to your keys.
After the new account with the delegated permissions is created, the account can be used as a recipient to burn funds or to hold tokens awaiting the execution of a transfer.

## Where to go next

In Substrate, accounts require a public key and a private key to receive funds, sign transactions, and execute transactions.
At a high level, there are three types of accounts:

- User accounts that enable end users to interact with the blockchain.
- Network accounts that provide additional security for validators and nominators by restricting some operations for staking and governance.
- Pallet accounts that are executed by valid **origins** to perform pallet-specific operations.

For more information about working with accounts, addresses, and keys, see the following resources:

- [SS58 trait implementation](https://paritytech.github.io/substrate/master/sp_core/crypto/trait.Ss58Codec.html)
- [SS58 registry](https://github.com/paritytech/ss58-registry/)
- [Command reference: subkey](/reference/command-line-tools/subkey/)
- [Account data structures](/reference/account-data-structures/)
- [Cryptography](/learn/cryptography//)
