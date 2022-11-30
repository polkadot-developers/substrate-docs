---
title: Monitor
description:
keywords:
---

Monitoring network operations and performance is an important part of maintaining a healthy, stable, and secure parachain ecosystem.
By default, Substrate nodes provide low-level **telemetry** components to automatically collect and transmit detailed information about the operation of each node in the network.
Telemetry is the underlying mechanism—sensors, probes, or instrumentation—for collecting and transmitting data points as they occur to an endpoint so that you can observe, monitor, and alert on system behavior.
As a developer or node operator, there's rarely any need to know the implementation details of how these low-level telemetry components provide information about computer and network operations.
At a high level, the information collected from each node is sent to a default telemetry server and aggregated for display in a front-end dashboard.

![Default telemetry for Substrate nodes](/media/images/docs/telemetry-overview.png)

## Changing the telemetry server

You can use the `--telemetry-url` command-line option when you start a node to specify the telemetry server that you want to send telemetry data to.



Why it’s important 


What it reports


How it works diagram and description 


Enabling the default backend and front end services for a node


Viewing default metrics


Disabling telemetry 



The telemetry information includes details about the hardware and software running on the node, including:

- The exact CPU model.

- The total amount of memory, in bytes.

- The number of physical CPU cores.

- The Linux kernel version.

- The exact Linux distribution used.

- Whether the node’s running under a virtual machine.



Metrics and dashboards

Block production
Throughput
Network activity and performance

Alerting on bad behavior
