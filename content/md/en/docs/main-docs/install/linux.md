---
title: Linux development environment
description: Set up a local development environment for Substrate on Linux.
keywords:
---

Rust supports most Linux distributions.
Depending on the specific distribution and version of the operating system you use, you might need to add some software dependencies to your environment.
In general, your development environment should include a linker or C-compatible compiler such as `clang` and an appropriate integrated development environment (IDE).

## Before you begin

Check the documentation for your operating system for information about the packages that are installed and how to download and install any additional packages you might need.
For example, if you use Ubuntu, you can use the Ubuntu Advanced Packaging Tool (`apt`) to install the `build-essential` package:

```bash
sudo apt install build-essential
```

At a minimum, you need the following packages before you install Rust:

```bash
clang
curl
git
```

Because the blockchain requires standard cryptography to support the generation of public/private key pairs and the validation of transaction signatures, you must also have a package that provides cryptography, such as `libssl-dev` or `openssl-devel`.

## Install required packages and Rust

To install the Rust toolchain on Linux:

1. Log on to your computer and open a terminal shell.

1. Check the packages you have installed on the local computer by running an appropriate package management command for your Linux distribution.

1. Add any package dependencies you are missing to your local development environment by running an appropriate package management command for your Linux distribution.
   Click the tab titles to see examples for other Linux operating systems:

   <figure class='tabbed'>

   [[tabbedCode]]
   |```Debian
   | sudo apt install --assume-yes git clang curl libssl-dev llvm libudev-dev make protobuf-compiler

   [[tabbedCode]]
   |```Arch
   | pacman -Syu --needed --noconfirm curl git clang protobuf

   [[tabbedCode]]
   | ```fedora
   | sudo dnf update
   | sudo dnf install clang curl git openssl-devel protobuf-compiler

   [[tabbedCode]]
   | ```opensuse
   | sudo zypper install clang curl git openssl-devel llvm-devel libudev-devel protobuf

   </figure>

   Remember that different distributions might use different package managers and bundle packages in different ways.
   For example, depending on your installation selections, Ubuntu Desktop and Ubuntu Server might have different packages and different requirements.
   However, the four packages listed in this command-line example are applicable for many common Linux distributions, including Debian, Linux Mint, MX Linux, and Elementary OS.

1. Download the `rustup` installation program and use it to install Rust by running the following command:

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

1. Follow the prompts displayed to proceed with a default installation.

1. Update your current shell to include Cargo by running the following command:

   ```bash
   source $HOME/.cargo/env
   ```

1. Verify your installation by running the following command:

   ```bash
   rustc --version
   ```

1. Configure the Rust toolchain to default to the latest stable version by running the following commands:

   ```bash
   rustup default stable
   rustup update
   ```

1. Add the `nightly` release and the `nightly` WebAssembly (wasm) targets to your development environment by running the following commands:

   ```bash
   rustup update nightly
   rustup target add wasm32-unknown-unknown --toolchain nightly
   ```

1. Verify the configuration of your development environment by running the following command:

   ```bash
   rustup show
   rustup +nightly show
   ```

   The command displays output similar to the following:

   ```bash
   # rustup show

   active toolchain
   ----------------

   stable-x86_64-unknown-linux-gnu (default)
   rustc 1.61.0 (fe5b13d68 2022-05-18)

   # rustup +nightly show

   active toolchain
   ----------------

   nightly-x86_64-unknown-linux-gnu (overridden by +toolchain on the command line)
   rustc 1.63.0-nightly (e71440575 2022-06-02)
   ```

## Compile a Substrate node

Now that you have Rust installed and the Rust toolchains configured for Substrate development, you are ready to finish setting up your development environment by cloning the Substrate **node template** files and compiling a Substrate node.

The node template provides a working environment that includes all of the most common features you need to build a blockchain without any extraneous modules or tools.
To ensure that the node template offers a relatively stable working environment for you to experiment with, the recommended best practice is to clone Substrate node template from the Substrate Developer Hub repository, rather than from the core Substrate repository.

To compile the Substrate node template:

1. Clone the node template repository by running the following command:

   ```bash
   git clone --branch latest --depth 1 https://github.com/substrate-developer-hub/substrate-node-template
   ```

1. Change to the root of the node template directory by running the following command:

   ```bash
   cd substrate-node-template
   ```

1. Compile the node template by running the following command:

   ```bash
   # We always want to build in release mode when intending to run and/or test any node
   cargo b -r
   ```

   Because of the number of crates required, compiling the node can take several minutes.

After the build completes successfully, your local computer is ready for Substrate development activity.

## Where to go next

The Substrate Developer Hub acts as a central portal for access to the many resources available to the community.
Depending on your interests and learning style, you might prefer one avenue over another.
For example, if you prefer to read source code and are familiar with Rust, you might want to start by digging into the [Rust API](https://paritytech.github.io/substrate/master).


<!-- TODO NAV.YAML -->
<!-- add these back -->
<!--If you are new to Substrate and the Substrate ecosystem, you might want broader exposure to what resources are available and where to find them by checking out [Explore](/main-docs/explore/).-->

Here are a few additional suggestions for where you can learn more.

#### Tell me

- [Architecture](/main-docs/fundamentals/architecture/)
- [Networks and blockchains](/main-docs/fundamentals/node-and-network-types/)
- [Build process](/main-docs/build/build-process)

#### Guide me

- [Build a local blockchain](/tutorials/get-started/build-local-blockchain/)
- [Simulate a network](/tutorials/get-started/simulate-network/)
- [Add trusted nodes](/tutorials/get-started/trusted-network/)
