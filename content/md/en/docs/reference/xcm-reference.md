---
title: XCM reference
description:
keywords:
  - XCM instructions
  - registers
  - types
  - errors
---

This section provides reference information for the cross-consensus message (XCM) format.

## Instructions

As you learned in [Cross-consensus communication](/fundamentals/xcm-communication), the XCM executor is a program that executes an ordered set of instructions as a virtual machine running on recipient consensus system.
It's worth noting that some instructions are dependent on other instructions.
The order in which instructions are listed in the Instruction enumeration and defined when you construct a message to be sent to the receiving system reflects these dependencies. 
For your convenience in this reference section, the instructions are listed in alphabetic order instead of the order in which they are defined.

### BuyExecution

Pays for the execution of the current message by removing assets from the holding register. 
You must specify the `fees` parameter using the `MultiAsset` type to identify the asset to remove from the holding register to pay execution fees. 
You can also specify a `weight_limit` for the maximum fee to be purchased. 
If the `weight_limit` you specify is lower than the estimated weight of the message, the XCM executor stops execution with the `TooExpensive` error.

### ClaimAsset

Creates assets that are being held on behalf of the location identified in the origin register. 
You must specify the `assets` parameter using the `MultiAsset` type to identify the assets to be claimed. 
The asset you specify must match exactly with the assets available to be claimed by the origin with the given `ticket`. 
You must specify the `ticket` using the `MultiLocation` type. 
The claim ticket for the asset is an abstract identifier to help locate the asset to be claimed.

### ClearError

Clears the error register.

### ClearOrigin

Clears the origin register. 
You can use this instruction to ensure that later instructions cannot take over the authority of the original origin. 
For example, if you have instructions that are being relayed from an untrusted source, as is often the case with ReserveAssetDeposited, you can use ClearOrigin to prevent the original origin from being used to execute the instruction.

### DepositAsset

Subtracts the specified asset from the holding register and deposits on-chain equivalent assets under the ownership of specified `beneficiary`. 
You must specify the `assets` to remove using the `MultiAssetFilter` type.
Because the holding register might have assets of different types—for example
| Parameter | Description
| :-------- | :----------
| `assets: MultiAssetFilter` | Specifies the asset to remove from the holding register.
| `max_assets: Compact` | Specifies the maximum number of unique assets or asset instances to remove from the holding register. Only the first `max_assets` number of unique assets or asset instances that match the `assets` specified are removed, prioritized under standard asset ordering. If there are any additional unique assets or asset instances, they will remain in the holding register.
| `destination: MultiLocation` | Specifies the location whose sovereign account will own the assets and thus the effective beneficiary for the assets and the notification target for the reserve asset deposit message.

max_assets: Compact: The maximum number of unique assets/asset instances to remove from the Holding Register. Only the first max_assets assets/instances of those matched by assets will be removed, prioritized under standard asset ordering. Any others will remain in holding.
beneficiary: MultiLocation: The new owner for the assets.

### DepositReserveAsset

Removes the assets from the holding register and deposits on-chain equivalent assets into the sovereign account under the ownership of the destination.
This instruction also sends a follow-up message to destination of the ReserveAssetDeposited instruction with the given effects.
  
| Parameter | Description
| :-------- | :----------
| `assets: MultiAssetFilter` | Specifies the asset to remove from the holding register.
| `max_assets: Compact` | Specifies the maximum number of unique assets or asset instances to remove from the holding register. Only the first `max_assets` number of unique assets or asset instances that match the `assets` specified are removed, prioritized under standard asset ordering. If there are any additional unique assets or asset instances, they will remain in the holding register.
| `destination: MultiLocation` | Specifies the location whose sovereign account will own the assets and thus the effective beneficiary for the assets and the notification target for the reserve asset deposit message.
| `xcm: Xcm `| Specifies the orders that should follow the ReserveAssetDeposited instruction that is sent onwards to destination.

### DescendOrigin

Changes the origin to some interior location.

| Parameter | Description
| :-------- | :----------
| `interior: InteriorMultiLocation` | Specifies the location, interpreted from the context of the current origin, to place in the origin register.

### ExchangeAsset

