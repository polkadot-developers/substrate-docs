---
title: Session Keys
description:
keywords:
---

Substrate provides the [Session pallet](https://paritytech.github.io/substrate/master/pallet_session/index.html),
which allows validators to manage their session keys.

Session keys are "hot keys" that are used by validators to sign consensus-related messages. They are
not meant to be used as account keys that control funds and should only be used for their intended
purpose. They can be changed regularly; your Controller only needs to create new session keys by
signing a session's public key and broadcasting this certificate via an extrinsic. Session keys are also
defined generically and made concrete in the runtime.

To create a Session key, validator operators must attest that a key acts on behalf of their Stash
account (stake) and nominators. To do so, they create a new session keys by signing the key with their
Controller key. Then, they inform the chain that this key represents their Controller key by
publishing the Session certificate in a transaction on the chain.

## Implementation

Session keys are used by validators to sign consensus-related messages. [`SessionKeys`](https://paritytech.github.io/substrate/master/sp_session/trait.SessionKeys.html)
is a generic, indexable type that is made concrete in the runtime.

You can declare any number of Session keys. For example, the default Substrate node uses four. Other
chains could have more or fewer depending on what operations the chain expects its validators to
perform.

In practice, validators amalgamate all of the session public keys into a single object, sign the set
of public keys with a "Controller" account, and submit a transaction to register the keys on chain.
This on-chain registration links a validator _node_ with an _account_ that holds funds. As such,
that account can be credited with rewards or slashed based on the node's behavior.

The runtime declares what session keys will be implemented with the help of a macro. An
[example](https://paritytech.github.io/substrate/master/src/node_runtime/lib.rs.html#435-442):

```rust
impl_opaque_keys! {
    pub struct SessionKeys {
        pub grandpa: Grandpa,
        pub babe: Babe,
        pub im_online: ImOnline,
        pub authority_discovery: AuthorityDiscovery,
    }
}
```

The actual cryptographic curve that each key uses gets defined in `primitives`. For example,
[BABE's key uses sr25519](https://paritytech.github.io/substrate/master/src/sp_consensus_babe/lib.rs.html#44-47):

```rust
mod app {
	  use sp_application_crypto::{app_crypto, key_types::BABE, sr25519};
	  app_crypto!(sr25519, BABE);
}
```

Typically, these keys are also initially configured in the genesis state to launch your
chain with pre-established validators. You can see this demonstrated in
[Add trusted validators](/tutorials/get-started/trusted-network/).

### Strongly typed wrappers

The Session keys from a Substrate node could use the same cryptography, but serve _very_ different purposes
in your runtime logic. To prevent the wrong key being used for the wrong operation, strong
Rust types wrap these keys, keeping them incompatible with one another and ensuring they are only
used for their intended purpose.

## Generation and use

As a node operator, you can generate keys using the RPC call
[`author_rotateKeys`](https://paritytech.github.io/substrate/master/sc_rpc/author/trait.AuthorApi.html#tymethod.rotate_keys).
You will then need to register the new keys on chain using a [`session.setKeys`](https://paritytech.github.io/substrate/master/pallet_session/pallet/struct.Pallet.html#method.set_keys) transaction.

For increased security, session keys should be changed every session. This can be done by creating new session keys, putting the session public keys into an extrinsic, and applying this extrinsic on chain.

Since session keys are hot keys that must be kept online, the individual keys should **not** be used to
control funds. All the logic for handling session keys is in the Substrate client, primitives, and
Session pallet. If one of the Session keys is compromised, the attacker could commit slashable
behavior.

## Where to go next

- [Add trusted validators](/tutorials/get-started/trusted-network)
- [Session keys API](https://paritytech.github.io/substrate/master/sp_session/trait.SessionKeys.html)
- [`sp_application_crypto`](https://paritytech.github.io/substrate/master/sp_application_crypto/index.html)

