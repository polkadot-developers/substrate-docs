---
title: Monitor node metrics
description: Use observability tools to capture and view information about Substrate nodes.
---

Substrate exposes metrics about the operation of your network.
For example, you can collect information about how many peers your node is connected to and how much memory your node is using. 
To visualize these metrics, you can use tools like [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/). 
This tutorial demonstrates how to use Grafana and Prometheus to scrape and visualize these types of node metrics.

A possible architecture could look like:

```
+-----------+                     +-------------+                                                              +---------+
| Substrate |                     | Prometheus  |                                                              | Grafana |
+-----------+                     +-------------+                                                              +---------+
      |               -----------------\ |                                                                          |
      |               | Every 1 minute |-|                                                                          |
      |               |----------------| |                                                                          |
      |                                  |                                                                          |
      |        GET current metric values |                                                                          |
      |<---------------------------------|                                                                          |
      |                                  |                                                                          |
      | `substrate_peers_count 5`        |                                                                          |
      |--------------------------------->|                                                                          |
      |                                  | --------------------------------------------------------------------\    |
      |                                  |-| Save metric value with corresponding time stamp in local database |    |
      |                                  | |-------------------------------------------------------------------|    |
      |                                  |                                         -------------------------------\ |
      |                                  |                                         | Every time user opens graphs |-|
      |                                  |                                         |------------------------------| |
      |                                  |                                                                          |
      |                                  |       GET values of metric `substrate_peers_count` from time-X to time-Y |
      |                                  |<-------------------------------------------------------------------------|
      |                                  |                                                                          |
      |                                  | `substrate_peers_count (1582023828, 5), (1582023847, 4) [...]`           |
      |                                  |------------------------------------------------------------------------->|
      |                                  |                                                                          |

```

<details>
 <summary>Reproduce diagram</summary>

Go to: https://textart.io/sequence

```
object Substrate Prometheus Grafana
note left of Prometheus: Every 1 minute
Prometheus->Substrate: GET current metric values
Substrate->Prometheus: `substrate_peers_count 5`
note right of Prometheus: Save metric value with corresponding time stamp in local database
note left of Grafana: Every time user opens graphs
Grafana->Prometheus: GET values of metric `substrate_peers_count` from time-X to time-Y
Prometheus->Grafana: `substrate_peers_count (1582023828, 5), (1582023847, 4) [...]`
```

</details>

## Before you begin

Before you begin, verify the following:

- You have configured your environment for Substrate development by installing [Rust and the Rust toolchain](/main-docs/install/).

- You have completed at least some of the previous tutorials, including [Build a local blockchain](/tutorials/get-started/build-local-blockchain/) and [Simulte a network](/tutorials/get-started/simulate-network/).


## Tutorial objectives

By completing this tutorial, you will accomplish the following objectives:

* Install Prometheus and Grafana.
* Configure Prometheus to capture a time series for your Substrate node.
* Configure Grafana to visualize the node metrics collected using the Prometheus endpoint.

## Install Prometheus and Grafana

For testing and demonstration purposes, you should download the compiled `bin` programs for Prometheus and Grafana rather than building the tools yourself or using a Docker image.
Use the following links to download the appropriate binaries for your architecture. 
This tutorials assumes you are using the compiled binaries in a working directory.

To install the tools for this tutorial:

1. Open a browser on your computer.