Reduces Holding by up to some amount of asset(s) (give) and accrue Holding with a minimum amount of some alternative assets (receive).

Operands:

give: MultiAssetFilter: The asset(s) by which Holding should be reduced.
receive: MultiAssets: The asset(s) by which Holding must be increased. Any fungible assets appearing in receive may be increased by an amount greater than expressed, but Holding may not accrue assets not stated in receive.
Kind: Instruction

Errors: Fallible.

### HrmpChannelAccepted

A message to notify about that a previously sent open channel request has been accepted by the recipient. That means that the channel will be opened during the next Relay-chain session change. This message is meant to be sent by the Relay-chain to a para.

Operands:

recipient: Compact: The recipient parachain which has accepted the previous open-channel request.
Safety: The message should originate directly from the Relay-chain.

Kind: System Notification

Errors: Fallible.

### HrmpChannelClosing

A message to notify that the other party in an open channel decided to close it. In particular, initiator is going to close the channel opened from sender to the recipient. The close will be enacted at the next Relay-chain session change. This message is meant to be sent by the Relay-chain to a para.

Operands:

initiator: Compact: The parachain index which initiated this close operation.
sender: Compact: The parachain index of the sender side of the channel being closed.
recipient: Compact: The parachain index of the receiver side of the channel being closed.
Safety: The message should originate directly from the Relay-chain.

Kind: System Notification

Errors: Fallible.

### HrmpNewChannelOpenRequest

Sends a request from a parachain to the relay chain to notify about a new incoming HRMP channel. This message is meant to be sent by the Relay-chain to a para.

Operands:

sender: Compact: The sender in the to-be opened channel. Also, the initiator of the channel opening.
max_message_size: Compact: The maximum size of a message proposed by the sender.
max_capacity: Compact: The maximum number of messages that can be queued in the channel.
Safety: The message should originate directly from the Relay-chain.

Kind: System Notification

### InitiateReserveWithdraw

Reduce the value of the Holding Register by the asset(s) (assets) and send an XCM message beginning with WithdrawAsset to a reserve location.

Operands:

assets: MultiAssetFilter: The asset(s) to remove from the Holding Register.
reserve: A valid location that acts as a reserve for all asset(s) in assets. The sovereign account of this consensus system on the reserve location will have appropriate assets withdrawn and effects will be executed on them. There will typically be only one valid location on any given asset/chain combination.
xcm: The instructions to execute on the assets once withdrawn on the reserve location.
Kind: Instruction

Errors: Fallible.

### InitiateTeleport

Remove the asset(s) (assets) from the Holding Register and send an XCM message beginning with ReceiveTeleportedAsset to a destination location.

NOTE: The destination location MUST respect this origin as a valid teleportation origin for all assets. If it does not, then the assets may be lost.

Operands:

assets: MultiAssetFilter: The asset(s) to remove from the Holding Register.
destination: MultiLocation: A valid location that respects teleports coming from this location.
xcm: The instructions to execute on the destination location following the ReceiveTeleportedAsset instruction.
Kind: Instruction

Errors: Fallible.

### QueryHolding

ReportHolding
Send a QueryResponse XCM message with the assets value equal to the holding contents, or a portion thereof.

Operands:

query_id: QueryId: The value to be used for the query_id field of the QueryResponse message.
destination: MultiLocation: The location to where the QueryResponse message should be sent.
assets: MultiAssetFilter: A filter for the assets that should be reported back.
max_response_weight: Weight: The value to be used for the max_weight field of the QueryResponse message.
Kind: Instruction

Errors: Fallible.


### QueryResponse

Provide expected information from Origin.

Operands:

query_id: QueryId: The identifier of the query that resulted in this message being sent.
response: Response: The information content.
max_weight: Weight: The maximum weight that handling this response should take. If proper execution requires more weight then an error will be thrown. If it requires less weight, then Surplus Weight Register may increase.
Kind: Information.

Errors: Fallible.

Weight: Weight estimation may utilise max_weight which may lead to an increase in Surplus Weight Register at run-time.

Response
The Response type is used to express information content in the QueryResponse XCM instruction. It can represent one of several different data types and it therefore encoded as the SCALE-encoded tagged union:

