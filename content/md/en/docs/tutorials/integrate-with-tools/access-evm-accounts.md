---
title: Access EVM accounts
description: Illustrates how to integrate access to Ethereum-based accounts and contracts through a Substrate blockchain node.
keywords:
  - ethereum
  - contracts
  - solidity
  - evm
  - ethersjs
  - web3js
  - hardhat
  - truffle
  - ganache
---

This tutorial illustrates how to use crates from the [Frontier](https://github.com/paritytech/frontier) project to build an **Ethereum-compatible** blockchain that can access Ethereum-based accounts and execute Solidity-based smart contracts.
The two main goals of the Frontier project are to enable you to do the following:

- Run Ethereum decentralized apps unmodified using local Substrate nodes.
- Import state from the Ethereum main network.

This tutorial uses a predefined node template to provide a working environment.
The template was generated using the instructions in the [Frontier release guide](https://github.com/paritytech/frontier/blob/master/docs/node-template-release.md).

If you want to generate a standalone template for yourself, you can use the [node-template-release.sh](https://github.com/paritytech/frontier/blob/master/.maintain/node-template-release.sh) template generation script.
If you build your own node using from the [frontier](https://github.com/paritytech/frontier) repository or using the template generation script, be aware that Frontier uses its own versions of Substrate crates and you might need to update the dependencies in your `Cargo` files to match the dependencies in your project.

## Before you begin

You should have completed the following Substrate tutorials before attempting this tutorial:

- [Build a local blockchain](/tutorials/build-a-blockchain/build-local-blockchain/)
- [Add a pallet to the runtime](/tutorials/build-application-logic/add-a-pallet/)
- [Use macros in a custom pallet](/tutorials/build-application-logic/use-macros-in-a-custom-pallet/)

From the tutorials, you should be familiar with how to perform the following tasks:

- Launch a Substrate blockchain node.
- Add, remove, and configure pallets in a runtime.
- Submit transactions by connecting to a node using Polkadot-JS or another front-end.

Before starting this tutorial, you should also be familiar with the following:

- Ethereum core concepts and terminology
- Ethereum Virtual Machine (EVM) basics
- Decentralized applications and smart contracts
- Pallet design principles

## Genesis configuration

The development [chain specification](https://github.com/substrate-developer-hub/frontier-node-template/blob/main/node/src/chain_spec.rs) in the `frontier-node-template` defines a genesis block that is been pre-configured with an EVM account for the `alice` account.
When you start this node in development mode, the EVM account for `alice` is funded with a default amount of Ether.
You'll be using this account to view EVM account details and to call Ethereum smart contracts.
After you start the node, you'll be able to use the [Polkadot-JS application](https://polkadot.js.org/apps/#?rpc=ws://127.0.0.1:9944) to see the details of the EVM account for `alice`.

## Compile a Frontier node

The [Frontier node template](https://github.com/substrate-developer-hub/frontier-node-template) provides a working development environment so that you can start building on Substrate right away.

To compile the Frontier node template:

1. Open a terminal shell on your computer.

1. Clone the node template repository by running the following command:

   ```bash
   git clone https://github.com/substrate-developer-hub/frontier-node-template.git
   ```

1. Change to the root of the node template directory by running the following command:

   ```bash
   cd frontier-node-template
   ```

1. Compile the node template by running the following command:

   ```bash
   cargo build --release
   ```

## Connect to the node

After your node compiles, you must start the node to begin exploring the preconfigured EVM accounts.

To start the local Substrate node:

1. Open a terminal shell on your local computer, if needed.

1. Change to the root directory where you compiled the `frontier-node-template`.

1. Start the node in development mode by running the following command:

   ```bash
   ./target/release/frontier-template-node --dev
   ```

   The `--dev` command-line option specifies that the node runs using the predefined `development` chain specification that includes the predefined EVM account for `alice` and other accounts for testing.

1. Verify your node is up and running successfully by reviewing the output displayed in the terminal.

   The terminal should display output similar to this:

   ```text
   2022-07-08 10:06:42 Frontier Node
   2022-07-08 10:06:42 ✌️  version 0.0.0-1b6bff4-x86_64-macos
   2022-07-08 10:06:42 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2021-2022
   2022-07-08 10:06:42 📋 Chain specification: Development
   2022-07-08 10:06:42 🏷  Node name: flippant-boat-0444
   2022-07-08 10:06:42 👤 Role: AUTHORITY
   ...
   ```

1. Connect to the local node using the [Polkadot-JS application](https://polkadot.js.org/apps/#?rpc=ws://127.0.0.1:9944).

1. Click **Settings**, then click **Developer**.
  
   ![Developer settings](/media/images/docs/tutorials/evm-ethereum/settings-developer.png)

1. Define the following account information to create an EVM `Account` type and enable the account to send transactions and to inspect blocks.

   To send transactions, you must define `Address` and `LookupSource` settings.
   <br>
   To inspect blocks, you must define `Transaction` and `Signature` settings.

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

1. Click **Save**.

## Query balances using RPC

After you have configured settings for the EVM account, you can use the Polkadot-JS application to view information about the EVM account for `alice`.

1. Verify that your node is still running and the [Polkadot-JS application](https://polkadot.js.org/apps/#?rpc=ws://127.0.0.1:9944) is connected to the node.

1. Click **Developer**, then select **RPC calls**.

1. On the **Submission** tab, select **eth** as the endpoint to call.

1. Select **getBalance(address, number)** from the list of functions to call.

1. Specify the EVM account identifier for the `alice` account for the address.
  
   The predefined account address is `0xd43593c715fdd31c61141abd04a99fd6822c8558`.
   The address for the account was calculated from the public key for the `alice` account using [Substrate EVM utilities](https://github.com/substrate-developer-hub/frontier-node-template/tree/main/utils/README.md#--evm-address-address).

1. Click **Submit RPC call**.
  
   The call should return output similar to the following:
  
   ```text
   2: eth.getBalance: U256
   340,282,366,920,938,463,463,374,607,431,768,210,955
   ```

## Deploy a smart contract

Now that you'e seen how to query the balance for an Ethereum address, you might want to explore how you can deploy and call Ethereum smart contracts and test the related functionality.
This tutorial uses a [Truffle](https://www.trufflesuite.com/truffle) sample contract that defines an [ERC-20 token](https://github.com/substrate-developer-hub/frontier-node-template/blob/main/examples/contract-erc20/truffle/contracts/MyToken.sol).
You can also create an ERC-20 token contract using Polkadot JS SDK and [Typescript](https://github.com/substrate-developer-hub/frontier-node-template/tree/main/examples/contract-erc20).

1. Create the ERC-20 contract.
  
   For convenience, you can use the compiled `bytecode` from the token contract in [MyToken.json](https://github.com/substrate-developer-hub/frontier-node-template/blob/main/examples/contract-erc20/truffle/contracts/MyToken.json) to deploy the contract on the Substrate blockchain.

1. Verify that your node is still running and the [Polkadot-JS application](https://polkadot.js.org/apps/#?rpc=ws://127.0.0.1:9944) is connected to the node.

1. Click **Developer**, then select **Extrinsics**.

1. Select the **ALICE** development account as the account used to submit the transaction.

1. Select **evm**.

1. Select the **create** function.

1. Configure the parameters for the function.

   | For this | Specify this
   | -------- | ------------
   | `source` | 0xd43593c715fdd31c61141abd04a99fd6822c8558
   | `init` | raw `bytecode` hex value from `MyToken.json`
   | `value` | 0
   | `gasLimit` | 4294967295
   | `maxFeePerGas` | 100000000

   You can leave optional parameters empty.
   The value for the `nonce` will increment the known nonce for the source account, starting from `0x0`.
   Depending on the function you selected, you might need to remove unused parameters.

1. Click **Submit Transaction**.

1. Click **Sign and Submit** to authorize the transaction.

## View the smart contract

After you submit the transaction, the contract is deployed on the network and you can view information about it using the [Polkadot-JS application](https://polkadot.js.org/apps/#?rpc=ws://127.0.0.1:9944).

1. Verify that your node is still running and the [Polkadot-JS application](https://polkadot.js.org/apps/#?rpc=ws://127.0.0.1:9944) is connected to the node.

1. Click **Network**, then select **Explorer**.

1. Click the **evm.Created** event to verify the address of the newly-created contract is `0x8a50db1e0f9452cfd91be8dc004ceb11cb08832f`.

   ![Successful contract created event](/media/images/docs/tutorials/evm-ethereum/evm-created.png)

   You can also view details about the transaction using the Console in the Developer Tools for your browser.

   Because EVM contract addresses are determined by the account identifier and nonce of the contract creator, the address where the contract is deployed is calculated using the well-known account identifier `0xd43593c715fdd31c61141abd04a99fd6822c8558` and nonce `0x0` for the `alice` account.

1. Click **Developer**, then select **Chain State**.

1. Select **evm**  as the state to query and **accountCodes**.

1. Specify the account identifier `0xd43593c715fdd31c61141abd04a99fd6822c8558` for the `alice` account and notice that the account code is empty (`0x`)

1. Specify the contract address `0x8a50db1e0f9452cfd91be8dc004ceb11cb08832f` for the contract you deployed using the `alice` development account and notice that contract account code is the bytecode from the Solidity contract.

## View account storage

The ERC-20 contract you deployed is based on the [OpenZeppelin ERC-20 implementation](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol).
This contract includes a constructor that mints a maximum number of tokens and stores them in the account associated with the contract creator.

To query the account storage associated with the smart contract:

1. In Chain State with **evm** as the state to query, select **accountStorages**.

1. Specify the ERC-20 contract address `0x8a50db1e0f9452cfd91be8dc004ceb11cb08832f` as the first parameter.

1. Specify the storage slot to read as the second parameter `0x045c0350b9cf0df39c4b40400c965118df2dca5ce0fbcf0de4aafc099aea4a14`.

   The storage slot for the address was calculated using [Substrate EVM utilities](https://github.com/substrate-developer-hub/frontier-node-template/tree/main/utils/README.md#--erc20-slot-slot-address) based on slot 0 and the account identifier `0xd43593c715fdd31c61141abd04a99fd6822c8558`.

   The value that is returned should be `0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`.

   If you check the balance for the `alice` account after deploying the contract, you see that a fee was withdrawn from the account and the `getBalance(address, number)` call returns a value similar to the following:

   ```text
   340,282,366,920,938,463,463,374,603,530,233,757,803
   ```

## Transfer tokens

So far, you have worked exclusively with the `alice` development account.
The next step is to use the deployed contract to transfer tokens to another account.

1. Verify that your node is still running and the [Polkadot-JS application](https://polkadot.js.org/apps/#?rpc=ws://127.0.0.1:9944) is connected to the node.

1. Click **Developer**, then select **Extrinsics**.

1. Select the **ALICE** development account as the account used to submit the transaction.

1. Select **evm**.

1. Select **call** to invoke the `transfer(address, uint256)` function on the ERC-20 contract.

1. Configure the parameters for the function.

   | For this | Specify this
   | -------- | ------------
   | `source` | 0xd43593c715fdd31c61141abd04a99fd6822c8558
   | `target` | 0x8a50db1e0f9452cfd91be8dc004ceb11cb08832f
   | `input` | 0xa9059cbb0000000000000000000000008eaf04151687736326c9fea17e25fc528761369300000000000000000000000000000000000000000000000000000000000000dd
   | `value` | 0
   | `gasLimit` | 4294967295
   | `maxFeePerGas` | 100000000

   The `source` represents the account holding the tokens.
   In this case, the `source` is the EVM account for `alice`, the contract creator.
   The `target` is the contract address for the transfer of tokens from `alice` to `bob`.

   The `input` parameter is an EVM ABI-encoded function call that specifies the function call to perform a transfer (`0xa9059cbb`) and the arguments the function requires.
   For this function, the arguments are the `bob` EVM account identifier (`0x8eaf04151687736326c9fea17e25fc5287613693`) and the number of tokens to be transferred (221 or `0xdd` in hex).

   The input value in this tutorial was calculated using the [Remix web IDE](http://remix.ethereum.org).

1. Click **Submit Transaction**.

1. Click **Sign and Submit** to authorize the transaction.

## Verify the token transfer

After you submit the transaction, you can verify the token transfer using the [Polkadot-JS application](https://polkadot.js.org/apps/#?rpc=ws://127.0.0.1:9944).

1. Verify that your node is still running and the [Polkadot-JS application](https://polkadot.js.org/apps/#?rpc=ws://127.0.0.1:9944) is connected to the node.

1. Click **Network**, then select **Explorer**.

1. Click the **evm.Executed** event to verify the address of the executed contract is `0x8a50db1e0f9452cfd91be8dc004ceb11cb08832f`.

   ![Successful execution event](/media/images/docs/tutorials/evm-ethereum/evm-executed.png)

1. Click **Developer**, then select **Chain State**.

1. Select **evm**  as the state to query and **accountStorages**.

1. Check the storage for the contract address `0x8a50db1e0f9452cfd91be8dc004ceb11cb08832f` and storage slot `0x045c0350b9cf0df39c4b40400c965118df2dca5ce0fbcf0de4aafc099aea4a14`.

   ```text
   0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff22
   ```
  
   If you check the balance for the `alice` account after deploying the contract, you see that a fee was withdrawn from the account and the `getBalance(address, number)` call returns a value similar to the following:
  
   ```text
   340,282,366,920,938,463,463,374,603,530,233,366,411
   ```

## Where to go next

- [Moonbeam: Ethereum compatibility](https://docs.moonbeam.network/learn/features/eth-compatibility/)
- [Ethereum integration](/tutorials/integrate-with-tools/evm-integration/)
- [EVM ABI specification](https://solidity.readthedocs.io/en/latest/abi-spec.html)
- [ERC-20 token standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
