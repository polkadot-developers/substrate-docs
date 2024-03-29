---
title: Troubleshoot Rust issues
description: Diagnose and fix Rust and Substrate development environment issues.
keywords:
  - Rust
  - toolchain
  - compiler
  - rustup
---

If compiling the [Substrate node template](https://github.com/substrate-developer-hub/substrate-node-template) fails, the problem is most likely to be caused by how Rust is configured in your development environment.
This section suggests how you can diagnose and fix configuration issues.

## Check your current configuration

To see information about the Rust toolchain that you are currently using, run the following command:

```bash
rustup show
```

This command displays output similar to the following Ubuntu example:

```text
Default host: x86_64-unknown-linux-gnu
rustup home:  /home/user/.rustup

installed toolchains
--------------------

stable-x86_64-unknown-linux-gnu (default)
nightly-2020-10-06-x86_64-unknown-linux-gnu
nightly-x86_64-unknown-linux-gnu

installed targets for active toolchain
--------------------------------------

wasm32-unknown-unknown
x86_64-unknown-linux-gnu

active toolchain
----------------

stable-x86_64-unknown-linux-gnu (default)
rustc 1.50.0 (cb75ad5db 2021-02-10)
```

In this example, the default toolchain is from the `stable` release channel for Linux running on x86_64 architecture.
The sample output also indicates that the `nightly-x86_64-unknown-linux-gnu` toolchain is installed and there are two targets installed:

- `x86_64-unknown-linux-gnu` the native Rust target for Linux.
- `wasm32-unknown-unknown` the WebAssembly target.

This environment also has the `nightly-2020-10-06-x86_64-unknown-linux-gnu` toolchain installed, but this toolchain is only used if explicitly specified as a command-line option.
For an example of specifying a specific toolchain as a command line option, see [Specify a nightly version](#specifying-nightly-version).

## Use the nightly release channel for WebAssembly

Substrate uses [WebAssembly](https://webassembly.org) (Wasm) to produce a portable blockchain runtime.
You must configure the Rust compiler to use [`nightly` builds](https://doc.rust-lang.org/book/appendix-07-nightly-rust.html) to allow you to
compile Substrate runtime code to the Wasm target.

## Update the toolchain

In general, you should always use the latest versions of Rust `stable` and `nightly` builds because changes in Substrate often depend on upstream changes in the Rust `nightly` compiler build.
To ensure your Rust compiler is always up to date, you should run the following commands:

```bash
rustup update
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

Running `rustup update` updates both the `nightly` and `stable` toolchains to use the most recent release.
If you are unable to compile the WebAssembly target after updating the `nightly` toolchain, you can roll back to an earlier version of the toolchain and specify that version as a command-line option.
For more information about getting an earlier version of the `nightly` toolchain and specifying the version to use as a command-line option,[downgrade the toolchain](#downgrading-rust-nightly).

## Use a specific nightly toolchain

If you want to guarantee that your build works on your computer as you update Rust and other dependencies, you should use a specific Rust `nightly` toolchain that you know to be compatible with the version of Substrate you are using.
How you identify and communicate the specific `nightly` toolchain version to use for a project can vary.
For example, Polkadot publishes this information in its [release notes](https://github.com/paritytech/polkadot/releases).

After you identify the specific `nightly` toolchain version to use, you can install it in your development environment by running a command similar to the following:

```bash
rustup install nightly-<yyyy-MM-dd>
```

For example:

```bash
rustup install nightly-2022-02-16
```

After you install a specific version of the nightly toolchain, configure the WebAssembly target to use it by running a command similar to the following:

```bash
rustup target add wasm32-unknown-unknown --toolchain nightly-<yyyy-MM-dd>
```

For example:

```bash
rustup target add wasm32-unknown-unknown --toolchain nightly-2022-02-16
```

### Specify the toolchain in an environment variable

You can set the `WASM_BUILD_TOOLCHAIN` environment variable to specify the version of the `nightly` toolchain to use for compiling WebAssembly.For example:

```bash
WASM_BUILD_TOOLCHAIN=nightly-<yyyy-MM-dd> cargo build --release
```

This command builds the _runtime_ using the specified nightly toolchain.
The rest of the project is compiled using the _default_ toolchain, that is, the latest version of the `stable` toolchain that you have installed.

### Downgrade the nightly toolchain

If your computer is configured to use the latest Rust `nightly` toolchain and you want to downgrade to a specific nightly version, you must first uninstall the latest `nightly` toolchain.
For example, you can remove the latest `nightly` toolchain, then use a specific version of the `nightly` toolchain by running commands similar to the following:

```sh
rustup uninstall nightly
rustup install nightly-<yyyy-MM-dd>
rustup target add wasm32-unknown-unknown --toolchain nightly-<yyyy-MM-dd>
```

## Ensure PATH is set correctly

If after installing Rust the commands don't seem to work, showing errors such as `command not found: rustup`, make sure that your PATH is configured correctly.

Currently, the `rustup` installer installs by default to the bash profile (on Mac). If you are using another shell, make sure to add this line to your profile (e.g. `.zshrc`):

```bash
source "$HOME/.cargo/env"
```

## Installing cmake or protobuf for M-series macOS users

Currently, there are issues when compiling the Substrate node while using the packages that are pre-installed on macOS computers with the M-series chip.

```sh
error: failed to run custom build command for prost-build v0.10.4
```

If you see this error, there are two solutions.

- Install `cmake` by running the following command:

```bash
brew install cmake
```

- Install the correct pre-compiled `protoc` by running the following set of commands:

```bash
git clone https://github.com/protocolbuffers/protobuf.git
cd protobuf

brew install autoconf
brew install automake
brew install Libtool

autoreconf -i
./autogen.sh
./configure
make
make check
sudo make install

export PATH=/opt/usr/local/bin:$PATH
```
