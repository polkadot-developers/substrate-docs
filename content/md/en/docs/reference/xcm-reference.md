---
title: XCM reference
description:
keywords:
  - XCM instructions
  - registers
  - types
  - errors
---

<div class="warning">
	<p>
	<strong>⚠️ WARNING:</strong> This page contains potentially outdated information. Reading it might still be useful, yet we suggest taking it with a grain of salt.
	</p>
	<p>
	 Please refer to the <a href="https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/polkadot_sdk/xcm/index.html">`polkadot-sdk-docs` crate</a> for the most up-to-date documentation on this topic.
	</p>
</div>

This section provides reference information for the cross-consensus message (XCM) format.

## Instructions

As you learned in [Cross-consensus communication](/learn/xcm-communication), the XCM executor is a program that executes an ordered set of instructions in a virtual machine running on the recipient consensus system.
It's worth noting that some instructions are dependent on other instructions.
The order in which instructions are listed in the `Instruction` enumeration reflects some of these dependencies.
For example, an asset must be added to the holding register before it can be deposited somewhere else.
In general, you also use a similar order for instructions when you construct a message to be sent to the receiving system.
However, for your convenience, this reference section lists the instructions in alphabetic order instead of the order in which they are defined.

### BuyExecution

Pays for the execution of the current message by removing assets from the holding register.
You must specify the `fees` parameter to identify the asset to remove from the holding register to pay execution fees.
You can also specify a `weight_limit` for the maximum fee to be purchased.
If the `weight_limit` you specify is lower than the estimated weight of the message, the XCM executor stops execution with the `TooExpensive` error.

| Parameter      | Description                                                                                                                                                                                                 |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fees`         | Specifies the assets to be removed from the holding register to pay transaction fees.                                                                                                                       |
| `weight_limit` | Specifies the maximum weight to be purchased to pay execution fees. If you don't specify a limit, the weight is treated as unlimited up to the maximum you specify to be removed from the holding register. |

The following example illustrates the settings for a BuyExecution instruction:

```text
{
  BuyExecution: {
    fees: {
      id: {
        Concrete: {
          parents: 0
          interior: Here
        }
      }
      fun: {
        Fungible: 1,000,000
      }
    }
    weightLimit: {
      Limited: 1,000,000
    }
  }
}
```

The following example illustrates using the instruction in a Rust program:

```rust
BuyExecution { fees, weight_limit } => {
    if let Some(weight) = Option::<u64>::from(weight_limit) {
        // pay for `weight` using up to `fees` of the holding register.
        let max_fee =
            self.holding.try_take(fees.into()).map_err(|_| XcmError::NotHoldingFees)?;
        let unspent = self.trader.buy_weight(weight, max_fee)?;
        self.holding.subsume_assets(unspent);
    }
    Ok(())
},
```

### ClaimAsset

Creates assets that are being held on behalf of the location identified in the origin register.
You must specify the `assets` parameter to identify the assets to be claimed.
The asset you specify must match exactly with the assets available to be claimed by the origin with the given `ticket`.
You must specify the `ticket` using the `MultiLocation` type.
The claim ticket for the asset is an abstract identifier to help locate the asset to be claimed.

| Parameter | Description                                                    |
| :-------- | :------------------------------------------------------------- |
| `assets`  | Specifies the assets to be claimed.                            |
| `ticket`  | Specifies a location to help identify the asset to be claimed. |

### ClearError

Clears the error register.
You can use this instruction to manually clear the last error from the error register.

### ClearOrigin

Clears the origin register.
You can use this instruction to ensure that later instructions cannot take over the authority of the original origin.
For example, if you have instructions that are being relayed from an untrusted source, as is often the case with ReserveAssetDeposited, you can use ClearOrigin to prevent the original origin from being used to execute the instruction.

The following example appends the ReserveAssetDeposited and ClearOrigin instructions to an existing message:

```rust
let mut message = vec![ReserveAssetDeposited(assets), ClearOrigin];
message.extend(xcm.0.into_iter());
```

### DepositAsset

Subtracts the specified asset from the holding register and deposits on-chain equivalent assets under the ownership of the specified `beneficiary`.
You must specify the `assets` to remove using the `MultiAssetFilter` type.

| Parameter     | Description                                                                                                                                                                                                                                                                                                                                                                    |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets`      | Specifies the asset to remove from the holding register.                                                                                                                                                                                                                                                                                                                       |
| `max_assets`  | Specifies the maximum number of unique assets or asset instances to remove from the holding register. Only the first `max_assets` number of unique assets or asset instances that match the `assets` specified are removed, prioritized under standard asset ordering. If there are any additional unique assets or asset instances, they will remain in the holding register. |
| `beneficiary` | Specifies the new owner of the assets.                                                                                                                                                                                                                                                                                                                                         |

