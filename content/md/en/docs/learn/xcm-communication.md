---
title: Cross-consensus messaging
description: Provides an overview of cross-consensus communication and the cross-consensus messaging (XCM) format.
keywords:
  - XCM
  - XCMP
  - Polkadot
  - parachain
  - relay chain
---

Cross-consensus communication relies on a message format—XCM—that is designed to provide a generalized and extensible set of instructions for completing transactions across boundaries created by different consensus systems, transaction formats, and transport protocols.

The XCM format expresses the content of the message.
Each message consists of a set of **instructions** being requested by a **sender** that can be accepted or rejected by a message **recipient**.
The message format is completely independent of the **message protocol** used to send and receive messages.

## Message protocols

In the Polkadot ecosystem, there are three main communication channels—the message protocols—used to transport messages between chains:

- Upward message passing (UMP) enables a parachain to pass messages up to its relay chain.
- Downward message passing (DMP) enables the relay chain to pass messages down to a parachain.
- Cross-consensus message passing (XCMP) enables parachains to exchange messages with other parachains that are connected to the same relay chain.

The upward and downward message passing protocols provide a vertical message passing channel.
Cross-consensus message passing can be thought of as a horizontal—parachain-to-parachain—transport protocol.
Because the full cross-consensus message passing (XCMP) protocol is still under development, horizontal relay-routed message passing (HRMP) provides an interim solution for routing messages intended for a parachain through the relay chain.
Horizontal relay-routed message passing (HRMP) is intended to be a temporary solution that will be deprecated when XCMP is released to production.

Although these message passing protocols are the primary means of communication between chains in the Polkadot ecosystem, XCM itself isn't limited by these transport protocols.
Instead, you can use XCM to express many common types of transactions regardless of where the message originates and its destination.
For example, you can construct messages that are routed from smart contracts or pallets, over bridges, or using transport protocols that aren't part of the Polkadot ecosystem at all.

![XCM provides message content separate from message delivery](/media/images/docs/xcm-channel-overview.png)

Because XCM is specifically designed to communicate what should be done by a receiving system, it can provide a flexible and agnostic transaction format for many common types of transactions.

## Messages in the XCM format

There are four important principles you should understand about messages that use the XCM format:

- Messages are **asynchronous**. After you send a message, there's no expectation that sending system should wait for a response that indicates the message was delivered or executed.
- Messages are **absolute** in that they are guaranteed to be delivered and interpreted **in order** and executed **efficiently**.
- Messages are **asymmetric** and don't return any results back to the sender. You can only communicate results back to the sender separately using an additional message.
- Messages are **agnostic** and make no assumptions about the consensus systems between which messages are passed.

With these basic principles in mind, you can start constructing messages using XCM.
In Rust, a message is defined like this:

```rust
pub struct Xcm<Call>(pub Vec<Instruction<Call>>);
```

As this definition indicates, the message is simply a call to execute an ordered set of instructions.
The `Instruction` type is an enumeration data type and the order in which the variants are defined reflects generally the order in which they are used when constructing a message.
For example, the `WithdrawAsset` is the first variant because it is typically be executed before other instructions—such as `BuyExecution` or `DepositAsset`—in the ordered list of instructions.

Most of the XCM instructions enable you to perform common tasks such as transfer an asset to a new location or deposit an asset in a different account.
The instructions that perform these types of tasks allow you to construct consistent messages that do what you expect them to do regardless of how the consensus system you communicate with is configured.
However, you also have the flexibility to customize how instructions are executed or to use the `Transact` instruction.

The `Transact` instruction allow you to execute any callable function exposed by the recipient of a message.
By using the `Transact` instruction, you can make a generic call to any function on the receiving system, but it requires you to know something about how that system is configured.
For example, if you want to call a specific pallet of another parachain, you must know how the receiving runtime is configured to construct the correct message to reach the correct pallet.
This information can vary from chain to chain because every runtime can be configured differently.

## Execution in a virtual machine

