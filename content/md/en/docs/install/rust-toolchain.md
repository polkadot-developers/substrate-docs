---
title: Rust toolchain
description:
keywords:
---

<!-- TODO Manage expectations about build times on lower-spec hardware. Define that practical dev environment requirements are higher than just for running a node  -->

Rust is a modern, type sound, and performant programming language that provides a rich feature set for building complex systems.
The language also has an active developer community and a growing ecosystem of sharable libraries called **crates**.

## Learning Rust

Rust is the core language used to build Substrate-based blockchains, so if you intend to do Substrate development, you need to be familiar with the Rust programming language, compiler, and toolchain management.

If you are just getting started with Rust, you should bookmark [The Rust Programming Language](https://doc.rust-lang.org/book/) and refer to other [Learn Rust](https://www.rust-lang.org/learn) resources on the Rust website to guide you.
However, there are a few important points to be aware of as you prepare your development environment.

## About the Rust toolchain

The core tools in the Rust **toolchain** are the `rustc` compiler, the `cargo` build and package manager, and the `rustup` toolchain manager.
At any given point in time, there can multiple versions of Rust available.
For example, there are release channels for stable, beta, and nightly builds.
You use the `rustup` program to manage the builds available in your environment and the versions of the toolchain programs that are used with different Rust builds.

The `rustc` compiler enables you to build binaries for different architectures, referred to as **targets**.
Targets are identified by a string that specifies the kind of output the compiler should produce.
This feature is important because Substrate is compiled to both a native Rust binary and a WebAssembly target.

WebAssembly is a portable binary format that can be executed on any modern computer hardware and through any browser accessing the internet.
The WebAssembly (Wasm) target enables Substrate to produce portable blockchain runtimes.
For more information about how these binaries are used, see [Build process](/build/build-process/).
