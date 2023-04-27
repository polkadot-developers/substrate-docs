---
title: Deployment options and tools
description:
keywords:
---

As you saw in [Common deployment targets](/deploy/prepare-to-deploy#common-deployment-targets), there are several common deployment scenarios.
How you go about managing the nodes for the services you provide depends a great deal on whether you are deploying on physical hardware, using a cloud provider, or configuring a Kubernetes cluster.
This section describes some of the most common options and tools for deploying and managing nodes in different environments.

## Linux servers

If you are deploying on physical or virtual machines that use a distribution of the Linux operating system, you typically use `systemd` to manage most services.
You can use `systemd` to ensure processes are enabled and running, set policies for restarting services, specify the user account for hosts to run under, and configure system parameters to limit memory usage and other properties.

The following example illustrates configuring the `systemd` file for a node running a local development chain using the account associated with Alice and the local user name `polkadot`:

```text
[Unit]
Description=Polkadot Validator

[Service]
User=polkadot
ExecStart=/home/polkadot/polkadot  --dev --alice
Restart=always
RestartSec=90

[Install]
WantedBy=multi-user.target
```

For demonstration purposes, this file is named `polkadot.service` and placed in the `/etc/systemd/system` directory.
You can then enable the service by running the following command:

```bash
systemctl enable polkadot
```

To start the service after it's enabled, you can run the following command:

```bash
systemctl start polkadot
```

### Using environment variables

If you want to remove some settings from the `systemd` configuration—for example, the `--dev` and `--alice` command-line options—you can configure those settings in an **environment variable** file.
With environment variable files, you can configure the appropriate settings for each server—in its own server-specific file—but still manage the service using `systemd` commands.
In this example, you would create a new environment variable file for the local host in `/etc/default/polkadot` that looks like this:

```text
START_OPTIONS="--dev --alice"
```

You would then modify the `systemd` service to look like this:

```text
[Unit]
Description=Polkadot Validator

[Service]
User=polkadot
EnvironmentFile=/etc/default/polkadot
ExecStart=/home/polkadot/polkadot  $START_OPTIONS
Restart=always
RestartSec=90

[Install]
WantedBy=multi-user.target
```

You can use this technique with multiple variables to abstract the configuration details away from the `systemd` file that runs on your node hosts.

### Local logging

By default, the `systemd` service writes output to the local `syslog` file, typically `/var/log/syslog` or `/var/log/messages`.
You can also view this output using the `journalctl` command.
For example, to see the most recent output of the `polkadot` process, you can run the following command:

```bash
journalctl -u polkadot -f
```

To remove logs older than two days ago, you can run a command similar to the following:

```bash
journalctl -u polkadot --vacuum-time=2d
```

To retain only the past 1G of data, run:

```bash
journalctl --vacuum-size=1G
```

### Remote logging

If your deployment includes many hosts, you can use Loki or Elasticsearch to aggregate the data from multiple sources.

#### Loki

To log to a remote `loki` instance:

1. Install the `promtail` server package on each server.
2. Create the configuration file that specifies the server and client information to enable each server to send logs to a remote host.

   For example:

   ```yaml
   # promtail server config
   server:
      http_listen_port: 9080
      grpc_listen_port: 0
      log_level: info
   positions:
      filename: /var/lib/promtail/positions.yaml

   # loki servers
   clients:
      - url: http://myloki.mycompany.com/loki/api/v1/push
        backoff_config:
           min_period: 1m
           max_period: 1h
           max_retries: 10000
   scrape_configs:
      - job_name: journald
        journal:
           max_age: 1m
           path: /var/log/journal
           labels:
              job: journald
        pipeline_stages:
           - match:
             selector: '{job="journald"}'
             stages:
             - multiline:
                  firstline: '^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}'
                  max_lines: 2500
             - regex:
                  expression: '(?P<date>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})\s+(?P<level>(TRACE|DEBUG|INFO|WARN|ERROR))\s+(?P<worker>([^\s]+))\s+(?P<target>[\w-]+):?:?(?P<subtarget>[\w-]+)?:[\s]?(?P<chaintype>\[[\w-]+\]+)?[\s]?(?P<message>.+)'
             - labels:
                  level:
                  target:
                  subtarget:
   ```

#### Elasticsearch

To log to a remote Elasticsearch cluster:

1. Install the `logstash` package.
2. Create the configuration file that specifies the server and client information to enable each server to send logs to a remote host.
   An example configuration would look like this:

   ```text
   nput {
     journald {
       path      => "/var/log/journal"
       seekto => "tail"
       thisboot => true
       filter    => {
           "_SYSTEMD_UNIT" => "polkadot.service"
       }
       type => "systemd"
     }
   }

   filter {
     date {
       match => ["timestamp", "YYYY-mm-dd HH:MM:ss.SSS"]
       target => "@timestamp"
     }
     mutate {
       rename => [ "MESSAGE", "message" ]
       remove_field => [ "cursor", "PRIORITY", "SYSLOG_FACILITY", "SYSLOG_IDENTIFIER", "_BOOT_ID", "_CAP_EFFECTIVE", "_CMDLINE", "_COMM", "_EXE", "_GID", "_HOSTNAME", "_MACHINE_ID", "_PID", "_SELINUX_CONTEXT", "_STREAM_ID", "_SYSTEMD_CGROUP", "_SYSTEMD_INVOCATION_ID", "_SYSTEMD_SLICE", "_SYSTEMD_UNIT", "_TRANSPORT", "_UID" ]
     }
     if ([message] =~ ".*TRACE .*") { drop{ } }
     grok {
        match => { "message" => "%{NOTSPACE:thread} %{LOGLEVEL:log-level} %{NOTSPACE:namespace} %{GREEDYDATA:message}" }
     }
   }

   output {
      elasticsearch {
        hosts => ["https://myelasticsearch.mycompany.com:9243"]
        user => "username"
        password => "password"
        index => "logstash-polkadot-%{+YYYY.MM.dd}"
      }
   }

### Logging command-line options

When you start a node, you can use command-line options to specify the log level and target components you want to log activity for.
All target components are set to the `info` logging level by default.
You can adjust log levels for individual components using the `--log` or `-l` command-line option.
For example, to change the logging level for the afg and sync components:

```bash
--log afg=trace,sync=debug
```

To change the logging level to `debug` for all components:

```bash
-ldebug.
```

The valid log levels from least to most verbose are `error`, `warn`, `info`, `debug`, and `trace`.

The valid targets for logging are:

```text
afg
aura
babe
beefy
db
gossip
header
peerset
pow
rpc
runtime
runtime::contracts
sc_offchain
slots
state-db
state_tracing
sub-libp2p
sync
telemetry
tracing
trie
txpool
```

## Cloud provisioning

There are multiple options for provisioning nodes on cloud providers.
Some of the tools for deploying using cloud resources are provider-specific and some tools are provider-agnostic.

The following provider-specific tools are the most commonly-used for deploying on AWS, Microsoft Azure, or Google Cloud:

- [Amazon Cloud Formation](https://aws.amazon.com/cloudformation/)
- [Azure Resource Manager](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview)
- [Google Cloud Deployment Manager](https://cloud.google.com/deployment-manager/docs)

These provider-specific deployment tools are easy to use and provide important resources, including sample code, documentation, and support.
However, if you use more than one multiple provider—each with its own scripting format and configuration requirements—making even basic changes to your infrastructure can require changes to multiple sections of code for each provider to do the same thing.

As an alternative to provider-specific tooling, [Terraform](https://www.terraform.io/) offers a more general solution to infrastructure provisioning.
With Terraform, you can specify a change once and apply the change across multiple providers.

### Terraform

Terraform uses the [HashiCorp Configuration Language (HCL)](https://developer.hashicorp.com/terraform/language) to support more than 2000 different cloud resource [providers](https://registry.terraform.io/browse/providers), including the main three providers AWS, Azure, and GCP.

The configuration language enables you to abstract configuration details and use the same code for development, test, and production environments regardless of the provider you use and manage all changes to your infrastructure through source code version control.
Terraform also enables you to incorporate independent resources into your infrastructure using a common language.
For example, you can deploy RPC nodes along with a frontend load balancer using a single configuration file.

After you prepare a host for deployment, you can use Terraform to preconfigure the host with required software from an image or run a script that preconfigures the base image.

You can find examples of using Terraform with multiple providers in [polkadot-validator-setup](https://github.com/w3f/polkadot-validator-setup).


### Ansible

After base hosts are deployed, they must be configured with the required software components, configuration files, and system settings.
In addition to Terraform or cloud provider tooling, Ansible provides another flexible way you can automate infrastructure deployment.

Ansible uses **playbooks** to orchestrate, configure, administer, and deploy system components.
Using a combination of playbooks and **roles**, you can implement a specific configuration or behavior for a group of nodes.

When deploying blockchain nodes, Ansible enables you to define an **inventory** that describes the hosts and how to group the hosts according to their role—for example, in groups that identify hosts as validator, collator, or rpc nodes.
You can then call a playbook to link the hosts and groups in the inventory with roles to execute on each host.

You can find examples of using ansible in [ansible-galaxy](https://github.com/paritytech/ansible-galaxy) and the [node role](https://github.com/paritytech/ansible-galaxy/tree/main/roles/node).

## Kubernetes

You should only deploy on a Kubernetes cluster if you have previous experience managing Kubernetes configurations.
The main tools for managing Substrate-based nodes in Kubernetes are **helm charts** that you can use to deploy nodes and the **Testnet Manager** that you can use to deploy and maintain test networks in a Kubernetes cluster.
Note that you must have access to a Kubernetes cluster, a local copy of `kubectl`, and Helm installed before you can use these tools.

### Helm charts

[Parity Helm Charts](https://github.com/paritytech/helm-charts) is a collection of helm charts that define, install, manage, and upgrade Substrate and Polkadot components.
Within the collection, the [node](https://github.com/paritytech/helm-charts/tree/main/charts/node) chart is used to deploy substrate or polkadot node binary.
All of the parameters for the chart are documented in the [node chart README.md](https://github.com/paritytech/helm-charts/tree/main/charts/node).

The most important parameters to be aware of are:

| Option | Description
|:-------|:-----------
| node.chain | Network to connect to.
| node.command | Binary to use.
| node.flags	| Command-line options to use with the binary in the container.
| node.customChainspecUrl | Custom chain specification URL.

There’s also an example `values.yml` configuration file that you can start working from.

The following example illustrates how to deploy a `rococo-local` test network chain in Kubernetes with two validators and two full nodes.

To deploy the `rococo-local` chain using the helm chart:

1. Verify you have access to a Kubernetes cluster and the Helm client installed.
2. Add the Parity chart repository to Helm by running the following command:

   ```bash
   helm repo add parity https://paritytech.github.io/helm-charts/
   ```

3. Install the node chart by running the following command:

   ```bash
   helm install polkadot-node parity/node
   ```

4. Deploy the validator node using the Alice account and a custom node key by running the following command:

   ```bash
   helm install rococo-alice parity/node --set node.role="validator" \
      --set node.customNodeKey="91cb59d86820419075b08e3043cd802ba3506388d8b161d2d4acd203af5194c1" \
      --set node.chain=rococo-local \
      --set node.perNodeServices.relayP2pService.enabled=true \
      --set node.perNodeServices.relayP2pService.port=30333 \
      --set node.flags="--alice --rpc-external --ws-external --rpc-cors all --rpc-methods=unsafe"
   ```

   This command deploys the node `alice` as a stateful service with an example custom node key and with a service to be used as a boot node for all other hosts.

5. Deploy the validator node using the Bob account and `alice` as a boot node by running the following command:

   ```bash
   helm install rococo-bob parity/node --set node.role="validator" \
      --set node.chain=rococo-local \
      --set node.flags="--bob --bootnodes '/dns4/rococo-alice-node-0-relay-chain-p2p/tcp/30333/p2p/12D3KooWMeR4iQLRBNq87ViDf9W7f6cc9ydAPJgmq48rAH116WoC'"
   ```

   After both validators are running, the chain should start producing blocks.

6. Deploy two full nodes by running the following command:

   ```bash
   helm install rococo-pool parity/node --set node.chain=rococo-local \
      --set node.replicas=2 \
      --set node.flags="--bootnodes '/dns4/rococo-alice-node-0-relay-chain-p2p/tcp/30333/p2p/12D3KooWMeR4iQLRBNq87ViDf9W7f6cc9ydAPJgmq48rAH116WoC'"
   ```

   After completing these steps, you have a working `rococo-local` test chain with two validators and two full nodes.

The following tools—listed from simplest to most advanced are useful for managing helm releases.

- [Helmfile](https://github.com/roboll/helmfile)
- [Terraform Helm provider](https://registry.terraform.io/providers/hashicorp/helm/latest/docs)
- [Flux CD](https://fluxcd.io/)
- [ArgoCD](https://argo-cd.readthedocs.io/en/stable/)

## Docker

If you are deploying nodes as virtual machines in a network, you can use Docker images to prepare the node configuration for different types of nodes.
For example, you can prepare Docker images for validator nodes and RPC provider nodes then deploy multiple nodes of each type without configuring a separate virtual machine for each node.
External node operators can then use the Docker images you provide to deploy new nodes whenever and wherever they are needed.

### Sample Dockerfile

The following sample Dockerfile illustrates the best practices for building the Docker image in a secure way that minimizes the attack surface.
This example is similar version to the Dockerfile used to create the official Polkadot images.
You can also consult Docker documentation for additional information about [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/).

```dockerfile
# This is an example build stage for the node template. Here we create the binary in a temporary image.

# This is a base image to build substrate nodes
FROM docker.io/paritytech/ci-linux:production as builder

WORKDIR /node-template
COPY . .
RUN cargo build --locked --release

# This is the 2nd stage: a very small image where we copy the binary."
FROM docker.io/library/ubuntu:20.04
LABEL description="Multistage Docker image for Substrate Node Template" \
  image.type="builder" \
  image.authors="you@email.com" \
  image.vendor="Substrate Developer Hub" \
  image.description="Multistage Docker image for Substrate Node Template" \
  image.source="https://github.com/substrate-developer-hub/substrate-node-template" \
  image.documentation="https://github.com/substrate-developer-hub/substrate-node-template"

# Copy the node binary.
COPY --from=builder /node-template/target/release/node-template /usr/local/bin

RUN useradd -m -u 1000 -U -s /bin/sh -d /node-dev node-dev && \
  mkdir -p /chain-data /node-dev/.local/share && \
  chown -R node-dev:node-dev /chain-data && \
  ln -s /chain-data /node-dev/.local/share/node-template && \
  # unclutter and minimize the attack surface
  rm -rf /usr/bin /usr/sbin && \
  # check if executable works in this container
  /usr/local/bin/node-template --version

USER node-dev

EXPOSE 30333 9933 9944 9615
VOLUME ["/chain-data"]

ENTRYPOINT ["/usr/local/bin/node-template"]
```

### Automated build pipeline

The following sample [GitHub action](https://github.com/substrate-developer-hub/substrate-node-template/blob/main/.github/workflows/build-publish-image.yml) builds and publishes a Docker image to DockerHub.
In most cases, you trigger this action using a manual workflow or when a new release is published.

Note that you must add secrets to your GitHub repository or organization as described in [Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) to publish images securely.
You'll also need to save the credentials for your DockerHub account in your GitHub secrets.
If you instead want to use another image repository—for example, the GitHub image registry—you can amend the _Build and push Docker images_ step.

```yaml
# You need to add the following secrets to your GitHub Repository or Organization to make this work
# - DOCKER_USERNAME: The username of the DockerHub account. E.g. parity
# - DOCKER_TOKEN: Access token for DockerHub, see https://docs.docker.com/docker-hub/access-tokens/. E.g. VVVVVVVV-WWWW-XXXXXX-YYYY-ZZZZZZZZZ
# The following are setup as an environment variable below
# - DOCKER_REPO: The unique name of the DockerHub repository. E.g. parity/polkadot

name: Build & Publish Docker Image

# Controls when the action will run.
on:
  # Triggers the workflow on push events but only for the main branch
  # push:
    # branches: [ main ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Set an environment variable (that can be overriden) for the Docker Repo
env:
  DOCKER_REPO: parity/polkadot

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-22.04

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - name: Check out the repo
        uses: actions/checkout@v2.5.0

      # Login to Docker hub using the credentials stored in the repository secrets
      - name: Log in to Docker Hub
        uses: docker/login-action@v2.1.0
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}

      # Get the commit short hash, to use as the rev
      - name: Calculate rev hash
        id: rev
        run: echo "value=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

      # Build and push 2 images, One with the version tag and the other with latest tag
      - name: Build and push Docker images
        uses: docker/build-push-action@v3.2.0
        with:
          context: .
          push: true
          tags: ${{ env.DOCKER_REPO }}:v${{ steps.rev.outputs.value }}, ${{ secrets.DOCKER_REPO }}:latest
```