The cross-consensus virtual machine (XCVM) is a high level virtual machine with an XCM executor program that executes the XCM instructions it receives.
The program executes the instructions in order until it runs to the end or encounters an error and stops execution.

As XCM instructions are executed, the XCVM maintains its internal state through the use of several specialized registers.
The XCVM also has access to the state of the underlying consensus system where the instructions are executing.
Depending on the operations performed, the XCM instructions might change a register, the state of the consensus system, or both.

For example, the `TransferAsset` instruction specifies an asset to transfer and where the asset is to be transferred.
When this instruction is executed, the **origin register** is automatically set to reflect where the message came from and, from that information, identify where assets to be transferred should be taken from.
Another register that is manipulated when executing XCM instructions is the **holding register**.
The holding register is used to store assets temporarily while waiting for additional instructions for what should be done with them.

There are several other registers in the XCVM to handle specific tasks.
For example, there's a surplus weight register to store any overestimation of fees and a refunded weight register to store the portion of surplus weight that has been refunded.
In general, you can't modify the values stored in the registers directly.
Instead, values are set when the XCM executor program starts and are manipulated by specific instructions, under certain circumstances, or according to certain rules.
FOr more information about what's contained in each register, see [XCM reference](/reference/xcm-reference/).

### Configuration

Like other components in Substrate and FRAME-based chains, the XCM executor is modular and configurable.
You can configure many aspects of the XCM executor program using the `Config` trait and customize the implementation to handle XCM instructions in different ways.
For example, the `Config` trait provides the following type definitions:

```rust
/// The trait to parameterize the `XcmExecutor`.
pub trait Config {
    /// The outer call dispatch type.
    type Call: Parameter + Dispatchable<PostInfo = PostDispatchInfo> + GetDispatchInfo;
    /// How to send an onward XCM message.
    type XcmSender: SendXcm;
    /// How to withdraw and deposit an asset.
    type AssetTransactor: TransactAsset;
    /// How to get a call origin from a `OriginKind` value.
    type OriginConverter: ConvertOrigin<<Self::Call as Dispatchable>::Origin>;
    /// Combinations of (Location, Asset) pairs trusted as reserves.
    type IsReserve: FilterAssetLocation;
    /// Combinations of (Location, Asset) pairs trusted as teleporters.
    type IsTeleporter: FilterAssetLocation;
    /// Means of inverting a location.
    type LocationInverter: InvertLocation;
    /// Whether to execute the given XCM at all.
    type Barrier: ShouldExecute;
    /// Handler for estimating weight for XCM execution.
    type Weigher: WeightBounds<Self::Call>;
    /// Handler for purchasing weight credit for XCM execution.
    type Trader: WeightTrader;
    /// Handler for the response to a query.
    type ResponseHandler: OnResponse;
    /// Handler for assets in the Holding register after execution.
    type AssetTrap: DropAssets;
    /// Handler for when there is an instruction to claim assets.
    type AssetClaims: ClaimAssets;
    /// Handler version subscription requests.
    type SubscriptionService: VersionChangeNotifier;
}
```

The configuration settings and the XCM set of instructions—the message or, more accurately, the program to be executed on the receiving system—act as input to the XCM executor.
With additional types and functions provided by XCM builder modules, the XCM executor interprets and executes the operations contained in the instructions one at a time in the order provided.
The following diagram provides a simplified overview of the workflow.

![XCM configuration and execution](/media/images/docs/xcvm-overview.png)

## Locations

Because XCM is a language for communicating between different consensus systems, it must have an abstract way to express locations in a general, flexible, and unambiguous way.
For example, XCM must be able to identify the location for the following types of activity:

- where an instruction should be executed.
- where an asset should be withdrawn from.
- where an account to receive assets can be found.

For any of these activities, the location might be in the context of a relay chain, a parachain, a foreign chain, an account on a specific chain, a specific smart contract, or an individual pallet.
For example, XCM must be able to identify the following types of locations:

