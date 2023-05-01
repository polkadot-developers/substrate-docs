---
title: What you can build
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
However, there are both benefits and drawbacks to consider in determining whether the smart contract approach is right for your project.

### Smart contracts must adhere to blockchain rules

Smart contracts are instructions that are deployed on a specific chain and run on a specific chain address.
Because smart contracts run on an underlying blockchain that they don't control, they must comply with any rules or limitations that the underlying chain imposes. 
For example, the underlying blockchain might restrict access to storage or prevent certain types of transactions.

In addition, blockchains that accept smart contracts typically treat the code as coming from an untrusted source—potentially a malicious actor or inexperienced developer.
To prevent untrusted code from disrupting blockchain operations, the underlying blockchain implements native safeguards to limit what a malicious or faulty smart contract can do.
For example, the underlying chain might charge fees or enforce metering to ensure that contract developers or users are charged for the computation and storage the contract consumes.
The fees and rules for contract execution are at the discretion of the underlying chain.

### Smart contracts and state

You can think of smart contracts as executing in a sandboxed environment.
They don't modify the underlying blockchain storage or the storage of other contracts directly. 
In general, smart contracts only modify their own state and don't make calls to other contracts or to runtime functions.
There's typically some additional overhead for running smart contracts to ensure that the underlying blockchain can revert transactions to prevent state from being updated if errors in a contract cause execution to fail.

### Scenarios for using smart contracts

Although there are limitations to smart contracts, there are scenarios where your project might benefit from using smart contracts.
For example, smart contracts have lower barrier to entry and can often be built and deployed in a short period of time.
The reduced development time might give you an advantage in determining product-to-market fit and iterating quickly.

Similarly, if you're familiar with building smart contracts using a language like Solidity, you can reduce the learning curve and time-to-market for your project. 
Because smart contracts adhere to the functionality of the chain where they are deployed, you can focus more narrowly on implementing the application logic of the contract without worrying about blockchain infrastructure or economics.

If you are planning to build a parachain, you can also use smart contracts to prototype features or functionality in an isolated way that doesn't affect the underlying network before investing in a more full-scale solution.
If you are a runtime developer, you can incorporate contracts to allow your community to extend and develop features for your runtime without granting them access to the underlying runtime logic.
You can also use smart contracts to test future runtime changes.

In general, you should consider the following characteristics when deciding whether to build your project using smart contracts:

- They are inherently safer for the network because safeguards are built into the underlying chain, but you have no control over any restrictions, limitations, or computational overhead imposed by those safeguards.
- The underlying chains provides the built-in economic incentives against abuse, but the fee and metering system is defined by the underlying chain.
- They have a lower barrier to entry in terms of code complexity and time to deployment.
- They can provide an isolated environment for prototyping, testing, and community engagement.
- They have lower deployment and maintenance overhead because you take advantage of an existing network.

The following examples illustrate use cases for smart contracts:

- Add a derivative to an existing decentralized exchange (DEX).
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

- The `contracts` pallet in the FRAME library enables a Substrate-based chain to execute smart contracts compiled to WebAssembly regardless of the language used to write the smart contract.
- The `evm` pallet in the Frontier project enables a Substrate-based chain to run Ethereum virtual machine (EVM) contracts written in Solidity.

### Explore smart contracts

If your project seems well-suited to be a smart contracts, you can see some simple examples to get you started in the following tutorials:

- [Develop smart contracts](/tutorials/smart-contracts/)
- [Access EVM accounts](/tutorials/integrate-with-tools/access-evm-accounts/)

## Individual pallets

In some cases, you might want to implement application logic as a standalone pallet and make the functionality available to the community as a library rather than building your own custom runtime.
For example, if you don’t want to deploy and manage an application-specific blockchain, you might build one or more individual pallets to provide features that are broadly useful across all Substrate-based chains, that improve existing functionality, or that define a standard for the Polkadot ecosystem.
Individual pallets are typically easy to develop by using FRAME and easy for Substrate chains to integrate.

### Writing correct code

It's worth noting that pallets don't inherently provide any of type of protection or safeguards that smart contracts provide.
With pallets, you control the logic available for runtime developers to implement. 
You provide the methods, storage items, events, and errors that your module requires. 
Pallets don't inherently introduce a fee or metering system.
It is up to you to ensure that your pallet logic doesn't allow bad behavior or leave the network where your pallet is used vulnerable to attacks.
This lack of built-in safeguards implies that you have a great deal of responsibility to write code that avoids mistakes.

### Pallets outside of runtime development

Often, writing a pallet is the gateway to runtime development, giving you the opportunity to experiment with existing pallets and coding patterns without building a compete blockchain application.
Individual pallets also provide an alternative way you can contribute to a project without writing your own application.

Although writing and testing pallets is typically a stepping stone to building larger scale application, there are many examples of the value individual pallets can have to the ecosystem as a whole.

Even if you are building a single pallet, you'll need to test it in the context of a runtime.
The main disadvantage of developing individual pallets is that you don't have control over any other part of the runtime where they are used.
If you treat your pallet as isolated code, you might miss opportunities to enhance or improve it.
In addition, changes to FRAME or Substrate can create maintenance issues for your individual pallets if you don't update your code to stay synchronized with those changes.

### Explore building pallets

If your project seems well-suited to be an individual pallet, you can see some simple examples to get you started in the following sections:

