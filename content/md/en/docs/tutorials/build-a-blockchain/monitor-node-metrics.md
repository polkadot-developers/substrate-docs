---
title: Monitor node metrics
description: Use observability tools to capture and view information about Substrate nodes.
keywords:
  - observability
  - metrics
  - node operations
---

<div class="warning">
	<p>
	<strong>⚠️ WARNING:</strong> This page contains potentially outdated information 
  and instructions. Reading it might still be useful, yet we suggest taking it with a grain of salt. When the new [Polkadot developer documentation](https://forum.polkadot.network/t/decentralized-futures-ecosystem-devrel-team-for-polkadot-by-papermoon/5811) is published, the content on this page will be updated. Thanks for your patience!
	</p>
</div>

Substrate exposes metrics about the operation of your network.
For example, you can collect information about how many peers your node is connected to, how much memory your node is using, and the number of blocks being produced.
To capture and visualize the metrics that Substrate nodes expose, you can configure and use tools like [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/).
This tutorial demonstrates how to use Prometheus to take data samples and Grafana to create graphs and dashboards to visualize the node metrics using the data samples.

At a high level, Substrate exposed telemetry data that can be consumed by the Prometheus endpoint and presented as visual information in a Grafana dashboard or graph.

The following diagram provides a simplified overview of how the interaction between Substrate, Prometheus, and Grafana can be configured to display information about node operations.

![Using Prometheus and Grafana to visualize node metrics](/media/images/docs/tutorials/monitor-node-metrics/node-metrics.png)

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/install/).

- You have completed at least some of the previous tutorials, including [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/) and [Simulate a network](/tutorials/build-a-blockchain/simulate-network/).

## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

- Install Prometheus and Grafana.
- Configure Prometheus to capture a time series for your Substrate node.
- Configure Grafana to visualize the node metrics collected using the Prometheus endpoint.

## Install Prometheus and Grafana

For testing and demonstration purposes, you should download the compiled `bin` programs for Prometheus and Grafana rather than building the tools yourself or using a Docker image.
Use the following links to download the appropriate binaries for your architecture.
This tutorial assumes you are using the compiled binaries in a working directory.

To install the tools for this tutorial:

1. Open a browser on your computer.

