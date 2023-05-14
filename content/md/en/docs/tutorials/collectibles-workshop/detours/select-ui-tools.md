---
title: "Detour: Select front-end tools"
---

The following libraries use the [JSON-RPC API](https://github.com/paritytech/jsonrpsee) to enable applications to interact with Substrate nodes:

| Name | Description | Language
| :---- | :----------- | :-------- |
| [Chain API](https://github.com/paritytech/capi) | Provides a TypeScript toolkit for crafting interactions with Substrate-based chains. The toolkit includes FRAME utilities, a functional effect system, and a fluent API to facilitate multi-step, multi-chain interactions for end users without compromising performance or safety. You can use this toolkit in combination with popular front-end frameworks such as React.
| [Polkadot JS API](https://polkadot.js.org/docs/api) | Provides a Javascript library for building applications that can dynamically adapt to changes in a node—such as block explorers or chain-agnostic services—when interacting with Substrate-based chains. You can use this library in combination with popular front-end frameworks such as React. | Javascript |
| [Polkadot JS extension](https://polkadot.js.org/docs/extension/) | Provides an API for interacting with browser extensions and providers built with the Polkadot JS API. | Javascript |
| [Substrate Connect](/learn/light-clients-in-substrate-connect/) | Provides a library and a browser extension to build applications that connect directly to Substrate-based chains using an in-browser light client node. Substrate Connect enables you to build applications that connect to multiple chains, providing end users with a single experience if they use your application to interact with multiple chains. | Javascript |
