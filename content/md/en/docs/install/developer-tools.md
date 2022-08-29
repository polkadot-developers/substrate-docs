---
title: Developer tools
description:
keywords:
---

Because you are going to be writing code in Rust, be sure your development environment has the appropriate extensions and plug-ins for working with Rust.
As you begin working with the Substrate node template, you'll see that it includes a core set of features and tools specifically designed for runtime development.
However, there are also many other specialized tools available that you can install to complement and extend your development environment or to handle specific tasks.

A few of the tools you might find useful as you start developing a Substrate-based blockchain include the following:

- [Polkadot-JS API](https://polkadot.js.org/docs/api)
  The Polkadot-JS API provides a library of methods that enable you to query and interact with any Substrate-based chain using JavaScript. 
  You can add the `@polkadot/api `package to any JavaScript or TypeScript working environment.
  Most of the interfaces exposed by the API are generated dynamically by connecting to a running node.
  Because the configuration of the node determines which interfaces are exposed, you can use the API to work with customized chains that implement different features.
  To work with the API, you must identify the URL for the chain to connect to. 
  After connecting to a node for the chain, the API collects information about the chain state and its features, then populates the API with methods based on the information collected about that specific chain.

- [Front-end template](https://github.com/substrate-developer-hub/substrate-front-end-template)
   
   The Substrate front-end template provides a predefined front-end application that you can use to connect to a Substrate node back-end with minimal configuration. 
  The template enables you to start experimenting with the basic features of a Substrate node without building your own custom user interface.
  The template is built using the Create React App and the Polkadot-JS API.
  
- subxt
- sidecar
- Subscan

You might also want to explore community projects listed in [Awesome Substrate](https://github.com/substrate-developer-hub/awesome-substrate).

For an overview of some of the most commonly-used tools, see [command-line tools](/reference/command-line-tools/).

## Where to go next

- [Command-line tools](/reference/command-line-tools/)
- [node-template](/reference/command-line-tools/node-template/)
- [subkey](/reference/command-line-tools/subkey/)
- [try-runtime](/reference/command-line-tools/try-runtime/)
