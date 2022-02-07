# Windows development environment

In general, UNIX-based operating systems—like macOS or Linux—provide a better development environment for building Substrate-based blockchains.
All of the code examples and command-line instructions in Substrate [Tutorials](../tutorials) and [How-to guides](../reference/how-to-guides) illustrate how to interact with Substrate using UNIX-compatible commands in a terminal.

However, if your local computer uses Microsoft Windows instead of a UNIX-based operating system,  you can configure it with additional packages to make it a suitable development environment for building Substrate-based blockchains.
To prepare a development environment on a computer running Microsoft Windows, you have the following options:

* Use Windows Subsystem for Linux (WSL) to emulate a UNIX operating environment (recommended).

* Add all of the required packages to the native Windows environment.

## Before you begin

Before installing on Microsoft Windows, verify the following basic requirements:

* You have a computer running a supported version of the Microsoft Windows operating system.
* You must be running Microsoft Windows 10, version 2004 or later, or Microsoft Windows 11 to install Windows Subsystem for Linux on a computer with the Windows desktop operating system.
* You must be running Microsoft Windows Server 2019, or later, to install Windows Subsystem for Linux on a computer with the Windows server operating system.
* You must be able to install all required packages locally if you are using Microsoft Windows desktop or Microsoft Windows Server without the Windows Subsystem for Linux.

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

## Set up a native Windows development environment

If you want to use a Windows computer to build Substrate without using Windows Substem for Linux, you need to download and install several required packages.

To prepare Windows for Substrate development:

1. Download and install [Visual Studio](https://code.visualstudio.com/download) as your integrated development environment.

1. Download [Build Tools for Visual Studio](https://aka.ms/buildtools).

1. Open Windows Command Prompt and change to the Downloads directory where you downloaded the build tools for Visual Studio.

1. Install the build tools by running the following command:

    ```dos
    vs_buildtools.exe
    ```

1. Verify the **Windows 10 SDK** component is included in the installation of the Visual C++ Build Tools.

1. Restart your computer.

1. Download Rust for Windows from [](https://www.rust-lang.org/tools/install)

For more detailed instructions, see the [Rust Book](https://doc.rust-lang.org/book/ch01-01-installation.html#installing-rustup-on-windows). 
For a quick reference is available at <https://rustup.rs/> .

1. Run the installation file: `rustup-init.exe` for 32-bit or 64-bit architecture, as appropriate.
It shouldn't prompt you to install `vs_buildtools` since you did it in step 1.
     - Choose "Default Installation."

1. Add the Cargo `bin` directory (`%USERPROFILE%\.cargo\bin`) to your PATH environment variable. Future applications will automatically have the correct environment, but you mmight need to restart your current shell.

3. Run these commands in Command Prompt (`CMD`) to set up your Wasm Build Environment:

   ```bash
   rustup update nightly
   rustup update stable
   rustup target add wasm32-unknown-unknown --toolchain nightly
   ```

## Install and configure additional programs

1. Install [LLVM](https://releases.llvm.org/download.html).

1. Install OpenSSL with `vcpkg` using PowerShell by running the following commands:

   ```powershell
   mkdir C:\Tools
   cd C:\Tools
   git clone https://github.com/Microsoft/vcpkg.git --depth=1
   cd vcpkg
   .\bootstrap-vcpkg.bat
   .\vcpkg.exe install openssl:x64-windows-static
   ```

1. Add OpenSSL to your System Variables using PowerShell:

    ```powershell
    $env:OPENSSL_DIR = 'C:\Tools\vcpkg\installed\x64-windows-static'
    $env:OPENSSL_STATIC = 'Yes'
    [System.Environment]::SetEnvironmentVariable('OPENSSL_DIR', $env:OPENSSL_DIR, [System.EnvironmentVariableTarget]::User)
    [System.Environment]::SetEnvironmentVariable('OPENSSL_STATIC', $env:OPENSSL_STATIC, [System.EnvironmentVariableTarget]::User)
    ```

1. Install `cmake`: https://cmake.org/download/

1. Install the [Chocolatey](https://chocolatey.org/install) package manager, if needed.

1. Install `make` by runing the following command

   ```
   choco install make
   ```

## Verify your installation

## Troubleshooting
