---
title: Privileged calls and origins
description:
keywords:
  - origins
---

<div class="warning">
  <strong>⚠️ WARNING:</strong> This page contains outdated information. Please refer to the <a href="https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/reference_docs/frame_origin/index.html">Rust docs</a> for the most up-to-date documentation on this topic.
</div>

The runtime origin is used by dispatchable functions to check where a call has come from.

## Raw origins

Substrate defines three raw origins which can be used in your runtime pallets:

```rust
pub enum RawOrigin<AccountId> {
	Root,
	Signed(AccountId),
	None,
}
```

- Root: A system level origin. This is the highest privilege level and can be thought of as the superuser of the runtime origin.

- Signed: A transaction origin. This is signed by some on-chain account's private key and includes the account identifier of the signer. This allows the runtime to authenticate the source of a dispatch and subsequently charge transaction fees to the associated account.

- None: A lack of origin. This needs to be agreed upon by the validators or validated by a module to
  be included.
  This origin type is more complex because it is designed to bypass certain runtime mechanisms.
  For example, this origin type might be used to allow validators to insert data directly into a block.

## Origin call

You can construct calls within your runtime with any origin. For example:

```rust
// Root
proposal.dispatch(system::RawOrigin::Root.into())

// Signed
proposal.dispatch(system::RawOrigin::Signed(who).into())

// None
proposal.dispatch(system::RawOrigin::None.into())
```

You can look at the source code of the [Sudo module](https://paritytech.github.io/substrate/master/pallet_sudo/index.html) for a practical implementation of this.

## Custom origins

In addition to the three core origin types, runtime developers are also able to define custom origins.
These can be used as authorization checks inside functions from specific modules in your runtime, or to define custom access-control logic around the sources of runtime requests.

Customizing origins allows runtime developers to specify valid origins depending on their runtime logic. For example, it may be desirable to restrict access of certain functions to special custom origins and authorize dispatch calls only from members of a [collective](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/collective). The advantage of using custom origins is that it provides runtime developers a way to configure privileged access over dispatch calls to the runtime.

## Next steps

### Learn more

- Learn about how origin is used in the [`#[pallet::call]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#call-palletcall-optional) macro.

### Examples

- View the [Sudo pallet](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/sudo) to see how it allows a user to call with `Root` and `Signed` origin.

- View the [Timestamp pallet](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/timestamp) to see how it validates an a call with `None` origin.

- View the [Collective pallet](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/collective) to see how it constructs a custom `Member` origin.

- View our recipe for creating and using a custom origin.

### References

- Visit the reference docs for the
  [`RawOrigin` enum](https://paritytech.github.io/substrate/master/frame_system/enum.RawOrigin.html).
