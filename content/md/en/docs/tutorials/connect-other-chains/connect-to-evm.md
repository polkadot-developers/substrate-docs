---
title: "Connect to Ethereum"
description: "Illustrates how to build an Ethereum-compatible blockchain with Substrate."
---

This tutorial illustrates how to build an **Ethereum-compatible** blockchain with Substrate using crates from the [Frontier](https://github.com/paritytech/frontier) project.
The goal of the Frontier is to enable you to run Ethereum dapps unmodified using local nodes and import state from Ethereum mainnet.

## Before you begin

You should have completed _at least_ the following three Substrate tutorials before attempting this tutorial:

- [Build a local blockchain](/tutorials/get-started/build-local-blockchain/)
- [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet/)
- [Use macros in a custom pallet](/tutorials/work-with-pallets/custom-pallet/)

You should also be familiar with the following concepts:

- Launching a Substrate chain
- Submitting transactions
- Adding, removing, and configuring pallets in a runtime
- Ethereum and EVM basics
- Pallet design

You should note that parts of this tutorial refer to an older version of the Substrate node template and might be inconsistent with the version of the code you are using.
You should also note that the Frontier project uses its own versions of Substrate
crates and you might need to update the dependencies in your `Cargo` files.
You must use the _matching_ versions of Substrate and Frontier dependencies in your project.

## Compile a Frontier node

The [Frontier node template](https://github.com/substrate-developer-hub/substrate-node-template) provides a working development environment so that you can start building on Substrate right away.

To compile the Frontier node template:

1. Open a terminal shell on your computer.

1. Clone the node template repository by running the following command:

   ```bash
   git clone https://github.com/paritytech/frontier.git
   ```

1. Change to the root of the node template directory and checkout the `latest` branch by running the following command:

   ```bash
   cd frontier/template
   ```

1. Compile the node template by running the following command:

   ```bash
   cargo build --release
   ```

### Generating a node template

As an alternative to using the pre-built Frontier template, you can generate a stand-alone template for use in an independent project by running the
[template generation script](https://github.com/paritytech/frontier/blob/master/.maintain/node-template-release.sh).

```bash
# from the top working dir of Frontier:
cd .maintain/
# set the *full file name with .tar.gz extension* for your output file
./node-template-release.sh TEMPLATE.tar.gz
# Note the file will be placed in the top level working dir of frontier
# Move the archive to wherever you like...
tar xvzf TEMPLATE.tar.gz
# this unpacks into `frontier-node-template` with all your files
cd frontier-node-template
```

The Substrate Developer Hub has generated the template using the [included release guide](https://github.com/paritytech/frontier/blob/master/docs/node-template-release.md), and intends to update with major releases of Frontier moving forward.

You can `use` the pre-generated template or `fork` it from here:
https://github.com/substrate-developer-hub/frontier-node-template/ .

## Genesis configuration

The development [chain spec](https://github.com/paritytech/frontier/blob/master/template/node/src/chain_spec.rs) included with this project defines a genesis block that has been pre-configured with an EVM account for the `alice` account.
When you start [a development chain](https://github.com/substrate-developer-hub/substrate-node-template#run), Alice's EVM account is funded with a large amount of Ether.
You can use the [Polkadot UI](https://polkadot.js.org/apps/#?rpc=ws://127.0.0.1:9944) to see the details of Alice's EVM account.
To view an EVM account, use the `Developer` tab of the Polkadot UI `Settings` app to define the EVM `Account` type as below.
It is also necessary to define the `Address` and `LookupSource` to send transactions, and `Transaction` and `Signature` to be able to inspect blocks:

```json
{
  "Address": "MultiAddress",
  "LookupSource": "MultiAddress",
  "Account": {
    "nonce": "U256",
    "balance": "U256"
  },
  "Transaction": {
    "nonce": "U256",
    "action": "String",
    "gas_price": "u64",
    "gas_limit": "u64",
    "value": "U256",
    "input": "Vec<u8>",
    "signature": "Signature"
  },
  "Signature": {
    "v": "u64",
    "r": "H256",
    "s": "H256"
  }
}
```

## Start the node

To execute the chain, run:

```bash
./target/release/frontier-template-node --dev
```

The node also supports to use manual seal (to produce block manually through RPC).

```bash
./target/release/frontier-template-node --dev --manual-seal
```

## Query balances using RPC

Once your node is running, use the Polkadot JS Apps' `RPC calls` under the `Developer` tab to query `eth > getBalance(address, number)` with Alice's
EVM account ID (`0xd43593c715fdd31c61141abd04a99fd6822c8558`).
The value that is returned should be:

```text
x: eth.getBalance
340,282,366,920,938,463,463,374,607,431,768,211,455
```

> Further reading:
> [EVM accounts](https://github.com/danforbes/danforbes/blob/master/writings/eth-dev.md#Accounts)
> Alice's EVM account ID was calculated using
> [an included utility script](https://github.com/paritytech/frontier/blob/master/template/utils/README.md#--evm-address-address).

## Deploy and call Ethereum smart contracts

To deploy and call Ethereum smart contracts and test the related functionality follow the next steps at:

- [Testing Ethereum Smart Contracts Functionality](#erc20-contract-deployment).

## Architecture

Here are a few helpful diagrams to help illustrate how the Frontier EVM and Ethereum RPC plug into your Substrate FRAME runtime.

### EVM pallet runtime configuration

The Ethereum Virtual Machine (EVM) is a sandboxed virtual stack machine that is implemented in the
EVM pallet. The EVM is responsible for executing Ethereum contract bytecode of smart contracts,
typically written in a high level language like Solidity, then compiled to EVM bytecode.

![architecture diagram](../../../src/images/tutorials/10-frontier-workshop/pallet-evm.png)

### Ethereum pallet

The Ethereum pallet is responsible for storing Ethereum-formatted blocks, transaction receipts, and transaction statuses.

![architecture diagram](../../../src/images/tutorials/10-frontier-workshop/pallet-ethereum.png)

### Wrapping Ethereum transactions

When a user submits a raw Ethereum transaction, we need to convert it into a Substrate transaction. The conversion is simple. We just wrap the raw transaction in a call the `pallet_ethereum`'s `transact` extrinsic. This is done in the runtime.

Note that Ethereum Accounts and Substrate accounts in this template are not directly compatible for using keys. For an explainer on this, please see the [Moonbean documentain on EVM&Substrate Accounts](https://docs.moonbeam.network/learn/unified-accounts/#substrate-evm-compatible-blockchain)

### Ethereum-specific runtime APIs and RPCs

The runtime stores all of the Ethereum-formatted information that can be queried.
You can call into the runtime and retrieve that information using the node RPC server and runtime API and RPC client calls.

![architecture diagram](../../../src/images/tutorials/10-frontier-workshop/rpc.png)

Further reading:

- [Runtime APIs](/v3/concepts/runtime#runtime-apis)
- [Recipe about Custom RPCs](/v3/runtime/custom-rpcs)
- RPCs in Frontier: [fc-rpc](https://github.com/paritytech/frontier/tree/master/client/rpc)
  and [fc-rpc-core](https://github.com/paritytech/frontier/blob/master/client/rpc-core/)

### Frontier block import

![architecture diagram](../../../src/images/tutorials/10-frontier-workshop/block-import.png)

Further reading:

- [Block import pipeline docs](/v3/advanced/block-import)
- [Frontier consensus code](https://github.com/paritytech/frontier/tree/master/primitives/consensus)

## ERC20 contract deployment

The following steps are also available as a [Typescript script](https://github.com/paritytech/frontier/tree/master/template/examples/contract-erc20) using Polkadot JS SDK.

### Contract creation

The [`truffle`](https://github.com/paritytech/frontier/tree/master/template/examples/contract-erc20/truffle) directory contains a [Truffle](https://www.trufflesuite.com/truffle) project that defines [an ERC-20 token](https://github.com/paritytech/frontier/tree/master/template/examples/contract-erc20/truffle/contracts/MyToken.sol).
For convenience, this repository also contains [the compiled bytecode of this token contract](https://github.com/paritytech/frontier/tree/master/template/examples/contract-erc20/truffle/contracts/MyToken.json#L259), which can be used to deploy it to the Substrate blockchain.

> Further reading:
> [the ERC-20 token standard](https://github.com/danforbes/danforbes/blob/master/writings/eth-dev.md#EIP-20-ERC-20-Token-Standard)
> Use the Polkadot UI `Extrinsics` app to deploy the contract from Alice's account (submit the
> extrinsic as a signed transaction) using `evm > create` with the following parameters:

```text
source: 0xd43593c715fdd31c61141abd04a99fd6822c8558
init: <raw contract bytecode, a very long hex value>
value: 0
gas_limit: 4294967295
gas_price: 1
nonce: <empty> {None}
```

The values for `gas_limit` and `gas_price` were chosen for convenience and have little inherent or special meaning.
Note that `None` for the nonce will increment the known nonce for the source account, starting from `0x0`, you may manually set this but will get an "evm.InvalidNonce" error if not set correctly.

Once the extrinsic is in a block, navigate to the `Network` -> `Explorer` tab in the UI, or open up the browser console to see that the EVM pallet has fired a `Created` event with an `address` field that provides the address of the newly-created contract:

```bash
# console:
... {"phase":{"applyExtrinsic":2},"event":{"index":"0x0901","data":["0x8a50db1e0f9452cfd91be8dc004ceb11cb08832f"]} ...
# UI:
evm.Created
A contract has been created at given [address]
   H160: 0x8a50db1e0f9452cfd91be8dc004ceb11cb08832f
```

In this case, however, it is trivial to [calculate this value](https://ethereum.stackexchange.com/a/46960):
`0x8a50db1e0f9452cfd91be8dc004ceb11cb08832f`.
That is because EVM contract account IDs are determined solely by the ID and nonce of the contract creator's account and, in this case, both of those values are well-known (`0xd43593c715fdd31c61141abd04a99fd6822c8558` and `0x0`, respectively).

### Check contract storage

Use the `Chain State` UI tab to query`evm > accountCodes` for both Alice's and the contract's account IDs; notice that Alice's account code is empty and the contract's is equal to the bytecode of the Solidity contract.

The ERC-20 contract that was deployed inherits from [the OpenZeppelin ERC-20 implementation](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol) and extends its capabilities by adding [a constructor that mints a maximum amount of tokens to the contract creator](https://github.com/paritytech/frontier/tree/master/template/examples/contract-erc20/truffle/contracts/MyToken.sol#L8).
Use the `Chain State` app to query `evm > accountStorage` and view the value associated with Alice's account in the `_balances` map of the ERC-20 contract; use the ERC-20 contract address (`0x8a50db1e0f9452cfd91be8dc004ceb11cb08832f`) as the first parameter and the storage slot to read as the second parameter (`0x045c0350b9cf0df39c4b40400c965118df2dca5ce0fbcf0de4aafc099aea4a14`).
The value that is returned should be `0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`.

The storage slot was calculated using [a provided utility](https://github.com/paritytech/frontier/blob/master/template/utils/README.md#--erc20-slot-slot-address). (Slot 0 and alice address: `0xd43593c715fdd31c61141abd04a99fd6822c8558`)

> Further reading:
> [EVM layout of state variables in storage](https://docs.soliditylang.org/en/v0.8.6/internals/layout_in_storage.html#layout-of-state-variables-in-storage)

### Contract usage

Use the `Developer` -> `Extrinsics` tab to invoke the `transfer(address, uint256)` function on the ERC-20 contract with `evm > call` and transfer some of the ERC-20 tokens from Alice to Bob.

```text
target: 0x8a50db1e0f9452cfd91be8dc004ceb11cb08832f
source: 0xd43593c715fdd31c61141abd04a99fd6822c8558
input: 0xa9059cbb0000000000000000000000008eaf04151687736326c9fea17e25fc528761369300000000000000000000000000000000000000000000000000000000000000dd
value: 0
gas_limit: 4294967295
gas_price: 1
```

The value of the `input` parameter is an EVM ABI-encoded function call that was calculated using [the Remix web IDE](http://remix.ethereum.org).
It consists of a function selector (`0xa9059cbb`) and the arguments to be used for the function invocation.
In this case, the arguments correspond to Bob's EVM account ID (`0x8eaf04151687736326c9fea17e25fc5287613693`) and the number of tokens to be
transferred (`0xdd`, or 221 in hex).

> Further reading:
> [the EVM ABI specification](https://solidity.readthedocs.io/en/latest/abi-spec.html)

### Check Bob Contract Storage

After the extrinsic has finalized, use the `Chain State` app to query `evm > accountStorage` to see
the ERC-20 balances for both Alice and Bob.
347
