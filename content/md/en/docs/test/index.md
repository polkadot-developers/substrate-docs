---
title: Test
description:
keywords:
---

Regardless of the type of chain you ultimately want to build, you are likely to start with a local development environment for unit testing and debugging.
As your project progresses, you'll want to evaluate the performance of different operations under different conditions to establish benchmarks around the execution time and storage requirements used by the functions in your chain.

If you are building a parachain, you'll also want to simulate the operation of one or more parachains in a local network before you attempt to deploy on a test network like Rococo or a live production network like Kusama or Polkadot where real-world economics are in play.

In a local development network, you have full control over your node.
You can start and stop the node.
You can modify, recompile, and upgrade the runtime at your discretion.
You can write to and clear stored state as often as you like.
You can use predefined accounts and pallets to try things out.
But testing is the key to making your chain accessible to a wider audience and economically viable in the network.

The topics in this section highlight tools and techniques for testing your blockchain logic to help you move from local development to deployment on a live test network and ultimately into production as part of the Polkadot ecosystem.

- [Unit test](/test/unit-testing) explains how you can use the Rust testing framework and a mock runtime environment to execute unit tests that validate individual functions or modules of code.
- [Debug](/test/debug) describes how you can use the Rust logging functions to debug your runtime.
- [Benchmark](/test/benchmark) explains the role of benchmarks, how you can use the benchmarking framework to evaluate the performance of the function calls in your code and to adjust transaction weight to accurately reflect execution time.
- [Simulate parachains](/test/simulate-parachains) steps through how you can set up a local test network to simulate a relay chain network with validators, parachain collator nodes, and XCM messaging.
- [Check runtime](/test/check-runtime/) explains how you can use the `try-runtime` command-line tool for testing runtime state against a production snapshot of the chain state.
