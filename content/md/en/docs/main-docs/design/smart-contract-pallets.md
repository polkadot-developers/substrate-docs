---
title: Smart contract pallets
description:
keywords:
---

Substrate provides two smart contract virtual machines which can be added to your runtime: the [Contracts pallet](#contracts-pallet) and the [EVM pallet](#evm-pallet).
Each come with additional tools to ease development depending on your use cases.

## Contracts pallet

The [Contracts pallet](https://paritytech.github.io/substrate/master/pallet_contracts/index.html) provides the ability for the runtime to deploy and execute [WebAssembly (Wasm)](https://webassembly.org/) smart contracts.
It uses [ink!](https://paritytech.github.io/ink-docs/), a [Rust](https://www.rust-lang.org/)-based embedded domain specific language ([eDSL](https://wiki.haskell.org/Embedded_domain_specific_language)) for writing [WebAssembly](https://webassembly.org/) smart contracts.

Here are some of ink!'s key features:

- Designed for correctness, conciseness and efficiency, ink! carries familiar concepts from other modern smart contract languages.
  Learn more about [how it compares to Solidity](https://paritytech.github.io/ink-docs/ink-vs-solidity).
- ink! provides a built in test environment that can be used to perform off-chain unit testing with the Rust framework.
  This makes it simple and easy to ensure that your contract code functions as expected, without the need for third party testing platforms.
  Learn more [here](https://paritytech.github.io/ink-docs/basics/contract-testing/).
- Because ink! follows Rust standards, tools like [`rustfmt`](https://github.com/rust-lang/rustfmt) and [`rust-analyzer`](https://github.com/rust-analyzer/rust-analyzer) already work out of the box.

Virtual machines, such as EVM or Wasm, can support different programming languages to write smart contracts.
For example, Solidity can be used for both EVM and Wasm environments using purpose built compilers.
With the contracts pallet as the execution environment, any language can be used so long as it compiles to Wasm, ink! being the most widely supported language.
See [some examples](https://paritytech.github.io/ink-docs/examples/) on how to write a smart contract using ink!.

### Features

The Contracts pallet has a number of familiar and new features for the deployment and execution of smart contracts.

#### Wasm Engine

The Contracts pallet depends on a Wasm sandboxing interface defining the Wasm execution engine available within the runtime. This is currently implemented with [`wasmi`](https://github.com/paritytech/wasmi), a Wasm interpreter.

#### Account based

The Contracts pallet uses an account-based system similar to many existing smart contract platforms.
To the Substrate runtime, contract accounts are just like normal user accounts; however, in addition to an `AccountID` and `Balance` that normal accounts have, a contract account also has associated contract code and some persistent contract storage.
A notable behavior that arises from this is that a contract's account can receive balances without having its code executed by a plain transfer transaction.

### Deploying and calling contracts

Deploying a contract with the Contracts pallet takes two steps:

1. Store the Wasm contract on the blockchain.
2. Instantiate a new account, with new storage, associated with that Wasm contract.

This means that multiple contract instances, with different constructor arguments, can be initialized using the same Wasm code, reducing the amount of storage space needed by the Contracts pallet on your blockchain.

Calls to contracts can alter the storage of the contract, create new contracts, and call other contracts.
Because Substrate provides you with the ability to write custom runtimes, the Contracts pallet also enables you to make synchronous calls directly to those runtime functions on behalf of the contract's account.

The Contracts pallet is intended to be used by any user on a public network.
This means that contracts only have the ability to directly modify their own storage.
To provide safety to the underlying blockchain state, the Contracts pallet enables revertible transactions, which roll back any changes to the storage by contract calls that do not complete successfully.

### Gas

Contract calls are charged a gas fee to limit the amount of computational resources a transaction can use.
When forming a contract transaction, a gas limit is specified.
As the contract executes, gas is incrementally used up depending on the complexity of the computation.
If the gas limit is reached before the contract execution completes, the transaction fails, contract storage is reverted, and the gas fee is **not** returned to the user.
If the contract execution completes with remaining gas, it is returned to the user at the end of the transaction.

The concept of gas is tightly integrated with substrates [**weight system**](/main-docs/build/tx-weights-fees/).
In fact there is no difference between gas and weight.
The specified `gas_limit` directly influences the weight of the submitted transaction.
The contracts pallet uses _post dispatch weight correction_ to change the pre dispatch weight derived from the `gas_limit` to the actual weight consumed.
Thus, to execute a transaction, a user must have a free balance of at least `weight price` \* `gas limit` which can be spent.
The charged fee however, is based upon the actually consumed gas.
The weight price is determined due do the usual [transaction fee mechanism](/main-docs/build/tx-weights-fees/).
The Contracts pallet determines the gas price, which is a conversion between the Substrate **weight system** and a single unit of gas.
Thus, to execute a transaction, a user must have a free balance of at least `gas price` \* `gas limit` which can be spent.

### Storage deposit

Similar to how gas limits the amount of computational resources that can be used during a transaction, storage deposit limits the footprint that a contract can have on the blockchain's storage.
Any caller of a contract is charged a deposit proportionally to the amount of storage that the call in question adds to the blockchain.
If a call removes storage the caller that removes it gets a refund proportionally to the amount of storage that was removed.
Please note that with caller we mean the origin of a contract execution and not any contract which calls into another contract during a transaction.

Similar to the `gas_limit` argument there is also a `storage_limit` argument with which users can limit the amount of deposit that can be incurred.
The argument is denominated in native chain balance and hence the user must have at least that amount of free balance.

### Contracts pallet

The Contracts pallet attempts to repair this through [storage deposit](#storage-deposit) which ensures that any data that persists on the blockchain is appropriately charged for those resources.

The Contracts pallet chooses to approach contract creation using a [two-step process](#deploying-and-calling-contracts), which fundamentally changes how contracts are stored on
chain.
Contract addresses, their storage, and balances are now separated from the underlying contract logic.
This could enable behavior like what [`create2`](https://eips.ethereum.org/EIPS/eip-1014) provided to Ethereum or even enable repairable or upgradeable contracts on a Substrate based blockchain.

#### How do I add the Contracts pallet to my custom chain?

You can follow [the tutorial here](/tutorials/work-with-pallets/) for instructions on how to add the Contracts pallet and other FRAME pallets to your blockchain's runtime.

# EVM pallet

The FRAME Ethereum Virtual Machine (EVM) provides an execution environment for Substrate's Ethereum compatibility layer, known as [Frontier](https://github.com/paritytech/frontier/).
Frontier allows unmodified EVM code to be executed in a Substrate-based blockchain, designed to closely emulate the functionality of executing contracts on the Ethereum mainnet within the Substrate runtime.

For more information on the FRAME EVM, see [FRAME EVM pallet reference](https://docs.rs/pallet_evm/).

To use the Frontier node template, go to https://github.com/paritytech/frontier/tree/master/template.

The Substrate runtime works alongside the [Ethereum pallet](https://docs.rs/pallet-ethereum) and the [Dynamic Fee pallet](https://docs.rs/pallet-dynamic-fee) to enable the creation of runtimes capable of fully emulating Ethereum block production and transaction processing.

## EVM engine

Frontier's EVM pallet uses [SputnikVM](https://github.com/rust-blockchain/evm) as the underlying EVM engine. The engine is overhauled to be modular.
For more information see [Core Paper Project of EVM](https://github.com/corepaper/evm).

The EVM is a good theoretical execution environment, but it is not very practical to use with modern hardware.
For example, manipulation of 256 bit integers on modern architectures is significantly more complex than standard types.
The Ethereum team has investigated the use of [Wasm](https://github.com/ewasm/design) for the next generation of the network.

An alternative to using the EVM is adding the Contracts pallet.
The Contracts pallet iterates on existing ideas in the smart contract ecosystem, particularly Ethereum and the EVM.

The most obvious difference between the Contracts pallet and the EVM is the underlying execution engine used to run smart contracts.
To learn more about the Contracts pallet, see [link](link).

## Cost

The EVM charges for storage fees only at the time of storage.
This one-time cost results in some permanent amount of storage being used on the blockchain, forever, which is not economically sound.

## Execution lifecycle

Substrate-based accounts can call the EVM pallet to deposit or withdraw a balance from the Substrate base-currency into a different balance managed and used by the EVM pallet.
Once a user has populated their balance, they can create and call smart contracts using this pallet.

There's one-to-one mapping from Substrate accounts and EVM external accounts defined by a conversion function.

## EVM pallet vs. Ethereum network

The EVM pallet should be able to produce nearly identical results as the Ethereum mainnet, including gas cost and balance changes.

Observable differences include:

- The available length of block hashes may not be 256 depending on the configuration of the Substrate System pallet in the Substrate runtime.
  For more information on the System pallet, see the [System pallet rust documentation](https://paritytech.github.io/substrate/master/frame_system/index.html#system-pallet).
- Difficulty and coinbase, which do not make sense in this pallet and are currently hard-coded to zero.

Unobservable behaviors, such as state root are not the same when using the EVM pallet.
The transaction / receipt format is also different. However, given one Ethereum transaction and one Substrate account private key, you should be able to convert any Ethereum transaction into a transaction compatible with this pallet.

The gas configurations are currently hard-coded to the Istanbul hard fork.
It can later be expanded to support earlier hard fork configurations.

Substrate is built to enable you to extend what's provided out of the box.
We encourage further development of alternative smart contract platforms on top of the Substrate runtime.
Use these pre-built pallets to inform how you might design your own system or how you could port over an existing system to work on a Substrate-based chain.

## FAQ

### What is the difference between memory and storage?

In ink! `memory` is the computer memory that is commonly known to programmers, while `storage` is the contract instance memory. The `storage` is backed up by the runtime in a database. Accesses to it are considered to be slow.

### How do I run tests?

When building a smart contract with ink!, you can define a set of tests. For example, in the [flipper contract](https://github.com/paritytech/ink/blob/master/examples/flipper/lib.rs), you can find a small test at the bottom of the contract.

To run this test, type the following command:

```bash
cargo +nightly test
```

- Learn more about [why Rust is an ideal smart contract language](https://paritytech.github.io/ink-docs/why-rust-for-smart-contracts).
- Follow a [tutorial to add a pallet to your FRAME runtime](/tutorials/work-with-pallets/add-a-pallet/).

### Examples

- Follow [this tutorial](/tutorials/work-with-pallets/contracts-pallet/) to learn how to add the Contracts pallet to your FRAME runtime.

### References

- Visit the reference docs for the [Contracts pallet](https://paritytech.github.io/substrate/master/pallet_contracts/index.html).

- Take a look at the [repository for `wasmi`](https://github.com/paritytech/wasmi).

- For more information on ink!, see [the official ink! docs](https://paritytech.github.io/ink-docs/).

- Learn how to start developing with the Contracts pallet and ink! in the [smart contracts tutorials](/tutorials/smart-contracts/).

- To view the source code and documentation for the EVM pallet, see https://github.com/paritytech/frontier/tree/master/frame/evm.
- To view the ink! repository, see https://github.com/paritytech/ink.
