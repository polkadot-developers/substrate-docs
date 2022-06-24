---
title: polkadot-launch
description: /home/dan/git/docs/content/md/en/docs/reference/account-data-structures.md
keywords:
---

The `polkadot-launch` program enables you to set up a local relay chain and parachain test network.
Before you use `polkadot-launch`, you must have the binary files for a relay chain and a collator available in the `bin` folder.
You can generate the relay chain and collator binary files by cloning the `rococo-v1` branch of the `polkadot` and `cumulus` projects in the same root directory as the `polkadot-launch` repository.
For detailed instructions about how to clone, compile, and copy the required binary files, see the [README](https://github.com/paritytech/polkadot-launch#binary-files) in the `polkadot-launch` repository.

The `polkadot-launch` program also requires you to provide a configuration file that defines the properties of the test network you want to set up.
The configuration file can be a JSON or a JavaScript file.
You can find examples for both [JSON](https://github.com/paritytech/polkadot-launch/blob/master/config.json) and [JavaScript](https://github.com/paritytech/polkadot-launch/blob/master/config.js) configuration files in the `polkadot-launch` repository.

## Before you begin

Before you use `polkadot-launch` to set up a local test network, you need to prepare your environment with the required files:

- Download and compile the `polkadot` relay chain and copy `polkadot` binary to the `polkadot-launch/bin` directory.
- Download and compile the `polkadot-collator` and copy `polkadot-collator` binary to the `polkadot-launch/bin` directory.
- Prepare a configuration file with the properties for your test network.

See the documentation in in the `polkadot-launch` repository for additional informmation abot performing these steps.

## Installation

To install the `polkadot-launch` program:

1. Open a terminal shell on your computer.

1. Clone the `polkadot-launch` repository by running the following command:

   ```
   git clone https://github.com/paritytech/polkadot-launch.git
   ```

1. Change to the root directory of the `polkadot-launch` repository by running the following command:

   ```
   cd polkadot-launch
   ```

1. Verify that you have either `yarn` or `npm` installed by running either of the following commands:

   ```
   yarn --version
   ```

   or

   ```
   npm --version
   ```

1. Install polkadot-launch by running either of the following commands:

   ```
   yarn global add polkadot-launch
   ```

   or

   ```
   npm i polkadot-launch -g
   ```

1. Verify the properties in your configuration file reflect the location of the relay chain and collator binaries.

## Basic command usage

The basic syntax for running {`polkadot-launch`} commands is:

`polkadot-launch <configuration-file> [flag]`

### Flags

You can use the following optional flags with the `polkadot-launch` command.

| Flag          | Description                   |
| ------------- | ----------------------------- |
| -h, --help    | Displays usage information.   |
| -V, --version | Displays version information. |

For additional information about using `polkadot-launch`, see the [README](https://github.com/paritytech/polkadot-launch) in the `polkadot-launch` repository.
