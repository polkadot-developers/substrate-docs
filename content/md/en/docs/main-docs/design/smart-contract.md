---
title: Smart Contract Toolkits
slug: /v3/runtime/smart-contracts
version: '3.0'
section: docs
category: smart contracts
keywords:
  - contracts
  - evm
  - ethereum
---

This article gives an overview of the different ways to implement
smart contracts for Substrate-based blockchains. It also aims to provide insight on
reasons for choosing smart contract development over runtime development for your on-chain logic.

## Smart Contracts vs. Runtime Development

Developing Substrate runtimes and smart contracts are two different approaches to building
"decentralized applications" using Substrate.

### Smart contracts

A traditional smart contract platform allows users to publish additional logic on top of some core
blockchain logic. Since smart contract logic can be published by anyone, including malicious actors
and inexperienced developers, there are a number of intentional safe guards built around these
public smart contract platform.

Some examples are:

- **Fees**: Ensuring that contract execution incurs fees for the computation and storage it forces
  on the computers where it is runnning on, and not allowed to abuse the block creators.

- **Sandbox**: A contract is not able to modify core blockchain storage or the storage of other
  contracts directly. Its power is limited to only modifying its own state, and the ability to
  make outside calls to other contracts or runtime functions.

- **Storage Deposit**: A contract takes up space on the blockchain, and thus should be charged for
  taking up space on the nodes' hard drives. This ensures that people don't take advantage of
  "free, unlimited storage".

- **Reversion**: A contract can be prone to have situations which lead to logical errors. The
  expectations of a contract developer are low, so extra overhead is added to support reverting
  transactions when they fail so no state is updated when things go wrong.

These different overheads makes running contracts slower and more costly, but again, the "target
audience" for contract development is different than runtime developers.

Contracts allow your community to extend and develop on top of your runtime logic without
needing to go through all the craziness of proposals, runtime upgrades, etc... It may even be used
as a testing grounds for future runtime changes, but done in a way that isolates your network from
any of the growing pains or errors which may occur.

**In summary, Substrate Smart Contracts:**

- Are inherently safer to the network.
- Have built in economic incentives against abuse.
- Have computational overhead to support graceful failures in logic.
- Have a lower bar to entry for development.
- Enable fast pace community interaction through a playground to write new logic.

### Runtime development

On the other hand, runtime development affords none of these protections or safe guards that Smart
Contracts give you. As a runtime developer, the barrier to entry on the code you produce jumps way up.

You have full control of the underlying logic that each node on your network will run. You have full
access to each and every storage item across all of your pallets, which you can modify and control.
You can even brick your chain with incorrect logic or poor error handling. In essence, runtime engineers
have a lot more responsibility for the correctness and robustness of the code they write.

Substrate runtime development has the intention of producing lean, performant, and fast nodes.
It provides none of the protections or overhead of transaction reverting, and does not
implicitly introduce any fee system to the computation which nodes on your chain run. This means
while you are developing runtime functions, it is up to _you_ to correctly assess and apply fees to
different parts of your runtime logic such that it will not be abused by malicious actors.

**In summary, Substrate Runtime Development:**

- Provides low level access to your entire blockchain.
- Removes the overhead of built-in safety for performance,
  giving developers increased flexibility at the cost of increased responsibility.
- Raises the entry bar for developers, where developers are
  not only responsible for writing working code but must constantly check to avoid writing broken code.
- Has no inherent economic incentives to repel bad actors.

### Choosing the right approach

Substrate runtime development and Smart Contracts each provide tools designed for different problem spaces. There is likely some amount of overlap in the kinds of problems each one can solve, but
there is also a clear set of problems suited for only one of the two. To give just one example in
each category:

- **Runtime Development:** Building a privacy layer on top of transactions in your blockchain.
- **Smart Contract:** Introducing multi-signature wallets over the currency of your blockchain.
- **Use Case Specific:** Building a gaming dApp which may need to build up a community of users (leaning towards a
  Smart Contract), or may need to scale to millions of transactions a day (leaning more towards Runtime
  Development).

In addition to everything written above, you also need to take into account the associated costs of setting up your
dApp using one approach over the other. Deploying a contract is a relatively simple and easy process since you
take advantage of the existing network. The only costs to you are the fees which you pay to deploy
and maintain your contract.

