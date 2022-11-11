---
title: Monitor
description:
keywords:
---

By default, telemetry components in the Substrate outer node provide low-level information about the operation of the nodes in the network. 
The information exposed can be sent to a backend telemetry server where it can be collected into a data series for display in a front-end dashboard or charts and graphs. 

Substrate telemetry relies on the tracing library from the Tokio Rust crate to log and transmit information about node operations.
The `tokio` tracing layer sends the information it collects through an asynchronous channel to a background task called `TelemetryWorker`.
The `TelemetryWorker` forwards the information to one or more remote telemetry servers.
You can use the `--telemetry-url` command-line option when you start a node to specify to specify the telemetry server that you want to send telemetry data to.


impl Telemetry
source
pub fn start_telemetry(
    &mut self,
    connection_message: ConnectionMessage
) -> Result<()>
Initialize the telemetry with the endpoints provided in argument for the current substrate node.

This method must be called during the substrate node initialization.

The endpoints argument is a collection of telemetry WebSocket servers with a corresponding verbosity level.

The connection_message argument is a JSON object that is sent every time the connection (re-)establishes.

source
pub fn handle(&self) -> TelemetryHandle
Make a new cloneable handle to this Telemetry. This is used for reporting telemetries.

The telemetry information includes details about the hardware and software running on the node, including:

- The exact CPU model.

- The total amount of memory, in bytes.

- The number of physical CPU cores.

- The Linux kernel version.

- The exact Linux distribution used.

- Whether the node’s running under a virtual machine.


If multiple Substrate nodes are running in the same process, the `TelemetryWorker` uses a tracing::Span trait to identify which Substrate node is reporting the data. 
Every task spawned using sc-service’s TaskManager automatically inherits this span.

By default, when you start a Substrate node, the node initializes a [Telemetry](https://paritytech.github.io/substrate/master/sc_telemetry/struct.Telemetry.html) data structure instance that can be used to send telemetry messages.
The `Telemetry` instance connects to the remote endpoints the node should send data to and sets up a `TelemetryWorker` thread to run in the background. 
The `TelemetryWorker` registers a new `TelemetryWorkerHandle` to use for asynchronous communication with the running TelemetryWorker dedicated to registration. 
Registering can happen at any point in time during the process execution.

Metrics and dashboards

Block production
Throughput
Network activity and performance

Alerting on bad behavior
