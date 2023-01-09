---
title: Monitor
description:
keywords:
---

In general, you should establish monitoring policies and practices for both **on-chain events** and individual **node operations**.

## On-chain activity

You can monitor on-chain activity for specific events, such as transactions submitted from a certain address, a change to the current validator set.
On-chain monitoring typically involves connecting to RPC nodes to check for specific values, identify processing delays, or track the timing of events. 
In most cases, you only need two RPC instances to handle requests for all of your hosts. 
However, it's recommended that you run your own RPC servers to service these requests in case there are issues with the public RPC nodes. 
Some examples of applications that query onchain information are [polkabot](https://gitlab.com/Polkabot/polkabot) and [polkadot-basic-notification](https://github.com/paritytech/polkadot-basic-notification).

## Node operations

You should monitor each node that you run on the network for basic information about its operation such as the current block height, the number of peer-to-peer connections, CPU usage, and the available free memory.
By default, Substrate exposes many useful metrics on the http://localhost:9615/metrics endpoint. 
This endpoint is only be exposed on the local network interface by default, but you can expose it on all interfaces with the `--prometheus-external` command-line option.

This endpoint outputs in a simple key-value format. 
For example:

```text
polkadot_database_cache_bytes 0
```

However, you can also include tags within the key.
For example:

```text
susbtrate_block_height{status="best"} 136
susbtrate_block_height{status="finalized"} 133
```

As the metrics provided by this endpoint don't include host metrics—such as CPU, memory, bandwidth usage—it's recommended to complement it by installing the Prometheus [node_exporter](https://github.com/prometheus/node_exporter) on each host.

## Open source monitoring stack

The following diagram illustrates an example of a common open source monitoring stack. 

![Monitoring stack layers](/media/images/docs/monitoring-stack.png)

There are various tools you can use for each layer of the stack.
For example:

- Prometheus is a monitoring engine that collects metrics from specified targets at specified intervals and evaluates the data collected using rules you define. Its time series database can hold large amounts of data that can be accessed very quickly.
- Grafana is an observability platform that allows you to query, visualize, and analyze the data you collect through dashboards and graphs.
- Node exporter is process that listens on a port and reports application-specific metrics to Prometheus.
- Alertmanager is a tool that enables you to create and route alerts based on the rules you specify. Alertmanager allows you to configure how and where to send alert if something goes wrong. For example, you can send instant messages for warning alerts, but page an on-call technician for critical alerts
- Loki is a scalable log aggregation system that allows you to view and search logs from all components in your infrastructure in one place.
  
For a simple example of using Prometheus, Grafana, and node exporter, see [Monitor node metrics](/tutorials/get-started/monitor-node-metrics/).
For a simplified example of using Loki, see [Remote monitoring](/deploy/deployment-options/#remote-monitoring)

## Telemetry

The telemetry server is used for real time information from nodes, showing information about their name, location, current best & finalized blocks etc… 
This gives you a useful dashboard to view the state of nodes.

You can find the backend components for the telemetry server in [substrate-telemetry](https://github.com/paritytech/substrate-telemetry). 
There's also a [helm chart](https://github.com/paritytech/helm-charts/tree/main/charts/substrate-telemetry) available to allow easy Kubernetes deployments.
