---
title: Decide what to build
description:
keywords:
  - smart contract 
  - custom pallet
  - custom runtime
  - parachain
  - parathread
---

One of the first decisions you need to make in designing your application is the approach you want to use.
For example, you need to decide whether your project is best suited to be delivered in the form of a smart contract, an individual pallet, a custom runtime, or a parachain.
The decision about what to build will affect almost all of other decisions you'll need to make.
To help you make that initial determination about what to build, this section highlights the options available, the differences between them, and the reasons you might select one approach over another.

## Smart contracts

Many developers are familiar with smart contracts and are naturally inclined to think that their project is well-suited to the smart contract model.
However, there are both benefits and drawbacks for you to consider in determining whether the smart contract approach is right for your project.

### Smart contracts must adhere to blockchain rules

Smart contracts are instructions that are deployed on a specific chain and run on a specific chain address.
Because smart contracts run on an underlying blockchain logic that they don't control, they must comply with any rules or limitations that the underlying chain imposes. 
For example, the underlying blockchain might restrict access to storage or prevent certain types of transactions.

In addition, blockchains that accept smart contracts typically treat the code as coming from an untrusted source—potentially a malicious actor or inexperienced developer—and implement safe guards to prevent misbehavior and to protect the chain from the damage that a faulty smart contract might cause.
For example, the underlying chain might charge fees or enforce metering to ensure that contract developers or users are charged for the computation and storage the contract consumes.
The fees and rules for contract execution are at the discretion of the underlying chain.

### Smart contracts and state

You can think of smart contracts as executing in a sandboxed environment.
They don't modify the underlying blockchain storage or the storage of other contracts directly. 
In general, smart contracts only modify their own state and don't make calls to other contracts or to runtime functions.
There's typically some additional overhead for running smart contracts to ensure that the underlying blockchain can revert transactions to prevent state from being updated if errors in a contract cause it to fail.

### Scenarios for using smart contracts

Although there are limitations to smart contracts, there are scenarios where your project might benefit from using smart contracts.
For example, smart contracts have lower barrier to entry and can often be built and deployed in a short period of time.
The reduced development time might give you an advantage in determining product-to-market fit and iterating quickly.

Similarly, if you're familiar with building smart contracts using a language like Solidity, you can reduce the learning curve and time-to-market for your project. 
Because smart contracts adhere to the functionality of the chain where they are deployed, you can focus more narrowly on implementing the application logic of the contract without worrying about blockchain infrastructure or economics.

If you are planning to build a parachain, you can also use smart contracts to prototype features or functionality in an isolated way that doesn't affect the underlying network before investing in a more full-scale solution.
If you are a runtime developer, you can incorporate contracts to allow your community to extend and develop features for your runtime without granting them access to the underlying runtime logic.
You can also use smart contracts to test future runtime changes.

In general, you should consider the following characteristics of smart contracts:

- Inherently safer for the network because safe guards are built into the underlying chain, but you have no control over any restrictions, limitations, or computational overhead imposed by those safe guards.
- Built-in economic incentives against abuse, but the fee and metering system is defined by the underlying chain.
- Lower barrier to entry in terms of code complexity and time to deployment.
- Isolated environment for prototyping, testing, and community engagement.
- Lower deployment and maintenance overhead because you take advantage of an existing network.

The following examples illustrate use cases for smart contracts:

- Add a derivative to a decentralized exchange (DEX).
- Implement a custom trading algorithm.
- Define logic for a contract between specific parties.
- Prototype and test an application before converting it to parachain.
- Introduce layer-2 tokens and custom assets on an existing chain. 

### Support for smart contracts

The Polkadot relay chain doesn't support smart contracts. 
However, the parachains that connect to Polkadot can support arbitrary state transitions, so any parachain can be a potential platform for smart contract deployment.
For example, there are several parachains in the current Polkadot ecosystem that support different types of smart contract deployment.
If you plan to develop a smart contract for the Polkadot ecosystem, you must first decide on the type of smart contract you want to build and identify a parachain that supports that type of smart contract.
Substrate provides tools to support two types of smart contracts:

- The `contracts` pallet in the FRAME library enables a chain to execute smart contracts compiled to WebAssembly regardless of the language used to write the smart contract.
- The Frontier project provides tools and an `evm` pallet that enable a chain to run Ethereum virtual machine (EVM) contacts written in Solidity.

## Individual pallets

In some cases, you might want to implement application logic as a standalone pallet and make the functionality available to the community as a library rather than building your own custom runtime.
For example, if you don’t want to deploy and manage an application-specific blockchain, you might build one or more individual pallets to provide features that are broadly useful across all Substrate-based chains, that improve existing functionality, or that define a standard for the Polkadot ecosystem.
Individual pallets are typically easy to develop by using FRAME and easy for Substrate chains to integrate.

