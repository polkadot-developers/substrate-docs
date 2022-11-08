---
title: node-template
description: Command-line reference information for the node-template.
keywords:
---

The `node-template` program provides a working Substrate node with FRAME system pallets and a subset of additional pallets for working with common blockchain functional operations.
With its baseline of functional pallets, the `node-template` serves as a starter kit for building your own blockchain and developing a custom runtime.
You can use the `node-template` program to start a Substrate node and to perform the tasks listed in [Subcommands](#subcommands).

## Basic command usage

The basic syntax for running `node-template` commands is:

```shell
node-template [subcommand] [flags] [options]
```

Depending on the subcommand you specify, additional arguments, options, and flags might apply or be required.
To view usage information for a specific `node-template` subcommand, specify the subcommand and the `--help` flag.
For example, to see usage information for `node-template key`, you can run the following command:

```shell
node-template key --help
```

### Flags

You can use the following optional flags with the `node-template` command.

| Flag   | Description
| ------ | -----------
| `--alice`  | Adds the session keys for the predefined `Alice` account to the local keystore. This flag is equivalent to running the node using `--name alice --validator` as command-line options.
| `--allow-private-ipv4` | Allows the node to connect to private IPv4 addresses. This flag is enabled by default if the chain specifications for the node is identified as `local` or you start the node in development mode with the `--dev` flag.
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
| `--no-private-ipv4` | Prevents connecting to private IPv4 addresses, unless the address was passed with the `--reserved-nodes` or `--bootnodes` option. This setting is enabled by default for chains that are marked as "live" in their chain specifications.
| `--no-prometheus` | Disables the exposure of a Prometheus endpoint for receiving metrics. By default, metrics are exported to a Prometheus endpoint.
| `--no-telemetry` | Disables connecting to the Substrate telemetry server. Telemetry is enabled for global chains by default.
| `--one` | Provides a shortcut for specifying `--name One --validator` to add session keys for `One` to the keystore.
| `--password-interactive` | Enables you to specify the password for connecting to the keystore interactively in the terminal shell.
| `--prometheus-external` | Exposes the Prometheus exporter on all interfaces. The default is local.
| `--reserved-only` | Specifies whether to only synchronize the chain with reserved nodes. This option also disables automatic peer discovery. TCP connections might still be established with non-reserved nodes. In particular, if you are a validator, your node might still connect to other validator nodes and collator nodes regardless of whether they are defined as reserved nodes.
| `--rpc-external` | Listens to all RPC interfaces. Default is local. Note: not all RPC methods are safe to be exposed publicly. Use an RPC proxy server to filter out dangerous methods. More details: <https://docs.substrate.io/build/custom-rpc/#rpc-types>. Use `--unsafe-rpc-external` to suppress the warning if you understand the risks.
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
| `--bootnodes <node-identifier>...` | Specifies a list of boot nodes identifiers for peer-to-peer communication.
| `--chain <chain-specification>` | Specifies the chain specification to use. You can set this option using a predefined chain specification name, such as `dev`, `local`, or `staging`or you can specify the path to a file that contains the chain specification, for example, the chain specification generated by using the `build-spec` subcommand.
| `--database <database>` | Selects the database backend to use. Valid values are `rocksdb`, `paritydb-experimental`, or `auto`.
| `--db-cache <MiB>` | Limits how much memory the database cache can use.
| `--offchain-worker <execution>` | Determines when offchain worker processes are executed. By default, offchain workers are only enabled for nodes that are authoring new blocks and the offchain worker is executed during block validation. Valid values are `Always`, `Never`, or `WhenValidating`.
| `--execution <strategy>` | Determines the execution strategy used by all execution contexts. Valid values are `Native`, `Wasm`, `Both` or `NativeElseWasm`.
| `--execution-block-construction <strategy>` | Specifies the type of execution used when calling into the runtime to construct blocks. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-import-block <strategy>` | Specifies the type of execution used when calling into the runtime to import blocks (including locally-authored blocks). Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-offchain-worker <strategy>` | Specifies the type of execution used when calling into the runtime to use an offchain worker. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-other <strategy>` | Specifies the type of execution used when calling into the runtime while not syncing, importing, or constructing blocks. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-syncing <strategy>` | Specifies the type of execution used when calling into the runtime to import blocks as part of an initial synchronization. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--in-peers <count>` | Specifies the maximum number of incoming connections to accept. The default is 25 peers.
| `--enable-offchain-indexing <database>` | Enables the offchain indexing API. The offchain indexing API enables the runtime to write directly to a offchain worker database during block import.
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
| `--pool-kbytes <count>` | Specifies the maximum number of kilobytes for all transactions stored in the transaction pool. The default is 20480 KB.
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
| `--wasm-runtime-overrides <path>` | Specifies the path where local WASM runtimes are stored. These runtimes override on-chain runtimes when the version matches.
| `--ws-max-connections <count>` | Specifies the maximum number of WS RPC server connections.
| `--ws-port <port>` | Specifies the TCP port to use for the WebSockets RPC server.

### Subcommands

You can use the following subcommands with the `node-template` command.
For reference information and examples that illustrate using these subcommands, select an appropriate command.

| Command | Description
| ------- | -----------
| `benchmark` | Benchmarks runtime pallets.
| `build-spec` | Builds a chain specification.
| `check-block` | Validates blocks.
| `export-blocks` | Exports blocks.
| `export-state` | Exports the state of a given block into a chain specification.
| `help` | Displays usage information for `node-template` or for a specified subcommand.
| `import-blocks` | Imports blocks.
| `key` | Provides local key management utilities.
| `purge-chain` | Removes all chain data.
| `revert` | Reverts the chain to a previous state.

## benchmark

Use the `node-template benchmark` command to analyze the resources required to execute the transactions in extrinsic calls you have configured in runtime pallets.
You can analyze individual extrinsic calls in specific pallets or all extrinsic calls in all pallets.
With the `benchmark` subcommand, you can use additional command-line options to test different execution scenarios and compare the results.

Note that you must compile the node with benchmarking enabled to use all subcommands of `node-template benchmark`.
To compile the node with benchmarking features enabled, run the following command:

```shell
cargo build --package node-template --release --features runtime-benchmarks
```

#### Basic command usage

```shell
node-template benchmark [subcommand] [flags] [options]
```

Depending on the subcommand you specify, additional arguments, options, and flags might apply or be required.
To view usage information for a specific `benchmark` subcommand, specify the subcommand and the `--help` flag.
For example, to see usage information for `benchmark pallet`, you can run the following command:

```shell
node-template benchmark pallet --help
```
#### Subcommands

You can use the following subcommands with the `node-template benchmark` command.

| Command | Description
| ------- | -----------
| `block` | Benchmarks the execution time of historic blocks.
| `help` | Displays usage information for `node-template benchmark` or for a specified subcommand.
| `overhead` | Benchmarks the execution overhead per-block and per-extrinsic.
| `pallet` | Benchmarks the extrinsic weight of FRAME pallets.
| `storage` | Benchmarks the storage speed of a chain snapshot.

#### Flags

You can use the following optional flags with the `node-template benchmark` command.

| Flag   | Description
| ------ | -----------
| `-h`, `--help` | Displays usage information.
| `-V`, `--version` | Displays version information.

#### Options

You can use all of the common node-template command-line options in combination with `node-template benchmark` subcommands.
For example, you can use `--base-path <path>` to specify a custom directory for blockchain data and `--chain <chain-specification>` to specify the chain specification to use with any `benchmark` subcommand.

However, there are many command-line options that are specifically for performing benchmarking tasks.
For example, the `node-template benchmark block` subcommand supports `--from` and `--to` command-line options for specifying the blocks to analyze.

Because benchmarking FRAME pallets represents the most common benchmarking task, the `node-template benchmark pallet` subcommand supports the most task-specific command-line options. 
For example, you can use the following options with the `node-template benchmark pallet` subcommand.

| Option | Description
| ------ | -----------
| `--external-repeat` <count> | Specifies the number of times to repeat the execution of a benchmark for the client. Note that this option might give slower results, but maximizes Wasm memory. The default is one execution.
| `--extra` | Displays and runs extra benchmarks that would otherwise not be needed for weight construction.
| `-e`, `--extrinsic <extrinsic>` | Specifies an individual function in the pallet to benchmark, or `*` to benchmark all function calls in a pallet.
| `--header <header>` | Adds a header file to your benchmark output.
| `--heap-pages <heap-pages>` | Sets the heap pages while running benchmarks. If not set, the default value from the node is used.
| `--high <highest-range-values>...` | Indicates highest values for each of the component ranges.
| `--list` | Lists all currently defined benchmarks without running them.
| `--low <lowest-range-values>...` | Indicates lowest values for each of the component ranges.
| `--no-median-slopes` | Disables the median-slopes linear regression analysis.
| `--no-min-squares` | Disables the min-squares linear regression analysis.
| `--no-storage-info` | Disables the display of storage information in the analysis output. This is independent of the storage information appearing in the *output file*. Use a Handlebar template for that purpose.
| `--no-verify` | Disables verification logic when running benchmarks.
| `--output <output>` | Outputs the benchmarks to a Rust file at the given path.
| `--output-analysis <analysis-type> ` | Specifies the analysis function to use in the benchmark output. Valid vales are `min-squares`, `median-slopes`, or `max`. The default is the `min-squares` analysis. For more information about benchmarking analysis, see [Benchmark](/test/benchmark/).
| `-p`, `--pallet <pallet>` | Specifies the FRAME pallet to benchmark, or `*` to benchmark all pallets. If you benchmark all pallets, you must also specify `--extrinsic *` to benchmark all extrinsic calls.
| `--record-proof` | Estimates the proof-of-validation (PoV) size.
| `-r`, `--repeat <repeat>` | Specifies the number of times to repeat the execution of a benchmark from within the WebAssembly binary. The default is one execution.
| `-s`, `--steps <steps>` | Specifies how many samples to take across the variable components. The default is one sample.
| `--template <template>` | Specifies the path to a Handlebars template file used for outputting benchmark results.

For examples of different benchmarking subcommands and the related command-line options, see [Benchmarking examples](#benchmarking-examples).

#### Benchmarking examples

After you have compiled the runtime with benchmarking enabled, you can run a command similar to the following to benchmark all of the function calls in all of the pallets that have runtime-benchmarking configured:

```shell
./target/release/node-template benchmark pallet \
    --chain dev \
    --extrinsic "*" \
    --pallet "*" \
    --output pallets/weights.rs
```

With this command, each function call is executed once with a single value and the resulting weight is recorded in the `weights.rs` file.

Depending on the function you want to benchmark, you can add the `--steps` and `--repeat` command-line options to execute the call multiple times with different values.
For example, the following command executes the `do_something` function in the `pallet_template` and calls the function 20 times to take 10 data points:

```shell
./target/release/node-template benchmark pallet \
    --chain dev \
    --extrinsic do_something \
    --pallet pallet_template \
    --steps 10 \
    --repeat 20 \
    --list
```

With the `--list` option, the command displays the following output:

```shell
pallet, benchmark
pallet_template, do_something
```

With the `--steps` and `--repeat` command-line options, the command displays the following benchmarking results:

```shell
Pallet: "pallet_template", Extrinsic: "do_something", Lowest values: [], Highest values: [], Steps: 10, Repeat: 20
Raw Storage Info
========
Storage: TemplateModule Something (r:0 w:1)

Median Slopes Analysis
========
-- Extrinsic Time --

Model:
Time ~=       12
    + s        0
              µs

Reads = 0 + (0 * s)
Writes = 1 + (0 * s)

Min Squares Analysis
========
-- Extrinsic Time --

Data points distribution:
    s   mean µs  sigma µs       %
    0      12.4     0.489    3.9%
   10      12.1       0.3    2.4%
   20      12.1       0.3    2.4%
   30      11.8       0.4    3.3%
   40        12         0    0.0%
   50      11.9       0.3    2.5%
   60        12         0    0.0%
   70      12.2       0.4    3.2%
   80        12         0    0.0%
   90        12         0    0.0%
  100        12         0    0.0%

Quality and confidence:
param     error
s             0

Model:
Time ~=    12.13
    + s        0
              µs

Reads = 0 + (0 * s)
Writes = 1 + (0 * s)
```

To measure the average, median, minimum, and maximum execution time per-block and per-extrinsic, you can run the `node-template benchmark overhead` subcommand:

```shell
./target/release/node-template benchmark overhead
```

The command displays output similar to the following:

```shell
Running 10 warmups...    
Executing block 100 times    
Per-block execution overhead [ns]:
	Total: 81779519
	Min: 695173, Max: 1522917
	Average: 817795, Median: 763360, Stddev: 160759.2
	Percentiles 99th, 95th, 75th: 1443343, 1263935, 814356    
	Writing weights to "block_weights.rs"    
Running 10 warmups...    
Executing block 100 times    
Building block, this takes some time...    
Extrinsics per block: 12000    
Running 10 warmups...    
Executing block 100 times
Per-extrinsic execution overhead [ns]:
	Total: 8955542
	Min: 85950, Max: 97448
	Average: 89555, Median: 88348, Stddev: 2713.05
	Percentiles 99th, 95th, 75th: 97247, 95040, 91733    
	Writing weights to "extrinsic_weights.rs"
```

By default, the command executes the benchmark 100 times, generates results, and writes the output to the `block_weights.rs` and `extrinsics_weights.rs` files.
You can use command-line options to adjust the calculated weight by adding units or by multiplying the average execution time by some factor.

To measure the storage execution time for the Substrate development chain specification, you can run the following command:

```shell
./target/release/node-template benchmark storage --state-version 1
```

The command displays output similar to the following:

```shell
Warmup round 1/1    
Preparing keys from block BlockId::Number(0)    
Reading 36 keys    
Time summary [ns]:
	Total: 478367
	Min: 8889, Max: 32258
	Average: 13287, Median: 12580, Stddev: 4189.73
	Percentiles 99th, 95th, 75th: 32258, 21863, 14563
Value size summary:
	Total: 157217
	Min: 1, Max: 155944
	Average: 4367, Median: 16, Stddev: 25621.19
	Percentiles 99th, 95th, 75th: 155944, 82, 80    
Warmup round 1/1    
Preparing keys from block BlockId::Number(0)    
Writing 36 keys    
Time summary [ns]:
	Total: 1877401
	Min: 13476, Max: 665226
	Average: 52150, Median: 25740, Stddev: 111805.24
	Percentiles 99th, 95th, 75th: 665226, 252697, 30427
Value size summary:
	Total: 157217
	Min: 1, Max: 155944
	Average: 4367, Median: 16, Stddev: 25621.19
	Percentiles 99th, 95th, 75th: 155944, 82, 80    
Writing weights to "rocksdb_weights.rs"
```

To get benchmarking information for the `paritydb` database instead of the default `rocksdb` database, use the `--db paritydb` command-line option.
TO get storage benchmarking information for Polkadot or any other real chain snapshot, use the command-line option `--state-version 0`. 
For more information about using the benchmark storage subcommand, see [benchmark storage command](https://github.com/paritytech/substrate/tree/master/utils/frame/benchmarking-cli/src/storage#the-benchmark-storage-command).

For more information about how to add benchmarking to the runtime, see [Benchmark](/test/benchmark/) and [Add benchmarks](/reference/how-to-guides/weights/add-benchmarks/).

## build-spec

Use the `node-template build-spec` command to create a chain specification file for your runtime.

#### Basic command usage

```shell
node-template build-spec [flags] [options]
```

#### Flags

You can use the following optional flags with the `node-template build-spec` command.

| Flag   | Description
| ------ | -----------
| `--detailed-log-output` | Enables detailed log output, including the log target name, the log level, and the thread name. This option is used automatically if you enable a logging level any higher level than `info`.
| `--dev` | Starts the node in development mode. Using this flag also enables the `--chain=dev`, `--force-authoring`, `--rpc-cors=all`, `--alice`, and `--tmp` flags by default.
| `--disable-default-bootnode` | Disables adding the default boot node to the specification. By default, the `/ip4/127.0.0.1/tcp/30333/p2p/NODE_PEER_ID` boot node is added to the specification when no boot node exists.
| `--disable-log-color` | Disables log color output.
| `--enable-log-reloading` | Enables the log filter to be dynamically updated and reloaded. Note that this option can significantly decrease performance. Setting this option does not affect the `system_addLogFilter` and `system_resetLogFilter` RPC methods.
| `-h`, `--help` | Displays usage information.
| `--raw` |  Formats the chain specification as raw genesis storage output.
| `-V`, `--version` | Displays version information.

#### Options

You can use the following command-line options with the `node-template build-spec` command.

| Option   | Description
| -------- | -----------
| `-d`, `--base-path <path>` | Specifies a custom base path.
| `--chain <chain-specification>` | Specifies the chain specification to use. You can set this option using a predefined chain specification name, such as `dev`, `local`, or `staging`or you can specify the path to a file that contains the chain specification, for example, the chain specification generated by using the `build-spec` subcommand.
| `-l`, `--log <log-pattern>...` | Sets a custom logging filter. The syntax to use is `<log-target>=<level>`, for example `-lsync=debug`. The valid log levels from least to most verbose are `error`, `warn`, `info`, `debug`, and `trace`. By default, all targets log `info` level messages. You can set the global log level with `-l<level>`.
| `--node-key <key>` | Specifies the secret key to use for `libp2p` networking. The value is a string that is parsed based on the `--node-key-type`. For example, if the node key type is `ed25519`, the node key is parsed as a hex-encoded Ed25519 32-byte secret key (64 hex characters). The value of this option takes precedence over `--node-key-file`. Note that secrets provided as command-line arguments are easily exposed. You should only use this option for development and testing. To use an externally managed secret key, use the `--node-key-file` option.
| `--node-key-file <file>` | Specifies the file that contains the secret key for a node to use for `libp2p` networking. The contents of the file are parsed based on the `--node-key-type`. For example, if the node key type is `ed25519`, the file must contain an unencoded 32-byte or hex-encoded Ed25519 secret key. If the file does not exist, it is created with a newly generated secret key of the type you specify using the `--node-key-type` option.
| `--node-key-type <type>` | Specifies the type of secret key to use for peer-to-peer (`libp2p`) networking. You can specify the secret key on the command-line using the `--node-key` option, read the key from a file using the `--node-key-file` option, or read the key from a file specified in the chain-specific `config` directory inside the base directory specified by the `--base-dir` option. If this file does not exist, it is created with a newly-generated secret key of the chosen type. The node's secret key determines the public key—the peer identifier—that is used to communicate with the node using the `libp2p` library. The default type is Ed25519.
| `--tracing-receiver <receiver>` | Specifies the receiver to process tracing messages. The default is Log.
| `--tracing-targets <targets>` | Sets a custom profiling filter. Syntax is the same as for logging: `<target>=<level>`.

#### Examples

To export the predefined `local` chain specification to a file named `customSpec.json`, you can run the following command:

```shell
./target/release/node-template build-spec --chain local > customSpec.json
```

If you have previously created a JSON file that contains a custom chain specification, you can specify the path to that file and use the `--raw` command-line option to export the chain specification with encoded storage keys that the node uses to reference the data in its local storage.

```shell
./target/release/node-template build-spec --chain ./my-test-chain.json --raw
```

## check-block

Use the `node-template check-block` command to validate a specific block.
You must specify the block to validate by the block hash or block number.

#### Basic command usage

```shell
node-template check-block [flags] [options] <block-identifier>
```

#### Flags

You can use the following optional flags with the `node-template check-block` command.

| Flag   | Description
| ------ | -----------
| `--detailed-log-output` | Enables detailed log output, including the log target name, the log level, and the thread name. This option is used automatically if you enable a logging level any higher level than `info`.
| `--dev` | Starts the node in development mode. Using this flag also enables the `--chain=dev`, `--force-authoring`, `--rpc-cors=all`, `--alice`, and `--tmp` flags by default.
| `--disable-log-color` | Disables log color output.
| `--enable-log-reloading` | Enables the log filter to be dynamically updated and reloaded. Note that this option can significantly decrease performance. Setting this option does not affect the `system_addLogFilter` and `system_resetLogFilter` RPC methods.
| `-h`, `--help` | Displays usage information.
| `--storage-chain` | Changes the storage format for blocks. If you specify this option, each transaction is stored separately in the transaction database column and is only referenced by its hash in the block body column.
| `--unsafe-pruning` | Forces the node to start with pruning enabled. By default, validator nodes have state pruning disabled. To start a validator node with pruning enabled—also referred to as archive mode—you must set this option.
| `-V`, `--version` | Displays version information.

#### Options

You can use the following command-line options with the `node-template check-block` command.

| Option | Description
| ------ | -----------
| `-d`, `--base-path <path>` | Specifies a custom base path.
| `--chain <chain-specification>` | Specifies the chain specification to use. You can set this option using a predefined chain specification name, such as `dev`, `local`, or `staging`or you can specify the path to a file that contains the chain specification, for example, the chain specification generated by using the `build-spec` subcommand.
| `--database <database>` | Selects the database backend to use. Valid values are `rocksdb`, `paritydb-experimental`, or `auto`.
| `--db-cache <MiB>` | Limits how much memory the database cache can use. The default is 128 MiB.
| `--default-heap-pages <count>` | Specifies the default number of 64KB pages to allocate for Wasm execution. You should not use this option unless you know what you're doing.
| `--execution <strategy>` | Determines the execution strategy used by all execution contexts. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-block-construction <strategy>` | Determines the execution strategy used when calling into the runtime to construct blocks. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-import-block <strategy>`| Determines the execution strategy used when calling into the runtime to import blocks, including locally authored blocks. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-offchain-worker <strategy>` | Determines the execution strategy used when calling into the runtime to use an offchain worker. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-other <strategy>` | Determines the execution strategy used when calling into the runtime for operations other than synchronizing, importing, or constructing blocks. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-syncing <strategy>` | Determines the execution strategy used when calling into the runtime to synchronize blocks. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--keep-blocks <count>` | Specifies the number of finalized blocks to keep in the database. The default is to keep all blocks.
| `-l`, `--log <log-pattern>...` | Sets a custom logging filter. The syntax to use is `<log-target>=<level>`, for example `-lsync=debug`. The valid log levels from least to most verbose are `error`, `warn`, `info`, `debug`, and `trace`. By default, all targets log `info` level messages. You can set the global log level with `-l<level>`.
| `--pruning <pruning-mode>` | Specifies the maximum number of block states to keep or `archive` to keep all block states. If the node is running as a validator, the default is to keep all block states. If the node does not run as a validator, only state for the last 256 blocks is kept.
| `--state-cache-size <bytes>` | Specifies the state cache size. The default is 67108864 bytes.
| `--tracing-receiver <receiver>` | Specifies the receiver to process tracing messages. The default is Log.
| `--tracing-targets <targets>` | Sets a custom profiling filter. Syntax is the same as for logging: `<target>=<level>`.
| `--wasm-execution <method>` | Specifies the method for executing Wasm runtime code. Valid values are `interpreted`, or `compiled`. The default is `Compiled`.
| `--wasm-runtime-overrides <path>` | Specifies the path where local WASM runtimes are stored. If you set this option, the node uses the local runtime instead of the on-chain runtime if the runtime versions are the same.

#### Arguments

You must specify the following command-line argument when you run the `node-template check-block` command.

| Argument | Description
| -------- | -----------
| `block-identifier` | Specifies the block hash or block number to check.

## export-blocks

Use the `node-template export-blocks` command to export blocks.

#### Basic command usage

```shell
node-template export-blocks [flags] [options] [--] [output]
```

#### Flags

You can use the following optional flags with the `node-template export-blocks` command.

| Flag   | Description
| ------ | -----------
| `--binary` | Exports blocks as binary output rather than to a JSON file.
| `--detailed-log-output` | Enables detailed log output, including the log target name, the log level, and the thread name. This option is used automatically if you enable a logging level any higher level than `info`.
| `--dev` | Starts the node in development mode. Using this flag also enables the `--chain=dev`, `--force-authoring`, `--rpc-cors=all`, `--alice`, and `--tmp` flags by default.
| `--disable-log-color` | Disables log color output.
| `--enable-log-reloading` | Enables the log filter to be dynamically updated and reloaded. Note that this option can significantly decrease performance. Setting this option does not affect the `system_addLogFilter` and `system_resetLogFilter` RPC methods.
| `-h`, `--help` | Displays usage information.
| `--storage-chain` | Changes the storage format for blocks. If you specify this option, each transaction is stored separately in the transaction database column and is only referenced by its hash in the block body column.
| `-V`, `--version` | Displays version information.

#### Options

You can use the following command-line options with the `node-template export-blocks` command.

| Option | Description
| ------ | -----------
| `-d`, `--base-path <path>` | Specifies a custom base path.
| `--chain <chain-specification>` | Specifies the chain specification to use. You can set this option using a predefined chain specification name, such as `dev`, `local`, or `staging`or you can specify the path to a file that contains the chain specification, for example, the chain specification generated by using the `build-spec` subcommand.
| `--database <database>` | Selects the database backend to use. Valid values are `rocksdb`, `paritydb-experimental`, or `auto`.
| `--db-cache <MiB>` | Limits how much memory the database cache can use. The default is 128 MiB.
| `--from <block>` | Specifies the block number to start exporting from. The default is the first block (1).
| `--keep-blocks <count>` | Specifies the number of finalized blocks to keep in the database. The default is to keep all blocks.
| `-l`, `--log <log-pattern>...` | Sets a custom logging filter. The syntax to use is `<log-target>=<level>`, for example `-lsync=debug`. The valid log levels from least to most verbose are `error`, `warn`, `info`, `debug`, and `trace`. By default, all targets log `info` level messages. You can set the global log level with `-l<level>`.
| `--pruning <pruning-mode>` | Specifies the maximum number of block states to keep or `archive` to keep all block states. If the node is running as a validator, the default is to keep all block states. If the node does not run as a validator, only state for the last 256 blocks is kept.
| `--to <block>` | Specifies the last block number to export. The default is the best block.
| `--tracing-receiver <receiver>` | Specifies the receiver to process tracing messages. The default is Log.
| `--tracing-targets <targets>` | Sets a custom profiling filter. Syntax is the same as for logging: `<target>=<level>`.

#### Arguments

You can specify the following command-line argument when you run the `node-template export-blocks` command.

| Argument | Description
| -------- | -----------
| `<output>` | Specifies the output file name for the exported blocks. If you don't specify an output file name, blocks are exported to standard output (`stdout`).

## export-state

Use the `node-template export-state` command to export the state of a given block into a chain specification.

#### Basic command usage

```shell
node-template export-state [flags] [options] [--] [block-identifier]
```

#### Flags

You can use the following optional flags with the `node-template export-state` command.

| Flag   | Description
| ------ | -----------
| `--detailed-log-output` | Enables detailed log output, including the log target name, the log level, and the thread name. This option is used automatically if you enable a logging level any higher level than `info`.
| `--dev` | Starts the node in development mode. Using this flag also enables the `--chain=dev`, `--force-authoring`, `--rpc-cors=all`, `--alice`, and `--tmp` flags by default.
| `--disable-log-color` | Disables log color output.
| `--enable-log-reloading` | Enables the log filter to be dynamically updated and reloaded. Note that this option can significantly decrease performance. Setting this option does not affect the `system_addLogFilter` and `system_resetLogFilter` RPC methods.
| `-h`, `--help` | Displays usage information.
| `-V`, `--version` | Displays version information.

#### Options

You can use the following command-line options with the `node-template export-state` command.

| Option | Description
| ------ | -----------
| `-d`, `--base-path <path>` | Specifies a custom base path.
| `--chain <chain-specification>` | Specifies the chain specification to use. You can set this option using a predefined chain specification name, such as `dev`, `local`, or `staging`or you can specify the path to a file that contains the chain specification, for example, the chain specification generated by using the `build-spec` subcommand.
| `--keep-blocks <count>` | Specifies the number of finalized blocks to keep in the database. The default is to keep all blocks.
| `-l`, `--log <log-pattern>...` | Sets a custom logging filter. The syntax to use is `<log-target>=<level>`, for example `-lsync=debug`. The valid log levels from least to most verbose are `error`, `warn`, `info`, `debug`, and `trace`. By default, all targets log `info` level messages. You can set the global log level with `-l<level>`.
| `--pruning <pruning-mode>` | Specifies the maximum number of block states to keep or `archive` to keep all block states. If the node is running as a validator, the default is to keep all block states. If the node does not run as a validator, only state for the last 256 blocks is kept.
| `--tracing-receiver <receiver>` | Specifies the receiver to process tracing messages. The default is Log.
| `--tracing-targets <targets>` | Sets a custom profiling filter. Syntax is the same as for logging: `<target>=<level>`.

#### Arguments

You can specify the following command-line argument when you run the `node-template export-state` command.

| Argument | Description
| -------- | -----------
| `<block-identifier>` | Specifies the block hash or block number to export.

## help

Use the `node-template help` command to display usage information for `node-template` or a summary of command-line usage information for any `node-template` subcommand.

#### Basic command usage

```shell
node-template help [subcommand]
```

#### Examples

To display a summary of usage information for the `export-blocks` subcommand, run the following command:

```bash
node-template help export-blocks
```

## import-blocks

Use the `node-template import-blocks` command to import blocks.

#### Basic command usage

```shell
node-template import-blocks [flags] [options] [--] [input]
```

#### Flags

You can use the following optional flags with the `node-template import-blocks` command.

| Flag   | Description
| ------ | -----------
| `--binary` | Attempts to import blocks in binary format rather than from a JSON file.
| `--detailed-log-output` | Enables detailed log output, including the log target name, the log level, and the thread name. This option is used automatically if you enable a logging level any higher level than `info`.
| `--dev` | Starts the node in development mode. Using this flag also enables the `--chain=dev`, `--force-authoring`, `--rpc-cors=all`, `--alice`, and `--tmp` flags by default.
| `--disable-log-color` | Disables log color output.
| `--enable-log-reloading` | Enables the log filter to be dynamically updated and reloaded. Note that this option can significantly decrease performance. Setting this option does not affect the `system_addLogFilter` and `system_resetLogFilter` RPC methods.
| `-h`, `--help` | Displays usage information.
| `--storage-chain` | Changes the storage format for blocks. If you specify this option, each transaction is stored separately in the transaction database column and is only referenced by its hash in the block body column.
| `--unsafe-pruning` | Forces the node to start with pruning enabled. By default, validator nodes have state pruning disabled. To start a validator node with pruning enabled—also referred to as archive mode—you must set this option.
| `-V`, `--version` | Displays version information.

#### Options

You can use the following command-line options with the `node-template import-blocks` command.

| Option | Description
| ------ | -----------
| `-d`, `--base-path <path>` | Specifies a custom base path.
| `--chain <chain-specification>` | Specifies the chain specification to use. You can set this option using a predefined chain specification name, such as `dev`, `local`, or `staging`or you can specify the path to a file that contains the chain specification, for example, the chain specification generated by using the `build-spec` subcommand.
| `--database <database>` | Selects the database backend to use. Valid values are `rocksdb`, `paritydb-experimental`, or `auto`.
| `--db-cache <MiB>` | Limits how much memory the database cache can use. The default is 128 MiB.
| `--default-heap-pages <count>` | Specifies the default number of 64KB pages to allocate for Wasm execution. In most cases, you should not use this option.
| `--execution <strategy>` | Determines the execution strategy used by all execution contexts. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-block-construction <strategy>` | Determines the execution strategy used when calling into the runtime to construct blocks. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-import-block <strategy>`| Determines the execution strategy used when calling into the runtime to import blocks, including locally authored blocks. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-offchain-worker <strategy>` | Determines the execution strategy used when calling into the runtime to use an offchain worker. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-other <strategy>` | Determines the execution strategy used when calling into the runtime for operations other than synchronizing, importing, or constructing blocks. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--execution-syncing <strategy>` | Determines the execution strategy used when calling into the runtime to synchronize blocks. Valid values are `Native`, `Wasm`, `Both`, or `NativeElseWasm`.
| `--keep-blocks <count>` | Specifies the number of finalized blocks to keep in the database. The default is to keep all blocks.
| `-l`, `--log <log-pattern>...` | Sets a custom logging filter. The syntax to use is `<log-target>=<level>`, for example `-lsync=debug`. The valid log levels from least to most verbose are `error`, `warn`, `info`, `debug`, and `trace`. By default, all targets log `info` level messages. You can set the global log level with `-l<level>`.
| `--pruning <pruning-mode>` | Specifies the maximum number of block states to keep or `archive` to keep all block states. If the node is running as a validator, the default is to keep all block states. If the node does not run as a validator, only state for the last 256 blocks is kept.
| `--state-cache-size <bytes>` | Specifies the state cache size. The default is 67108864 bytes.
| `--tracing-receiver <receiver>` | Specifies the receiver to process tracing messages. The default is Log.
| `--tracing-targets <targets>` | Sets a custom profiling filter. Syntax is the same as for logging: `<target>=<level>`.
| `--wasm-execution <method>` | Specifies the method for executing Wasm runtime code. Valid values are `interpreted`, or `compiled`. The default is `Compiled`.
| `--wasm-runtime-overrides <path>` | Specifies the path where local WASM runtimes are stored. If you set this option, the node uses the local runtime instead of the on-chain runtime if the runtime versions are the same.

#### Arguments

You can specify the following command-line argument when you run the `node-template import-blocks` command.

| Argument | Description
| -------- | -----------
| `<input>` | Specifies the input file to use for importing blocks. If you don't specify an input file, blocks are imported from standard input (`stdin`).

## key

Use the `node-template key` command to generate, inspect, and manage private and public key pairs and addresses.
The `node-template key` command provides convenient access to a subset of key management services that are available in the standalone `subkey` program.
For complete details about the subcommands and command-line options for most `node-template key` subcommands, see [`subkey`](/reference/command-line-tools/subkey/).
Although most of the `node-template key` subcommands are identical to [`subkey`] subcommands, the `node-template key insert` subcommand is not a supported [`subkey`] subcommand.
The `node-template key insert` subcommand enables you to add generated keys directly to a node keystore.
For information about the command-line options and arguments to use with the `node-template key insert` subcommand, see [Insert a key on a node](#node-key-insert) or run the following command:

```shell
node-template key insert --help
```

#### Basic command usage

```shell
node-template key [subcommand] [flags]
```

#### Flags

You can use the following optional flags with the `node-template key` command.

| Flag   | Description
| ------ | -----------
| `-h`, `--help` | Displays usage information.
| `-V`, `--version` | Displays version information.

#### Subcommands

You can use the following subcommands with the `node-template key` command.

| Command | Description
| ------- | -----------
| [`generate`](/reference/command-line-tools/subkey/#subkey-generate) | Generates a random account key.
| [`generate-node-key`](/reference/command-line-tools/subkey/#subkey-generate-node-key) | Generates a random node `libp2p` secret key.
| [`help`](/reference/command-line-tools/subkey/#subkey-help) | Displays usage information for a specified subcommand.
| [`insert`](#node-key-insert) | Adds an account or node key to the keystore on the local node.
| [`inspect`](/reference/command-line-tools/subkey/#subkey-inspect) | Displays the public key and SS58 address for the secret URI you specify.
| [`inspect-node-key`](/reference/command-line-tools/subkey/#subkey-inspect-node-key) | Displays the peer ID that corresponds with the secret node key in the file name you specify.

### Insert a key on a node

Use the `node-template key insert` command to add the keys used for performing node operations to the node keystore.
For example, keys are required to secure peer-to-peer communication between nodes and to enable nodes to act as validating authorities for consensus.

#### Basic command usage

```shell
node-template key insert [FLAGS] [OPTIONS] --key-type <key-type> --scheme <SCHEME>
```

#### Flags

You can use the following optional flags with the `node-template key insert` command.

| Flag   | Description
| ------ | -----------
| `--detailed-log-output` | Enables detailed log output, including the log target name, the log level, and the thread name. This option is used automatically if you enable a logging level any higher level than `info`.
| `--dev` | Starts the node in development mode. Using this flag also enables the `--chain=dev`, `--force-authoring`, `--rpc-cors=all`, `--alice`, and `--tmp` flags by default.
| `--disable-log-color` | Disables log color output.
| `--enable-log-reloading` | Enables the log filter to be dynamically updated and reloaded. Note that this option can significantly decrease performance. Setting this option does not affect the `system_addLogFilter` and `system_resetLogFilter` RPC methods.
| `-h`, `--help` | Displays usage information.
| `--password-interactive` | Displays an interactive prompt for you to enter the password in the terminal shell to access the keystore.
| `-V`, `--version` | Displays version information.

#### Options

You can use the following command-line options with the `node-template key insert` command.

| Option | Description
| ------ | -----------
| `-d`, `--base-path <path>` | Specifies a custom base path.
| `--chain <chain-specification>` | Specifies the chain specification to use. You can set this option using a predefined chain specification name, such as `dev`, `local`, or `staging`or you can specify the path to a file that contains the chain specification, for example, the chain specification generated by using the `build-spec` subcommand.
| `--key-type <key-type>` | Specifies the type of node activity the key authorizes. For example, valid key types include `aura` to authorize a node to produce blocks, `gran` to authorize a node to finalize blocks, and `imon` to send a heartbeat transaction that signals the node is online.
| `--keystore-path <path>` | Specifies the path to a custom keystore.
| `--keystore-uri <keystore-uri>` | Specifies custom URIs to connect to for keystore services.
| `-l`, `--log <log-pattern>...` | Sets a custom logging filter. The syntax to use is `<log-target>=<level>`, for example `-lsync=debug`. The valid log levels from least to most verbose are `error`, `warn`, `info`, `debug`, and `trace`. By default, all targets log `info` level messages. You can set the global log level with `-l<level>`.
| `--password <password>` | Enables you to add an extra user-defined secret to the secret key required by the keystore.
| `--password-filename <path>` | Specifies the file that contains the password used to access the keystore.
| `--scheme <scheme>` | Specifies the cryptography scheme to use to generate the key out of the given URI. Valid values are `Ed25519`, `Sr25519`, or `Ecdsa`.
| `--suri <suri>` | Specifies the secret key URI. If you specify a file for this option, the file content is used as the URI. If you don't specify this option, you are prompted to specify the URI.
| `--tracing-receiver <receiver>` | Specifies the receiver to process tracing messages. The default is Log.
| `--tracing-targets <targets>` | Sets a custom profiling filter. Syntax is the same as for logging: `<target>=<level>`.

## purge-chain

Use the `node-template purge-chain` command to remove a blockchain and all blockchain-related information.

#### Basic command usage

```shell
node-template purge-chain [flags] [options]
```

#### Flags

You can use the following optional flags with the `node-template purge-chain` command.

| Flag   | Description
| ------ | -----------
| `--detailed-log-output` | Enables detailed log output, including the log target name, the log level, and the thread name. This option is used automatically if you enable a logging level any higher level than `info`.
| `--dev` | Starts the node in development mode. Using this flag also enables the `--chain=dev`, `--force-authoring`, `--rpc-cors=all`, `--alice`, and `--tmp` flags by default.
| `--disable-log-color` | Disables log color output.
| `--enable-log-reloading` | Enables the log filter to be dynamically updated and reloaded. Note that this option can significantly decrease performance. Setting this option does not affect the `system_addLogFilter` and `system_resetLogFilter` RPC methods.
| `-h`, `--help` | Displays usage information.
| `--storage-chain` | Changes the storage format for blocks. If you specify this option, each transaction is stored separately in the transaction database column and is only referenced by its hash in the block body column.

| `-V`, `--version` | Displays version information.
 `-y` | Provides a preemptive `yes` response to skip the interactive prompt to confirm that you want to remove the chain.

#### Options

You can use the following command-line options with the `node-template purge-chain` command.

| Option | Description
| ------ | -----------
| `-d`, `--base-path <path>` | Specifies a custom base path.
| `--chain <chain-specification>` | Specifies the chain specification to use. You can set this option using a predefined chain specification name, such as `dev`, `local`, or `staging`or you can specify the path to a file that contains the chain specification, for example, the chain specification generated by using the `build-spec` subcommand.
| `--database <database>` | Selects the database backend to use. Valid values are `rocksdb`, `paritydb-experimental`, or `auto`.
| `--db-cache <MiB>` | Limits how much memory the database cache can use. The default is 128 MiB.
| `-l`, `--log <log-pattern>...` | Sets a custom logging filter. The syntax to use is `<log-target>=<level>`, for example `-lsync=debug`. The valid log levels from least to most verbose are `error`, `warn`, `info`, `debug`, and `trace`. By default, all targets log `info` level messages. You can set the global log level with `-l<level>`.
| `--tracing-receiver <receiver>` | Specifies the receiver to process tracing messages. The default is Log.
| `--tracing-targets <targets>` | Sets a custom profiling filter. Syntax is the same as for logging: `<target>=<level>`.

## revert

Use the `node-template revert` command to revert the chain to a previous state.

#### Basic command usage

```shell
node-template revert [flags] [options] [--] [num]
```

#### Flags

You can use the following optional flags with the `node-template revert` command.

| Flag   | Description
| ------ | -----------
| `--detailed-log-output` | Enables detailed log output, including the log target name, the log level, and the thread name. This option is used automatically if you enable a logging level any higher level than `info`.
| `--dev` | Starts the node in development mode. Using this flag also enables the `--chain=dev`, `--force-authoring`, `--rpc-cors=all`, `--alice`, and `--tmp` flags by default.
| `--disable-log-color` | Disables log color output.
| `--enable-log-reloading` | Enables the log filter to be dynamically updated and reloaded. Note that this option can significantly decrease performance. Setting this option does not affect the `system_addLogFilter` and `system_resetLogFilter` RPC methods.
| `-h`, `--help` | Displays usage information.
| `-V`, `--version` | Displays version information.

#### Options

You can use the following command-line options with the `node-template rever` command.

| Option   | Description
| -------- | -----------
| `-d`, `--base-path <path>` | Specifies a custom base path.
| `--chain <chain-specification>` | Specifies the chain specification to use. You can set this option using a predefined chain specification name, such as `dev`, `local`, or `staging`or you can specify the path to a file that contains the chain specification, for example, the chain specification generated by using the `build-spec` subcommand.
| `--keep-blocks <count>` | Specifies the number of finalized blocks to keep in the database. The default is to keep all blocks.
| `-l`, `--log <log-pattern>...` | Sets a custom logging filter. The syntax to use is `<log-target>=<level>`, for example `-lsync=debug`. The valid log levels from least to most verbose are `error`, `warn`, `info`, `debug`, and `trace`. By default, all targets log `info` level messages. You can set the global log level with `-l<level>`.
| `--pruning <pruning-mode>` | Specifies the maximum number of block states to keep or `archive` to keep all block states. If the node is running as a validator, the default is to keep all block states. If the node does not run as a validator, only state for the last 256 blocks is kept.
| `--tracing-receiver <receiver>` | Specifies the receiver to process tracing messages. The default is Log.
| `--tracing-targets <targets>` | Sets a custom profiling filter. Syntax is the same as for logging: `<target>=<level>`.

#### Arguments

You can use the following command-line argument with the `node-template revert` command.

| Argument | Description
| -------- | -----------
| `<num>` | Specifies the number of blocks to revert. The default is 256 blocks.
