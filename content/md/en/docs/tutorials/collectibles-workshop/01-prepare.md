---
title: Prepare a working environment
description:
tutorial: 1
---

To get the most out of this workshop, you'll want to have a working development environment.
To make sure you have everything you need, review this preflight checklist.
If you discover something's missing, click the corresponding link.

You can complete this workshop without setting up a local working environment if you use the [Substrate Playground](https://substrate.io/developers/playground/).
However, if you use the Substrate Playground, the changes you make aren't saved when you end a session.
If you use Substrate Playground, you can skip this checklist and go directly to [Get oriented](/tutorials/collectibles-workshop/02-orientation/), but be sure to save copies of the files you edit!

The instructions in the workshop assume you are working in a local environment.

## Supported operating system

To set up a local development environment, you must have one of the following supported operating systems:

- [ ] Linux distribution
- [ ] macOS
- [ ] Windows Subsystem for Linux

## Rust programming language and toolchain

Substrate is built using Rust, a modern type sound programming language.
The Rust compiler minimizes the chances of errors getting into your code and produces binaries that run on most operating systems and WebAssembly targets.

- [ ] Rust is installed locally or available in the browser using the Substrate playground.

  If you aren't sure, open a terminal and run `rustup show`.
  If Rust isn't installed on your computer, follow the instructions in [Install](/install) for your operating system.
  The last step in the installation instructions is to verify that the default node template compiles.

- [ ] Substrate node compiles locally or is available in the browser using the Substrate playground.

If you're new to Rust, keep in mind that this workshop isn’t about _learning_ Rust.
However, for a brief introduction to a few important concepts, see [Detour: Learn Rust for Substrate](/tutorials/collectibles-workshop/detours/learn-rust/).

## Code editor

You'll need an editor for modifying files.
Ideally, you should select an integrated development environment (IDE) that provides syntax highlighting, automated code completion, and debugging features.
If you don't have a preferred IDE, Visual Studio Code is a good choice.

- [ ] [Visual Studio Code](https://code.visualstudio.com/download)

<!--Other common code editors include the following:

- [Sublime Text](https://www.sublimetext.com/)
- [Vim](https://www.vim.org/)
- [Atom](https://atom.io/)
-->

## Browser

To interact with the blockchain and test your work as you build the Substrate collectibles application, you'll need a browser-based application that can connect to the Substrate node.
For the workshop, you can connect to the node from the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/) if you have Chrome or a Chromium-based browser.

- [ ] [Google Chrome](https://www.google.com/chrome/) or a Chromium-based browser, such as [Brave](https://brave.com/download/), [Microsoft Edge](https://www.microsoft.com/en-us/edge?ep=79&form=MA13KE&es=23), [Opera](https://www.opera.com/download), or [Vivaldi](https://vivaldi.com/download/).

If you use a more restrictive browser—such as Firefox—you might find that connections between the Polkadot/Substrate Portal and the node are blocked for security or privacy reasons.

If your browser blocks connections, clone the [polkadot-js/apps](https://github.com/polkadot-js/apps) repository and run it locally.
For help setting up the Polkadot/Substrate Portal to run locally, see [Detour: Set up Polkadot/Substrate Portal](/tutorials/collectibles-workshop/detours/set-up-app-locally/).

## Front-end libraries

To make Substrate collectibles a user-facing application, you'll want tools for building at least a rudimentary user interface.

- [ ] [Node.js](https://nodejs.org/en/download/) and the package manager `npm`
- [ ] [Yarn package manager](https://yarnpkg.com/)
- [ ] [TypeScript](https://www.typescriptlang.org/)
- [ ] Basic UI/UX framework, such as React, Vue, Bootstrap, or Angular.

For help selecting front-end libraries see [Detour: Select front-end tools](/tutorials/collectibles-workshop/detours/select-ui-tools/).

## Node template

To complete the workshop, you must have access to a Substrate node.
If you are setting up a local development environment, you can download and compile the Developer Hub [substrate-node-template](https://github.com/substrate-developer-hub/substrate-node-template/tags/) as described in the [Quick start](/quickstart/).

The `substrate-node-template` repository provides is a snapshot of the main Substrate `node-template` binary and includes everything you need to get started with a functional node and a core set of features.