Null = 0: No information.
Assets { assets: MultiAssets } = 1: Some assets.
ExecutionResult { result: Result<(), (u32, Error)> } = 2: An error (or not), equivalent to the type of value contained in the Error Register.
Version { version: Compact } = 3: An XCM version.

### ReceiveTeleportedAsset

Accrue assets into Holding equivalent to the given assets (assets) on Origin.

Operands:

assets: MultiAssets: The asset(s) which have been removed from Origin.
Kind: Trusted Indication.

Trust: Origin must be trusted to have removed the assets as a consequence of sending this message.

Errors: Fallible.

### RefundSurplus

Increase Refunded Weight Register to the value of Surplus Weight Register. Attempt to accrue fees previously paid via BuyExecution into Holding for the amount that Refunded Weight Register is increased.

Kind: Instruction

Errors: Infallible.

### ReportError

Immediately report the contents of the Error Register to the given destination via XCM.

A QueryResponse message of type ExecutionOutcome is sent to destination with the given query_id and the outcome of the XCM.

Operands:

query_id: QueryId: The value to be used for the query_id field of the QueryResponse message.
destination: MultiLocation: The location to where the QueryResponse message should be sent.
max_response_weight: Weight: The value to be used for the max_weight field of the QueryResponse message.
Kind: Instruction

Errors: Fallible.

### ReserveAssetDeposited

Accrue into Holding derivative assets to represent the asset(s) (assets) on Origin.

Operands:

assets: MultiAssets: The asset(s) which have been received into the Sovereign account of the local consensus system on Origin.
Kind: Trusted Indication.

Trust: Origin must be trusted to act as a reserve for assets.

Errors: Fallible.

### SetAppendix

Set the Appendix Register.

Operands:

appendix: Xcm: The value to which to set the Appendix Register.
Kind: Instruction

Errors: Infallible.

Weight: The estimated weight of this instruction must include the estimated weight of appendix. At run-time, Surplus Weight Register should be increased by the estimated weight of the Appendix prior to being changed.

### SetErrorHandler

Set the Error Handler Register.

Operands:

error_handler: Xcm: The value to which to set the Error Handler Register.
Kind: Instruction

Errors: Infallible.

Weight: The estimated weight of this instruction must include the estimated weight of error_handler. At run-time, Surplus Weight Register should be increased by the estimated weight of the Error Handler prior to being changed.

### SubscribeVersion

Send a QueryResponse message to Origin specifying XCM version 2 in the response field.

Any upgrades to the local consensus which result in a later version of XCM being supported should elicit a similar response.

Operands:

query_id: QueryId: The value to be used for the query_id field of the QueryResponse message.
max_response_weight: Weight: The value to be used for the max_weight field of the QueryResponse message.
Kind: Instruction

### Transact

Dispatch the encoded functor call, whose dispatch-origin should be Origin as expressed by the kind of origin origin_type.

Operands:

origin_type: OriginKind: The means of expressing the message origin as a dispatch origin.
max_weight: Weight: The maximum amount of weight to expend while dispatching call. If dispatch requires more weight then an error will be thrown. If dispatch requires less weight, then Surplus Weight Register may increase.
call: Vec<u8>: The encoded transaction to be applied.
Kind: Instruction.

Errors: Fallible.

Weight: Weight estimation may utilise max_weight which may lead to an increase in Surplus Weight Register at run-time.

### TransferAsset

Withdraw asset(s) (assets) from the ownership of Origin and deposit equivalent assets under the ownership of beneficiary.

Operands:

assets: MultiAssetFilter: The asset(s) to be withdrawn.
beneficiary: The new owner for the assets.
Kind: Instruction.

Errors: Fallible.

### TransferReserveAsset

Withdraw asset(s) (assets) from the ownership of Origin and deposit equivalent assets under the ownership of destination (i.e. within its Sovereign account).

Send an onward XCM message to destination of ReserveAssetDeposited with the given xcm.

Operands:

assets: MultiAsset: The asset(s) to be withdrawn.
destination: MultiLocation: The location whose sovereign account will own the assets and thus the effective beneficiary for the assets and the notification target for the reserve asset deposit message.
xcm: Xcm: The instructions that should follow the ReserveAssetDeposited instruction, which is sent onwards to destination.
Kind: Instruction.

