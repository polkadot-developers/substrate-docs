---
title: archive
description:
keywords:
---

The `archive` program is used to index all blocks, state, and transaction data for a Substrate-based chain and store the indexed data in a relational SQL database.
The database created by the `archive` program mirrors all data from a running Substrate blockchain.
After you archive the data, you can use the database to query and retrieve information about the blockchain state.
For examples of queries you might want to run against a Substrate archive database, see [Useful queries](https://github.com/paritytech/substrate-archive/wiki/Useful-Queries).

## Before you begin

Before you use `archive` to create a database for a Substrate-based chain, you need to prepare your environment with the required files:

* You must have PostgreSQL installed on the computer where you are running s Substrate node.
  
  You can download PostgreSQL packages for different platforms from the PostgreSQL [Downloads](https://www.postgresql.org/download/) page.
  
  Depending on your platform, you might be able to install PostgreSQL using a local package manager.
  For example, you can install a PostgreSQL package on a macOS computer by running `brew install postgresql` in a Terminal.

* You must have RabbitMQ or Docker Compose installed on the computer where you have PostgreSQL installed.
    
  Depending on your platform, the instruction and system requirements for installing RabbitMQ or Docker can vary. 
  For information about using [RabbitMQ](https://www.rabbitmq.com/) or [Docker(docker.com)], see the [Setup](https://github.com/paritytech/substrate-archive/wiki/1-Setup) `substrate-archive` wiki page.

* Your Substrate chain must use RocksDB as its backend database.

## Install and configure

To install the  `substrate-archive-cli` program:

1. Open a terminal shell on your computer.

1. Clone the `substrate-archive` repository by running the following command:
    
    ```
    git clone https://github.com/paritytech/substrate-archive.git
    ```

1. Change to the root directory of the `substrate-archive` repository by running the following command:
    
    ```
    cd substrate-archive
    ```

1. Start the PostgreSQL database (`postgres`) and Postgre administrative process (`pgadmin`) on the Substrate node.
    
    If you have Docker Compose, you can start the services automatically by running the `docker-compose up -d` command.

1. Start your Substrate node, with `pruning` set to archive. For example: 
`./target/release/node-template --pruning=archive`

1. Look at the current DBs:
    `psql -U postgres -hlocalhost -p6432`

1. Run `DATABASE_URL=postgres://postgres:123@localhost:6432/local_chain_db sqlx` database create in `substrate-archive/src` to create the database. 

1. Set `CHAIN_DATA_DB="<your_path>"`.

1. Set up your `archive.conf` file:

    - make sure to set your base bath to primary DB
    - tell it where the rocksdb is. State using CHAIN_DATA_DB
    - secondary DB is an optimization
    - postgres url (set to var if in prod)

1. (Optional) setup up logging and debugging.

1. Run a node template. Make sure you run it in `--release --dev base-path=/tmp/dir --pruning=archive`

1. Make a transaction with your node template.

1. Start up the `substrate-archive` node for your target chain:
    `cargo run --release --  -c archive-conf.toml --chain=polkadot`

1. Go to PGAdmin URL: `localhost:15643/browser/#`.

1. Look at the reference to start making your queries.


## {additional context - optional}

## Basic command usage

The basic syntax for running {`tool`} commands is:

`tool [subcommand] [flag]`

### Flags

You can use the following optional flags with the {`tool`} command.

### Subcommands

You can use the following subcommands with the {`tool`} command. 
For reference information and examples that illustrate using {`tool`} subcommands, select an appropriate command.

| Command | Description
| ------- | -----------
|  |  
|  |

### Output

Depending on the subcommand you specify, the output from the {`tool`} program displays some or all of the following information:

| This field | Contains
| ---------- | ----------
|  |
|  |

### Examples

To {_describe some use_}, run the following command:

`tool --use`

## {specific subcommand}

Use the {tool subcommand} command to {_what the subcommand does_}.

#### Basic usage

`tool subcommand [FLAGS] [OPTIONS] <signature> <uri>`

#### Flags

You can use the following optional flags with the {`tool subcommand`} command.

| Flag   | Description
| ------ | -----------
|        |

#### Options

You can use the following command-line options with the {`tool subcommand`} command.

| Option   | Description
| -------- | -----------
|          |
|          |

#### Examples

{2-3 examples on ways to use this subcommand and any relevant explanations}