- A layer-0 chain such as the Polkadot or Kusama relay chain.
- A layer-1 chain such as the Bitcoin or Ethereum mainnet or a parachain.
- A layer-2 smart contract such as an ERC-20 on Ethereum.
- An address on a parachain or Ethereum.
- An account on a relay chain or parachain.
- A specific pallet on a Frame-based Substrate chain.
- A single instance of a pallet on a Frame-based Substrate chain.

To describe the location within the context of a consensus system, XCM uses the `MultiLocation` type.
The `MultiLocation` type expresses a location that is relative to the current location and consists of two parameters:

- `parents: u8` to describe the number of levels to travel up from the current consensus location before interpreting the `interior` parameter.
- `interior: InteriorMultiLocation` to describe a location interior to the outer consensus system after ascending the relative path as specified using the `parents` parameter.

The `InteriorMultiLocation` identifies a consensus system interior to the local consensus system using the concept of **junctions**, with each junction specifying a location further internal to the previous.
An `InteriorMultiLocation` with no junctions simply refers to the local consensus system (Here).
You can use junctions to specify an interior context for XCM instructions as a parachain, an account, or a pallet instance relative to the outer consensus.

For example, the following parameters refer to a parachain with the unique identifier 1000 from the context of the relay chain:

```rust
{ "parents": 1,
"interior": { "X1": [{ "Parachain": 1000 }]}
}
```

In this example, the `parents` parameter ascends one level to the parent chain and `interior` specifies an interior location with a junction type of `Parachain` and an index of `1000`.

In text, a MultiLocation follows the convention used to describe file system paths.
For example, the MultiLocation expressed as `../PalletInstance(3)/GeneralIndex(42)` describes a MultiLocation with one parent (..) and two junctions (`PalletInstance{index: 3}`) and (`GeneralIndex{index: 42}`).

For more information about specifying locations and junctions, see [Universal consensus location identifiers](https://github.com/paritytech/xcm-format#7-universal-consensus-location-identifiers).

## Assets

Most blockchains depend on some type of digital asset to provide economic incentives that are crucial to the security of the network.
Some blockchains support a single native asset.
Other blockchains allow multiple assets to be managed on-chain, for example, as assets defined in smart contracts or non-native tokens.
There are also blockchains that support non-fungible digital assets for one-of-a-kind collectibles.
For XCM to support these different types of assets, it must be able to express assets in a general, flexible, and unambiguous way.

To describe on-chain assets, XCM uses the `MultiAsset` type.
The `MultiAsset` type specifies the asset identity and whether the asset is fungible or non-fungible.
Typically, the asset identity is specified using a concrete location.
If the asset is fungible, the definition includes an amount.

Although it's possible to identify an asset using an abstract identifier, concrete identifiers are an unambiguous way of identifying an asset without a global registry of asset names.

Concrete identifiers specifically identify a single asset through its location in a consensus system relative to the context interpreting.
However, it's worth noting that the concrete asset identifier can't just be copied between consensus systems.
Instead, the asset is moved using the relative path for each consensus system.
The relative paths must be constructed to be read from the point of view of the receiving system.

For native assets—such as DOT on the Polkadot relay chain—the asset identifier is typically the chain that mints the asset or up one level (`..`) from the context of one its parachains.
If an assets is managed from within a pallet, the asset identifier specifies a location using the pallet instance identifier and the index within that pallet.
For example, the Karura parachain might refer to an asset on the Statemine parachain with the location `../Parachain(1000)/PalletInstance(50)/GeneralIndex(42)`.

For more information about specifying locations and junctions, see [Universal asset identifiers](https://github.com/paritytech/xcm-format#6-universal-asset-identifiers).

## Instructions

Most of the XCM instructions enable you to construct consistent messages that do what you expect regardless of how the consensus system you communicate with is configured.
However, you also have the flexibility to use the `Transact` instruction to execute any callable function exposed by the recipient of the message.
By using the `Transact` instruction, you can make a generic call to any function on the receiving system, but it requires you to know something about how that system is configured.
For example, if you want to call a specific pallet of another parachain, you must know how the receiving runtime is configured to construct the correct message to reach the correct pallet.
This information can vary from chain to chain because every runtime can be configured differently.
