---
title: Building block process
description:
keywords:
---

### Extrinsics in a block produced locally

If a signed or unsigned transaction is included in a block produced by the local node, its lifecycle follows a path like this:

1. Some node listens for transactions on the network.
1. The node receives an RPC request for a signed transaction.
1. Some runtime API is used for the client to verify that the transaction meets its requirements and is valid.
1. Only if the transaction is valid will it be put in a transaction queue ready for block authors.
1. Once in the ready queue, the same runtime API is used to order the transaction according to some priority factor.
1. The node uses transactions in this queue to construct a block and propagate it to peers over the network.

Notice that transactions are not removed from the ready queue when blocks are authored, but removed _only_ on block import.
This is due to the possibility that a recently-authored block might not make it into the canonical chain.
Inherents don't follow the same execution path: they are included in every block without fail.

### Extrinsics in a block received from network

1. The node receives notification of the new block.
1. Other nodes also construct this block and publish it to the network.
1. A 2/3 majority of nodes reach consensus that this block is part of the canonical chain.
1. All other nodes on the network receive and build the block.
1. All transactions in that block are executed and state changes are updated in runtime storage.
