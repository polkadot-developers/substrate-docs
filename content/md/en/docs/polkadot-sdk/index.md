---
title: Polkadot SDK
description:
keywords:
  - polkadot-sdk
---


## Substrate to Polkadot SDK

In [May
2023](https://forum.polkadot.network/t/psa-parity-is-currently-working-on-merging-the-polkadot-stack-repositories-into-one-single-repository/2883),
Parity Technologies started moving the three repositories that contained
[`substrate`](https://github.com/paritytech/substrate),
[`polkadot`](https://github.com/paritytech/polkadot), and
[`cumulus`](https://github.com/paritytech/cumulus), formerly independent in development and
branding, under one new mono-repo called
[`polkadot-sdk`](https://github.com/paritytech/polkadot-sdk). Consequently, the [runtimes of the
Polkadot and Kusama relay chains, and their system chains](https://github.com/polkadot-fellows/runtimes) were moved to be maintained by the [Polkadot fellowship](polkadot-fellows.github.io/dashboard/).

This transition gave birth to a new vision in which these tools are seen from the lens of being part of `polkadot-sdk` while still being independently useful.

Most impacted in this transition is **Substrate**, and part of this impact is the gradual deprecation of
this website. The content on this website is no longer maintained and will be gradually moved to a
new home. Consider the [resources below](#alternative-resources) as primary sources of information.

> You may still access the old content of this website in the navbar, but be aware of the fact that some content might not be up to date.

Note that **this does not impact the development of Substrate as a framework**. Substrate, as a framework, is still being maintained with full steam as a part of `polkadot-sdk`, and retains its full ability to be used to build both [standalone blockchains](https://github.com/paritytech/polkadot-sdk-solochain-template), or [Polkadot powered parachains](https://github.com/paritytech/polkadot-sdk-parachain-template).

## Alternative Resources

Below, you can find a number of replacement resources to learn more about Polkadot SDK:

- [Polkadot Wiki](https://wiki.polkadot.network/docs/build-guide)
- [Polkadot Developers](https://github.com/polkadot-developers/)
- [Polkadot Blockchain Academy](https://polkadot.com/blockchain-academy)
- Polkadot Ecosystem Documentation by Papermoon (Work in progress)
- [Polkadot SDK Rust Docs](https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/index.html)
