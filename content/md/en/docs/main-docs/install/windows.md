# Windows development environment

In general, UNIX-based operating systems—like macOS or Linux—provide a better development environment for building Substrate-based blockchains.
All of the code examples and command-line instructions in Substrate [Tutorials](../tutorials) and [How-to guides](../reference/how-to-guides) illustrate how to interact with Substrate using UNIX-compatible commands in a terminal.

However, if your local computer uses Microsoft Windows instead of a UNIX-based operating system, you can configure it with additional packages to make it a suitable development environment for building Substrate-based blockchains.
To prepare a development environment on a computer running Microsoft Windows, you can use Windows Subsystem for Linux (WSL) to emulate a UNIX operating environment (recommended).

## Before you begin

Before installing on Microsoft Windows, verify the following basic requirements:

* You have a computer running a supported version of the Microsoft Windows operating system.
* You must be running Microsoft Windows 10, version 2004 or later, or Microsoft Windows 11 to install Windows Subsystem for Linux on a computer with the Windows desktop operating system.
* You must be running Microsoft Windows Server 2019, or later, to install Windows Subsystem for Linux on a computer with the Windows server operating system.

## Set up Windows Subsystem for Linux development environment

Windows Subsystem for Linux (WSL) enables you to emulate a Linux environment on a computer that uses the Windows operating system. 
The primary advantage of this approach for Substrate development is that you can use all of the code and command-line examples as described in the Substrate documentation. 
You can run common commands—such as `ls` and `ps`—unmodified.
By using Windows Subsystem for Linux, you can avoid configuring a virtual machine image or a dual-boot operating system.

To prepare a development environment using Windows Subsystem for Linux:

1. Check your Windows version and build number to see if Windows Subsystem for Linux is enabled by default.
   
   If you have Microsoft Windows 10, version 2004 (Build 19041 and higher), or Microsoft Windows 11, Windows Subsystem for Linux is enabled by default and you can continue to the next step.

   If you have an older version of Microsoft Windows installed, see [WSL manual installation steps for older versions](https://docs.microsoft.com/en-us/windows/wsl/install-manual). 

1. Open PowerShell or Windows Command Prompt, then run the following command:
   
   ```
   wsl --install
   ```

   This command enables required components, downloads the latest Linux kernel, and installs the Ubuntu Linux distribution.

1. Restart the computer.

1. Open the Ubuntu distribution from the Start menu, then set up your user account and password.
   
   For more information about setting up WSL as a development environment, see [Set up a WSL development environment](https://docs.microsoft.com/en-us/windows/wsl/setup/environment).

1. Use the Ubuntu Advanced Packaging Tool (`apt`) to get the latest updates for the Ubuntu distribution:
   
   ```
   sudo apt update
   ```

1. Use the Ubuntu Advanced Packaging Tool (`apt`) to install required packages:
   
   ```
   sudo apt install -y git clang curl libssl-dev llvm libudev-dev
   ```

1. Install `rustup` for the Ubuntu distribution by running the following command:
   
   ```
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

1. Update the current shell with configuration settings for Rust by running the following command:
   
   ```
   source ~/.cargo/env
   ```

1. Configure the Rust toolchain to use the latest stable version as the default toolchain by running the following commands:
   
   ```
   rustup default stable
   rustup update
   ```

1. Add the `nightly` version of the toolchain and the WebAssembly (`wasm`) target for the nightly toolchain by running the following commands:
   
   ```
   rustup update nightly
   rustup target add wasm32-unknown-unknown --toolchain nightly
   ```

## Verify your installation

## Troubleshooting
