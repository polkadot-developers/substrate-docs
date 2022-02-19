Substrate provides tools to build all types of blockchain networks and protocols. 
This implies application specific networks and nodes.

## Networks 

Network architectures can fall into the following categories:

- Relay chains: these Substrate blockchains are desgined to provide decentralized security to other chains connected to it. 
Polkadot is an example of such a chain.
- Parachains: parachains are blockchains built to connect to some relay chain. Such chains need to implement the same consenus protocol as the relay chain they target.
- Solo-chains: these Substrate blockchains implement their own security protocol and are independant from any other chain.
They could connect to other Substrate blockchains but would have to implement their own communication channels.

For every type of chain, there are two types of testing networks: economically bearing test networks called canary networks or non-economically bearing test networks.

[ TODO: Diagrams / illustrations for each type of chain ]

## Types of nodes

Installing a Substrate node is necessary when developing runtimes locally.
Substrate provides [CLI flags](/todo) to specify different behavior for how a node runs. 
For example, when running a node with the `--dev` flag, a temporary directory gets created to store state while the chain is running and gets purged each time the chain is killed. 
In production there could be different use cases to run specific types of nodes.

Nodes provide ways to query on-chain state and write to it.
There are three types of nodes you can run with any Substrate chain:

- Archive node: keeps a history of all the states of all blocks. An archive node is typically used for applications that require querying block state at any point in time, such as block explorers and app wallets for example.
- Full node: discards all finalized blocks older than some configurable number of blocks (256 by default), with the exception of the genesis block. A full node is pruned which requires much less space than an archive node.
- Light node: has only the runtime and current state. Light nodes are fast and ideal for devices with limited resources.

It is possible to rebuild the state of the entire blockchain by using a full node and executing all the blocks from the genesis block. 
However, a full node requires more compution to query state or retrieve information about some previous state.  
On the other hand, an archive node requires less computation for querying state.

## Run a node

Polkadot provides documentation on how to run an archive node [here](https://wiki.polkadot.network/docs/maintain-sync#running-an-archive-node). 

[ TODO: move and link to it in Deploy section]

Here are the CLI flags to specify the node type you want to run (using the `--help` flag on a nodes executable):

```bash
        --pruning <PRUNING_MODE>
            Specify the state pruning mode, a number of blocks to keep or 'archive'.
            
            Default is to keep all block states if the node is running as a validator (i.e. 'archive'), otherwise state
            is only kept for the last 256 blocks.
        
        --keep-blocks <COUNT>
            Specify the number of finalized blocks to keep in the database.
            
            Default is to keep all blocks.

        --light                            
            Experimental: Run in light client mode.
```