Setting up your own blockchain, on the other hand has the cost of building a community who find value
in the service you provide. Or, the additional costs
associated with establishing a private network with the overhead of a cloud computing based architecture and
general network maintenance.

It is hard to provide guidance on every possible scenario
as each one depends on specific use cases and design decisions.
In general, runtime development is most favorable for applications that
require higher degrees of flexibility and adaptability &mdash; for example,
applications that require accomodating different types of users or layers of
governance. The table below is meant to help inform your
decisions on which approach to use based on different situations.

<table>
  <thead>
    <tr>
      <th>Runtime Development </th>
      <th>Smart Contract</th>
      <th>Use Case Specific</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <ul>
          <li> Privacy Layer </li>
          <li> Feeless Token </li>
          <li> Light-Client Bridge </li>
          <li> Decentralized Exchange </li>
          <li> Oracles </li>
          <li> Stable Coin </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Multi-signature Wallet </li>
          <li>Data services </li>
          <li>Simple fundraiser </li>
        </ul>
      </td>
      <td>
        Gaming dApp
        <ul>
          <li>Small scale (contract)</li>
          <li> Large scale (runtime)</li>
        </ul>
        Decentralized Autonomous Organizations (DAO)
        <ul>
          <li>Community driven (contract)</li>
          <li>Protocol driven (runtime)</li>
        </ul>
        Treasury
        <ul>
          <li>Community driven (contract)</li>
          <li>Protocol driven (runtime)</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

