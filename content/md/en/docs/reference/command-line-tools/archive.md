---
title: archive
description: Command-line reference information for the archive program.
keywords:
---

The `archive` program is used to index all blocks, state, and transaction data for a Substrate-based chain and store the indexed data in a relational SQL database.
The database created by the `archive` program mirrors all data from a running Substrate blockchain.
After you archive the data, you can use database tools to query and retrieve information from the SQL database about the blockchain state.
For examples of queries you might want to run against a Substrate archive database, see [Useful queries](https://github.com/paritytech/substrate-archive/wiki/Useful-Queries).

## Before you begin

Before you use `archive` to create a database for a Substrate-based chain, you need to prepare your environment with the required files:

- You must have PostgreSQL installed on the computer where you are running a Substrate node.

  You can download PostgreSQL packages for different platforms from the PostgreSQL [Downloads](https://www.postgresql.org/download/) page.

  Depending on your platform, you might be able to install PostgreSQL using a local package manager.
  For example, you can install a PostgreSQL package on a macOS computer by running `brew install postgresql` in a Terminal.

- You must have RabbitMQ or Docker Compose installed on the computer where you have PostgreSQL installed.

  Depending on your platform, the instruction and system requirements for installing RabbitMQ or Docker can vary.
  For information about using [RabbitMQ](https://www.rabbitmq.com/) or [Docker](https://www.docker.com/), see the [Setup](https://github.com/paritytech/substrate-archive/wiki/1-Setup) `substrate-archive` wiki page.

- Your Substrate chain must use RocksDB as its backend database.

## Install and configure

To install the `substrate-archive-cli` program:

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

1. Start your Substrate node, with `pruning` set to archive. 
   
   For example:
   
   ```
   ./target/release/node-template --pruning=archive
   ```

2. Look at the current DBs:
   `psql -U postgres -hlocalhost -p6432`

3. Run `DATABASE_URL=postgres://postgres:123@localhost:6432/local_chain_db sqlx` database create in `substrate-archive/src` to create the database.

4. Set `CHAIN_DATA_DB="<your_path>"`.

5. Set up your `archive.conf` file:

   - make sure to set your base bath to primary DB
   - tell it where the rocksdb is. State using CHAIN_DATA_DB
   - secondary DB is an optimization
   - postgres url (set to var if in prod)

6. (Optional) setup up logging and debugging.

7. Run a node template. Make sure you run it in `--release --dev base-path=/tmp/dir --pruning=archive`

8.  Make a transaction with your node template.

9.  Start up the `substrate-archive` node for your target chain:
   `cargo run --release -- -c archive-conf.toml --chain=polkadot`

11. Open a web browser and log in to the Postgres administrative console.
   
   - Default URL:  localhost:16543
   - Default user name: pgadmin4@pgadmin.org
   - Default password: admin


12. Look at the reference to start making your queries.