It's worth noting that pallets don't inherently provide any of type of protection or safeguards that smart contracts provide. 
With pallets, you have full control over the logic that each node on the network runs. 
You have full access to the storage your modules write and control. 
Pallets don't inherently introduce a fee or metering system.
It is up to you to ensure that your pallet logic doesn't allow bad behavior or leave the network where your pallet is used vulnerable to attacks.
This lack of built-in safeguards implies that you have a great deal of responsibility to write code that avoids mistakes.
Even if you are building a single pallet, you'll need to test it in the context of a runtime.
Often, writing a pallet is the gateway to runtime development, giving you the opportunity to experiment with existing pallets and coding patterns without building a compete blockchain application.

Although writing and testing pallets is typically a stepping stone to building larger scale application, there are many examples of the value individual pallets can have to the ecosystem as a whole.

The main disadvantage of developing individual pallets is that you don't have control over any other part of the runtime where they are used.
In addition, change to FRAME or Substrate can create maintenance issues for your individual pallets if upgrades aren't synchronized.

## Custom runtime

In most cases, deciding to build a custom runtime is the critical step toward building and deploying an application-specific parallel blockchain—a parachain—as part of the Polkadot ecosystem.
By building with Substrate and FRAME, you can develop a fully-customized runtime.
With a custom runtime, you have complete control over all aspects of your application, including economic incentives, governance, consensus, and resource management.

There are pallets that provide pluggable modules for many of these features.
However, it is up to you as a runtime developer to decide which modules to use, how to modify them for your needs, and where custom modules are required.
Because you control all of the underlying logic that each node in your network runs, there's a higher barrier to entry in terms of coding skill and experience than there is for writing a smart contract or an individual pallet. 

The runtime is composed of pallets, and—as with individual pallets—there are no built-in safeguards to prevent bad actors or incorrect code from causing harm. 

some of which can also be pallets that enable 
You have full access to each and every storage item across all of your modules,

## Parachain



Pallets
NOTE: Pallets use to be called Runtime Modules.

Pallets on the other hand afford none of these protections or safe guards that Smart Contracts give you. As a runtime developer, the bar to entry on the code you produce jumps way up.

 which you can modify and control. You can even brick your chain with incorrect logic or poor error handling.

Pallet development has the intention of producing lean, performant, and fast nodes. It affords none of the protections or overhead of transaction reverting, and does not implicitly introduce any fee system to the computation which nodes on your chain run. This means while you are developing runtime functions, it is up to you to correctly asses and apply fees to the different parts of your runtime logic such that it will not be abused by bad actors and hurt your network.

In summary, Pallets:

Provide low level access to your entire blockchain.
Have removed the overhead of built-in safety for performance.
Have a high bar to entry for developers.
Not necessarily to write working code, but to avoid writing broken code.
Has no inherent economic incentives to repel bad actors.

The Right Tool For You

Substrate Pallets and Substrate Smart Contracts are tools made available to you to solve problems.

There is likely some amount of overlap in the kinds of problems each one can solve, but there is also a clear set of problems suited for only one of the two. Two give just one example in each category:

Pallets: Building a privacy layer on top of transactions in your blockchain.
Shared: Building a DApp like Cryptokitties which may need to build up a community of users (leaning toward Smart Contract), or may need to scale to millions of transactions a day (leaning toward Pallets).
Smart Contract: Introducing 2nd layer tokens and custom assets to your network.
In addition to everything written above, you also need to take into account the costs to set up a DApp using a certain tool. Deploying a contract is a relatively simple and easy process since you take advantage of the existing network. The only costs to you are those fees which you pay to deploy and maintain your contract.

Setting up your own blockchain on the other hand has the cost of building a community who find value in your service or establishing a private network with the overhead of cloud computing system and general network maintenance.

I think that now is really the first time it has been so easy and approachable to build runtime logic. In the past, everyone built their "decentralized application idea" using the tool available to them, Smart Contracts, even when that wasn't the best tool for the job.

With the introduction of Substrate, there is a new tool available for building your decentralized applications; but again, it would be wrong to think that all of your ideas should be a Substrate Pallet.

Instead, for the first time as a community, we have two tools, and we need to figure out together which one is best to use for each scenario. I don't think all the answers to this exist today, but we can learn and make some educated guesses along the way.


Beyond the engineering tradeoffs correctly outlined above (tradeoffs of economic costs, responsibility and margin for error), there's a high level and fundamental difference between smart contracts and pallets this answer could benefit from outlining:

The runtime of a Substrate chain is composed of pallets, some of which can also be pallets that enable smart contract execution. In this way, comparing the two is like comparing apples and oranges: a runtime engineer can extend the underlying execution logic and capabilities of a chain using pallets, whereas a smart contract engineer develops applications on-top of some existing execution model (for example, pallet-contract or pallet-evm).
What a smart contract can provide in terms of user facing interactions is a subset of what a pallet can provide. Pallets can be used to write more complex functionality, for example modifying the fee system of the chain, adding a multi-asset payment system or giving a reward to certain users every n blocks.
Smart contracts can be written by anyone, added and removed at any time, while pallets are part of the runtime and can only be added or modified using on-chain governance via a runtime upgrade.
All in all, pallets are suited for developers building application-specific blockchains, whereas smart contracts are suited for developers building applications on-top of a blockchain specialized for executing smart contracts.