The following example illustrates a simple message that includes a DepositAsset instruction:

```rust
ParaA::execute_with(|| {
        let message = Xcm(vec![
            WithdrawAsset((Here, send_amount).into()),
            buy_execution((Here, send_amount)),
            DepositAsset { assets: All.into(), max_assets: 1, beneficiary: Parachain(2).into() },
        ]);
        // Send withdraw and deposit
        assert_ok!(ParachainPalletXcm::send_xcm(Here, Parent, message.clone()));
    });
```

### DepositReserveAsset

Removes the assets from the holding register and deposits on-chain equivalent assets into the sovereign account under the ownership of the destination.
This instruction also sends a follow-up message to destination of the ReserveAssetDeposited instruction with the given effects.

| Parameter     | Description                                                                                                                                                                                                                                                                                                                                                                    |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets`      | Specifies the asset to remove from the holding register.                                                                                                                                                                                                                                                                                                                       |
| `max_assets`  | Specifies the maximum number of unique assets or asset instances to remove from the holding register. Only the first `max_assets` number of unique assets or asset instances that match the `assets` specified are removed, prioritized under standard asset ordering. If there are any additional unique assets or asset instances, they will remain in the holding register. |
| `destination` | Specifies the location whose sovereign account will own the assets and thus the effective beneficiary for the assets and the notification target for the reserve asset deposit message.                                                                                                                                                                                        |
| `xcm`         | Specifies additional instructions to execute on the `destination` location following the ReserveAssetDeposited instruction.                                                                                                                                                                                                                                                    |

### DescendOrigin

Changes the origin to some interior location within the context of the current value in the origin register.

| Parameter  | Description                                                     |
| :--------- | :-------------------------------------------------------------- |
| `interior` | Specifies an interior location to place in the origin register. |

### ExchangeAsset

Reduces assets in the holding register up to the amount specified by the `give` parameter and increases assets in the holding register with a minimum amount of alternative assets specified by the receive parameter.

| Parameter | Description                                                                                                                                                                                                                                       |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `give`    | Specifies the assets to be removed from the holding register.                                                                                                                                                                                     |
| `receive` | Specifies the assets to be increased in the holding register. Any fungible assets specified for the `receive` parameter can be increased by an amount greater than expressed, but the holding register can't accrue assets not stated in receive. |

### HrmpChannelAccepted

Sends a notification message that an open channel request has been accepted by the recipient.
After sending this notification, the channel is opened when the relay chain session changes.
This message should originate directly on the relay chains and is intended to be sent by the relay chain to a parachain.

| Parameter   | Description                                                                                                         |
| :---------- | :------------------------------------------------------------------------------------------------------------------ |
| `recipient` | Specifies the parachain identifier for the recipient parachain that has accepted the previous open-channel request. |

### HrmpChannelClosing

Sends a message to notify a recipient that the sender who initiated the request to open a channel has decided to close the channel.
After sending this notification, the channel is closed when the relay chain session changes.
This message should originate directly on the relay chains and is intended to be sent by the relay chain to a parachain.

| Parameter   | Description                                                                                      |
| :---------- | :----------------------------------------------------------------------------------------------- |
| `initiator` | Specifies the parachain identifier for the parachain that initiated the channel close operation. |
| `sender`    | Specifies the parachain identifier of the sender side of the channel being closed.               |
| `recipient` | Specifies the parachain identifier of the receiver side of the channel being closed.             |

### HrmpNewChannelOpenRequest

Sends a request from a parachain to the relay chain to open a new channel for communication with another parachain.
Messages passed using the HRMP transport protocol are always routed through a relay chain.
This message should originate directly on the relay chains and is intended to be sent by the relay chain to a parachain.

| Parameter          | Description                                                                                   |
| :----------------- | :-------------------------------------------------------------------------------------------- |
| `sender`           | Specifies the sender in the to-be opened channel. Also, the initiator of the channel opening. |
| `max_message_size` | Specifies the maximum size of a message proposed by the sender.                               |
| `max_capacity`     | Specifies the maximum number of messages that can be queued in the channel.                   |

### InitiateReserveWithdraw

Reduces the value of the holding register by the assets and sends XCM instructions beginning with WithdrawAsset to a reserve location.

| Parameter | Description                                                                                                                                                                                                                                                                                                           |
| :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets`  | Specifies the assets to remove from the holding register.                                                                                                                                                                                                                                                             |
| `reserve` | Specifies a valid location that acts as a reserve for all specified assets. The sovereign account of this consensus system on the reserve location will have appropriate assets withdrawn and effects will be executed on them. There will typically be only one valid location on any given asset/chain combination. |
| `xcm`     | Specifies additional instructions to execute on the assets after they are withdrawn on the `reserve` location.                                                                                                                                                                                                        |

