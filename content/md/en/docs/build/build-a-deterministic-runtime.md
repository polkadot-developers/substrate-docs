---
title: Build a deterministic runtime
description: Explains how to use the Substrate runtime toolbox (srtool) and Docker to build the WebAssembly runtime for Substrate-based chains.
keywords:
---

By default, the Rust compiler produces optimized WebAssembly binaries.
These binaries are fine for working in an isolated environment where you are doing local development.
However, the WebAssembly binaries that the compiler builds by default aren't guaranteed to be deterministically reproducible.
Each time the compiler generates the WebAssembly runtime, it might produce slightly different WebAssembly bytecode.
This is problematic in a blockchain network where all nodes must use exactly the same raw chain specification file.

Working with builds that aren't guaranteed to be deterministically reproducible can cause other problems, too.
For example, if you want to automate the build process for your blockchain, you'll want to ensure that the same code always produces the same result.
Without a deterministic build, compiling the WebAssembly runtime with every push would produce inconsistent and unpredictable results, making it difficult to integrate with any automation and likely to continuously break your CI/CD pipeline.
Deterministic builds—code that always compiles to exactly the same bytecode—also ensure that the WebAssembly runtime can be inspected, audited, and independently verified.

## Tooling for WebAssembly runtime

To help you compile the WebAssembly runtime in a deterministic way, you can use the same tooling that produces the runtime for Polkadot, Kusama, and other Substrate-based chains.
This tooling—referred to collectively as the Substrate runtime toolbox or `srtool`—ensures that the same source code consistently compiles to an identical WebAssembly blob.

The core component of the Substrate runtime toolbox (`srtool`) is a Docker container.
This container is executed as part of a Docker image.
The name of the `srtool` Docker image specifies the version of the Rust compiler used to compile the code included in the image.
For example, the image `paritytech/srtool:1.62.0` indicates that the code in the image was compiled with version `1.62.0` of the `rustc` compiler.

## Working with the Docker container

Because `srtool` is a Docker container, you must have Docker available in your build environment to use it.
However, you don't need to know anything about using Docker to build a Substrate-based chain using `srtool` because you can use the `srtool-cli` command-line interface to work with Docker images.

The `srtool-cli` package is a command-line utility written in Rust that installs an executable program called `srtool` on your computer.
This program simplifies your interactions with the srtool Docker container.
Over time, the tooling around the `srtool` Docker image has expanded to include the following tools and helper programs:

- [srtool-cli](https://github.com/chevdor/srtool-cli) provides a command-line interface to pull the srtool Docker image, get information about the image and tooling used to interact with it, and build the runtime using the `srtool` Docker container.

- [subwasm](https://github.com/chevdor/subwasm) provides command-line options for working with the metadata and WebAssembly runtime built using srtool. The `subwasm` program is also used internally to perform tasks in the `srtool` image.

- [srtool-actions](https://github.com/chevdor/srtool-actions) provides GitHub actions to integrate builds produced using the `srtool` image with your GitHub CI/CD pipelines.
- [srtool-app](https://gitlab.com/chevdor/srtool-app) provides a simple graphical user interface for building the runtime using the `srtool` Docker image.

## Prepare the environment

To work with the Docker image that executes the code in the `srtool` Docker container, you must have a Docker account and Docker command-line or desktop tools available.
You should also prepare your development environment with the specific command-line tools you want to use.
At a minimum, you should install the `srtool-cli` program to enable you to work with the Docker image using a simple command-line interface.

To prepare the environment:

1. Open a terminal shell in your Substrate development environment.

2. Verify that you have Docker installed by running the following command:

   ```bash
   docker --version
   ```

   If Docker is installed, the command displays version information.
   For example:

   ```text
   Docker version 20.10.17, build 100c701
   ```

3. Install the `srtool` command-line interface by running the following command:

   ```bash
   cargo install --git https://github.com/chevdor/srtool-cli
   ```

4. View usage information for the `srtool` command-line interface by running the following command:

   ```bash
   srtool help
   ```

5. Download the latest `srtool` Docker image by running the following command:

   ```bash
   srtool pull
   ```

## Start a deterministic build

After you have prepared the environment, you can start compiling the WebAssembly runtime using the `srtool` Docker image.

To build the runtime:

1. Open a terminal shell in your Substrate development environment.

2. Compile the runtime for a project by running a command similar to the following:

   ```bash
   srtool build --app --package node-template-runtime --runtime-dir runtime
   ```

   - The name you specify for the `--package` should be the name defined in the `Cargo.toml` file for the runtime.

   - The path you specify for the `--runtime-dir` should be the path to the `Cargo.toml` file for the runtime.
     If the `Cargo.toml` file for the runtime is located in a `runtime` subdirectory—for example, runtime/kusama—you can omit the `--runtime-dir` command-line option.

## Add workflow actions

If you use a GitHub repository for your Substrate-based project, you can set up a GitHub workflow to start compiling the WebAssembly runtime automatically.

To add a workflow for building the runtime:

1. Create a `.github/workflows` directory in your Substrate repository.

1. In the `.github/workflows` directory, click **Add file**, then select **Create new file**.
1. Copy the sample GitHub action from `basic.yml` example in the [srtools-actions](https://github.com/chevdor/srtool-actions) repository and paste it into the file you created in the previous step.

1. Modify the settings in the sample action to suit your chain.

   For example, modify the following settings:

   - the name of the chain
   - the name of the runtime package
   - the location of the runtime

1. Type a name for the action file in your Substrate repository.

1. Click **Commit new file**.

## Downloading from Docker Hub

You must have a Docker account and Docker installed in your build environment to use the Substrate runtime toolbox.
If you sign in to Docker Hub, you can search for the `paritytech/srtool` container and find the corresponding images with tag names that identify the Rust compiler version and the build script version.

If you don't want to use [`srtool-cli`](/reference/command-line-tools/srtool/#srtool-cli) or [`srtool-app`](https://gitlab.com/chevdor/srtool-app) to work with the `paritytech/srtool` container, you can pull a `paritytech/srtool` container image directly from Docker Hub.

To pull the image from Docker Hub:

1. Sign in to Docker Hub.

2. Type `paritytech/srtool` in the Search field and press Enter.

3. Click **paritytech/srtool**, then click **Tags**.

4. Copy the command for the image you want to pull.
5. Open a terminal shell on your local computer.
6. Paste the command you copied from the Docker Hub.

   For example, you might run a command similar to the following:

   ```bash
   docker pull paritytech/srtool:1.62.0
   ```

   The command downloads and unpacks the image.

### Naming convention for images

Unlike many Docker images, there is no `latest` tag for the `srtool` image.
If you are downloading an image directly from Docker Hub, you'll need to select the image that's compatible with the version of the Rust compiler you have installed.
The naming convention for `paritytech/srtool` Docker images specifies the version of the Rust compiler used to compile the code included in the image.
There are also images that specify both a compiler version and the version of the build script used.
For example, an image named `paritytech/srtool:1.62.0-0.9.19` was compiled with version `1.62.0` of the `rustc` compiler but using the version `0.9.19` of the build script.

Images that only specifies the compiler version always contains the latest version of the software.
In most cases, that's the image you should use.

### Compiler version

If you are downloading an image directly from Docker Hub, you should first check the version of the Rust compiler that you are using to ensure the image is compatible with the version of Rust you have installed.
If you aren't sure which version of the Rust compiler you use, you can run the following command to check the version you have installed:

```bash
rustc --version
```
