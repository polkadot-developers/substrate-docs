---
title: srtool
description: Command-line reference information for the srtool program.
keywords:
---

The Substrate runtime tool (`srtool`) is a Docker container that enables you to build the Substrate WebAssembly runtime in a deterministic way.
This tool enables you to consistently reproduce an identical WebAssembly blob so that you can integrate building the WebAssembly runtime into your CI/CD pipeline.
tools for runtime development.

## Get the Docker image

If you have a Docker account, you can search for the `paritytech/srtool` container and tagged images on the Docker Hub.

The `paritytech/srtool` Docker image names specify the version of the Rust compiler used to compile the code included in the image.
For example, the image `paritytech/srtool:1.62.0` indicates that the tools included in the image were compiled with version `1.62.0` of the `rustc` compiler.
In addition to the compiler version, some images specify the version of the build script used.
For example, an image named `paritytech/srtool:1.62.0-0.9.19` was compiled with version `1.62.0` of the `rustc` compiler but using the version `0.9.19` of the build script.

The image that only specifies the compiler version always contains the latest version of the software.

1. Open a terminal shell on your local computer.
   
2. Download and unpack the container by running a command similar to the following:
   
   ```bash
   docker pull paritytech/srtool:1.62.0
   ```

## Get helper programs

The Substrate runtime tool requires Docker.
However, you don't need to know anything about using Docker to build a chain using `srtool`.
Instead, you can use the following programs to interact with the Docker image.

- [srtool-cli](https://github.com/chevdor/srtool-cli) provides a command-line interface to build the runtime using the `srtool` Docker image.

- [srtool-app](https://gitlab.com/chevdor/srtool-app) provides a simple graphical user interface for building the runtime using the `srtool` Docker image.

- [srtool-actions](https://github.com/chevdor/srtool-actions) provides Github actions to integrate builds produced using the `srtool` image with your CI/CD pipeline.

- [subwasm](https://github.com/chevdor/subwasm) provides command-line options for working with the metadata and WebAssembly runtime built using `srtool`.



You can use the `srtool` command-line interface to build the WebAssembly runtime in a deterministic way.
This tool allows you or your continuous integration (CI) system to consistently produce the same WebAssembly bytecode.

srtool is cli allowing to control the srtool docker image

USAGE:
    srtool [OPTIONS] <SUBCOMMAND>

OPTIONS:
    -h, --help             Print help information
    -i, --image <IMAGE>    Choose an alternative image. Beware to choose an image that is compatible
                           with the original srtool image. Using a random image, you take the risk
                           to NOT produce exactly the same deterministic result as srtool [default:
                           paritytech/srtool]
    -j, --json             This option is DEPRECATED and has no effect
    -n, --no-cache         Do not use the local cached tag value
    -V, --version          Print version information

SUBCOMMANDS:
build | Start a new srtool container to build your runtime
help | Print this message or the help of the given subcommand(s)
info | Provide information about the srtool container and your repo 
pull | Simply pull the srtool image and do not run anything else
version | Show the versions of the srtool container. Use --version if you want the version
                   of this executable

## srtool build

Start a new srtool container to build your runtime

USAGE:
    srtool build [OPTIONS] --package <PACKAGE> [PATH]

ARGS:
    <PATH>    By default, srtool will work in the current folder. If your project is located in
              another location, you can pass it here [default: .]

OPTIONS:
    -a, --app
            Enable the "app" mode which is a mix of json output and outputting progress during the
            build. This flag is recommended for CI. the json output will be provided as a single
            line at the end in compact mode

        --build-opts <BUILD_OPTS>
            You may pass options to cargo directly here. WARNING, if you pass this value, the
            automatic build options for Kusama and Polkadot will not be passed and you need to take
            care of them manually. In general, you should never use this option unless you HAVE to
            [env: BUILD_OPTS=]

        --default-features <DEFAULT_FEATURES>
            Passing this is less involved than passing BUILD_OPTS. It allows changing the list of
            default features while keeping the automatic features detection. This value is useless
            if BUILD_OPTS is set [env: DEFAULT_FEATURES=]

    -h, --help
            Print help information

    -i, --image <IMAGE>
            Choose an alternative image. Beware to choose an image that is compatible with the
            original srtool image. Using a random image, you take the risk to NOT produce exactly
            the same deterministic result as srtool [default: paritytech/srtool]

    -j, --json
            Enable json output, same than the global --json option

        --no-cache
            Passing this flag allows completely disabling caching. As a result, no cargo-home will
            be mounted to the srtool image. There is no known issue with having the cache ON, this
            is why it is the default

    -p, --package <PACKAGE>
            Provide the runtime such as kusama-runtime, polkadot-runtime, etc... [env: PACKAGE=]

        --profile <PROFILE>
            The default profile to build runtimes is always `release`. You may override the default
            with this flag [env: PROFILE=] [default: release]

    -r, --runtime-dir <RUNTIME_DIR>
            If your runtime is not in the standard location runtime/<chain_name> you can pass this
            args to help srtool find it [env: RUNTIME_DIR=]

    -V, --version
            Print version information


[srtool](https://github.com/paritytech/srtool)