1. Download the appropriate precompiled binary for Prometheus from [prometheus download](https://prometheus.io/download/).

2. Open a terminal shell on your computer and navigate to your Downloads folder, then run the appropriate command to extract the contents from the file you downloaded.

   For example, on macOS, you can run a command similar to the following:

   ```text
   gunzip prometheus-2.38.0.darwin-amd64.tar.gz && tar -xvf prometheus-2.38.0.darwin-amd64.tar
   ```

3. Navigate to [Grafana OSS download](https://grafana.com/grafana/download?edition=oss).

4. Select the appropriate precompiled binary for your architecture.

5. Open a terminal shell on your computer and run the appropriate commands to install on your architecture.

   For example, on macOS with Homebrew installed, you can run the following commands:

   ```text
   brew update
   brew install grafana
   ```

## Start a Substrate node

Substrate exposes an endpoint that serves metrics in the [Prometheus exposition format](https://prometheus.io/docs/concepts/data_model/) available on port `9615`.
You can change the port with `--prometheus-port` command-line option and enable it to be accessed over an interface other than the local host with the `--prometheus-external` command-line option.
For simplicity, this tutorial assumes the Substrate node, Prometheus instance, and Grafana service are all running locally using default ports.

1. Open a terminal shell on your computer.

2. Change to the root of the node template directory, if necessary, by running the following command:

   ```bash
   cd substrate-node-template
   ```

3. Start the node template in development mode by running the following command:

   ```bash
   ./target/release/node-template --dev
   ```

## Configure Prometheus endpoint

The directory created when you extracted the Prometheus download contains a `prometheus.yml` configuration file.
You can modify this file—or create a custom configuration file—to configure Prometheus to pull data from the default Prometheus port endpoint—port `9615`—or the port you specified using the `--prometheus-port <port-number>` command-line option.

To add the Substrate exposed endpoint to the list of Prometheus targets:

1. Open a new terminal shell on your computer.

1. Change to the root of the Prometheus working directory.

1. Open the `prometheus.yml` configuration file in a text editor.

1. Add `substrate_node` as a `scrape_config` endpoint.

   For example, add a section similar to the following:

   ```yml
    # A scrape configuration containing exactly one endpoint to scrape:
    scrape_configs:
      - job_name: "substrate_node"

        scrape_interval: 5s

        static_configs:
          - targets: ["localhost:9615"]
   ```

    These settings override the global default values for scrape targets for the `substrate_node` job.
    It's important to set the `scrape_interval` to a value that is less than the block time to ensure that you have a data point for every block.
    For example, the Polkadot block time is six seconds, so the `scrape_interval` is set to five seconds.

1. Start a Prometheus instance with the modified `prometheus.yml` configuration file.

   For example, if you are currently in the Prometheus working directory and using the default configuration file name, start Prometheus by running the following command:

   ```bash
   ./prometheus --config.file prometheus.yml
   ```

   Leave this process running.

2. Open a new terminal shell and check the metrics retrieved for the Substrate node by running the following command:

   ```bash
   curl localhost:9615/metrics
   ```

   This command returns output similar to the following truncated example:

   ```text
   # HELP substrate_block_height Block height info of the chain
   # TYPE substrate_block_height gauge
   substrate_block_height{status="best",chain="dev"} 16
   substrate_block_height{status="finalized",chain="dev"} 14
   substrate_block_height{status="sync_target",chain="dev"} 16
   # HELP substrate_block_verification_and_import_time Time taken to verify and import blocks
   # TYPE substrate_block_verification_and_import_time histogram
   substrate_block_verification_and_import_time_bucket{chain="dev",le="0.005"} 0
   substrate_block_verification_and_import_time_bucket{chain="dev",le="0.01"} 0
   substrate_block_verification_and_import_time_bucket{chain="dev",le="0.025"} 0
   substrate_block_verification_and_import_time_bucket{chain="dev",le="0.05"} 0
   substrate_block_verification_and_import_time_bucket{chain="dev",le="0.1"} 0
   substrate_block_verification_and_import_time_bucket{chain="dev",le="0.25"} 0
   substrate_block_verification_and_import_time_bucket{chain="dev",le="0.5"} 0
   substrate_block_verification_and_import_time_bucket{chain="dev",le="1"} 0
   substrate_block_verification_and_import_time_bucket{chain="dev",le="2.5"} 0
   substrate_block_verification_and_import_time_bucket{chain="dev",le="5"} 0
   substrate_block_verification_and_import_time_bucket{chain="dev",le="10"} 0
   substrate_block_verification_and_import_time_bucket{chain="dev",le="+Inf"} 0
   substrate_block_verification_and_import_time_sum{chain="dev"} 0
   substrate_block_verification_and_import_time_count{chain="dev"} 0
   # HELP substrate_build_info A metric with a constant '1' value labeled by name, version
   # TYPE substrate_build_info gauge
   substrate_build_info{name="ruddy-afternoon-1788",version="4.0.0-dev-6a8b2b12371",chain="dev"} 1
   # HELP substrate_database_cache_bytes RocksDB cache size in bytes
   # TYPE substrate_database_cache_bytes gauge
   substrate_database_cache_bytes{chain="dev"} 0
   # HELP substrate_finality_grandpa_precommits_total Total number of GRANDPA precommits cast locally.
   # TYPE substrate_finality_grandpa_precommits_total counter
   substrate_finality_grandpa_precommits_total{chain="dev"} 76
   # HELP substrate_finality_grandpa_prevotes_total Total number of GRANDPA prevotes cast locally.
   # TYPE substrate_finality_grandpa_prevotes_total counter
   substrate_finality_grandpa_prevotes_total{chain="dev"} 77
   # HELP substrate_finality_grandpa_round Highest completed GRANDPA round.
   # TYPE substrate_finality_grandpa_round gauge
   substrate_finality_grandpa_round{chain="dev"} 76
   ...
   ```

   Alternatively, you can open same endpoint in a browser to view all available metric data.
   For example, if you are using the default Prometheus port, open [`http://localhost:9615/metrics`](http://localhost:9615/metrics) in a browser. <!-- markdown-link-check-disable-line -->

## Configure the Grafana data source

After you run the appropriate commands to install Grafana on your architecture, you can start the service on your local computer to begin using it.
The commands used to start the service depend on your local system architecture and package manager.
For example, if you are using macOS and Homebrew, you can start Grafana by running the following command:

```bash
brew services start grafana
```

For information about starting Grafana on different operating systems, see the appropriate [Grafana documentation](https://grafana.com/docs/grafana/v9.0/).

After you start Grafana, you can navigate to it in a browser.

1. Open a browser and navigate to the port Grafana uses.

   By default, Grafana uses http://localhost:3000 unless you have configured a different host or port.<!-- markdown-link-check-disable-line -->

2. Log in using the default `admin` user name and password `admin`, then click **Log in**.

3. On the Welcome page, under the **Configuration** menu, click **Data Sources**.

1. Click **Prometheus** to configure the Prometheus endpoint as the data source for Substrate node metrics.

   With both the Substrate node and Prometheus instance running, configure Grafana to look for Prometheus on its default port `http://localhost:9090` or the port you configured Grafana to use if you customized the port information.

   You shouldn't specify the Prometheus port you set in the `prometheus.yml` file.
   That port is where your node is publishing its data.

2. Click **Save & Test** to ensure that you have the data source set correctly.

   If the data source is working, you are ready to configure a dashboard to display node metrics.

## Import a template dashboard

If you want a basic dashboard to start, you can import a [Substrate dashboard template](/assets/tutorials/monitor-node/substrate-node-template-metrics.json) to get basic information about your node.

To import the dashboard template:

1. On the Grafana Welcome page, click **Dashboards**.

1. In the left navigation, click **Dashboards** and select **Browse**.

2. For the Search options, click New and select **Import**.

3. Copy the [Substrate dashboard template](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/tutorials/monitor-node/substrate-node-template-metrics.json) and paste it into the **Import via panel json** text box.

4. Click **Load**.

5. Review and modify, if necessary, the name, folder, and unique identifier for the dashboard.

6. Select **Prometheus (default)**, then click **Import**.

   ![Substrate dashboard template](/media/images/docs/tutorials/monitor-node-metrics/grafana-template-dashboard.png)

   The [Substrate dashboard template](https://grafana.com/grafana/dashboards/13759/) can be used with any Substrate-based chain and is also available for download from the Grafana Labs dashboard gallery.

   If you want to create your own dashboards, see the [Prometheus docs for Grafana](https://prometheus.io/docs/visualization/grafana/).

   If you create a custom dashboard, consider uploading it to the [Grafana dashboards](https://grafana.com/grafana/dashboards).
   You can let the Substrate builder community know your dashboard exists by listing it in the [Awesome Substrate](https://github.com/substrate-developer-hub/awesome-substrate) repository.

## Where to go next

- [Add trusted nodes](/tutorials/build-a-blockchain/add-trusted-nodes)
- [Monitor your node](https://wiki.polkadot.network/docs/en/maintain-guides-how-to-monitor-your-node)
-  [Substrate Prometheus Exporter](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/utils/prometheus)
- [Polkadot network dashboard](https://github.com/w3f/polkadot-dashboard)
