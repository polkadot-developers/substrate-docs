---
title: Build a custom runtime
description: Summarizes the steps for building a custom Substrate runtime with links to more complete details.
keywords:
---

This article provides a quick reference guide for how to build a custom Substrate runtime for your application-specific blockchain with links to where you can find more information about each step.

## Prepare a working environment

Before you can start building, you'll need to have a working development environment.
At a minimum, you'll need:

- [ ] A supported operating system.
- [ ] The Rust compiler and toolchain.
- [ ] A code editor of your choice.
- [ ] Google Chrome or a Chromium-based browser.
- [ ] A clone of the Substrate node template repository.
  
For more information about preparing your local development environment, see the instructions for your operating system in [Install](/install/).

## Start a local blockchain node

After you have assembled everything you need for your development environment, you are ready to start the node template in development mode and connect to it using the Polkadot/Substrate Portal.

To start the node:

1. Open a terminal shell on your computer.
2. Change to the root directory where you compiled the Substrate node template.
3. Start the local node in development mode by running the following command:

   ```bash
   cargo run --release -- --dev
   ```

4. Open the Polkadot/Substrate Portal in a browser and connect to the local node.

## Explore existing pallets

Before you start building your own custom pallets, it's a good idea to explore the pallets included in the node template by default and to review what other pallets are available and what they do.

## Import and configure pallets

If there are pallets with functionality similar to what you need, you can import them directly into your runtime and configure the pallet in the runtime to suit your application.

## Create a custom pallet

Macros and basic scaffolding
Shared and custom types
Custom storage items
Events and error
Public and private functions
Create basic functions
Add advanced functionality
Add the pallet to the runtime
Create a front-end

## Unit test the pallet in a mock runtime

## Benchmark pallets in the runtime

## Move the runtime logic to a parachain template

## Test the parachain locally

## Deploy the parachain on a test network

## Acquire a relay chain slot

## Deploy on Kusama

## Deploy on Polkadot