- [Custom pallets](/build/custom-pallets/)
- [Build application logic](/tutorials/build-application-logic/)
- [Collectibles workshop](/tutorials/collectibles-workshop/)

## Custom runtime

In most cases, deciding to build a custom runtime is the critical step toward building and deploying an application-specific parallel blockchain—a parachain—as part of the Polkadot ecosystem.
By building with Substrate and FRAME, you can develop a fully-customized runtime.
With a custom runtime, you have complete control over all aspects of your application, including economic incentives, governance, consensus, and resource management.

There are pallets that provide pluggable modules for many of these features.
However, it is up to you to decide which modules to use, how to modify them for your needs, and where custom modules are required.
Because you control all of the underlying logic that each node in your network runs, there's a higher barrier to entry in terms of coding skill and experience than there is for writing a smart contract or an individual pallet. 

As with individual pallets, a custom runtime doesn't provide any built-in safeguards to prevent bad actors or incorrect code from causing harm.
It is up to you to correctly assess the resource consumption and how to apply transaction fees in the runtime logic to adequately protect the network and your user community.

Unlike a smart contract or an individual pallet, a custom runtime is a fully-functioning blockchain.
Making the custom runtime accessible and secure for others to use involves acquiring physical or cloud computing resources, building a community that finds value in your service, and managing a network infrastructure.

With smart contracts, your application runs on top of an existing execution model, limiting what your application can do.
With a custom runtime, you control that underlying execution model and can choose to extend it to support smart contract execution for other developers.
With a custom runtime, you can also deliver more complex functionality and user interactions than smart contracts or individual pallets can provide.

### Explore building a custom runtime

If you want to build a more complete custom runtime rather than an individual pallet, you can start with a simple example like the [Collectibles workshop](/tutorials/collectibles-workshop/).
However, if you want to build a custom runtime as a proof-of-concept for a solo chain or a parachain, you'll want a broader and deeper understanding of runtime components and FRAME pallets.
The most relevant topics are under [Build](/build/) and [Test](/test/) and in the following sections:

- [Runtime storage structures](/build/runtime-storage/)
- [Transactions, weights, and fees](build/tx-weights-fees/)
- [Application development](/build/application-development/)
- [FRAME pallets](/reference/frame-pallets/)
- [FRAME macros](/reference/frame-macros/)

## Parachain

A custom runtime can exist on its own as the business logic for a private network or a solo chain, but if you want your project to be a viable production chain, there are several advantages to deploying the business logic and state transition function for your application as a parachain or parathread.

Parachains and parathreads act as independent Layer-1 blockchains. 
Each parachain has its own logic and runs in parallel with other chains in their ecosystem. 
All of the chains in the ecosystem benefit from the shared security, governance, scalability, and interoperability of the network.

### Parachains provide maximum flexibility

By developing your project as a parachain, you have a great deal of freedom and flexibility in the design and functionality of the chain.
What you decide to build is entirely up to you. 
For example, you can define what data to store on-chain or off.
You can define your own economic primitives, transaction requirements, fee policies, governance model, treasury accounts, and access control rules.
Your parachain can have as little—or as much—overhead per transaction as you decide, and your parachain can evolve with upgrades and optimization over time.
The only requirement is that your parachain or parathread must be compatible with the Polkadot API.

### Planning parachain resource requirements

As a parachain, your project can offer functionality to a broader community in a more secure way that a private chain or a solo chain.
However, if you want to build a production-ready parachain, you should keep the following additional requirements in mind:

- You'll need a development team with sufficient skills and experience, whether that means programming in Rust or a background in UX design.
   
   Parachain development might require more resources than other options.

- You'll need to build your community through marketing, outreach, or ecosystem development programs.

- You'll need resources for your infrastructure and network maintenance.
   
   A parachain is a whole blockchain. 
   Although the relay chain provides security and consensus for your project, you must maintain your chain and network infrastructure.
   In addition to developer operations (DevOps), you need to secure a parachain slot, design a crowdloan or auction strategy, and accumulate enough resources to extend the slot.
   
- You'll need sufficient time for testing and validating your chain operations, in a sandbox or simulated network and on a fully-functioning test network.

### Parachain use cases

In general rule, you should build your project as a parachain if it requires complex operations because parachains provide faster and more efficient execution of transactions. 
For example, building a parachain might be the best option for the following use cases:

- Decentralized finance (DeFi) applications
- Digital wallets
- Internet of things (IOT) applications
- Gaming applications
- Web 3.0 infrastructureM

### Explore building a parachain

If you have a custom runtime that you want to deploy as a parachain to take advantage of the security, governance, and interoperability of the relay chain and the Polkadot or Kusama ecosystem, you can start by building locally and setting up your own test network for initial testing.

For some examples to get you started, see the following sections:

- [Connect parachains to a network](/tutorials/build-a-parachain/)
- [Simulate parachains in a test network](/test/simulate-parachains/)
- [Parachains](/reference/how-to-guides/parachains/)

To learn more about what you can build, explore the following resources:

- [Build with Polkadot](https://wiki.polkadot.network/docs/build-build-with-polkadot)
- [Parachain development](https://wiki.polkadot.network/docs/build-pdk)
- [Smart contracts](https://wiki.polkadot.network/docs/build-smart-contracts)