Errors: Fallible.

### Trap

Always throws an error of type Trap.

Operands:

id: Compact: The value to be used for the parameter of the thrown error.
Kind: Instruction

Errors: Always.

### UnsubscribeVersion

Cancel the effect of a previous SubscribeVersion instruction from Origin.

Kind: Instruction

### WithdrawAsset

Removes the specified assets from the sending account on the local consensus system and adds them to the value in the holding register.

assets: MultiAssets
You must specify the assets to be removed.

```rust
struct MultiAsset {
   id: AssetId,
   fun: Fungibility,
}

enum AssetId {
   Concrete(MultiLocation),
   Abstract(BinaryBlob),
}

enum Fungibility {
   Fungible(NonZeroAmount),
   NonFungible(AssetInstance),
}
```

The asset must be owned by the location identified in the origin register.

Kind: Instruction.

Errors: Fallible.

---
Notes on terminology
When the term Origin is used, it is meant to mean "location whose value is that of the Origin Register". Thus the phrase "controlled by the Origin" is equivalent to "controlled by the location whose value is that of the Origin Register".
When the term Holding is used, it is meant to mean "value of the Holding Register". Thus the phrase "reduce Holding by the asset" is equivalent to "reduce the value of the Holding Register by the asset".
Similarly for Appendix (the value of the Appendix Register) and Error Handler (the value of the Error Handler Register).
The term on-chain should be taken to mean "within the persistent state of the local consensus system", and should not be considered to limit the current consensus system to one which is specifically a blockchain system.
The type Compact, Weight and QueryId should be intended to mean a compact integer as per the SCALE definition.
WithdrawAsset













BurnAsset(MultiAssets)
Reduce Holding by up to the given assets.

Holding is reduced by as much as possible up to the assets in the parameter.

Operands:

assets: MultiAssets: The assets by which to reduce Holding.
Kind: Instruction

Errors: Fallible

ExpectAsset(MultiAssets)
Throw an error if Holding does not contain at least the given assets.

Operands:

assets: MultiAssets: The minimum assets expected to be in Holding.
Kind: Instruction

Errors:

ExpectationFalse: If Holding does not contain the assets in the parameter.
ExpectOrigin(MultiLocation)
Ensure that the Origin Register equals some given value and throw an error if not.

Operands:

origin: MultiLocation: The value expected of the Origin Register.
Kind: Instruction

Errors:

ExpectationFalse: If Origin is not some value, or if that value is not equal to the parameter.
ExpectError(Option<(u32, Error)>)
Ensure that the Error Register equals some given value and throw an error if not.

Operands:

error: Option<(u32, Error)>: The value expected of the Error Register.
Kind: Instruction

Errors:

ExpectationFalse: If the value of the Error Register is not equal to the parameter.

## Registers

Most XCVM registers can't be modified directly.
They are set to specific values to start and are only be manipulated by specific instructions, under certain circumstances, or according to certain rules.
The XCVM includes the following registers:

| Register | Description
| :------- | :----------
| Origin | Stores the location for the authority the current program is running under.
| Holding | Stores the number of assets that exist under the control of the XCVM but have no on-chain representation. 
| Surplus weight | Stores the overestimation of weight previously calculated.
| Refunded weight | Stores the portion of surplus weight that has been refunded. 
| Programme | Stores the set of XCM instructions currently executing. This register holds the complete message—the program—in cross-consensus virtual machine.
| Programme counter | Stores the instruction index for currently executing instruction. The value is incremented by one at the end of every successfully executed instruction. The register is reset to zero when the Programme register changes.
| Error | Stores information about the last known error during program execution. 
| Error handler | Stores code that should run if there's an error.
| Appendix | Stores code that should run after the current program ends.

## Origins

