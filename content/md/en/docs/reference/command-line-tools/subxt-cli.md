---
title: subxt-cli
description:
keywords:
---

`subxt-cli` is a CLI utility to generate a client API from the metadata of a Substrate node.
This tool was originally designed for the [`subxt` library](https://github.com/paritytech/subxt) to build the runtime API from the metadata of a target node. 
It can be used as a standalone tool to download the metadata or generate the API for the runtime of any node that uses metadata V14 and above. 

## Installation 

To install `subxt-cli`:

1. Open a terminal shell, if necessary.
1. Verify that you have the Rust compiler and toolchain, if necessary.
1. Download the required packages with the following command: 

    `cargo install subxt-cli`

## Basic command usage

The basic syntax for running `subxt-cli` commands is:

`subxt <SUBCOMMAND>`

In order to use the commands exposed by `subxt`, you must either be running a node locally or specify the chain you're targeting.
If the metadata is already provided, it is possible to use the `codegen` subcommand without running a node.

### Flags

You can use the following optional flags with the `subxt` command.

| Flag | Description
| ------- | -----------
| -h, --help | Displays usage information. 
| -V, --version | Displays version information.

### Subcommands

You can use the following subcommands with the `subxt` command. 
For reference information and examples that illustrate using `subxt` subcommands, select an appropriate command.

| Command | Description
| ------- | -----------
| [`codegen`](#codegen) | Generate runtime API client code from metadata.  
| [`metadata`](#metadata) | Download metadata from a Substrate node, for use with `subxt` codegen.

### Output

Depending on how you specify the subcommand, the output from `subxt` displays some or all of the following information:

| This field | Contains
| ---------- | ----------
| Metadata | A file with the metadata of a target chain.
| API | A file with the API of the target chain.

### Examples

To display version information for the `subxt` program, run the following command:

`subxt --version`

To display usage information for the `subxt metadata` command, run the following command:

`subxt metadata --help`

## codegen

Use the `subxt codegen` command to generate an interface for some target Substrate node.

This could be useful for debugging or modifying a node's API to meet certain hardware constraints.

#### Basic usage

`subxt codegen [OPTIONS]`

#### Flags

You can use the following optional flags with the `subxt codegen` command.

| Flag   | Description
| ------ | -----------
| `-h, --help`  | Displays usage information.
| `-V, --version` | Prints version information.

#### Options

You can use the following command-line options with the `subxt codegen` command.

| Option   | Description
| -------- | -----------
| `-f, --file <file>` | The path to the encoded metadata file.
| `--url <url>` | The url of the Substrate node to query for metadata for codegen.

#### Examples

To format the generated API and print it to the terminal:

`subxt codegen | rustfmt`

To save the generated API in a file:

`subxt codegen | rustfmt --edition=2018 > api.rs`
## metadata

Use the `subxt metadata` command to get the metadata of some target Substrate node.

#### Basic usage

`subxt metadata [OPTIONS]`

#### Flags

You can use the following optional flags with the `subxt metadata` command.

| Flag   | Description
| ------ | -----------
| `-h, --help`  | Displays usage information.
| `-V, --version` | Prints version information.

#### Options

You can use the following command-line options with the `subxt metadata` command.

| Option   | Description
| -------- | -----------
| `-f, --format <format>` | The format of the metadata to display: `json`, `hex` or `bytes` [default: json].
| `--url <url>` | The url of the Substrate node to query for metadata [default: http://localhost:9933].

#### Examples

To save the metadata to a file from a local node in bytes:

`subxt metadata -f bytes > metadata.scale`

To save the metadata from the Rococo network to a JSON file:

`subxt metadata --url https://rococo-rpc.polkadot.io:443 > metadata.json`

To query type `125` from the array of types in the metadata and output in JSON: 

`subxt metadata --format json | jq '.[1].V14.types.types | .[125]'`