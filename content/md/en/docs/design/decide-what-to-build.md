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
It is up to you to correctly assess and apply fees to the different parts of your runtime logic to protect the network and your user community.

Setting up your own blockchain on the other hand has the cost of building a community who find value in your service or establishing a trusted private network.
Making the custom runtime accessible and secure for others to use involves acquiring physical or cloud computing resources and managing a network infrastructure.

With smart contracts, your application runs on top of an existing execution model, limiting what your application can do.
With a custom runtime, you can always extend the underlying execution logic to enable smart contract execution for other developers.
Pallets in a custom runtime enable you to deliver more complex functionality and user interactions.

## Parachain

A custom runtime can exist on its own as the business logic for a private network or a solo chain, but there are several advantages to deploying the business logic and state transition function as an application-specific parachain or parathread.
Parachains and parathreads connect to a relay chain. 
Efficient transaction processing
They benefit from the pooled security, thought-through governance, and overall scalability of the heterogeneous sharding approach of the network. Creating a parachain can be seen as creating a Layer-1 blockchain, which has its own logic and runs in parallel within the Polkadot ecosystem.

Developers can focus on creating state-of-the-art chains that take advantage of Polkadot's next-generation approach. Some examples of what a parachain could be are:

DeFi (Decentralized Finance) Applications
Digital Wallets
IoT (Internet of Things) Applications
Gaming
Web 3.0 Infrastructure

As a parachain or parathread, your project can taken advantage of the shared security and interoperability of the Polkadot ecosystem.
Developing a parachain or a parathread is similar to A parachain or a parathread is a natural extension of a custom runtime when the application-specific blockchain logic is ready to reach a broader audience and 







Smart contracts must be manually added, upgraded, and removed by the contract developer through the mechanism provided by the underlying chain.
Smart contracts are deployed on a target chain with its own environment.

However, since the parachains that connect to Polkadot can support arbitrary state transitions, they can support smart contracts.


## Additional resources


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

