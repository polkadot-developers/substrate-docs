---
title: subkey
description: Provides command-line reference information for using the subkey program to generate and manage keys.
keywords:
---

The `subkey` program is a key generation and management utility that is included in the Substrate repository.
You can use the `subkey` program to perform the following tasks:

- Generate and inspect cryptographically-secure public and private key pairs.
- Restore keys from secret phrases and raw seeds.
- Sign and verify signatures on messages.
- Sign and verify signatures for encoded transactions.
- Derive hierarchical deterministic child key pairs.

## Signature schemes

The `subkey` program currently supporting the following signature schemes:

- [sr25519](https://wiki.polkadot.network/docs/en/learn-cryptography): Schorr signatures on the Ristretto group.
- [ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519): SHA-512 (SHA-2) on Curve25519.
- [secp256k1](https://en.bitcoin.it/wiki/Secp256k1): ECDSA signatures on secp256k1.

In Substrate-based networks, the `sr25519` encoded keys are used to produce SS58 addresses as the public keys for interacting with the blockchain.

## Installation

You can download, install, and compile `subkey` using `cargo` without cloning the full Substrate repository.
However, you must add Substrate build dependencies to your environment before you can install `subkey` as a standalone binary.
To ensure dependencies are available, you can build the `subkey` binary from a clone of the Substrate repository.

To install and compile the `subkey` program:

1. Open a terminal shell, if necessary.

1. Verify that you have the Rust compiler and toolchain, if necessary.

1. Clone the Substrate repository, if necessary, by running the following command:

   ```bash
   git clone https://github.com/paritytech/polkadot-sdk.git
   ```

1. Change to the root directory of the Substrate repository by running the following command:

   ```bash
   cd polkadot-sdk
   ```

1. Compile the `subkey` program using the `nightly` toolchain by running the following command:

   ```bash
   cargo +nightly build --package subkey --release
   ```

   Because of the number of packages involved, compiling the program can take several minutes.

1. Verify that the `subkey` program is ready to use and view information about the options available by running the following command:

   ```bash
   ./target/release/subkey --help
   ```

## Hierarchical deterministic keys

The `subkey` program supports hierarchical deterministic keys.
Hierarchical deterministic (HD) keys enable you to use a parent seed to derive child key pairs in a hierarchical tree structure.
In this hierarchical structure, each child derived from a parent has its own key pair.
The derived keys can also be used to derive additional child key pairs, similar to how a file system can have nested directories in a hierarchical directory structure.
For background information about how hierarchical deterministic keys are derived, see the [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) specification for hierarchical deterministic wallets.

For information about deriving hierarchical deterministic keys using subkey commands, see [Working with derived keys](#working-with-derived-keys).

## Basic command usage

The basic syntax for running `subkey` commands is:

```text
subkey [subcommand] [flag]
```

Depending on the subcommand you specify, additional arguments, options, and flags might apply or be required.
To view usage information for a specific `subkey` subcommand, specify the subcommand and the `--help` flag.
For example, to see usage information for `subkey inspect`, you can run the following command:

```bash
subkey inspect --help
```

### Flags

You can use the following optional flags with the `subkey` command.

| Flag          | Description                   |
| ------------- | ----------------------------- |
| -h, --help    | Displays usage information.   |
| -V, --version | Displays version information. |

### Subcommands

You can use the following subcommands with the `subkey` command.
For reference information and examples that illustrate using subkey subcommands, select an appropriate command.

| Command                                          | Description                                                                                                                     |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| [`generate`](#subkey-generate)                   | Generates a random account key.                                                                                                 |
| [`generate-node-key`](#subkey-generate-node-key) | Generates a random node `libp2p` secret key. You can save the secret key to a file or display it as standard output (`stdout`). |
| [`help`](#subkey-help)                           | Displays usage information for `subkey` or for a specified subcommand.                                                          |
| [`inspect`](#subkey-inspect)                     | Displays the public key and SS58 address for the secret URI you specify.                                                        |
| [`inspect-node-key`](#subkey-inspect-node-key)   | Displays the peer ID that corresponds with the secret node key in the file name you specify.                                    |
| [`sign`](#subkey-sign)                           | Signs a message with the secret key you specify.                                                                                |
| [`vanity`](#subkey-vanity)                       | Generates a seed that provides a vanity address.                                                                                |
| [`verify`](#subkey-verify)                       | Verifies the signature for a message is valid for the public or secret key you specify.                                         |

### Output

Depending on the subcommand you specify, the output from the subkey program displays some or all of the following information:

| This field        | Contains                                                                                                                                                                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Secret phrase     | A series of English words that encodes the secret key in a human-friendly way. This series of words—also referred to as a mnemonic phrase or seed phrase—can be used to recover a secret key if the correct set of words are provided in the correct order. |
| Secret Seed       | The minimum information necessary to restore a key pair. The secret seed is also sometimes referred to as a private key or raw seed. All other information is calculated from this value.                                                                   |
| Public Key (hex)  | The public half of the cryptographic key pair in hexadecimal format.                                                                                                                                                                                        |
| Public Key (SS58) | The public half of the cryptographic key pair in SS58 encoding.                                                                                                                                                                                             |
| Account ID        | An alias for the public key in hexadecimal format.                                                                                                                                                                                                          |
| SS58 Address      | An SS58-encoded public address based on the public key.                                                                                                                                                                                                     |

### Examples

To display version information for the `subkey` program, run the following command:

```bash
subkey --version
```

To display usage information for the `subkey verify` command, run the following command:

```bash
subkey verify --help
```

## subkey generate

Use the `subkey generate` command to generate public and private keys and account addresses.
You can use command-line options to generate keys with different signature schemes or mnemonic phrases with more or fewer words.

#### Basic usage

```text
subkey generate [flags] [options]
```

#### Flags

You can use the following optional flags with the `subkey generate` command.

| Flag | Description |
| ---- | ----------- |
| `-h`, `--help` | Displays usage information.|
| `--password-interactive` | Enables you to enter the password for accessing the keystore interactively in the terminal. |
| `-V`, `--version`| Displays version information. |

#### Options

You can use the following command-line options with the `subkey generate` command.

| Option | Description |
| ------ | ----------- |
| `--keystore-path <path>` | Specifies a custom keystore path. |
| `--keystore-uri <keystore-uri>` | Specifies a custom URI to connect to for keystore services |
| `-n`, `--network <network>` | Specifies the network address format to use. For example, `kusama` or `polkadot`. For a complete list of networks supported, see the online usage information. |
| `--output-type <format>` | Specifies the output format to use. Valid values are Json and Text. The default output format is Text. |
| `--password <password>` | Specifies the password used by the keystore. This option enables you to append an extra secret to the seed. |
| `--password-filename <path>` | Specifies the name of a file that contains the password used by the keystore. |
| `--scheme <scheme>` | Specifies the cryptographic scheme for the key you are generating. Valid values are `Ecdsa`, `Ed25519`, `Sr25519`. The default scheme is `Sr25519`. |
| `-w`, `--words <words>` | Specifies the number of words in the secret phrase for the key you are generating. Valid values are 12, 15, 18, 21, 24. By default, the secret phrase consists of 12 words. |

#### Examples

To generate a new key pair that uses the sr25519 signature scheme, run the following command:

```bash
subkey generate
```

The command displays output similar to the following with a 12-word secret phrase:

```text
Secret phrase:       bread tongue spell stadium clean grief coin rent spend total practice document
  Secret seed:       0xd5836897dc77e6c87e5cc268abaaa9c661bcf19aea9f0f50a1e149d21ce31eb7
  Public key (hex):  0xb6a8b4b6bf796991065035093d3265e314c3fe89e75ccb623985e57b0c2e0c30
  Account ID:        0xb6a8b4b6bf796991065035093d3265e314c3fe89e75ccb623985e57b0c2e0c30
  Public key (SS58): 5GCCgshTQCfGkXy6kAkFDW1TZXAdsbCNZJ9Uz2c7ViBnwcVg
  SS58 Address:      5GCCgshTQCfGkXy6kAkFDW1TZXAdsbCNZJ9Uz2c7ViBnwcVg
```

The `subkey` program encodes the address associated with a public/private key pair differently depending on the format required for the network where it is used.
If you want to use the **same private key** on the Kusama and Polkadot networks, you can use the `--network` option to generate the separate address formats for the Kusama and Polkadot networks.
The public key is the same, but the address formats are network-specific.
To generate a key pair for a specific network, run a command similar to the following:

```bash
subkey generate --network picasso
```

The command displays the same fields as output, but uses the address format for the network you specify.

To generate a more secure key pair that uses the `ed25519` signature scheme and an 24-word secret phrase for the `moonriver` network, you would run the following command:

```bash
subkey generate --scheme ed25519 --words 24 --network moonriver
```

The command displays the same fields as output, but uses the Ed25519 signature scheme, a 24-word secret phrase, and the address format for the `moonriver` network.

```text
Secret phrase:       cloth elevator sadness twice arctic adjust axis vendor grant angle face section key safe under fee fine garage pupil hotel museum valve popular motor
  Secret seed:       0x5fa5923c1d6753fa30f268ffd363efb730ca0db906f55bc17efe65cd24f92097
  Public key (hex):  0x3f1da4d35489e3d84739de1490f51b567ad2a62793cca1357e624fbfa534fc85
  Account ID:        0x3f1da4d35489e3d84739de1490f51b567ad2a62793cca1357e624fbfa534fc85
  Public key (SS58): VkFLVqcighJnssSbL4LDSGy5ShJQZvYhm7G8K8W1ZXt96Z5VG
  SS58 Address:      VkFLVqcighJnssSbL4LDSGy5ShJQZvYhm7G8K8W1ZXt96Z5VG
```

To generate a key that is password-protected, run the `subkey generate` command using the `--password <password>` option.
For example:

```bash
subkey generate --password "pencil laptop kitchen cutter"
```

After you generate a key that requires a password, you can retrieve it by including the `--password` option and password string in the command line or by adding three slashes (`///`) at the end of the secret phrase.
Remember that it is important to keep passwords, secret phrases, and secret seeds secure and to back them up in a secure location.

## subkey generate-node-key

Use the `subkey generate-node-key` command to generate random public and private keys for peer-to-peer (`libp2p`) communication between Substrate nodes.
The public key is the peer identifier that is used in chain specification files or as a command-line argument to identify a node participating in the blockchain network.
In most cases, you run this command with a command-line option to save the private key to a file.

#### Basic usage

```text
subkey generate-node-key [flags] [options]
```

#### Flags

You can use the following optional flags with the `subkey generate-node-key` command.

| Flag              | Description                   |
| ----------------- | ----------------------------- |
| `-h`, `--help`    | Displays usage information.   |
| `-V`, `--version` | Displays version information. |

#### Options

You can use the following command-line option with the `subkey generate-node-key` command.

| Option  | Description |
| ------- | ----------- |
| `--file <file-name>` | Specifies the file location you want to use to save the secret key generated for the local node. If you don't specify this option, the generated keys are displayed as standard output (`stdout`). |

#### Examples

To generate a random key pair for peer-to-peer communication and save the secret key in a file, run a command similar to the following:

```bash
subkey generate-node-key --file ../generated-node-key
```

This command displays the peer identifier for the node key in the terminal and the private key is saved in the `generated-node-key` file.
In this example, the saved key in the parent directory instead of the current working directory.

```text
12D3KooWHALHfL7dDBiGTt4JTEAvCbDWts8zHwvcPvJXDF9fxue7
```

## subkey help

Use the `subkey help` command to display usage message for `subkey` or for a specified subcommand.

#### Basic usage

```text
subkey help [subcommand]
```

#### Examples

To display usage information for the `verify` subcommand, run the following command:

```bash
subkey help verify
```

## subkey inspect

Use the `subkey inspect` command to recalculate the public key and public address for specified secret key or mnemonic phrase.

#### Basic usage

```text
subkey inspect [flags] [options] uri
```

#### Flags

You can use the following optional flags with the `subkey inspect` command.

| Flag | Description |
| ---- | ----------- |
| `-h`, `--help` | Displays usage information. |
| `--password-interactive` | Enables you to enter the password for accessing the keystore interactively in the terminal. |
| `--public` | Indicates that the `uri` you specify to inspect is a hex-encoded public key. |
| `-V`, `--version` | Displays version information. |

#### Options

You can use the following command-line options with the `subkey inspect` command.

| Option | Description |
| ------ | ----------- |
| `--keystore-path <path>` | Specifies a custom keystore path. |
| `--keystore-uri <keystore-uri>` | Specifies a custom URI to connect to for keystore services. |
| `-n`, `--network <network>` | Specifies the network address format to use. For example, `kusama` or `polkadot`. For a complete list of networks supported, see the online usage information. |
| `--output-type <format>` | Specifies the output format to use. Valid values are Json and Text. The default output format is Text. |
| `--password <password>` | Specifies the password used by the keystore. This option enables you to append an extra secret to the seed. |
| `--password-filename <path>` | Specifies the name of a file that contains the password used by the keystore. |
| `--scheme <scheme>` | Specifies the cryptographic scheme for the key you are inspecting. Valid values are `Ecdsa`, `Ed25519`, `Sr25519`. The default scheme is `Sr25519`. |

#### Arguments

You must specify the following required argument with the `subkey inspect` command.

| Argument | Description |
| -------- | ----------- |
| `uri` | Specifies the key URI you want to inspect. You can specify the key using its secret phrase, secret seed (with derivation paths and password), SS58 address, public key, or hex-encoded public key. If you specify the `uri` using a hex-encoded public key, you must also include the `--public` flag on the command line. If you specify a file name for the `uri`, the file content is used as the URI. |

#### Examples

To inspect the public keys derived from a mnemonic phrase, you can run a command similar to the following:

```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very"
```

The command displays output similar to the following:

```text
Secret phrase `caution juice atom organ advance problem want pledge someone senior holiday very` is account:
  Secret seed:       0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
  Public key (hex):  0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  Public key (SS58): 5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
  Account ID:        0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  SS58 Address:      5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
```

To inspect the public keys derived from a secret seed, you can run a command similar to the following:

```bash
subkey inspect 0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
```

If you store a secret phrase or secret seed in a text file—for example, `my-secret-key`—you can specify the file name on the command-line to pass the contents of the file and display the public keys associated with that secret phrase or secret seed.
For example, you can run a command similar to the following:

```bash
subkey inspect my-secret-key
```

To inspect the public keys using a hex-encoded public key, you can run a command similar to the following:

```bash
subkey inspect --public 0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
```

In this case, the command only displays public information similar to the following:

```text
Network ID/version: substrate
  Public key (hex):   0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  Account ID:         0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  Public key (SS58):  5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
  SS58 Address:       5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
```

The `subkey` program encodes the address associated with a public/private key pair differently depending on the format required for the network where it is used.
If you use the **same private key** on the Kusama and Polkadot networks, you can use the `--network` option to inspect the address used for a specific network.
The public key is the same, but the address format is network-specific.
To inspect a key pair for a specific network, run a command similar to the following:

```bash
subkey inspect --network kusama "caution juice atom organ advance problem want pledge someone senior holiday very"
```

In the command output, the secret phrase, secret seed, and public keys are the same, but the address for the Kusama network is:

```text
  SS58 Address:      HRkCrbmke2XeabJ5fxJdgXWpBRPkXWfWHY8eTeCKwDdf4k6
```

To inspect the address for the same private key on the Polkadot network, you would run a command similar to the following:

```bash
subkey inspect --network polkadot "caution juice atom organ advance problem want pledge someone senior holiday very"
```

In the command output, the secret phrase, secret seed, and public keys are the same as the Kusama network, but the address for the Polkadot network is:

```text
  SS58 Address:      15rRgsWxz4H5LTnNGcCFsszfXD8oeAFd8QRsR6MbQE2f6XFF
```

To inspect password-protected keys by specifying the `--password` option and password, you can run a command similar to the following:

```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very" --password "pencil laptop kitchen cutter"
```

If you specify the `--password` option and password in the command line, the command output _does not_ display the password used.

```text
Secret phrase `caution juice atom organ advance problem want pledge someone senior holiday very` is account:
  Secret seed:       0xdfc5d5d5235a37fdc907ee1cb720299f96aeb02f9c7c2fcad7ee8c7bfbd2a4db
  Public key (hex):  0xdef8f78b123475265815b65a7c55e105e1ab185f4969954f68d92b7bb67a1045
  Public key (SS58): 5H74SqH1iQCWh5Gumyghh1WJMcmM6TdBHYSK7mKVJbv9NuSK
  Account ID:        0xdef8f78b123475265815b65a7c55e105e1ab185f4969954f68d92b7bb67a1045
  SS58 Address:      5H74SqH1iQCWh5Gumyghh1WJMcmM6TdBHYSK7mKVJbv9NuSK
```

You can also inspect password-protected keys by adding `///` and the password to the secret phrase.
For example, you can run a command similar to the following:

```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very///pencil laptop kitchen cutter"
```

In this case, the command output displays the password used.
For example:

```text
Secret Key URI `caution juice atom organ advance problem want pledge someone senior holiday very///pencil laptop kitchen cutter` is account:
  Secret seed:       0xdfc5d5d5235a37fdc907ee1cb720299f96aeb02f9c7c2fcad7ee8c7bfbd2a4db
  Public key (hex):  0xdef8f78b123475265815b65a7c55e105e1ab185f4969954f68d92b7bb67a1045
  Public key (SS58): 5H74SqH1iQCWh5Gumyghh1WJMcmM6TdBHYSK7mKVJbv9NuSK
  Account ID:        0xdef8f78b123475265815b65a7c55e105e1ab185f4969954f68d92b7bb67a1045
  SS58 Address:      5H74SqH1iQCWh5Gumyghh1WJMcmM6TdBHYSK7mKVJbv9NuSK
```

## subkey inspect-node-key

Use the `subkey inspect-node-key` command to display the peer identifier for the node that corresponds with the node key in the specified file name.
Before using this command, you should have previously used the [`subkey generate-node-key`](#subkey-generate-node-key) command and saved the key to a file.

#### Basic usage

```text
subkey inspect-node-key [flags] [options] --file <file-name>
```

#### Flags

You can use the following optional flags with the `subkey inspect-node-key` command.

| Flag              | Description                   |
| ----------------- | ----------------------------- |
| `-h`, `--help`    | Displays usage information.   |
| `-V`, `--version` | Displays version information. |

#### Options

You can use the following command-line option with the `subkey inspect-node-key` command.

| Option | Description |
| ------ | ----------- |
| `-n, --network <network>` | Specifies the network address format to use. For example, `kusama` or `polkadot`. For a complete list of networks supported, see the online usage information. |

#### Arguments

You must specify the following required argument with the `subkey inspect-node-key` command.

| Argument | Description |
| -------- | ----------- |
| `--file <file-name>` | Specifies the file that contains the secret key generated for the peer-to-peer communication with a node. |

## subkey sign

Use the `subkey sign` command to sign a message by passing the message as standard input (`stdin`).
You can sign messages using your secret seed or secret phrase.

#### Basic usage

```text
subkey sign [flags] [options]
```

#### Flags

You can use the following optional flags with the `subkey sign` command.

| Flag | Description |
| ---- | ----------- |
| `-h`, `--help` | Displays usage information. |
| `--hex` | Indicates that the message you specify as standard input is a hex-encoded message. |
| `--password-interactive` | Enables you to enter the password for accessing the keystore interactively in the terminal. |
| `-V`, `--version` | Displays version information. |

#### Options

You can use the following command-line options with the `subkey sign` command.

| Option | Description |
| ------ | ----------- |
| `--keystore-path <path>` | Specifies a custom keystore path. |
| `--keystore-uri <keystore-uri>` | Specifies a custom URI to connect to for keystore services. |
| `--message <network>` | Specifies the message string to sign. |
| `--password <password>` | Specifies the password used by the keystore. This option enables you to append an extra secret to the seed. |
| `--password-filename <path>` | Specifies the name of a file that contains the password used by the keystore. |
| `--scheme <scheme>` | Specifies the cryptographic signature scheme for the key. Valid values are `Ecdsa`, `Ed25519`, `Sr25519`. The default scheme is `Sr25519`. |
| `--suri <secret-seed>` | Specifies the secret key URI you want to use to sign the message. You can specify the key using its secret phrase, secret seed (with derivation paths and password). If you specify a file name for the `--suri` option, the file content is used as the URI. If you omit this option, you are prompted for the URI. |

#### Examples

The following example uses the `echo` command to pipe a test message as input to the `subkey sign` command.
To sign a text message in a terminal, you can run a command similar to the following:

```bash
echo "test message" | subkey sign --suri 0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
```

The command output displays the signature for the message.
For example:

```text
f052504de653a5617c46eeb1daa73e2dbbf625b6bf8f16d9d8de6767bc40d91dfbd38c13207f8a03594221c9f68c00a158eb3120311b80ab2da563b82a995b86
```

To sign a hex-encoded message, run a command similar to the following:

```bash
subkey sign --hex --message 68656c6c6f2c20776f726c64 --suri 0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
```

The command output displays the signature for the message.
For example:

```text
9ae07defc0ddb752651836c25ac643fbdf9d45ba180ec6d09e4423ff6446487a52b609d69c06bd1c3ec09b3d06a43f019bacba12dc5a5697291c5e9faab13288
```

## subkey vanity

Use the `subkey vanity` command to create an address that contains a specified string pattern.
This command does not generate a secret phrase for the custom address.

#### Basic usage

```text
subkey vanity [flags] [options] --pattern <pattern>
```

#### Flags

You can use the following optional flags with the `subkey vanity` command.

| Flag              | Description                   |
| ----------------- | ----------------------------- |
| `-h`, `--help`    | Displays usage information.   |
| `-V`, `--version` | Displays version information. |

#### Options

You can use the following command-line options with the `subkey vanity` command.

| Option | Description |
| ------ | ----------- |
| `-n, --network <network>` | Specifies the network address format to use. For example, `kusama` or `polkadot`. For a complete list of networks supported, see the online usage information. |
| `--output-type <format>`  | Specifies the output format to use. Valid values are Json and Text. The default output format is Text. |
| `--scheme <scheme>` | Specifies the cryptographic signature scheme for the key. Valid values are `Ecdsa`, `Ed25519`, `Sr25519`. The default scheme is `Sr25519`. |

#### Arguments

You must specify the following required argument with the `subkey vanity` command.

| Argument | Description |
| -------- | ----------- |
| `--pattern <pattern>` | Specifies the string you want to include in the generated address. |

#### Examples

Depending on the pattern you specify, the `subkey vanity` command can take some time to search keystores and generate an address that contains the custom string.
In general, you should use as few characters as possible for the `--pattern` and use the `--network` option to specify the network where you want to use the custom address,

To generate an address that contains a specific string, you can run a command similar to the following:

```bash
subkey vanity --network kusama --pattern DUNE
```

The command displays output similar to the following:

```text
Generating key containing pattern 'DUNE'
100000 keys searched; best is 187/237 complete
200000 keys searched; best is 189/237 complete
300000 keys searched; best is 221/237 complete
400000 keys searched; best is 221/237 complete
500000 keys searched; best is 221/237 complete
600000 keys searched; best is 221/237 complete
best: 237 == top: 237
Secret Key URI `0x82737756075d15409053afd19a6b29ae2abeed96a3487d71d2af9b3eff19cbfa` is account:
  Secret seed:       0x82737756075d15409053afd19a6b29ae2abeed96a3487d71d2af9b3eff19cbfa
  Public key (hex):  0xe025cc93383436f61f067ff918ec632d0933c2d81da3bc1fbc27c9d33579bc40
  Account ID:        0xe025cc93383436f61f067ff918ec632d0933c2d81da3bc1fbc27c9d33579bc40
  Public key (SS58): HeDUNE7vd4cYtwHadXBWTgYrsKGQXZ5xFLVbgPVo71X1ccF
  SS58 Address:      HeDUNE7vd4cYtwHadXBWTgYrsKGQXZ5xFLVbgPVo71X1ccF
```

After the key pair is generated, the SS58 address and public key both contain the custom string `DUNE`.

## subkey verify

Use the `subkey verify` command to verify the signature for a message using a public or secret key.

#### Basic syntax

```text
subkey verify [flags] [options] <signature> <uri>
```

#### Flags

You can use the following optional flags with the `subkey verify` command.

| Flag | Description |
| ---- | ----------- |
| `-h`, `--help` | Displays usage information. |
| `--hex` | Indicates that the message you specify as standard input is a hex-encoded message. |
| `-V`, `--version` | Displays version information. |

#### Options

You can use the following command-line options with the `subkey verify` command.

| Option | Description |
| ------ | ----------- |
| `--message <message>` | Specifies the message to verify. |
| `--scheme <scheme>` | Specifies the cryptographic signature scheme for the key. Valid values are `Ecdsa`, `Ed25519`, `Sr25519`. The default scheme is `Sr25519`. |

#### Arguments

You must specify the following required argument with the `subkey verify` command.

| Argument | Description |
| -------- | ----------- |
| `<signature>` | Specifies the hex-encoded signature to verify. |
| `<uri>` | Specifies the public or secret key URI that you want to use to verify the message. If you specify a file name for the `uri`, the file content is used as the URI. If you omit this option, you are prompted for the URI. |

#### Examples

The following example uses the `echo` command to pipe a test message as input to the `subkey verify` command.

```bash
echo "test message" | subkey verify f052504de653a5617c46eeb1daa73e2dbbf625b6bf8f16d9d8de6767bc40d91dfbd38c13207f8a03594221c9f68c00a158eb3120311b80ab2da563b82a995b86 5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
```

If the message signature is verified, the command output confirms the signature,
For example:

```text
Signature verifies correctly.
```

To verify the signature for a hex-encoded message, run a command similar to the following:

```bash
subkey verify --hex --message 68656c6c6f2c20776f726c64 4e9d84c9d67241f916272c3f39cd145d847cfeed322b3a4fcba67e1113f8b21440396cb7624113c14af2cd76850fc8445ec538005d7d39ce664e5fb0d926a48f 5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
```

If the message signature is verified, the command output confirms the signature,
For example:

```text
Signature verifies correctly.
```

## Working with derived keys

In Substrate, hierarchical deterministic derived keys are classified as hard keys or as soft keys based on how they are derived.
For example, hard keys can only be derived using the parent **private key** and a derivation path.
The parent public key cannot be used to derive a hard key.

Soft keys can be derived using either the parent private key or the parent **public key** and a derivation path.
Because soft keys can be derived using the parent public key, they can be used to identify the parent key without exposing the parent seed.
You can derive either hard keys or soft keys by using different syntax in `subkey` commands.
You can then use the addresses associated with derived keys to sign messages with the same security as messages signed by their root key.

### Derive a hard key

To derive a hard child key pair, you add two slashes (`//`), a derivation path, and an index after the secret phrase associated with its parent key.
Because you derive child key pairs and addresses from keys that have been previously generated, you use the `subkey inspect` command.
For example:

```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very//derived-hard-key//0"
```

The command displays output similar to the following:

```text
Secret Key URI `caution juice atom organ advance problem want pledge someone senior holiday very//derived-hard-key//0` is account:
  Secret seed:       0x667fe31c1d1d8f00811aa0163001b5b3055b26f11e82ae17e28668d0e08ced51
  Public key (hex):  0xd61bbc562fc43d43d80a3372a25c52e4aa862bbfdbb4aa1a5ec86f042f787f24
  Account ID:        0xd61bbc562fc43d43d80a3372a25c52e4aa862bbfdbb4aa1a5ec86f042f787f24
  Public key (SS58): 5GuSLtVEbYgYT9Q78CX99RSSPuHjsAyAadwC1GmweDvTvFTZ
  SS58 Address:      5GuSLtVEbYgYT9Q78CX99RSSPuHjsAyAadwC1GmweDvTvFTZ
```

### Derive a soft key

To derive a soft child key pair from a parent private key, you add one slash (`/`), a derivation path, and an index after the secret phrase associated with the parent key.
Because you are deriving a new key pair and address from a key that has been previously generated, you use the `subkey inspect` command.
For example:

```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very/derived-soft-key/0"
```

The command displays output similar to the following:

```text
Secret Key URI `caution juice atom organ advance problem want pledge someone senior holiday very/derived-soft-key/0` is account:
  Secret seed:       n/a
  Public key (hex):  0x8826cc3730441dc4b67ea118997780db878ce7848c1548a9d36624ca39cf7c2c
  Account ID:        0x8826cc3730441dc4b67ea118997780db878ce7848c1548a9d36624ca39cf7c2c
  Public key (SS58): 5F9DtrPk3SaFs6U6S8HxnuJcoQ2jF8Wdt3ygwbbBnbVcsdiC
  SS58 Address:      5F9DtrPk3SaFs6U6S8HxnuJcoQ2jF8Wdt3ygwbbBnbVcsdiC
```

To derive a soft child key pair from a parent public key, you can use the public SS58 address instead of the secret phrase.
Because you are deriving a soft key, you use a single slash (`/`) to delimit the derivation path and index fields.
For example:

```bash
subkey inspect "5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR/derived-public/0"
```

The command displays output similar to the following:

```text
Public Key URI `5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR/derived-public/0` is account:
  Network ID/version: substrate
  Public key (hex):   0xee3792a82ba43fc503bcbdabd7d090df71496a43928e25f87843f1d9d40e8a14
  Account ID:         0xee3792a82ba43fc503bcbdabd7d090df71496a43928e25f87843f1d9d40e8a14
  Public key (SS58):  5HT3mAg8NnpgeZFUsM9aUYVdS5iq6ZWVUoNcTDiuqVvjkgKR
  SS58 Address:       5HT3mAg8NnpgeZFUsM9aUYVdS5iq6ZWVUoNcTDiuqVvjkgKR
```

If you use the same derivation path and index, the soft child key is the same whether you use the parent private key or parent public address.
If you change either the derivation path—for example, from `derived-soft-key` to `derived-public`—or the index—from `0` to `1`—you derive different child keys with different addresses.
For example:

```bash
subkey inspect "5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR/derived-soft-key/1"
```

The command displays output similar to the following:

```text
Public Key URI `5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR/derived-soft-key/1` is account:
  Network ID/version: substrate
  Public key (hex):   0x688d5a9761bc2705efd3ff0171a535e97de12aab59659177efae453873b18673
  Account ID:         0x688d5a9761bc2705efd3ff0171a535e97de12aab59659177efae453873b18673
  Public key (SS58):  5ERnpynLaQweDhrBQLe3vz8aWYodKYEeJ92xsbnpgG7GhHvo
  SS58 Address:       5ERnpynLaQweDhrBQLe3vz8aWYodKYEeJ92xsbnpgG7GhHvo
```

### Combine derivation paths and passwords

Note that the secret seed _is not_ password protected by default.
You can add a password as extra protection for your derived keys.
However, the key pair that's derived from a secret seed is not the same as the key pair derived when you use a password.
The same secret seed will derive different keys if you use a different derivation path or add a password.
If you use a password to protect your key pair, both the secret seed phrase and the password will be required to recover the key pair.

You can derive a soft key as a child of a hard key.
Doing so enables you to use the public address of the derived hard key—with an optional password—to derive new public addresses.
For example, the following command derives a hard key (`//derived-hard-key`) with a soft key leaf (`/0`):

```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very//derived-hard-key/0"
```

The command displays output similar to the following:

```text
Secret Key URI `caution juice atom organ advance problem want pledge someone senior holiday very//derived-hard-key/0` is account:
  Secret seed:       n/a
  Public key (hex):  0x525039c770a07a38d8dc066927ad1f0d2b2113f4bc890c4fd39a37d477d0d336
  Account ID:        0x525039c770a07a38d8dc066927ad1f0d2b2113f4bc890c4fd39a37d477d0d336
  Public key (SS58): 5DvdcfXQe2QcWHNZrUR5Bb2AJQ199BiNH5aHefE4kXSRP1VR
  SS58 Address:      5DvdcfXQe2QcWHNZrUR5Bb2AJQ199BiNH5aHefE4kXSRP1VR
```

To protect the derived hard key, you can add your password to the end of the secret phrase:

```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very//derived-hard-key/0///pencil laptop kitchen cutter"
```

The command displays output similar to the following:

```text
Secret Key URI `caution juice atom organ advance problem want pledge someone senior holiday very//derived-hard-key/0///pencil laptop kitchen cutter` is account:
  Secret seed:       n/a
  Public key (hex):  0x2efb74b4a21294f0031129a1d271c7be00171d207052af567fc76de03a81fe52
  Account ID:        0x2efb74b4a21294f0031129a1d271c7be00171d207052af567fc76de03a81fe52
  Public key (SS58): 5D8JkugWWMDmQ4h2yUuBLWwQXaBi2nBdiDmY4DR7hW76QmuW
  SS58 Address:      5D8JkugWWMDmQ4h2yUuBLWwQXaBi2nBdiDmY4DR7hW76QmuW
```

Notice that adding a password for the derived key generates a different public key for the same secret phrase.
You can use this password-protected hard key to derive a soft key using the public address of the hard key.
 a hidden seed, hard key derivation path, and a password.

```bash
subkey inspect "5D8JkugWWMDmQ4h2yUuBLWwQXaBi2nBdiDmY4DR7hW76QmuW/0"
```

The command displays output similar to the following:

```text
Public Key URI `5D8JkugWWMDmQ4h2yUuBLWwQXaBi2nBdiDmY4DR7hW76QmuW/0` is account:
  Network ID/version: substrate
  Public key (hex):   0xcaf1f5ec14b507b5c365c6528cc06de74a5615274694a0c895ed4109c0ff0d32
  Public key (SS58):  5GeoQa3nkeNmzZSfgBFuK3BkAggnTHcX3S1j94sffJYYphrP
  Account ID:         0xcaf1f5ec14b507b5c365c6528cc06de74a5615274694a0c895ed4109c0ff0d32
  SS58 Address:       5GeoQa3nkeNmzZSfgBFuK3BkAggnTHcX3S1j94sffJYYphrP
```

With this strategy for combining hard and soft keys, you can reveal a parent public address and soft derivation paths without revealing your secret phrase or password, retaining control of all derived addresses.

### Predefined accounts and keys

Substrate includes several predefined accounts that you can use for testing in a local development environment.
These predefined accounts are all derived from the same seed using a single secret phrase.
The secret phrase used to generate the keys for all of the predefined accounts consists of the following words:

```text
bottom drive obey lake curtain smoke basket hold race lonely fit walk
```

You can inspect the keys for the predefined account using the derivation path.
For example:

```bash
subkey inspect //Alice
```

The command

```text
Secret Key URI `//Alice` is account:
  Secret seed:       0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a
  Public key (hex):  0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
  Account ID:        0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
  Public key (SS58): 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
  SS58 Address:      5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

It is important to note that `//Alice` and `//alice` are different derivation paths and the secret phrase and derivation path for the predefined account is actually:

```text
bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice
```

You can run the following command to verify the keys match:

```bash
subkey inspect "bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice"
```

The command output displays the following:

```text
Secret Key URI `bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice` is account:
  Secret seed:       0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a
  Public key (hex):  0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
  Account ID:        0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
  Public key (SS58): 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
  SS58 Address:      5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

## Further resources

- [Subkey README](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/bin/utils/subkey).
- [PolkadotJS Apps UI](https://polkadot.js.org/apps/).
- [Cryptography explainer](https://wiki.polkadot.network/docs/en/learn-cryptography).
