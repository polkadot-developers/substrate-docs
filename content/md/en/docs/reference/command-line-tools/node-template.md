---
title: node-template
section: reference
keywords:
---

The `node-template` program provides a working Substrate node with FRAME system pallets and a subset of additional pallets for working with common blockchain functional operations.`
With its baseline of functional pallets, the `node-template` serves as a starter kit for building your own blockchain and developing a custom runtime.
You can use the `node-template` program to perform the following tasks:

## Basic command usage

The basic syntax for running `node-template` commands is:

```
node-template [subcommand] [FLAGS] [OPTIONS]
```

Depending on the subcommand you specify, additional arguments, options, and flags might apply or be required. 
To view usage information for a specific `node-template` subcommand, specify the subcommand and the `--help` flag. 
For example, to see usage information for `node-template key`, you can run the following command:

```
node-template key --help
```

### Flags

You can use the following optional flags with the `node-template` command.

| Flag   | Description
| ------ | -----------
| `--alice`  | Adds the session keys for the predefined `Alice` account to the local keystore. This flag is equivalent to running the node using `--name alice --validator` as command-line options.
| `--allow-private-ipv4` | Allows the node to connect to private IPv4 addresses (as specified in [RFC1918](https://tools.ietf.org/html/rfc1918)). This flag is enabled by default if the chain specifications for the node is identified as `local` or you start the node in development mode with the `--dev` flag.
| `--bob` | Adds the session keys for the predefined `Bob` account to the local keystore. This flag is equivalent to running the node using `--name bob --validator` as command-line options.
| `--charlie` | Adds the session keys for the predefined `Charlie` account to the local keystore. This flag is equivalent to running the node using `--name charlie --validator` as command-line options.
| `--dave` | Adds the session keys for the predefined `Dave` account to the local keystore. This flag is equivalent to running the node using `--name dave --validator` as command-line options.
| `--dev` | Starts the node in development mode in a fresh state. No state is persisted if you run the node using this flag.
| `--disable-log-color` | Disables the use of color in log messages.
| `--disable-log-reloading` | Disables log filter updates and reloading. By default, dynamic log filtering is enabled. However, the feature can affect performance. If you start the node with this flag, the `system_addLogFilter` and `system_resetLogFilter` remote procedure calls have no effect.
| `--discover-local`| Enables peer discovery on local networks. By default, this flag is `true` if you start the node using the `--dev` flag or if the chain specification is `Local` or `Development` and `false` otherwise.
| `--eve` | Adds the session keys for the predefined `Eve` account to the local keystore. This flag is equivalent to running the node using `--name eve --validator` as command-line options.
| `--ferdie` | Adds the session keys for the predefined `Ferdie` account to the local keystore. This flag is equivalent to running the node using `--name ferdie --validator` as command-line options.
| `--force-authoring` | Enables block authoring even if the node is offline.
| `-h`, `--help` | Displays usage information.
| `--ipfs-server` | Joins the IPFS network and serve transactions over bitswap protocol
| `--kademlia-disjoint-query-paths` | Requires iterative Kademlia distributed hash table (DHT) queries to use disjointed paths. This option increases resiliency in the presence of potentially adversarial nodes. See the S/Kademlia paper for more information on the high level design as well as its security improvements.
| `--light` | Runs the node in light client mode (experimental).
| `--no-grandpa` | Disables the GRANDPA voter if the node is running as a validator mode.If the node is not running as a validator, the option disables the GRANDPA observer.
| `--no-mdns` | Disables mDNS discovery. By default, the network uses mDNS to discover other nodes on the local network. This option disables discovery and is automatically applied if you start the node using the `--dev` option.
| `--no-private-ipv4` | Prevents connecting to private IPv4 addresses (as specified in [RFC1918](https://tools.ietf.org/html/rfc1918)), unless the address was passed with the `--reserved-nodes` or `--bootnodes` option. This setting is enabled by default for chains that are marked as "live" in their chain specifications.
| `--no-prometheus` | Disables the exposure of a Prometheus endpoint for receiving metrics. By default, metrics are exported to a Prometheus endpoint.
| `--no-telemetry` | Disables connecting to the Substrate telemetry server. Telemetry is enabled for global chains by default.
| `--one` | Provides a shortcut for specifying `--name One --validator` to add session keys for `One` to the keystore.
| `--password-interactive` | Enables you to specify the password for connecting to the keystore interactively in the terminal shell.
| `--prometheus-external` | Exposes the Prometheus exporter on all interfaces. The default is local.
| `--reserved-only` | Specifies whether to only synchronize the chain with reserved nodes. This option also disables automatic peer discovery. TCP connections might still be established with non-reserved nodes. In particular, if you are a validator, your node might still connect to other validator nodes and collator nodes regardless of whether they are defined as reserved nodes.
| `--rpc-external` | Listens to all RPC interfaces. Default is local. Note: not all RPC methods are safe to be exposed publicly. Use an RPC proxy server to filter out dangerous methods. More details: <https://github.com/paritytech/substrate/wiki/Public-RPC>. Use `--unsafe-rpc-external` to suppress the warning if you understand the risks.
| `--storage-chain` | Enables storage chain mode. If you set this option, each transaction is stored separately in the transaction database column and is only referenced by hash in the block body column.
| `--tmp` | Runs a temporary node. This option creates a temporary directory to store the blockchain configuration, including the node database, node key, and the keystore.
| `--two` | Provides a shortcut for specifying `--name Two --validator` to add session keys for `Two` to the keystore.
| `--unsafe-pruning` | Forces the node to start with unsafe pruning settings. When running as a validator, it is highly recommended to disable state pruning (that is, archive) which is the default. The node will refuse to start as a validator if pruning is enabled unless this option is set.
| `--unsafe-rpc-external` | Listens to all RPC interfaces. This option is the same as `--rpc-external`.
| `--unsafe-ws-external` | Listens to all Websocket interfaces. This option is the same as `--ws-external` but doesn't warn you about it.
| `--validator` | Starts the node with the authority role and enables it to actively participate in any consensus task that it can (for example, depending on availability of local keys).
| `-V`, `--version` | Displays version information.
| `--ws-external` | Listens to all Websocket interfaces. By default, the node only listens locally. Keep in mind that not all RPC methods are safe to be exposed publicly. You can use an RPC proxy server to filter out dangerous methods. You can use `--unsafe-ws-external` to suppress the warning if you understand the risks.

### Options

You can use the following options with the `node-template` command.

| Option | Description
| ------ | -----------
| `-d`, `--base-path <path>` | Specifies a custom base path.
| `--bootnodes <node-identifier>... ` | Specifies a list of boot nodes identifiers for peer-to-peer communication.
| `--chain <chain-specification>` | Specifies the chain specification to use. You can set this option using a predefined chain specification name, such as `dev`, `local`, or `staging`or you can specify the path to a file that contains the chain specification, for example, the chain specification generated by using the `build-spec` subcommand.
| `--database <database>` | Selects the database backend to use. Valid values are `rocksdb` or `paritydb-experimental`.
| `--db-cache <MiB>` | Limits how much memory the database cache can use.
| `--offchain-worker <execution>` | Determines when off-chain worker processes are executed. By default, off-chain workers are only enabled for nodes that are authoring new blocks and the off-chain worker is executing during block validation. Valid values are `Always`, `Never`, or `WhenValidating`.
| `--execution <strategy>` | Determines the execution strategy used by all execution contexts. Valid values are `Native`, `Wasm`, `Both` or `NativeElseWasm`.
| `--execution-block-construction <strategy>` | Specifies the type of execution used when calling into the runtime to construct blocks. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-import-block <strategy>` | Specifies the type of execution used when calling into the runtime to import blocks (including locally-authored blocks). Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-offchain-worker <strategy>` | Speficies the type of execution used when calling into the runtime to use an off-chain worker. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-other <strategy>` | Specifies the type of execution used when calling into the runtime while not syncing, importing, or constructing blocks. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-syncing <strategy>` | Specifies the type of execution used when calling into the runtime to import blocks as part of an initial synchronization. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--in-peers <count>` | Specifies the maximum number of incoming connections to accept. The default is 25 peers.
| `--enable-offchain-indexing <database>` | Enables the off-chain indexing API. The off-chain indexing API enables the runtime to write directly to a off-chain worker database during block import.
| `--ipc-path <path>` | Specifies the path to send inter-process communication (IPC)to a remote procedure call (RPC) server.
| `--keep-blocks <count>` | Specifies the number of finalized blocks to keep in the database. The default is to keep all blocks.
| `--keystore-path <path>` | Specifies the path to a custom keystore.
| `--keystore-uri <keystore-uri>` | Specifies a custom URI to connect to for keystore services.
| `--listen-addr <listen-address>... ` | Specifies the address for the node to listen on. By default, if you start a node using the `--validator` option, the addresses `/ip4/0.0.0.0/tcp/<port>` and `/ip6/[::]/tcp/<port>` are used. Otherwise, the `/ip4/0.0.0.0/tcp/<port>/ws` and `/ip6/[::]/tcp/<port>/ws` addresses are used.
| `-l`, `--log <log-pattern>...` | Sets a custom logging filter. The syntax to use is `<log-target>=<level>`, for example `-lsync=debug`. The valid log levels from least to most verbose are `error`, `warn`, `info`, `debug`, and `trace`. By default, all targets log `info` level messages. You can set the global log level with `-l<level>`.
| `--max-parallel-downloads <count>` | Specifies the maximum number of peers from which to ask for the same blocks in parallel. This option allows nodes to download announced blocks from multiple peers. You can decrease the count to reduce traffic, but risk increasing latency. The default is 5 parallel downloads.
| `--max-runtime-instances <max-runtime-instances>` | Specific the maximum size of the instances cache for each runtime. The default value is 8 and values higher than 256 are ignored.
| `--name <name>` | Specifies the human-readable name for this node.The node name is reported to the telemetry server, if enabled.
| `--node-key <key>` | Specifies the secret key to use for `libp2p` networking. The value is a string that is parsed based on the `--node-key-type`. For example, if the node key type is `ed25519`, the node key is parsed as a hex-encoded Ed25519 32-byte secret key (64 hex characters). The value of this option takes precedence over `--node-key-file`. Note that secrets provided as command-line arguments are easily exposed. You should only use this option for development and testing. To use an externally managed secret key, use the `--node-key-file` option.
| `--node-key-file <file>` | Specifies the file that contains the secret key for a node to use for `libp2p` networking. The contents of the file are parsed based on the `--node-key-type`. For example, if the node key type is `ed25519`, the file must contain an unencoded 32-byte or hex-encoded Ed25519 secret key. If the file does not exist, it is created with a newly generated secret key of the type you specify using the `--node-key-type` option.
| `--node-key-type <type>` | Specifies the type of secret key to use for peer-to-peer (`libp2p`) networking. You can specify the secret key on the command-line using the `--node-key` option, read the key from a file using the `--node-key-file` option, or read the key from a file specifies in the chain-specific `config` directory inside the base directory specified by the `--base-dir` option. If this file does not exist, it is created with a newly generated secret key of the chosen type. The node's secret key determines the public key—the peer identifier—that is used to communicate with the node using the `libp2p` library. The default type is Ed25519.
| `--out-peers <count>` | Specifies the maximum number of outgoing connections to maintain. The default is 25.
| `--password <password>` | Specifies the password to use for the keystore.
| `--password-filename <path>` | Specifies the path to a file that contains the password used for the keystore.
| `--pool-kbytes <count>` | Specifies the mnaximum number of kilobytes for all transactions stored in the transaction pool. The default is 20480 KB.
| `--pool-limit <count>` | Specifies the maximum number of transactions that can be in the transaction pool. The default is 8192 transactions.
| `--port <port>` | Specifies the TCP port to use for peer-to-peer communication.
| `--prometheus-port <port>` | Specifies the TCP port to use for the Prometheus exporter service.
| `--pruning <pruning-mode>` | Specifies the maximum number of block states to keep or `archive` to keep all block states. If the node is running as a validator, the default is to keep all block states. If the node does not run as a validator, only state for the last 256 blocks is kept.
| `--public-addr <public-address>...` | Specifies the public address that other nodes can use to connect to the node. You can use this option to connect to a node through a proxy.
| `--reserved-nodes <address>...` | Specifies a list of reserved node addresses.
| `--rpc-cors <origins>` | Specifies the browser Origins allowed to access the HTTP and WS RPC servers. You can specify this option as a comma-separated list of origins using `protocol://domain` syntax,`null`, or `all`. A value of `all` disables origin validation. By default, `localhost` and `https://polkadot.js.org` origins are allowed. If you start the node  with the `--dev` option, all origins are allowed by default.
| `--rpc-http-threads <count>` | Specifies the size of the RPC HTTP server thread pool.
| `--rpc-max-payload <rpc-max-payload>` | Sets the the maximum RPC payload size for both requests and responses (both HTTP and web socket), in megabytes. The default is 15 MiB.
| `--rpc-methods <method-set>` | Specifies the RPC methods to expose. Valid values are `Unsafe` to expose every RPC method, `Safe` to only exposes a safe subset of RPC methods, denying unsafe RPC methods, or `Auto` to expose `Safe` RPC methods if RPC is served externally, for example if you run the node using `--rpc-external` or `--rpc-external`, or expose `Unsafe` RPC methods if RPC is not served externally. The default is `Auto`.  
| `--rpc-port <port>` | Specifies the TCP port to use for the HTTP RPC server.
| `--state-cache-size <bytes>` | Specifies the state cache size. The default is 67108864 bytes.
| `--sync <sync-mode>` | Specifies the blockchain syncing mode Valid values are `Full` to download and validate the full blockchain history, `Fast` to download blocks and the latest state only, or `FastUnsafe`to download the latest state but skip downloading state proofs. The default is `Full`.
| `--telemetry-url <url verbosity>...` | Specifies the URL of the telemetry server to connect to. You can pass this flag multiple times to specify multiple telemetry endpoints. Verbosity levels range from 0-9, with 0 denoting the least verbose. Use the following format to specify the URL followed the verbosity option is `--telemetry-url 'wss://foo/bar 0'`.
| `--tracing-receiver <receiver>` | Specifies the receiver to process tracing messages. The default is Log.
| `--tracing-targets <targets>` | Sets a custom profiling filter. Syntax is the same as for logging: `<target>=<level>`.
| `--wasm-execution <method>` | Specifies the method for executing Wasm runtime code. Valid values are `interpreted`, or `compiled`. The default is `Compiled`.
| `--wasm-runtime-overrides <path>` | Specifies the path where local WASM runtimes are stored. These runtimes will override on-chain runtimes when the version matches.
| `--ws-max-connections <count>` | Specifies the maximum number of WS RPC server connections.
| `--ws-port <port>` | Specifies the TCP port to use for the  WebSockets RPC server.

