---
title: Windows development environment
description: Set up a local development environment for Substrate on Windows.
keywords:
---

In general, UNIX-based operating systems—like macOS or Linux—provide a better development environment for building Substrate-based blockchains.
All of the code examples and command-line instructions in Substrate [Tutorials](/tutorials/) and [How-to guides](/reference/how-to-guides/) illustrate how to interact with Substrate using UNIX-compatible commands in a terminal.

However, if your local computer uses Microsoft Windows instead of a UNIX-based operating system, you can configure it with additional software to make it a suitable development environment for building Substrate-based blockchains.
To prepare a development environment on a computer running Microsoft Windows, you can use Windows Subsystem for Linux (WSL) to emulate a UNIX operating environment.

## Before you begin

Before installing on Microsoft Windows, verify the following basic requirements:

- You have a computer running a supported version of the Microsoft Windows operating system.
- You must be running Microsoft Windows 10, version 2004 or later, or Microsoft Windows 11 to install Windows Subsystem for Linux on a computer with the Windows desktop operating system.
- You must be running Microsoft Windows Server 2019, or later, to install Windows Subsystem for Linux on a computer with the Windows server operating system.
- You have good internet connection and access to a shell terminal on your local computer.

## Set up Windows Subsystem for Linux

Windows Subsystem for Linux (WSL) enables you to emulate a Linux environment on a computer that uses the Windows operating system.
The primary advantage of this approach for Substrate development is that you can use all of the code and command-line examples as described in the Substrate documentation.
For example, you can run common commands—such as `ls` and `ps`—unmodified.
By using Windows Subsystem for Linux, you can avoid configuring a virtual machine image or a dual-boot operating system.

To prepare a development environment using Windows Subsystem for Linux:

1. Check your Windows version and build number to see if Windows Subsystem for Linux is enabled by default.

   If you have Microsoft Windows 10, version 2004 (Build 19041 and higher), or Microsoft Windows 11, Windows Subsystem for Linux is available by default and you can continue to the next step.

   If you have an older version of Microsoft Windows installed, see [WSL manual installation steps for older versions](https://docs.microsoft.com/en-us/windows/wsl/install-manual).
   If you are installing on an older version of Microsoft Windows, you can download and install WLS 2 if your computer has Windows 10, version 1903 or higher.

1. Select Windows PowerShell or Command Prompt from the Start menu, right-click, then **Run as administrator**.

1. In the PowerShell or Command Prompt terminal, run the following command:

   ```bash
   wsl --install
   ```

   This command enables the required WSL 2 components that are part of the Windows operating system, downloads the latest Linux kernel, and installs the Ubuntu Linux distribution by default.

   If you want to review the other Linux distributions available, run the following command:

   ```bash
   wsl --list --online
   ```

1. After the distribution is downloaded, close the terminal.

1. Click the Start menu, select **Shut down or sign out**, then click **Restart** to restart the computer.

   Restarting the computer is required to start the installation of the Linux distribution.
   It can take a few minutes for the installation to complete after you restart.

   For more information about setting up WSL as a development environment, see [Set up a WSL development environment](https://docs.microsoft.com/en-us/windows/wsl/setup/environment).

## Install required packages and Rust

To install the Rust toolchain on WSL:

1. Click the Start menu, then select **Ubuntu**.

1. Type a UNIX user name to create user account.

1. Type a password for your UNIX user, then retype the password to confirm it.

1. Download the latest updates for the Ubuntu distribution using the Ubuntu Advanced Packaging Tool (`apt`) by running the following command:

   ```bash
   sudo apt update
   ```

1. Add the required packages for the Ubuntu distribution by running the following command:

   ```bash
   sudo apt install --assume-yes git clang curl libssl-dev llvm libudev-dev make protobuf-compiler
   ```

1. Download the `rustup` installation program and use it to install Rust for the Ubuntu distribution by running the following command:

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

1. Follow the prompts displayed to proceed with a default installation.

1. Update your current shell to include Cargo by running the following command:

   ```bash
   source ~/.cargo/env
   ```

1. Verify your installation by running the following command:

   ```bash
   rustc --version
   ```

1. Configure the Rust toolchain to use the latest stable version as the default toolchain by running the following commands:

   ```bash
   rustup default stable
   rustup update
   ```

1. Add the `nightly` version of the toolchain and the `nightly` WebAssembly (`wasm`) target to your development environment by running the following commands:

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
   git clone https://github.com/substrate-developer-hub/substrate-node-template
   ```

   In most cases, you can clone the `main` branch to get the latest code.
   However, you can use the `--branch` command-line option if you want to work with a Substrate branch that is compatible with a specific Polkadot version.
   Click [Tags](https://github.com/substrate-developer-hub/substrate-node-template/tags) to see the list of branches that are compatible with specific Polkadot versions.

1. Change to the root of the node template directory by running the following command:

   ```bash
   cd substrate-node-template
   ```

   If you want to save your changes and make this branch easy to identify, you can create a new branch by running a command similar to the following:

   ```bash
   git switch -c my-wip-branch
   ```

1. Compile the node template by running the following command:

   ```bash
   cargo build --release
   ```

   Because of the number of packages required, compiling the node can take several minutes.

After the build completes successfully, your local computer is ready for Substrate development activity.

## Where to go next

The Substrate Developer Hub acts as a central portal for access to the many resources available to the community.
Depending on your interests and learning style, you might prefer one avenue over another.
For example, if you prefer to read source code and are familiar with Rust, you might want to start by digging into the [Rust API](https://paritytech.github.io/substrate/master).

<!-- TODO NAV.YAML -->
<!-- add these back -->
<!--If you are new to Substrate and the Substrate ecosystem, you might want broader exposure to what resources are available and where to find them by checking out [Explore](/explore/).-->

Here are a few additional suggestions for where you can learn more.

#### Tell me

- [Architecture](/learn/architecture/)
- [Networks and blockchains](/learn/node-and-network-types/)
- [Build process](/build/build-process)

#### Guide me

- [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/)
- [Simulate a network](/tutorials/build-a-blockchain/simulate-network/)
- [Add trusted nodes](/tutorials/build-a-blockchain/add-trusted-nodes/)
