---
title: Smart contracts
description:
keywords:
  - smart contract options
  - WebAssembly
  - Solidity
  - ink!
  - Wasm
---

As discussed in [Decide what to build](/design/decide-what-to-build/), smart contracts are one approach to building an application to run on a Substrate-based blockchain.
Although there are certain limitations, there are also advantages to smart contracts.
For example, one reason you might want to start building your project with smart contracts is because contracts typically can be developed and tested quickly, allowing you to iterate on your design decisions and release your applications to the market faster.

In general, there are two types of smart contracts that you can deploy in a Substrate runtime:

- WebAssembly contracts.
- EVM-compatible contracts.

The type of contract you want to build is one of the first decisions you need to make.
It's also important to note that smart contracts are instructions that are instantiated and executed using a specific chain address—the smart contract account address.
This means that—in addition to selecting a language for writing the smart contract—you need to identify the chain that will serve as the host platform for your contract.
For example, you might want to deploy your application as a smart contract on an existing parachain in the Polkadot or Kusama ecosystem, work with another team to build a custom parachain specifically for the type of contract you want to deploy, or build your own runtime with the specific features and functionality you want to deliver.

## About the Contracts pallet

In most cases, the Contracts pallet is best option if you want to build smart contracts for a Substrate runtime.
By adding the Contracts pallet to the runtime, you can deploy and execute WebAssembly-based smart contracts.
If you are building your own runtime to host smart contracts, there are two main reasons for including the Contracts pallet:

- You want to build a general-purpose blockchain that uses smart contracts to provide the **core functionality** you want to deliver.

  For example, if you have an innovative idea that focuses on the use of smart contracts, you can use the Contracts pallet to build the base layer of your chain, then complement the base layer with only the minimal number of additional pallets required to achieve your application-specific goals.

- You want to build an application-specific blockchain with the **flexibility** to use smart contracts to interact with the chain.

  For example, if you are building a chain with most of the logic defined using other Substrate pallets, you can expose some parts of the chain logic to users through smart contracts.
  Smart contracts are ideal for this type of use case because they treat all user input as untrusted and potentially adversarial.

  As an example, assume you are building a decentralized exchange.
  Most of the logic is defined in pallets, but you want to allow users to upload their own trading algorithms through a smart contract.
  With the gas fees associated with executing a smart contract, users have to pay for the execution time of their trading algorithms.

  The Contracts pallet provides the [Chain extension](https://ink.substrate.io/macros-attributes/chain-extension/) primitive for exactly that functionality and programming languages—like [ink!](https://paritytech.github.io/ink/)—can make use of the business logic primitives your chain exposes.

## Smart contract accounts

The Contracts pallet extends accounts based on the `Currency` trait to have smart contract functionality.
You can use these **smart contract accounts** to instantiate smart contracts and to make calls to other contract and non-contract accounts.

The smart contract code is stored in a cache and can be retrieved using its hash.
This design enables multiple smart contracts to be instantiated from the same hash without replicating the code each time.

When a user interacts with a smart contract by calling one of its functions, the associated smart contract code is retrieved using the code hash and the function is executed.
Calling a smart contract function can result in:

- Changing the storage associated wih the smart contract account.
- Changing the storage associated wih a non-contract account.
- instantiating a new smart contract.
- Calling another smart contract account.

If a smart contract account is depleted, its associated code and storage is also be deleted.

## Contract execution and gas

All instructions invoked by a smart contract require payment in the form of **gas** fees.
Senders must specify a gas limit for every call.
Unused gas is refunded after the call, regardless of the execution outcome.

If the gas limit is reached, then all calls and state changes—including balance transfers—are only reverted at the current call’s contract level.
For example, if contract A calls contract B and contract B runs out of gas mid-call, then all of the contract B calls and state changes are reverted.
If contract A has correct error handling, any other calls and state changes make by contract A persist.