Smart contracts must be manually added, upgraded, and removed by the contract developer through the mechanism provided by the underlying chain.
Smart contracts are deployed on a target chain with its own environment.

However, since the parachains that connect to Polkadot can support arbitrary state transitions, they can support smart contracts.


### Additional resources

Here is the list of current resources available to developers who want to get started writing smart contracts to deploy on parachains based on Substrate.

ink! - Parity's ink to write smart contracts.
Substrate ink! Workshop - Walks you through the basics of writing and deploying an ERC-20 token using ink!.
Contracts Pallet
The experience of deploying to an EVM-based chain may be more familiar to developers that have written smart contracts before. However, the Contracts pallet makes some notable improvements to the design of the EVM:

Wasm. The Contracts pallet uses WebAssembly as its compilation target. Any language that compiles to Wasm can potentially be used to write smart contracts. Nevertheless, it is better to have a dedicated domain-specific language, and for that reason Parity offers the ink! language.

Deposit. Contracts must hold a deposit (named ContractDeposit ) suitably large enough in order to justify their existence on-chain. A deployer needs to deposit this into the new contract on top of the ExistentialDeposit.

Caching. Contracts are cached by default and therefore means they only need to be deployed once and afterward be instantiated as many times as you want. This helps to keep the storage load on the chain down to the minimum. On top of this, when a contract is no longer being used and the existential deposit is drained, the code will be erased from storage (known as reaping).



Polkadot Standards Proposals (PSPs)
Web3 Foundation supports proposals for Polkadot that define a set standards to fit ecosystem needs. These standards go through several acceptance phases, where the engagement of the whole community is needed to build valuable and future-proof standards. All the teams who will benefit from a standard need to agree on its content.

Some of these PSPs are targeting Substrate's contracts pallet:

PSP22 - Fungible Token Standard Please visit Polkadot Standards Proposals (PSPs) Github for more information.
Ink
ink! is a domain specific language for writing smart contracts in Rust and compiles to Wasm code. As it states in its README, it is still in an experimental phase so brave developers should be aware that they might have a bumpy - but workable - development experience. There are some projects that have built projects in ink! with a decent level of complexity such as Plasm's Plasma contracts, so it is mature enough to start building interesting things.

For interested developers, they can get started writing smart contracts using ink! by studying the examples that were already written. These can be used as guideposts to writing more complex logic that will be deployable on smart contract parachains.

ink! has laid much of the groundwork for a new smart contract stack that is based on a Wasm virtual machine and compatible with Substrate chains.

Libraries for Smart Contracts in ink!
Collected below are some community examples of smart contracts in ink!. Are you working on a smart contract example? Ask us to add it to this page!

OpenBrush: an ink! library providing standard contracts based on PSP with useful contracts and macros for building.
Metis: a Wasm contract standard library, developed by Patract Labs.
Smart Contract Environments are still Maturing
It is still early for smart contracts on Polkadot and the development is only now stabilizing. We are actively producing content to help developers get up to speed and will maintain the Wiki with the latest resources.

---
Parachain, contract or a pallet?
Intro

Parachain
Parachain development gives you more freedom in designing the functionality of the chain.
A runtime module is the entire logic of a chain’s state transitions (what’s called a state transition function) - and it is entirely up to you what logic you want to create. The only requirement to keep in mind is the compatibility with Polkadot API.
Smart contracts must consciously implement upgradability while parachains will have the ability to swap out their code entirely through a root command or via the governance pallet.
Pros
Efficiency
Parachains can have as little (or as much) overhead as you want per transaction, so a well optimized parachain can be extremely efficient.
They don’t need to have all of the expected default functionality needed in a smart contract platform.
Development freedom
The principal reason why many teams choose parachains over smart contracts is the flexibility that parachain development offers. You have full access to storage and can define your own economic primitives and policies, fees policy, governance mechanism, treasury accounts, roles - everything is totally up to you as long as your parachain is compatible with the Polkadot API :)
Cons
High entry barrier
Currently, there is only one Parachain Development Kit - Parity Substrate. Substrate is based on Rust and offers an extensive collection of pallets that you can implement in a parachain’s runtime. Although Rust is performant, type safe, and has an active community, it is still a relatively new language. If you haven’t worked with Rust or other system-level languages before, parachain development might require more of your resources than other options.
Speed of development
If your plan was to quickly write an app and deploy it within a few days or weeks, the parachain option is not for you.
Maintenance
If you have written and deployed smart contracts on other platforms such as Ethereum, you might be used to the ease of a contract’s maintenance. When you build and deploy a parachain, don’t forget that you build a whole blockchain. Even though the relay chain provides security and consensus for your project, you still must maintain your chain and network infrastructure. Aside from All things DevOps, you need to secure a parachain slot, design a crowdloan/auction strategy and accumulate enough resources to continuously extend the slot.
Use cases
As a general rule, we recommend that you build a parachain if your project requires complex operations because parachains provide faster and more efficient execution of transactions. For example, building a parachain might be the best option for the following use cases:
Custom assets management
Gaming-oriented chains
Building privacy layer on top of transactions
If you think building a parachain is the right option for your project, learn more about runtime development here.