### InitiateTeleport

Removes the assets from the holding register and sends a message beginning with ReceiveTeleportedAsset instruction to a specified destination location.

NOTE: The destination location MUST respect the origin for the instruction as a valid teleportation origin for all assets.
If it does not, then the assets may be lost.

| Parameter     | Description                                                                                                                  |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------- |
| `assets`      | Specifies the assets to remove from the holding register.                                                                    |
| `destination` | Specifies a valid location that respects teleports coming from this location.                                                |
| `xcm`         | Specifies additional instructions to execute on the `destination` location following the ReceiveTeleportedAsset instruction. |

### QueryHolding

Sends a QueryResponse message with the assets value equal to the holding contents, or a portion thereof.

| Parameter             | Description                                                                                                |
| :-------------------- | :--------------------------------------------------------------------------------------------------------- |
| `query_id`            | Specifies the identifier for the query that is used for the `query_id` field of the QueryResponse message. |
| `destination`         | Specifies the location to where the QueryResponse message should be sent.                                  |
| `assets`              | Specifies a filter for the assets that should be reported back.                                            |
| `max_response_weight` | Specifies the value to be used for the `max_weight` field of the QueryResponse message.                    |

The following example illustrates a QueryHolding instruction that returns a QueryResponse with the identifier `query_id_set`:

```rust
ParaA::execute_with(|| {
	let message = Xcm(vec![
			QueryHolding {
				query_id: query_id_set,
				dest: Parachain(1).into(),
				assets: All.into(),
				max_response_weight: 1_000_000_000,
			},
	]);
});
```

### QueryResponse

Provides expected information from the origin.

| Parameter  | Description                                                                      |
| :--------- | :------------------------------------------------------------------------------- |
| `query_id` | Specifies the identifier for the query that resulted in this message being sent. |

| `response`: Expresses the content of the message that resulted from the query instruction.
| `max_weight` | Specifies the maximum weight that handling this response should take. If proper execution requires more weight than you specify, an error is returned. If the execution requires less than you specify, the difference might be added to the surplus weight register at run time.

The `Response` type is used to express information content in the `QueryResponse` XCM instruction.
Depending on the query, it can represent the following different data types:

- Null
- Assets { assets: MultiAssets }
- ExecutionResult { result: Result<(), (u32, Error)> }
- Version { version: Compact }

