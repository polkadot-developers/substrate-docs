---
title: Substrate Connect browser extension
description: Why and how to download the Substrate Connect browser extension.
keywords:
---

Substrate connect provides a way to interact with [substrate](https://substrate.dev/) based blockchains in the browser without using an RPC server.
Substrate connect uses a [smoldot](https://github.com/paritytech/smoldot/) WASM light client to securely connect to the blockchain network without relying on specific 3rd parties.

Due to browser limitations on websockets from https pages, establishing a good number of peers is difficult as many nodes need to be available with TLS.
Substrate Connect provides a browser extension to overcome this limitation and to keep the chains synced in the background, which makes your apps faster.

When building an app with Substrate Connect, it will detect whether the user has the extension and use it, or create the WASM light client in-page for them.
Although optional, the extension allows for a few optimizations, namely:

- Better resource usage: multiple browser tabs can share a single connection to the same chain, instead of each opening their own connection.
- Better synchronization speed: the browser extension automatically starts synchronizing the chain when the browser starts, and holds a cache which lets it do so faster.
  When a browser tab wants to connect to a chain, and the browser extension is installed, it is frequent that the chain connection and synchronization is instantaneous.
  Without this browser extension, synchronizing a chain can take from 10 to 30 seconds.
- Better connectivity, as the extension has the possibility to connect to nodes that don’t have a TLS certificate in front of them.

The first step of the tutorial is to install the extension in either Firefox or Chrome:
- Chrome: https://chrome.google.com/webstore/detail/substrate-connect-extensi/khccbhhbocaaklceanjginbdheafklai
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/substrate-connect/
