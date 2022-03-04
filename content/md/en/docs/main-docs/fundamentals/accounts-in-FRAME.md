# Accounts in FRAME

_This article goes over the account system in FRAME including: runtime specification, behavior, different types of accounts and their uses._

As stated in the article about [Addresses and Keys](), accounts types are defined generically and only made concrete in the runtime.
This article goes through how Substrate's account system is made flexible and extensible, providing examples on common account types.

## What is an account

An account generally corresponds to some public key which can receive funds and execute extrinsics with a valid private key.
In Substrate these can fall under three categories:
* End user accounts: these are accounts created by end users to interact with some blockchain.
* Network validator accounts: these are accounts used for staking purposes.
* Pallet accounts: these are accounts that can only be controlled by valid origins, such as for handling on-chain treasuries with governance or executing 

## Account runtime specification

The way FRAME understands an account is specified in the `frame_system` pallet, where an account is defined as a storage map of an identifier associated with some account information, such as the amount of transactions the account has made and some other reference counters.
Learn more about how accounts are implemented [here]().

In a typical runtime built with FRAME, an account is identified as a 32-byte address, defined in the runtime.

## Existential deposit

## Multi-sig

## Treasury addresses 

## Pallet addresses

## Zero address 