The following example illustrates checking that a `QueryResponse` message was received and the information in the response is a newly deposited asset:

```rust
ParaA::execute_with(|| {
	assert_eq!(
			parachain::MsgQueue::received_dmp(),
			vec![Xcm(vec![QueryResponse {
					query_id: query_id_set,
					response: Response::Assets(MultiAssets::new()),
					max_weight: 1_000_000_000,
			}])],
	);
});
```

### ReceiveTeleportedAsset

Accrues assets into the holding register equivalent to the assets removed from the current origin.
The origin must be trusted to have removed the assets as a consequence of sending this message.

| Parameter | Description                                                  |
| :-------- | :----------------------------------------------------------- |
| `assets`  | Specifies the assets that have been removed from the origin. |

### RefundSurplus

Increases the refunded weight register to the value of the surplus weight register.
This instruction enables fees previously paid using the BuyExecution instruction to be moved into holding register to match the amount added to the refunded weight register.

### ReportError

Reports the contents of the error register to the specified `destination` using XCM.
A QueryResponse message of type ExecutionOutcome is sent to the `destination` with the given `query_id` and the outcome of the XCM.

| Parameter             | Description                                                                             |
| :-------------------- | :-------------------------------------------------------------------------------------- |
| `query_id`            | Specifies the value to use for the `query_id` field of the QueryResponse message.       |
| `destination`         | Specifies the location to where the QueryResponse message should be sent.               |
| `max_response_weight` | Specifies the value to be used for the `max_weight` field of the QueryResponse message. |

### ReserveAssetDeposited

Adds derivative assets to the holding register to represent the assets received from the value in the origin register.
The origin must be trusted to act as a reserve for the assets.

| Parameter | Description                                                                                                               |
| :-------- | :------------------------------------------------------------------------------------------------------------------------ |
| `assets`  | Specifies the assets that have been received into the sovereign account of the local consensus system on from †he origin. |

### SetAppendix

Sets the appendix register.
The appendix register provides any code that should run after the current program completes execution.
After the current program ends successfully, or after an error where the Error Handler is empty, the appendix register is cleared and its contents are used to replace the programme register.
The estimated weight of this instruction must include the estimated weight of the `appendix` code.
At run-time,the surplus weight register should be increased by the estimated weight of the appendix prior to being changed.

| Parameter  | Description                                             |
| :--------- | :------------------------------------------------------ |
| `appendix` | : Xcm: The value to which to set the Appendix Register. |

### SetErrorHandler

Sets the error handler register.
The error handler register provides any code that should run if the program encounters an error.
After a program encounters an error, this register is cleared and its contents are used to replace the programme register.
The estimated weight of this instruction must include the estimated weight of the `error_handler` code.
At run-time, the surplus weight register should be increased by the estimated weight of the error handler prior to being changed.

| Parameter       | Description                                               |
| :-------------- | :-------------------------------------------------------- |
| `error_handler` | Specifies the value to set in the error handler register. |

### SubscribeVersion

Sends a QueryResponse message to Origin specifying XCM version in the response field.
Any upgrades to the local consensus that result in a later version of XCM being supported should elicit a similar response.

| Parameter             | Description                                                                             |
| :-------------------- | :-------------------------------------------------------------------------------------- |
| `query_id`            | Specifies the value to be used for the `query_id` field of the QueryResponse message.   |
| `max_response_weight` | Specifies the value to be used for the `max_weight` field of the QueryResponse message. |

### Transact

Dispatches the encoded call using the dispatch-origin for the call as expressed by the context you specify using the `origin_type` parameter.

| Parameter     | Description                                                                                                                                                                                                                                                                                                     |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `origin_type` | Specifies a context for expressing the message origin as a dispatch origin.                                                                                                                                                                                                                                     |
| `max_weight`  | Specifies the maximum amount of weight to expend while dispatching the encoded call. If the dispatch requires more weight than you specify, execution stops and an error is returned. If the dispatch requires less than you specify, the difference might be added to the surplus weight register at run time. |
| `call`        | Specifies the encoded transaction to execute on the receiving system.                                                                                                                                                                                                                                           |