1. Download the appropriate precompiled binary for Prometheus from [prometheus download](https://prometheus.io/download/).

1. Uncompress and extract the download archive into a working folder.

    ```shell
    gunzip prometheus-2.35.0.darwin-amd64.tar.gz && tar -xvf prometheus-2.35.0.darwin-amd64.tar
    ```

1. Navigate to [Grafana self-managed](https://grafana.com/get/?tab=self-managed), then click [Download Grafance](https://grafana.com/grafana/download?pg=get&plcmt=selfmanaged-box1-cta1).

1. Select the appropriate precompiled binary for your architecture.

1. Open a terminal shell on your computer and run the appropriate command to install on your architecture.

  For example, on macOS, run:

  ```shell
  curl -O https://dl.grafana.com/enterprise/release/grafana-enterprise-8.5.2.darwin-amd64.tar.gz \
  tar -zxvf grafana-enterprise-8.5.2.darwin-amd64.tar.gz
  ```

## Start a Substrate node

Substrate exposes an endpoint that serves metrics in the [Prometheus exposition format](https://prometheus.io/docs/concepts/data_model/) available on port `9615`. 
You can change the port with `--prometheus-port <PORT>` and enable it to be accessed over an interface other than local host with `--prometheus-external`.

```bash
# clear the dev database
./target/release/node-template purge-chain --dev -y
# start the template node  in dev & tmp mode to experiment
# optionally add the `--prometheus-port <PORT>`
# or `--prometheus-external` flags
./target/release/node-template --dev
```

### Configure Prometheus to scrape your Substrate node

In the working directory where you installed Prometheus, you will find a `prometheus.yml` configuration file.
You can modify this file—or create a custom file—to configure Prometheus to scrape the exposed endpoint by adding it to the targets array. 
If you modify the default configuration file, here is what will be different:

```yml
# --snip--

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'substrate_node'

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    # Override the global default and scrape targets from this job every 5 seconds.
    # ** NOTE: you want to have this *LESS THAN* the block time in order to ensure
    # ** that you have a data point for every block!
    scrape_interval: 5s

    static_configs:
      - targets: ['localhost:9615']
```

You want to have `scrape_interval` _less than_ the block time in order to ensure that you have a data point for every block!

Now you can start a Prometheus instance with the modified `prometheus.yml` configuration file. 

Presuming you downloaded the binary, `cd` into the working directory and run the following command:

```bash
# specify a custom config file instead if you made one here:
./prometheus --config.file prometheus.yml
```

leave this process running.

### Check all Prometheus metrics

In a new terminal, you can do a quick status check on prometheus by running the following command:

```bash
curl localhost:9615/metrics
```

This command should return output similar to the following:

```bash
# HELP substrate_block_height Block height info of the chain
# TYPE substrate_block_height gauge
substrate_block_height{status="best"} 7
substrate_block_height{status="finalized"} 4
# HELP substrate_build_info A metric with a constant '1' value labeled by name, version
# TYPE substrate_build_info gauge
substrate_build_info{name="available-vacation-6791",version="2.0.0-4d97032-x86_64-linux-gnu"} 1
# HELP substrate_database_cache_bytes RocksDB cache size in bytes
# TYPE substrate_database_cache_bytes gauge
substrate_database_cache_bytes 0
# HELP substrate_finality_grandpa_precommits_total Total number of GRANDPA precommits cast locally.
# TYPE substrate_finality_grandpa_precommits_total counter
substrate_finality_grandpa_precommits_total 31
# HELP substrate_finality_grandpa_prevotes_total Total number of GRANDPA prevotes cast locally.
# TYPE substrate_finality_grandpa_prevotes_total counter
substrate_finality_grandpa_prevotes_total 31
#
# --snip--
#
```

Alternatively, you can open same [URL](http://localhost:9615/metrics) in a browser to view all available metric data.

## Visualizing Prometheus metrics with Grafana

After you have Grafana running, navigate to it in a browser (**the default is https://localhost:3000/**).
Log in using the default user `admin` and password `admin` and navigate to the data sources page at `localhost:3000/datasources`.

You then need to select a `Prometheus` data source type and specify where Grafana needs to look for it.

The Prometheus port Grafana needs is NOT the one you set in the `prometheus.yml` file (https://localhost:9615) for where your node is publishing it's data.

With both the Substrate node and Prometheus running, configure Grafana to look for Prometheus on it's default port: https://localhost:9090 (unless you customized it).

Click `Save & Test` to ensure that you have the data source set correctly. 
Now you can configure a new dashboard.

### Template Grafana Dashboard

If you would like a basic dashboard to start [here is a template example](/assets/tutorials/node-metrics/substrate-node-template-metrics.json) that you can `Import`
in Grafana to get basic information about your node:

![Grafana Dashboard](/media/images/docs/tutorials/visualize-node-metrics/grafana.png)

If you want to create your own dashboard, see the [prometheus docs for Grafana](https://prometheus.io/docs/visualization/grafana/).

If you create a custom dashboard, consider uploading it to the [Grafana dashboards](https://grafana.com/grafana/dashboards).
The public [Substrate node template dashboard](https://grafana.com/grafana/dashboards/13759/) is available for download from Grafana dashboards.
You can let the Substrate builder community know your dashboard exists by listing it in the [Awesome Substrate](https://github.com/substrate-developer-hub/awesome-substrate) repository.

## Where to go next

- [Add trusted validators](/tutorials/get-started/trusted-network).
  [Monitor your node](https://wiki.polkadot.network/docs/en/maintain-guides-how-to-monitor-your-node).
  [Substrate Prometheus Exporter](https://github.com/paritytech/substrate/tree/master/utils/prometheus).
- [Polkadot network dashboard](https://github.com/w3f/polkadot-dashboard).
