---
title: Prepare a working environment
description:
tutorial: 1
---

To get the most out of this workshop, you'll want to have a working development environment.
To make sure you have everything you need, review this preflight checklist.
If you discover something's missing, click the corresponding link.

It's possible to complete this workshop without setting up a local development environment through the [Substrate Playground](https://substrate.io/developers/playground/).
However, if you use the Substrate Playground, the changes you make aren't saved when you end a session.
The instructions in the workshop assume you are working in a local environment. 
If you use Substrate Playground, you can skip this checklist and go directly to [Get oriented](/02-orientation/), but be sure to save copies of the files you edit!

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
  If Rust isn't installed on your computer, follow the instructions in [Install](https://docs.substrate.io/install) for your operating system.
  The last step in the installation instructions is to verify that the default node template compiles.
<!--If you're using the Substrate playground, open a terminal and run `rustup show`.-->

-[ ] Substrate node compiles locally or is available in the browser using the Substrate playground.
<!-- Click **Start** to start the Substrate node in the terminal. -->
<!-- If you're using the Substrate playground, the node starts automatically after logging in -->
<!-- Maybe there’s a check and a “Yep, you’re set to go” notification -->

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

- [ ] [Google Chrome](https://www.google.com/chrome/) or a Chromium-based browser, such as [Brave](https://brave.com/download/), [Microsoft Edge](https://www.microsoft.com/en-us/edge), [Opera](https://www.opera.com/download), or [Vivaldi](https://vivaldi.com/download/).

If you use a more restrictive browser—such as Firefox—you might find that connections between the Polkadot/Substrate Portal and the node are blocked for security or privacy reasons.

If your browser blocks connections, clone the [polkadot-js/apps](https://github.com/polkadot-js/apps) repository and run it locally.
For help setting up the Polkadot/Substrate Portal to run locally, see [Detour: Set up Polkadot/Substrate Portal](/detours/set-up-app-locally/).

## Front-end libraries

To make Substrate collectibles a user-facing application, you'll want tools for building at least a rudimentary user interface.

- [ ] [Node.js](https://nodejs.org/en/download/) and the package manager `npm`
- [ ] [Yarn package manager](https://yarnpkg.com/)
- [ ] [TypeScript](https://www.typescriptlang.org/) 
- [ ] Basic UI/UX framework, such as React, Vue, Bootstrap, or Angular.

For help selecting front-end libraries see [Detour: Select front-end tools](/detours/select-ui-tools/).