### TransferAsset

Withdraws assets from the ownership of Origin and deposit equivalent assets under the ownership of beneficiary.

| Parameter     | Description                             |
| :------------ | :-------------------------------------- |
| `assets`      | Specifies the asset to be transferred.  |
| `beneficiary` | Specifies the new owner for the assets. |

### TransferReserveAsset

Withdraws assets from the ownership of the current origin and deposits equivalent assets under the ownership of the sovereign account for the destination.
This instruction also sends an additional message with ReserveAssetDeposited and any instructions specified with the `xcm` parameter to the specified destination.

| Parameter     | Description                                                                                                                                                                             |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets`      | Specifies the asset to be transferred.                                                                                                                                                  |
| `destination` | Specifies the location whose sovereign account will own the assets and thus the effective beneficiary for the assets and the notification target for the reserve asset deposit message. |
| `xcm`         | Specifies the instructions that should follow the ReserveAssetDeposited instruction, which is sent onwards to destination.                                                              |

The following example illustrates using the TransferReserveAsset instruction that contains a message with two additional instructions:

```rust
let mut message = Xcm(vec![TransferReserveAsset {
    assets,
    dest,
    xcm: Xcm(vec![
        BuyExecution { fees, weight_limit: Unlimited },
        DepositAsset { assets: Wild(All), max_assets, beneficiary },
    ]),
}]);
```

### Trap

Throws an error of type Trap.

| Parameter | Description                                                           |
| :-------- | :-------------------------------------------------------------------- |
| `id`      | Specifies the value to be used for the parameter of the thrown error. |

### UnsubscribeVersion

Cancels the effect of a previous SubscribeVersion instruction from Origin.

### WithdrawAsset

Removes the specified assets from the sending account on the local consensus system and adds them to the value in the holding register.

| Parameter | Description                                                                                                                        |
| :-------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `assets`  | Specifies the asset to remove from the sender. The asset must be owned by the must be owned by the account in the origin register. |

## Registers

Most XCVM registers can't be modified directly.
They are set to specific values to start and are only be manipulated by specific instructions, under certain circumstances, or according to certain rules.
The XCVM includes the following registers:

| Register          | Description                                                                                                                                                                                                                 |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Origin            | Stores the location for the authority the current program is running under.                                                                                                                                                 |
| Holding           | Stores the number of assets that exist under the control of the XCVM but have no on-chain representation.                                                                                                                   |
| Surplus weight    | Stores the overestimation of weight previously calculated.                                                                                                                                                                  |
| Refunded weight   | Stores the portion of surplus weight that has been refunded.                                                                                                                                                                |
| Programme         | Stores the set of XCM instructions currently executing. This register holds the complete message—the program—in cross-consensus virtual machine.                                                                            |
| Programme counter | Stores the instruction index for currently executing instruction. The value is incremented by one at the end of every successfully executed instruction. The register is reset to zero when the Programme register changes. |
| Error             | Stores information about the last known error during program execution.                                                                                                                                                     |
| Error handler     | Stores code that should run if there's an error.                                                                                                                                                                            |
| Appendix          | Stores code that should run after the current program ends.                                                                                                                                                                 |

## Origins

In some cases, you might want to manipulate the origin stored in the origin register to grant more or fewer permissions for performing specific operations or executing specific XCM instructions.
You can use the following origin types to manipulate how the origin for XCM instructions is interpreted.

| Origin type      | Description                                                                                                                                                                     |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Native           | Use the native dispatch origin representation for the sender in the local runtime framework. For most chains, this is the `Parachain` or `Relay` origin if coming from a chain. |
| SovereignAccount | Use the sovereign account of the sender. For most chains, this is the `Signed` origin.                                                                                          |
| Superuser        | Use the superuser account. Normal account can't use this origin and in many cases it isn't available for any account to use. For most chains, this is the `Root` origin.        |
| Xcm              | Use the XCM native origin and the `MultiLocation` encoded directly in the dispatch origin unchanged. For most chains, this is the `pallet_xcm::Origin::Xcm` type.               |

The implications of using different origins depend on the code you are calling.
Depending on your chain logic and permissions, you might not be able to generate the origin you want to use.
For example, most users can't generate the Superuser origin, but it's possible for the chain logic to do so.

The following example illustrates specifying the origin type in a Transact instruction:

```text
Transact {
	origin_type: OriginKind::SovereignAccount,
	require_weight_at_most: weight,
	call: call.encode().into(),
},
```

For additional examples of converting origins, see the [origin_conversion](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-builder/src/origin_conversion.rs) module.

## Errors

If the program executing XCM instructions encounters a problem, it stops execution and identifies the type of problem encountered with one of the following errors:

| Error type                       | Description                                                                                                                                                             |
| :------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Overflow = 0`                   | An instruction caused an arithmetic overflow.                                                                                                                           |
| `Unimplemented = 1`              | The instruction is intentionally unsupported.                                                                                                                           |
| `UntrustedReserveLocation = 2`   | The origin register doesn't contain a valid value for a reserve transfer notification.                                                                                  |
| `UntrustedTeleportLocation = 3`  | The origin register doesn't contain a valid value for a teleport notification.                                                                                          |
| `MultiLocationFull = 4`          | The `MultiLocation` value too large to descend further.                                                                                                                 |
| `MultiLocationNotInvertible = 5` | The `MultiLocation` value ascends more parents than the known number of ancestors of the local location.                                                                |
| `BadOrigin = 6`                  | The origin register doesn't contain a valid value for executing the instruction.                                                                                        |
| `InvalidLocation = 7`            | The location parameter is not a valid value for the instruction.                                                                                                        |
| `AssetNotFound = 8`              | The specified asset can't be found or isn't valid in the location specified for the instruction.                                                                        |
| `FailedToTransactAsset = 9`      | An asset transaction—for example, an instruction to withdraw or deposit an asset—failed. In most cases, this type of error is caused by problems with type conversions. |
| `NotWithdrawable = 10`           | The specified asset can't be withdrawn, potentially due to lack of ownership, asset availability, or permissions.                                                       |
| `LocationCannotHold = 11`        | The specified asset can't be deposited under the ownership of a particular location.                                                                                    |
| `ExceedsMaxMessageSize = 12`     | There was an attempt to send a message that exceeded the maximum message size supported by the transport protocol.                                                      |
| `DestinationUnsupported = 13`    | There was an attempt to send a message that can't be translated into a format supported by the destination.                                                             |
| `Transport = 14`                 | The destination is routable, but there's an issue with the transport mechanism.                                                                                         |
| `Unroutable = 15`                | The destination is known to be unroutable.                                                                                                                              |
| `UnknownClaim = 16`              | The claim specified for the ClaimAsset instruction isn't recognized or can't be found.                                                                                  |
| `FailedToDecode = 17`            | The function specified for the Transact instruction can't be decoded.                                                                                                   |
| `TooMuchWeightRequired = 18`     | The function specified for the Transact instruction might exceed the weight limit allowed.                                                                              |
| `NotHoldingFees = 19`            | The holding register doesn't contain any payable fees for the BuyExecution instruction to use.                                                                          |
| `TooExpensive = 20`              | The fees declared to purchase weight in the BuyExecution instruction are insufficient.                                                                                  |
| `Trap(u64) = 21`                 | Used by the Trap instruction to force an error intentionally. Its code is included.                                                                                     |
| `ExpectationFalse = 22`          | Used by ExpectAsset, ExpectError, and ExpectOrigin if the expectation was not true.                                                                                     |

Concrete identifiers uniquely identify a single asset through its location in a consensus system relative to the context where an instruction is executed.