If you are building on Polkadot, you can also [deploy smart contracts on its parachain](https://wiki.polkadot.network/docs/en/build-smart-contracts). 
Check [here](https://wiki.polkadot.network/docs/build-build-with-polkadot#what-is-the-difference-between-building-a-parachain-a-parathread-or-a-smart-contract) for a comparison between developing on a parachain, parathread, and smart contract.

Substrate provides two smart contract virtual machines which can be added to your runtime: the [Contracts pallet](#contracts-pallet) and
the [EVM pallet](#evm-pallet). Each come with additional tools to ease development depending on your use cases.

## Contracts pallet

The [Contracts pallet](/rustdocs/latest/pallet_contracts/index.html) provides
the ability for the runtime to deploy and execute [WebAssembly (Wasm)](https://webassembly.org/)
smart contracts. It uses [ink!](https://paritytech.github.io/ink-docs/), a [Rust](https://www.rust-lang.org/)-based embedded domain specific language
([eDSL](https://wiki.haskell.org/Embedded_domain_specific_language)) for writing
[WebAssembly](https://webassembly.org/) smart contracts.

Here are some of ink!'s key features:

- Designed for correctness, conciseness and efficiency, ink! carries familiar concepts from other modern smart contract
  languages. Learn more about [how it compares to Solidity](https://paritytech.github.io/ink-docs/ink-vs-solidity).
- ink! provides a built in test environment that can be used to perform off-chain unit testing with
  the Rust framework. This makes it simple and easy to ensure that your contract code functions as
  expected, without the need for third party testing platforms. Learn more [here](https://paritytech.github.io/ink-docs/basics/contract-testing/).
- Because ink! follows Rust standards, tools like [`rustfmt`](https://github.com/rust-lang/rustfmt)
  and [`rust-analyzer`](https://github.com/rust-analyzer/rust-analyzer) already work out of the box.

<AccentButton
  text={`Start the ink! workshop`}
  link={`/tutorials/v3/ink-workshop/pt1`}
/>

### Features

The Contracts pallet has a number of familiar and new features for the deployment and execution of
smart contracts.

#### Wasm Engine

The Contracts pallet depends on a Wasm sandboxing interface defining the Wasm execution engine
available within the runtime. This is currently implemented with
[`wasmi`](https://github.com/paritytech/wasmi), a Wasm interpreter.

#### Account based

The Contracts pallet uses an account-based system similar to many existing smart contract platforms.
To the Substrate runtime, contract accounts are just like normal user accounts; however, in addition
to an `AccountID` and `Balance` that normal accounts have, a contract account also has associated
contract code and some persistent contract storage. A notable behaviour that arises from this
is that a contract's account can receive balances without having its code executed by a plain transfer transaction.

### Deploying and calling contracts

Deploying a contract with the Contracts pallet takes two steps:

1. Store the Wasm contract on the blockchain.
2. Instantiate a new account, with new storage, associated with that Wasm contract.

This means that multiple contract instances, with different constructor arguments, can be
initialized using the same Wasm code, reducing the amount of storage space needed by the Contracts
pallet on your blockchain.

Calls to contracts can alter the storage of the contract, create new contracts, and call other
contracts. Because Substrate provides you with the ability to write custom runtimes, the
Contracts pallet also enables you to make synchronous calls directly to those runtime functions on
behalf of the contract's account.

The Contracts pallet is intended to be used by any user on a public network. This means that
contracts only have the ability to directly modify their own storage. To provide safety to the
underlying blockchain state, the Contracts pallet enables revertible transactions, which roll back
any changes to the storage by contract calls that do not complete successfully.

### Gas

Contract calls are charged a gas fee to limit the amount of computational resources a transaction
can use. When forming a contract transaction, a gas limit is specified. As the contract executes,
gas is incrementally used up depending on the complexity of the computation. If the gas limit is
reached before the contract execution completes, the transaction fails, contract storage is
reverted, and the gas fee is **not** returned to the user. If the contract execution completes with
remaining gas, it is returned to the user at the end of the transaction.

The concept of gas is tightly integrated with substrates [**weight system**](/v3/concepts/weight).
In fact there is no difference between gas and weight. The specified `gas_limit` directly influences
the weight of the submitted transaction. The contracts pallet uses
[post dispatch weight correction](/v3/concepts/weight#post-dispatch-weight-correction) to change
the pre dispatch weight derived from the `gas_limit` to the actual weight consumed.
Thus, to execute a transaction, a user must have a free balance of at least `weight price` \* `gas limit`
which can be spent. The charged fee however, is based upon the actually consumed gas. The weight price
is determined due do the usual [transaction fee mechanism](/v3/runtime/weights-and-fees).
The Contracts pallet determines the gas price, which is a conversion between the Substrate
[**weight system**](/v3/concepts/weight) and a single unit of gas. Thus, to execute a transaction, a user
must have a free balance of at least `gas price` \* `gas limit` which can be spent.

### Storage deposit

Similar to how gas limits the amount of computational resources that can be used during a
transaction, storage deposit limits the footprint that a contract can have on the blockchain's storage.
Any caller of a contract is charged a deposit proportionally to the amount of storage that the
call in question adds to the blockchain. If a call removes storage the caller that removes it
gets a refund proportionally to the amount of storage that was removed. Please note that with
caller we mean the origin of a contract execution and not any contract which calls into another
contract during a transaction.

Similar to the `gas_limit` argument there is also a `storage_limit` argument with which users
can limit the amount of deposit that can be incurred. The argument is denominated in native
chain balance and hence the user must have at least that amount of free balance.

### Contracts pallet vs. EVM

The Contracts pallet iterates on existing ideas in the smart contract ecosystem, particularly
Ethereum and the EVM.

The most obvious difference between the Contracts pallet and the EVM is the underlying execution
engine used to run smart contracts. The EVM is a good theoretical execution environment, but it is
not very practical to use with modern hardware. For example, manipulation of 256 bit integers on
modern architectures is significantly more complex than standard types. Even the Ethereum team has
investigated the use of [Wasm](https://github.com/ewasm/design) for the next generation of the
network.

The EVM charges for storage fees only at the time of storage. This one-time cost results in some
permanent amount of storage being used on the blockchain, _forever_, which is economically unsound.
The Contracts pallet attempts to repair this through [storage deposit](#storage-deposit) which ensures
that any data that persists on the blockchain is appropriately charged for those resources.

The Contracts pallet chooses to approach contract creation using a
[two-step process](#deploying-and-calling-contracts), which fundamentally changes how contracts are stored on
chain. Contract addresses, their storage, and balances are now separated from the underlying
contract logic. This could enable behavior like what
[`create2`](https://eips.ethereum.org/EIPS/eip-1014) provided to Ethereum or even enable repairable
or upgradeable contracts on a Substrate based blockchain.

## EVM pallet

The [**FRAME EVM pallet**](https://docs.rs/pallet_evm/) provides an EVM execution environment for Substrate's Ethereum
compatibility layer, known as [Frontier](https://github.com/paritytech/frontier). It allows unmodified EVM
code to be executed in a Substrate-based blockchain, designed to closely emulate the
functionality of executing contracts on the Ethereum mainnet within the Substrate runtime.

It works alongside with the [Ethereum pallet](https://docs.rs/pallet-ethereum) and the
[Dynamic Fee pallet](https://docs.rs/pallet-dynamic-fee) to enable the creation of runtimes
capable of fully emulating Ethereum block production and transaction processing.

<AccentButton
  text={`Start the Frontier workshop`}
  link={`/tutorials/v3/frontier`}
/>

### EVM engine

The EVM pallet uses [SputnikVM](https://github.com/rust-blockchain/evm) as the underlying EVM engine.
The engine is overhauled so that it's [modular](https://github.com/corepaper/evm). In the future, we
will want to allow users to swap out components like gasometer, and inject their own customized
ones.

### Execution lifecycle

There are a separate set of accounts managed by the EVM pallet. Substrate based accounts can call
the EVM pallet to deposit or withdraw balance from the Substrate base-currency into a different
balance managed and used by the EVM pallet. Once a user has populated their balance, they can create
and call smart contracts using this pallet.

There's one-to-one mapping from Substrate accounts and EVM external accounts that is defined by a
conversion function.

### EVM pallet vs. Ethereum network

The EVM pallet should be able to produce nearly identical results compared to the Ethereum mainnet,
including gas cost and balance changes.

Observable differences include:

- The available length of block hashes may not be 256 depending on the configuration of the
  [System pallet](/rustdocs/latest/frame_system/index.html#system-pallet) in the Substrate runtime.
- Difficulty and coinbase, which do not make sense in this pallet and is currently hard coded to
  zero.

We currently do not aim to make unobservable behaviors, such as state root, to be the same. We also don't aim to follow the exact same transaction / receipt format. 
However, given one Ethereum transaction and one Substrate account's private key, one should be able to convert any Ethereum transaction into a transaction compatible with this pallet.

The gas configurations are currently hard-coded to the Istanbul hard fork. It can later be expanded to support earlier hard fork configurations.

Substrate is built to enable developers to extend what's provided out of the box.
We encourage further development of alternative smart contract platforms on top of the Substrate runtime.
Use these pre-built pallets to inform how you might design your own system or how you could port over an existing system to work on a Substrate-based chain.

## FAQ

#### What is the difference between memory and storage?

In ink! we refer `memory` to being the computer memory that is commonly known to programmers while
with `storage` we refer to the contract instance's memory. The `storage` is backed up by the runtime
in a database. Accesses to it are considered to be slow.

#### How do I run tests?

When building a smart contract with ink, you can define a set of tests.

For example, in the minimal
[flipper contract](https://github.com/paritytech/ink/blob/master/examples/flipper/lib.rs),
you can find a small test at the bottom of the contract.

To run this test, type the following command:

```bash
cargo +nightly test
```

#### How do I add the Contracts pallet to my custom chain?

You can follow
[our guide here](/how-to-guides/v3/pallet-design/contracts-pallet) for instructions on how to add the Contracts pallet
and other FRAME pallets to your blockchain's runtime.

## Learn more

- Learn more about [why Rust is an ideal smart contract language](https://paritytech.github.io/ink-docs/why-rust-for-smart-contracts).
- Follow a [tutorial to add a pallet to your FRAME runtime](/tutorials/v3/add-a-pallet/).
- Read [ink!'s documentation](https://paritytech.github.io/ink-docs/).

### Examples

- Follow a
  [this guide](/how-to-guides/v3/pallet-design/contracts-pallet) to learn how to add the Contracts pallet to your FRAME runtime.
- Learn how to
  [start developing with the Contracts pallet and ink!](/tutorials/v3/ink-workshop/pt1).

### References

- Visit the reference docs for the
  [Contracts pallet](/rustdocs/latest/pallet_contracts/index.html).
- View source code and documentation of the
  [EVM pallet](https://github.com/paritytech/frontier/tree/master/frame/evm).
- Visit the
  [ink! repository to look at the source](https://github.com/paritytech/ink).
- Visit the reference docs for the [EVM pallet](https://docs.rs/pallet_evm) and [`fp_evm`](https://docs.rs/fp-evm/).
- Visit the reference docs for [SputnikVM's `evm` crate](https://docs.rs/evm/).
- Take a look at the [repository for `wasmi`](https://github.com/paritytech/wasmi).