### Subcommands

You can use the following subcommands with the `node-template` command. 
For reference information and examples that illustrate using these subcommands, select an appropriate command.

| Command | Description
| ------- | -----------
| [`benchmark`](#node-benchmark) | Benchmarks runtime pallets.
| [`build-spec`](#node-buildspec) | Builds a chain specification.
| [`check-block`](#node-checkblock) | Validates blocks.
| [`export-blocks`](#node-exportblock) | Exports blocks.
| [`export-state`](#node-exportstate) | Exports the state of a given block into a chain specification.
| [`help`](#node-help) | Displays usage information for `node-template` or for a specified subcommand.
| [`import-blocks`](#node-importblock) | Imports blocks.
| [`key`](#node-key) | Provides local key management utilities.
| [`purge-chain`](#node-purge) | Removes all chain data.
| [`revert`]#node-revert() | Reverts the chain to a previous state.

## benchmark <a name="node-benchmark"></a>

Use the `node-template benchmark` command to benchmark runtime pallets.

#### Basic usage

```
node-template benchmark [FLAGS] [OPTIONS] --extrinsic <extrinsic> --pallet <pallet>
```

#### Flags

You can use the following optional flags with the `node-template benchmark` command.

| Flag   | Description
| ------ | -----------
| `--detailed-log-output` | Enables detailed log output, including the log target name, the log level, and the thread name. This option is used automatically if you enable a logging level any higher level than `info`.
| `--dev` | Starts the node in development mode. Using this flag also enables the `--chain=dev`, `--force-authoring`, `--rpc-cors=all`, `--alice`, and `--tmp` flags by default.
| `--disable-log-color` | Disables log color output.
| `--enable-log-reloading` | Enables the log filter to be dynamically updated and reloaded. Note that this option can significantly decrease performance. Setting this option does not affect the `system_addLogFilter` and `system_resetLogFilter` RPC methods.
| `--extra` | Displays and runs extra benchmarks that would otherwise not be needed for weight construction.
| `-h`, `--help` | Displays usage information.
| `--json` |  Formats benchmark data as raw JSON output a file
| `--json-file=<file-name>` | Saves benchmark data as JSON output in a file. This option replaces the `--raw` command-line option.
| `--list` | Lists the benchmarks that match your query rather than running them. When nothing is provided, we list all benchmarks.
| `--no-median-slopes` | Disable the median-slopes linear regression analysis.
| `--no-min-squares` | Disables the min-squares linear regression analysis.
| `--no-storage-info` | Disables the display of storage information in the analysis output. This is independent of the storage info appearing in the *output file*. Use a Handlebar template for that purpose.
| `--no-verify` | Disables verification logic when running benchmarks.
| `--record-proof` | Estimates PoV size.
| `-V`, `--version` | Displays version information.

#### Options

You can use the following command-line options with the `node-template benchmark` command.

| Option   | Description
| -------- | -----------
| `-d`, `--base-path <path>` | Specifies a custom base path.
| `--chain <chain-specification>` | Specifies the chain specification to use. You can set this option using a predefined chain specification name, such as `dev`, `local`, or `staging`or you can specify the path to a file that contains the chain specification, for example, the chain specification generated by using the `build-spec` subcommand.
| `--db-cache <MiB>` | Limits how much memory the database cache can use. The default is 128 MiB.
| `--offchain-worker <execution>` | Determines when off-chain 
| `--execution <strategy>` | Determines the execution strategy used by all execution contexts. Valid values are `Native`, `Wasm`, `Both` or `NativeElseWasm`.
| `--external-repeat` <count> | Specifies the number of times to repeat the execution of a benchmark for the client. Note that this option might give slower results, but maximizes Wasm memory. The default is one execution.
| `-e`, `--extrinsic <extrinsic>` | Specifies an extrinsic inside the pallet to benchmark, or `*` to benchmark all extrinsic calls in a pallet.
| `--header <header>` | Adds a header file to your outputted benchmarks.
| `--heap-pages <heap-pages>` | Sets the heap pages while running benchmarks. If not set, the default value from the client is used.
| `--high <highest-range-values>...`  | Indicates highest values for each of the component ranges.
| `-l`, `--log <log-pattern>...` | Sets a custom logging filter. The syntax to use is `<log-target>=<level>`, for example `-lsync=debug`. The valid log levels from least to most verbose are `error`, `warn`, `info`, `debug`, and `trace`. By default, all targets log `info` level messages. You can set the global log level with `-l<level>`.
| `--low <lowest-range-values>...` | Indicates lowest values for each of the component ranges.
| `--output <output>` | Outputs the benchmarks to a Rust file at the given path.
| `--output-analysis <analysis-type> ` | Specifies the analysis function to use when outputting benchmarks: Valid vales are `min-squares`, `median-slopes`, or `max`. The default is the `min-squares` analysis. For more information about benchmarking analysis, see [Benchmark](/main-docs/test/benchmark/).
| `-p`, `--pallet <pallet>` | Specifies the FRAME pallet to benchmark, or `*` to benchmark all pallets. If you benchmark all pallets, you must also specify `--extrinsic *` to benchmark all extrinsic calls.
| `-r`, `--repeat <repeat>` | Specifies the number of times to repeat the execution of a benchmark from within the Wasm binary. The default is one execution.
| `-s`, `--steps <steps>` | Specifies how many samples to take across the variable components. The default is one sample.
| `--template <template>` | Specifies the path to a Handlebars template file used for outputting benchmark results.
| `--tracing-receiver <receiver>` | Specifies the receiver to process tracing messages. The default is Log.
| `--tracing-targets <targets>` | Sets a custom profiling filter. Syntax is the same as for logging: `<target>=<level>`.
| `--wasm-execution <method>` | Specifies the method for executing Wasm runtime code. Valid values are `interpreted`, or `compiled`. The default is `Compiled`.

## build-spec <a name="node-buildspec"></a>


## check-block <a name="node-checkblock"></a>


## export-blocks <a name="node-exportblock"></a>


## export-state <a name="node-exportstate"></a>


## help <a name="node-help"></a>


## import-blocks <a name="node-importblock"></a>


## key <a name="node-key"></a>


## purge-chain <a name="node-purge"></a>


## revert <a name="node-revert"></a>
