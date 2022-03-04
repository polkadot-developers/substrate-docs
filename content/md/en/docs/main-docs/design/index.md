Section: Design
Sub-section: Runtime design
Type: conceptual 
Index: 1

_This article describes ways to create the application logic of your blockchain._
_This is important for parachain builders to understand why they are building pallets and what it implies, also giving insight on the value of using pallets vs. smart contracts._

You've got an application that requires a blockchain and you've started sketching out its components but you're not sure whether you should use smart contracts or write your own pallets. 
What should you do?
The truth is that if you're here it's probably because you're writing a blockchain from scratch and don't really care much about smart contracts.
You're here because you plan on building a solo-chain that may one day become a parachain or a standalone network running its own validators and consensus mechanism.
Being here you'll quickly learn that in order to build your application-specific chain you'll need to write pallets and not smart contracts.
This page will explain different ways to design and compose your runtimes, contrasting pallet development with smart contract development and providing considerations for those of you sketching out your application logic.

## Application design

The runtime is the actual logic and application of the blockchain.
Designing the runtime is just like designing an application.
As a runtime engineer, you have full control of the underlying logic that each node on your network will run, which gives you access to improve the performance of the nodes of your network as well how users can interact with your application in the most efficient way possible.

Application logic in Substrate-based blockchains can be expressed in the form of:

- Specialized [pallets](/todo), where each pallet performs a special task, serving the business needs of the blockchain. 
- Smart contracts, where application logic is specified in smart contracts that are compatible with the chain's smart contract execution environment.
- A combination of both pallets and smart contracts, which implies that application logic is executed by both smart contracts and domain-specific pallets.

Although Substrate chains can provide smart contract functionality, they are still defined by the pallets that their runtimes are composed of.

## Runtime development

As a runtime engineer, you must provide the protections for the overhead of transactions reverting and implicitly introduce any fee system for the computation costs your chain's transactions may incur.
While you are developing runtime functions, you must correctly assess and apply fees to different parts of your runtime logic so that it will not be abused by malicious actors.
Because pallets gives low level access to your entire blockchain, runtime engineers must be vigilant with handling things like fees and permissions, errors and safe arithmetic operations. 

Learn about best practices for designing your pallet [here]().

On the other hand, smart contracts have built-in economic incentives.
In order to use smart contracts in a Substrate node, the runtime must be configured with a specialized pallet that defines the type of execution environments the application requires. 
This could be the [EVM pallet](/pallet-todo-link), for example, used in Ethereum compatible Substrate-based chains, or the [contracts pallet](/pallet-todo-link) which provides a way to execute Wasm contracts written in a specialized language called ink!. 

Learn more about the different [smart contract pallets]() you can implement in your runtimes.

## Considerations

Here's a non-exhaustive list of questions you might want to ask yourself when designing your runtimes:

- What is the purpose of your application? Who are the different users of your chain? 
- How do you envision your blockchain to scale? How many users and transactions per second? 
- What attack vectors exist for your pallet?
- How will you implement on-chain governance? 

### Pallets vs. smart contracts

Pallet engineers have much more responsibility for writing robust and correct code, than those writing smart contracts.
Incorrect logic or poor error handling in a pallet could brick your chain, whereas smart contracts are protected by the safeguards provided by the execution environment they use.

Both pallet development and smart contract development provides ways for users to interact with a runtime, each of which optimize for different problems.
There is likely some amount of overlap in the kinds of problems each one can solve best, but there is also a clear set of problems suited for only one of the two. 
Here are some examples for each category and one that would include both:

- **Pallet development:** Building a privacy layer on top of the transaction layer of your blockchain.
- **Smart contract development:** Introducing multi-signature wallets over the currency of your blockchain.
- **Hybrid:** Building a gaming dApp which may need to build up a community of users (smart contract), or may need to scale to millions of transactions a day (runtime pallet development).

For parachain developers, most of the application specific logic will be in the form of pallets in the runtime. 
In most cases, smart contracts are an additional feature of a chain, enabled by a specialized pallet that handles the execution environment for the target smart contract interface.
In this way, smart contracts chains are optimized by pallet configurations, making them a narrow sub-set of solutions for customizing runtimes.

Deploying a contract is a relatively simple and easy process because you take advantage of the existing network. 
The only costs to you are the fees which you pay to deploy and maintain your contract.

Setting up your own blockchain, on the other hand, incurs the cost of building a community who find value in the service you provide, or the additional costs associated with establishing a private network with the overhead of a cloud computing-based architecture and general network maintenance.

While it's hard to address every scenario, in general, pallet development is most favorable for applications that require higher degrees of flexibility and adaptability. 
For example, applications that require accommodating different types of users or multiple layers of governance. 
The table below is meant to help inform your decisions on which approach to use based on different situations.

#### Different uses or pallets and smart contracts 

| Pallet development | Smart Contract | Use Case Specific |
|---------------------|:---------------|:------------------|
| Privacy Layer  <br>Feeless Token <br>Light-Client Bridge <br> Decentralized Exchange <br>Oracles <br>Stable Coin| Multi-signature Wallet <br> Data services <br> Simple fundraiser | Small scale gaming dApp (contract) <br>Large scale gaming dApp (runtime) <br> Community driven Decentralized Autonomous Organizations (DAO)(contract)<br> Protocol driven Decentralized Autonomous Organizations (DAO)(runtime) <br> Community driven treasury(contract)<br> Protocol driven treasury (runtime)                |

## Where to go next

Explore the following resources to learn more.

#### Tell me

* [Pallet design](./pallet-design)
* [Smart contract pallets](./smart-contract-pallets)
* [Storage design](./storage-design)
* [Economic models](./economic-models) 
* See [The Polkadot Wiki](https://wiki.polkadot.network/docs/build-build-with-polkadot#what-is-the-difference-between-building-a-parachain-a-parathread-or-a-smart-contract) for a comparison between developing on a parachain, parathread, and smart contracts.

#### Guide me 
* Build a proof of existence blockchain
* ink! tutorial