/// Origin should just be the native dispatch origin representation for the sender in the
/// local runtime framework. For Cumulus/Frame chains this is the `Parachain` or `Relay` origin
/// if coming from a chain, though there may be others if the `MultiLocation` XCM origin has a
/// primary/native dispatch origin form.
Native,

    /// Origin should just be the standard account-based origin with the sovereign account of
    /// the sender. For Cumulus/Frame chains, this is the `Signed` origin.
    SovereignAccount,

    /// Origin should be the super-user. For Cumulus/Frame chains, this is the `Root` origin.
    /// This will not usually be an available option.
    Superuser,

    /// Origin should be interpreted as an XCM native origin and the `MultiLocation` should be
    /// encoded directly in the dispatch origin unchanged. For Cumulus/Frame chains, this will be
    /// the `pallet_xcm::Origin::Xcm` type.
    Xcm,

The implications of using different origins depends on the code you are calling, and if you are able to generate that origin at all.

For example, it would not be normal for a regular user to be able to generate the Superuser origin, but it may be possible for the chain logic itself to do that. Having access to the Superuser origin will allow you to use configurations like ParentAsSuperuser which specifically check for these things:

pub struct ParentAsSuperuser<RuntimeOrigin>(PhantomData<RuntimeOrigin>);
impl<RuntimeOrigin: OriginTrait> ConvertOrigin<RuntimeOrigin> for ParentAsSuperuser<RuntimeOrigin> {
    fn convert_origin(
        origin: impl Into<MultiLocation>,
        kind: OriginKind,
    ) -> Result<RuntimeOrigin, MultiLocation> {
        let origin = origin.into();
        log::trace!(target: "xcm::origin_conversion", "ParentAsSuperuser origin: {:?}, kind: {:?}", origin, kind);
        if kind == OriginKind::Superuser && origin.contains_parents_only(1) {
            Ok(RuntimeOrigin::root())
        } else {
            Err(origin)
        }
    }
}

## Errors

If the program executing XCM instructions encounters a problem, it stops execution and identifies the type of problem encountered with one of the following errors:

| Error type | Description
| :---------- | :-----------
| `Overflow = 0` | An instruction caused an arithmetic overflow.
| `Unimplemented = 1` | The instruction is intentionally unsupported.
| `UntrustedReserveLocation = 2` | The origin register doesn't contain a valid value for a reserve transfer notification.
| `UntrustedTeleportLocation = 3` | The origin register doesn't contain a valid value for a teleport notification.
| `MultiLocationFull = 4` | The `MultiLocation` value too large to descend further.
| `MultiLocationNotInvertible = 5` | The `MultiLocation` value ascends more parents than the known number of ancestors of the local location.
| `BadOrigin = 6` | The origin register doesn't contain a valid value for executing the instruction.
| `InvalidLocation = 7` | The location parameter is not a valid value for the instruction.
| `AssetNotFound = 8` | The specified asset can't be found or isn't valid in the location specified for the instruction.
| `FailedToTransactAsset = 9` | An asset transaction—for example, an instruction to withdraw or deposit an asset—failed. In most cases, this type of error is caused by problems with type conversions.
| `NotWithdrawable = 10` | The specified asset can't be withdrawn, potentially due to lack of ownership, asset availability, or permissions.
| `LocationCannotHold = 11` | The specified asset can't be deposited under the ownership of a particular location.
| `ExceedsMaxMessageSize = 12` | There was an attempt to send a message that exceeded the maximum message size supported by the transport protocol.
| `DestinationUnsupported = 13` | There was an attempt to send a message that can't be translated into a format supported by the destination.
| `Transport = 14` | The destination is routable, but there's an issue with the transport mechanism.
| `Unroutable = 15` | The destination is known to be unroutable.
| `UnknownClaim = 16` | The claim specified for the ClaimAsset instruction isn't recognized or can't be found.
| `FailedToDecode = 17` | The function specified for the Transact instruction can't be decoded.
| `TooMuchWeightRequired = 18` | The function specified for the Transact instruction might exceed the weight limit allowed.
| `NotHoldingFees = 19` | The holding register doesn't contain any payable fees for the BuyExecution instruction to use.
| `TooExpensive = 20` | The fees declared to purchase weight in the BuyExecution instruction are insufficient.
| `Trap(u64) = 21` | Used by the Trap instruction to force an error intentionally. Its code is included.
| `ExpectationFalse = 22` | Used by ExpectAsset, ExpectError, and ExpectOrigin if the expectation was not true.