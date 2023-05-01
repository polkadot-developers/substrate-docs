---
title: Design
description: Suggests blockchain and application design decisions for you to consider in planning your project.
keywords:
  - smart contracts
  - pallets
  - application logic
  - solo chains
  - parachains
  - parathreads
---

In [Runtime development](/learn/runtime-development), you learned that Substrate provides a modular and flexible approach to blockchain development that enables you to focus on defining the **application** or **business logic** you want to implement.
With Substrate, you can reuse common components and compose an upgradeable runtime with prebuilt or customized modules.
So, with all of this flexibility, one of the most daunting questions might be what to buiild. 

## What you can build with these tools?

Virtually anything is possible, but it’s important to keep in mind that a blockchain is a resource-constrained environment. 
Depending on your project, there might be many design decisions you have to make along the way. 
If you’re starting small, your first decision might be whether to design a **smart contract** or a **pallet**. 
If you have a grander vision, you might need to consider whether what you want to you build is best delivered as an independent **solo chain** or would benefit from the shared security and liveness guarantees of a **parachain**. 

## What are your goals?

Before diving into whether you should build a smart contract, an application-specific pallet, a fully customized runtime, or a custom node infrastructure, you should consider the goals of your project and how it benefits users as a blockchain project. 

- Is your primary concern decentralization of a product or service?
- Is provable data integrity central to your project?
- Is the immutability of records of primary importance?
- Is community participation crucial to the success of your project? 

## What issues do you need to consider?

As part of the design process, there are important issues and trade-offs to consider.
For example:

- Processing transactions requires resources—computing power, memory, storage, network bandwidth—so you should consider how to ensure your project is economically viable.
- Protecting a network from accidental or intentional disruptions can be challenging, so you should consider what incentives and safeguards you'll need.
- Storing, reading, and writing to storage is expensive, so you should give careful consideration to what data needs to be stored onchain and persisted or if there are ways to structure your application to use temporary or offchain storage to perform some operations and minimizing your storage requirements.

The topics in this section are intended to highlight and help you navigate design decisions and architectural options you should consider as part of the planning process.
