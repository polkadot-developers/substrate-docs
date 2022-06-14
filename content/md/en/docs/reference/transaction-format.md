---
title: Transaction formats
description:
keywords:
---

This article describes in detail what the format of signed and unsigned transactions in Substrate.
This is particularly useful for understanding how the transaction pool checks incoming transactions.
Parachain builders will find this useful for customizing how their transactions are formatted as well as writing client applications that need to adhere to a chosen format.

Extrinsics normally contain a signature, some data to describe if the extrinsic has passed some validity checks and a reference to the pallet and call that it is intended for.
This format provides a way for applications to ensure the requirements for an extrinsic are met and correctly constructed.

- Unchecked: signed transactions that require some validation check before they can be accepted in the transaction pool.
  Any unchecked extrinsic contains the signature for the data being sent plus some extra data.
- Checked: inherent extrinsics which by definition don't require signature verification.
  Instead, they carry information on where the extrinsic comes from and some extra data.
- Opaque: used for cases when an extrinsic hasn't yet been committed to a format but can still be decoded.

Extra data can be any additional information that would be useful to attach to a transaction or inherent.
For example, the nonce of the transaction, the tip for the block author, or how long the extrinsic is valid for.
This information is provided by a [specialized extensions](#signed-extensions) that help determine the validity and ordering of extrinsics before they get included in a block.

A signed transaction might be constructed like so:

```rust
node_runtime::UncheckedExtrinsic::new_signed(
		function.clone(),                                      // some call
		sp_runtime::AccountId32::from(sender.public()).into(), // some sending account
		node_runtime::Signature::Sr25519(signature.clone()),   // the account's signature
		extra.clone(),                                         // the signed extensions
	)
```

## How transactions are constructed

Substrate defines its transaction formats generically to allow developers to implement custom ways to define valid transactions.
In a runtime built with FRAME however (assuming transaction version 4), a transaction must be constructed by submitting the following encoded data:

`<signing account ID> + <signature> + <additional data>`

When submitting a signed transaction, the signature is constructed by signing:

- The actual call, composed of:
  - The index of the pallet.
  - The index of the function call in the pallet.
  - The parameters required by the function call being targeted.
- Some extra information, verified by the signed extensions of the transaction:
  - What's the era for this transaction, i.e. how long should this call last in the transaction pool before it gets discarded?
  - The nonce, i.e. how many prior transactions have occurred from this account?
    This helps protect against replay attacks or accidental double-submissions.
  - The tip amount paid to the block producer to help incentive it to include this transaction in the block.

Then, some additional data that's not part of what gets signed is required, which includes:

- The spec version and the transaction version.
  This ensures the transaction is being submitted to a compatible runtime.
- The genesis hash. This ensures that the transaction is valid for the correct chain.
- The block hash. This corresponds to the hash of the checkpoint block, which enables the signature to verify that the transaction doesn't execute on the wrong fork, by checking against the block number provided by the era information.

The SCALE encoded data is then signed (i.e. (`call`, `extra`, `additional`)) and the signature, extra data and call data is attached in the correct order and SCALE encoded, ready to send off to a node that will verify the signed payload.
If the payload to be signed is longer than 256 bytes, it is hashed just prior to being signed, to ensure that the size of the signed data does not grow beyond a certain size.

This process can be broken down into the following steps:

1. Construct the unsigned payload.
1. Create a signing payload.
1. Sign the payload.
1. Serialize the signed payload.
1. Submit the serialized transaction.

An extrinsic is encoded into the following sequence of bytes just prior to being hex encoded:

`[ 1 ] + [ 2 ] + [ 3 ] + [ 4 ]`

where:

- `[1]` contains the compact encoded length in bytes of all of the following data. Learn how compact encoding works using [SCALE](/reference/scale-codec/).
- `[2]` is a `u8` containing 1 byte to indicate whether the transaction is signed or unsigned (1 bit), and the encoded transaction version ID (7 bits).
- `[3]` if a signature is present, this field contains an account ID, an SR25519 signature and some extra data. If unsigned this field contains 0 bytes.
- `[4]` is the encoded call data. This comprises of 1 byte denoting the pallet to call into, 1 byte denoting the call to make in that pallet, and then as many bytes as needed to encode the arguments expected by that call.

The way applications know how to construct a transaction correctly is provided by the [metadata interface](/main-docs/build/application-dev/#metadata-system).
An application will know how to correctly encode a transaction by using the metadata types and transaction format.
If a call doesn't need to be signed, then the first bit in `[2]` will be 0 and so an application will know not to try decoding a signature.

**Example:**

Balances transfer from Bob to Dave: Bob sends `42` units to Dave.

[ TODO: polkadotjs apps screenshot ]

- Encoded call data: `0x050000306721211d5404bd9da88e0204360a1a9ab8b87c66c1bc2fcdd37f3c2222cc20a8`
- Encoded call hash: >
- Compact encoded length of encoded data: `2d02`

- Resulting extrinsic: `0x2d028400cebf28ce763780c72973e16ddb0b86c33f8868d37ef0eb95691b416f838e7e6201a05bdb6cdfaf0a7fa47b73eace5f3ad03d3395544210fb10a2c3d31865d4db587f45b71b185059411dd95c28943842748035bf089e553b1e5869d2bf599eaa82d5030000050000306721211d5404bd9da88e0204360a1a9ab8b87c66c1bc2fcdd37f3c2222cc20a8`

Submitting the resulting constructed extrinsic via RPC returns this decoded metadata:

```json
{
  dispatchInfo: {
    weight: 195,952,000
    class: Normal
    paysFee: Yes
  }
  events: [
    {
      phase: {
        ApplyExtrinsic: 1
      }
      event: {
        method: Withdraw
        section: balances
        index: 0x0508
        data: [
          5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
          125,000,141
        ]
      }
      topics: []
    }
    {
      phase: {
        ApplyExtrinsic: 1
      }
      event: {
        method: Transfer
        section: balances
        index: 0x0502
        data: [
          5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
          5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy
          42
        ]
      }
      topics: []
    }
    {
      phase: {
        ApplyExtrinsic: 1
      }
      event: {
        method: ExtrinsicSuccess
        section: system
        index: 0x0000
        data: [
          {
            weight: 195,952,000
            class: Normal
            paysFee: Yes
          }
        ]
      }
      topics: []
    }
  ]
  status: {
    InBlock: 0x6543a4d4b44f5acc9ad111f0218296f1da5a5493599431ce9eecb55ed0a4d3fb
  }
}
```

## Signed extensions

Substrate provides the concept of **signed extensions** to extend an extrinsic with additional data, provided by the [`SignedExtension`](https://paritytech.github.io/substrate/master/sp_runtime/traits/trait.SignedExtension.html) trait.

The transaction queue regularly calls signed extensions to keep checking that a transaction is valid before it gets put in the ready queue.
This is a useful safeguard for verifying that transactions won't fail in a block.
They are commonly used to enforce some validation, spam and replay protection logic needed by the transaction pool.

By default in FRAME, a signed extension can hold any of the following types:

- `AccountId`: to encode the sender's identity.
- `Call`: to encode the pallet call to be dispatched. This data is used to calculate transaction fees.
- `AdditionalSigned`: to handle any additional data to go into the signed payload. This makes it possible to attach any custom logic prior to dispatching a transaction.
- `Pre`: to encode the information that can be passed from before a call is dispatch to after it gets dispatched.

FRAME's [system pallet](https://paritytech.github.io/substrate/master/frame_system/) provides a set of [useful `SignedExtensions`](https://paritytech.github.io/substrate/master/frame_system/index.html#signed-extensions) out of the box.

### Practical examples

An important signed extension for validating transactions is `CheckSpecVersion`.  
It provides a way for the sender to provide the spec version as a signed payload attached to the transaction.
Since the spec version is already known in the runtime, the signed extension can perform a simple check to verify that the spec versions match.
If they don't, the transaction fail before it gets put in the transaction pool.

Other examples include the signed extensions used to calculate transaction priority.
These are:

- `CheckWeight`: sets the value for priority to `0` for all dispatch classes.
- `ChargeTransactionPayment`: calculates the overall priority, modifying the priority value accordingly.

The priority depends on the dispatch class and the amount of tip-per-weight or tip-per-length (whatever is more limiting) the sender is willing to pay.
Transactions without a tip use a minimal tip value of `1` for priority calculations to make sure that not all transactions end up having a priority of `0`.
The consequence of this is that "smaller" transactions are preferred over "larger" ones.

## Learn more

- Submit offline transactions using `tx-wrapper`
- Submit transactions using `sidecar`
- Learn how to configure transaction fees for your chain
