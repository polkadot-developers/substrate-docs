---
title: Ethereum integration
description:
keywords:
---

By using crates from the Frontier project and adding the EVM and Ethereum pallets to your runtime, you can build a Substrate-based blockchain that supports Ethereum-based accounts and and allows for the execution of Solidity-based smart contracts.

The Ethereum Virtual Machine (EVM) is a virtual computer with the components that enable Ethereum network participants to store data and agree on the state of the data.
For a Substrate-based blockchain, the core responsibilities of the EVM are implemented in the
**EVM pallet**.
The EVM pallet is responsible for executing Ethereum contract bytecode for smart contracts that are written in a high level language like Solidity, then compiled to EVM bytecode.
The following diagram provides a simplified overview to illustrate how the EVM pallet and Ethereum RPC calls can be integrated into your Substrate runtime.

![Ethereum-compatible runtime architecture](/media/images/docs/tutorials/evm-ethereum/pallet-evm.png)

In addition to the EVM pallet, an Ethereum pallet is responsible for storing Ethereum-formatted blocks, transaction receipts, and transaction statuses.
When a user submits a raw Ethereum transaction, the transaction is first converted into a Substrate transaction by calling the `transact` function in the `pallet_ethereum` in the runtime.

![Ethereum pallet](/media/images/docs/tutorials/evm-ethereum/pallet-ethereum.png)

Note that Ethereum accounts and Substrate accounts are not directly compatible for using a single private key.
For information about mapping Ethereum accounts and keys to Substrate accounts and keys, see [Unified Accounts](https://docs.moonbeam.network/learn/unified-accounts/#substrate-evm-compatible-blockchain) in the Moonbeam documentation.

## Ethereum-specific runtime APIs and RPCs

The runtime stores all of the Ethereum-formatted information that can be queried.
You can call into the runtime and retrieve that information using the node RPC server and runtime API and RPC client calls.

![Remote procedure calls to access Ethereum-formatted information](/media/images/docs/tutorials/evm-ethereum/rpc.png)

## Frontier block import

![Block import process](/media/images/docs/tutorials/evm-ethereum/block-import.png)

## Where to go next

- [Moonbeam: Ethereum compatibility](https://docs.moonbeam.network/learn/features/eth-compatibility/)
- [Ethereum virtual machine (EVM)](https://ethereum.org/en/developers/docs/evm/)
- [Access EVM accounts](/tutorials/integrate-with-tools/access-evm-accounts/)
- [Substrate EVM utilities](https://github.com/paritytech/frontier/blob/master/template/utils/README.md#substrate-evm-utilities)
- [Frontier rpc and rpc-core](https://github.com/paritytech/frontier/tree/master/client/)
- [Frontier consensus](https://github.com/paritytech/frontier/tree/master/primitives/consensus)
