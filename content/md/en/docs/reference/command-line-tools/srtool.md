---
title: srtool
description: Describes the Docker container and command-line interface for building the Substrate WebAssembly runtime.
keywords:
---

The core component of the Substrate runtime toolbox (`srtool`) is a Docker container that enables you to build the Substrate WebAssembly runtime in a deterministic way.
By using this tool, you can ensure that the same source code consistently reproduces an identical WebAssembly blob. 
You can also use the tool to inspect and audit the runtime for any Substrate-based chain and to integrate building the WebAssembly runtime into your CI/CD pipeline.

## Working with the Docker container

Because `srtool` is a Docker container, you must have Docker available in your build environment to use it.
However, you don't need to know anything about using Docker to build a chain using `srtool` because you can use the `srtool-cli` command-line interface to work with Docker images.

The `srtiool-cli` package is a command-line utility written in Rust that installs an executable program called `srtool` on your computer. 
This program simplifies your interactions with the `srtool` Docker container.
Over time, the tooling around the `srtool` Docker image has expanded to include the following tools and helper programs:

- [srtool-cli](https://github.com/chevdor/srtool-cli) provides a command-line interface to pull the `srtool` Docker image, get information about the image and tooling used to interact with it, and build the runtime using the `srtool` Docker container.

- [subwasm](https://github.com/chevdor/subwasm) provides command-line options for working with the metadata and WebAssembly runtime built using `srtool`. 
  The `subwasm` program is also used internally to perform tasks in the `srtool` image.

- [srtool-actions](https://github.com/chevdor/srtool-actions) provides Github actions to integrate builds produced using the `srtool` image with your GitHub CI/CD pipelines.
  
- [srtool-app](https://gitlab.com/chevdor/srtool-app) provides a simple graphical user interface for building the runtime using the `srtool` Docker image.

## Installing srtool-cli

The `srtool` command-line interface enables you to build the WebAssembly runtime using the `srtool` Docker image.
You can install the `srtool` command-line interface by running the following command:

```bash
cargo install --git https://github.com/chevdor/srtool-cli
```

### Basic command usage

The basic syntax for running `srtool` commands is:

```text
srtool [options] [subcommand]
```

### Options

You can use the following command-line options with the `srtool` command.

| Option                      | Description
| :---------------------------| :---------------------
| `-h`,&nbsp;`--help`           | Displays usage information.
| `i`,&nbsp;`--image`&nbsp;`<image>` | Specifies an alternative image. Be sure to specify an image that is compatible with the default `paritytech/srtool` image. You should note that specifying a different image might not produce the same deterministic result that the `paritytech/srtool` image produces.
| `-n`,&nbsp;`--no-cache`&nbsp; | Specifies that you don't want to use the tag value from the local cache. 
| `-V`,&nbsp;`--version`&nbsp; | Displays version information.

### Subcommands

You can use the following subcommands with the `srtool` command.

| Command                    | Description
|:-------------------------- |:-----------
| `build` | Starts a new `srtool` container to build your runtime.
| `help` | Displays usage information for `srtool` or for a specified subcommand.
| `info` | Displays information about the `srtool` container and your repository.
| `pull` | Pulls the `srtool` image without running anything else.
| `version` | Displays version information for the `srtool` container. Use `--version` if you want version information for the `srtool-cli` executable.

### Examples

To get version information for the `srtool` Docker image, run the following command:

```bash
srtool version
```

The command displays output similar to the following:

```text
{
  "name": "srtool",
  "version": "0.9.21",
  "rustc": "1.62.0",
  "subwasm": "0.18.0",
  "tera": "0.2.1",
  "toml": "0.2.1"
}
```

To get version information for the `srtool-cli` executable, run the following command:

```bash
srtool --version
```

The command displays output similar to the following:

```text
srtool-cli 0.8.0
```

## srtool build

Use the `srtool build` command to start a new `srtool` container to build the runtime for the package you specify.
By default, the `srtool build` command assumes that the `Cargo.toml` file for the runtime is located in a [`runtime`](https://github.com/paritytech/polkadot/tree/master/runtime) subdirectory with the name of the chain.
For example, the `srtool build` command use the following locations by default:

- runtime/kusama
- runtime/polkadot
- runtime/rococo
- runtime/westend
  
If the `Cargo.toml` file for your runtime is in a different location, you can specify the path as a command-line option.

### Basic usage

The basic syntax for running the `srtool build` command is:

```text
srtool build [options] --package <package> [--runtime-dir <path>] [project-path]
```

### Arguments

By default, the `srtool build` runs in the current working directory. If your project isn't located in the current working directory, you can specify the path to the project location.

| Argument       | Description
| :------------- | :-----------
| `project-path` | Specifies the path to the blockchain project you are building the runtime for.

### Options

You can use the following command-line options with the `srtool build` command.

| Option            | Description
| :---------------- | :-----------
| `-a`,&nbsp;`--app` | Enables a mix of standard output and JSON output during the build. This option is recommended for CI. The JSON output is provided as a single line at the end of the build.
| `--build-opts`&nbsp;`<BUILD_OPTS>` | Enables you to pass custom options directly to the `cargo` build process. If you specify  this command-line option, be aware that none of the automatic options for building Kusama or Polkadot are passed to the build process. You must explicitly set the build options you need when you use the `--build-opts` command-line option. In general, this option rarely required. This option is equivalent to setting the `BUILD_OPTS` environment variable.
| `--default-features`&nbsp;`<default-features>` | Enables you to change the list of default features for the runtime without disabling automatic feature detection. This option is equivalent to setting the `DEFAULT_FEATURES` environment variable. This command-line option has no effect if you set `BUILD_OPTS`.
| `-h`,&nbsp;`--help` | Displays usage information.
| `i`,&nbsp;`--image`&nbsp;`<image>` | Specifies an alternative image. Be sure to specify an image that is compatible with the default `paritytech/srtool` image. You should note that specifying a different image might not produce the same deterministic result that the `paritytech/srtool` image produces.
| `-j`,&nbsp;`--json` | Enables JSON output.
| `--no-cache` | Disables all caching. If you specify this option, the `srtool` image won't access the Cargo home cache for build dependencies. In general, this option is rarely used because there are no known issues with using the cache.
| `-p`,&nbsp;`--package`&nbsp;`<package>` | Specifies the name of the runtime package you want to build. The name you specify should be the same as the name defined in the `Cargo.toml` file for the runtime,for example, kusama-runtime, polkadot-runtime, and so on. This option is equivalent to setting the `PACKAGE` environment variable.
| `--profile`&nbsp;`<profile>` | Specifies the profile to use for building the runtime, The default profile to build a runtime is always `release`. You can override the default with this command-line option. This option is equivalent to setting the `PROFILE` environment variable.
| `-r`,&nbsp;`--runtime-dir`&nbsp;`<runtime>` | Specifies the location of the `Cargo.toml` file for the runtime. If your runtime is not in the standard location, you can use this command-line option to specify the correct location. This option is equivalent to setting the `RUNTIME_DIR` environment variable.
| `-V`,&nbsp;`--version` | Displays version information.

### Examples

To build the Westmint runtime from the `cumulus` repository where the path to the `Cargo.toml` for the runtime is [parachains/runtimes/assets/westmint](https://github.com/paritytech/cumulus/tree/master/parachains/runtimes/assets/asset-hub-westend), you would run the following command:

```bash
srtool build --app --package westmint-runtime --runtime-dir parachains/runtimes/assets/westmint
```

The first time you run the `srtool build` command it takes some time to complete.
As the runtime compiles, messages about its progress are displayed as standard output.
Because this example uses the `--app` command-line option, JSON output is displayed in a single line at the end of the build similar to the following truncated output:

```text
...
   Compiling cumulus-primitives-parachain-inherent v0.1.0 (/build/primitives/parachain-inherent)
   Compiling cumulus-pallet-parachain-system v0.1.0 (/build/pallets/parachain-system)
    Finished release [optimized] target(s) in 112m 11s
✨ Your Substrate WASM Runtime is ready! ✨
{"gen":"srtool v0.9.21","src":"git","version":"1.0.0","commit":"bd41e3f11887ea2f55fc37be71ff652923388e03","tag":"v0.9.220-rc2","branch":"master","rustc":"rustc 1.62.0 (a8314ef7d 2022-06-27)","pkg":"westmint-runtime","tmsp":"2022-08-22T21:12:18Z","size":"707937","prop":"0x6b8e93443b6660a16f67a6cd34d415af463e2285eda3fd02b9fe052c1ad2ceb9"
... }}}}
```

## srtool help

Use the `srtool help` command to display usage message for `srtool` or for a specified subcommand.

### Basic usage

```text
srtool help [subcommand]
```

### Examples

To display usage information for the build subcommand, run the following command:

```bash
subkey help build
```

## srtool info

Use the `srtool info` command to display information about the `srtool` container and your repository.
By default, the `srtool info` command assumes that the `Cargo.toml` file for the runtime is located in a [`runtime`](https://github.com/paritytech/polkadot/tree/master/runtime) subdirectory with the name of the chain.
For example, the `srtool info` command use the following locations by default:

- runtime/kusama
- runtime/polkadot
- runtime/rococo
- runtime/westend
  
If the `Cargo.toml` file for your runtime is in a different location, you can specify the path as a command-line option.

### Basic usage

The basic syntax for running the `srtool info` command is:

```text
srtool info [options] --package <package> [--runtime-dir <path>] [project-path]
```

### Arguments

By default, the `srtool info` runs in the current working directory. 
If your project isn't located in the current working directory, you can specify the path to the project location.

| Argument       | Description
| :-------------- | :-----------
| `project-path` | Specifies the path to the blockchain project if the project isn't located in the current working directory. |

### Options

You can use the following command-line options with the `srtool info` command.

| Option                | Description
| :-------------------- | -----------
| `-h`,&nbsp;`--help` | Displays usage information.
| `i`,&nbsp;`--image`&nbsp;`<image>` | Specifies an alternative image. Be sure to specify an image that is compatible with the default `paritytech/srtool` image. You should note that specifying a different image might not produce the same deterministic result that the `paritytech/srtool` image produces.
| `-p`,&nbsp;`--package`&nbsp;`<package>` | Specifies the name of the runtime package you want to build. The name you specify should be the same as the name defined in the `Cargo.toml` file for the runtime,for example, kusama-runtime, polkadot-runtime, and so on. This option is equivalent to setting the `PACKAGE` environment variable.
| `-r`,&nbsp;`--runtime-dir`&nbsp;`<runtime>` | Specifies the location of the `Cargo.toml` file for the runtime. If your runtime is not in the standard location, you can use this command-line option to specify the correct location. This option is equivalent to setting the `RUNTIME_DIR` environment variable.
| `-V`,&nbsp;`--version` | Displays version information.

### Examples

To display information about the `srtool` container and the local node-template repository, you might run a command similar to the following:

```bash
srtool info --package node-template-runtime --runtime-dir runtime
```

This command displays output similar to the following:

```text
{
  "generator": {
    "name": "srtool",
    "version": "0.9.21"
  },
  "src": "git",
  "version": "4.0.0-dev",
  "git": {
    "commit": "6a8b2b12371395979099d2c79ccc1860531b0449",
    "tag": "",
    "branch": "my-release-branch"
  },
  "rustc": "rustc 1.62.0 (a8314ef7d 2022-06-27)",
  "pkg": "polkadot-runtime",
  "profile": "release"
}
```

## srtool pull

Use the `srtool pull` command to check for and download the latest version of the `srtool` Docker image.

### Basic usage

The basic syntax for running the `srtool pull` command is:

```text
srtool pull [options]
```

### Options

You can use the following command-line options with the `srtool pull` command.

| Option              | Description
| :-------------------| :-----------
| `-h`,&nbsp;`--help`  | Displays usage information.
| `i`,&nbsp;`--image`&nbsp;`<image>` | Specifies an alternative image. Be sure to specify an image that is compatible with the default `paritytech/srtool` image. You should note that specifying a different image might not produce the same deterministic result that the `paritytech/srtool` image produces.
| `-V`,&nbsp;`--version` | Displays version information.

### Examples

To check for a new version of the `srtool` container and Docker image, you might run a command similar to the following:

```bash
srtool pull
```

This command checks the Docker Hub for the latest version of the `paritytech/srtool` image and begins downloading and extracting the software.
For example

```text
Found 1.62.0, we will be using paritytech/srtool:1.62.0 for the build
1.62.0: Pulling from paritytech/srtool
405f018f9d1d: Pull complete 
c49473e7f7b3: Pull complete 
7edf98d07029: Pull complete 
85a50724a6fa: Pull complete 
87fb1e3dee5b: Downloading   19.4MB/170.4MB
469075c5d317: Download complete 
533bfa44b64a: Download complete 
...
```

When all tasks are complete, the command displays output similar to the following:

```text
Digest: sha256:d5353a63d8fccbef5666e28a8fa0b302d71d4f53cabeb760fe213f3d7df4b8b6
Status: Downloaded newer image for paritytech/srtool:1.62.0
docker.io/paritytech/srtool:1.62.0
```

If you already have the latest version installed locally, the command displays output similar to the following:

```text
Found 1.62.0, we will be using paritytech/srtool:1.62.0 for the build
1.62.0: Pulling from paritytech/srtool
Digest: sha256:d5353a63d8fccbef5666e28a8fa0b302d71d4f53cabeb760fe213f3d7df4b8b6
Status: Image is up to date for paritytech/srtool:1.62.0
docker.io/paritytech/srtool:1.62.0
```

## srtool version

Use the `srtool version` command display version information for the `srtool` container. Use `--version` if you want the version of the `srtool-cli` executable.

### Basic usage

The basic syntax for running the `srtool version` command is:

```text
srtool version [options]
```

### Options

You can use the following command-line options with the `srtool version` command.

| Option           | Description
| :----------------| :-------------
| `-h`,&nbsp;`--help` | Displays usage information.
| `i`,&nbsp;`--image`&nbsp;`<image>` | Specifies an alternative image. Be sure to specify an image that is compatible with the default `paritytech/srtool` image. You should note that specifying a different image might not produce the same deterministic result that the `paritytech/srtool` image produces.
| `-V`,&nbsp;`--version` | Displays version information.

### Examples

To display information about the srtool container, run the following command:

```bash
srtool version       
```

The command displays output similar to the following:

```text
{
  "name": "srtool",
  "version": "0.9.21",
  "rustc": "1.62.0",
  "subwasm": "0.18.0",
  "tera": "0.2.1",
  "toml": "0.2.1"
}
```

To display version information for the `srtool` command-line interface instead of the container, you can run the following command:

```bash
srtool version --version
```

The command displays output similar to the following:

```text
srtool-version 0.8.0
```
