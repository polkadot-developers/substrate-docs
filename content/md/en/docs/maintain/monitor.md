---
title: Monitor
description:
keywords:
---

Monitoring network operations and performance is an important part of maintaining a healthy, stable, and secure ecosystem.
By default, Substrate nodes provide low-level **telemetry** components to automatically collect and transmit detailed information about the operation of each node in the network.
Telemetry is the underlying mechanism—sensors, probes, or instrumentation—for collecting and transmitting data points as they occur to an endpoint so that you can observe, monitor, and alert on system behavior.

As a developer or node operator, there's rarely any need to know the implementation details of how these low-level telemetry components provide information about computer and network operations.
At a high level, the information collected from each public node is sent to a default telemetry server and aggregated for display in a front-end dashboard.

The following diagram provides a simplified overview of the workflow.

![Default telemetry for Substrate nodes](/media/images/docs/telemetry-overview.png)

## View telemetry data

The [Polkadot telemetry](https://telemetry.polkadot.io/) dashboard provides a real-time view of how currently online nodes are performing.
You can choose the information you want to display by turning visible columns on and off from the list of columns available.

To see the list of columns and modify which columns are displayed, click **Settings**.

![Click Settings to modify the visible columns](/media/images/docs/list-view-control.png)

The columns you can toggle on and off include:

- **Validator** to display an indicator to differentiate validator nodes from other nodes. 
- **Location** to display the location of a node.
- **Implementation** to display the version of the software running on the node.
- **Network ID** to display the public network identifier for the node.
- **Peer Count** to display the number of peers connected to the node.
- **Transactions in Queue** to display the number of transactions in the Ready queue waiting for a block author.
- **Upload Bandwidth** to display a graph of recent upload activity in MB per second.
- **Download Bandwidth** to display a graph of recent download activity in MB per second.
- **State Cache Size** to display a graph of the state cache size in MB.
- **Block** to display the current best block number for the node to ensure it's staying synchronized with its peers.
- **Block Hash** to display the block hash for the current best block number for the node.
- **Finalized Block** to display the most recently finalized block number for the node to ensure it's staying synchronized with its peers.
- **Finalized Block Hash** to display the block hash for the most recently finalized block number for the node.
- **Block Time** to display the block execution time between blocks.
- **Block Propagation Time** to display the time it took for the node to import the most recent block.
- **Last Block Time** to display the time it took for the node to author the most recent block.
- **Node Uptime** to display the number of days the node has been online without being restarted.

### Pin node information

You can keep the information for one or more nodes in view in the dashboard by clicking the line displayed for the node in the dashboard list.
For example, if you want to keep the information for two nodes visible while the information for other nodes scrolls by, you can select the nodes in the list and pin the information in place.

![Keep information for selected nodes displayed](/media/images/docs/pin-nodes.png)

### Display nodes on a map

As an alternative to the list of nodes, you can display nodes on a global map.
The map provides a visual representation of where nodes are located, where blocks are being produced and imported in real time, and where there are higher concentrations of nodes geographically.

To see represented on a map, click **Map**.

![Display nodes on a global map](/media/images/docs/node-map-view.png)

In this view, you can hover over any node location on the map to display a subset of the information available for the node, including the node name, location, best block number, best block hash, and block time statistics.

### Display node statistics

In addition to the information available for individual nodes, you can view statistics that describe the number and percentage of nodes that share specific attributes.
For example, you can see the percentage of nodes that are using each release of Polkadot, the percentage of nodes using the Linux operating system and the most common distributions currently deployed.
You can also view statistics about the CPU and memory configuration across nodes in the network.

To see the full set of statistics available, click **Statistics**.

![View statistics across nodes](/media/images/docs/node-statistics.png)

The statistics available include details about the hardware and software running on the nodes in the network, including:

- Software version.
- Operating system.
- CPU architecture and model.
- Number of physical CPU cores.
- Total memory.
- Whether the node is a virtual machine.
- Linux distribution and kernel version.
- CPU and memory speed.
- Disk speed.

### Filter by chain

By default, the telemetry dashboard displays information about Polkadot and provides quick links to a subset of other chains.
To display information for other chains, click **More** and select a different chain. 

![Select other chains](/media/images/docs/more-chains.png)

## Change the telemetry server

You can use the `--telemetry-url` command-line option when you start a node to specify the telemetry server that you want to send telemetry data to.
You can pass this option multiple times to specify multiple telemetry endpoints. Verbosity levels range from 0-9, with 0 denoting the least verbose. Use the following format to specify the URL followed the verbosity option is `--telemetry-url 'wss://foo/bar 0'`.

## Disable telemetry 

Telemetry is enabled for all global chain nodes by default.
You can use the `--no-telemetry` command-line option to prevent a node from connecting to the Substrate telemetry server.
