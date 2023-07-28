---
title: subxt
description:
keywords:
---

The [`subxt`](https://github.com/paritytech/subxt) library enables you to submit transactions to a Substrate node through remote procedure calls.
Before you use the `subxt` library, you can use the standalone `subxt` command-line interface to download the metadata for the Substrate node you want to use as the target for submitting transactions.
The `subxt-cli` tool enables you to perform two key tasks that are critical to using the `subxt` library:

* You can use the `subxt-cli` tool to download the metadata from any target Substrate node.
* You can use the `subxt-cli` tool to generate the runtime API code from the metadata from any target Substrate node.

You can use the `subxt` library and `subxt-cli` tool for any node that uses metadata v14 and later.
For examples of how to use the `subxt` library, see the [examples](https://github.com/paritytech/subxt/tree/master/examples) folder.

## Installation

To install `subxt-cli`:

1. Open a terminal shell, if necessary.
1. Verify that you have the Rust compiler and toolchain, if necessary.
1. Download the required packages with the following command:
    `cargo install subxt-cli`

## Basic command usage

The basic syntax for running `subxt` commands is:

`subxt <SUBCOMMAND>`

To use the commands exposed by `subxt`, you must either be running a node locally or specify the chain you're targeting.
If the metadata is already provided, it is possible to use the `codegen` subcommand without running a node.

### Flags

You can use the following optional flags with the `subxt` command.

| Flag | Description
| ------- | -----------
| -h, --help | Displays usage information.
| -V, --version | Displays version information.

### Subcommands

You can use the following subcommands with the `subxt` command-line interface.

| Command | Description
| ------- | -----------
| `codegen` | Generates runtime API client code from metadata.
| `metadata` | Downloads metadata from a Substrate node for use with `subxt` codegen.

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
| `-f, --file <file>` | Specifies the path to the encoded metadata file.
| `--url <url>` | Specifies the URL of the Substrate node to query for metadata for codegen.

#### Examples

To format the generated API and print it to the terminal, run the following command:

`subxt codegen | rustfmt`

To save the generated API in a file, run the following command:

`subxt codegen | rustfmt --edition=2018 > api.rs`

## metadata

Use the `subxt metadata` command to get the metadata of the target Substrate node.

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
| `-f, --format <format>` | Specifies the format of the metadata to display. Valid formats are `json`, `hex` or `bytes`. The default format is `json`.
| `--url <url>` | Specifies the URL of the Substrate node to query for metadata. The default URL is `http://localhost:9933`.

#### Examples

To save the metadata from the local node encoded in bytes to a file, run the following command:

`subxt metadata -f bytes > metadata.scale`

To save the metadata from the Rococo network to a JSON file, run the following command:

`subxt metadata --url https://rococo-rpc.polkadot.io:443 > <contract_name>.json`

To query type `125` from the array of types in the metadata and output in JSON, run the following command:

`subxt metadata --format json | jq '.[1].V14.types.types | .[125]'`
